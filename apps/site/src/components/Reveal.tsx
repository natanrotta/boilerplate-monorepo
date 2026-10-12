import { Box, type BoxProps } from "@chakra-ui/react";
import { useInView } from "@/hooks/useInView";

interface RevealProps extends BoxProps {
  /** Seconds to wait after entering the viewport — staggers siblings. */
  delay?: number;
}

/** Content that rises into place the first time it is scrolled into view. */
export const Reveal = ({ delay = 0, ...props }: RevealProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Box
      ref={ref}
      opacity={inView ? 1 : 0}
      transform={inView ? "none" : "translateY(16px)"}
      transition="opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)"
      transitionDelay={`${delay}s`}
      {...props}
    />
  );
};
