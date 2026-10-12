import { Box, Flex, Stack, Text, chakra } from "@chakra-ui/react";
import { PrimaryLink } from "@/components/PrimaryLink";
import { Container, Eyebrow } from "@/components/Section";
import { HOW_IT_WORKS_ID, REPO_URL, STACK } from "@/content/site";
import { useLocale } from "@/hooks/useLocale";
import { ProductMock } from "@/sections/ProductMock";

const RISE = "rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both";

/** The statement, the way in, and the app itself drawn underneath. */
export const Hero = () => {
  const { dict } = useLocale();
  const { hero } = dict;

  return (
    <Box as="section" pt={{ base: "56px", md: "88px" }} pb={{ base: "72px", md: "120px" }}>
      <Container>
        <Stack gap="22px" align="center" textAlign="center" animation={RISE}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <Text as="h1" textStyle="hero" color="text.primary" maxW="860px" textWrap="balance">
            {hero.title}
          </Text>
          <Text textStyle="lead" color="text.muted" maxW="600px" textWrap="pretty">
            {hero.subtitle}
          </Text>
          <Flex
            direction={{ base: "column", sm: "row" }}
            align="center"
            justify="center"
            gap={{ base: "14px", sm: "22px" }}
            pt="6px"
          >
            <PrimaryLink href={REPO_URL} label={hero.cta} />
            <chakra.a
              href={`#${HOW_IT_WORKS_ID}`}
              fontSize="14px"
              fontWeight="500"
              color="text.muted"
              transition="color 0.15s"
              _hover={{ color: "text.primary" }}
            >
              {hero.secondary}
            </chakra.a>
          </Flex>
          <Flex align="center" justify="center" wrap="wrap" gap="8px" textStyle="mono" color="text.muted">
            <Text as="span" fontSize="11px" letterSpacing="0.08em" textTransform="uppercase">
              {hero.stackLabel}
            </Text>
            {STACK.map((name) => (
              <Box
                as="span"
                key={name}
                px="7px"
                py="2px"
                fontSize="11px"
                borderWidth="1px"
                borderColor="border.subtle"
                borderRadius="xs"
                bg="bg.muted"
              >
                {name}
              </Box>
            ))}
          </Flex>
        </Stack>
        <Box mt={{ base: "44px", md: "72px" }} animation={RISE} animationDelay="0.15s">
          <ProductMock />
        </Box>
      </Container>
    </Box>
  );
};
