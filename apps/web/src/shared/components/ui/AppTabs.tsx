import { Box, Flex, Tabs } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

export interface AppTabItem {
  id: string;
  label: string;
  content: ReactNode;
  badge?: string;
  badgeColorScheme?: string;
  dotIndicator?: boolean;
}

export type ProfileTabItem = AppTabItem;

interface AppTabsProps
  extends Omit<Tabs.RootProps, "children" | "value" | "defaultValue" | "onValueChange"> {
  items: AppTabItem[];
  syncWithUrl?: boolean;
  /**
   * Defaults to `true` (lazy mount + keepMounted) so tab panels only mount
   * when first activated. Opt-out only with a documented reason — see
   * `code-review-checklist.md` § F-H18.
   */
  isLazy?: boolean;
}

export function AppTabs({ items, syncWithUrl = false, isLazy = true, ...props }: AppTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = syncWithUrl ? searchParams.get("tab") : null;
  // v3 Tabs are value-based. Resolve the active value from the URL, falling
  // back to the first item's id (the previous `defaultIndex = 0` behavior).
  const defaultValue =
    tabParam && items.some((item) => item.id === tabParam)
      ? tabParam
      : (items[0]?.id ?? undefined);

  function handleValueChange(value: string) {
    if (!syncWithUrl) return;
    const index = items.findIndex((item) => item.id === value);
    if (index > 0) {
      setSearchParams({ tab: value }, { replace: true });
    } else {
      searchParams.delete("tab");
      setSearchParams(searchParams, { replace: true });
    }
  }

  return (
    <Tabs.Root
      variant="line"
      colorPalette="brand"
      // Lazy mount + keepMounted: tab panels only mount when first
      // activated, and stay mounted after (no `unmountOnExit`) — queries
      // inside an inactive tab don't fire, and switching back doesn't refetch.
      lazyMount={isLazy}
      // Always seed the active value (v3 Tabs start at `null` → no tab
      // selected). URL sync only adds the change handler on top.
      defaultValue={defaultValue}
      {...(syncWithUrl ? { onValueChange: (e) => handleValueChange(e.value) } : {})}
      {...props}
    >
      <Tabs.List
        overflowX="auto"
        overflowY="hidden"
        css={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}
      >
        {items.map((item) => (
          <Tabs.Trigger
            key={item.id}
            value={item.id}
            display="flex"
            gap={2}
            whiteSpace="nowrap"
            flexShrink={0}
          >
            {item.label}
            {item.dotIndicator ? (
              <Box
                w="5px"
                h="5px"
                borderRadius="full"
                bg="status.error.fg"
                animation="appTabsDotPulse 2s ease-out infinite"
                flexShrink={0}
                css={{
                  "@keyframes appTabsDotPulse": {
                    "0%": { boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.4)" },
                    "70%": { boxShadow: "0 0 0 3px rgba(239, 68, 68, 0)" },
                    "100%": { boxShadow: "0 0 0 0 rgba(239, 68, 68, 0)" },
                  },
                }}
              />
            ) : item.badge ? (
              <Flex
                align="center"
                justify="center"
                w="16px"
                h="16px"
                borderRadius="full"
                bg={item.badgeColorScheme === "red" ? "status.error.bg" : "bg.brand.subtle"}
                color={item.badgeColorScheme === "red" ? "status.error.fg" : "text.brand"}
                fontSize="2xs"
                fontWeight="700"
                lineHeight={1}
                flexShrink={0}
              >
                {item.badge}
              </Flex>
            ) : null}
          </Tabs.Trigger>
        ))}
        {/* Sliding underline — inside Tabs.List so it scrolls with the tabs when
            the list overflows. Styled via the `indicator` part of the theme. */}
        <Tabs.Indicator />
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Content key={item.id} value={item.id} px={0} pt={4}>
          {item.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
