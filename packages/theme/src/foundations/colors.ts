import { defineTokens } from "@chakra-ui/react";

// Base color palettes (Chakra v3 tokens). Semantic aliases (bg.*, text.*,
// border.*, status.*) live in `semantic-tokens.ts` and reference these via the
// `{colors.<palette>.<step>}` syntax. Palettes NOT defined here (gray, red,
// green, blue, purple, blackAlpha, whiteAlpha, …) come from `defaultConfig`.
//
// Two ramps carry the identity: `brand` (blue) for the primary action, active
// navigation and focus, and `accent` (teal) for the softer, supporting hue.
// `neutral` is the slate ink/border family both share.
export const colors = defineTokens.colors({
  brand: {
    50: { value: "#eef6ff" },
    100: { value: "#d9eaff" },
    200: { value: "#b8d8ff" },
    300: { value: "#8fc0ff" },
    400: { value: "#5fa1ff" },
    500: { value: "#2f80ed" }, // THE brand blue
    600: { value: "#2569c9" },
    700: { value: "#1e529e" },
    800: { value: "#1c447f" },
    900: { value: "#1d3b6b" },
  },
  accent: {
    50: { value: "#f0fdf9" },
    100: { value: "#ccf7e8" },
    200: { value: "#95ecd0" },
    300: { value: "#5ddcb6" },
    400: { value: "#32c89f" },
    500: { value: "#1eb28a" },
    600: { value: "#178f6f" },
    700: { value: "#13745c" },
    800: { value: "#145c4a" },
    900: { value: "#124b3d" },
  },
  neutral: {
    50: { value: "#f8fafc" },
    100: { value: "#f1f5f9" },
    200: { value: "#e2e8f0" },
    300: { value: "#cbd5e1" },
    400: { value: "#94a3b8" },
    500: { value: "#64748b" },
    600: { value: "#475569" },
    700: { value: "#334155" },
    800: { value: "#1e293b" },
    900: { value: "#0f172a" },
  },
});
