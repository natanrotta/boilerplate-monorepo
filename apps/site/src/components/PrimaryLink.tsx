import { Box, chakra } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";

interface PrimaryLinkProps {
  href: string;
  label: string;
}

/**
 * The page's main action — the app's own primary button (the inverted ink),
 * as a pill-shaped link that leaves the site.
 */
export const PrimaryLink = ({ href, label }: PrimaryLinkProps) => (
  <chakra.a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="group"
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    flexShrink={0}
    gap="8px"
    h="46px"
    px="22px"
    borderRadius="full"
    bg="bg.primary"
    color="text.onPrimary"
    fontSize="15px"
    fontWeight="500"
    whiteSpace="nowrap"
    boxShadow="shadow.panel"
    transition="background 0.15s, transform 0.15s"
    _hover={{ bg: "bg.primaryHover" }}
    _active={{ transform: "scale(0.98)" }}
    _focusVisible={{ outline: "none", boxShadow: "shadow.focus" }}
  >
    {label}
    <Box
      asChild
      boxSize="16px"
      transition="transform 0.2s"
      _groupHover={{ transform: "translateX(3px)" }}
      aria-hidden
    >
      <ArrowRight />
    </Box>
  </chakra.a>
);
