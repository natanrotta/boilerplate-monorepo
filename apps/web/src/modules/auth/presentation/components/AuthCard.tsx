import { memo, type ReactNode } from "react";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

interface AuthIntroProps {
  /** The small mono chip above the title. */
  eyebrow?: string;
  title: string;
  subtitle: string;
}

/** The centered chip + title + line that opens every signed-out screen. */
export const AuthIntro = memo(function AuthIntro({
  eyebrow,
  title,
  subtitle,
}: AuthIntroProps) {
  return (
    <Stack gap={2.5} align="center" textAlign="center">
      {eyebrow ? (
        <Text
          textStyle="eyebrow"
          color="text.muted"
          borderWidth="1px"
          borderColor="border.default"
          borderRadius="full"
          px={2.5}
          py={1}
          bg="bg.card"
        >
          {eyebrow}
        </Text>
      ) : null}
      <Text as="h1" textStyle="display" color="text.primary" textWrap="balance">
        {title}
      </Text>
      <Text textStyle="body" color="text.muted" textWrap="pretty">
        {subtitle}
      </Text>
    </Stack>
  );
});

interface AuthScreenProps {
  intro: ReactNode;
  /** The quiet line under the card (a way back, a second option). */
  footer?: ReactNode;
  /** 380px on sign-in, wider where the form needs it. */
  maxW?: string;
  children: ReactNode;
}

/**
 * The content of a signed-out screen: the intro, one card with everything the
 * screen does, and a quiet line underneath.
 */
export const AuthScreen = memo(function AuthScreen({
  intro,
  footer,
  maxW = "380px",
  children,
}: AuthScreenProps) {
  return (
    <Stack gap={7} w="full" maxW={maxW} mx="auto">
      {intro}
      <Flex
        data-cy="auth-card"
        direction="column"
        gap={3.5}
        p={{ base: 5, md: "22px" }}
        bg="bg.card"
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="xl"
        boxShadow="shadow.authCard"
      >
        {children}
      </Flex>
      {footer ? (
        <Box textAlign="center" fontSize="13px" color="text.muted">
          {footer}
        </Box>
      ) : null}
    </Stack>
  );
});

/** The mono "OU" between two ways of doing the same thing. */
export const AuthDivider = memo(function AuthDivider({
  label,
}: {
  label: string;
}) {
  return (
    <Flex align="center" gap={3} aria-hidden>
      <Box flex={1} h="1px" bg="border.subtle" />
      <Text
        textStyle="mono"
        fontSize="11px"
        color="text.faint"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Box flex={1} h="1px" bg="border.subtle" />
    </Flex>
  );
});

/** A link in the line under the card: the accent, underlined on hover. */
export const AuthLink = memo(function AuthLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Text
      asChild
      fontWeight="500"
      color="text.link"
      _hover={{ textDecoration: "underline" }}
    >
      <RouterLink to={to}>{children}</RouterLink>
    </Text>
  );
});
