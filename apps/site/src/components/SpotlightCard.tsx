import type { MouseEvent } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

/** The custom properties the light under the pointer reads. */
const X = "--spot-x";
const Y = "--spot-y";

function follow(event: MouseEvent<HTMLDivElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(X, `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty(Y, `${event.clientY - box.top}px`);
}

/** A panel with a soft accent light that follows the pointer across it. */
export const SpotlightCard = ({ children, ...props }: BoxProps) => (
  <Box
    className="group"
    position="relative"
    overflow="hidden"
    bg="bg.card"
    onMouseMove={follow}
    {...props}
  >
    <Box
      aria-hidden
      position="absolute"
      inset={0}
      pointerEvents="none"
      opacity={0}
      bgImage={`radial-gradient(320px circle at var(${X}) var(${Y}), {colors.bg.glow.tertiary}, transparent 70%)`}
      transition="opacity 0.3s"
      _groupHover={{ opacity: 1 }}
    />
    <Box position="relative">{children}</Box>
  </Box>
);
