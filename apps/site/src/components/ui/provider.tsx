import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { COLOR_MODE_STORAGE_KEY, system } from "@/theme";

/**
 * Chakra + the color mode. The site is dark until the
 * visitor says otherwise — it does not follow the OS — and the choice sticks.
 */
export function Provider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey={COLOR_MODE_STORAGE_KEY}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
