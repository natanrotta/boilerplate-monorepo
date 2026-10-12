import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
    // Auto-open the browser on `yarn dev`, same as the web app. HMR is on by
    // default in Vite dev — edits to src hot-reload without a full refresh.
    open: true,
    // The design system is read from outside this folder (the alias below).
    fs: { allow: [fileURLToPath(new URL("../..", import.meta.url))] },
  },
  preview: {
    port: 3001,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // The product's design system, read from source. The site stays outside
      // the yarn workspaces (see DEPLOY.md), so the package is not installed:
      // it is compiled like the site's own code.
      "@boilerplate/theme": fileURLToPath(
        new URL("../../packages/theme/src/index.ts", import.meta.url),
      ),
    },
    // The theme package imports Chakra from outside this folder; it must get
    // the site's copy, not look for one of its own.
    dedupe: ["@chakra-ui/react", "@emotion/react", "react", "react-dom"],
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          chakra: ["@chakra-ui/react", "@emotion/react"],
        },
      },
    },
  },
});
