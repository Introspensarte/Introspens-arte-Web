import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Plugin para copiar el archivo _redirects a dist/public
const copyRedirects = () => {
  return {
    name: "copy-redirects",
    closeBundle() {
      const src = path.resolve(__dirname, "_redirects");
      const dest = path.resolve(__dirname, "../dist/public/_redirects");

      if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        console.log("✅ Copiado _redirects a /dist/public");
      }
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    copyRedirects()
    // NOTA: eliminamos runtimeErrorOverlay y cartographer porque solo funcionan en Replit
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "../dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});