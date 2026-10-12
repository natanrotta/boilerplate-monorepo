import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
// Palettes, semantic aliases, type scale, radii, shadows and component recipes
// live in `@boilerplate/theme`. Everything below is web-only surface styling.
import { boilerplateThemeConfig } from "@boilerplate/theme";

/**
 * Persisted color-mode key. Consumed by the `next-themes` provider
 * (`storageKey`) in `components/ui/provider`, which also keeps
 * `defaultTheme="system"` — the OS preference wins on the very first visit, an
 * explicit choice sticks after. Kept stable across the v2 → v3 migration so a
 * returning user keeps the mode they picked.
 */
export const COLOR_MODE_STORAGE_KEY = "boilerplate-color-mode";

const config = defineConfig({
  globalCss: {
    body: {
      bg: "bg.canvas",
      color: "text.primary",
      fontSize: "sm",
      minH: "100vh",
    },
    "*::placeholder": { color: "text.muted" },
  },
});

export const system = createSystem(defaultConfig, boilerplateThemeConfig, config);
