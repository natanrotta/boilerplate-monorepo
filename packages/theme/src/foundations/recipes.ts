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
  borderRadius: "sm",
  bg: "bg.surface",
  borderColor: "border.default",
  borderWidth: "1.5px",
  color: "text.primary",
  fontSize: { base: "16px", md: "sm" },
  transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
  _hover: { borderColor: "border.strong" },
  _focusVisible: {
    borderColor: "border.focus",
    boxShadow: "input-focus",
    bg: "bg.surface",
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
    borderRadius: "sm",
    fontWeight: "500",
    transitionProperty: "all",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  variants: {
    variant: {
      solid: {
        bg: "bg.brand.solid",
        color: "text.onBrand",
        boxShadow: "0 1px 2px rgba(47, 128, 237, 0.20)",
        _hover: {
          bg: "bg.brand.solid-hover",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(47, 128, 237, 0.30)",
        },
        _active: {
          bg: "bg.brand.solid-active",
          transform: "translateY(0)",
          boxShadow: "0 1px 2px rgba(47, 128, 237, 0.20)",
        },
      },
      subtle: {
        bg: "bg.brand.subtle",
        color: "text.brand",
        _hover: {
          bg: "bg.brand.subtle",
          filter: "brightness(0.97)",
          transform: "translateY(-1px)",
        },
        _active: { filter: "brightness(0.94)", transform: "translateY(0)" },
      },
      ghost: {
        color: "text.primary",
        bg: "transparent",
        _hover: { bg: "bg.hover" },
        _active: { bg: "bg.active" },
      },
      outline: {
        border: "1px solid",
        borderColor: "border.default",
        color: "text.brand",
        bg: "bg.surface",
        _hover: {
          bg: "bg.brand.subtle",
          borderColor: "border.brand",
          transform: "translateY(-1px)",
        },
        _active: { filter: "brightness(0.95)", transform: "translateY(0)" },
      },
      // Destructive CTA. `colorPalette="red"` does nothing on `solid` (that
      // variant paints the brand tokens explicitly), so the destructive button
      // is its own variant instead.
      danger: {
        bg: "status.error.solid",
        // White in BOTH modes: this button is always red, so it must not follow
        // `text.onBrand` if that ever becomes a dark ink.
        color: "white",
        boxShadow: "0 1px 2px rgba(239, 68, 68, 0.20)",
        _hover: {
          filter: "brightness(0.94)",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.30)",
        },
        _active: { filter: "brightness(0.88)", transform: "translateY(0)" },
      },
    },
  },
  defaultVariants: { variant: "solid" },
});

export const badgeRecipe = defineRecipe({
  base: { borderRadius: "full", fontWeight: "600", px: 2.5, py: 1 },
});

export const inputRecipe = defineRecipe({
  base: { ...fieldBase, h: { base: "44px", md: "40px" } },
});

export const textareaRecipe = defineRecipe({
  base: { ...fieldBase },
});
