import { Box, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { FlaskConical, Languages, Layers, Palette, Rocket, ShieldCheck, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Container, Eyebrow } from "@/components/Section";
import { useLocale } from "@/hooks/useLocale";

/** One icon per item of `included.items`, in the same order. */
const ICONS: readonly LucideIcon[] = [ShieldCheck, Layers, Palette, Languages, FlaskConical, Rocket];

/** What is already built when the repository is cloned. */
export const Included = () => {
  const { dict } = useLocale();
  const { included } = dict;

  return (
    <Container as="section" py={{ base: "56px", md: "96px" }}>
      <Grid templateColumns={{ base: "1fr", lg: "5fr 6fr" }} gap={{ base: "32px", lg: "72px" }}>
        <Reveal>
          <Stack gap="16px" align="flex-start" position={{ lg: "sticky" }} top={{ lg: "112px" }}>
            <Eyebrow>{included.eyebrow}</Eyebrow>
            <Text as="h2" textStyle="title" color="text.primary" textWrap="balance">
              {included.title}
            </Text>
          </Stack>
        </Reveal>
        <Box as="ul" listStyleType="none" borderTopWidth="1px" borderColor="border.subtle">
          {included.items.map((item, index) => {
            const ItemIcon = ICONS[index]!;
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={index * 0.06}
                py={{ base: "22px", md: "28px" }}
                borderBottomWidth="1px"
                borderColor="border.subtle"
              >
                <Flex gap="16px" align="flex-start">
                  <Flex
                    align="center"
                    justify="center"
                    boxSize="36px"
                    flexShrink={0}
                    borderWidth="1px"
                    borderColor="border.default"
                    borderRadius="md"
                    bg="bg.card"
                    color="text.accent"
                  >
                    <Box asChild boxSize="17px" aria-hidden>
                      <ItemIcon />
                    </Box>
                  </Flex>
                  <Box>
                    <Text as="h3" textStyle="sectionTitle" color="text.primary">
                      {item.title}
                    </Text>
                    <Text mt="6px" textStyle="body" fontSize="15px" color="text.muted">
                      {item.body}
                    </Text>
                  </Box>
                </Flex>
              </Reveal>
            );
          })}
        </Box>
      </Grid>
    </Container>
  );
};
