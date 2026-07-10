import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { projects as solisProjects } from "../data/projects";
import { StudioDisplay } from "./StudioDisplay";
import "../editorial-home.css";
import "../split-editorial-home.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SPLIT_MOTION_QUERY =
  "(min-width: 820px) and (prefers-reduced-motion: no-preference)";
const DEFAULT_WHATSAPP_HREF = "https://wa.me/41798401663";

const HELLA_PROJECT = solisProjects.find(
  (project) => project.id === "ecommerce"
);
const HELLA_SLIDES = HELLA_PROJECT
  ? [
      {
        id: HELLA_PROJECT.id,
        title: HELLA_PROJECT.title,
        category: HELLA_PROJECT.category,
        src: HELLA_PROJECT.carouselSrc ?? HELLA_PROJECT.src,
      },
    ]
  : [];

function WhatsAppIcon() {
  return (
    <svg
      className="split-editorial-home__whatsapp-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.04 2C6.58 2 2.13 6.38 2.13 11.76c0 1.72.46 3.4 1.34 4.88L2 22l5.52-1.43a10.08 10.08 0 0 0 4.52 1.07c5.46 0 9.91-4.38 9.91-9.76S17.5 2 12.04 2Zm0 17.98c-1.45 0-2.87-.38-4.1-1.11l-.3-.18-3.28.85.88-3.13-.2-.32a8.05 8.05 0 0 1-1.25-4.33c0-4.46 3.7-8.09 8.25-8.09s8.25 3.63 8.25 8.09-3.7 8.22-8.25 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.12-.17.25-.65.8-.8.97-.15.16-.3.18-.55.06-.25-.12-1.06-.38-2.02-1.23-.75-.65-1.25-1.45-1.4-1.7-.15-.24-.02-.38.11-.5.12-.12.25-.3.38-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.33-.77-1.82-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.84-.87 2.05s.9 2.38 1.02 2.55c.13.16 1.77 2.65 4.28 3.71.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.59 1.68-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

function EmptyFormState() {
  return (
    <div className="split-editorial-home__empty-form">
      <span>MAQUETTE OFFERTE</span>
      <strong>Parlez-nous de votre projet.</strong>
      <p>Le formulaire de demande sera affiché ici.</p>
    </div>
  );
}

export default function SplitEditorialHomeExperience({
  className = "",
  formAnchorId = "maquette-offerte",
  onMaquetteCtaClick,
  renderForm,
  supportCopy =
    "Agence de développement sur mesure pour la création de sites web et de boutiques e-commerce, ainsi que pour le développement d’applications mobiles pensées pour les PME, startups et boutiques en ligne en Suisse romande.",
  trustContent,
  whatsappHref = DEFAULT_WHATSAPP_HREF,
}) {
  const rootRef = useRef(null);
  const sourceAnchorRef = useRef(null);
  const destinationAnchorRef = useRef(null);
  const displayRef = useRef(null);
  const destinationCopyRef = useRef(null);
  const timelineRef = useRef(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(SPLIT_MOTION_QUERY, () => {
        const root = rootRef.current;
        const sourceAnchor = sourceAnchorRef.current;
        const destinationAnchor = destinationAnchorRef.current;
        const display = displayRef.current;
        const destinationCopy = destinationCopyRef.current;

        if (
          !root ||
          !sourceAnchor ||
          !destinationAnchor ||
          !display ||
          !destinationCopy
        ) {
          return undefined;
        }

        let travel = { x: 0, y: 0 };
        const measureTravel = () => {
          const sourceRect = sourceAnchor.getBoundingClientRect();
          const destinationRect = destinationAnchor.getBoundingClientRect();

          travel = {
            x: destinationRect.left - sourceRect.left,
            y: destinationRect.top - sourceRect.top,
          };
        };
        const travelX = (progress) => () => travel.x * progress;
        const travelY = (progress) => () => travel.y * progress;

        measureTravel();
        gsap.set(destinationCopy, { autoAlpha: 0, y: 24 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            id: "solis-split-display-travel",
            trigger: root,
            start: "top top",
            endTrigger: destinationAnchor,
            end: "top 40%",
            scrub: 1.2,
            invalidateOnRefresh: true,
            onRefreshInit: measureTravel,
          },
        });

        timelineRef.current = timeline;
        timeline.addLabel("departure", 0);
        timeline.fromTo(
          display,
          { x: 0, y: 0, scale: 1, autoAlpha: 1 },
          {
            x: travelX(0.04),
            y: travelY(0.3),
            scale: 1,
            duration: 0.3,
            ease: "sine.inOut",
            immediateRender: true,
          },
          "departure"
        );
        timeline.to(
          display,
          {
            x: travelX(0.34),
            y: travelY(0.66),
            scale: 1,
            duration: 0.35,
            ease: "sine.inOut",
          },
          0.3
        );
        timeline.to(
          display,
          {
            x: travelX(0.58),
            y: travelY(0.78),
            scale: 1,
            duration: 0.1,
            ease: "sine.inOut",
          },
          0.65
        );
        timeline.to(
          display,
          {
            x: travelX(1),
            y: travelY(1),
            scale: 1,
            duration: 0.25,
            ease: "power1.inOut",
          },
          0.75
        );
        timeline.to(
          destinationCopy,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.22,
            ease: "power1.out",
          },
          0.78
        );

        return () => {
          timelineRef.current = null;
        };
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    let cancelled = false;
    let refreshFrame;
    const queueRefresh = () => {
      if (cancelled) {
        return;
      }

      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = window.requestAnimationFrame(() => {
        if (!cancelled) {
          ScrollTrigger.refresh();
        }
      });
    };
    const pendingImages = Array.from(
      root.querySelectorAll("[data-editorial-display] img")
    ).filter((image) => !image.complete);

    pendingImages.forEach((image) => {
      image.addEventListener("load", queueRefresh, { once: true });
      image.addEventListener("error", queueRefresh, { once: true });
    });
    document.fonts?.ready.then(queueRefresh);
    window.addEventListener("orientationchange", queueRefresh);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(refreshFrame);
      pendingImages.forEach((image) => {
        image.removeEventListener("load", queueRefresh);
        image.removeEventListener("error", queueRefresh);
      });
      window.removeEventListener("orientationchange", queueRefresh);
    };
  }, []);

  const handleMaquetteClick = useCallback(
    (event) => {
      onMaquetteCtaClick?.({ event, formAnchorId });

      const scrollTrigger = timelineRef.current?.scrollTrigger;

      if (!scrollTrigger) {
        return;
      }

      event.preventDefault();
      const target = Math.max(scrollTrigger.start, scrollTrigger.end - 1);
      const distance = Math.abs(target - window.scrollY);

      if (lenis) {
        lenis.scrollTo(target, {
          duration: gsap.utils.clamp(2.1, 3.2, distance / 650),
          easing: (progress) => 0.5 - Math.cos(Math.PI * progress) / 2,
        });
        return;
      }

      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [formAnchorId, lenis, onMaquetteCtaClick]
  );

  const formContent =
    typeof renderForm === "function"
      ? renderForm({ variant: "inline", interactive: true })
      : renderForm ?? <EmptyFormState />;

  return (
    <div
      className={`editorial-home split-editorial-home${
        className ? ` ${className}` : ""
      }`}
      ref={rootRef}
    >
      <section
        className="split-editorial-home__hero"
        id="accueil"
        aria-labelledby="split-editorial-home-title"
      >
        <span
          className="split-editorial-home__ambient"
          aria-hidden="true"
        />

        <div className="split-editorial-home__intro">
          <h1
            className="split-editorial-home__title"
            id="split-editorial-home-title"
          >
            Création de sites web et développement d’applications mobiles
            pensés pour générer des résultats.
          </h1>

          <p className="split-editorial-home__support">{supportCopy}</p>

          <div className="split-editorial-home__actions">
            <a
              className="split-editorial-home__button split-editorial-home__button--whatsapp"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              <span>Nous écrire sur WhatsApp</span>
            </a>
            <a
              className="split-editorial-home__button split-editorial-home__button--primary"
              href={`#${formAnchorId}`}
              onClick={handleMaquetteClick}
            >
              <span>Recevoir ma maquette offerte</span>
              <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>

        <div
          className="split-editorial-home__source-anchor"
          ref={sourceAnchorRef}
          aria-hidden="true"
        />
      </section>

      <div className="split-editorial-home__display" ref={displayRef}>
        <StudioDisplay
          activeIndex={0}
          decorative
          loadedCount={HELLA_SLIDES.length}
          slides={HELLA_SLIDES}
        />
      </div>

      <div className="split-editorial-home__trust" data-editorial-trust>
        {trustContent}
      </div>

      <section
        className="split-editorial-home__offer"
        id={formAnchorId}
        aria-labelledby="split-editorial-offer-title"
      >
        <div className="split-editorial-home__offer-layout">
          <div
            className="split-editorial-home__destination-anchor"
            ref={destinationAnchorRef}
            aria-hidden="true"
          />

          <article
            className="split-editorial-home__offer-copy"
            ref={destinationCopyRef}
          >
            <span className="split-editorial-home__eyebrow">
              MAQUETTE OFFERTE
            </span>
            <h2 id="split-editorial-offer-title">
              Projetez-vous avant de vous engager.
            </h2>
            <p>
              Une maquette offerte, c’est un premier aperçu visuel sur mesure de
              votre futur site ou de votre application. Répondez à quelques
              questions&nbsp;: nous revenons vers vous sous 24 heures, puis
              préparons une première direction accompagnée d’un devis gratuit,
              sans engagement.
            </p>
            <ol className="split-editorial-home__steps">
              <li>
                <span>01</span>
                <div>
                  <strong>Décrivez votre projet</strong>
                  <small>Type de projet, budget et délai.</small>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Échangeons sous 24 h</strong>
                  <small>Objectifs, contenus et priorités.</small>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Découvrez votre maquette</strong>
                  <small>Une première direction et un devis gratuit.</small>
                </div>
              </li>
            </ol>
          </article>

          <div className="split-editorial-home__form">{formContent}</div>
        </div>
      </section>
    </div>
  );
}

