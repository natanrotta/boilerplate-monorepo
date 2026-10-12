import { useState } from "react";
import { Flex, Stack } from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "@/shared/components/icons";
import { ActionMenu } from "@/shared/components/ui/ActionMenu";
import { ColorModeToggle } from "@/shared/components/ui/ColorModeToggle";
import { FilterBar } from "@/shared/components/ui/FilterBar";
import { LanguageSelector } from "@/shared/components/ui/LanguageSelector";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { Group } from "../styleguide/Section";

export function ControlSection() {
  const [search, setSearch] = useState("");

  return (
    <Stack gap={8}>
      <Group title="PageHeader">
        <PageHeader
          title="Título da página"
          description="Descrição curta do que a página faz."
          count={12}
          primaryAction={{ label: "Adicionar", onClick: () => {} }}
        />
      </Group>
      <Group title="FilterBar">
        <FilterBar searchValue={search} onSearchChange={setSearch} />
      </Group>
      <Group title="ActionMenu · ColorModeToggle · LanguageSelector">
        <Flex gap={4} align="center" wrap="wrap">
          <ActionMenu
            items={[
              { label: "Editar", icon: FiEdit2, onClick: () => {} },
              { label: "Excluir", icon: FiTrash2, onClick: () => {}, isDanger: true },
            ]}
          />
          <ColorModeToggle />
          <ColorModeToggle size="md" />
          <LanguageSelector />
        </Flex>
      </Group>
    </Stack>
  );
}
