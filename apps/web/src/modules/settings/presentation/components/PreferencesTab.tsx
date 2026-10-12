import type { ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { SectionCard } from "@/shared/components/ui/SectionCard";
import { LanguageSelector } from "@/shared/components/ui/LanguageSelector";
import { ColorModeToggle } from "@/shared/components/ui/ColorModeToggle";

interface PreferenceRowProps {
  title: string;
  description: string;
  children: ReactNode;
}

function PreferenceRow({ title, description, children }: PreferenceRowProps) {
  return (
    <SectionCard>
      <Flex
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={3}
      >
        <Box minW={0}>
          <Text fontSize="sm" fontWeight="600" color="text.primary">
            {title}
          </Text>
          <Text fontSize="sm" color="text.secondary">
            {description}
          </Text>
        </Box>
        {children}
      </Flex>
    </SectionCard>
  );
}

/** How the app looks and speaks for this user: language and color mode. */
export function PreferencesTab() {
  const { t } = useTranslation("settings");

  return (
    <Flex direction="column" gap={5} data-cy="settings-preferences">
      <PreferenceRow
        title={t("preferences.language.title")}
        description={t("preferences.language.description")}
      >
        <LanguageSelector />
      </PreferenceRow>
      <PreferenceRow
        title={t("preferences.theme.title")}
        description={t("preferences.theme.description")}
      >
        <ColorModeToggle size="md" />
      </PreferenceRow>
    </Flex>
  );
}
