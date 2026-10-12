import type { ReactNode } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { CONTENT_MAX_W, CONTENT_PX } from "@/content/site";

/** The page's one column: the header, every section and the footer share it. */
export const Container = (props: BoxProps) => (
  <Box w="full" maxW={CONTENT_MAX_W} mx="auto" px={CONTENT_PX} {...props} />
);

interface EyebrowProps {
  children: ReactNode;
}

/** The small mono chip above a title. */
export const Eyebrow = ({ children }: EyebrowProps) => (
  <Box
    as="span"
    display="inline-block"
    textStyle="eyebrow"
    color="text.muted"
    borderWidth="1px"
    borderColor="border.default"
    borderRadius="full"
    px="10px"
    py="4px"
    bg="bg.card"
  >
    {children}
  </Box>
);
