import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/scheduler/")
          ) {
            return "react";
          }

          if (
            id.includes("/framer-motion/") ||
            id.includes("/motion-dom/") ||
            id.includes("/motion-utils/")
          ) {
            return "framer-motion";
          }

          if (id.includes("/gsap/") || id.includes("/@gsap/react/")) {
            return "gsap";
          }

          if (id.includes("/lenis/")) {
            return "lenis";
          }

          return undefined;
        },
      },
    },
  },
});
