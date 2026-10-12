import { defineTokens } from "@chakra-ui/react";

// Tight, precise corners: 7–9px on controls and inputs, 12–14px on cards,
// menus and dialogs, 18–22px on large dialogs and sheets, `full` for pills.
export const radii = defineTokens.radii({
  none: { value: "0" },
  xs: { value: "5px" },
  sm: { value: "7px" },
  md: { value: "9px" },
  lg: { value: "12px" },
  xl: { value: "14px" },
  "2xl": { value: "18px" },
  "3xl": { value: "22px" },
  full: { value: "9999px" },
});
