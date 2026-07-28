import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/App";
import { COLOR_MODE_STORAGE_KEY } from "@/theme";
import { Provider as ChakraUIProvider } from "@/components/ui/provider";
import { LocaleProvider } from "@/hooks/useLocale";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraUIProvider
      attribute="class"
      defaultTheme="light"
      storageKey={COLOR_MODE_STORAGE_KEY}
    >
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </ChakraUIProvider>
  </React.StrictMode>
);
