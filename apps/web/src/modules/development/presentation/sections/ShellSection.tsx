import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { AppVersion } from "@/shared/components/layout/AppVersion";
import { SidebarNav } from "@/shared/components/layout/SidebarNav";
import { BrandMark } from "@/shared/components/ui/BrandMark";
import { Group, Sample } from "../styleguide/Section";

const BRAND_MARK_SIZES = [16, 22, 36, 64] as const;

/**
 * The shell is what frames this very page: `AppShell` lays out `SidebarNav`
 * on desktop and `MobileHeader` + `MobileBottomNav` on a phone. Only the
 * sidebar is repeated here (always expanded) — the mobile pieces are fixed to
 * the viewport, so they are seen by narrowing the window.
 */
export function ShellSection() {
  return (
    <Flex gap={8} wrap="wrap" align="flex-start">
      <Group title="SidebarNav (forceExpanded)">
        <Box
          w="248px"
          h="520px"
          bg="bg.surface"
          borderWidth="1px"
          borderColor="border.subtle"
          borderRadius="xl"
          overflow="hidden"
        >
          <SidebarNav forceExpanded />
        </Box>
      </Group>
      <Stack gap={8} flex="1 1 260px" minW={0}>
        <Group title="BrandMark — favicon, cabeçalho, sidebar e telas de entrada">
          <Flex gap={6} align="flex-end" wrap="wrap">
            {BRAND_MARK_SIZES.map((size) => (
              <Sample key={size} label={`${size}px`}>
                <BrandMark size={size} />
              </Sample>
            ))}
          </Flex>
        </Group>
        <Group title="AppVersion">
          <AppVersion />
        </Group>
        <Group title="AppShell · MobileHeader · MobileBottomNav">
          <Text fontSize="13px" color="text.secondary" maxW="52ch">
            O AppShell já está em volta desta página. Abaixo de 992px ele troca a sidebar pelo
            MobileHeader (topo) e pelo MobileBottomNav (barra flutuante) — reduza a janela para
            ver os dois.
          </Text>
        </Group>
        <Group title="AuthShell">
          <Text fontSize="13px" color="text.secondary" maxW="52ch">
            A moldura das telas sem sessão (entrar, criar conta, recuperar senha): ocupa a
            janela inteira, então é vista saindo da conta.
          </Text>
        </Group>
      </Stack>
    </Flex>
  );
}
