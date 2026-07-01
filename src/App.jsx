import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Lenis from "lenis";
import hellaDesktop from "../assets/hella-boutique-desktop.png";
import hellaMobile from "../assets/hella-mobile.avif";
import logoDark from "../assets/solis-logo-dark.png";

const contactHref =
  "mailto:info@solis.li?subject=Maquette%20interactive%20offerte";

const navItems = [
  { href: "#accueil", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#realisations", label: "Réalisations" },
];

const projects = [
  {
    category: "Site e-commerce",
    name: "Hella Boutique",
    description: "Catalogue, panier, tunnel de commande et pilotage stock.",
    image: hellaDesktop,
    visual: "commerce",
    accent: "#f26122",
  },
  {
    category: "Application mobile",
    name: "Hella Mobile",
    description: "Parcours client rapide, clair, pensé pour l’usage quotidien.",
    image: hellaMobile,
    visual: "mobile",
    accent: "#2b7cff",
  },
  {
    category: "Plateforme métier",
    name: "Operations Hub",
    description: "Planning, dossiers, validations et indicateurs en temps réel.",
    visual: "operations",
    accent: "#20a77a",
  },
  {
    category: "Site institutionnel",
    name: "Maison Locale",
    description: "Éditorial, pages clés, contenus vivants et image maîtrisée.",
    visual: "editorial",
    accent: "#d8584b",
  },
  {
    category: "Logiciel SaaS",
    name: "Solis OS",
    description: "Tableaux de bord, comptes, workflows et reporting produit.",
    visual: "saas",
    accent: "#6a5cff",
  },
];

const heroStackOffsets = [
  { x: -0.32, y: 0.08, rotate: -10 },
  { x: -0.17, y: -0.02, rotate: -4 },
  { x: 0, y: -0.06, rotate: 1.5 },
  { x: 0.17, y: 0.01, rotate: 7 },
  { x: 0.33, y: 0.1, rotate: 12 },
];

const sliceCount = 7;

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (start, end, progress) => start + (end - start) * progress;
const easeOut = (progress) => 1 - Math.pow(1 - progress, 3);
const easeInOut = (progress) =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

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
            data-track="navigation-maquette"
          >
            Contact
          </a>
        </nav>
      </header>

      <main id="contenu">
        <ProjectStory />
        <ServicesSection />
        <StudioCta />
        <CustomSection />
        <ProcessSection />
        <ProofSection />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}

function ProjectStory() {
  const storyRef = useRef(null);
  const stageRef = useRef(null);
  const slotRefs = useRef([]);
  const reducedMotion = useReducedMotion();
  const geometry = useTransitionGeometry(storyRef, stageRef, slotRefs);
  const { scrollY } = useScroll();

  const rawProgress = useTransform(scrollY, (latest) => {
    if (!geometry || reducedMotion) {
      return 0;
    }

    return clamp((latest - geometry.storyTop) / geometry.transitionDistance);
  });

  const progress = useSpring(rawProgress, {
    stiffness: 108,
    damping: 30,
    mass: 0.72,
  });

  const finalOpacity = useTransform(progress, [0.58, 0.84], [0, 1]);
  const finalY = useTransform(progress, [0.58, 0.9], [36, 0]);
  const finalScale = useTransform(progress, [0.62, 0.94], [0.975, 1]);

  return (
    <section className="project-story" id="accueil" ref={storyRef}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="section-wrap hero-layout">
          <div className="hero-copy">
            <h1 id="hero-title" className="hero-title">
              <span>On transforme vos projets</span>
              <span>en sites web et apps mobiles</span>
              <span className="hero-memory">dont les gens se souviennent.</span>
            </h1>
          </div>
          <div className="hero-stage" ref={stageRef} aria-hidden="true">
            <HeroStack projects={projects} progress={progress} reducedMotion={reducedMotion} />
          </div>
        </div>
      </section>

      <MorphSliceLayer
        geometry={geometry}
        progress={progress}
        projects={projects}
        reducedMotion={reducedMotion}
      />

      <section className="portfolio story-portfolio" id="realisations" aria-labelledby="portfolio-title">
        <div className="section-wrap metrics story-metrics" aria-label="Indicateurs de confiance">
          <Reveal as="p">
            <Counter prefix="+" target={50} />
            <span>projets réalisés</span>
          </Reveal>
          <Reveal as="p">
            <Counter prefix="+" target={7} />
            <span>ans d’expérience</span>
          </Reveal>
          <Reveal as="p">
            <strong>Valais</strong>
            <span>Suisse, depuis 2019</span>
          </Reveal>
          <Reveal as="p">
            <Counter prefix="+" target={500000} />
            <span>commandes e-commerce traitées en deux ans</span>
          </Reveal>
        </div>

        <motion.div
          className="section-wrap featured-project-grid"
          style={
            reducedMotion
              ? undefined
              : { opacity: finalOpacity, y: finalY, scale: finalScale }
          }
        >
          {projects.map((project, index) => (
            <article
              className="portfolio-project"
              key={project.name}
              ref={(node) => {
                slotRefs.current[index] = node;
              }}
            >
              <ProjectCardSurface project={project} mode="portfolio" />
            </article>
          ))}
        </motion.div>

        <Reveal className="section-wrap portfolio-copy">
          <h2 id="portfolio-title">Cinq projets phares. Un même niveau d’exigence.</h2>
          <a className="button light" href="/realisations/" data-track="portfolio-page">
            Découvrir les réalisations
          </a>
        </Reveal>
      </section>
    </section>
  );
}

function HeroStack({ projects: stackProjects, progress, reducedMotion }) {
  return (
    <div className="hero-stack">
      {stackProjects.map((project, index) => (
        <HeroStackCard
          index={index}
          key={project.name}
          project={project}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

function HeroStackCard({ project, index, progress, reducedMotion }) {
  const opacity = useTransform(progress, [0, 0.06, 0.28], [1, 0.8, 0]);
  const scale = useTransform(progress, [0, 0.26], [1, 0.9]);
  const x = useTransform(progress, [0, 0.26], [0, (2 - index) * 14]);
  const y = useTransform(progress, [0, 0.26], [0, 22 + index * 5]);
  const rotate = useTransform(progress, [0, 0.26], [heroStackOffsets[index].rotate, (2 - index) * 2]);

  return (
    <motion.article
      className={`hero-stack-card hero-stack-card-${index}`}
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              x: 120,
              y: 34,
              scale: 0.92,
              rotate: heroStackOffsets[index].rotate + 8,
            }
      }
      animate={
        reducedMotion
          ? undefined
          : {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }
      }
      transition={{
        delay: 0.14 + index * 0.18,
        duration: 0.74,
        type: "spring",
        stiffness: 130,
        damping: 18,
        mass: 0.82,
      }}
      style={
        reducedMotion
          ? undefined
          : {
              opacity,
              scale,
              x,
              y,
              rotate,
            }
      }
    >
      <ProjectCardSurface project={project} mode="hero" />
    </motion.article>
  );
}

function MorphSliceLayer({ geometry, progress, projects: morphProjects, reducedMotion }) {
  if (!geometry || reducedMotion) {
    return null;
  }

  return (
    <div className="morph-layer" aria-hidden="true">
      {morphProjects.map((project, index) => (
        <MorphCardProxy
          geometry={geometry.cards[index]}
          index={index}
          key={project.name}
          progress={progress}
          project={project}
        />
      ))}
    </div>
  );
}

function MorphCardProxy({ geometry, index, progress, project }) {
  const proxyProgress = useTransform(progress, (value) => {
    const offset = index * 0.018;
    return clamp((value - offset) / (0.96 - offset));
  });

  const x = useTransform(proxyProgress, (value) => {
    const eased = easeInOut(value);
    const arc = Math.sin(value * Math.PI) * geometry.curveX;
    return lerp(geometry.start.x, geometry.end.x, eased) + arc;
  });

  const y = useTransform(proxyProgress, (value) => {
    const eased = easeInOut(value);
    const lift = Math.sin(value * Math.PI) * geometry.curveY;
    return lerp(geometry.start.y, geometry.end.y, eased) - lift;
  });

  const scale = useTransform(proxyProgress, (value) => {
    const eased = easeOut(value);
    const compression = Math.sin(value * Math.PI) * 0.035;
    return lerp(1, geometry.end.scale, eased) - compression;
  });

  const rotate = useTransform(proxyProgress, (value) => {
    const eased = easeOut(value);
    const orbit = Math.sin(value * Math.PI) * (index - 2) * 1.8;
    return lerp(geometry.start.rotate, 0, eased) + orbit;
  });

  const opacity = useTransform(progress, [0.04, 0.13, 0.78, 0.98], [0, 0.98, 0.92, 0]);

  return (
    <motion.div
      className="morph-card-proxy"
      style={{
        width: geometry.start.width,
        height: geometry.start.height,
        x,
        y,
        scale,
        rotate,
        opacity,
        zIndex: 20 + index,
      }}
    >
      {Array.from({ length: sliceCount }, (_, sliceIndex) => (
        <MorphRibbon
          index={index}
          key={`${project.name}-${sliceIndex}`}
          progress={proxyProgress}
          project={project}
          sliceIndex={sliceIndex}
        />
      ))}
    </motion.div>
  );
}

function MorphRibbon({ index, progress, project, sliceIndex }) {
  const centerOffset = sliceIndex - (sliceCount - 1) / 2;
  const direction = index % 2 === 0 ? 1 : -1;
  const ribbonX = useTransform(
    progress,
    (value) => Math.sin(value * Math.PI) * centerOffset * 15 * direction
  );
  const ribbonY = useTransform(progress, (value) => {
    const phase = Math.sin(value * Math.PI);
    return phase * (Math.abs(centerOffset) * 7 + index * 2);
  });
  const ribbonRotate = useTransform(
    progress,
    (value) => Math.sin(value * Math.PI) * centerOffset * 1.55 * direction
  );
  const scaleY = useTransform(progress, (value) => {
    const phase = Math.sin(value * Math.PI);
    return lerp(1, 0.16 + Math.abs(centerOffset) * 0.012, phase);
  });
  const opacity = useTransform(progress, [0, 0.12, 0.82, 1], [0.78, 1, 1, 0.12]);

  return (
    <motion.div
      className="morph-ribbon"
      style={{
        left: `${(sliceIndex / sliceCount) * 100}%`,
        width: `${100 / sliceCount + 0.8}%`,
        x: ribbonX,
        y: ribbonY,
        rotate: ribbonRotate,
        scaleY,
        opacity,
      }}
    >
      <div
        className="morph-ribbon-inner"
        style={{
          width: `${sliceCount * 100}%`,
          transform: `translate3d(-${(sliceIndex / sliceCount) * 100}%, 0, 0)`,
        }}
      >
        <ProjectCardSurface project={project} mode="morph" />
      </div>
    </motion.div>
  );
}

function ProjectCardSurface({ project, mode }) {
  return (
    <div
      className={`project-card-surface project-card-${project.visual} project-card-${mode}`}
      style={{ "--project-accent": project.accent }}
    >
      <div className="project-preview" aria-hidden="true">
        {project.image ? (
          <img src={project.image} alt="" />
        ) : (
          <GeneratedProjectPreview visual={project.visual} />
        )}
      </div>
      <div className="project-card-copy">
        <span>{project.category}</span>
        <strong>{project.name}</strong>
        <p>{project.description}</p>
      </div>
    </div>
  );
}

function GeneratedProjectPreview({ visual }) {
  if (visual === "operations") {
    return (
      <div className="generated-preview operations-preview">
        <div className="preview-sidebar">
          <span />
          <span />
          <span />
        </div>
        <div className="preview-dashboard">
          <div className="preview-bar" />
          <div className="preview-stat-row">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-table">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (visual === "editorial") {
    return (
      <div className="generated-preview editorial-preview">
        <div className="editorial-hero" />
        <div className="editorial-lines">
          <span />
          <span />
          <span />
        </div>
        <div className="editorial-grid">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="generated-preview saas-preview">
      <div className="saas-topline">
        <span />
        <span />
      </div>
      <div className="saas-chart">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="saas-panels">
        <span />
        <span />
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="section-wrap services-layout">
        <Reveal className="section-statement">
          <h2 id="services-title">Sur mesure. Rien d’autre.</h2>
        </Reveal>
        <div className="service-rail" aria-label="Services SOLIS">
          <Reveal as="a" className="service-row" href="/services/sites-web/">
            <span>01</span>
            <strong>Sites web</strong>
            <em>Vitrine, e-commerce, expérience entièrement personnalisée.</em>
            <small>À partir de CHF 4'900</small>
          </Reveal>
          <Reveal as="a" className="service-row" href="/services/applications-mobiles/">
            <span>02</span>
            <strong>Applications mobiles</strong>
            <em>Des parcours iOS et Android clairs, rapides, utiles.</em>
            <small>Sur devis</small>
          </Reveal>
          <Reveal as="a" className="service-row" href="/services/developpements-sur-mesure/">
            <span>03</span>
            <strong>Logiciels métier</strong>
            <em>Applications web, plateformes internes, outils spécifiques.</em>
            <small>Après cadrage</small>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StudioCta() {
  return (
    <section className="studio-cta" aria-labelledby="mid-title">
      <Reveal className="section-wrap studio-inner">
        <h2 id="mid-title">Votre idée devient cliquable.</h2>
        <MagneticLink
          className="button primary"
          href={`${contactHref}&body=Source%3A%20cta-milieu`}
          data-track="midpage-maquette"
        >
          Demander ma maquette interactive offerte
        </MagneticLink>
      </Reveal>
    </section>
  );
}

function CustomSection() {
  return (
    <section className="custom-section" id="sur-mesure" aria-labelledby="custom-title">
      <div className="section-wrap custom-layout">
        <Reveal as="h2" id="custom-title">
          Un produit doit suivre votre entreprise. Pas un modèle.
        </Reveal>
        <Reveal className="versus">
          <div>
            <span>Sur mesure</span>
            <ul>
              <li>Flexibilité réelle</li>
              <li>Évolutif sans détour</li>
              <li>Identité propriétaire</li>
              <li>Performance maîtrisée</li>
              <li>Maintenance durable</li>
            </ul>
          </div>
          <div>
            <span>Modèle</span>
            <ul>
              <li>Structure imposée</li>
              <li>Limites rapides</li>
              <li>Image générique</li>
              <li>Code souvent lourd</li>
              <li>Évolution contrainte</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    ["01", "Découvrir", "Objectifs, public, contraintes."],
    ["02", "Maquetter", "Prototype interactif personnalisé."],
    ["03", "Ajuster", "Échanges, priorités, validation."],
    ["04", "Lancer", "Développement et mise en ligne."],
  ];

  return (
    <section className="process" id="methode" aria-labelledby="process-title">
      <div className="section-wrap process-layout">
        <Reveal as="h2" id="process-title">
          Simple à comprendre. Exigeant à construire.
        </Reveal>
        <ol className="process-steps">
          {steps.map(([number, title, body]) => (
            <Reveal as="li" key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="proof" id="preuves" aria-labelledby="proof-title">
      <div className="section-wrap proof-layout">
        <Reveal as="blockquote">« La maquette a rendu le projet évident avant la décision. »</Reveal>
        <Reveal className="proof-copy">
          <h2 id="proof-title">Pourquoi SOLIS</h2>
          <ul>
            <li>100% développement sur mesure</li>
            <li>Collaboration directe</li>
            <li>Qualité suisse</li>
            <li>Partenariats long terme</li>
            <li>Logiciels durables</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta" id="contact" aria-labelledby="final-title">
      <Reveal className="section-wrap final-inner">
        <h2 id="final-title">Montrez-nous l’idée.</h2>
        <div className="final-actions">
          <MagneticLink
            className="button primary"
            href={`${contactHref}&body=Source%3A%20cta-final`}
            data-track="final-maquette"
          >
            Demander ma maquette interactive offerte
          </MagneticLink>
          <a className="contact-link" href="mailto:info@solis.li">
            info@solis.li
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-inner">
        <a className="footer-brand" href="#accueil" aria-label="SOLIS Développement">
          <img src={logoDark} alt="SOLIS" />
        </a>
        <p>Sites web, applications et logiciels métier sur mesure en Suisse romande.</p>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#methode">Méthode</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function Reveal({ as = "div", children, className, ...props }) {
  const Component = motion[as] || motion.div;
  const reducedMotion = useReducedMotion();

  return (
    <Component
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.64, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.18 }}
      {...props}
    >
      {children}
    </Component>
  );
}

function Counter({ prefix = "", target }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const formatNumber = (value) => new Intl.NumberFormat("fr-CH").format(value);

    if (reducedMotion) {
      node.textContent = `${prefix}${formatNumber(target)}`;
      return undefined;
    }

    let frame = 0;
    const animate = () => {
      const start = performance.now();
      const duration = 1200;

      const tick = (now) => {
        const progress = clamp((now - start) / duration);
        const eased = easeOut(progress);
        node.textContent = `${prefix}${formatNumber(Math.round(target * eased))}`;

        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        }
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.55 }
    );

    observer.observe(node);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [prefix, reducedMotion, target]);

  return <strong ref={ref}>{prefix}0</strong>;
}

function MagneticLink({ children, className, ...props }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;

    if (!node || reducedMotion) {
      return undefined;
    }

    const handleMove = (event) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const handleLeave = () => {
      node.style.transform = "";
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerleave", handleLeave);

    return () => {
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, [reducedMotion]);

  return (
    <a className={className} ref={ref} {...props}>
      {children}
    </a>
  );
}

function useLenisScroll() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.86,
      touchMultiplier: 1,
      syncTouch: false,
    });

    let frame = 0;

    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reducedMotion]);
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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-34% 0px -55% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return activeSection;
}

function useTransitionGeometry(storyRef, stageRef, slotRefs) {
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const story = storyRef.current;
      const stage = stageRef.current;
      const slots = slotRefs.current.filter(Boolean);

      if (!story || !stage || slots.length !== projects.length) {
        return;
      }

      const storyRect = story.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const storyTop = storyRect.top + window.scrollY;
      const storyLeft = storyRect.left + window.scrollX;
      const viewportWidth = window.innerWidth;
      const stageRelativeLeft = stageRect.left + window.scrollX - storyLeft;
      const stageRelativeTop = stageRect.top + window.scrollY - storyTop;
      const cardWidth = Math.min(
        stageRect.width * (viewportWidth > 960 ? 0.66 : 0.76),
        viewportWidth > 960 ? 430 : 340
      );
      const cardHeight = cardWidth * 1.28;
      const stageCenterX = stageRelativeLeft + stageRect.width * 0.53;
      const stageCenterY = stageRelativeTop + stageRect.height * 0.52;
      const firstSlotTop = slots[0].getBoundingClientRect().top + window.scrollY;
      const transitionDistance = Math.max(
        window.innerHeight * 0.68,
        firstSlotTop - storyTop - window.innerHeight * 0.92
      );

      const cards = projects.map((_, index) => {
        const slotRect = slots[index].getBoundingClientRect();
        const offset = heroStackOffsets[index];
        const slotCenterX = slotRect.left + window.scrollX - storyLeft + slotRect.width / 2;
        const slotCenterY = slotRect.top + window.scrollY - storyTop + slotRect.height / 2;
        const finalScale = Math.min(slotRect.width / cardWidth, slotRect.height / cardHeight);

        return {
          curveX: (index - 2) * 44,
          curveY: 86 + index * 15,
          start: {
            x: stageCenterX - cardWidth / 2 + cardWidth * offset.x,
            y: stageCenterY - cardHeight / 2 + cardHeight * offset.y,
            width: cardWidth,
            height: cardHeight,
            rotate: offset.rotate,
          },
          end: {
            x: slotCenterX - cardWidth / 2,
            y: slotCenterY - cardHeight / 2,
            scale: finalScale,
          },
        };
      });

      setGeometry({
        cards,
        storyTop,
        transitionDistance,
      });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(scheduleMeasure);
    const observedNodes = [storyRef.current, stageRef.current, ...slotRefs.current].filter(Boolean);
    observedNodes.forEach((node) => observer.observe(node));

    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("load", scheduleMeasure);

    if (document.fonts) {
      document.fonts.ready.then(scheduleMeasure);
    }

    scheduleMeasure();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("load", scheduleMeasure);
    };
  }, [stageRef, storyRef, slotRefs]);

  return geometry;
}

export default App;
