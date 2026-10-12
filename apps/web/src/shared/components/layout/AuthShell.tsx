import { memo, type ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ACCENT_GLOW, GRID_IMAGE, GRID_MASK } from "@boilerplate/theme";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";
import { BrandMark } from "@/shared/components/ui/BrandMark";
import { ColorModeToggle } from "@/shared/components/ui/ColorModeToggle";
import { LanguageSelector } from "@/shared/components/ui/LanguageSelector";

interface AuthShellProps {
  /** "Ainda não tem conta?" / "Já tem conta?". */
  crossLinkPrompt?: string;
  /**
   * "Criar conta" / "Entrar". Omit it (and `crossLinkTo`) for a screen with no
   * sibling. Desktop only: on a phone the line under the card is the way across.
   */
  crossLinkLabel?: string;
  crossLinkTo?: string;
  children: ReactNode;
}

/**
 * The frame of the signed-out screens: a faint grid fading out from the center,
 * a slow accent glow at the top, the brand and a way to the other screen in the
 * header (with the language and the theme), and the page's content centered
 * underneath.
 */
function AuthShellComponent({
  crossLinkPrompt,
  crossLinkLabel,
  crossLinkTo,
  children,
}: AuthShellProps) {
  const { t } = useTranslation("common");

  return (
    <Flex
      data-cy="auth-shell"
      direction="column"
      position="relative"
      minH="100vh"
      overflow="hidden"
      bg="bg.canvas"
    >
      <Box
        aria-hidden
        position="absolute"
        inset={0}
        pointerEvents="none"
        bgImage={GRID_IMAGE}
        bgSize="56px 56px"
        maskImage={GRID_MASK}
      />
      <Box
        aria-hidden
        position="absolute"
        left="50%"
        top="-220px"
        w="720px"
        h="480px"
        borderRadius="full"
        pointerEvents="none"
        bgImage={ACCENT_GLOW}
        filter="blur(40px)"
        animation="drift 12s ease-in-out infinite"
        // CSS keyframes are outside `MotionConfig reducedMotion`: stop them here.
        _motionReduce={{ animation: "none" }}
      />

      <Flex
        as="header"
        position="relative"
        align="center"
        justify="space-between"
        gap={3}
        px={{ base: 4, md: 7 }}
        py={{ base: 4, md: 5 }}
      >
        <Link
          to={ROUTE_PATHS.signIn}
          data-cy="auth-shell-brand"
          aria-label={t("platform.name")}
        >
          <Flex align="center" gap="9px">
            <BrandMark size={24} />
            {/* On a phone the mark stands alone: the language and theme controls need the row. */}
            <Text
              display={{ base: "none", sm: "block" }}
              fontSize="15px"
              fontWeight="600"
              color="text.primary"
              letterSpacing="-0.02em"
            >
              {t("platform.name")}
            </Text>
          </Flex>
        </Link>
        <Flex align="center" gap={{ base: 2, md: 3.5 }} fontSize="13px">
          {crossLinkLabel && crossLinkTo ? (
            <>
              <Text color="text.muted" display={{ base: "none", lg: "block" }}>
                {crossLinkPrompt}
              </Text>
              <Text
                asChild
                display={{ base: "none", md: "block" }}
                fontWeight="500"
                color="text.primary"
                whiteSpace="nowrap"
                _hover={{ color: "text.muted" }}
              >
                <Link to={crossLinkTo} data-cy="auth-shell-cross-link">
                  {crossLinkLabel}
                </Link>
              </Text>
            </>
          ) : null}
          <LanguageSelector />
          <ColorModeToggle size="sm" />
        </Flex>
      </Flex>

      <Flex
        as="main"
        position="relative"
        flex={1}
        align="center"
        justify="center"
        px={{ base: 4, md: 6 }}
        pt={{ base: 4, md: 6 }}
        pb={{ base: 10, md: 16 }}
      >
        <Box
          w="full"
          animation="rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
          _motionReduce={{ animation: "none" }}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

export const AuthShell = memo(AuthShellComponent);
