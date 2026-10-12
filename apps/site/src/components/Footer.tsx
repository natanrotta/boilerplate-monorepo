import { Box, Flex, Text, chakra } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BrandMark } from "@/components/BrandMark";
import { Container } from "@/components/Section";
import { PLATFORM_URL, REPO_URL, ROUTES } from "@/content/site";
import { useLocale } from "@/hooks/useLocale";

const linkStyle = {
  color: "text.muted",
  transition: "color 0.15s",
  _hover: { color: "text.primary" },
} as const;

/** The brand, the two legal pages, the repository and a last way into the app. */
export const Footer = () => {
  const { dict } = useLocale();

  return (
    <Box as="footer" position="relative" borderTopWidth="1px" borderColor="border.subtle">
      <Container py={{ base: "32px", md: "40px" }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          gap="20px"
        >
          <Flex align="center" gap="10px">
            <BrandMark size={20} />
            <Text fontSize="13px" color="text.muted">
              <Text as="span" color="text.primary" fontWeight="600" letterSpacing="-0.02em">
                {dict.brand}
              </Text>
              {" · "}
              {dict.footer.tagline}
            </Text>
          </Flex>
          <Flex as="nav" wrap="wrap" columnGap="22px" rowGap="10px" fontSize="13px">
            <chakra.a asChild {...linkStyle}>
              <Link to={ROUTES.terms}>{dict.footer.terms}</Link>
            </chakra.a>
            <chakra.a asChild {...linkStyle}>
              <Link to={ROUTES.privacy}>{dict.footer.privacy}</Link>
            </chakra.a>
            <chakra.a href={REPO_URL} target="_blank" rel="noreferrer" {...linkStyle}>
              GitHub
            </chakra.a>
            <chakra.a href={PLATFORM_URL} {...linkStyle}>
              {dict.header.signIn}
            </chakra.a>
          </Flex>
        </Flex>
        <Text mt="24px" textStyle="mono" fontSize="11px" color="text.faint">
          © {new Date().getFullYear()} {dict.footer.rights}
        </Text>
      </Container>
    </Box>
  );
};
