import ecommerceImage from "../../assets/hella-boutique-desktop.png";
import contactMindImage from "../../assets/projects/contact-mind.svg";
import contactMindMobileImage from "../../assets/projects/contact-mind-mobile.svg";
import institutionalImage from "../../assets/projects/institutional.svg";
import julTerrassementImage from "../../assets/projects/jul-terrassement.svg";
import kinnImage from "../../assets/projects/kinn.svg";
import kinnMobileImage from "../../assets/projects/kinn-mobile.svg";
import laGouttiereImage from "../../assets/projects/la-gouttiere.svg";
import mobileAppImage from "../../assets/projects/mobile-app.svg";
import mmArchitectesImage from "../../assets/projects/mm-architectes.svg";
import ozamImage from "../../assets/projects/ozam.svg";
import philippeDarioliImage from "../../assets/projects/philippe-darioli.svg";
import popupChallengeImage from "../../assets/projects/popup-challenge.svg";
import popupMobileImage from "../../assets/projects/popup-mobile.svg";
import platformImage from "../../assets/projects/platform.svg";
import saasImage from "../../assets/projects/saas.svg";

export const projects = [
  {
    id: "ecommerce",
    title: "Site e-commerce",
    category: "Boutique premium",
    src: ecommerceImage,
  },
  {
    id: "mobile-app",
    title: "Application mobile",
    category: "Produit digital",
    src: mobileAppImage,
  },
  {
    id: "platform",
    title: "Plateforme métier",
    category: "Outil opérationnel",
    src: platformImage,
  },
  {
    id: "institutional",
    title: "Site institutionnel",
    category: "Présence publique",
    src: institutionalImage,
  },
  {
    id: "saas",
    title: "Logiciel SaaS",
    category: "Interface métier",
    src: saasImage,
  },
];

export const portfolioProjects = [
  {
    id: "la-gouttiere",
    type: "web",
    name: "La Gouttière",
    title: "La Gouttière",
    client: "Bar / restauration",
    category: "Web • Carte digitale",
    technologies: ["Vue", "Node.js", "CMS", "QR Code", "SEO"],
    src: laGouttiereImage,
    description:
      "Site vitrine sur mesure pour un bar a Martigny avec carte digitale accessible par QR code. L'espace editorial permet de garder les contenus a jour sans alourdir l'experience mobile.",
  },
  {
    id: "jul-terrassement",
    type: "web",
    name: "Jul Terrassement",
    title: "Jul Terrassement",
    client: "Service de machiniste",
    category: "Web • Vitrine",
    technologies: ["React", "Vite", "Forms", "SEO", "Analytics"],
    src: julTerrassementImage,
    description:
      "Vitrine digitale pour presenter les prestations et faciliter la prise de contact. La page clarifie l'offre, met en avant les moyens techniques et oriente rapidement les demandes qualifiees.",
  },
  {
    id: "ozam",
    type: "web",
    name: "OZAM",
    title: "OZAM",
    client: "Collectivités publiques & entreprises privées",
    category: "SaaS • Administration",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "API"],
    src: ozamImage,
    description:
      "Plateforme de gestion pour digitaliser les cheques famille et les aides distribuees par communes ou entreprises. Les workflows couvrent l'administration, le suivi et l'utilisation a grande echelle.",
  },
  {
    id: "philippe-darioli",
    type: "web",
    name: "Philippe Darioli",
    title: "Philippe Darioli",
    client: "Domaine viticole",
    category: "Web • E-commerce",
    technologies: ["Shopify", "Liquid", "Stripe", "CMS", "SEO"],
    src: philippeDarioliImage,
    description:
      "Site vitrine et e-commerce pour presenter un domaine viticole, ses produits et son histoire. Le parcours relie la decouverte des crus a l'achat en ligne de maniere simple et directe.",
  },
  {
    id: "popup-challenge",
    type: "mobile",
    name: "Pop-up",
    title: "Pop-up",
    client: "Tourisme & loisirs",
    category: "Mobile • App native",
    technologies: ["Swift", "Kotlin", "Vue", "Node.js", "PostgreSQL"],
    src: popupChallengeImage,
    mobileSrc: popupMobileImage,
    description:
      "Application mobile et CMS qui transforment les randonnees en quetes interactives. Les QR codes, les recompenses et l'administration de contenu structurent un produit touristique engageant.",
  },
  {
    id: "contact-mind",
    type: "mobile",
    name: "Contact Mind",
    title: "Contact Mind",
    client: "Produit digital",
    category: "Mobile • Produit digital",
    technologies: ["Swift", "Kotlin", "Vue", "Firebase", "Figma"],
    src: contactMindImage,
    mobileSrc: contactMindMobileImage,
    description:
      "Application mobile pour cartographier son carnet de contacts et organiser les relations visuellement. Le produit rend un reseau personnel plus lisible, plus navigable et plus actionnable.",
  },
  {
    id: "kinn",
    type: "mobile",
    name: "Kinn",
    title: "Kinn",
    client: "Kinn",
    category: "Mobile • App native",
    technologies: ["Swift", "Kotlin", "Vue", "Node.js", "Analytics"],
    src: kinnImage,
    mobileSrc: kinnMobileImage,
    description:
      "Application native pour guider les routines, conseiller les soins et prolonger la relation client dans un univers mobile coherent. Le produit met l'accent sur la simplicite, la recurrence et une experience de marque calme.",
  },
  {
    id: "hella",
    type: "web",
    name: "Hella",
    title: "Hella Studio",
    client: "Hella Studio",
    category: "E-commerce • Beauty",
    technologies: ["Shopify", "Vue", "Node.js", "Stripe", "Klaviyo"],
    src: ecommerceImage,
    description:
      "Boutique premium pour prolonger l'experience salon avec une selection de soins capillaires. Le parcours met en avant le conseil, les produits et une conversion fluide.",
  },
  {
    id: "mm-architectes",
    type: "web",
    name: "MM Architectes",
    title: "MM Architectes",
    client: "MM Architectes",
    category: "Web • Portfolio",
    technologies: ["React", "Vite", "GSAP", "CMS", "SEO"],
    src: mmArchitectesImage,
    description:
      "Portfolio editorial pense pour laisser les projets respirer et rendre les realisations faciles a parcourir. La structure privilegie les visuels, les fiches detaillees et une navigation sobre.",
  },
];
