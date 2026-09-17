import { defineTokens } from "@chakra-ui/react";

// Soft, generous corners: 6px on small controls and inputs, 10–14px on cards
// and panels, `full` for badges and pills.
export const radii = defineTokens.radii({
  none: { value: "0" },
  xs: { value: "4px" },
  sm: { value: "6px" },
  md: { value: "10px" },
  lg: { value: "14px" },
  xl: { value: "18px" },
  "2xl": { value: "24px" },
  "3xl": { value: "32px" },
  full: { value: "9999px" },
});
