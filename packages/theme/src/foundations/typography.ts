import { defineTokens } from "@chakra-ui/react";

export const fonts = defineTokens.fonts({
  // Geist carries headings and body. Geist Mono is a second voice, not a code
  // font: identifiers, versions, counters and the small uppercase labels. Both
  // are bundled with each app (`@fontsource-variable/geist`,
  // `@fontsource/geist-mono`), so nothing is fetched at runtime.
  heading: { value: "'Geist Variable', ui-sans-serif, system-ui, sans-serif" },
  body: { value: "'Geist Variable', ui-sans-serif, system-ui, sans-serif" },
  mono: { value: "'Geist Mono', ui-monospace, monospace" },
});
