import { memo, useId, type KeyboardEvent } from "react";
import { LayoutGroup } from "motion/react";
import { SlidingIndicator } from "@/shared/components/animations/SlidingIndicator";
import { Flex, Text, chakra } from "@chakra-ui/react";

export interface UnderlineTab<T extends string = string> {
  value: T;
  label: string;
  /** Optional mono counter after the label. */
  count?: number;
}

interface UnderlineTabsProps<T extends string> {
  items: readonly UnderlineTab<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  /** `id` of the element the tabs filter/own — wired as `aria-controls`. */
  panelId?: string;
}

/** The id of the tab that labels a panel — pair it with the panel's `aria-labelledby`. */
// eslint-disable-next-line react-refresh/only-export-components -- a one-line id helper that must match the ids rendered below
export function tabId(panelId: string, value: string): string {
  return `${panelId}-tab-${value}`;
}

/**
 * Underline tabs — THE tab control of the product (the sections of a page):
 * 42px, 13.5px, and a 2px accent underline under the selected tab that
 * overlaps the row's hairline and slides to the next one.
 */
function UnderlineTabsComponent<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  panelId,
}: UnderlineTabsProps<T>) {
  const selectedIndex = items.findIndex((item) => item.value === value);
  const tabStopIndex = selectedIndex === -1 ? 0 : selectedIndex;
  const layoutGroupId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // A modified arrow is the browser's (Alt+← goes back) — leave it alone.
    if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (items.length === 0) return;
    const last = items.length - 1;
    const nextIndex =
      event.key === "ArrowRight"
        ? (tabStopIndex + 1) % items.length
        : event.key === "ArrowLeft"
          ? (tabStopIndex + last) % items.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (nextIndex === -1) return;
    event.preventDefault();
    onChange(items[nextIndex].value);
    event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[nextIndex]?.focus();
  }

  return (
    <LayoutGroup id={layoutGroupId}>
      <Flex
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        gap={1}
        borderBottomWidth="1px"
        borderColor="border.subtle"
        w="full"
        overflowX="auto"
      >
        {items.map((item, index) => {
          const isActive = item.value === value;
          return (
            <chakra.button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              // The panel names its tab back: `aria-labelledby={tabId(panelId, value)}`.
              id={panelId ? tabId(panelId, item.value) : undefined}
              aria-controls={panelId}
              tabIndex={index === tabStopIndex ? 0 : -1}
              onClick={() => onChange(item.value)}
              display="flex"
              alignItems="center"
              gap={2}
              h="42px"
              px="14px"
              mb="-1px"
              flexShrink={0}
              fontSize="13.5px"
              cursor="pointer"
              position="relative"
              borderBottomWidth="1px"
              borderColor="transparent"
              color={isActive ? "text.primary" : "text.muted"}
              transition="color 0.14s ease"
              _hover={{ color: "text.primary" }}
              _focusVisible={{ outline: "none", boxShadow: "outline" }}
            >
              {/* The underline glides along the row to the chosen tab. */}
              {isActive ? (
                <SlidingIndicator
                  layoutId="tab-underline"
                  inset="auto"
                  left={0}
                  right={0}
                  bottom="-1px"
                  h="2px"
                  borderRadius="full"
                  bg="bg.brand.solid"
                />
              ) : null}
              {item.label}
              {item.count !== undefined ? (
                <Text as="span" fontFamily="mono" fontSize="11px" color="text.muted">
                  {item.count}
                </Text>
              ) : null}
            </chakra.button>
          );
        })}
      </Flex>
    </LayoutGroup>
  );
}

export const UnderlineTabs = memo(
  UnderlineTabsComponent,
) as typeof UnderlineTabsComponent;
