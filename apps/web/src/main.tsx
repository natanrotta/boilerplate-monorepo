import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { initErrorReporter } from "./shared/lib/error-reporter";
import { installStaleChunkReloadListener } from "./shared/utils/chunkReload";
// Nunito Sans, bundled instead of fetched from Google Fonts: the type is part
// of the design, so it must not depend on a third-party request in the critical
// path (and the app renders the same offline and behind a strict CSP). The
// weights match the ones the theme's text styles ask for.
import "@fontsource/nunito-sans/300.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/500.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "@fontsource/nunito-sans/800.css";
import "./shared/i18n";
import { App } from "./app/App";

initErrorReporter();
// Self-heal a stale chunk graph (a new deploy in prod / a Vite re-optimize in
// dev) by reloading once when a dynamic import fails outside a lazy boundary.
installStaleChunkReloadListener();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
