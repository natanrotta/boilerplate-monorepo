import { memo } from "react";
import { Box, Flex, Stat, Text } from "@chakra-ui/react";
import type { IconType } from "@/shared/components/icons";
import { SectionCard } from "@/shared/components/ui/SectionCard";

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: IconType;
  trend?: "up" | "down" | "neutral";
}

const trendColors = {
  up: "text.accent",
  down: "status.error.fg",
  neutral: "text.secondary",
} as const;

export const StatCard = memo(function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend = "neutral",
}: StatCardProps) {
  return (
    <SectionCard>
      <Flex justify="space-between" align="flex-start">
        <Stat.Root>
          <Stat.Label color="text.secondary" fontWeight="500">
            {label}
          </Stat.Label>
          <Stat.ValueText mt={2} fontSize={{ base: "2xl", md: "3xl" }} color="text.primary">
            {value}
          </Stat.ValueText>
          <Stat.HelpText mb={0} mt={2}>
            <Text color={trendColors[trend]} fontWeight="600" as="span">
              {hint}
            </Text>
          </Stat.HelpText>
        </Stat.Root>

        <Box
          p={2.5}
          borderRadius="md"
          bg="bg.brand.subtle"
          color="text.brand"
          borderWidth="1px"
          borderColor="border.brand"
        >
          <Box asChild boxSize={5}>
            <Icon />
          </Box>
        </Box>
      </Flex>
    </SectionCard>
  );
});
