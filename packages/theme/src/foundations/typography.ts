import { defineTokens } from "@chakra-ui/react";

export const fonts = defineTokens.fonts({
  // Nunito Sans carries headings and body; the mono stack is reserved for
  // identifiers, versions and timestamps. Nunito Sans is bundled with the app
  // (`@fontsource/nunito-sans`), so nothing is fetched at runtime.
  heading: { value: "'Nunito Sans', sans-serif" },
  body: { value: "'Nunito Sans', sans-serif" },
  mono: { value: "'JetBrains Mono', 'Fira Code', monospace" },
});
