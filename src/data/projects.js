import ecommerceImage from "../../assets/hella-boutique-desktop.png";
import ecommerceCarouselImage from "../../assets/project-carousel/hella.webp";
import contactMindImage from "../../assets/projects/contact-mind.svg";
import contactMindMobileImage from "../../assets/project-screenshots/contact-mind-mobile.webp";
import kinnImage from "../../assets/projects/kinn.svg";
import kinnMobileImage from "../../assets/project-screenshots/kinn-mobile.webp";
import ozamImage from "../../assets/projects/ozam.svg";
import popupChallengeImage from "../../assets/projects/popup-challenge.svg";
import popupMobileImage from "../../assets/project-screenshots/popup-mobile.webp";
import julTerrassementCarouselImage from "../../assets/project-carousel/jul-terrassement.webp";
import julTerrassementScreenshot from "../../assets/project-screenshots/jul-terrassement.png";
import laGouttiereCarouselImage from "../../assets/project-carousel/la-gouttiere.webp";
import laGouttiereScreenshot from "../../assets/project-screenshots/la-gouttiere.png";
import leFournilDeMelchiorCarouselImage from "../../assets/project-carousel/le-fournil-de-melchior.webp";
import mmArchitectesCarouselImage from "../../assets/project-carousel/mm-architectes.webp";
import mmArchitectesScreenshot from "../../assets/project-screenshots/mm-architectes.png";
import milleVadrouillesCarouselImage from "../../assets/project-carousel/mille-vadrouilles.webp";
import philippeDarioliCarouselImage from "../../assets/project-carousel/philippe-darioli.webp";
import philippeDarioliScreenshot from "../../assets/project-screenshots/philippe-darioli.png";

export const projects = [
  {
    id: "ecommerce",
    title: "Hella",
    category: "Boutique premium",
    src: ecommerceImage,
    carouselSrc: ecommerceCarouselImage,
  },
  {
    id: "mobile-app",
    title: "Jul Terrassement",
    category: "Site vitrine",
    src: julTerrassementScreenshot,
    carouselSrc: julTerrassementCarouselImage,
  },
  {
    id: "kinn-mobile",
    title: "Kinn",
    category: "Application mobile",
    type: "mobile",
    src: kinnMobileImage,
    carouselSrc: kinnMobileImage,
  },
  {
    id: "platform",
    title: "La Gouttière",
    category: "Carte digitale",
    src: laGouttiereScreenshot,
    carouselSrc: laGouttiereCarouselImage,
  },
  {
    id: "contact-mind-mobile",
    title: "Contact Mind",
    category: "Application mobile",
    type: "mobile",
    src: contactMindMobileImage,
    carouselSrc: contactMindMobileImage,
  },
  {
    id: "le-fournil-de-melchior",
    title: "Le Fournil de Melchior",
    category: "Site vitrine",
    src: leFournilDeMelchiorCarouselImage,
    carouselSrc: leFournilDeMelchiorCarouselImage,
  },
  {
    id: "mille-vadrouilles",
    title: "Mille.vadrouilles",
    category: "Carte interactive",
    src: milleVadrouillesCarouselImage,
    carouselSrc: milleVadrouillesCarouselImage,
  },
  {
    id: "institutional",
    title: "MM Architectes",
    category: "Portfolio",
    src: mmArchitectesScreenshot,
    carouselSrc: mmArchitectesCarouselImage,
  },
  {
    id: "popup-mobile",
    title: "Pop-up",
    category: "Application mobile",
    type: "mobile",
    src: popupMobileImage,
    carouselSrc: popupMobileImage,
  },
  {
    id: "saas",
    title: "Philippe Darioli",
    category: "E-commerce",
    src: philippeDarioliScreenshot,
    carouselSrc: philippeDarioliCarouselImage,
  },
];

export const portfolioProjects = [
  {
    id: "la-gouttiere",
    segment: "desktop",
    order: 6,
    type: "web",
    name: "La Gouttière",
    title: "La Gouttière",
    client: "Bar / restauration",
    testimonialAuthor: "La Gouttière",
    category: "Web • Carte digitale",
    technologies: ["Vue", "Node.js", "CMS", "QR Code", "SEO"],
    src: laGouttiereScreenshot,
    url: "https://www.bar-la-gouttiere.ch/",
    description:
      "Nous avons conçu une plateforme sur mesure pour traduire l’identité du bar en ligne, valoriser son ambiance et mettre en avant ses produits, ses événements et ses actualités. Le site intègre une carte digitale consultable facilement via QR code sur place, une galerie photo et un espace d’administration permettant au client de gérer ses contenus en autonomie.",
    testimonial:
      "Une présence digitale claire qui simplifie le quotidien et donne aux clients les bonnes informations au bon moment.",
  },
  {
    id: "jul-terrassement",
    segment: "desktop",
    order: 1,
    type: "web",
    name: "Jul Terrassement",
    title: "Jul Terrassement",
    client: "Service de machiniste",
    testimonialAuthor: "Jul Terrassement",
    category: "Web • Vitrine",
    technologies: ["React", "Vite", "Forms", "SEO", "Analytics"],
    src: julTerrassementScreenshot,
    url: "https://www.jul-terrassement.ch/",
    description:
      "Nous avons conçu un site vitrine moderne, responsive et simple à administrer pour mettre en valeur les services de Jul Terrassement. Le projet combine design clair, SEO local et gestion de contenu intuitive afin de renforcer la visibilité en ligne et transformer les visiteurs en contacts qualifiés.",
    testimonial:
      "Le site met immédiatement en confiance et transforme les demandes entrantes en contacts mieux qualifiés.",
  },
  {
    id: "ozam",
    segment: "business",
    order: 1,
    type: "web",
    name: "OZAM",
    title: "OZAM",
    client: "Collectivités publiques & entreprises privées",
    testimonialAuthor: "OZAM",
    category: "SaaS • Administration",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "API"],
    src: ozamImage,
    description:
      "Plateforme de gestion pour digitaliser les chèques famille, les aides et leur suivi à grande échelle.",
    testimonial:
      "Une interface robuste qui rend un processus administratif sensible plus lisible, plus rapide et plus simple à piloter.",
  },
  {
    id: "philippe-darioli",
    segment: "desktop",
    order: 5,
    type: "web",
    name: "Philippe Darioli",
    title: "Philippe Darioli",
    client: "Domaine viticole",
    testimonialAuthor: "Philippe Darioli, Vigneron-encaveur",
    category: "Web • E-commerce",
    technologies: ["Shopify", "Liquid", "Stripe", "CMS", "SEO"],
    src: philippeDarioliScreenshot,
    url: "https://www.philippe-darioli.ch/",
    description:
      "Nous avons conçu un site web avec e-shop pour valoriser le domaine, présenter ses produits et structurer un parcours d’achat clair, moderne et responsive. Le projet a notamment permis de recentrer le catalogue autour des best-sellers, afin de faciliter la décision d’achat et d’améliorer concrètement les conversions.",
    testimonial:
      "De notre première réunion à la première commande enregistrée sur mon site, SOLIS et leurs équipes ont démontré un suivi et une réactivité qui ont permis de m'éviter quelques nuits blanches.",
  },
  {
    id: "popup-challenge",
    segment: "mobile",
    order: 3,
    type: "mobile",
    name: "Pop-up",
    title: "Pop-up",
    client: "Tourisme & loisirs",
    testimonialAuthor: "Pop-up",
    category: "Mobile • App native",
    technologies: ["Swift", "Kotlin", "Vue", "Node.js", "PostgreSQL"],
    src: popupChallengeImage,
    mobileSrc: popupMobileImage,
    description:
      "Application mobile et CMS pour transformer les randonnées en quêtes interactives avec QR codes et récompenses.",
    testimonial:
      "Le mobile devient le compagnon naturel de l'expérience terrain, sans perdre la simplicité du parcours.",
  },
  {
    id: "contact-mind",
    segment: "mobile",
    order: 2,
    type: "mobile",
    name: "Contact Mind",
    title: "Contact Mind",
    client: "Produit digital",
    testimonialAuthor: "Contact Mind",
    category: "Mobile • Produit digital",
    technologies: ["Swift", "Kotlin", "Vue", "Firebase", "Figma"],
    src: contactMindImage,
    mobileSrc: contactMindMobileImage,
    description:
      "Application mobile pour visualiser son carnet de contacts et rendre son réseau plus lisible et actionnable.",
    testimonial:
      "Une idée complexe rendue tangible grâce à une interface qui donne immédiatement envie d'explorer son réseau.",
  },
  {
    id: "kinn",
    segment: "mobile",
    order: 1,
    type: "mobile",
    name: "Kinn",
    title: "Kinn",
    client: "Kinn",
    testimonialAuthor: "Kinn",
    category: "Mobile • App native",
    technologies: ["Swift", "Kotlin", "Vue", "Node.js", "Analytics"],
    src: kinnImage,
    mobileSrc: kinnMobileImage,
    description:
      "Application native pour guider les routines, conseiller les soins et prolonger la relation client.",
    testimonial:
      "L'application prolonge l'univers de marque avec une expérience mobile douce, utile et parfaitement lisible.",
  },
  {
    id: "hella",
    segment: "desktop",
    order: 4,
    type: "web",
    name: "Hella",
    title: "Hella Studio",
    client: "Hella Studio",
    testimonialAuthor: "Hella Studio",
    category: "E-commerce • Beauty",
    technologies: ["Shopify", "Vue", "Node.js", "Stripe", "Klaviyo"],
    src: ecommerceImage,
    description:
      "Boutique premium pour prolonger l'expérience salon, mettre en avant le conseil et fluidifier l'achat.",
    testimonial:
      "La boutique garde le niveau de soin du salon et transforme la recommandation produit en expérience premium.",
  },
  {
    id: "mm-architectes",
    segment: "desktop",
    order: 3,
    type: "web",
    name: "MM Architectes",
    title: "MM Architectes",
    client: "MM Architectes",
    testimonialAuthor: "MM Architectes",
    category: "Web • Portfolio",
    technologies: ["React", "Vite", "GSAP", "CMS", "SEO"],
    src: mmArchitectesScreenshot,
    description:
      "Portfolio éditorial qui laisse respirer les projets avec une navigation sobre et des visuels au premier plan.",
    testimonial:
      "Un portfolio silencieux et précis, où la navigation se met en retrait pour laisser les projets parler.",
  },
];
