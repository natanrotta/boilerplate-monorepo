import { Box, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { ACCENT_GLOW } from "@boilerplate/theme";
import { Activity, CircleCheck, House, Settings, TrendingUp, type LucideIcon } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { useLocale } from "@/hooks/useLocale";

/** One icon per stat of `hero.mock.stats`, in the same order. */
const STAT_ICONS: readonly LucideIcon[] = [Activity, CircleCheck, TrendingUp];
/** One icon per item of `hero.mock.nav`, in the same order. */
const NAV_ICONS: readonly LucideIcon[] = [House, Settings];

/**
 * The app the starter ships, drawn in CSS: a window frame around the dashboard
 * a fresh clone opens on — the sidebar, the greeting and its three empty
 * stats. A drawing, not a screenshot, so it follows the color mode and the
 * language. Decorative: the hero's text already says what it is.
 */
export const ProductMock = () => {
  const { dict } = useLocale();
  const { mock } = dict.hero;

  return (
    <Box position="relative" w="full" role="img" aria-label={mock.label}>
      <Box
        aria-hidden
        position="absolute"
        left="50%"
        bottom="-80px"
        w="80%"
        h="320px"
        borderRadius="full"
        bgImage={ACCENT_GLOW}
        filter="blur(70px)"
        transform="translateX(-50%)"
        pointerEvents="none"
      />
      <Box
        aria-hidden
        position="relative"
        overflow="hidden"
        borderWidth="1px"
        borderColor="border.default"
        borderRadius={{ base: "lg", md: "xl" }}
        bg="bg.surface"
        boxShadow="shadow.authCard"
        textAlign="left"
      >
        <Flex
          align="center"
          gap="6px"
          h={{ base: "30px", md: "38px" }}
          px="14px"
          borderBottomWidth="1px"
          borderColor="border.subtle"
        >
          {[0, 1, 2].map((dot) => (
            <Box key={dot} boxSize="9px" borderRadius="full" bg="border.strong" />
          ))}
          <Text flex={1} textAlign="center" textStyle="mono" fontSize="11px" color="text.muted" pr="39px">
            localhost:3000/dashboard
          </Text>
        </Flex>

        <Flex bg="bg.canvas" minH={{ base: "260px", md: "420px" }}>
          <Stack
            display={{ base: "none", md: "flex" }}
            gap="18px"
            w="200px"
            flexShrink={0}
            p="16px"
            borderRightWidth="1px"
            borderColor="border.subtle"
            bg="bg.surface"
          >
            <Flex align="center" gap="9px">
              <BrandMark size={26} />
              <Text fontSize="13px" fontWeight="600" color="text.primary" letterSpacing="-0.02em">
                {dict.brand}
              </Text>
            </Flex>
            <Stack gap="2px">
              {mock.nav.map((item, index) => {
                const NavIcon = NAV_ICONS[index]!;
                const isActive = index === 0;
                return (
                  <Flex
                    key={item}
                    align="center"
                    gap="9px"
                    px="9px"
                    py="7px"
                    borderRadius="sm"
                    fontSize="13px"
                    bg={isActive ? "bg.brand.subtle" : "transparent"}
                    color={isActive ? "text.primary" : "text.muted"}
                  >
                    <Box asChild boxSize="15px">
                      <NavIcon />
                    </Box>
                    {item}
                  </Flex>
                );
              })}
            </Stack>
          </Stack>

          <Stack flex={1} minW={0} gap={{ base: "14px", md: "20px" }} p={{ base: "16px", md: "28px" }}>
            <Box>
              <Text textStyle="sectionTitle" color="text.primary">
                {mock.greeting}
              </Text>
              <Text mt="2px" fontSize="13px" color="text.muted">
                {mock.subtitle}
              </Text>
            </Box>
            <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap={{ base: "10px", md: "14px" }}>
              {mock.stats.map((stat, index) => {
                const StatIcon = STAT_ICONS[index]!;
                return (
                  <Flex
                    key={stat.label}
                    justify="space-between"
                    align="flex-start"
                    p={{ base: "12px", md: "16px" }}
                    borderWidth="1px"
                    borderColor="border.subtle"
                    borderRadius="lg"
                    bg="bg.card"
                  >
                    <Box minW={0}>
                      <Text fontSize="12px" color="text.muted">
                        {stat.label}
                      </Text>
                      <Text mt="6px" fontSize="22px" fontWeight="600" letterSpacing="-0.03em" color="text.primary">
                        {stat.value}
                      </Text>
                    </Box>
                    <Flex
                      align="center"
                      justify="center"
                      boxSize="28px"
                      flexShrink={0}
                      borderRadius="sm"
                      bg="bg.brand.subtle"
                      color="text.accent"
                    >
                      <Box asChild boxSize="14px">
                        <StatIcon />
                      </Box>
                    </Flex>
                  </Flex>
                );
              })}
            </Grid>
            <Flex
              flex={1}
              direction="column"
              align="center"
              justify="center"
              gap="4px"
              minH={{ base: "84px", md: "150px" }}
              px="16px"
              borderWidth="1px"
              borderColor="border.subtle"
              borderRadius="lg"
              bg="bg.card"
              textAlign="center"
            >
              <Text fontSize="13px" fontWeight="500" color="text.primary">
                {mock.emptyTitle}
              </Text>
              <Text fontSize="12px" color="text.muted">
                {mock.emptyBody}
              </Text>
            </Flex>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
};
