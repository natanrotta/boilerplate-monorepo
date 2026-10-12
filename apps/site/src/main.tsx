import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/geist/wght.css";
import "@fontsource/geist-mono/400.css";
import { App } from "@/App";
import { Provider } from "@/components/ui/provider";
import { LocaleProvider } from "@/hooks/useLocale";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </Provider>
  </React.StrictMode>,
);
