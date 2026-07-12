import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pankhudiProjectsHandler from "./api/pankhudi/projects.js";

function vercelJsonResponse(res) {
  return {
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(payload) {
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(JSON.stringify(payload));
      return this;
    },
  };
}

function localPankhudiApiPlugin() {
  return {
    name: "local-pankhudi-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/pankhudi/projects")) {
          next();
          return;
        }

        try {
          await pankhudiProjectsHandler(req, vercelJsonResponse(res));
        } catch (error) {
          console.error("Local PANKHUDI API handler failed", error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json; charset=utf-8");
          }
          res.end(JSON.stringify({ error: error?.message || "Local PANKHUDI API handler failed." }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [localPankhudiApiPlugin(), react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/org-details": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
