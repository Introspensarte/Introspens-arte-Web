import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Plugin para copiar el archivo _redirects a dist/public
const copyRedirects = () => {
  return {
    name: "copy-redirects",
    closeBundle() {
      const fs = require("fs");
      const src = path.resolve(__dirname, "client/_redirects");
      const dest = path.resolve(__dirname, "dist/public/_redirects");
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log("✅ Copiado _redirects a /dist/public");
      }
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
    copyRedirects(), // <- aquí agregamos el plugin sin romper nada
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});