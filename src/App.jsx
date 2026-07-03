import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import { projects } from "./data/projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const contactHref =
  "mailto:info@solis.li?subject=Maquette%20interactive%20offerte";

const navItems = [
  { href: "#accueil", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#projets", label: "Projets" },
];

const screenshotIntervalMs = 1500;

const metricProjectOrder = ["ecommerce", "saas", "platform", "mobile-app", "institutional"];

const metrics = [
  {
    id: "websites",
    value: "+100",
    descriptionLines: ["sites web et applications", "réalisés"],
    visual: "websites",
  },
  {
    id: "experience",
    value: "+10",
    descriptionLines: ["années d'expérience", "depuis notre création"],
    visual: "tech",
  },
  {
    id: "commerce",
    value: "500'000",
    descriptionLines: ["CHF générés sur les sites", "e-commerce réalisés en 2025"],
    visual: "commerce",
    variant: "commerce",
  },
];

const techLogos = [
  {
    name: "React",
    color: "#61DAFB",
    rotate: "-18deg",
    x: "-188%",
    y: "24%",
    z: 1,
    path: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z",
  },
  {
    name: "Next.js",
    color: "#000000",
    rotate: "-5deg",
    x: "-58%",
    y: "-12%",
    z: 6,
    path: "M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z",
  },
  {
    name: "Swift",
    color: "#F05138",
    rotate: "6deg",
    x: "-2%",
    y: "-10%",
    z: 5,
    path: "M7.508 0c-.287 0-.573 0-.86.002-.241.002-.483.003-.724.01-.132.003-.263.009-.395.015A9.154 9.154 0 0 0 4.348.15 5.492 5.492 0 0 0 2.85.645 5.04 5.04 0 0 0 .645 2.848c-.245.48-.4.972-.495 1.5-.093.52-.122 1.05-.136 1.576a35.2 35.2 0 0 0-.012.724C0 6.935 0 7.221 0 7.508v8.984c0 .287 0 .575.002.862.002.24.005.481.012.722.014.526.043 1.057.136 1.576.095.528.25 1.02.495 1.5a5.03 5.03 0 0 0 2.205 2.203c.48.244.97.4 1.498.495.52.093 1.05.124 1.576.138.241.007.483.009.724.01.287.002.573.002.86.002h8.984c.287 0 .573 0 .86-.002.241-.001.483-.003.724-.01a10.523 10.523 0 0 0 1.578-.138 5.322 5.322 0 0 0 1.498-.495 5.035 5.035 0 0 0 2.203-2.203c.245-.48.4-.972.495-1.5.093-.52.124-1.05.138-1.576.007-.241.009-.481.01-.722.002-.287.002-.575.002-.862V7.508c0-.287 0-.573-.002-.86a33.662 33.662 0 0 0-.01-.724 10.5 10.5 0 0 0-.138-1.576 5.328 5.328 0 0 0-.495-1.5A5.039 5.039 0 0 0 21.152.645 5.32 5.32 0 0 0 19.654.15a10.493 10.493 0 0 0-1.578-.138 34.98 34.98 0 0 0-.722-.01C17.067 0 16.779 0 16.492 0H7.508zm6.035 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z",
  },
  {
    name: "Kotlin",
    color: "#7F52FF",
    rotate: "-11deg",
    x: "-124%",
    y: "4%",
    z: 3,
    path: "M24 24H0V0h24L12 12Z",
  },
  {
    name: "Shopify",
    color: "#7AB55C",
    rotate: "18deg",
    x: "92%",
    y: "26%",
    z: 2,
    path: "M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z",
  },
  {
    name: "Fastify",
    color: "#000000",
    rotate: "12deg",
    x: "48%",
    y: "4%",
    z: 4,
    path: "M23.245 6.49L24 4.533l-.031-.121-7.473 1.967c.797-1.153.523-2.078.523-2.078s-2.387 1.524-4.193 1.485c-1.804-.04-2.387-.52-5.155.362-2.768.882-3.551 3.59-4.351 4.173-.804.583-3.32 2.477-3.32 2.477l.006.034 2.27-.724s-.622.585-1.945 2.37l-.062-.057.002.011s1.064 1.626 2.107 1.324a2.14 2.14 0 0 0 .353-.147c.419.234.967.463 1.572.525 0 0-.41-.475-.752-1.017l.238-.154.865.318-.096-.812c.003-.003.006-.003.008-.006l.849.311-.105-.738a5.65 5.65 0 0 1 .322-.158l.885-3.345 3.662-2.497-.291.733c-.741 1.826-2.135 2.256-2.135 2.256l-.582.22c-.433.512-.614.637-.764 2.353.348-.088.682-.107.984-.028 1.564.421 2.107 2.307 1.685 2.827-.104.13-.356.354-.673.617H7.77l-.008.514-.065.051h-.645l-.009.504-.17.127c-.607.011-1.373-.518-1.373-.518 0 .481.401 1.225.401 1.225l.07-.034-.061.045s1.625 1.083 2.646.681c.91-.356 3.263-2.213 5.296-3.093l6.15-1.62.811-2.1-4.688 1.235v-1.889l5.5-1.448.811-2.1-6.31 1.662V8.367zm-11.163 4l1.459-.384.02.074-.455 1.179-1.513.398zm.503 2.526l-1.512.398.489-1.266 1.459-.385.02.074zm1.971-.424l-1.513.398.49-1.266 1.459-.385.02.073Z",
  },
];

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 0.9 }}>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <Header />

      <main id="contenu">
        <Hero />
        <MetricsSection />
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

function MetricsSection() {
  const metricsRef = useRef(null);

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
          const metricItems = gsap.utils.toArray(".metric-item");

          if (reduceMotion) {
            gsap.set(metricItems, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            });
            return undefined;
          }

          gsap.fromTo(
            metricItems,
            {
              autoAlpha: 0,
              y: 72,
              scale: 0.96,
              filter: "blur(10px)",
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.72,
              ease: "power3.out",
              stagger: 0.09,
              scrollTrigger: {
                trigger: metricsRef.current,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            }
          );

          return undefined;
        }
      );

      return () => mm.revert();
    },
    { scope: metricsRef }
  );

  return (
    <section
      className="metrics-section"
      id="kpis"
      ref={metricsRef}
      aria-label="Chiffres clés SOLIS"
    >
      <div className="metrics-shell">
        {metrics.map((metric) => (
          <article
            className={
              metric.variant ? `metric-item metric-item--${metric.variant}` : "metric-item"
            }
            key={metric.id}
          >
            <div className="metric-visual" aria-hidden="true">
              <MetricVisual type={metric.visual} />
            </div>
            <div className="metric-copy">
              <strong className="metric-number">{metric.value}</strong>
              <span className="metric-description">
                {metric.descriptionLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MetricVisual({ type }) {
  if (type === "websites") {
    return <WebsiteCarouselVisual />;
  }

  if (type === "tech") {
    return <TechFanVisual />;
  }

  return <CommerceDashboardVisual />;
}

function WebsiteCarouselVisual() {
  const showcaseProjects = metricProjectOrder
    .map((projectId) => projects.find((project) => project.id === projectId))
    .filter(Boolean);
  const topRowProjects = showcaseProjects;
  const bottomRowProjects = showcaseProjects.slice().reverse();

  return (
    <div className="website-carousel">
      <WebsiteCarouselRow projects={topRowProjects} direction="top" />
      <WebsiteCarouselRow projects={bottomRowProjects} direction="bottom" />
    </div>
  );
}

function WebsiteCarouselRow({ projects: rowProjects, direction }) {
  return (
    <div className={`website-strip website-strip--${direction}`}>
      <div className="website-track">
        {[0, 1].map((groupIndex) => (
          <div
            className="website-track-set"
            key={`${direction}-set-${groupIndex}`}
            aria-hidden={groupIndex === 1 ? "true" : undefined}
          >
            {rowProjects.map((project) => (
              <span
                className="website-shot"
                key={`${direction}-${groupIndex}-${project.id}`}
              >
                <img src={project.src} alt="" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TechFanVisual() {
  return (
    <div className="tech-fan">
      {techLogos.map((tech) => (
        <span
          className="tech-card"
          key={tech.name}
          style={{
            "--tech-color": tech.color,
            "--tech-rotate": tech.rotate,
            "--tech-x": tech.x,
            "--tech-y": tech.y,
            "--tech-z": tech.z,
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={tech.path} />
          </svg>
        </span>
      ))}
    </div>
  );
}

function CommerceDashboardVisual() {
  const commerceProject = projects.find((project) => project.id === "ecommerce");

  return (
    <div className="commerce-dashboard">
      <img src={commerceProject.src} alt="" />
    </div>
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
