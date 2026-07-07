import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import aymericPortrait from "../assets/team/aymeric-sarrasin.jpg";
import iphoneFrameImage from "../assets/iphone-17-black-portrait.png";
import lyndonPortrait from "../assets/team/lyndon-vouilloz.jpg";
import macBookFrameImage from "../assets/macbook-pro-m5.png";
import romainPortrait from "../assets/team/romain-darioli.jpg";
import solisLogoNav from "../assets/solis-logo-nav.png";
import studioDisplayImage from "../assets/studio-display-light.png";
import { portfolioProjects, projects } from "./data/projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const contactHref =
  "mailto:info@solis.li?subject=Maquette%20interactive%20offerte";
const linkedInHref = "https://www.linkedin.com/company/solis-d%C3%A9veloppement-informatique/";

const homeMenuItems = [
  {
    href: "#equipe",
    label: "L’équipe",
  },
  {
    href: "#projets",
    label: "Le Portfolio",
  },
];

const serviceNavItems = [
  { href: "#projets", label: "Sites internet sur mesure" },
  { href: "#projets", label: "Applications mobile" },
  { href: "#projets", label: "Logiciels métier" },
];

const screenshotIntervalMs = 1500;
const ENABLE_NEW_HERO_FORM = true;
const ENABLE_OLD_HERO_CTA = false;
const ENABLE_HERO_PICTURE_TRAIL = false;
const ENABLE_HERO_MOUSE_TRAIL = ENABLE_HERO_PICTURE_TRAIL;
const SHOW_HERO_INLINE_REFERENCE_SCREEN = false;
const heroMouseTrailImageWidth = 140;
const heroMouseTrailImageHeight = 200;
const heroMouseTrailStagger = 0.03;
const heroMouseTrailDuration = 0.5;
const heroMouseTrailPoolSize = 12;

const lenisOptions = { lerp: 0.08, wheelMultiplier: 0.9 };
const projectById = new Map(projects.map((project) => [project.id, project]));
const portfolioProjectById = new Map(
  portfolioProjects.map((project) => [project.id, project])
);
const getProjectById = (projectId) => projectById.get(projectId) ?? null;
const getCarouselProjectImageSrc = (project) => project?.carouselSrc ?? project?.src;

const metricTopProjectOrder = [
  "ecommerce",
  "kinn-mobile",
  "le-fournil-de-melchior",
  "platform",
  "contact-mind-mobile",
  "mille-vadrouilles",
  "saas",
  "popup-mobile",
  "mobile-app",
  "institutional",
];
const metricBottomProjectOrder = [
  "mille-vadrouilles",
  "institutional",
  "popup-mobile",
  "mobile-app",
  "ecommerce",
  "platform",
  "kinn-mobile",
  "saas",
  "le-fournil-de-melchior",
  "contact-mind-mobile",
];
const metricCarouselRows = {
  top: metricTopProjectOrder.map(getProjectById).filter(Boolean),
  bottom: metricBottomProjectOrder.map(getProjectById).filter(Boolean),
};
const commerceProject = getProjectById("ecommerce");

const heroReelProjectIds = [
  "ecommerce",
  "le-fournil-de-melchior",
  "platform",
  "mille-vadrouilles",
  "saas",
  "mobile-app",
  "institutional",
];
const heroReelProjects = heroReelProjectIds.map(getProjectById).filter(Boolean);
const heroTrailDesktopProjectIds = [
  "mobile-app",
  "ecommerce",
  "platform",
  "saas",
  "institutional",
  "le-fournil-de-melchior",
  "mille-vadrouilles",
];
const heroTrailMobileProjectIds = [
  "kinn-mobile",
  "contact-mind-mobile",
  "popup-mobile",
];

const getHeroTrailImage = (project, type) => ({
  id: project.id,
  title: project.title,
  type,
  src: getCarouselProjectImageSrc(project),
});

const heroTrailDesktopImages = heroTrailDesktopProjectIds
  .map(getProjectById)
  .filter(Boolean)
  .map((project) => getHeroTrailImage(project, "desktop"))
  .filter((project) => Boolean(project.src));
const heroTrailMobileImages = heroTrailMobileProjectIds
  .map(getProjectById)
  .filter(Boolean)
  .map((project) => getHeroTrailImage(project, "mobile"))
  .filter((project) => Boolean(project.src));
const heroTrailImages = [...heroTrailDesktopImages, ...heroTrailMobileImages];

const shuffleArray = (items) => {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[targetIndex]] = [
      shuffledItems[targetIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
};

const getRandomizedHeroTrailImages = () => {
  const desktopImages = shuffleArray(heroTrailDesktopImages);
  const mobileImages = shuffleArray(heroTrailMobileImages);
  const mixedImages = [];
  let useMobileNext = Math.random() > 0.55;

  while (desktopImages.length > 0 || mobileImages.length > 0) {
    const preferredImages = useMobileNext ? mobileImages : desktopImages;
    const fallbackImages = useMobileNext ? desktopImages : mobileImages;
    const sourceImages = preferredImages.length > 0 ? preferredImages : fallbackImages;

    if (sourceImages.length > 0) {
      mixedImages.push(sourceImages.shift());
    }

    useMobileNext = Math.random() > 0.55;
  }

  const availableImages = mixedImages.length > 0 ? mixedImages : shuffleArray(heroTrailImages);

  return Array.from({ length: heroMouseTrailPoolSize }, (_, index) => {
    return availableImages[index % availableImages.length];
  }).filter(Boolean);
};

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

const clientLogoAssets = import.meta.glob("../assets/client-logos/*.webp", {
  eager: true,
  import: "default",
});

const getClientLogo = (fileName) =>
  clientLogoAssets[`../assets/client-logos/${fileName}.webp`] ?? null;

const clientLogoReferences = [
  {
    id: "ville-de-martigny",
    name: "Ville de Martigny",
    logo: getClientLogo("ville-de-martigny"),
    width: 3477,
    height: 2083,
  },
  {
    id: "synergy",
    name: "Synergy",
    logo: getClientLogo("synergy"),
    width: 1615,
    height: 597,
  },
  {
    id: "ozam",
    name: "OZAM",
    logo: getClientLogo("ozam"),
    width: 513,
    height: 573,
  },
  {
    id: "la-gouttiere",
    name: "La Gouttière",
    logo: getClientLogo("la-gouttiere"),
    width: 2370,
    height: 2636,
  },
  {
    id: "philippe-darioli",
    name: "Philippe Darioli",
    logo: getClientLogo("philippe-darioli"),
    width: 668,
    height: 170,
  },
  {
    id: "brasserie-la-lyonne",
    name: "Brasserie La Lyonne",
    logo: getClientLogo("brasserie-la-lyonne"),
    width: 658,
    height: 279,
  },
  {
    id: "jul-terrassement",
    name: "Jul Terrassement",
    logo: getClientLogo("jul-terrassement"),
    width: 735,
    height: 280,
  },
  {
    id: "popup-challenge",
    name: "Pop-up Challenge",
    logo: getClientLogo("popup-challenge"),
    width: 262,
    height: 220,
  },
];

const activeClientLogos = clientLogoReferences.filter((client) => client.logo);

const leadRewardOptions = [
  { label: "Nom de domaine offert", wheelLabel: "Domaine", weight: 80, tone: "blue" },
  { label: "1 heure de formation offerte", wheelLabel: "Formation", weight: 20, tone: "orange" },
];

const leadRewardWheelOptions = [
  { label: "Nom de domaine offert", wheelLabel: "Domaine", tone: "blue" },
  { label: "Pas de chance", wheelLabel: "Rien", tone: "neutral" },
  { label: "1 heure de formation offerte", wheelLabel: "Formation", tone: "orange" },
  { label: "1 mois d’hébergement offert", wheelLabel: "Héberg.", tone: "soft" },
  { label: "Surprise", wheelLabel: "Surprise", tone: "warm" },
];

const leadRewardWheelTurns = 5;
const leadRewardSpinDuration = 2.9;
const leadRewardSegmentAngle = 360 / leadRewardWheelOptions.length;
const leadRewardWheelCenter = 50;
const leadRewardWheelRadius = 48;
const leadRewardWheelLabelRadius = 30.5;
const leadRewardParticles = [
  { x: -64, y: -34, delay: "0ms", size: 7, tone: "blue" },
  { x: -48, y: -60, delay: "70ms", size: 5, tone: "cyan" },
  { x: -24, y: -48, delay: "110ms", size: 6, tone: "orange" },
  { x: 4, y: -70, delay: "30ms", size: 7, tone: "peach" },
  { x: 30, y: -52, delay: "90ms", size: 5, tone: "blue" },
  { x: 58, y: -28, delay: "140ms", size: 6, tone: "cyan" },
  { x: -72, y: 2, delay: "120ms", size: 5, tone: "peach" },
  { x: -48, y: 34, delay: "40ms", size: 6, tone: "orange" },
  { x: -18, y: 54, delay: "150ms", size: 5, tone: "blue" },
  { x: 18, y: 48, delay: "80ms", size: 6, tone: "peach" },
  { x: 50, y: 26, delay: "20ms", size: 5, tone: "orange" },
  { x: 72, y: 0, delay: "130ms", size: 7, tone: "cyan" },
  { x: -56, y: 62, delay: "170ms", size: 4, tone: "cyan" },
  { x: 60, y: 58, delay: "155ms", size: 4, tone: "blue" },
  { x: -74, y: -58, delay: "190ms", size: 4, tone: "orange" },
  { x: 76, y: -50, delay: "185ms", size: 4, tone: "peach" },
];
const leadChoiceAutoAdvanceDelayMs = 140;

const leadProjectTypeOptions = [
  { id: "website", label: "Site internet" },
  { id: "mobile", label: "Application mobile" },
];

const websiteTypeOptions = ["Site vitrine", "E-commerce"];
const appPlatformOptions = ["iOS", "Android", "iOS + Android"];
const leadBudgetOptions = [
  "5’000 à 10’000 CHF",
  "10’000 à 15’000 CHF",
  "Plus de 15’000 CHF",
];
const websiteTimelineOptions = [
  "Urgent — moins d’un mois",
  "1 à 3 mois",
  "3 à 6 mois",
  "Pas de contrainte",
];
const mobileTimelineOptions = [
  "1 à 3 mois",
  "3 à 6 mois",
  "6 à 12 mois",
  "Pas de contrainte",
];

const teamMembers = [
  {
    id: "romain",
    name: "Romain Darioli",
    role: "Contact client, design d’interface, maquettage et développement front-end.",
    image: romainPortrait,
    imageClassName: "team-photo--romain",
  },
  {
    id: "aymeric",
    name: "Aymeric Sarrasin",
    role: "Développement full stack, architecture front-end et back-end.",
    image: aymericPortrait,
    imageClassName: "team-photo--aymeric",
  },
  {
    id: "lyndon",
    name: "Lyndon Vouilloz",
    role: "Partenaire en stratégie digitale, SEO, Google Ads et Meta Business Ads.",
    image: lyndonPortrait,
    imageClassName: "team-photo--lyndon",
  },
];

const heroTrustAvatars = teamMembers.map((member) => ({
  id: member.id,
  image: member.image,
  imageClassName: member.imageClassName,
}));

const portfolioCategoryOptions = [
  {
    id: "desktop",
    label: "Références sites web",
    deviceAsset: macBookFrameImage,
    visualClassName: "portfolio-category-device--macbook",
  },
  {
    id: "mobile",
    label: "Applications mobiles",
    deviceAsset: iphoneFrameImage,
    visualClassName: "portfolio-category-device--iphone",
  },
  {
    id: "business",
    label: "Logiciels métiers",
    deviceAsset: studioDisplayImage,
    visualClassName: "portfolio-category-device--studio",
  },
];

const portfolioProjectsBySegment = Object.fromEntries(
  portfolioCategoryOptions.map((category) => [
    category.id,
    portfolioProjects
      .filter((project) => project.segment === category.id)
      .sort((first, second) => first.order - second.order),
  ])
);

const imagePreloadCache = new Map();

const scheduleIdleWork = (callback) => {
  if (typeof window === "undefined") {
    return null;
  }

  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout: 1200 });
  }

  return window.setTimeout(callback, 180);
};

const cancelIdleWork = (id) => {
  if (id == null || typeof window === "undefined") {
    return;
  }

  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(id);
    return;
  }

  window.clearTimeout(id);
};

const preloadImage = (src, priority = "auto") => {
  if (!src || typeof window === "undefined") {
    return Promise.resolve();
  }

  const cachedPreload = imagePreloadCache.get(src);

  if (cachedPreload) {
    return cachedPreload;
  }

  const preload = new Promise((resolve) => {
    const image = new Image();

    image.decoding = "async";
    image.loading = "eager";

    if ("fetchPriority" in image) {
      image.fetchPriority = priority;
    }

    image.onload = () => {
      if (typeof image.decode === "function") {
        image
          .decode()
          .catch(() => undefined)
          .finally(resolve);
        return;
      }

      resolve();
    };

    image.onerror = resolve;
    image.src = src;
  });

  imagePreloadCache.set(src, preload);
  return preload;
};

const getProjectPreviewSources = (project) =>
  [project?.src, project?.mobileSrc].filter(Boolean);

const preloadProjectImages = (project, priority = "auto") => {
  getProjectPreviewSources(project).forEach((src) => {
    preloadImage(src, priority);
  });
};

const preloadProjectGroup = (projectsToPreload, priority = "auto") => {
  projectsToPreload.forEach((project) => {
    preloadProjectImages(project, priority);
  });
};

const getPrefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const instantTransition = { duration: 0 };
const linearInstantTransition = { duration: 0, ease: "linear" };
const deviceSpringTransition = { type: "spring", stiffness: 86, damping: 24, mass: 1.08 };
const portfolioCategoryVisualTransition = { duration: 0.38, ease: [0.4, 0, 0.2, 1] };
const portfolioCategoryIndicatorTransition = { duration: 0.42, ease: [0.4, 0, 0.2, 1] };
const referenceListTransition = { duration: 0.36, ease: [0.22, 1, 0.36, 1] };
const referenceItemTransition = {
  type: "spring",
  stiffness: 210,
  damping: 28,
  mass: 0.86,
};
const referencePanelTransition = {
  height: { duration: 0.48, ease: [0.4, 0, 0.2, 1] },
  opacity: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
};
const referencePanelInnerTransition = { duration: 0.34, ease: [0.22, 1, 0.36, 1] };
const studioBlankTransition = { duration: 0.34, ease: [0.22, 1, 0.36, 1] };
const studioShotTransition = { duration: 0.48, ease: [0.22, 1, 0.36, 1] };
const iphoneShotTransition = { duration: 0.46, ease: [0.22, 1, 0.36, 1] };

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
    <ReactLenis root options={lenisOptions}>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <Header />

      <main id="contenu">
        <Hero />
        <div className="content-section-wrapper">
          <MetricsSection />
          <TeamSection />
          <PortfolioSection />
        </div>
      </main>

      <Footer />
    </ReactLenis>
  );
}

function Header() {
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Navigation principale">
        <a className="brand-mark" href="#accueil" aria-label="SOLIS Développement">
          <img src={solisLogoNav} alt="" aria-hidden="true" decoding="async" />
        </a>

        <div className="nav-links" aria-label="Sections">
          <div className="nav-menu">
            <button
              className="nav-menu-trigger nav-link-active"
              type="button"
              aria-haspopup="true"
            >
              Accueil
            </button>
            <div className="nav-dropdown" aria-label="Menu Accueil">
              <div className="nav-dropdown-inner">
                {homeMenuItems.map((item) => (
                  <a key={item.href} href={item.href} className="nav-dropdown-link">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {serviceNavItems.map((item) => (
            <a key={item.label} href={item.href}>
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

const pickWeightedReward = () => {
  const totalWeight = leadRewardOptions.reduce((total, reward) => total + reward.weight, 0);
  let cursor = Math.random() * totalWeight;

  return (
    leadRewardOptions.find((reward) => {
      cursor -= reward.weight;
      return cursor <= 0;
    })?.label ?? leadRewardOptions[0].label
  );
};

const getRewardIndexByLabel = (label) =>
  Math.max(
    leadRewardWheelOptions.findIndex(
      (option) =>
        option.wheelLabel ===
        (leadRewardOptions.find((rewardOption) => rewardOption.label === label)?.wheelLabel ??
          leadRewardWheelOptions[0].wheelLabel)
    ),
    0
  );

const getRewardSegmentCenterAngle = (index) =>
  index * leadRewardSegmentAngle + leadRewardSegmentAngle / 2;

const getRewardTargetRotation = (label) => {
  const segmentCenterAngle = getRewardSegmentCenterAngle(getRewardIndexByLabel(label));

  return leadRewardWheelTurns * 360 + (360 - segmentCenterAngle);
};

const getRewardWheelPoint = (angle, radius = leadRewardWheelRadius) => {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;

  return {
    x: leadRewardWheelCenter + radius * Math.cos(angleInRadians),
    y: leadRewardWheelCenter + radius * Math.sin(angleInRadians),
  };
};

const getRewardWheelSegmentPath = (index) => {
  const startAngle = index * leadRewardSegmentAngle;
  const endAngle = startAngle + leadRewardSegmentAngle;
  const start = getRewardWheelPoint(startAngle);
  const end = getRewardWheelPoint(endAngle);
  const largeArcFlag = leadRewardSegmentAngle > 180 ? 1 : 0;

  return [
    `M ${leadRewardWheelCenter} ${leadRewardWheelCenter}`,
    `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${leadRewardWheelRadius} ${leadRewardWheelRadius} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
    "Z",
  ].join(" ");
};

const getRewardWheelLabelPoint = (index) =>
  getRewardWheelPoint(getRewardSegmentCenterAngle(index), leadRewardWheelLabelRadius);

const getRewardWheelLabelRotation = (index) => {
  const radialRotation = getRewardSegmentCenterAngle(index) - 90;
  const normalizedRotation = ((radialRotation + 180) % 360) - 180;

  if (normalizedRotation > 90) {
    return normalizedRotation - 180;
  }

  if (normalizedRotation < -90) {
    return normalizedRotation + 180;
  }

  return normalizedRotation;
};

const isValidLeadEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

function Hero() {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          desktopHero: "(min-width: 681px)",
          all: "(min-width: 0px)",
        },
        (context) => {
          const { reduceMotion, desktopHero } = context.conditions;
          const revealItems = gsap.utils.toArray(".hero-reveal");
          const arrowPath = heroRef.current?.querySelector(".arrow-path");
          const formCard = heroRef.current?.querySelector(".hero-form-card");
          const heroRequest = heroRef.current?.querySelector(".hero-request");
          const projectReel = heroRef.current?.querySelector(".project-reel");

          if (arrowPath) {
            const length = arrowPath.getTotalLength();
            gsap.set(arrowPath, {
              autoAlpha: reduceMotion ? 1 : 0,
              strokeDasharray: length,
              strokeDashoffset: reduceMotion ? 0 : length,
            });
          }

          if (reduceMotion || !desktopHero) {
            gsap.set([revealItems, formCard, heroRequest, projectReel].filter(Boolean), {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            });
            return undefined;
          }

          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          if (revealItems.length > 0) {
            timeline.fromTo(
              revealItems,
              {
                autoAlpha: 0,
                filter: "blur(7px)",
                x: -18,
              },
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                x: 0,
                duration: 0.76,
                stagger: 0.06,
              }
            );
          }

          if (arrowPath) {
            timeline.to(
              arrowPath,
              {
                autoAlpha: 1,
                strokeDashoffset: 0,
                duration: 0.82,
                ease: "power1.inOut",
              },
              0.42
            );
          }

          if (formCard) {
            timeline.from(
              formCard,
              {
                autoAlpha: 0,
                y: 22,
                scale: 0.985,
                duration: 0.62,
              },
              0.26
            );
          }

          if (heroRequest) {
            timeline.from(
              heroRequest,
              {
                autoAlpha: 0,
                y: 18,
                duration: 0.52,
              },
              0.7
            );
          }

          if (projectReel) {
            timeline.from(
              projectReel,
              {
                autoAlpha: 0,
                y: 18,
                scale: 0.92,
                duration: 0.58,
              },
              0.46
            );
          }

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
      {ENABLE_HERO_MOUSE_TRAIL ? <HeroMouseTrail /> : null}
      <div className={`hero-shell${ENABLE_NEW_HERO_FORM ? " hero-shell--split" : ""}`}>
        {ENABLE_NEW_HERO_FORM ? <HeroSplitContent /> : <HeroLegacyContent />}
      </div>
    </section>
  );
}

function HeroSplitContent() {
  return (
    <>
      <div className="hero-layout">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title hero-title--split">
            <span className="hero-line hero-reveal">Sites et apps mobiles</span>
            <span className="hero-line hero-reveal">
              pensés pour <br className="mobile-only" />
              générer
            </span>
            <span className="hero-line hero-reveal">des résultats.</span>
          </h1>
          <p className="hero-support hero-reveal">
            Agence de développement sur mesure pour la création de sites web et
            de boutiques e-commerce, ainsi que pour le développement
            d’applications mobiles pensées pour les PME, startups et boutiques en
            ligne en Suisse romande.
          </p>
        </div>

        <div className="hero-form-column">
          <HeroLeadForm />
        </div>
      </div>

      <HeroTrustRow />
    </>
  );
}

function HeroLegacyContent() {
  return (
    <>
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
          {SHOW_HERO_INLINE_REFERENCE_SCREEN ? <ProjectReel /> : null}
        </span>
        <span className="hero-line hero-reveal">dont les gens se souviennent</span>
      </h1>

      {ENABLE_OLD_HERO_CTA ? <HeroOldRequestCta /> : null}
    </>
  );
}

function HeroOldRequestCta() {
  return (
    <a
      className="hero-request"
      href={`${contactHref}&body=${encodeURIComponent(
        "Bonjour, j'aimerais recevoir une maquette sur mesure, offerte et sans engagement, pour imaginer un site unique, performant sur Google et pensé pour convertir mes visiteurs en clients."
      )}`}
      data-track="hero-maquette-offerte"
    >
      <span className="request-icon" aria-hidden="true">
        <span />
      </span>
      <span className="request-copy">
        <strong>Besoin de vous projeter&nbsp;?</strong>
        <span>
          Recevez une maquette sur mesure, offerte et sans engagement, pour imaginer un site unique, performant sur Google et pensé pour convertir vos visiteurs en clients.
        </span>
        <small>
          Le premier rendez-vous est également offert. Et le café est pour nous 😉
        </small>
      </span>
    </a>
  );
}

function HeroLeadForm() {
  const reducedMotion = usePrefersReducedMotion();
  const formRef = useRef(null);
  const rewardWheelRef = useRef(null);
  const rewardSpinTweenRef = useRef(null);
  const [step, setStep] = useState("reward");
  const [leadData, setLeadData] = useState({
    email: "",
    projectType: "",
    websiteType: "",
    appPlatform: "",
    budget: "",
    timeline: "",
  });
  const [reward, setReward] = useState("");
  const [pendingReward, setPendingReward] = useState("");
  const [hasSpun, setHasSpun] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [submittedPayload, setSubmittedPayload] = useState(null);
  const { contextSafe } = useGSAP({ scope: formRef });

  useEffect(() => {
    return () => {
      rewardSpinTweenRef.current?.kill();
    };
  }, []);

  const isMobileProject = leadData.projectType === "Application mobile";
  const branchStep = isMobileProject ? "appPlatform" : "websiteType";
  const branchValue = isMobileProject ? leadData.appPlatform : leadData.websiteType;
  const timelineOptions = isMobileProject ? mobileTimelineOptions : websiteTimelineOptions;
  const isRewardDrawMode = step === "reward" && hasSpun;
  const isPostRewardFlow = hasSpun && step !== "reward";
  const shouldShowFormIntro = !hasSpun;
  const shouldShowProgress = !isRewardDrawMode;
  const progressByStep = {
    reward: hasSpun ? 18 : 8,
    email: 26,
    projectType: 42,
    websiteType: 58,
    appPlatform: 58,
    budget: 74,
    timeline: 88,
    recap: 100,
    submitted: 100,
  };
  const progress = progressByStep[step] ?? 8;

  const updateLeadData = (field, value) => {
    setLeadData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleRewardSpin = contextSafe(() => {
    if (hasSpun || isSpinning) {
      return;
    }

    const selectedReward = pickWeightedReward();
    const targetRotation = getRewardTargetRotation(selectedReward);

    rewardSpinTweenRef.current?.kill();
    setHasSpun(true);
    setPendingReward(selectedReward);
    setIsSpinning(true);
    setReward("");

    if (reducedMotion || !rewardWheelRef.current) {
      if (rewardWheelRef.current) {
        gsap.set(rewardWheelRef.current, {
          rotation: targetRotation,
          transformOrigin: "50% 50%",
        });
      }

      setReward(selectedReward);
      setPendingReward("");
      setIsSpinning(false);
      return;
    }

    gsap.set(rewardWheelRef.current, {
      rotation: 0,
      transformOrigin: "50% 50%",
    });

    rewardSpinTweenRef.current = gsap.to(rewardWheelRef.current, {
      rotation: targetRotation,
      duration: leadRewardSpinDuration,
      ease: "power4.out",
      transformOrigin: "50% 50%",
      overwrite: true,
      onComplete: () => {
        setReward(selectedReward);
        setPendingReward("");
        setIsSpinning(false);
        rewardSpinTweenRef.current = null;
      },
    });
  });

  const handleRewardContinue = () => {
    if (reward) {
      setStep("email");
    }
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();

    if (!isValidLeadEmail(leadData.email)) {
      setEmailError("Indiquez un email valide pour continuer.");
      return;
    }

    setEmailError("");
    setStep("projectType");
  };

  const handleProjectTypeChange = (projectType) => {
    setLeadData((current) => ({
      ...current,
      projectType,
      websiteType: projectType === "Site internet" ? current.websiteType : "",
      appPlatform: projectType === "Application mobile" ? current.appPlatform : "",
      budget: "",
      timeline: "",
    }));
  };

  const goBack = () => {
    if (step === "email") {
      setStep("reward");
      return;
    }

    if (step === "projectType") {
      setStep("email");
      return;
    }

    if (step === "websiteType" || step === "appPlatform") {
      setStep("projectType");
      return;
    }

    if (step === "budget") {
      setStep(branchStep);
      return;
    }

    if (step === "timeline") {
      setStep("budget");
      return;
    }

    if (step === "recap") {
      setStep("timeline");
    }
  };

  const handleSubmitLead = () => {
    const payload = {
      email: leadData.email.trim(),
      projectType: leadData.projectType,
      websiteType: leadData.projectType === "Site internet" ? leadData.websiteType : "",
      appPlatform: leadData.projectType === "Application mobile" ? leadData.appPlatform : "",
      budget: leadData.budget,
      timeline: leadData.timeline,
      reward,
      createdAt: new Date().toISOString(),
    };

    setSubmittedPayload(payload);
    setStep("submitted");
  };

  const summaryItems = [
    ["Email", leadData.email.trim()],
    ["Projet", leadData.projectType],
    [isMobileProject ? "Plateforme" : "Type", branchValue],
    ["Budget", leadData.budget],
    ["Délai", leadData.timeline],
    ["Bonus", reward],
  ].filter(([, value]) => Boolean(value));

  const renderStep = () => {
    if (step === "reward") {
      const isRewardActionHidden = hasSpun && !reward;
      const rewardActionLabel =
        reward || isRewardActionHidden ? "Continuer avec mon bonus" : "Tenter ma chance";

      return (
        <div
          className={`lead-step lead-step--reward${hasSpun ? " is-playing" : ""}${
            reward ? " is-complete" : ""
          }`}
        >
          <div className="lead-step-heading lead-step-heading--reward">
            <h3>Gagnez un bonus pour votre projet</h3>
          </div>

          <div
            className={`lead-reward-stage${hasSpun ? " is-expanded" : ""}${
              reward ? " is-revealed" : ""
            }${
              isSpinning ? " is-spinning" : ""
            }`}
            aria-live="polite"
          >
            <LeadRewardWheel
              wheelRef={rewardWheelRef}
              isSpinning={isSpinning}
              showCelebration={Boolean(reward) && !reducedMotion}
            />
            {hasSpun || reward ? (
              <motion.div
                className={`lead-reward-result${reward ? "" : " is-empty"}`}
                key={reward || pendingReward || "lead-reward-placeholder"}
                initial={reducedMotion || !reward ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reducedMotion || !reward
                    ? instantTransition
                    : { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
                }
                aria-hidden={reward ? undefined : "true"}
              >
                {reward ? (
                  <>
                    <span>Bonus débloqué</span>
                    <strong>{reward}</strong>
                  </>
                ) : null}
              </motion.div>
            ) : null}
          </div>

          <div className="lead-actions lead-actions--reward">
            <button
              className={`lead-primary-button${isRewardActionHidden ? " is-hidden" : ""}`}
              type="button"
              onClick={reward ? handleRewardContinue : handleRewardSpin}
              aria-hidden={isRewardActionHidden ? "true" : undefined}
              tabIndex={isRewardActionHidden ? -1 : undefined}
            >
              {rewardActionLabel}
            </button>
          </div>
        </div>
      );
    }

    if (step === "email") {
      return (
        <form className="lead-step" onSubmit={handleEmailSubmit} noValidate>
          <div className="lead-step-heading">
            <h3>Votre email</h3>
            <p>On vous recontacte pour préparer votre maquette offerte.</p>
          </div>

          <label className="lead-field">
            <span>Email</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={leadData.email}
              onChange={(event) => {
                updateLeadData("email", event.target.value);
                if (emailError) {
                  setEmailError("");
                }
              }}
              placeholder="vous@entreprise.ch"
              aria-invalid={Boolean(emailError)}
            />
          </label>

          {emailError ? (
            <p className="lead-error" role="alert">
              {emailError}
            </p>
          ) : null}

          <div className="lead-actions">
            <button className="lead-secondary-button" type="button" onClick={goBack}>
              Retour
            </button>
            <button className="lead-primary-button" type="submit">
              Continuer
            </button>
          </div>
        </form>
      );
    }

    if (step === "projectType") {
      return (
        <LeadChoiceStep
          title="Quel projet souhaitez-vous lancer ?"
          options={leadProjectTypeOptions}
          value={leadData.projectType}
          onSelect={handleProjectTypeChange}
          onBack={goBack}
          onAdvance={setStep}
          nextStep={(selectedProjectType) =>
            selectedProjectType === "Application mobile" ? "appPlatform" : "websiteType"
          }
          optionLayout="two"
          autoAdvanceDelay={reducedMotion ? 0 : leadChoiceAutoAdvanceDelayMs}
        />
      );
    }

    if (step === "websiteType") {
      return (
        <LeadChoiceStep
          title="Type de site"
          options={websiteTypeOptions}
          value={leadData.websiteType}
          onSelect={(value) => updateLeadData("websiteType", value)}
          onBack={goBack}
          onAdvance={setStep}
          nextStep="budget"
          optionLayout="two"
          autoAdvanceDelay={reducedMotion ? 0 : leadChoiceAutoAdvanceDelayMs}
        />
      );
    }

    if (step === "appPlatform") {
      return (
        <LeadChoiceStep
          title="Plateforme"
          options={appPlatformOptions}
          value={leadData.appPlatform}
          onSelect={(value) => updateLeadData("appPlatform", value)}
          onBack={goBack}
          onAdvance={setStep}
          nextStep="budget"
          optionLayout="three"
          autoAdvanceDelay={reducedMotion ? 0 : leadChoiceAutoAdvanceDelayMs}
        />
      );
    }

    if (step === "budget") {
      return (
        <LeadChoiceStep
          title="Budget"
          options={leadBudgetOptions}
          value={leadData.budget}
          onSelect={(value) => updateLeadData("budget", value)}
          onBack={goBack}
          onAdvance={setStep}
          nextStep="timeline"
          optionLayout="balanced"
          autoAdvanceDelay={reducedMotion ? 0 : leadChoiceAutoAdvanceDelayMs}
        />
      );
    }

    if (step === "timeline") {
      return (
        <LeadChoiceStep
          title="Délai souhaité"
          options={timelineOptions}
          value={leadData.timeline}
          onSelect={(value) => updateLeadData("timeline", value)}
          onBack={goBack}
          onAdvance={setStep}
          nextStep="recap"
          optionLayout="balanced"
          autoAdvanceDelay={reducedMotion ? 0 : leadChoiceAutoAdvanceDelayMs}
        />
      );
    }

    if (step === "submitted") {
      return (
        <div className="lead-step lead-step--submitted">
          <div className="lead-step-heading">
            <h3>Merci, votre demande est prête.</h3>
            <p>
              Nous vous recontacterons dans les 24 heures pour échanger sur votre projet
              et préparer votre maquette offerte.
            </p>
          </div>
          {submittedPayload ? (
            <span className="lead-local-note">Demande enregistrée localement.</span>
          ) : null}
        </div>
      );
    }

    return (
      <div className="lead-step lead-step--recap">
        <div className="lead-step-heading">
          <h3>Votre demande est prête.</h3>
          <p>
            Nous vous recontacterons dans les 24 heures pour échanger sur votre projet
            et préparer votre maquette offerte.
          </p>
        </div>

        <dl className="lead-recap-list">
          {summaryItems.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="lead-actions">
          <button className="lead-secondary-button" type="button" onClick={goBack}>
            Retour
          </button>
          <button className="lead-primary-button" type="button" onClick={handleSubmitLead}>
            Envoyer la demande
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`hero-form-card${isRewardDrawMode ? " is-reward-draw-mode" : ""}${
        isPostRewardFlow ? " is-post-reward-flow" : ""
      }`}
      ref={formRef}
    >
      {shouldShowFormIntro ? (
        <div className="hero-form-intro">
          <h2>Besoin de vous projeter&nbsp;?</h2>
          <p>
            Recevez une maquette sur mesure, offerte et sans engagement, pour imaginer
            un site ou une application mobile sur mesure, sans template, pensé pour attirer
            et convertir.
          </p>
          <small>Premier rendez-vous offert. Café compris&nbsp;☕</small>
        </div>
      ) : null}

      {shouldShowProgress ? (
        <div className={`lead-progress${shouldShowFormIntro ? "" : " lead-progress--solo"}`} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="lead-step-frame"
          key={step}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={
            reducedMotion
              ? instantTransition
              : { duration: 0.28, ease: [0.4, 0, 0.2, 1] }
          }
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LeadRewardCelebration({ isVisible }) {
  return (
    <div className={`lead-reward-celebration${isVisible ? " is-visible" : ""}`} aria-hidden="true">
      {leadRewardParticles.map((particle, index) => (
        <span
          className={`lead-reward-particle lead-reward-particle--${particle.tone}`}
          key={`${particle.tone}-${index}`}
          style={{
            "--particle-x": `${particle.x}px`,
            "--particle-y": `${particle.y}px`,
            "--particle-delay": particle.delay,
            "--particle-size": `${particle.size}px`,
          }}
        />
      ))}
    </div>
  );
}

function LeadRewardWheel({ wheelRef, isSpinning, showCelebration }) {
  return (
    <div className="lead-roulette" aria-hidden="true">
      <div className="lead-roulette-pointer" />
      <div className="lead-roulette-wheel" ref={wheelRef}>
        <svg viewBox="0 0 100 100" role="presentation" focusable="false">
          {leadRewardWheelOptions.map((option, index) => {
            const labelPoint = getRewardWheelLabelPoint(index);
            const labelRotation = getRewardWheelLabelRotation(index);

            return (
              <g className={`lead-roulette-segment lead-roulette-segment--${option.tone}`} key={option.label}>
                <path d={getRewardWheelSegmentPath(index)} />
                <g
                  className="lead-roulette-label"
                  transform={`translate(${labelPoint.x.toFixed(3)} ${labelPoint.y.toFixed(3)}) rotate(${labelRotation.toFixed(3)})`}
                >
                  <text textAnchor="middle" dominantBaseline="middle">
                    {option.wheelLabel}
                  </text>
                </g>
              </g>
            );
          })}
          <circle className="lead-roulette-rim" cx="50" cy="50" r="48" />
          <circle className="lead-roulette-center" cx="50" cy="50" r="8.8" />
          <circle className="lead-roulette-pin" cx="50" cy="50" r="3.7" />
        </svg>
      </div>
      <div className={`lead-roulette-glow${isSpinning ? " is-active" : ""}`} />
      <LeadRewardCelebration isVisible={showCelebration} />
    </div>
  );
}

function LeadChoiceStep({
  title,
  options,
  value,
  onSelect,
  onBack,
  onAdvance,
  nextStep,
  optionLayout = "balanced",
  autoAdvanceDelay = leadChoiceAutoAdvanceDelayMs,
}) {
  const advanceTimeoutRef = useRef(null);
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { id: option, label: option } : option
  );

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const handleOptionSelect = (selectedValue) => {
    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
    }

    onSelect(selectedValue);

    const resolvedNextStep =
      typeof nextStep === "function" ? nextStep(selectedValue) : nextStep;

    if (!resolvedNextStep) {
      return;
    }

    advanceTimeoutRef.current = window.setTimeout(() => {
      advanceTimeoutRef.current = null;
      onAdvance(resolvedNextStep);
    }, autoAdvanceDelay);
  };

  return (
    <div className="lead-step">
      <div className="lead-step-heading">
        <h3>{title}</h3>
      </div>

      <div className={`lead-option-grid lead-option-grid--${optionLayout}`}>
        {normalizedOptions.map((option) => (
          <button
            className={`lead-option${value === option.label ? " is-selected" : ""}`}
            key={option.id}
            type="button"
            onClick={() => handleOptionSelect(option.label)}
            aria-pressed={value === option.label}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="lead-actions lead-actions--choice">
        <button className="lead-secondary-button" type="button" onClick={onBack}>
          Retour
        </button>
      </div>
    </div>
  );
}

function HeroTrustRow() {
  return (
    <div className="hero-trust-row">
      <HeroTrustBand />
      <ClientLogoMarquee variant="hero" />
    </div>
  );
}

function HeroTrustBand() {
  return (
    <div className="hero-trust-band" aria-label="Preuve sociale">
      <div className="hero-trust-avatars" aria-hidden="true">
        {heroTrustAvatars.map((avatar) => (
          <span className="hero-trust-avatar" key={avatar.id}>
            <img
              className={avatar.imageClassName}
              src={avatar.image}
              alt=""
              loading="eager"
              decoding="async"
            />
          </span>
        ))}
      </div>
      <div className="hero-trust-copy">
        <span className="hero-trust-stars" aria-label="5 étoiles">
          ★★★★★
        </span>
        <strong>Plus de 60 clients nous ont fait confiance</strong>
        <small>Avis Google vérifié</small>
      </div>
    </div>
  );
}

function HeroMouseTrail() {
  const trailImages = useMemo(() => getRandomizedHeroTrailImages(), []);

  useEffect(() => {
    heroTrailImages.forEach((project) => {
      preloadImage(project.src, "low");
    });
  }, []);

  if (!ENABLE_HERO_MOUSE_TRAIL || trailImages.length === 0) {
    return null;
  }

  return (
    <MouseTrail
      images={trailImages.map((project) => project.src)}
      imageWidth={heroMouseTrailImageWidth}
      imageHeight={heroMouseTrailImageHeight}
      stagger={heroMouseTrailStagger}
      duration={heroMouseTrailDuration}
      ease="power3.out"
    />
  );
}

function MouseTrail({
  images,
  imageWidth = 140,
  imageHeight = 200,
  stagger = 0.03,
  duration = 0.5,
  ease = "power3.out",
}) {
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const hasMovedRef = useRef(false);
  const containerBoundsRef = useRef(null);
  const rafIdRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let isMounted = true;

    const preloadImages = async () => {
      const imagePromises = images.map((src) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = resolve;
          image.src = src;
        });
      });

      await Promise.all(imagePromises);

      if (isMounted) {
        setImagesLoaded(true);
      }
    };

    preloadImages();

    return () => {
      isMounted = false;
    };
  }, [images]);

  useGSAP(
    () => {
      if (
        reducedMotion ||
        !imagesLoaded ||
        images.length === 0 ||
        typeof window === "undefined"
      ) {
        return undefined;
      }

      const container = containerRef.current;
      const canUseTrail =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(pointer: coarse)").matches;

      if (!container || !canUseTrail) {
        return undefined;
      }

      const updateBounds = () => {
        if (containerRef.current) {
          containerBoundsRef.current = containerRef.current.getBoundingClientRect();
        }
      };

      updateBounds();

      gsap.set(".trail-img", {
        x: -imageWidth,
        y: -imageHeight,
        opacity: 0,
        scale: 1,
        force3D: true,
        willChange: "transform, opacity",
      });

      let resizeTimeout;
      const hideTrail = () => {
        if (rafIdRef.current) {
          window.cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }

        gsap.to(".trail-img", {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          force3D: true,
        });

        hasMovedRef.current = false;
      };

      const debouncedUpdateBounds = () => {
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
          updateBounds();

          const bounds = containerBoundsRef.current;

          if (bounds && (bounds.bottom <= 0 || bounds.top >= window.innerHeight)) {
            hideTrail();
          }
        }, 16);
      };

      const handleMouseMove = (event) => {
        if (!containerRef.current || !containerBoundsRef.current) {
          return;
        }

        if (rafIdRef.current) {
          window.cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = window.requestAnimationFrame(() => {
          if (!containerRef.current || !containerBoundsRef.current) {
            return;
          }

          const containerRect = containerBoundsRef.current;
          const relativeX = event.clientX - containerRect.left;
          const relativeY = event.clientY - containerRect.top;
          const isWithinBounds =
            relativeX >= 0 &&
            relativeX <= containerRect.width &&
            relativeY >= 0 &&
            relativeY <= containerRect.height;

          if (!hasMovedRef.current && isWithinBounds) {
            hasMovedRef.current = true;
          }

          gsap.to(".trail-img", {
            x: relativeX - imageWidth / 2,
            y: relativeY - imageHeight / 2,
            opacity: hasMovedRef.current && isWithinBounds ? 1 : 0,
            force3D: true,
            duration,
            ease,
            stagger,
            overwrite: "auto",
          });
        });
      };

      const handleMouseLeave = () => {
        hideTrail();
      };

      window.addEventListener("resize", debouncedUpdateBounds);
      window.addEventListener("scroll", debouncedUpdateBounds, { passive: true });
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        if (rafIdRef.current) {
          window.cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        window.clearTimeout(resizeTimeout);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("resize", debouncedUpdateBounds);
        window.removeEventListener("scroll", debouncedUpdateBounds);
        gsap.killTweensOf(".trail-img");
      };
    },
    {
      scope: containerRef,
      dependencies: [
        duration,
        ease,
        imageHeight,
        imageWidth,
        images.length,
        imagesLoaded,
        reducedMotion,
        stagger,
      ],
    }
  );

  return (
    <div className="hero-mouse-trail-layer" ref={containerRef} aria-hidden="true">
      {imagesLoaded &&
        images.map((src, index) => (
          <span
            className="trail-img hero-mouse-trail-item"
            key={`${src}-${index}`}
            style={{
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
              zIndex: images.length - index,
            }}
          >
            <img src={src} alt="" decoding="async" draggable="false" loading="eager" />
          </span>
        ))}
    </div>
  );
}

function ProjectReel() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const reelProjects = heroReelProjects;

  useEffect(() => {
    if (reducedMotion || reelProjects.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % reelProjects.length);
    }, screenshotIntervalMs);

    return () => window.clearInterval(interval);
  }, [reducedMotion, reelProjects.length]);

  useEffect(() => {
    if (reelProjects.length <= 1) {
      return undefined;
    }

    const preloadCount = Math.min(2, reelProjects.length - 1);

    for (let offset = 1; offset <= preloadCount; offset += 1) {
      const projectToPreload = reelProjects[(index + offset) % reelProjects.length];
      preloadImage(getCarouselProjectImageSrc(projectToPreload), "low");
    }

    return undefined;
  }, [index, reelProjects]);

  const currentProject = reelProjects[index % reelProjects.length];
  const currentProjectImageSrc = getCarouselProjectImageSrc(currentProject);

  return (
    <span className="project-reel" aria-label="Aperçus de projets SOLIS">
      <span className="reel-slide" key={currentProject.id}>
        <img
          src={currentProjectImageSrc}
          alt=""
          className="carousel-project-screenshot hero-carousel-image"
          aria-hidden="true"
          decoding="async"
          fetchPriority="high"
          loading="eager"
        />
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

function ClientLogoMarquee({ variant = "section" } = {}) {
  if (activeClientLogos.length === 0) {
    return null;
  }

  const isHeroVariant = variant === "hero";
  const logoLoading = isHeroVariant ? "eager" : "lazy";
  const renderLogoGroup = (groupId) => (
    <div className="client-logo-group" aria-hidden={groupId === "duplicate" ? "true" : undefined}>
      {activeClientLogos.map((client) => (
        <span className="client-logo-slot" key={`${groupId}-${client.id}`}>
          <img
            className={`client-logo client-logo--${client.id}`}
            src={client.logo}
            alt=""
            width={client.width}
            height={client.height}
            loading={logoLoading}
            decoding="async"
          />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`client-logo-band client-logo-band--${variant}`}
      aria-label={isHeroVariant ? "Références clients dans le hero" : "Références clients"}
    >
      <div className={`client-marquee${isHeroVariant ? " hero-client-marquee" : ""}`} aria-hidden="true">
        <div className="client-marquee-track">
          {renderLogoGroup("primary")}
          {renderLogoGroup("duplicate")}
        </div>
      </div>
    </div>
  );
}

function TeamSection() {
  const teamRef = useRef(null);

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
          const heading = teamRef.current?.querySelector(".team-heading");
          const cards = gsap.utils.toArray(".team-card");

          if (reduceMotion) {
            gsap.set([heading, ...cards].filter(Boolean), {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
            });
            return undefined;
          }

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: teamRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });

          timeline
            .fromTo(
              heading,
              {
                autoAlpha: 0,
                y: 14,
                filter: "blur(4px)",
              },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.62,
                ease: "power3.out",
                immediateRender: false,
              }
            )
            .fromTo(
              cards,
              {
                autoAlpha: 0,
                y: 32,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.08,
                immediateRender: false,
              },
              0.14
            );

          return undefined;
        }
      );

      return () => mm.revert();
    },
    { scope: teamRef }
  );

  return (
    <section
      className="team-section"
      id="equipe"
      ref={teamRef}
      aria-labelledby="team-title"
    >
      <div className="team-shell">
        <div className="team-heading team-reveal">
          <h2 id="team-title">
            <span>Qui sommes-nous à</span>
            <img
              src={solisLogoNav}
              alt="Solis"
              className="team-title-logo"
              decoding="async"
            />
            <span aria-hidden="true">?</span>
          </h2>
        </div>

        <div className="team-grid" aria-label="Équipe SOLIS">
          {teamMembers.map((member) => (
            <article
              className="team-card team-reveal"
              key={member.id}
            >
              <div className="team-photo-frame">
                <img
                  src={member.image}
                  alt={member.name}
                  className={`team-photo ${member.imageClassName}`}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="team-card-copy">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  const [activeSegment, setActiveSegment] = useState("desktop");
  const [selectedId, setSelectedId] = useState(null);
  const [displayId, setDisplayId] = useState(null);
  const [transfer, setTransfer] = useState(null);
  const [instantRevealId, setInstantRevealId] = useState(null);
  const sectionRef = useRef(null);
  const selectorRef = useRef(null);
  const monitorScreenRef = useRef(null);
  const phoneScreenRef = useRef(null);
  const transferPlaneRef = useRef(null);
  const transferImageRef = useRef(null);
  const transferTimelineRef = useRef(null);
  const transferFrameRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const prefersReducedMotion = reducedMotion || getPrefersReducedMotion();

  const segmentProjects = portfolioProjectsBySegment[activeSegment] ?? [];
  const selectedProject =
    segmentProjects.find((project) => project.id === selectedId) ?? null;
  const displayProject = portfolioProjectById.get(displayId) ?? null;
  const isMobileShowcase = activeSegment === "mobile";
  const displayedPhoneProject =
    isMobileShowcase && displayProject?.type === "mobile" ? displayProject : null;
  const phonePreview = displayedPhoneProject?.mobileSrc ?? displayedPhoneProject?.src;
  const isInstantReveal = displayProject?.id === instantRevealId;
  const isTransferBlanking = Boolean(transfer) && !isInstantReveal;
  const deviceTransition = prefersReducedMotion ? instantTransition : deviceSpringTransition;

  useEffect(
    () => () => {
      if (transferFrameRef.current) {
        window.cancelAnimationFrame(transferFrameRef.current);
      }

      transferTimelineRef.current?.kill();
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const [firstProject, ...remainingProjects] = segmentProjects;

    if (firstProject) {
      preloadProjectImages(firstProject, "high");
    }

    preloadProjectGroup(remainingProjects, "auto");

    const otherSegmentProjects = portfolioCategoryOptions
      .filter((category) => category.id !== activeSegment)
      .flatMap((category) => portfolioProjectsBySegment[category.id] ?? []);
    const idleId = scheduleIdleWork(() => {
      preloadProjectGroup(otherSegmentProjects, "low");
    });

    return () => {
      cancelIdleWork(idleId);
    };
  }, [activeSegment, segmentProjects]);

  const clearTransfer = () => {
    if (transferFrameRef.current) {
      window.cancelAnimationFrame(transferFrameRef.current);
      transferFrameRef.current = null;
    }

    transferTimelineRef.current?.kill();
    transferTimelineRef.current = null;

    if (transferPlaneRef.current) {
      gsap.set(transferPlaneRef.current, { autoAlpha: 0 });
    }

    setTransfer(null);
    setInstantRevealId(null);
  };

  const buildLiquidTransferGeometry = (sourceElement, project) => {
    const section = sectionRef.current;
    const source = sourceElement ?? selectorRef.current;
    const targetScreen =
      project.type === "mobile"
        ? phoneScreenRef.current ?? monitorScreenRef.current
        : monitorScreenRef.current;

    if (!section || !source || !targetScreen) {
      return null;
    }

    const sectionRect = section.getBoundingClientRect();
    const sourceRect = source.getBoundingClientRect();
    const screenRect = targetScreen.getBoundingClientRect();
    const targetStyles = window.getComputedStyle(targetScreen);
    const sourceLabel = source.matches?.(".portfolio-reference-button")
      ? source.querySelector(":scope > span:last-child")
      : source.querySelector(".portfolio-reference-button > span:last-child");
    const originRect = sourceLabel?.getBoundingClientRect() ?? sourceRect;
    const startX = originRect.right - sectionRect.left + 12;
    const startY = originRect.top + originRect.height / 2 - sectionRect.top;
    const centerX = screenRect.left + screenRect.width * 0.5 - sectionRect.left;
    const centerY = screenRect.top + screenRect.height * 0.5 - sectionRect.top;
    const vectorX = centerX - startX;
    const distanceToTarget = Math.max(120, Math.abs(vectorX));
    const direction = vectorX >= 0 ? 1 : -1;
    const previewSrc = project.type === "mobile" ? project.mobileSrc ?? project.src : project.src;
    const targetOverscan = project.type === "mobile" ? 0 : 3;
    const targetWidth = screenRect.width + targetOverscan * 2;
    const targetHeight = screenRect.height + targetOverscan * 2;
    const targetRadius =
      targetStyles.borderRadius ||
      targetStyles.borderTopLeftRadius ||
      `${Math.max(3, screenRect.width * (project.type === "mobile" ? 0.1 : 0.006))}px`;
    const startWidth =
      project.type === "mobile"
        ? Math.min(screenRect.width * 0.32, 86)
        : Math.min(screenRect.width * 0.14, 104);
    const startHeight =
      project.type === "mobile"
        ? Math.min(screenRect.height * 0.11, 72)
        : Math.min(screenRect.height * 0.05, 18);
    const startScaleX = startWidth / targetWidth;
    const startScaleY = startHeight / targetHeight;
    const liquidClipPath =
      project.type === "mobile"
        ? "polygon(4% 18%, 56% 0%, 100% 22%, 92% 76%, 49% 100%, 0% 84%, 13% 48%)"
        : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)";
    const startClipPath =
      project.type === "mobile"
        ? "polygon(0% 28%, 45% 4%, 100% 18%, 94% 82%, 55% 100%, 6% 76%, 12% 42%)"
        : "polygon(0% 46%, 72% 14%, 100% 50%, 72% 86%, 0% 54%)";
    const finalClipPath =
      project.type === "mobile"
        ? `inset(0% round ${targetRadius})`
        : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)";
    const startRotation = project.type === "mobile" ? 4 : -5;
    const startSkewX = project.type === "mobile" ? -8 : 10;

    return {
      project,
      previewSrc,
      startX,
      startY,
      centerX,
      centerY,
      startWidth,
      startHeight,
      startScaleX,
      startScaleY,
      targetWidth,
      targetHeight,
      targetOverscan,
      targetRadius,
      startClipPath,
      liquidClipPath,
      finalClipPath,
      startRotation: project.type === "mobile" ? 0 : startRotation,
      startSkewX: project.type === "mobile" ? 0 : startSkewX,
    };
  };

  useEffect(() => {
    if (!transfer || prefersReducedMotion) {
      return undefined;
    }

    const plane = transferPlaneRef.current;
    const image = transferImageRef.current;

    if (!plane || !image) {
      return undefined;
    }

    transferTimelineRef.current?.kill();

    const isMobileTransfer = transfer.project.type === "mobile";
    const startScaleX = transfer.startScaleX ?? transfer.startWidth / transfer.targetWidth;
    const startScaleY = transfer.startScaleY ?? transfer.startHeight / transfer.targetHeight;
    const travelDuration = 0.96;
    const morphCompleteProgress = isMobileTransfer ? 0.98 : 0.72;
    const orientationDuration = travelDuration * (isMobileTransfer ? 0.36 : 0.46);
    const maskDuration = travelDuration * (isMobileTransfer ? 0.64 : 0.88);
    const maskEase = isMobileTransfer ? "sine.inOut" : "power2.in";
    const maskClipPath = isMobileTransfer ? transfer.liquidClipPath : transfer.finalClipPath;
    const commitAt = travelDuration * 0.5;
    const planeOutAt = isMobileTransfer ? travelDuration * 0.54 : travelDuration + 0.02;
    const planeOutDuration = isMobileTransfer ? 0.14 : 0.12;

    gsap.set(plane, {
      autoAlpha: 1,
      width: transfer.targetWidth,
      height: transfer.targetHeight,
      xPercent: -50,
      yPercent: -50,
      x: transfer.startX,
      y: transfer.startY,
      scaleX: startScaleX,
      scaleY: startScaleY,
      rotation: transfer.startRotation,
      skewX: transfer.startSkewX,
      borderRadius: transfer.targetRadius,
      clipPath: transfer.startClipPath,
      "--liquid-sheen-opacity": 0.72,
      "--liquid-edge-opacity": 0.62,
      "--mobile-island-opacity": isMobileTransfer ? 0 : 1,
    });

    gsap.set(image, { autoAlpha: 1 });

    const cubicPoint = (from, controlOne, controlTwo, to, progress) => {
      const inverse = 1 - progress;

      return (
        inverse * inverse * inverse * from +
        3 * inverse * inverse * progress * controlOne +
        3 * inverse * progress * progress * controlTwo +
        progress * progress * progress * to
      );
    };
    const travelState = { progress: 0 };
    const updatePlanePosition = () => {
      const progress = travelState.progress;
      const liveSectionRect = sectionRef.current?.getBoundingClientRect();
      const liveTargetScreen =
        transfer.project.type === "mobile"
          ? phoneScreenRef.current
          : monitorScreenRef.current;
      const liveTargetRect = liveTargetScreen?.getBoundingClientRect();
      const liveCenterX =
        liveSectionRect && liveTargetRect
          ? liveTargetRect.left + liveTargetRect.width * 0.5 - liveSectionRect.left
          : transfer.centerX;
      const liveCenterY =
        liveSectionRect && liveTargetRect
          ? liveTargetRect.top + liveTargetRect.height * 0.5 - liveSectionRect.top
          : transfer.centerY;
      const liveOverscan = transfer.targetOverscan ?? 0;
      const liveScaleX =
        liveTargetRect && transfer.targetWidth
          ? (liveTargetRect.width + liveOverscan * 2) / transfer.targetWidth
          : 1;
      const liveScaleY =
        liveTargetRect && transfer.targetHeight
          ? (liveTargetRect.height + liveOverscan * 2) / transfer.targetHeight
          : 1;
      const vectorX = liveCenterX - transfer.startX;
      const distance = Math.max(120, Math.abs(vectorX));
      const direction = vectorX >= 0 ? 1 : -1;
      const controlOneX = transfer.startX + direction * distance * 0.32;
      const controlOneY = transfer.startY - 10;
      const controlTwoX = liveCenterX - direction * distance * 0.36;
      const controlTwoY = liveCenterY - 34;
      const x = cubicPoint(transfer.startX, controlOneX, controlTwoX, liveCenterX, progress);
      const y = cubicPoint(transfer.startY, controlOneY, controlTwoY, liveCenterY, progress);
      const morphProgress = gsap.utils.clamp(0, 1, progress / morphCompleteProgress);
      const scaleEase = morphProgress * morphProgress;
      const scaleX = gsap.utils.interpolate(startScaleX, liveScaleX, scaleEase);
      const scaleY = gsap.utils.interpolate(startScaleY, liveScaleY, scaleEase);

      gsap.set(plane, {
        x,
        y,
        scaleX,
        scaleY,
      });
    };

    const timeline = gsap.timeline({
      onComplete: () => {
        transferTimelineRef.current = null;
        setTransfer(null);
        gsap.set(plane, { autoAlpha: 0 });
      },
    });

    transferTimelineRef.current = timeline;

    timeline
      .to(
        travelState,
        {
          progress: 1,
          duration: travelDuration,
          ease: "power3.inOut",
          onUpdate: updatePlanePosition,
          onComplete: updatePlanePosition,
        },
        0
      )
      .to(
        plane,
        {
          rotation: 0,
          skewX: 0,
          borderRadius: transfer.targetRadius,
          duration: orientationDuration,
          ease: "power2.out",
        },
        0
      )
      .to(
        plane,
        {
          clipPath: maskClipPath,
          "--liquid-sheen-opacity": isMobileTransfer ? 0.58 : 0.18,
          "--liquid-edge-opacity": isMobileTransfer ? 0.36 : 0.08,
          duration: maskDuration,
          ease: maskEase,
        },
        0
      )
      .call(
        () => {
          flushSync(() => {
            setInstantRevealId(transfer.project.id);
            setDisplayId(transfer.project.id);
          });
        },
        [],
        commitAt
      )
      .to(
        plane,
        {
          autoAlpha: 0,
          duration: planeOutDuration,
          ease: "power1.out",
        },
        planeOutAt
      );

    return () => {
      timeline.kill();
    };
  }, [prefersReducedMotion, transfer]);

  const collapseProjectSelection = () => {
    clearTransfer();
    setSelectedId(null);
    setDisplayId(null);
  };

  const commitProjectSelection = (project, sourceElement) => {
    if (!project) {
      return;
    }

    clearTransfer();
    preloadProjectImages(project, "high");
    setSelectedId(project.id);

    if (prefersReducedMotion || getPrefersReducedMotion()) {
      setDisplayId(project.id);
      return;
    }

    setDisplayId(null);

    transferFrameRef.current = window.requestAnimationFrame(() => {
      transferFrameRef.current = null;
      const nextTransfer = buildLiquidTransferGeometry(sourceElement, project);

      if (!nextTransfer) {
        setDisplayId(project.id);
        return;
      }

      setTransfer(nextTransfer);
    });
  };

  const handleProjectSelect = (project, event) => {
    if (project.id === selectedId) {
      collapseProjectSelection();
      return;
    }

    commitProjectSelection(project, event.currentTarget);
  };

  const handleSegmentChange = (segment) => {
    if (segment === activeSegment) {
      return;
    }

    clearTransfer();
    setActiveSegment(segment);
    setSelectedId(null);
    setDisplayId(null);
  };

  return (
    <section
      className="portfolio-section"
      id="projets"
      aria-labelledby="portfolio-title"
    >
      <h2 id="portfolio-title" className="visually-hidden">
        Portfolio
      </h2>

      <PortfolioCategoryVisualSelector
        activeSegment={activeSegment}
        reducedMotion={prefersReducedMotion}
        onChange={handleSegmentChange}
      />

      <div
        className="portfolio-shell"
        data-transfer-device={transfer && !prefersReducedMotion ? transfer.project.type : undefined}
        ref={sectionRef}
      >
        {transfer && !prefersReducedMotion ? (
          <div className="portfolio-transfer-layer" aria-hidden="true">
            <div
              className="portfolio-load-plane"
              data-device={transfer.project.type}
              ref={transferPlaneRef}
            >
              <img
                className="portfolio-load-plane-image transition-clone-image"
                ref={transferImageRef}
                src={transfer.previewSrc}
                alt=""
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        ) : null}

        <div className="portfolio-list-column">
          <ProjectReferences
            activeSegment={activeSegment}
            projects={segmentProjects}
            selectedId={selectedProject?.id ?? null}
            selectorRef={selectorRef}
            reducedMotion={prefersReducedMotion}
            onSelect={handleProjectSelect}
          />
        </div>

        <div className="portfolio-display-column">
          <div className="device-showcase" data-mode={isMobileShowcase ? "mobile" : "web"} aria-live="polite">
            <motion.div
              className="studio-display-wrap"
              animate={
                isMobileShowcase
                  ? {
                      x: "-14%",
                      y: -14,
                      scale: 0.72,
                      opacity: 0.42,
                      filter: "blur(0.9px) saturate(0.88)",
                    }
                  : {
                      x: "0%",
                      y: 0,
                      scale: 1,
                      opacity: 1,
                      filter: "blur(0px) saturate(1)",
                    }
              }
              transition={deviceTransition}
            >
              <div className="studio-display-stage">
                <div className="studio-screen" ref={monitorScreenRef}>
                  <AnimatePresence mode={isInstantReveal || prefersReducedMotion ? "sync" : "wait"}>
                    {isTransferBlanking || isMobileShowcase || displayProject?.type !== "web" ? (
                      <motion.div
                        className="studio-screen-blank portfolio-empty-screen"
                        key={`studio-blank-${activeSegment}`}
                        initial={prefersReducedMotion || isInstantReveal ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={
                          prefersReducedMotion || isInstantReveal
                            ? linearInstantTransition
                            : studioBlankTransition
                        }
                      />
                    ) : (
                      <motion.img
                        className="studio-screen-shot portfolio-screen-image"
                        key={displayProject.id}
                        src={displayProject.src}
                        alt={`Aperçu du projet ${displayProject.title}`}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        initial={
                          prefersReducedMotion || isInstantReveal
                            ? false
                            : { opacity: 0, filter: "blur(10px)" }
                        }
                        animate={{
                          opacity: 1,
                          filter: "blur(0px)",
                        }}
                        exit={
                          prefersReducedMotion || isInstantReveal
                            ? { opacity: 0 }
                            : { opacity: 0, filter: "blur(8px)" }
                        }
                        transition={
                          prefersReducedMotion || isInstantReveal
                            ? linearInstantTransition
                            : studioShotTransition
                        }
                      />
                    )}
                  </AnimatePresence>
                </div>

                <img
                  className="studio-display-image"
                  src={studioDisplayImage}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>

            <motion.div
              className="iphone-showcase"
              aria-hidden={!isMobileShowcase}
              animate={
                isMobileShowcase
                  ? {
                      x: "-4%",
                      y: "-2%",
                      scale: 1.1,
                      opacity: 1,
                      filter: "blur(0px)",
                    }
                  : {
                      x: "38%",
                      y: "5%",
                      scale: 0.88,
                      opacity: 0,
                      filter: "blur(10px)",
                    }
              }
              initial={false}
              transition={deviceTransition}
            >
              <div className="iphone-device">
                <div className="iphone-screen" ref={phoneScreenRef}>
                  <AnimatePresence mode={isInstantReveal || prefersReducedMotion ? "sync" : "wait"}>
                    {!isTransferBlanking && phonePreview ? (
                      <motion.img
                        className="iphone-screen-shot portfolio-screen-image"
                        key={`${displayProject.id}-phone`}
                        src={phonePreview}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        alt={
                          isMobileShowcase
                            ? `Aperçu mobile du projet ${displayProject.title}`
                            : ""
                        }
                        initial={
                          prefersReducedMotion || isInstantReveal
                            ? false
                            : { opacity: 0, filter: "blur(8px)" }
                        }
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={
                          prefersReducedMotion || isInstantReveal
                            ? { opacity: 0 }
                            : { opacity: 0, filter: "blur(8px)" }
                        }
                        transition={
                          prefersReducedMotion || isInstantReveal
                            ? linearInstantTransition
                            : iphoneShotTransition
                        }
                      />
                    ) : (
                      <motion.div
                        className="portfolio-empty-screen"
                        key={`iphone-empty-${activeSegment}`}
                        initial={prefersReducedMotion || isInstantReveal ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={
                          prefersReducedMotion || isInstantReveal
                            ? linearInstantTransition
                            : iphoneShotTransition
                        }
                      />
                    )}
                  </AnimatePresence>
                </div>
                <img
                  className="iphone-frame-image"
                  src={iphoneFrameImage}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioCategoryVisualSelector({ activeSegment, reducedMotion, onChange }) {
  return (
    <nav
      className="portfolio-category-selector"
      aria-label="Catégories de références"
    >
      {portfolioCategoryOptions.map((category) => {
        const isActive = category.id === activeSegment;

        return (
          <button
            className="portfolio-category-button"
            type="button"
            key={category.id}
            aria-pressed={isActive}
            onClick={() => onChange(category.id)}
          >
            <motion.span
              className="portfolio-category-visual"
              animate={{
                opacity: isActive ? 1 : 0.76,
                y: isActive ? 0 : 4,
                scale: isActive ? 1 : 0.96,
                filter: isActive
                  ? "saturate(1) contrast(1)"
                  : "saturate(0.78) contrast(0.94)",
              }}
              transition={
                reducedMotion
                  ? instantTransition
                  : portfolioCategoryVisualTransition
              }
            >
              <img
                className={`portfolio-category-device ${category.visualClassName}`}
                src={category.deviceAsset}
                alt={category.label}
                loading="lazy"
                decoding="async"
              />
            </motion.span>
            <span className="portfolio-category-label">{category.label}</span>
            {isActive ? (
              <motion.span
                className="portfolio-category-indicator"
                layoutId="portfolio-category-indicator"
                transition={
                  reducedMotion
                    ? instantTransition
                    : portfolioCategoryIndicatorTransition
                }
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function ProjectReferences({
  activeSegment,
  projects: referenceProjects,
  selectedId,
  selectorRef,
  reducedMotion,
  onSelect,
}) {
  const activeItemRef = useRef(null);

  useEffect(() => {
    if (selectedId) {
      activeItemRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  }, [activeSegment, reducedMotion, selectedId]);

  return (
    <nav
      className="portfolio-reference-selector"
      ref={selectorRef}
      aria-label={
        activeSegment === "desktop"
          ? "Références sites web"
          : activeSegment === "mobile"
            ? "Références applications mobiles"
            : "Références logiciels métiers"
      }
    >
      <div className="portfolio-reference-viewport">
        <motion.div
          className="portfolio-reference-list"
          key={activeSegment}
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={referenceListTransition}
        >
          {referenceProjects.map((project) => {
            const isSelected = project.id === selectedId;

            return (
              <motion.article
                className="portfolio-reference-item"
                data-active={isSelected ? "true" : "false"}
                key={project.id}
                ref={isSelected ? activeItemRef : null}
                layout="position"
                transition={referenceItemTransition}
              >
                <button
                  className="portfolio-reference-button"
                  type="button"
                  aria-expanded={isSelected}
                  aria-controls={`portfolio-reference-panel-${project.id}`}
                  onClick={(event) => onSelect(project, event)}
                >
                  <span className="portfolio-reference-icon" aria-hidden="true" />
                  <span>{project.name}</span>
                </button>

                <AnimatePresence initial={false}>
                  {isSelected ? (
                    <motion.div
                      className="portfolio-reference-panel"
                      id={`portfolio-reference-panel-${project.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={referencePanelTransition}
                    >
                      <motion.div
                        className="portfolio-reference-panel-inner"
                        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={referencePanelInnerTransition}
                      >
                        <p className="portfolio-reference-label">Description</p>
                        {project.url ? (
                          <a
                            className="portfolio-project-link"
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Voir le site
                          </a>
                        ) : null}
                        <p className="portfolio-reference-description">
                          {project.description}
                        </p>
                        <p className="portfolio-reference-label">Retour client</p>
                        <blockquote className="portfolio-reference-testimonial">
                          “{project.testimonial}”
                          <footer>
                            — {project.testimonialAuthor ?? project.client ?? project.name}
                          </footer>
                        </blockquote>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </nav>
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
  return (
    <div className="website-carousel">
      <WebsiteCarouselRow projects={metricCarouselRows.top} direction="top" />
      <WebsiteCarouselRow projects={metricCarouselRows.bottom} direction="bottom" />
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
                className={`website-shot${
                  project.type === "mobile" ? " website-shot--mobile" : ""
                }`}
                key={`${direction}-${groupIndex}-${project.id}`}
              >
                <img
                  src={getCarouselProjectImageSrc(project)}
                  alt={project.title}
                  className="carousel-project-screenshot kpi-carousel-image"
                  loading="lazy"
                  decoding="async"
                />
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
  return (
    <div className="commerce-dashboard">
      <img src={commerceProject.src} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer" id="footer" aria-labelledby="footer-title">
      <div className="footer-shell">
        <div className="footer-brand">
          <a className="footer-logo" href="#accueil" aria-label="SOLIS">
            <img
              src={solisLogoNav}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          </a>
          <p id="footer-title" className="footer-description">
            SOLIS Développement Informatique est une marque suisse, propriété de
            l'entreprise AAR Sàrl
          </p>
          <a
            className="footer-social-link"
            href={linkedInHref}
            target="_blank"
            rel="noreferrer"
            aria-label="SOLIS sur LinkedIn"
          >
            <span aria-hidden="true">in</span>
          </a>
        </div>

        <address className="footer-address">
          <strong>SOLIS</strong>
          <span>Rue du Simplon 86</span>
          <span>1920 Martigny</span>
          <span>Valais / Suisse</span>
          <a href="tel:+41798401663">+41 79 840 16 63</a>
        </address>
      </div>

      <div className="footer-bottom">
        <p>©2026 - SOLIS Développement Informatique</p>
      </div>
    </footer>
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
