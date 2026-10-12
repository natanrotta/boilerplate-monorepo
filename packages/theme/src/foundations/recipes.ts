import { defineRecipe } from "@chakra-ui/react";

// Single-slot component recipes. `createSystem` merges them over Chakra v3's
// default recipes (default sizes and states are preserved; these override the
// visual variants the app relies on).
//
// The multi-part v3 components (menu, dialog, drawer, field, native-select,
// number-input, pin-input) are deliberately NOT re-declared as slotRecipes:
// those render exclusively through the snippets in `apps/web/src/components/ui/*`,
// which apply the same chrome via style props. One definition point, no
// config-merge surprises.

/**
 * The shared field chrome. `input` and `textarea` are single-slot recipes and
 * pick it up automatically; the slot-recipe fields (`NativeSelect`,
 * `NumberInput`) spread it by hand in their snippet so a select sits flush with
 * the text inputs next to it.
 */
export const fieldBase = {
  borderRadius: "md",
  bg: "bg.input",
  borderColor: "border.default",
  borderWidth: "1px",
  color: "text.primary",
  fontSize: { base: "16px", md: "sm" },
  transition: "box-shadow 0.15s, border-color 0.15s",
  _hover: { borderColor: "border.strong" },
  // Focus is the accent border plus the 3px ring — nothing else moves.
  _focusVisible: {
    borderColor: "border.focus",
    boxShadow: "input-focus",
    bg: "bg.input",
    outline: "none",
  },
  _invalid: { borderColor: "status.error.fg", boxShadow: "input-error" },
  _placeholder: { color: "text.muted", fontSize: "sm" },
  _disabled: {
    borderColor: "border.subtle",
    bg: "bg.muted",
    opacity: 0.7,
    cursor: "not-allowed",
  },
  _readOnly: {
    borderColor: "border.default",
    bg: "bg.muted",
    cursor: "default",
    _focusVisible: { boxShadow: "none", borderColor: "border.default" },
  },
} as const;

export const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "md",
    fontWeight: "500",
    transitionProperty: "background, border-color, opacity, transform",
    transitionDuration: "150ms",
    _active: { transform: "scale(0.99)" },
  },
  variants: {
    variant: {
      // The primary action: the ink inverted (black on light, near-white on
      // dark). The accent is for focus, selection and links — never for this.
      solid: {
        bg: "bg.primary",
        color: "text.onPrimary",
        _hover: { bg: "bg.primaryHover" },
        _active: { bg: "bg.primaryActive" },
      },
      subtle: {
        bg: "bg.brand.subtle",
        color: "text.brand",
        _hover: { bg: "bg.brand.subtle", filter: "brightness(0.96)" },
        _active: { filter: "brightness(0.92)" },
      },
      ghost: {
        color: "text.primary",
        bg: "transparent",
        _hover: { bg: "bg.hover" },
        _active: { bg: "bg.active" },
      },
      // The secondary action: a bordered panel.
      outline: {
        // Longhands on purpose: the `border` shorthand resets the color to
        // `currentColor` when it lands after `borderColor` in the stylesheet.
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "border.default",
        color: "text.primary",
        bg: "bg.surface",
        _hover: { bg: "bg.hover" },
        _active: { bg: "bg.active" },
      },
      // Destructive CTA. `colorPalette="red"` does nothing on `solid` (that
      // variant paints the primary tokens explicitly), so the destructive
      // button is its own variant instead.
      danger: {
        bg: "status.error.solid",
        // White in BOTH modes: this button is always red, so it must not follow
        // `text.onPrimary`, which is a dark ink on the dark canvas.
        color: "white",
        _hover: { filter: "brightness(0.94)" },
        _active: { filter: "brightness(0.88)" },
      },
    },
  },
  defaultVariants: { variant: "solid" },
});

export const badgeRecipe = defineRecipe({
  base: { borderRadius: "full", fontWeight: "500", px: 2.5, py: 1 },
});

export const inputRecipe = defineRecipe({
  base: { ...fieldBase, h: { base: "44px", md: "40px" } },
});

export const textareaRecipe = defineRecipe({
  base: { ...fieldBase },
});
