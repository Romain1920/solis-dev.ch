import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import logoDark from "../assets/solis-logo-dark.png";
import studioDisplay from "../assets/studio-display-light.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const contactHref =
  "mailto:info@solis.li?subject=Maquette%20interactive%20offerte";

const navItems = [
  { href: "#accueil", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#realisations", label: "Réalisations" },
];

const projects = [
  {
    id: "ecommerce",
    label: "Site e-commerce",
    color: "#ef6b3a",
    colorEnd: "#ffb077",
    ink: "#2e1209",
  },
  {
    id: "mobile",
    label: "Application mobile",
    color: "#75aef4",
    colorEnd: "#d7ebff",
    ink: "#0d253e",
  },
  {
    id: "metier",
    label: "Plateforme métier",
    color: "#4cbd91",
    colorEnd: "#c9ead8",
    ink: "#0c2a20",
  },
  {
    id: "institutionnel",
    label: "Site institutionnel",
    color: "#e86f62",
    colorEnd: "#f3ddd4",
    ink: "#321210",
  },
  {
    id: "saas",
    label: "Logiciel SaaS",
    color: "#8178f3",
    colorEnd: "#e0e1ff",
    ink: "#17153f",
  },
];

const heroStackRotations = [-2, -7, 1.5, 7, 12];

function App() {
  const activeSection = useActiveSection();

  useLenisScroll();

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

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

      <main id="contenu">
        <HeroScrollytelling />
      </main>
    </>
  );
}

function HeroScrollytelling() {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const overlayRef = useRef(null);
  const monitorScreenRef = useRef(null);
  const monitorContentRef = useRef(null);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const reducedMotion = usePrefersReducedMotion();
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const hero = heroRef.current;
      const overlay = overlayRef.current;
      const monitorScreen = monitorScreenRef.current;
      const monitorContent = monitorContentRef.current;
      const cards = cardsRef.current.filter(Boolean);

      if (!section || !hero || !overlay || !monitorScreen || !cards.length) {
        return undefined;
      }

      gsap.set(cards, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: (index) => heroStackRotations[index],
        transformOrigin: "50% 50%",
      });

      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });

      if (monitorContent) {
        gsap.set(monitorContent, {
          autoAlpha: reducedMotion ? 1 : 0,
          scale: reducedMotion ? 1 : 0.985,
        });
      }

      if (!reducedMotion) {
        gsap.from(cards, {
          autoAlpha: 0,
          x: 90,
          y: 46,
          scale: 0.92,
          rotation: (index) => heroStackRotations[index] + 9,
          duration: 0.82,
          stagger: 0.16,
          ease: "power3.out",
          delay: 0.18,
        });
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        if (reducedMotion) {
          return undefined;
        }

        let geometry = null;

        const measure = () => {
          const from = getLocalRect(cards[0], section);
          const to = getLocalRect(monitorScreen, section);

          geometry = {
            from,
            to,
            midX: from.x + (to.x - from.x) * 0.48 - 70,
            midY: from.y + (to.y - from.y) * 0.5,
            scaleX: to.width / from.width,
            scaleY: to.height / from.height,
          };

          gsap.set(overlay, {
            width: from.width,
            height: from.height,
            x: from.x,
            y: from.y,
            scaleX: 1,
            scaleY: 1,
            rotation: heroStackRotations[0],
            borderRadius: "30px",
            "--liquid-glow": 0,
          });
        };

        measure();

        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            endTrigger: monitorScreen,
            end: "center center",
            scrub: 0.9,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onRefresh: measure,
          },
        });

        timeline
          .to(
            cards.slice(1),
            {
              x: (_, target) => cards[0].offsetLeft - target.offsetLeft,
              y: (_, target) => cards[0].offsetTop - target.offsetTop,
              rotation: 0,
              scale: 0.95,
              autoAlpha: 0,
              duration: 0.2,
              stagger: 0.018,
            },
            0
          )
          .set(
            overlay,
            {
              autoAlpha: 1,
              x: () => geometry.from.x,
              y: () => geometry.from.y,
              width: () => geometry.from.width,
              height: () => geometry.from.height,
            },
            0.08
          )
          .to(cards[0], { autoAlpha: 0, duration: 0.12 }, 0.12)
          .to(
            overlay,
            {
              borderRadius: "42% 58% 54% 46% / 50% 42% 58% 50%",
              scaleX: 0.82,
              scaleY: 0.8,
              rotation: -4,
              skewX: -3,
              "--liquid-glow": 1,
              duration: 0.22,
            },
            0.2
          )
          .to(
            overlay,
            {
              x: () => geometry.midX,
              y: () => geometry.midY,
              scaleX: () => Math.max(geometry.scaleX * 0.82, 0.62),
              scaleY: () => Math.max(geometry.scaleY * 0.86, 0.56),
              rotation: -1.5,
              skewX: 4,
              borderRadius: "48% 52% 62% 38% / 42% 56% 44% 58%",
              duration: 0.34,
              ease: "power1.inOut",
            },
            0.38
          )
          .to(
            overlay,
            {
              x: () => geometry.to.x,
              y: () => geometry.to.y,
              scaleX: () => geometry.scaleX,
              scaleY: () => geometry.scaleY,
              rotation: 0,
              skewX: 0,
              borderRadius: "18px",
              "--liquid-glow": 0.18,
              duration: 0.28,
              ease: "power2.inOut",
            },
            0.68
          )
          .to(
            monitorContent,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.08,
              ease: "power2.out",
            },
            0.9
          )
          .to(overlay, { autoAlpha: 0, duration: 0.08 }, 0.94);

        window.addEventListener("load", ScrollTrigger.refresh);

        return () => {
          window.removeEventListener("load", ScrollTrigger.refresh);
          timeline.kill();
        };
      });

      mm.add("(max-width: 899px)", () => {
        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(cards, { autoAlpha: 1, clearProps: "x,y,scale,skewX" });
        gsap.set(monitorContent, { autoAlpha: 1, scale: 1 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  return (
    <section className="project-story" id="accueil" ref={sectionRef}>
      <section className="hero" ref={heroRef} aria-labelledby="hero-title">
        <div className="section-wrap hero-layout">
          <div className="hero-copy">
            <h1 id="hero-title" className="hero-title">
              <span>On transforme vos projets</span>
              <span>en sites web et apps mobiles</span>
              <span className="hero-memory">
                dont les gens se souviennent.
                <HandDrawnUnderline />
              </span>
            </h1>
          </div>

          <HandDrawnArrow />

          <div className="hero-stage" aria-hidden="true">
            <div className="hero-card-stack">
              {projects.map((project, index) => (
                <div
                  className={`hero-stack-card hero-stack-card-${index}`}
                  key={project.id}
                  ref={(node) => {
                    cardsRef.current[index] = node;
                  }}
                >
                  <ProjectMiniScreen project={project} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProofMetrics />

      <PortfolioMonitor
        monitorContentRef={monitorContentRef}
        monitorScreenRef={monitorScreenRef}
        onImageLoad={() => ScrollTrigger.refresh()}
        onProjectSelect={setSelectedProjectId}
        selectedProject={selectedProject}
        selectedProjectId={selectedProjectId}
      />

      <div className="transition-overlay-card" ref={overlayRef} aria-hidden="true">
        <ProjectMiniScreen project={projects[0]} />
      </div>
    </section>
  );
}

function HandDrawnUnderline() {
  return (
    <svg
      className="hero-underline"
      viewBox="0 0 900 62"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="draw-path"
        pathLength="1"
        d="M22 39 C146 47 276 31 402 39 C562 49 690 28 878 37"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="18"
      />
    </svg>
  );
}

function HandDrawnArrow() {
  return (
    <svg
      className="hero-arrow"
      viewBox="0 0 360 210"
      aria-hidden="true"
    >
      <path
        className="draw-path"
        pathLength="1"
        d="M28 136 C76 78 148 72 204 112 C226 128 254 126 294 96 M258 72 C276 83 288 92 294 96 C276 101 258 108 240 119"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
    </svg>
  );
}

function ProjectMiniScreen({ project }) {
  return (
    <article
      className={`project-mini-screen project-mini-screen-${project.id}`}
      aria-label={project.label}
      style={{
        "--card-color": project.color,
        "--card-color-end": project.colorEnd,
        "--card-ink": project.ink,
      }}
    >
      <div className="mini-screen-frame">
        <div className="mini-screen-toolbar" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="mini-screen-preview" aria-hidden="true">
          <span />
          <span />
          <span />
          <b />
        </div>
      </div>
    </article>
  );
}

function ProjectScreenPreview({ project }) {
  return (
    <div
      className={`screen-project screen-project-${project.id}`}
      style={{
        "--card-color": project.color,
        "--card-color-end": project.colorEnd,
        "--card-ink": project.ink,
      }}
    >
      <div className="screen-project-inner">
        <span>{project.label}</span>
      </div>
    </div>
  );
}

function ProofMetrics() {
  return (
    <section className="proof-section" id="services" aria-label="Indicateurs de confiance">
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
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    let frame = 0;
    let started = false;

    const animate = () => {
      const duration = 1250;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));

        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        }
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [target]);

  return (
    <strong ref={ref}>
      {prefix}
      {formatMetricNumber(value)}
      {suffix}
    </strong>
  );
}

function PortfolioMonitor({
  monitorContentRef,
  monitorScreenRef,
  onImageLoad,
  onProjectSelect,
  selectedProject,
  selectedProjectId,
}) {
  return (
    <section className="portfolio-section" id="realisations" aria-labelledby="portfolio-title">
      <div className="section-wrap portfolio-layout">
        <div className="project-index">
          <p className="portfolio-kicker">Réalisations</p>
          <h2 id="portfolio-title">Sélection</h2>
          <div className="project-selector" aria-label="Sélection de projet">
            {projects.map((project) => (
              <button
                aria-pressed={selectedProjectId === project.id}
                className={selectedProjectId === project.id ? "is-selected" : undefined}
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                type="button"
              >
                {project.label}
              </button>
            ))}
          </div>
        </div>

        <div className="studio-display-shell" aria-label={`Aperçu ${selectedProject.label}`}>
          <div className="studio-display">
            <div className="studio-screen" ref={monitorScreenRef}>
              <div className="monitor-final-content" ref={monitorContentRef}>
                <ProjectScreenPreview project={selectedProject} />
              </div>
            </div>
            <img
              className="studio-display-image"
              src={studioDisplay}
              alt=""
              aria-hidden="true"
              onLoad={onImageLoad}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function useLenisScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    lenis.on("scroll", ScrollTrigger.update);
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
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

function getLocalRect(element, container) {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: elementRect.left - containerRect.left,
    y: elementRect.top - containerRect.top,
    width: elementRect.width,
    height: elementRect.height,
  };
}

function formatMetricNumber(value) {
  return new Intl.NumberFormat("fr-CH", {
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\u202f/g, " ");
}

export default App;
