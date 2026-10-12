import { useEffect, useState } from "react";
import { Button, Flex, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { FiPlay } from "@/shared/components/icons";
import {
  ANIMATED_ICON_NAMES,
  AnimatedIcon,
  useHoverPlay,
  type AnimatedIconName,
} from "@/shared/components/icons/animated";
import { Group, Token } from "../styleguide/Section";

/** Longer than any glyph's keyframes — then every tile rests again. */
const PLAY_ALL_MS = 900;

const STATUS_SAMPLES = [
  { name: "clock", label: "agendado", tone: "status.info.fg" },
  { name: "success", label: "concluído", tone: "status.success.fg" },
  { name: "error", label: "falhou", tone: "status.error.fg" },
] as const;

/** One tile: pointing anywhere on it plays the glyph (the tile is the host). */
function IconTile({ name, forcePlay }: { name: AnimatedIconName; forcePlay: boolean }) {
  const { playing, hostProps } = useHoverPlay();
  return (
    <Stack
      {...hostProps}
      align="center"
      gap={2}
      py={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg.elevated"
      color="text.secondary"
      cursor="default"
      _hover={{ color: "text.primary", borderColor: "border.brand" }}
    >
      <AnimatedIcon name={name} size={22} playing={playing || forcePlay} />
      <Text fontFamily="mono" fontSize="10.5px" color="text.muted">
        {name}
      </Text>
    </Stack>
  );
}

export function AnimatedIconSection() {
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  useEffect(() => {
    if (!isPlayingAll) return;
    const timer = setTimeout(() => setIsPlayingAll(false), PLAY_ALL_MS);
    return () => clearTimeout(timer);
  }, [isPlayingAll]);

  return (
    <Stack gap={8}>
      <Group title="AnimatedIcon — passe o mouse (um disparo por hover, nunca em loop)">
        <Button
          size="sm"
          variant="outline"
          alignSelf="flex-start"
          disabled={isPlayingAll}
          onClick={() => setIsPlayingAll(true)}
          data-cy="sg-animated-icons-play-all"
        >
          <FiPlay />
          Tocar todos
        </Button>
        <SimpleGrid columns={{ base: 3, md: 4, xl: 7 }} gap={3}>
          {ANIMATED_ICON_NAMES.map((name) => (
            <IconTile key={name} name={name} forcePlay={isPlayingAll} />
          ))}
        </SimpleGrid>
        <Token>
          grade 16px · stroke 1.4 · currentColor · useHoverPlay no controle dono · parado sob
          prefers-reduced-motion
        </Token>
      </Group>
      <Group title="Tamanhos e cor herdada">
        <Flex gap={6} align="center" wrap="wrap">
          <Flex gap={3} align="center" color="text.muted">
            <AnimatedIcon name="dashboard" size={18} />
            <AnimatedIcon name="dashboard" size={20} />
            <AnimatedIcon name="dashboard" size={28} />
          </Flex>
          {STATUS_SAMPLES.map((sample) => (
            <Flex key={sample.name} gap={2} align="center" color={sample.tone} fontSize="12.5px">
              <AnimatedIcon name={sample.name} size={16} />
              {sample.label}
            </Flex>
          ))}
        </Flex>
        <Token>18px na sidebar · 20px na barra mobile · cor = token do pai (status.*.fg)</Token>
      </Group>
    </Stack>
  );
}
