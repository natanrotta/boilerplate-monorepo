import { defineTokens } from "@chakra-ui/react";

// Base color palettes (Chakra v3 tokens). Semantic aliases (bg.*, text.*,
// border.*, status.*) live in `semantic-tokens.ts` and reference these via the
// `{colors.<palette>.<step>}` syntax. Palettes NOT defined here (gray, red,
// green, purple, blackAlpha, whiteAlpha, …) come from `defaultConfig`.
//
// The look is monochrome with ONE accent: `neutral` is the near-neutral ladder
// surfaces, inks and hairlines are cut from, and `brand` is the blue-violet
// (hue 265) reserved for focus, selection and links — the primary action is
// the ink itself, not the accent. `accent` is the green that marks success.
export const colors = defineTokens.colors({
  brand: {
    50: { value: "#eff5ff" },
    100: { value: "#deebff" },
    200: { value: "#c1d8ff" },
    300: { value: "#9bbdff" },
    400: { value: "#6191ff" }, // the accent on dark
    500: { value: "#3e6fef" }, // THE accent (on light)
    600: { value: "#2955d3" },
    700: { value: "#1e41a8" },
    800: { value: "#16307a" },
    900: { value: "#0e204f" },
  },
  accent: {
    50: { value: "#e9faf1" },
    100: { value: "#c8f3dc" },
    200: { value: "#93e6bb" },
    300: { value: "#5dd69a" },
    400: { value: "#3ecf8e" },
    500: { value: "#2fb37a" },
    600: { value: "#22965f" },
    700: { value: "#18794c" },
    800: { value: "#125e3b" },
    900: { value: "#0d4a2f" },
  },
  neutral: {
    50: { value: "#fafafa" },
    100: { value: "#f4f4f5" },
    200: { value: "#ececee" },
    300: { value: "#d9d9dc" },
    400: { value: "#a8a8ad" },
    500: { value: "#8e8e95" },
    600: { value: "#6b6b70" },
    700: { value: "#4f4f56" },
    800: { value: "#2a2a2e" },
    900: { value: "#171717" },
  },
});
