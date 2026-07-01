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
    id: "ecommerce",
    label: "Site e-commerce",
    image: hellaDesktop,
    visual: "commerce",
    accent: "#f26122",
  },
  {
    id: "mobile",
    label: "Application mobile",
    image: hellaMobile,
    visual: "mobile",
    accent: "#2b7cff",
  },
  {
    id: "operations",
    label: "Plateforme métier",
    visual: "operations",
    accent: "#20a77a",
  },
  {
    id: "institutionnel",
    label: "Site institutionnel",
    visual: "editorial",
    accent: "#d8584b",
  },
  {
    id: "saas",
    label: "Logiciel SaaS",
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

const heroStackMergeTransforms = [
  { x: 0, y: 0 },
  { x: -44, y: 42 },
  { x: -92, y: 74 },
  { x: -128, y: 32 },
  { x: -154, y: -18 },
];

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
  const monitorScreenRef = useRef(null);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0];
  const reducedMotion = useReducedMotion();
  const geometry = useTransitionGeometry(storyRef, stageRef, monitorScreenRef);
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

  const monitorContentOpacity = useTransform(progress, [0.74, 0.94], [0, 1]);

  return (
    <section className="project-story" id="accueil" ref={storyRef}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="section-wrap hero-layout">
          <div className="hero-copy">
            <h1 id="hero-title" className="hero-title">
              <span>On transforme vos projets</span>
              <span className="hero-arrow-line">
                en sites web et apps mobiles
                <HandDrawnArrow reducedMotion={reducedMotion} />
              </span>
              <span className="hero-memory">
                dont les gens se souviennent.
                <HandDrawnHighlight reducedMotion={reducedMotion} />
              </span>
            </h1>
          </div>
          <div className="hero-stage" ref={stageRef} aria-hidden="true">
            <HeroStack projects={projects} progress={progress} reducedMotion={reducedMotion} />
          </div>
        </div>
      </section>

      <SoftMorphCanvas
        geometry={geometry}
        project={projects[0]}
        progress={progress}
        reducedMotion={reducedMotion}
      />

      <section className="portfolio story-portfolio" id="realisations" aria-labelledby="portfolio-title">
        <div className="section-wrap metrics story-metrics" aria-label="Indicateurs de confiance">
          <Reveal as="p">
            <Counter prefix="+" target={100} />
            <span>sites web et applications mobiles réalisés</span>
          </Reveal>
          <Reveal as="p">
            <Counter prefix="+" target={7} suffix=" ans" />
            <span>d’expérience</span>
          </Reveal>
          <Reveal as="p">
            <Counter target={2019} textPrefix="Fondée en " useGrouping={false} />
            <span>en Valais, Suisse</span>
          </Reveal>
          <Reveal as="p">
            <Counter prefix="+" target={500000} suffix=" CHF" />
            <span>de commandes générées en 2025 sur les sites e-commerce construits</span>
          </Reveal>
        </div>

        <Reveal className="section-wrap monitor-showcase">
          <div className="project-selector-panel">
            <p className="portfolio-kicker">Réalisations</p>
            <h2 id="portfolio-title">Un projet à l’écran. Les autres à portée de main.</h2>
            <div className="project-selector" aria-label="Sélection de projet">
              {projects.map((project) => (
                <button
                  aria-pressed={selectedProjectId === project.id}
                  className={selectedProjectId === project.id ? "is-selected" : undefined}
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  type="button"
                >
                  {project.label}
                </button>
              ))}
            </div>
          </div>

          <div className="monitor-stage">
            <div className="desktop-monitor" aria-label={`Aperçu ${selectedProject.label}`}>
              <div className="monitor-bezel">
                <div className="monitor-screen" ref={monitorScreenRef}>
                  <motion.div
                    className="monitor-screen-content"
                    style={reducedMotion ? undefined : { opacity: monitorContentOpacity }}
                  >
                    <ProjectCardSurface project={selectedProject} mode="monitor" />
                  </motion.div>
                </div>
              </div>
              <div className="monitor-neck" />
              <div className="monitor-foot" />
            </div>
          </div>
        </Reveal>
      </section>
    </section>
  );
}

function HandDrawnArrow({ reducedMotion }) {
  return (
    <svg className="hero-mark hero-arrow-mark" viewBox="0 0 330 140" aria-hidden="true">
      <motion.path
        d="M18 94 C62 35 133 20 176 55 C214 86 253 93 307 76"
        fill="none"
        pathLength="1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="13"
        strokeDasharray="1"
        initial={reducedMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: reducedMotion ? 0 : 1.05, delay: 0.64, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M263 38 C282 53 296 65 307 76 C286 80 263 86 239 94"
        fill="none"
        pathLength="1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="13"
        strokeDasharray="1"
        initial={reducedMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.38, delay: 1.42, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

function HandDrawnHighlight({ reducedMotion }) {
  return (
    <svg className="hero-mark hero-highlight-mark" viewBox="0 0 820 54" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d="M18 31 C138 40 250 26 368 32 C505 39 642 28 802 34"
        fill="none"
        pathLength="1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="18"
        strokeDasharray="1"
        initial={reducedMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.92, delay: 1.06, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

function HeroStack({ projects: stackProjects, progress, reducedMotion }) {
  return (
    <div className="hero-stack">
      {stackProjects.map((project, index) => (
        <HeroStackCard
          index={index}
          key={project.id}
          project={project}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

function HeroStackCard({ project, index, progress, reducedMotion }) {
  const merge = heroStackMergeTransforms[index];
  const opacity = useTransform(
    progress,
    index === 0 ? [0, 0.13, 0.24] : [0, 0.1, 0.25],
    index === 0 ? [1, 0.9, 0] : [1, 0.78, 0]
  );
  const scale = useTransform(progress, [0, 0.18], [1, index === 0 ? 1 : 0.96]);
  const x = useTransform(progress, [0, 0.18], [0, merge.x]);
  const y = useTransform(progress, [0, 0.18], [0, merge.y]);
  const rotate = useTransform(progress, [0, 0.18], [heroStackOffsets[index].rotate, 0]);

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

function SoftMorphCanvas({ geometry, progress, project, reducedMotion }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !geometry || reducedMotion) {
      return undefined;
    }

    let frame = 0;
    let disposed = false;
    let renderer;
    let scene;
    let camera;
    let mesh;
    let material;
    let texture;
    let planeGeometry;

    const rect = container.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(rect.width));
    const height = Math.max(1, Math.ceil(rect.height));

    import("three").then((THREE) => {
      if (disposed) {
        return;
      }

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(width, height, false);
      renderer.domElement.className = "soft-morph-canvas";
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(0, width, height, 0, -1000, 1000);
      camera.position.z = 1000;
      planeGeometry = new THREE.PlaneGeometry(1, 1, 36, 36);

      return createProjectTexture(project, THREE).then((createdTexture) => {
        if (disposed) {
          createdTexture.dispose();
          return;
        }

        texture = createdTexture;
        material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uProgress: { value: 0 },
            uOpacity: { value: 0 },
            uBend: { value: 0 },
            uSoftness: { value: 0 },
            uDirection: { value: new THREE.Vector2(1, 0) },
          },
          vertexShader: softMorphVertexShader,
          fragmentShader: softMorphFragmentShader,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });
        mesh = new THREE.Mesh(planeGeometry, material);
        mesh.frustumCulled = false;
        mesh.renderOrder = 24;
        scene.add(mesh);

        const render = () => {
          if (disposed) {
            return;
          }

          updateSoftMorphMesh(mesh, geometry, progress.get(), THREE);
          renderer.render(scene, camera);
          frame = requestAnimationFrame(render);
        };

        render();
      });
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      if (mesh) {
        scene?.remove(mesh);
      }
      material?.dispose();
      texture?.dispose();
      planeGeometry?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [geometry, progress, project, reducedMotion]);

  if (!geometry || reducedMotion) {
    return null;
  }

  return <div className="soft-morph-layer" ref={containerRef} aria-hidden="true" />;
}

function updateSoftMorphMesh(mesh, geometry, rawProgress, THREE) {
  const cardGeometry = geometry.card;

  if (!mesh || !cardGeometry) {
    return;
  }

  const progress = clamp(rawProgress);
  const eased = easeInOut(progress);
  const phase = Math.sin(progress * Math.PI);
  const startCenterX = cardGeometry.start.x + cardGeometry.start.width / 2;
  const startCenterY = cardGeometry.start.y + cardGeometry.start.height / 2;
  const endCenterX = cardGeometry.end.x + cardGeometry.start.width / 2;
  const endCenterY = cardGeometry.end.y + cardGeometry.start.height / 2;
  const arcX = phase * cardGeometry.curveX;
  const liftY = phase * cardGeometry.curveY;
  const centerX = lerp(startCenterX, endCenterX, eased) + arcX;
  const centerY = lerp(startCenterY, endCenterY, eased) - liftY;
  const scaleX = lerp(1, cardGeometry.end.scaleX, easeOut(progress));
  const scaleY = lerp(1, cardGeometry.end.scaleY, easeOut(progress));
  const stretch = 1 + phase * 0.12;
  const squash = 1 - phase * 0.045;
  const travelX = endCenterX - startCenterX;
  const travelY = endCenterY - startCenterY;
  const travelLength = Math.hypot(travelX, travelY) || 1;
  const directionX = travelX / travelLength;
  const directionY = travelY / travelLength;
  const rotation = lerp(cardGeometry.start.rotate, 0, easeOut(progress)) + phase * -1.8;
  const opacity = mapRange(rawProgress, 0.025, 0.12, 0, 0.98) * mapRange(rawProgress, 0.82, 0.98, 1, 0);

  mesh.visible = opacity > 0.01;
  mesh.position.set(centerX, centerY, 30);
  mesh.rotation.z = THREE.MathUtils.degToRad(rotation);
  mesh.scale.set(cardGeometry.start.width * scaleX * stretch, cardGeometry.start.height * scaleY * squash, 1);
  mesh.material.uniforms.uProgress.value = progress;
  mesh.material.uniforms.uOpacity.value = opacity;
  mesh.material.uniforms.uBend.value = phase;
  mesh.material.uniforms.uSoftness.value = phase;
  mesh.material.uniforms.uDirection.value.set(directionX, directionY);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  const progress = clamp((value - inMin) / (inMax - inMin));

  return lerp(outMin, outMax, progress);
}

const softMorphVertexShader = `
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uBend;
  uniform float uSoftness;
  uniform vec2 uDirection;

  void main() {
    vUv = uv;
    vec3 p = position;
    vec2 centered = uv - 0.5;
    float sheet = sin(uv.x * 3.14159265);
    float crossWave = sin((uv.y + uProgress * 0.42) * 6.2831853);
    float longWave = sin((uv.x + uProgress * 0.58) * 3.14159265);

    p.x += crossWave * 0.030 * uSoftness;
    p.y += longWave * 0.070 * uBend;
    p.x += centered.y * uDirection.x * 0.090 * uSoftness * sheet;
    p.y += centered.x * uDirection.y * 0.070 * uSoftness * sheet;
    p.z += sheet * uBend * 0.19;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const softMorphFragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uSoftness;

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;
    float shimmer = sin((uv.x + uv.y) * 18.0) * 0.006 * uSoftness;
    vec4 color = texture2D(uTexture, uv + centered * shimmer);
    float edgeX = smoothstep(0.0, 0.045, uv.x) * smoothstep(0.0, 0.045, 1.0 - uv.x);
    float edgeY = smoothstep(0.0, 0.055, uv.y) * smoothstep(0.0, 0.055, 1.0 - uv.y);
    float edge = edgeX * edgeY;
    color.rgb += vec3(0.035) * uSoftness * edge;
    color.a *= uOpacity * edge;

    gl_FragColor = color;
  }
`;

async function createProjectTexture(project, THREE) {
  const width = 720;
  const height = 920;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  drawProjectTextureBase(ctx, project, width, height);

  if (project.image) {
    try {
      const image = await loadCanvasImage(project.image);
      drawProjectImagePreview(ctx, image, width, height);
    } catch {
      drawGeneratedTexturePreview(ctx, project.visual, width, height);
    }
  } else {
    drawGeneratedTexturePreview(ctx, project.visual, width, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return texture;
}

function drawProjectTextureBase(ctx, project, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);

  if (project.visual === "commerce") {
    gradient.addColorStop(0, "#191d1f");
    gradient.addColorStop(0.56, "#42221d");
    gradient.addColorStop(1, "#d64e1b");
  } else if (project.visual === "mobile") {
    gradient.addColorStop(0, "#06131f");
    gradient.addColorStop(0.56, "#245f9b");
    gradient.addColorStop(1, "#89d3ef");
  } else if (project.visual === "operations") {
    gradient.addColorStop(0, "#10211d");
    gradient.addColorStop(0.58, "#173f34");
    gradient.addColorStop(1, "#cfe6d6");
  } else if (project.visual === "editorial") {
    gradient.addColorStop(0, "#f1efea");
    gradient.addColorStop(0.52, "#c8d5d8");
    gradient.addColorStop(1, "#1f272c");
  } else {
    gradient.addColorStop(0, "#111321");
    gradient.addColorStop(0.55, "#27215f");
    gradient.addColorStop(1, "#d8e0ff");
  }

  roundedRect(ctx, 0, 0, width, height, 52);
  ctx.fillStyle = gradient;
  ctx.fill();

  const glow = ctx.createRadialGradient(width * 0.18, height * 0.1, 0, width * 0.18, height * 0.1, width * 0.68);
  glow.addColorStop(0, `${project.accent}80`);
  glow.addColorStop(1, `${project.accent}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function drawProjectImagePreview(ctx, image, width, height) {
  const x = 0;
  const y = 0;
  const previewWidth = width;
  const previewHeight = height;
  const imageRatio = image.width / image.height;
  const previewRatio = previewWidth / previewHeight;
  let drawWidth = previewWidth;
  let drawHeight = previewHeight;
  let drawX = x;
  let drawY = y;

  if (imageRatio > previewRatio) {
    drawWidth = previewHeight * imageRatio;
    drawX = x - (drawWidth - previewWidth) / 2;
  } else {
    drawHeight = previewWidth / imageRatio;
    drawY = y - (drawHeight - previewHeight) / 2;
  }

  ctx.save();
  roundedRect(ctx, x, y, previewWidth, previewHeight, 52);
  ctx.clip();
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function drawGeneratedTexturePreview(ctx, visual, width, height) {
  const x = 0;
  const y = 0;
  const previewWidth = width;
  const previewHeight = height;

  ctx.save();
  roundedRect(ctx, x, y, previewWidth, previewHeight, 42);
  ctx.clip();
  ctx.fillStyle = visual === "editorial" ? "#ffffff" : "#f5f7f3";
  ctx.fillRect(x, y, previewWidth, previewHeight);

  if (visual === "operations") {
    ctx.fillStyle = "#1b3d34";
    roundedRect(ctx, x + 34, y + 34, 94, previewHeight - 68, 28);
    ctx.fill();
    ctx.fillStyle = "#20a77a";
    roundedRect(ctx, x + 58, y + 58, 46, 46, 16);
    ctx.fill();
    ctx.fillStyle = "#11201d";
    roundedRect(ctx, x + 158, y + 44, previewWidth - 210, 54, 22);
    ctx.fill();
    drawPreviewBlocks(ctx, x + 158, y + 128, previewWidth - 210, previewHeight - 170, "#cfe3d6");
  } else if (visual === "editorial") {
    const editorialGradient = ctx.createLinearGradient(x + 38, y + 38, x + previewWidth - 38, y + 180);
    editorialGradient.addColorStop(0, "#df766d");
    editorialGradient.addColorStop(1, "#efe3df");
    ctx.fillStyle = editorialGradient;
    roundedRect(ctx, x + 38, y + 38, previewWidth - 76, 170, 34);
    ctx.fill();
    ctx.fillStyle = "#1f272c";
    roundedRect(ctx, x + 46, y + 248, previewWidth * 0.58, 18, 9);
    ctx.fill();
    drawPreviewBlocks(ctx, x + 46, y + 292, previewWidth - 92, 126, "#ead8d5");
  } else {
    ctx.fillStyle = "#111321";
    roundedRect(ctx, x + 34, y + 34, previewWidth - 68, 56, 22);
    ctx.fill();
    ctx.fillStyle = "#6a5cff";
    roundedRect(ctx, x + previewWidth - 142, y + 48, 72, 28, 14);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    roundedRect(ctx, x + 46, y + 130, previewWidth - 92, 210, 32);
    ctx.fill();
    drawChartBars(ctx, x + 86, y + 174, previewWidth - 172, 128);
  }

  ctx.restore();
}

function drawPreviewBlocks(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  const gap = 16;
  const blockWidth = (width - gap * 2) / 3;

  for (let i = 0; i < 3; i += 1) {
    roundedRect(ctx, x + i * (blockWidth + gap), y, blockWidth, height * 0.42, 24);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(16, 18, 20, 0.15)";

  for (let i = 0; i < 4; i += 1) {
    roundedRect(ctx, x, y + height * 0.58 + i * 28, width * (0.92 - i * 0.08), 14, 7);
    ctx.fill();
  }
}

function drawChartBars(ctx, x, y, width, height) {
  const barWidth = width / 7;
  const heights = [0.42, 0.72, 0.56, 0.88];

  heights.forEach((barHeight, index) => {
    ctx.fillStyle = index === 3 ? "#6a5cff" : "rgba(106, 92, 255, 0.35)";
    roundedRect(ctx, x + index * barWidth * 1.55, y + height * (1 - barHeight), barWidth, height * barHeight, 22);
    ctx.fill();
  });
}

function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = window.setTimeout(() => {
      image.onload = null;
      image.onerror = null;
      reject(new Error("Image load timeout"));
    }, 650);

    image.onload = () => {
      window.clearTimeout(timeout);
      resolve(image);
    };
    image.onerror = (error) => {
      window.clearTimeout(timeout);
      reject(error);
    };
    image.src = src;
  });
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function ProjectCardSurface({ project, mode }) {
  return (
    <div
      className={`project-card-surface project-card-${project.visual} project-card-${mode}`}
      aria-label={project.label}
      style={{ "--project-accent": project.accent }}
    >
      <div className="project-preview" aria-hidden="true">
        {project.image ? (
          <img src={project.image} alt="" />
        ) : (
          <GeneratedProjectPreview visual={project.visual} />
        )}
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

function Counter({ prefix = "", suffix = "", target, textPrefix = "", useGrouping = true }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const formatNumber = (value) =>
      new Intl.NumberFormat("fr-CH", { useGrouping }).format(value);
    const formatValue = (value) => `${textPrefix}${prefix}${formatNumber(value)}${suffix}`;

    if (reducedMotion) {
      node.textContent = formatValue(target);
      return undefined;
    }

    let frame = 0;
    const animate = () => {
      const start = performance.now();
      const duration = 1200;

      const tick = (now) => {
        const progress = clamp((now - start) / duration);
        const eased = easeOut(progress);
        node.textContent = formatValue(Math.round(target * eased));

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
  }, [prefix, reducedMotion, suffix, target, textPrefix, useGrouping]);

  return <strong ref={ref}>{textPrefix}{prefix}0{suffix}</strong>;
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

function useTransitionGeometry(storyRef, stageRef, monitorScreenRef) {
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const story = storyRef.current;
      const stage = stageRef.current;
      const screen = monitorScreenRef.current;

      if (!story || !stage || !screen) {
        return;
      }

      const storyRect = story.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const screenRect = screen.getBoundingClientRect();
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
      const screenTop = screenRect.top + window.scrollY;
      const screenCenterX = screenRect.left + window.scrollX - storyLeft + screenRect.width / 2;
      const screenCenterY = screenRect.top + window.scrollY - storyTop + screenRect.height / 2;
      const finalScaleX = screenRect.width / cardWidth;
      const finalScaleY = screenRect.height / cardHeight;
      const startOffset = heroStackOffsets[0];
      const transitionDistance = Math.max(
        window.innerHeight * 1.32,
        screenTop - storyTop - window.innerHeight * 0.42
      );

      setGeometry({
        card: {
          curveX: viewportWidth > 960 ? -120 : 28,
          curveY: viewportWidth > 960 ? 180 : 92,
          start: {
            x: stageCenterX - cardWidth / 2 + cardWidth * startOffset.x,
            y: stageCenterY - cardHeight / 2 + cardHeight * startOffset.y,
            width: cardWidth,
            height: cardHeight,
            rotate: startOffset.rotate,
          },
          end: {
            x: screenCenterX - cardWidth / 2,
            y: screenCenterY - cardHeight / 2,
            scaleX: finalScaleX,
            scaleY: finalScaleY,
          },
        },
        storyTop,
        transitionDistance,
      });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(scheduleMeasure);
    const observedNodes = [storyRef.current, stageRef.current, monitorScreenRef.current].filter(Boolean);
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
  }, [monitorScreenRef, stageRef, storyRef]);

  return geometry;
}

export default App;
