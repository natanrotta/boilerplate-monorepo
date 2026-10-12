import { useState } from "react";
import { Button, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { DetailPageGuard } from "@/shared/components/ui/DetailPageGuard";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { RouteErrorBoundary } from "@/shared/components/ui/RouteErrorBoundary";
import { DetailPageSkeleton } from "@/shared/components/skeletons/DetailPageSkeleton";
import { EntityCardSkeleton } from "@/shared/components/skeletons/EntityCardSkeleton";
import { FilterBarSkeleton } from "@/shared/components/skeletons/FilterBarSkeleton";
import { ListPageSkeleton } from "@/shared/components/skeletons/ListPageSkeleton";
import { RouteContentSkeleton } from "@/shared/components/skeletons/RouteContentSkeleton";
import { SectionCardSkeleton } from "@/shared/components/skeletons/SectionCardSkeleton";
import { Group } from "../styleguide/Section";

export function EmptyStateSection() {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
      <EmptyState
        title="Nada por aqui"
        description="Crie o primeiro registro para começar."
        actionLabel="Adicionar"
        onAction={() => {}}
        size="sm"
      />
      <EmptyState
        title="Nenhum resultado"
        description="Tente outro termo de busca."
        animatedIcon="search"
        size="sm"
      />
    </SimpleGrid>
  );
}

export function SkeletonSection() {
  return (
    <Stack gap={8}>
      <Group title="FilterBarSkeleton · EntityCardSkeleton · SectionCardSkeleton">
        <Stack gap={4}>
          <FilterBarSkeleton />
          <EntityCardSkeleton />
          <SectionCardSkeleton lines={2} />
        </Stack>
      </Group>
      <Group title="ListPageSkeleton">
        <ListPageSkeleton columns={{ base: 1, md: 2 }} cardCount={2} showFilter={false} />
      </Group>
      <Group title="DetailPageSkeleton (profile)">
        <DetailPageSkeleton variant="profile" />
      </Group>
      <Group title="RouteContentSkeleton — o fallback de uma rota lazy">
        <RouteContentSkeleton />
      </Group>
    </Stack>
  );
}

/** Throws on demand, so the boundary's fallback can be seen without breaking the page. */
function Bomb({ armed }: { armed: boolean }) {
  if (armed) throw new Error("Erro de exemplo do styleguide");
  return null;
}

export function GuardSection() {
  const [armed, setArmed] = useState(false);

  return (
    <Stack gap={8}>
      <Group title="DetailPageGuard — carregando / erro / não encontrado">
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <DetailPageGuard isLoading entity={null} skeletonVariant="single">
            <Text>conteúdo</Text>
          </DetailPageGuard>
          <DetailPageGuard isLoading={false} error={new Error("boom")} entity={null}>
            <Text>conteúdo</Text>
          </DetailPageGuard>
          <DetailPageGuard isLoading={false} entity={null}>
            <Text>conteúdo</Text>
          </DetailPageGuard>
        </SimpleGrid>
      </Group>
      <Group title="RouteErrorBoundary — o que uma tela mostra quando quebra">
        {/* A new `locationKey` is how the boundary resets, as on a navigation. */}
        <RouteErrorBoundary locationKey={armed ? "armed" : "idle"}>
          <Bomb armed={armed} />
          <Button
            size="sm"
            variant="outline"
            alignSelf="flex-start"
            onClick={() => setArmed(true)}
            data-cy="sg-throw"
          >
            Simular erro de renderização
          </Button>
        </RouteErrorBoundary>
        {armed ? (
          <Button size="sm" variant="ghost" alignSelf="flex-start" onClick={() => setArmed(false)}>
            Restaurar
          </Button>
        ) : null}
      </Group>
    </Stack>
  );
}
