import { Box, Button, Menu } from "@chakra-ui/react";
import { Check, ChevronDown } from "lucide-react";
import { useLocale, type Locale } from "@/hooks/useLocale";

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

/** Language picker styled as a select: a bordered pill showing the active
 *  language label + chevron (no flag). Chakra `Menu` renders its list inline
 *  (no portal), so it works both in the desktop pill and inside the mobile
 *  hamburger stack without escaping or being clipped. */
export const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();
  const active = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <Menu.Root positioning={{ placement: "top-end" }}>
      <Menu.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          h={9}
          pl={3.5}
          pr={2.5}
          gap={1.5}
          borderRadius="full"
          borderWidth="1px"
          borderColor="border.default"
          bg="bg.surface"
          color="text.secondary"
          fontWeight="600"
          fontSize="xs"
          _hover={{ bg: "bg.brand.subtle", color: "text.brand", borderColor: "border.brand" }}
          _active={{ bg: "bg.brand.subtle" }}
        >
          {active.label}
          <Box as={ChevronDown} fontSize="sm" />
        </Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content
          bg="bg.surface"
          border="1px solid"
          borderColor="border.subtle"
          boxShadow="shadow.panel"
          py={1.5}
          minW="180px"
        >
          {LANGUAGES.map((l) => {
            const isActive = l.code === locale;
            return (
              <Menu.Item
                key={l.code}
                value={l.code}
                onClick={() => setLocale(l.code)}
                fontSize="sm"
                fontWeight={isActive ? "700" : "500"}
                color={isActive ? "text.brand" : "text.primary"}
                bg="transparent"
                _hover={{ bg: "bg.brand.subtle", color: "text.brand" }}
                _focus={{ bg: "bg.brand.subtle" }}
              >
                <Box as={Check} fontSize="sm" color="text.brand" opacity={isActive ? 1 : 0} />
                {l.label}
              </Menu.Item>
            );
          })}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
