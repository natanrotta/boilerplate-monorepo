import { useState } from "react";
import { LayoutGroup } from "motion/react";
import { Box, Button, Flex, SimpleGrid, Stack, chakra } from "@chakra-ui/react";
import { FiRefreshCw } from "@/shared/components/icons";
import { FadeIn, StaggerContainer, StaggerItem } from "@/shared/components/animations/FadeIn";
import { SlidingIndicator } from "@/shared/components/animations/SlidingIndicator";
import { Group } from "../styleguide/Section";

function Tile() {
  return (
    <Box h={14} borderRadius="lg" bg="bg.brand.subtle" borderWidth="1px" borderColor="border.brand" />
  );
}

const INDICATOR_OPTIONS = ["Visão geral", "Atividade", "Membros", "Faturas"] as const;

/** The smallest host of a `SlidingIndicator`: the mark lives in the selected option only. */
function SlidingIndicatorDemo() {
  const [selected, setSelected] = useState<string>(INDICATOR_OPTIONS[0]);

  return (
    <LayoutGroup id="sg-sliding-indicator">
      <Flex gap={1} wrap="wrap">
        {INDICATOR_OPTIONS.map((option) => {
          const isActive = option === selected;
          return (
            <chakra.button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(option)}
              position="relative"
              px={3}
              py={1.5}
              borderRadius="md"
              fontSize="sm"
              cursor="pointer"
              color={isActive ? "text.brand" : "text.secondary"}
              transition="color 0.14s ease"
              _hover={{ color: isActive ? "text.brand" : "text.primary" }}
            >
              {isActive ? (
                <SlidingIndicator layoutId="sg-indicator" bg="bg.brand.subtle" borderRadius="md" />
              ) : null}
              <chakra.span position="relative">{option}</chakra.span>
            </chakra.button>
          );
        })}
      </Flex>
    </LayoutGroup>
  );
}

export function MotionSection() {
  // Remounting replays the entrances.
  const [run, setRun] = useState(0);

  return (
    <Stack gap={8}>
      <Button
        size="sm"
        variant="outline"
        alignSelf="flex-start"
        onClick={() => setRun((current) => current + 1)}
      >
        <FiRefreshCw />
        Repetir animações
      </Button>
      <Group title="FadeIn — uma entrada, com atraso opcional">
        <SimpleGrid key={`fade-${run}`} columns={{ base: 2, md: 4 }} gap={4}>
          {[0, 0.1, 0.2, 0.3].map((delay) => (
            <FadeIn key={delay} delay={delay}>
              <Tile />
            </FadeIn>
          ))}
        </SimpleGrid>
      </Group>
      <Group title="StaggerContainer + StaggerItem — uma lista entrando em cascata">
        <StaggerContainer key={`stagger-${run}`}>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
            {[0, 1, 2, 3].map((index) => (
              <StaggerItem key={index}>
                <Tile />
              </StaggerItem>
            ))}
          </SimpleGrid>
        </StaggerContainer>
      </Group>
      <Group title="SlidingIndicator — a marca de seleção desliza até a nova opção (clique)">
        <SlidingIndicatorDemo />
      </Group>
    </Stack>
  );
}
