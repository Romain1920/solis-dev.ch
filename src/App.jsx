import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import logoDark from "../assets/solis-logo-dark.png";
import studioDisplay from "../assets/studio-display-light.png";
import { projects } from "./data/projects";

gsap.registerPlugin(useGSAP);

const contactHref =
  "mailto:info@solis.li?subject=Maquette%20interactive%20offerte";

const navItems = [
  { href: "#accueil", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#realisations", label: "Réalisations" },
];

const stackLayout = [
  { x: "0%", y: "22%", rotation: "-1.6deg", scale: 1, z: 5 },
  { x: "8%", y: "14%", rotation: "2.4deg", scale: 0.97, z: 4 },
  { x: "16%", y: "7%", rotation: "-4.5deg", scale: 0.94, z: 3 },
  { x: "24%", y: "1%", rotation: "3.8deg", scale: 0.91, z: 2 },
  { x: "32%", y: "-5%", rotation: "-2.2deg", scale: 0.88, z: 1 },
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

  useGSAP(
    () => {
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

          gsap.set(".underline-path", {
            strokeDasharray: 940,
            strokeDashoffset: reduceMotion ? 0 : 940,
          });
          gsap.set(".arrow-path", {
            strokeDasharray: 900,
            strokeDashoffset: reduceMotion ? 0 : 900,
          });

          if (reduceMotion) {
            gsap.set([...titleLines, ...screenshotInners], {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
            });
            return undefined;
          }

          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          timeline
            .from(titleLines, {
              autoAlpha: 0,
              y: 42,
              duration: 0.82,
              stagger: 0.09,
            })
            .to(
              ".underline-path",
              {
                strokeDashoffset: 0,
                duration: 0.72,
                ease: "power2.inOut",
              },
              "-=0.18"
            )
            .to(
              ".arrow-path",
              {
                strokeDashoffset: 0,
                duration: 1.08,
                ease: "power2.inOut",
              },
              "-=0.04"
            )
            .from(
              screenshotInners,
              {
                autoAlpha: 0,
                x: 86,
                y: 54,
                scale: 0.92,
                rotation: 6,
                duration: 0.72,
                stagger: 0.14,
              },
              "-=0.28"
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
            <span className="hero-title-line">en sites web et apps mobiles</span>
            <span className="hero-title-line hero-memory">
              dont les gens se souviennent.
              <HandDrawnUnderline />
            </span>
          </h1>
        </div>

        <HandDrawnArrow />
        <ScreenshotStack />
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
        pathLength="1"
        d="M20 44 C146 58 266 33 402 44 C554 57 706 28 880 40"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}

function HandDrawnArrow() {
  return (
    <svg className="hero-arrow" viewBox="0 0 430 250" aria-hidden="true">
      <path
        className="draw-path arrow-path"
        pathLength="1"
        d="M28 172 C86 86 182 64 238 122 C270 154 238 198 202 174 C166 150 192 82 272 82 C334 82 383 112 406 154 M360 124 C384 136 398 147 406 154 C386 156 363 157 340 162"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}

function ScreenshotStack() {
  return (
    <div className="hero-screenshot-stack" aria-label="Aperçus de projets SOLIS">
      {projects.map((project, index) => {
        const item = stackLayout[index];

        return (
          <figure
            className="screenshot-card"
            key={project.id}
            style={{
              "--stack-x": item.x,
              "--stack-y": item.y,
              "--stack-rotation": item.rotation,
              "--stack-scale": item.scale,
              zIndex: item.z,
            }}
          >
            <div className="screenshot-card-inner">
              <img src={project.image} alt={`Aperçu ${project.title}`} />
            </div>
          </figure>
        );
      })}
    </div>
  );
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
