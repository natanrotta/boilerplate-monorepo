import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
// Palettes, semantic aliases, type scale, radii, shadows, keyframes and recipes
// are the product's own (`packages/theme`), so the site and the app are one
// brand by construction. Everything below is site-only surface styling.
import { boilerplateThemeConfig } from "@boilerplate/theme";

/** Persisted color-mode key (next-themes). Mirrored by the inline script in `index.html`. */
export const COLOR_MODE_STORAGE_KEY = "boilerplate-site-color-mode";

const config = defineConfig({
  globalCss: {
    html: { scrollBehavior: "smooth", _motionReduce: { scrollBehavior: "auto" } },
    body: {
      bg: "bg.canvas",
      color: "text.primary",
      fontSize: "sm",
      minH: "100vh",
    },
    "a[href], button": { cursor: "pointer" },
    // Motion is decoration here: the drifting glow and the entrance animations
    // all stop for someone who asked for less of it.
    "*, *::before, *::after": {
      _motionReduce: {
        animationDuration: "0.01ms !important",
        animationIterationCount: "1 !important",
        transitionDuration: "0.01ms !important",
      },
    },
  },
  theme: {
    textStyles: {
      // The one statement of the page — the product's `display`, scaled up.
      hero: {
        value: {
          fontFamily: "heading",
          fontWeight: "600",
          fontSize: { base: "40px", md: "60px", lg: "72px" },
          lineHeight: "1.02",
          letterSpacing: "-0.05em",
        },
      },
      // A section's title.
      title: {
        value: {
          fontFamily: "heading",
          fontWeight: "600",
          fontSize: { base: "28px", md: "40px" },
          lineHeight: "1.1",
          letterSpacing: "-0.04em",
        },
      },
      lead: {
        value: {
          fontFamily: "body",
          fontWeight: "400",
          fontSize: { base: "16px", md: "18px" },
          lineHeight: "1.55",
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, boilerplateThemeConfig, config);
