import { useState, type ReactNode } from "react";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { FiCheck, FiCode, FiCopy } from "@/shared/components/icons";
import type { StyleguideSection, StyleguideUsage } from "./registry";

interface SectionProps {
  section: StyleguideSection;
  categoryTitle: string;
}

/**
 * One gallery block: what the piece is for, how to use it, and — in the
 * preview — every variation and state. `data-cy="styleguide-<id>"` on the
 * preview is the contract with `e2e/tests/design-system/styleguide-visual.spec.ts`
 * (one baseline per id); the anchor (`id="<id>"`) is what the side navigation
 * and a shared link point at.
 */
export function Section({ section, categoryTitle }: SectionProps) {
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const { id, title, description, usage, Component } = section;
  const usagePanelId = `sg-usage-${id}`;

  return (
    <Box
      as="section"
      id={id}
      aria-labelledby={`sg-title-${id}`}
      scrollMarginTop={{ base: "88px", lg: "0px" }}
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="xl"
      overflow="hidden"
      data-cy={`sg-section-${id}`}
    >
      <Flex
        align="flex-start"
        gap={4}
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 5 }}
        borderBottomWidth="1px"
        borderColor="border.subtle"
        wrap="wrap"
      >
        <Stack gap={1.5} flex="1 1 320px" minW={0}>
          <Text textStyle="eyebrow" color="text.muted">
            {categoryTitle}
          </Text>
          <Heading id={`sg-title-${id}`} as="h2" textStyle="sectionTitle">
            {title}
          </Heading>
          <Text fontSize="13px" color="text.muted" maxW="72ch">
            {description}
          </Text>
        </Stack>
        <Button
          variant="outline"
          size="sm"
          flex="none"
          aria-expanded={isUsageOpen}
          aria-controls={usagePanelId}
          onClick={() => setIsUsageOpen((current) => !current)}
          data-cy={`sg-usage-toggle-${id}`}
        >
          <FiCode />
          {isUsageOpen ? "Ocultar uso" : "Como usar"}
        </Button>
      </Flex>

      {isUsageOpen ? (
        <Stack
          id={usagePanelId}
          gap={3}
          px={{ base: 4, md: 6 }}
          py={4}
          bg="bg.sunken"
          borderBottomWidth="1px"
          borderColor="border.subtle"
          data-cy={`sg-usage-${id}`}
        >
          {usage.map((item) => (
            <UsageBlock key={item.name} usage={item} />
          ))}
        </Stack>
      ) : null}

      {/* A wide sample (a table, a KPI strip) scrolls inside its preview on a narrow screen. */}
      <Box data-cy={`styleguide-${id}`} p={{ base: 4, md: 6 }} overflowX="auto">
        <Component />
      </Box>
    </Box>
  );
}

/** One component's import line and minimal call, each copyable. */
function UsageBlock({ usage }: { usage: StyleguideUsage }) {
  const [copied, setCopied] = useState(false);
  const source = usage.importLine ? `${usage.importLine}\n\n${usage.code}` : usage.code;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // No clipboard permission: the code stays selectable.
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="md"
      bg="bg.surface"
      overflow="hidden"
    >
      <Flex align="center" gap={3} px={3.5} py={2} borderBottomWidth="1px" borderColor="border.subtle">
        <Text fontFamily="mono" fontSize="12px" fontWeight="500">
          {usage.name}
        </Text>
        <Button
          variant="ghost"
          size="2xs"
          ml="auto"
          onClick={() => void handleCopy()}
          aria-label={`Copiar exemplo de ${usage.name}`}
        >
          {copied ? <FiCheck /> : <FiCopy />}
          {copied ? "Copiado" : "Copiar"}
        </Button>
      </Flex>
      <Box
        as="pre"
        m={0}
        px={3.5}
        py={3}
        overflowX="auto"
        fontFamily="mono"
        fontSize="12px"
        lineHeight="1.6"
        color="text.secondary"
        whiteSpace="pre"
        tabIndex={0}
      >
        {usage.importLine ? (
          <Text as="span" display="block" color="text.muted" mb={2}>
            {usage.importLine}
          </Text>
        ) : null}
        {usage.code}
      </Box>
    </Box>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <Text textStyle="caption" color="text.muted">
      {children}
    </Text>
  );
}

/** The mono caption naming the token / recipe / variant a sample is built from. */
export function Token({ children }: { children: ReactNode }) {
  return (
    <Text
      fontFamily="mono"
      fontSize="10.5px"
      color="text.muted"
      lineHeight="1.3"
    >
      {children}
    </Text>
  );
}

interface SampleProps {
  /** State or variant name ("hover", "selecionado", …). */
  label: string;
  /** Token / recipe that produces it. */
  token?: string;
  children: ReactNode;
}

/** A labelled cell of a state matrix: the sample, its state and its recipe. */
export function Sample({ label, token, children }: SampleProps) {
  return (
    <Stack gap={1.5} align="flex-start" minW={0}>
      {children}
      <Label>{label}</Label>
      {token ? <Token>{token}</Token> : null}
    </Stack>
  );
}

/** A titled group inside a section. */
export function Group({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Stack gap={3}>
      <Text textStyle="eyebrow" color="text.muted">
        {title}
      </Text>
      {children}
    </Stack>
  );
}
