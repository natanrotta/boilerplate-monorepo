import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { LanguageSelector } from "@/shared/components/ui/LanguageSelector";
import { ColorModeToggle } from "@/shared/components/ui/ColorModeToggle";
import { ProfileTab } from "@/modules/settings/presentation/components/ProfileTab";

export function SettingsPage() {
  const { t } = useTranslation("settings");

  return (
    <>
      <PageHeader
        title={t("page.title")}
        description={t("page.description")}
        actions={
          <Flex align="center" gap={2}>
            <LanguageSelector />
            <ColorModeToggle />
          </Flex>
        }
      />
      {/* Profile is the only section today, so it renders directly under the
          header. A second section becomes a tab set again. */}
      <ProfileTab />
    </>
  );
}
