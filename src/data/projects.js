import ecommerceImage from "../../assets/hella-boutique-desktop.png";
import institutionalImage from "../../assets/projects/institutional.svg";
import mobileAppImage from "../../assets/projects/mobile-app.svg";
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
