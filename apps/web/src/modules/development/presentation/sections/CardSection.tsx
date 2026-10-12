import { SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { FiActivity, FiClock, FiEdit2, FiTrash2 } from "@/shared/components/icons";
import { EntityCard } from "@/shared/components/ui/EntityCard";
import { SectionCard } from "@/shared/components/ui/SectionCard";
import { StatCard } from "@/shared/components/ui/StatCard";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Group, Label } from "../styleguide/Section";

export function CardSection() {
  return (
    <Stack gap={8}>
      <Group title="SectionCard">
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          {(["default", "glass", "sunken"] as const).map((variant) => (
            <SectionCard key={variant} variant={variant} p={4}>
              <Text textStyle="bodyStrong">SectionCard</Text>
              <Label>{variant}</Label>
            </SectionCard>
          ))}
        </SimpleGrid>
      </Group>
      <Group title="EntityCard · StatCard">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <EntityCard
            title="Registro de exemplo"
            subtitle="criado por Ana Souza"
            badges={[<StatusBadge key="s" status="success" label="Ativo" />]}
            metaItems={[{ icon: FiClock, label: "Atualizado há 2 horas" }]}
            actionItems={[
              { label: "Editar", icon: FiEdit2, onClick: () => {} },
              { label: "Excluir", icon: FiTrash2, onClick: () => {}, isDanger: true },
            ]}
            onClick={() => {}}
          />
          <StatCard label="Total" value="128" hint="+12% no mês" icon={FiActivity} trend="up" />
        </SimpleGrid>
      </Group>
    </Stack>
  );
}
