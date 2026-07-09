import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import aymericPortrait from "../../assets/team/aymeric-sarrasin.jpg";
import lyndonPortrait from "../../assets/team/lyndon-vouilloz.jpg";
import romainPortrait from "../../assets/team/romain-darioli.jpg";
import { projects as solisProjects } from "../data/projects";
import { StudioDisplay } from "./StudioDisplay";
import "../editorial-home.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DESKTOP_MOTION_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const PROJECT_ROTATION_DELAY_MS = 3600;
const SPLIT_PROJECT_ROTATION_DELAY_MS = 5000;
const DEFAULT_WHATSAPP_HREF = "https://wa.me/41798401663";
const DEFAULT_PROJECT_IDS = [
  "ecommerce",
  "mille-vadrouilles",
  "platform",
  "institutional",
  "le-fournil-de-melchior",
];

const DEFAULT_PROJECT_SLIDES = DEFAULT_PROJECT_IDS.map((projectId) =>
  solisProjects.find((project) => project.id === projectId)
)
  .filter(Boolean)
  .map((project) => ({
    id: project.id,
    title: project.title,
    category: project.category,
    src: project.carouselSrc ?? project.src,
  }));

const DEFAULT_TRUST_AVATARS = [
  { id: "romain", image: romainPortrait },
  { id: "aymeric", image: aymericPortrait },
  { id: "lyndon", image: lyndonPortrait },
];

const getResponsiveFormVariant = () => {
  if (typeof window === "undefined") {
    return "inline";
  }

  return window.matchMedia(DESKTOP_MOTION_QUERY).matches ? "studio" : "inline";
};

function WhatsAppIcon() {
  return (
    <svg
      className="editorial-home__whatsapp-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.04 2C6.58 2 2.13 6.38 2.13 11.76c0 1.72.46 3.4 1.34 4.88L2 22l5.52-1.43a10.08 10.08 0 0 0 4.52 1.07c5.46 0 9.91-4.38 9.91-9.76S17.5 2 12.04 2Zm0 17.98c-1.45 0-2.87-.38-4.1-1.11l-.3-.18-3.28.85.88-3.13-.2-.32a8.05 8.05 0 0 1-1.25-4.33c0-4.46 3.7-8.09 8.25-8.09s8.25 3.63 8.25 8.09-3.7 8.22-8.25 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.12-.17.25-.65.8-.8.97-.15.16-.3.18-.55.06-.25-.12-1.06-.38-2.02-1.23-.75-.65-1.25-1.45-1.4-1.7-.15-.24-.02-.38.11-.5.12-.12.25-.3.38-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.33-.77-1.82-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.84-.87 2.05s.9 2.38 1.02 2.55c.13.16 1.77 2.65 4.28 3.71.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.59 1.68-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

function DefaultTrustContent() {
  return (
    <div className="editorial-home__default-trust" aria-label="Preuve sociale">
      <div className="editorial-home__trust-avatars" aria-hidden="true">
        {DEFAULT_TRUST_AVATARS.map((avatar) => (
          <span className="editorial-home__trust-avatar" key={avatar.id}>
            <img src={avatar.image} alt="" loading="eager" decoding="async" />
          </span>
        ))}
      </div>
      <div className="editorial-home__trust-copy">
        <span aria-label="5 étoiles">★★★★★</span>
        <strong>Plus de 60 clients nous ont fait confiance</strong>
        <small>Avis Google vérifié</small>
      </div>
    </div>
  );
}

function EmptyFormState() {
  return (
    <div className="editorial-home__empty-form">
      <span>MAQUETTE OFFERTE</span>
      <strong>Parlez-nous de votre projet.</strong>
      <p>Le formulaire de demande sera affiché ici.</p>
    </div>
  );
}

/**
 * Editorial homepage hero and its scroll-linked conversion scene.
 *
 * `renderForm` is called once per render with
 * `{ variant: "studio" | "inline", interactive: boolean }`. Keeping a single
 * returned form component in this stable DOM position preserves its local state.
 */
export default function EditorialHomeExperience({
  className = "",
  experienceVariant = "current",
  formAnchorId = "maquette-offerte",
  onInternalNavigate,
  onMaquetteCtaClick,
  projectSlides,
  renderForm,
  supportCopy =
    "Agence de développement sur mesure pour la création de sites web et de boutiques e-commerce, ainsi que pour le développement d’applications mobiles pensées pour les PME, startups et boutiques en ligne en Suisse romande.",
  trustContent,
  whatsappHref = DEFAULT_WHATSAPP_HREF,
}) {
  const isSplitExperience = experienceVariant === "split";
  const rootRef = useRef(null);
  const sceneRef = useRef(null);
  const displayRef = useRef(null);
  const portfolioLayerRef = useRef(null);
  const formLayerRef = useRef(null);
  const veilRef = useRef(null);
  const timelineRef = useRef(null);
  const formInteractiveRef = useRef(getResponsiveFormVariant() === "inline");
  const [formVariant, setFormVariant] = useState(getResponsiveFormVariant);
  const [formInteractive, setFormInteractive] = useState(
    () => getResponsiveFormVariant() === "inline"
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(1);
  const lenis = useLenis();

  const slides = useMemo(
    () =>
      Array.isArray(projectSlides) && projectSlides.length > 0
        ? projectSlides
        : DEFAULT_PROJECT_SLIDES,
    [projectSlides]
  );

  const setFormAvailability = useCallback((isAvailable) => {
    if (formInteractiveRef.current === isAvailable) {
      return;
    }

    if (
      !isAvailable &&
      formLayerRef.current?.contains(document.activeElement) &&
      typeof document.activeElement?.blur === "function"
    ) {
      document.activeElement.blur();
    }

    formInteractiveRef.current = isAvailable;
    setFormInteractive(isAvailable);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MOTION_QUERY);
    const updateVariant = () => {
      const nextVariant = mediaQuery.matches ? "studio" : "inline";
      setFormVariant(nextVariant);
      setFormAvailability(nextVariant === "inline");
    };

    updateVariant();
    mediaQuery.addEventListener("change", updateVariant);

    return () => mediaQuery.removeEventListener("change", updateVariant);
  }, [setFormAvailability]);

  useEffect(() => {
    setActiveIndex(0);
    setLoadedCount(Math.min(1, slides.length));

    if (slides.length <= 1) {
      return undefined;
    }

    const preloadProject = (project) => {
      if (!project?.src) {
        return;
      }

      const image = new Image();
      image.decoding = "async";
      image.src = project.src;
    };

    const loadFirstBatch = () => {
      slides.slice(1, 3).forEach(preloadProject);
      setLoadedCount(Math.min(3, slides.length));
    };

    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(loadFirstBatch, { timeout: 1000 })
        : window.setTimeout(loadFirstBatch, 180);
    const remainingTimer = window.setTimeout(() => {
      slides.slice(3).forEach(preloadProject);
      setLoadedCount(slides.length);
    }, 2200);

    return () => {
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }

      window.clearTimeout(remainingTimer);
    };
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MOTION_QUERY);
    let intervalId;

    const stopRotation = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    const syncRotation = () => {
      stopRotation();

      if (!mediaQuery.matches) {
        return;
      }

      intervalId = window.setInterval(() => {
        if (!document.hidden) {
          setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
        }
      }, isSplitExperience
        ? SPLIT_PROJECT_ROTATION_DELAY_MS
        : PROJECT_ROTATION_DELAY_MS);
    };

    syncRotation();
    mediaQuery.addEventListener("change", syncRotation);

    return () => {
      stopRotation();
      mediaQuery.removeEventListener("change", syncRotation);
    };
  }, [isSplitExperience, slides.length]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(DESKTOP_MOTION_QUERY, () => {
        const root = rootRef.current;
        const scene = sceneRef.current;
        const display = displayRef.current;
        const portfolioLayer = portfolioLayerRef.current;
        const formLayer = formLayerRef.current;
        const veil = veilRef.current;
        const introElements = gsap.utils.toArray(
          "[data-editorial-intro]",
          root
        );
        const sideLinks = gsap.utils.toArray(
          "[data-editorial-side-link]",
          root
        );
        const introTitle = root?.querySelector("[data-editorial-title]");
        const introMeta = root?.querySelector("[data-editorial-meta]");
        const trust = root?.querySelector("[data-editorial-trust]");
        const conversion = root?.querySelector("[data-editorial-conversion]");
        const ambient = root?.querySelector("[data-editorial-ambient]");

        if (!root || !scene || !display || !portfolioLayer || !formLayer) {
          return undefined;
        }

        if (isSplitExperience) {
          const measureTravel = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const finalScale = gsap.utils.clamp(
              1.025,
              1.065,
              0.98 + viewportWidth / 24000
            );
            const displayHeight =
              display.offsetHeight || display.offsetWidth * (4160 / 5400);
            const trustTop = trust?.offsetTop || viewportHeight - 86;
            const desiredDrop = gsap.utils.clamp(
              52,
              96,
              viewportHeight * 0.105
            );
            const maximumTop =
              trustTop - displayHeight * finalScale - 28;
            const finalTop = Math.max(
              display.offsetTop,
              Math.min(display.offsetTop + desiredDrop, maximumTop)
            );
            const finalLeft = gsap.utils.clamp(
              38,
              86,
              viewportWidth * 0.042
            );
            const scaleOffsetX =
              ((finalScale - 1) * display.offsetWidth) / 2;
            const scaleOffsetY =
              ((finalScale - 1) * displayHeight) / 2;

            return {
              scale: finalScale,
              x: finalLeft - display.offsetLeft + scaleOffsetX,
              y: finalTop - display.offsetTop + scaleOffsetY,
            };
          };

          setFormAvailability(false);
          gsap.set(display, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            transformOrigin: "50% 50%",
          });
          gsap.set(introElements, { autoAlpha: 1, x: 0, y: 0 });
          gsap.set(portfolioLayer, {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            y: 0,
          });
          gsap.set(formLayer, {
            autoAlpha: 0,
            clipPath: "inset(9% 7% 9% 7%)",
            scale: 0.985,
            y: 20,
          });

          if (conversion) {
            gsap.set(conversion, { autoAlpha: 0, y: 26 });
          }

          if (trust) {
            gsap.set(trust, { autoAlpha: 1, y: 0 });
          }

          if (veil) {
            gsap.set(veil, { opacity: 0.1 });
          }

          const syncFormAvailability = (progress) => {
            setFormAvailability(progress >= 0.96);
          };
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "solis-editorial-home-split",
              trigger: root,
              start: "top top",
              end: () =>
                `+=${Math.max(
                  Math.round(window.innerHeight * 1.75),
                  1350
                )}`,
              pin: scene,
              pinSpacing: true,
              scrub: 1.2,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: (self) => syncFormAvailability(self.progress),
              onUpdate: (self) => syncFormAvailability(self.progress),
            },
          });

          timelineRef.current = timeline;
          timeline.addLabel("travel", 0);

          timeline.to(
            display,
            {
              x: () => measureTravel().x * 0.18,
              y: () => measureTravel().y * 0.32,
              scale: 1.005,
              duration: 0.7,
            },
            "travel"
          );

          timeline.to(
            display,
            {
              x: () => measureTravel().x * 0.58,
              y: () => measureTravel().y * 0.72,
              scale: () => 1 + (measureTravel().scale - 1) * 0.52,
              duration: 0.9,
            },
            "travel+=0.7"
          );

          timeline.to(
            display,
            {
              x: () => measureTravel().x,
              y: () => measureTravel().y,
              scale: () => measureTravel().scale,
              duration: 0.72,
            },
            "travel+=1.6"
          );

          if (ambient) {
            timeline.to(
              ambient,
              {
                autoAlpha: 0.62,
                xPercent: -1.2,
                scale: 1.025,
                duration: 1.9,
              },
              "travel+=0.1"
            );
          }

          if (veil) {
            timeline.to(
              veil,
              { opacity: 0.025, duration: 1.5 },
              "travel+=0.08"
            );
          }

          if (introMeta) {
            timeline.to(
              introMeta,
              {
                autoAlpha: 0,
                y: -12,
                duration: 0.48,
                ease: "power1.in",
              },
              "travel+=1.48"
            );
          }

          if (introTitle) {
            timeline.to(
              introTitle,
              {
                autoAlpha: 0,
                y: -14,
                duration: 0.5,
                ease: "power1.in",
              },
              "travel+=1.7"
            );
          }

          if (conversion) {
            timeline.to(
              conversion,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.42,
                ease: "power1.out",
              },
              "travel+=1.84"
            );
          }

          timeline.to(
            portfolioLayer,
            {
              autoAlpha: 0,
              clipPath: "inset(6% 4% 6% 4%)",
              y: -10,
              scale: 0.988,
              duration: 0.3,
              ease: "power1.in",
            },
            "travel+=1.98"
          );

          timeline.to(
            formLayer,
            {
              autoAlpha: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              scale: 1,
              duration: 0.38,
              ease: "power1.out",
            },
            "travel+=2.08"
          );

          timeline.to({}, { duration: 0.16 }, "travel+=2.46");

          return () => {
            timelineRef.current = null;
          };
        }

        setFormAvailability(false);
        gsap.set(display, {
          autoAlpha: 0.62,
          x: 0,
          y: 0,
          scale: 0.76,
          transformOrigin: "50% 50%",
        });
        gsap.set(portfolioLayer, {
          autoAlpha: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          y: 0,
        });
        gsap.set(formLayer, {
          autoAlpha: 0,
          clipPath: "inset(9% 7% 9% 7%)",
          scale: 0.985,
          y: 20,
        });
        if (conversion) {
          gsap.set(conversion, { autoAlpha: 0, y: 32 });
        }

        if (veil) {
          gsap.set(veil, { opacity: 0.64 });
        }

        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            id: "solis-editorial-home",
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight}`,
            pin: scene,
            pinSpacing: true,
            scrub: 0.72,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setFormAvailability(self.progress >= 0.82),
          },
        });

        timelineRef.current = timeline;
        timeline.addLabel("departure", 0);

        if (introElements.length > 0) {
          timeline.to(
            introElements,
            {
              autoAlpha: 0,
              y: -34,
              duration: 0.3,
              stagger: 0.018,
              ease: "power2.in",
            },
            "departure+=0.04"
          );
        }

        if (sideLinks.length > 0) {
          timeline.to(
            sideLinks,
            {
              autoAlpha: 0,
              x: (index) => (index === 0 ? -22 : 22),
              duration: 0.26,
              ease: "power2.in",
            },
            "departure+=0.06"
          );
        }

        if (trust) {
          timeline.to(
            trust,
            { autoAlpha: 0, y: 24, duration: 0.28, ease: "power2.in" },
            "departure+=0.08"
          );
        }

        if (ambient) {
          timeline.to(
            ambient,
            { autoAlpha: 0.48, xPercent: -2, scale: 1.045, duration: 0.62 },
            "departure+=0.1"
          );
        }

        timeline.to(
          display,
          {
            autoAlpha: 1,
            x: () => window.innerWidth * -0.205,
            y: () => window.innerHeight * 0.035,
            scale: 1.08,
            duration: 0.64,
          },
          "departure+=0.1"
        );

        if (veil) {
          timeline.to(
            veil,
            { opacity: 0.05, duration: 0.44, ease: "power1.inOut" },
            "departure+=0.16"
          );
        }

        timeline.addLabel("handoff", 0.5);
        timeline.to(
          portfolioLayer,
          {
            autoAlpha: 0,
            clipPath: "inset(7% 4% 7% 4%)",
            y: -12,
            scale: 0.985,
            duration: 0.25,
            ease: "power2.in",
          },
          "handoff"
        );

        if (conversion) {
          timeline.to(
            conversion,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
            },
            "handoff+=0.02"
          );
        }

        timeline.to(
          formLayer,
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            scale: 1,
            duration: 0.36,
            ease: "power2.out",
          },
          "handoff+=0.12"
        );

        return () => {
          timelineRef.current = null;
        };
      });

      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [isSplitExperience],
      revertOnUpdate: true,
    }
  );

  const handleMaquetteClick = useCallback(
    (event) => {
      onMaquetteCtaClick?.({ event, formAnchorId });

      const scrollTrigger = timelineRef.current?.scrollTrigger;

      if (!scrollTrigger) {
        return;
      }

      event.preventDefault();
      const target = Math.max(scrollTrigger.start, scrollTrigger.end - 1);

      if (lenis) {
        const distance = Math.abs(target - window.scrollY);
        lenis.scrollTo(target, {
          duration: isSplitExperience
            ? gsap.utils.clamp(1.9, 2.7, distance / 720)
            : 1.1,
          easing: isSplitExperience
            ? (progress) => 0.5 - Math.cos(Math.PI * progress) / 2
            : (progress) => 1 - Math.pow(1 - progress, 4),
        });
        return;
      }

      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [formAnchorId, isSplitExperience, lenis, onMaquetteCtaClick]
  );

  const handleInternalClick = useCallback(
    (event, href) => {
      if (!onInternalNavigate) {
        return;
      }

      event.preventDefault();
      onInternalNavigate({ event, href });
    },
    [onInternalNavigate]
  );

  const formContent =
    typeof renderForm === "function"
      ? renderForm({ variant: formVariant, interactive: formInteractive })
      : renderForm ?? <EmptyFormState />;

  return (
    <section
      className={`editorial-home editorial-home--${
        isSplitExperience ? "split" : "current"
      }${className ? ` ${className}` : ""}`}
      id="accueil"
      ref={rootRef}
      aria-labelledby="editorial-home-title"
    >
      <div className="editorial-home__scene" ref={sceneRef}>
        <span
          className="editorial-home__ambient"
          data-editorial-ambient
          aria-hidden="true"
        />

        <div className="editorial-home__intro">
          <h1
            className="editorial-home__title"
            id="editorial-home-title"
            data-editorial-intro
            data-editorial-title
          >
            <span>Création de sites web et</span>
            {" "}
            <span>développement d’applications</span>
            {" "}
            <span>mobiles pensés pour générer</span>
            {" "}
            <span>des résultats.</span>
          </h1>

          <div
            className="editorial-home__intro-meta"
            data-editorial-intro
            data-editorial-meta
          >
            <p>{supportCopy}</p>
            <div className="editorial-home__actions">
              <a
                className="editorial-home__button editorial-home__button--whatsapp"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                <span>Nous écrire sur WhatsApp</span>
              </a>
              <a
                className="editorial-home__button editorial-home__button--primary"
                href={`#${formAnchorId}`}
                onClick={handleMaquetteClick}
              >
                <span>Recevoir ma maquette offerte</span>
                <span aria-hidden="true">↘</span>
              </a>
            </div>
          </div>
        </div>

        {isSplitExperience && formVariant === "inline" ? (
          <div
            className="editorial-home__mobile-display-preview"
            aria-hidden="true"
          >
            <StudioDisplay
              activeIndex={activeIndex}
              decorative
              loadedCount={loadedCount}
              slides={slides}
            />
          </div>
        ) : !isSplitExperience ? (
          <>
            <a
              className="editorial-home__side-link editorial-home__side-link--left"
              href="/services"
              data-editorial-side-link
              onClick={(event) => handleInternalClick(event, "/services")}
            >
              <span>Services</span>
              <small>[ STUDIO ]</small>
            </a>
            <a
              className="editorial-home__side-link editorial-home__side-link--right"
              href="/portfolio"
              data-editorial-side-link
              onClick={(event) => handleInternalClick(event, "/portfolio")}
            >
              <span>Portfolio</span>
              <small>[ WORKS ]</small>
            </a>
          </>
        ) : null}

        <div className="editorial-home__trust" data-editorial-trust>
          {trustContent ?? <DefaultTrustContent />}
        </div>

        <span
          className="editorial-home__anchor"
          id={formAnchorId}
          aria-hidden="true"
        />

        <article
          className="editorial-home__conversion"
          data-editorial-conversion
          aria-labelledby="editorial-conversion-title"
        >
          <span className="editorial-home__eyebrow">MAQUETTE OFFERTE</span>
          <h2 id="editorial-conversion-title">
            Projetez-vous avant de vous engager.
          </h2>
          <p>
            Une maquette offerte, c’est un premier aperçu visuel sur mesure de
            votre futur site ou de votre application. Répondez à quelques
            questions&nbsp;: nous revenons vers vous sous 24 heures, puis
            préparons une première direction accompagnée d’un devis gratuit,
            sans engagement.
          </p>
          <ol className="editorial-home__steps">
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

        <div className="editorial-home__display-shell" ref={displayRef}>
          <StudioDisplay
            activeIndex={activeIndex}
            formContent={formContent}
            formInteractive={formInteractive}
            formLayerRef={formLayerRef}
            loadedCount={loadedCount}
            portfolioLayerRef={portfolioLayerRef}
            slides={slides}
            veilRef={veilRef}
          />
        </div>
      </div>
    </section>
  );
}
