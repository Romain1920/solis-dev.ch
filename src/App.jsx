import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoDark from "../assets/solis-logo-dark.png";
import studioDisplay from "../assets/studio-display-light.png";
import { projects } from "./data/projects";

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger);

const contactHref =
  "mailto:info@solis.li?subject=Maquette%20interactive%20offerte";

const navItems = [
  { href: "#accueil", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#realisations", label: "Réalisations" },
];

const stackLayout = [
  { x: "0%", y: "30%", rotation: "-1.2deg", scale: 1, z: 5 },
  { x: "4%", y: "18%", rotation: "1.8deg", scale: 0.97, z: 4 },
  { x: "7%", y: "6%", rotation: "-2.6deg", scale: 0.94, z: 3 },
  { x: "10%", y: "-6%", rotation: "2.6deg", scale: 0.91, z: 2 },
  { x: "13%", y: "-18%", rotation: "-1.6deg", scale: 0.88, z: 1 },
];

const decompressedStackLayout = [
  { x: "8px", y: "42px", rotation: "0deg" },
  { x: "-42px", y: "138px", rotation: "-4.4deg" },
  { x: "44px", y: "226px", rotation: "3.6deg" },
  { x: "-22px", y: "318px", rotation: "-2.6deg" },
  { x: "34px", y: "404px", rotation: "3.1deg" },
];

function App() {
  const activeSection = useActiveSection();

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <Header activeSection={activeSection} />

      <main id="contenu">
        <HomePage />
      </main>
    </>
  );
}

function Header({ activeSection }) {
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Navigation principale">
        <a className="brand" href="#accueil" aria-label="SOLIS Développement">
          <img src={logoDark} alt="SOLIS" />
        </a>

        <div className="nav-links" aria-label="Sections">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={activeSection === item.href ? "is-active" : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          className="nav-cta"
          href={`${contactHref}&body=Source%3A%20navigation`}
          data-track="navigation-contact"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <ProofMetrics />
      <PortfolioDisplay />
    </>
  );
}

function Hero() {
  const heroRef = useRef(null);
  const [stackReady, setStackReady] = useState(false);

  useGSAP(
    (context, contextSafe) => {
      const markStackReady = contextSafe(() => setStackReady(true));
      const mm = gsap.matchMedia();

      mm.add(
        {
          all: "(min-width: 0px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduceMotion } = context.conditions;
          const titleLines = gsap.utils.toArray(".hero-title-line");
          const screenshotInners = gsap.utils.toArray(".screenshot-card-inner");
          const drawPaths = gsap.utils.toArray(".draw-path");

          drawPaths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: reduceMotion ? 0 : length,
            });
          });

          if (reduceMotion) {
            gsap.set([...titleLines, ...screenshotInners], {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
            });
            markStackReady();
            return undefined;
          }

          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: markStackReady,
          });

          timeline
            .from(titleLines, {
              autoAlpha: 0,
              y: 24,
              duration: 0.46,
              stagger: 0.035,
            }, 0)
            .to(
              ".underline-path",
              {
                strokeDashoffset: 0,
                duration: 0.62,
                ease: "power1.inOut",
              },
              0.1
            )
            .to(
              ".arrow-path",
              {
                strokeDashoffset: 0,
                duration: 0.7,
                ease: "power1.inOut",
              },
              0.16
            )
            .from(
              screenshotInners,
              {
                autoAlpha: 0,
                x: 58,
                y: -96,
                scale: 0.9,
                rotation: -7,
                rotationX: -7,
                duration: (_, target) => {
                  const slot = Number(target.closest(".screenshot-card")?.dataset.stackSlot || 0);
                  return slot === 0 ? 0.65 : 0.72 + slot * 0.085;
                },
                transformOrigin: "50% 60%",
                ease: "back.out(1.12)",
              },
              0.04
            );

          return undefined;
        }
      );

      return () => mm.revert();
    },
    { scope: heroRef }
  );

  return (
    <section className="hero-section" id="accueil" ref={heroRef} aria-labelledby="hero-title">
      <div className="section-wrap hero-layout">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            <span className="hero-title-line">On transforme vos projets</span>
            <span className="hero-title-line">en sites web et apps</span>
            <span className="hero-title-line hero-memory">
              dont on se souvient.
              <HandDrawnUnderline />
            </span>
          </h1>
        </div>

        <HandDrawnArrow />
        <ScreenshotStack introComplete={stackReady} />
      </div>
    </section>
  );
}

function HandDrawnUnderline() {
  return (
    <svg
      className="hero-underline"
      viewBox="0 0 900 72"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="draw-path underline-path"
        d="M20 44 C146 58 266 33 402 44 C554 57 706 28 880 40"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
        strokeOpacity="0.94"
      />
    </svg>
  );
}

function HandDrawnArrow() {
  return (
    <svg className="hero-arrow" viewBox="0 0 468 264" aria-hidden="true">
      <path
        className="draw-path arrow-path"
        d="M6 226 C58 154 124 94 190 90 C225 88 249 99 256 124 C264 154 244 190 220 218 C200 242 181 236 181 212 C181 178 216 128 264 116 C319 102 379 134 438 188 M385 106 C409 128 428 154 438 188 M438 188 C410 187 380 188 354 188"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}

function ScreenshotStack({ introComplete }) {
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);
  const stageRef = useRef(null);
  const activeProjectIdRef = useRef(activeProjectId);
  const autoPausedRef = useRef(false);
  const manualPauseUntilRef = useRef(0);
  const flipTweenRef = useRef(null);
  const selectProjectRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const { contextSafe } = useGSAP({ scope: stageRef });

  const selectProject = contextSafe((projectId, options = {}) => {
    const isManual = options.manual === true;

    if (isManual) {
      manualPauseUntilRef.current = Date.now() + 9000;
    }

    if (projectId === activeProjectIdRef.current) {
      return;
    }

    const cards = getStackCards(stageRef.current);
    flipTweenRef.current?.kill();

    if (reducedMotion || !cards.length) {
      activeProjectIdRef.current = projectId;
      setActiveProjectId(projectId);
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    const state = Flip.getState(cards);
    activeProjectIdRef.current = projectId;

    flushSync(() => setActiveProjectId(projectId));

    const finishFlip = () => {
      flipTweenRef.current = null;
      gsap.set(getStackCards(stageRef.current), {
        clearProps: "transform,translate,rotate,scale",
      });
      ScrollTrigger.refresh();
    };

    flipTweenRef.current = Flip.from(state, {
      duration: 0.55,
      ease: "power3.inOut",
      stagger: 0.02,
      nested: true,
      scale: true,
      onComplete: finishFlip,
      onInterrupt: finishFlip,
    });
  });

  selectProjectRef.current = selectProject;

  useEffect(() => {
    activeProjectIdRef.current = activeProjectId;
  }, [activeProjectId]);

  useEffect(() => {
    if (!introComplete || reducedMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (autoPausedRef.current || Date.now() < manualPauseUntilRef.current) {
        return;
      }

      selectProjectRef.current?.(getNextProjectId(activeProjectIdRef.current));
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [introComplete, reducedMotion]);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const initialCards = getStackCards(stage);

      gsap.set(initialCards, {
        "--decompress-x": "0px",
        "--decompress-y": "0px",
        "--decompress-rotation": "0deg",
      });

      if (!stage || reducedMotion) {
        return undefined;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1081px)", () => {
        const cards = getStackCards(stage);

        gsap.set(cards, {
          "--decompress-x": "0px",
          "--decompress-y": "0px",
          "--decompress-rotation": "0deg",
        });

        if (!cards.length) {
          return undefined;
        }

        const heroSection = stage.closest(".hero-section");
        const proofSection = document.querySelector(".proof-section");

        if (!heroSection || !proofSection) {
          return undefined;
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: "top top+=120",
            endTrigger: proofSection,
            end: "top 72%",
            scrub: 0.75,
            pin: stage,
            pinSpacing: false,
            invalidateOnRefresh: true,
            refreshPriority: -5,
          },
        });

        timeline.to(
          cards,
          {
            "--decompress-x": (_, target) => getDecompressedStackValue(target, "x"),
            "--decompress-y": (_, target) => getDecompressedStackValue(target, "y"),
            "--decompress-rotation": (_, target) => getDecompressedStackValue(target, "rotation"),
            duration: 1,
            ease: "none",
          },
          0
        );

        return undefined;
      });

      return () => mm.revert();
    },
    { scope: stageRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  const pauseAutoRotation = () => {
    autoPausedRef.current = true;
  };

  const resumeAutoRotation = () => {
    autoPausedRef.current = false;
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      resumeAutoRotation();
    }
  };

  return (
    <div className="hero-screenshot-stage" ref={stageRef}>
      <div
        className="hero-screenshot-stack"
        aria-label="Aperçus de projets SOLIS"
        onBlur={handleBlur}
        onFocus={pauseAutoRotation}
        onMouseEnter={pauseAutoRotation}
        onMouseLeave={resumeAutoRotation}
      >
        {projects.map((project) => {
          const slot = getProjectStackSlot(project.id, activeProjectId);
          const item = stackLayout[slot] || stackLayout[0];
          const isFront = slot === 0;

          return (
            <button
              aria-label={`Afficher ${project.title}`}
              aria-pressed={isFront}
              className={`screenshot-card${isFront ? " is-front" : ""}`}
              data-flip-id={project.id}
              data-project-id={project.id}
              data-stack-slot={slot}
              key={project.id}
              onClick={() => selectProject(project.id, { manual: true })}
              style={{
                "--stack-x": item.x,
                "--stack-y": item.y,
                "--stack-rotation": item.rotation,
                "--stack-scale": item.scale,
                zIndex: item.z,
              }}
              type="button"
            >
              <span className="screenshot-card-inner">
                <img src={project.image} alt={`Aperçu ${project.title}`} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getStackCards(root) {
  return root ? Array.from(root.querySelectorAll(".screenshot-card")) : [];
}

function getProjectStackSlot(projectId, activeProjectId) {
  const activeIndex = projects.findIndex((project) => project.id === activeProjectId);
  const projectIndex = projects.findIndex((project) => project.id === projectId);

  if (activeIndex < 0 || projectIndex < 0) {
    return 0;
  }

  return (projectIndex - activeIndex + projects.length) % projects.length;
}

function getNextProjectId(projectId) {
  const projectIndex = projects.findIndex((project) => project.id === projectId);
  const nextIndex = projectIndex < 0 ? 0 : (projectIndex + 1) % projects.length;

  return projects[nextIndex].id;
}

function getDecompressedStackValue(target, key) {
  const slot = Number(target.dataset.stackSlot || 0);
  const item = decompressedStackLayout[slot] || decompressedStackLayout[0];

  return item[key];
}

function ProofMetrics() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const metrics = gsap.utils.toArray(".metric");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(metrics, { autoAlpha: 1, y: 0 });
        return undefined;
      }

      gsap.set(metrics, { autoAlpha: 0, y: 28 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          gsap.to(metrics, {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            ease: "power3.out",
            stagger: 0.08,
          });
          observer.disconnect();
        },
        { threshold: 0.28 }
      );

      observer.observe(sectionRef.current);

      return () => observer.disconnect();
    },
    { scope: sectionRef }
  );

  return (
    <section className="proof-section" id="services" ref={sectionRef} aria-label="Indicateurs de confiance">
      <div className="section-wrap proof-grid">
        <Metric>
          <Counter prefix="+" target={100} />
          <span>sites web et applications mobiles réalisés</span>
        </Metric>
        <Metric>
          <Counter prefix="+" target={7} suffix=" ans" />
          <span>d’expérience</span>
        </Metric>
        <Metric className="metric-founded">
          <strong>Fondée en 2019</strong>
          <span>en Valais, Suisse</span>
        </Metric>
        <Metric>
          <Counter prefix="+" target={500000} />
          <span>commandes générées en 2025 sur les sites e-commerce construits</span>
        </Metric>
      </div>
    </section>
  );
}

function Metric({ children, className = "" }) {
  return <p className={`metric ${className}`}>{children}</p>;
}

function Counter({ prefix = "", suffix = "", target }) {
  const counterRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(reducedMotion ? target : 0);

  useGSAP(
    (context, contextSafe) => {
      const node = counterRef.current;

      if (!node) {
        return undefined;
      }

      if (reducedMotion) {
        setValue(target);
        return undefined;
      }

      const counterState = { value: 0 };
      setValue(0);

      const runCounter = contextSafe(() => {
        gsap.to(counterState, {
          value: target,
          duration: 1.35,
          ease: "power3.out",
          onUpdate: () => setValue(Math.round(counterState.value)),
          onComplete: () => setValue(target),
        });
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            runCounter();
            observer.disconnect();
          }
        },
        { threshold: 0.42 }
      );

      observer.observe(node);

      return () => observer.disconnect();
    },
    { scope: counterRef, dependencies: [reducedMotion, target], revertOnUpdate: true }
  );

  return (
    <strong ref={counterRef}>
      {prefix}
      {formatMetricNumber(value)}
      {suffix}
    </strong>
  );
}

function PortfolioDisplay() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const containerRef = useRef(null);
  const previewRef = useRef(null);
  const hasAnimatedPreview = useRef(false);
  const reducedMotion = usePrefersReducedMotion();
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0];
  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(
    () => {
      const revealItems = gsap.utils.toArray(".portfolio-reveal");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(revealItems, { autoAlpha: 1, y: 0 });
        return undefined;
      }

      gsap.set(revealItems, { autoAlpha: 0, y: 34 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          gsap.to(revealItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            stagger: 0.12,
          });
          observer.disconnect();
        },
        { threshold: 0.22 }
      );

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      const preview = previewRef.current;

      if (!preview) {
        return undefined;
      }

      if (!hasAnimatedPreview.current || reducedMotion) {
        hasAnimatedPreview.current = true;
        gsap.set(preview, { autoAlpha: 1, scale: 1 });
        return undefined;
      }

      gsap.fromTo(
        preview,
        { autoAlpha: 0, scale: 1.012 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.38,
          ease: "power3.out",
        }
      );

      return undefined;
    },
    {
      scope: containerRef,
      dependencies: [selectedProjectId, reducedMotion],
      revertOnUpdate: false,
    }
  );

  const handleProjectSelect = contextSafe((projectId) => {
    if (projectId === selectedProjectId) {
      return;
    }

    if (reducedMotion || !previewRef.current) {
      setSelectedProjectId(projectId);
      return;
    }

    gsap.killTweensOf(previewRef.current);
    gsap.to(previewRef.current, {
      autoAlpha: 0,
      scale: 0.986,
      duration: 0.16,
      ease: "power1.in",
      onComplete: () => setSelectedProjectId(projectId),
    });
  });

  return (
    <section
      className="portfolio-section"
      id="realisations"
      ref={containerRef}
      aria-labelledby="portfolio-title"
    >
      <div className="section-wrap portfolio-layout">
        <div className="project-index portfolio-reveal">
          <p className="portfolio-kicker">Projets phares 2025–2026</p>
          <ProjectSelector
            onProjectSelect={handleProjectSelect}
            selectedProjectId={selectedProjectId}
          />
        </div>

        <div className="studio-display-shell portfolio-reveal">
          <div className="studio-display" aria-label={`Aperçu ${selectedProject.title}`}>
            <div className="studio-display-screen">
              <div className="monitor-preview" ref={previewRef}>
                <img src={selectedProject.image} alt={`Aperçu ${selectedProject.title}`} />
              </div>
            </div>
            <img
              className="studio-display-image"
              src={studioDisplay}
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectSelector({ onProjectSelect, selectedProjectId }) {
  return (
    <div className="project-selector" aria-label="Sélection de projet">
      {projects.map((project) => (
        <button
          aria-pressed={selectedProjectId === project.id}
          className={selectedProjectId === project.id ? "is-selected" : undefined}
          key={project.id}
          onClick={() => onProjectSelect(project.id)}
          type="button"
        >
          <span>{project.title}</span>
          <small>{project.category}</small>
        </button>
      ))}
    </div>
  );
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState("#accueil");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-38% 0px -48% 0px", threshold: [0.12, 0.32, 0.54] }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return activeSection;
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function formatMetricNumber(value) {
  return new Intl.NumberFormat("fr-CH", {
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\u202f/g, " ");
}

export default App;
