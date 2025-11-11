import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Custom plugin to serve Omnichord files from parent directory
function omnichordPlugin() {
  return {
    name: "omnichord-files",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Intercept requests to /Omnichord/*
        if (req.url?.startsWith("/Omnichord/")) {
          const filePath = path.join(__dirname, "..", req.url);
          console.log("[Omnichord Plugin] Requested:", req.url, "-> Resolved:", filePath);
          
          if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
              try {
                const fileContent = fs.readFileSync(filePath);
                const ext = path.extname(filePath).toLowerCase();
                const contentType = ext === ".wav" ? "audio/wav" : "application/octet-stream";
                res.setHeader("Content-Type", contentType);
                res.setHeader("Content-Length", stat.size);
                res.setHeader("Cache-Control", "public, max-age=31536000");
                res.end(fileContent);
                console.log("[Omnichord Plugin] Served:", req.url);
                return;
              } catch (error) {
                console.error("[Omnichord Plugin] Error reading file:", filePath, error);
              }
            }
          } else {
            console.warn("[Omnichord Plugin] File not found:", filePath);
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Allow serving files from parent directory for Omnichord audio files
    fs: {
      allow: [".."],
    },
  },
  plugins: [
    react(),
    omnichordPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
