import { useEffect, useMemo, useRef, useState } from "react";
import {
  canUseLiquidGlassWebGL,
  createLiquidGlassRenderer,
  isLikelyLowEndDevice,
} from "./liquidGlass/createLiquidGlassRenderer";
import { getLiquidGlassPreset } from "./liquidGlass/presets";

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function getPointerFromEvent(event, element) {
  const rect = element.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
    y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
  };
}

export default function LiquidGlassButton({
  as,
  children,
  className,
  href,
  preset: presetName = "navContact",
  style,
  type,
  ...props
}) {
  const ButtonTag = as ?? (href ? "a" : "button");
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const [isFallback, setIsFallback] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const preset = useMemo(() => getLiquidGlassPreset(presetName), [presetName]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;

    if (!root || !canvas || typeof window === "undefined") {
      return undefined;
    }

    let disposed = false;
    let visible = true;
    let documentVisible = document.visibilityState === "visible";
    let resizeFrame = 0;
    let settleFrame = 0;
    let renderer = null;
    const pointer = {
      current: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
    };

    const cancelSettleFrame = () => {
      if (settleFrame) {
        window.cancelAnimationFrame(settleFrame);
        settleFrame = 0;
      }
    };

    const renderOnce = () => {
      if (!renderer || !visible || !documentVisible || disposed) return;
      renderer.render({
        pointer: pointer.current,
        reducedMotion,
      });
    };

    const resizeAndRender = () => {
      if (!renderer || disposed) return;

      const rect = root.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.resize({ width, height, dpr });
      renderOnce();
    };

    const scheduleResize = () => {
      if (resizeFrame) return;

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resizeAndRender();
      });
    };

    const settlePointer = () => {
      settleFrame = 0;

      if (!renderer || !visible || !documentVisible || disposed) return;

      const speed = reducedMotion ? 1 : 0.22;
      pointer.current.x += (pointer.target.x - pointer.current.x) * speed;
      pointer.current.y += (pointer.target.y - pointer.current.y) * speed;
      renderOnce();

      const delta =
        Math.abs(pointer.target.x - pointer.current.x) +
        Math.abs(pointer.target.y - pointer.current.y);

      if (!reducedMotion && delta > 0.006) {
        settleFrame = window.requestAnimationFrame(settlePointer);
      }
    };

    const scheduleSettle = () => {
      if (settleFrame || !visible || !documentVisible) return;
      settleFrame = window.requestAnimationFrame(settlePointer);
    };

    const updatePointer = (event) => {
      if (reducedMotion) {
        pointer.target = { x: 0, y: 0 };
      } else {
        pointer.target = getPointerFromEvent(event, root);
      }

      scheduleSettle();
    };

    const resetPointer = () => {
      pointer.target = { x: 0, y: 0 };
      scheduleSettle();
    };

    const handleVisibilityChange = () => {
      documentVisible = document.visibilityState === "visible";

      if (!documentVisible) {
        cancelSettleFrame();
        setIsFallback(true);
        return;
      }

      setIsFallback(false);
      scheduleResize();
      scheduleSettle();
    };

    if (isLikelyLowEndDevice() || !canUseLiquidGlassWebGL()) {
      setIsFallback(true);
      return undefined;
    }

    try {
      renderer = createLiquidGlassRenderer(canvas, preset);
      rendererRef.current = renderer;
      setIsFallback(false);
    } catch {
      setIsFallback(true);
      return undefined;
    }

    const resizeObserver = new ResizeObserver(scheduleResize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;

        if (!visible) {
          cancelSettleFrame();
          return;
        }

        scheduleResize();
        scheduleSettle();
      },
      { threshold: 0.01 }
    );

    resizeObserver.observe(root);
    intersectionObserver.observe(root);
    root.addEventListener("pointerenter", updatePointer);
    root.addEventListener("pointermove", updatePointer);
    root.addEventListener("pointerleave", resetPointer);
    root.addEventListener("pointercancel", resetPointer);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    scheduleResize();

    return () => {
      disposed = true;
      cancelSettleFrame();

      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }

      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      root.removeEventListener("pointerenter", updatePointer);
      root.removeEventListener("pointermove", updatePointer);
      root.removeEventListener("pointerleave", resetPointer);
      root.removeEventListener("pointercancel", resetPointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      renderer?.dispose();
      rendererRef.current = null;
    };
  }, [preset, reducedMotion]);

  const liquidGlassClassName = [
    className,
    "liquid-glass-button",
    `liquid-glass-button--${presetName}`,
    isFallback ? "is-liquid-glass-fallback" : "is-liquid-glass-webgl",
  ]
    .filter(Boolean)
    .join(" ");

  const buttonProps = {
    ...props,
    className: liquidGlassClassName,
    href: ButtonTag === "a" ? href : undefined,
    ref: rootRef,
    style: {
      "--liquid-glass-canvas-opacity": preset.opacity,
      ...style,
    },
  };

  if (ButtonTag === "button") {
    buttonProps.type = type ?? "button";
  }

  return (
    <ButtonTag {...buttonProps}>
      <canvas className="liquid-glass-button-canvas" ref={canvasRef} aria-hidden="true" />
      <span className="liquid-glass-button-content">{children}</span>
    </ButtonTag>
  );
}
