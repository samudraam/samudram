import { defineConfig } from "vite";
import { resolve } from "path";

/**
 * Resolves the public path for static assets.
 * Netlify (default) uses "/". GitHub Pages project sites need "/samudram/".
 * @param {"build" | "serve"} command - Vite command mode.
 * @returns {string}
 */
const resolveBase = (command) => {
  if (command !== "build") {
    return "/";
  }

  return process.env.VITE_BASE_PATH || "/";
};

export default defineConfig(({ command }) => ({
  base: resolveBase(command),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        projects: resolve(__dirname, "projects.html"),
        project: resolve(__dirname, "project.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        curtainsDemo: resolve(__dirname, "curtains-demo.html"),
      },
    },
  },
}));
