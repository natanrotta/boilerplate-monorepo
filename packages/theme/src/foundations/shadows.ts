import { defineTokens } from "@chakra-ui/react";

// Static shadows. Everything that has to swap between light and dark lives in
// `semantic-tokens.ts` under `shadow.*` (and the focus rings kept at the root
// of that file, so `boxShadow="input-focus"` keeps working).
export const shadows = defineTokens.shadows({
  sm: {
    value: "0px 1px 3px rgba(15, 23, 42, 0.08), 0px 1px 2px rgba(15, 23, 42, 0.04)",
  },
});
