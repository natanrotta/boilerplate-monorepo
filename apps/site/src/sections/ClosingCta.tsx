import { useState } from "react";
import { Box, Flex, Stack, Text, chakra } from "@chakra-ui/react";
import { ACCENT_GLOW, GRID_IMAGE, GRID_MASK } from "@boilerplate/theme";
import { Check, Copy } from "lucide-react";
import { PrimaryLink } from "@/components/PrimaryLink";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/Section";
import { CLONE_COMMAND, REPO_URL } from "@/content/site";
import { useLocale } from "@/hooks/useLocale";

/** The last thing on the page: the command that starts it, and the repository once more. */
export const ClosingCta = () => {
  const { dict } = useLocale();
  const { closing } = dict;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CLONE_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // No clipboard permission: the command stays selectable.
    }
  };

  return (
    <Container as="section" pt={{ base: "24px", md: "40px" }} pb={{ base: "72px", md: "120px" }}>
      <Reveal>
        <Box
          position="relative"
          overflow="hidden"
          borderWidth="1px"
          borderColor="border.default"
          borderRadius={{ base: "2xl", md: "3xl" }}
          bg="bg.card"
          px={{ base: "20px", md: "24px" }}
          py={{ base: "56px", md: "88px" }}
        >
          <Box
            aria-hidden
            position="absolute"
            inset={0}
            pointerEvents="none"
            bgImage={GRID_IMAGE}
            bgSize="56px 56px"
            maskImage={GRID_MASK}
          />
          <Box
            aria-hidden
            position="absolute"
            left="50%"
            top="-260px"
            w="640px"
            h="420px"
            borderRadius="full"
            pointerEvents="none"
            bgImage={ACCENT_GLOW}
            filter="blur(40px)"
            animation="drift 12s ease-in-out infinite"
          />
          <Stack position="relative" gap="14px" align="center" textAlign="center">
            <Text as="h2" textStyle="title" color="text.primary" textWrap="balance">
              {closing.title}
            </Text>
            <Text textStyle="lead" color="text.muted" maxW="520px" textWrap="pretty">
              {closing.subtitle}
            </Text>
            <Flex
              align="center"
              gap="10px"
              maxW="full"
              mt="10px"
              mb="14px"
              pl="14px"
              pr="6px"
              h="42px"
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="md"
              bg="bg.input"
            >
              <Text textStyle="mono" color="text.faint" aria-hidden>
                $
              </Text>
              <Text
                as="code"
                textStyle="mono"
                color="text.primary"
                overflowX="auto"
                whiteSpace="nowrap"
                minW={0}
              >
                {CLONE_COMMAND}
              </Text>
              <chakra.button
                type="button"
                onClick={() => void copy()}
                aria-label={copied ? closing.copied : closing.copy}
                title={copied ? closing.copied : closing.copy}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxSize="30px"
                flexShrink={0}
                borderRadius="sm"
                color={copied ? "text.accent" : "text.muted"}
                transition="background 0.15s, color 0.15s"
                _hover={{ bg: "bg.hover", color: "text.primary" }}
                _focusVisible={{ outline: "none", boxShadow: "shadow.focus" }}
              >
                <Box asChild boxSize="15px" aria-hidden>
                  {copied ? <Check /> : <Copy />}
                </Box>
              </chakra.button>
            </Flex>
            <PrimaryLink href={REPO_URL} label={closing.cta} />
          </Stack>
        </Box>
      </Reveal>
    </Container>
  );
};
