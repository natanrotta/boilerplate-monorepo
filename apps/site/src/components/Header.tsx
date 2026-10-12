import { Box, Flex, Text, chakra } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { BrandMark } from "@/components/BrandMark";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Container } from "@/components/Section";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HOW_IT_WORKS_ID, PLATFORM_URL, ROUTES } from "@/content/site";
import { useLocale } from "@/hooks/useLocale";
import { useScrolled } from "@/hooks/useScrolled";

/**
 * The brand, a way to the app, the language and the theme switch. Transparent
 * over the top of the page; once the page scrolls it turns into frosted glass
 * with a hairline under it.
 */
export const Header = () => {
  const scrolled = useScrolled();
  const { pathname } = useLocation();
  const { dict } = useLocale();

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      borderBottomWidth="1px"
      borderColor={scrolled ? "border.subtle" : "transparent"}
      bg={scrolled ? "bg.glass" : "transparent"}
      backdropFilter={scrolled ? "saturate(180%) blur(14px)" : "none"}
      transition="background 0.2s, border-color 0.2s"
    >
      <Container>
        <Flex align="center" justify="space-between" h="64px">
          <Link to={ROUTES.home} aria-label={dict.brand}>
            <Flex align="center" gap="9px">
              <BrandMark />
              <Text fontSize="15px" fontWeight="600" color="text.primary" letterSpacing="-0.02em">
                {dict.brand}
              </Text>
            </Flex>
          </Link>
          <Flex align="center" gap={{ base: "8px", md: "14px" }} fontSize="13px">
            {pathname === ROUTES.home ? (
              <chakra.a
                href={`#${HOW_IT_WORKS_ID}`}
                display={{ base: "none", sm: "block" }}
                pr="4px"
                color="text.muted"
                transition="color 0.15s"
                _hover={{ color: "text.primary" }}
              >
                {dict.header.howItWorks}
              </chakra.a>
            ) : null}
            <LanguageSwitcher />
            <ThemeToggle />
            <chakra.a
              href={PLATFORM_URL}
              display="flex"
              alignItems="center"
              h="32px"
              px="14px"
              borderRadius="sm"
              bg="bg.primary"
              color="text.onPrimary"
              fontWeight="500"
              transition="background 0.15s"
              _hover={{ bg: "bg.primaryHover" }}
              _focusVisible={{ outline: "none", boxShadow: "shadow.focus" }}
            >
              {dict.header.signIn}
            </chakra.a>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
