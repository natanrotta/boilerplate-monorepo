import { useState } from "react";
import { Flex, Stack } from "@chakra-ui/react";
import { SegmentedControl } from "@/shared/components/ui/SegmentedControl";
import { UnderlineTabs } from "@/shared/components/ui/UnderlineTabs";
import { Group, Sample } from "../styleguide/Section";

const SECTION_TABS = [
  { value: "profile", label: "Perfil" },
  { value: "preferences", label: "Preferências" },
  { value: "members", label: "Membros", count: 12 },
] as const;

const PAGE_SIZES = ["10", "20", "30", "50"].map((value) => ({ value, label: value }));
const RANGES = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
];

export function TabsSection() {
  const [tab, setTab] = useState<(typeof SECTION_TABS)[number]["value"]>("profile");
  const [pageSize, setPageSize] = useState("20");
  const [range, setRange] = useState("30d");

  return (
    <Stack gap={8}>
      <Group title="UnderlineTabs — as seções de uma página (o sublinhado desliza até a aba)">
        <UnderlineTabs ariaLabel="Seções" items={SECTION_TABS} value={tab} onChange={setTab} />
      </Group>
      <Group title="SegmentedControl — bg.sunken + border.default · item ativo bg.brand.solid">
        <Flex gap={6} wrap="wrap" align="flex-start">
          <Sample label="período" token="11.5px · 24px">
            <SegmentedControl
              ariaLabel="Período"
              options={RANGES}
              value={range}
              onChange={setRange}
            />
          </Sample>
          <Sample label="por página" token="mono · 24px">
            <SegmentedControl
              mono
              ariaLabel="Itens por página"
              options={PAGE_SIZES}
              value={pageSize}
              onChange={setPageSize}
            />
          </Sample>
        </Flex>
      </Group>
    </Stack>
  );
}
