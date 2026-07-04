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
    segment: "desktop",
    order: 6,
    type: "web",
    name: "La Gouttière",
    title: "La Gouttière",
    client: "Bar / restauration",
    testimonialAuthor: "La Gouttière",
    category: "Web • Carte digitale",
    technologies: ["Vue", "Node.js", "CMS", "QR Code", "SEO"],
    src: laGouttiereImage,
    description:
      "Site vitrine pour un bar a Martigny, avec carte digitale par QR code et contenus faciles a garder a jour.",
    testimonial:
      "Une presence digitale claire qui simplifie le quotidien et donne aux clients les bonnes informations au bon moment.",
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
    src: julTerrassementImage,
    description:
      "Vitrine claire pour presenter les prestations, rassurer les visiteurs et orienter les demandes qualifiees.",
    testimonial:
      "Le site met immediatement en confiance et transforme les demandes entrantes en contacts mieux qualifies.",
  },
  {
    id: "ozam",
    segment: "desktop",
    order: 2,
    type: "web",
    name: "OZAM",
    title: "OZAM",
    client: "Collectivités publiques & entreprises privées",
    testimonialAuthor: "OZAM",
    category: "SaaS • Administration",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "API"],
    src: ozamImage,
    description:
      "Plateforme de gestion pour digitaliser les cheques famille, les aides et leur suivi a grande echelle.",
    testimonial:
      "Une interface robuste qui rend un processus administratif sensible plus lisible, plus rapide et plus simple a piloter.",
  },
  {
    id: "philippe-darioli",
    segment: "desktop",
    order: 5,
    type: "web",
    name: "Philippe Darioli",
    title: "Philippe Darioli",
    client: "Domaine viticole",
    testimonialAuthor: "Philippe Darioli",
    category: "Web • E-commerce",
    technologies: ["Shopify", "Liquid", "Stripe", "CMS", "SEO"],
    src: philippeDarioliImage,
    description:
      "Site vitrine et e-commerce pour presenter le domaine, ses crus et faciliter l'achat en ligne.",
    testimonial:
      "L'experience garde l'esprit du domaine tout en donnant un acces simple aux produits et aux commandes.",
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
      "Application mobile et CMS pour transformer les randonnees en quetes interactives avec QR codes et recompenses.",
    testimonial:
      "Le mobile devient le compagnon naturel de l'experience terrain, sans perdre la simplicite du parcours.",
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
      "Application mobile pour visualiser son carnet de contacts et rendre son reseau plus lisible et actionnable.",
    testimonial:
      "Une idee complexe rendue tangible grace a une interface qui donne immediatement envie d'explorer son reseau.",
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
      "L'application prolonge l'univers de marque avec une experience mobile douce, utile et parfaitement lisible.",
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
      "Boutique premium pour prolonger l'experience salon, mettre en avant le conseil et fluidifier l'achat.",
    testimonial:
      "La boutique garde le niveau de soin du salon et transforme la recommandation produit en experience premium.",
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
    src: mmArchitectesImage,
    description:
      "Portfolio editorial qui laisse respirer les projets avec une navigation sobre et des visuels au premier plan.",
    testimonial:
      "Un portfolio silencieux et precis, ou la navigation se met en retrait pour laisser les projets parler.",
  },
];
