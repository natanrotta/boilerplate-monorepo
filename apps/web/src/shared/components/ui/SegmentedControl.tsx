import { memo, useId, type KeyboardEvent } from "react";
import { LayoutGroup } from "motion/react";
import { SlidingIndicator } from "@/shared/components/animations/SlidingIndicator";
import { Flex, chakra } from "@chakra-ui/react";

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group ("Itens por página", "Período", …). */
  ariaLabel: string;
  /** Geist Mono 11px items — a per-page selector and other numeric switches. */
  mono?: boolean;
}

/**
 * A segmented control: a sunken track with a hairline and compact items, the
 * selected one on the solid accent. A radio group — arrow keys move the
 * selection, only the selected item is in the tab order.
 */
function SegmentedControlComponent<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  mono,
}: SegmentedControlProps<T>) {
  const selectedIndex = options.findIndex((option) => option.value === value);
  // A value outside `options` must not leave the group without a tab stop.
  const tabStopIndex = selectedIndex === -1 ? 0 : selectedIndex;
  const layoutGroupId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (step === 0 || options.length === 0) return;
    event.preventDefault();
    const nextIndex = (tabStopIndex + step + options.length) % options.length;
    onChange(options[nextIndex].value);
    // Roving tabindex: focus follows the selection.
    event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[nextIndex]?.focus();
  }

  return (
    <LayoutGroup id={layoutGroupId}>
      <Flex
        role="radiogroup"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        gap="3px"
        p="3px"
        borderRadius="md"
        bg="bg.sunken"
        borderWidth="1px"
        borderColor="border.default"
        w="fit-content"
      >
        {options.map((option, index) => {
          const isActive = option.value === value;
          return (
            <chakra.button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={index === tabStopIndex ? 0 : -1}
              onClick={() => onChange(option.value)}
              display="flex"
              alignItems="center"
              justifyContent="center"
              h="24px"
              minW={mono ? "30px" : undefined}
              px={mono ? "7px" : "10px"}
              borderRadius="xs"
              fontFamily={mono ? "mono" : "body"}
              fontSize={mono ? "11px" : "11.5px"}
              cursor="pointer"
              position="relative"
              bg="transparent"
              color={isActive ? "text.onBrand" : "text.muted"}
              transition="color 0.14s ease"
              _hover={{ color: isActive ? "text.onBrand" : "text.primary" }}
              _focusVisible={{ outline: "none", boxShadow: "outline" }}
            >
              {/* The pill glides to the chosen option. */}
              {isActive ? (
                <SlidingIndicator layoutId="segment-active" bg="bg.brand.solid" borderRadius="xs" />
              ) : null}
              <chakra.span position="relative">{option.label}</chakra.span>
            </chakra.button>
          );
        })}
      </Flex>
    </LayoutGroup>
  );
}

export const SegmentedControl = memo(
  SegmentedControlComponent,
) as typeof SegmentedControlComponent;
