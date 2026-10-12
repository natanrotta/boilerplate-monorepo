import { Box, Code, Flex, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { radii, semanticTokens, textStyles } from "@boilerplate/theme";
import * as icons from "@/shared/components/icons";
import { Label } from "../styleguide/Section";

// Swatches are read from `@boilerplate/theme`, so they follow the design with
// no edit here.

type Leaf = { path: string };

function tokenPaths(node: unknown, prefix = ""): Leaf[] {
  if (!node || typeof node !== "object") return [];
  return Object.entries(node).flatMap(([key, child]) =>
    child && typeof child === "object" && "value" in child
      ? [{ path: `${prefix}${key}` }]
      : tokenPaths(child, `${prefix}${key}.`),
  );
}

const colorTokens = tokenPaths(semanticTokens.colors);
const shadowTokens = tokenPaths(semanticTokens.shadows);
const textStyleNames = Object.keys(textStyles);
const radiusNames = Object.keys(radii).filter((name) => name !== "none");
const iconEntries = Object.entries(icons).filter(([name]) => /^[A-Z]/.test(name)) as [
  string,
  icons.IconType,
][];

export function TypographySection() {
  return (
    <Stack gap={3}>
      {textStyleNames.map((name) => (
        <Flex key={name} gap={4} align="baseline" wrap="wrap">
          <Code minW="120px">{name}</Code>
          <Text textStyle={name}>Boilerplate — base para novos produtos</Text>
        </Flex>
      ))}
    </Stack>
  );
}

export function ColorSection() {
  return (
    <SimpleGrid columns={{ base: 2, md: 4, xl: 6 }} gap={3}>
      {colorTokens.map(({ path }) => (
        <Stack key={path} gap={1}>
          <Box h={10} borderRadius="md" bg={path} borderWidth="1px" borderColor="border.subtle" />
          <Label>{path}</Label>
        </Stack>
      ))}
    </SimpleGrid>
  );
}

export function ShadowSection() {
  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
      {shadowTokens.map(({ path }) => (
        <Stack key={path} gap={2}>
          <Box h={14} borderRadius="lg" bg="bg.elevated" boxShadow={path} />
          <Label>{path}</Label>
        </Stack>
      ))}
    </SimpleGrid>
  );
}

export function RadiusSection() {
  return (
    <Flex gap={5} wrap="wrap">
      {radiusNames.map((name) => (
        <Stack key={name} gap={2} align="center">
          <Box
            boxSize={14}
            borderRadius={name}
            bg="bg.brand.subtle"
            borderWidth="1px"
            borderColor="border.brand"
          />
          <Label>{name}</Label>
        </Stack>
      ))}
    </Flex>
  );
}

export function IconSection() {
  return (
    <SimpleGrid columns={{ base: 3, sm: 4, md: 6, xl: 8 }} gap={3}>
      {iconEntries.map(([name, Icon]) => (
        <Stack key={name} gap={1.5} align="center" py={2} minW={0}>
          <Box fontSize="18px" color="text.primary">
            <Icon />
          </Box>
          <Text fontFamily="mono" fontSize="10.5px" color="text.muted" lineClamp={1} maxW="full">
            {name}
          </Text>
        </Stack>
      ))}
    </SimpleGrid>
  );
}
