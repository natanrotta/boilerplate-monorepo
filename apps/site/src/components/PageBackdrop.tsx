import { Box } from "@chakra-ui/react";
import { ACCENT_GLOW, GRID_IMAGE, GRID_MASK } from "@boilerplate/theme";

/**
 * What sits behind the top of every page: a faint grid fading out from the
 * center and a slow accent glow.
 */
export const PageBackdrop = () => (
  <Box aria-hidden position="absolute" insetX={0} top={0} h="900px" pointerEvents="none">
    <Box
      position="absolute"
      inset={0}
      bgImage={GRID_IMAGE}
      bgSize="56px 56px"
      maskImage={GRID_MASK}
    />
    <Box
      position="absolute"
      left="50%"
      top="-220px"
      w={{ base: "520px", md: "820px" }}
      h="480px"
      borderRadius="full"
      bgImage={ACCENT_GLOW}
      filter="blur(40px)"
      animation="drift 12s ease-in-out infinite"
    />
  </Box>
);
