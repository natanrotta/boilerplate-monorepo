import { Box, Menu, chakra } from "@chakra-ui/react";
import { Check, ChevronDown } from "lucide-react";
import { useLocale, type Locale } from "@/hooks/useLocale";

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

/** Language picker: a bordered square the size of the theme switch, showing the active code. */
export const LanguageSwitcher = () => {
  const { locale, setLocale, dict } = useLocale();

  return (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger asChild>
        <chakra.button
          type="button"
          aria-label={dict.header.language}
          title={dict.header.language}
          display="flex"
          alignItems="center"
          gap="4px"
          h="32px"
          pl="10px"
          pr="7px"
          flexShrink={0}
          borderRadius="sm"
          borderWidth="1px"
          borderColor="border.default"
          bg="bg.surface"
          color="text.primary"
          textStyle="mono"
          fontSize="11px"
          textTransform="uppercase"
          transition="background 0.15s"
          _hover={{ bg: "bg.hover" }}
          _focusVisible={{ outline: "none", borderColor: "border.focus", boxShadow: "shadow.focus" }}
        >
          {locale}
          <Box asChild boxSize="13px" color="text.muted" aria-hidden>
            <ChevronDown />
          </Box>
        </chakra.button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content
          bg="bg.surface"
          borderWidth="1px"
          borderColor="border.default"
          borderRadius="lg"
          boxShadow="shadow.panel"
          p="4px"
          minW="160px"
        >
          {LANGUAGES.map((language) => {
            const isActive = language.code === locale;
            return (
              <Menu.Item
                key={language.code}
                value={language.code}
                onClick={() => setLocale(language.code)}
                justifyContent="space-between"
                borderRadius="sm"
                fontSize="13px"
                color={isActive ? "text.primary" : "text.muted"}
                _hover={{ bg: "bg.hover", color: "text.primary" }}
                _focus={{ bg: "bg.hover" }}
              >
                {language.label}
                <Box asChild boxSize="14px" color="text.accent" opacity={isActive ? 1 : 0} aria-hidden>
                  <Check />
                </Box>
              </Menu.Item>
            );
          })}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
