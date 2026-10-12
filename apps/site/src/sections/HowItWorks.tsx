import { Grid, Stack, Text } from "@chakra-ui/react";
import { Reveal } from "@/components/Reveal";
import { Container, Eyebrow } from "@/components/Section";
import { SpotlightCard } from "@/components/SpotlightCard";
import { HOW_IT_WORKS_ID } from "@/content/site";
import { useLocale } from "@/hooks/useLocale";

/** From a clone to a screen of your own, in three steps. */
export const HowItWorks = () => {
  const { dict } = useLocale();
  const { steps } = dict;

  return (
    <Container as="section" id={HOW_IT_WORKS_ID} scrollMarginTop="88px" py={{ base: "56px", md: "96px" }}>
      <Reveal>
        <Stack gap="16px" align="flex-start" maxW="640px">
          <Eyebrow>{steps.eyebrow}</Eyebrow>
          <Text as="h2" textStyle="title" color="text.primary" textWrap="balance">
            {steps.title}
          </Text>
        </Stack>
      </Reveal>
      <Reveal delay={0.1} mt={{ base: "32px", md: "48px" }}>
        {/* One panel cut by hairlines: the gap shows the grid's own color. */}
        <Grid
          as="ol"
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap="1px"
          overflow="hidden"
          listStyleType="none"
          borderWidth="1px"
          borderColor="border.default"
          borderRadius="xl"
          bg="border.subtle"
        >
          {steps.items.map((step, index) => (
            <SpotlightCard as="li" key={step.title} p={{ base: "24px", md: "32px" }}>
              <Text textStyle="mono" color="text.accent">
                {String(index + 1).padStart(2, "0")}
              </Text>
              <Text as="h3" mt={{ base: "20px", md: "44px" }} textStyle="sectionTitle" color="text.primary">
                {step.title}
              </Text>
              <Text mt="8px" textStyle="body" fontSize="15px" color="text.muted">
                {step.body}
              </Text>
            </SpotlightCard>
          ))}
        </Grid>
      </Reveal>
    </Container>
  );
};
