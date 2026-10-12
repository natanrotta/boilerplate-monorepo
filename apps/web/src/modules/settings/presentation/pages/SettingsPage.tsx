import { useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { UnderlineTabs, tabId } from "@/shared/components/ui/UnderlineTabs";
import { ProfileTab } from "@/modules/settings/presentation/components/ProfileTab";
import { PreferencesTab } from "@/modules/settings/presentation/components/PreferencesTab";

const TABS = ["profile", "preferences"] as const;
type SettingsTab = (typeof TABS)[number];

const TAB_PARAM = "tab";
const PANEL_ID = "settings-panel";

export function SettingsPage() {
  const { t } = useTranslation("settings");
  const [searchParams, setSearchParams] = useSearchParams();

  // The tab lives in the URL (`?tab=preferences`), so it survives a reload and
  // can be linked to; anything else falls back to the first tab.
  const requested = searchParams.get(TAB_PARAM);
  const tab: SettingsTab = TABS.find((value) => value === requested) ?? "profile";

  const items = useMemo(
    () => TABS.map((value) => ({ value, label: t(`tabs.${value}`) })),
    [t],
  );

  function handleTabChange(next: SettingsTab) {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        if (next === "profile") params.delete(TAB_PARAM);
        else params.set(TAB_PARAM, next);
        return params;
      },
      { replace: true },
    );
  }

  return (
    <>
      <PageHeader title={t("page.title")} description={t("page.description")} />
      <Box mb={5}>
        <UnderlineTabs
          ariaLabel={t("tabs.label")}
          items={items}
          value={tab}
          onChange={handleTabChange}
          panelId={PANEL_ID}
        />
      </Box>
      <Box id={PANEL_ID} role="tabpanel" aria-labelledby={tabId(PANEL_ID, tab)}>
        {tab === "profile" ? <ProfileTab /> : <PreferencesTab />}
      </Box>
    </>
  );
}
