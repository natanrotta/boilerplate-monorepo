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
      // The one texture in the system: two very faint brand/accent washes in
      // the top corners of the canvas.
      backgroundImage:
        "radial-gradient(ellipse 60% 40% at 10% -10%, rgba(47, 128, 237, 0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 90% 5%, rgba(30, 178, 138, 0.05) 0%, transparent 55%)",
      _dark: {
        backgroundImage:
          "radial-gradient(ellipse 70% 50% at 12% -10%, rgba(95, 161, 255, 0.05) 0%, transparent 65%)",
      },
    },
    "*::placeholder": { color: "text.muted" },
  },
});

export const system = createSystem(defaultConfig, boilerplateThemeConfig, config);
