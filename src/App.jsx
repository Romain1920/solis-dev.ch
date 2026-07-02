import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ReactLenis from "lenis/react";
import { projects } from "./data/projects";

gsap.registerPlugin(useGSAP);

const contactHref =
  "mailto:info@solis.li?subject=Maquette%20interactive%20offerte";

const navItems = [
  { href: "#accueil", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#projets", label: "Projets" },
];

const screenshotIntervalMs = 1500;

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 0.9 }}>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <Header />

      <main id="contenu">
        <Hero />
      </main>
    </ReactLenis>
  );
}

function Header() {
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Navigation principale">
        <a className="brand-mark" href="#accueil" aria-label="SOLIS Developpement">
          <SolisMark />
        </a>

        <div className="nav-links" aria-label="Sections">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
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

function Hero() {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          all: "(min-width: 0px)",
        },
        (context) => {
          const { reduceMotion } = context.conditions;
          const titleItems = gsap.utils.toArray(".hero-reveal");
          const arrowPath = heroRef.current?.querySelector(".arrow-path");

          if (arrowPath) {
            const length = arrowPath.getTotalLength();
            gsap.set(arrowPath, {
              strokeDasharray: length,
              strokeDashoffset: reduceMotion ? 0 : length,
            });
          }

          if (reduceMotion) {
            gsap.set(titleItems, { autoAlpha: 1, y: 0, scale: 1 });
            return undefined;
          }

          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          timeline
            .fromTo(
              titleItems,
              {
                autoAlpha: 0,
                filter: "blur(7px)",
                x: -18,
              },
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                x: 0,
                duration: 0.86,
                stagger: 0.07,
              }
            )
            .to(
              arrowPath,
              {
                strokeDashoffset: 0,
                duration: 0.82,
                ease: "power1.inOut",
              },
              0.42
            )
            .from(
              ".project-reel",
              {
                autoAlpha: 0,
                y: 18,
                scale: 0.92,
                duration: 0.58,
                stagger: 0.06,
              },
              0.46
            )
            .from(
              ".hero-request",
              {
                autoAlpha: 0,
                y: 18,
                duration: 0.52,
              },
              0.7
            );

          return undefined;
        }
      );

      return () => mm.revert();
    },
    { scope: heroRef }
  );

  return (
    <section
      className="hero-section"
      id="accueil"
      ref={heroRef}
      aria-labelledby="hero-title"
    >
      <div className="hero-shell">
        <h1 id="hero-title" className="hero-title">
          <span className="hero-line hero-reveal">
            On transforme <br className="mobile-only" />
            vos projets
          </span>
          <span className="hero-line hero-line-arrow hero-reveal">
            <HandDrawnArrow />
            <span>
              en sites webs <br className="mobile-only" />
              et en apps
            </span>
          </span>
          <span className="hero-line hero-line-reel hero-reveal">
            <span>
              mobiles <br className="mobile-only" />
              sur-mesure
            </span>
            <ProjectReel />
          </span>
          <span className="hero-line hero-reveal">dont les gens se souviennent</span>
        </h1>

        <a
          className="hero-request"
          href={`${contactHref}&body=Bonjour%2C%20j'aimerais%20demander%20un%20premier%20rendez-vous%20et%20une%20maquette%20sur%20mesure%20offerte%2C%20sans%20engagement.`}
          data-track="hero-maquette-offerte"
        >
          <span className="request-icon" aria-hidden="true">
            <span />
          </span>
          <span className="request-copy">
            <strong>Besoin de se projeter&nbsp;?</strong>
            <span>
              Demandez votre premier rendez-vous et votre maquette sur mesure offerte, sans engagement.
            </span>
            <small>☕ (Le café est offert.)</small>
          </span>
        </a>
      </div>
    </section>
  );
}

function ProjectReel() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const reelProjects = useMemo(
    () =>
      [
        projects.find((project) => project.id === "ecommerce"),
        projects.find((project) => project.id === "platform"),
        projects.find((project) => project.id === "saas"),
        projects.find((project) => project.id === "mobile-app"),
        projects.find((project) => project.id === "institutional"),
      ].filter(Boolean),
    []
  );

  useEffect(() => {
    if (reducedMotion || reelProjects.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % reelProjects.length);
    }, screenshotIntervalMs);

    return () => window.clearInterval(interval);
  }, [reducedMotion, reelProjects.length]);

  const currentProject = reelProjects[index % reelProjects.length];

  return (
    <span className="project-reel" aria-label="Aperçus de projets SOLIS">
      <span className="reel-slide" key={currentProject.id}>
        <img src={currentProject.src} alt="" aria-hidden="true" />
      </span>
    </span>
  );
}

function HandDrawnArrow() {
  return (
    <svg className="hero-arrow" viewBox="0 0 468 264" aria-hidden="true">
      <path
        className="arrow-path"
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

function SolisMark() {
  return (
    <svg viewBox="0 0 116 64" role="img" aria-label="SOLIS">
      <path
        d="M18 42 C28 25 45 16 60 16 C78 16 94 27 102 42"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M15 47 H105 M60 8 V1 M38 14 L31 4 M82 14 L89 4 M25 29 L13 22 M95 29 L107 22"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5"
      />
    </svg>
  );
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

export default App;
