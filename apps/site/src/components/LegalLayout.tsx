import { type ReactNode, useEffect } from "react";
import { Box, Flex, Stack, Text, chakra } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Container, Eyebrow } from "@/components/Section";
import { ROUTES } from "@/content/site";
import { useLocale } from "@/hooks/useLocale";

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  children: ReactNode;
}

/** The frame of the two legal pages: a way back, the title, and the text in one readable column. */
export const LegalLayout = ({ eyebrow, title, updatedAt, intro, children }: LegalLayoutProps) => {
  const { dict } = useLocale();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <Container maxW="760px" pt={{ base: "40px", md: "72px" }} pb={{ base: "72px", md: "120px" }}>
      <Stack gap="18px" align="flex-start" animation="rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)">
        <chakra.a
          asChild
          fontSize="13px"
          color="text.muted"
          transition="color 0.15s"
          _hover={{ color: "text.primary" }}
        >
          <Link to={ROUTES.home}>
            <Flex as="span" align="center" gap="6px">
              <Box asChild boxSize="14px" aria-hidden>
                <ArrowLeft />
              </Box>
              {dict.legal.backToHome}
            </Flex>
          </Link>
        </chakra.a>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Text as="h1" textStyle="title" color="text.primary">
          {title}
        </Text>
        <Text textStyle="mono" color="text.muted">
          {dict.legal.updatedAt} {updatedAt}
        </Text>
        <Text textStyle="lead" color="text.muted">
          {intro}
        </Text>
      </Stack>
      <Stack
        mt={{ base: "32px", md: "48px" }}
        p={{ base: "22px", md: "36px" }}
        gap={{ base: "28px", md: "36px" }}
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="xl"
        bg="bg.card"
        boxShadow="shadow.authCard"
        color="text.muted"
        fontSize="15px"
        lineHeight="1.7"
        css={{
          "& h2": { textStyle: "sectionTitle", color: "text.primary" },
          "& h3": { color: "text.primary", fontWeight: "600", fontSize: "15px" },
          "& p + p": { mt: "12px" },
          "& ul, & ol": { pl: "20px" },
          "& ul": { listStyleType: "disc" },
          "& li + li": { mt: "8px" },
          overflowWrap: "anywhere",
          "& strong": { color: "text.primary", fontWeight: "600" },
          "& a": { color: "text.link", textDecoration: "underline", textUnderlineOffset: "3px" },
        }}
      >
        {children}
      </Stack>
    </Container>
  );
};
