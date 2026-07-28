import { Button, CloseButton, Dialog, Flex, Portal } from "@chakra-ui/react";
import type { DialogRootProps } from "@chakra-ui/react";
import type { PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";

type DialogSize = NonNullable<DialogRootProps["size"]>;

/**
 * Chakra v3's Dialog dropped the `2xl`/`3xl` sizes it accepted in v2. Keep the
 * public prop shape backward-compatible and clamp the removed sizes down to the
 * widest supported size (`xl`).
 */
const SIZE_MAP: Record<AppModalProps["size"] & string, DialogSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "xl",
  "3xl": "xl",
};

interface AppModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  borderRadius?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  isPrimaryLoading?: boolean;
  isPrimaryDisabled?: boolean;
  primaryColorScheme?: string;
  footerLeft?: ReactNode;
  /**
   * Overrides the footer cancel button. By default it just closes the modal;
   * pass an action (e.g. "discard this draft") + label when cancelling means
   * more than closing. The X / overlay close keeps calling `onClose`.
   */
  onCancelAction?: () => void;
  cancelActionLabel?: string;
  isCancelLoading?: boolean;
  /**
   * Chakra scroll strategy. Pass "inside" for tall bodies (long lists) so the
   * body scrolls while the header + footer stay pinned — keeps the CTA visible.
   */
  scrollBehavior?: "inside" | "outside";
}

export function AppModal({
  isOpen,
  onClose,
  title,
  size,
  borderRadius = "lg",
  primaryActionLabel,
  onPrimaryAction,
  isPrimaryLoading,
  isPrimaryDisabled,
  primaryColorScheme = "brand",
  footerLeft,
  onCancelAction,
  cancelActionLabel,
  isCancelLoading,
  scrollBehavior,
  children,
}: AppModalProps) {
  const { t } = useTranslation("common");

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      size={size ? SIZE_MAP[size] : undefined}
      scrollBehavior={scrollBehavior}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <Dialog.Positioner>
          <Dialog.Content borderRadius={borderRadius} mx={{ base: 3, md: 0 }}>
            <Dialog.Header fontSize={{ base: "md", md: "lg" }}>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Body>{children}</Dialog.Body>
            <Dialog.Footer flexDirection={{ base: "column-reverse", sm: "row" }} gap={2}>
              {footerLeft && <Flex mr="auto">{footerLeft}</Flex>}
              <Button
                variant="ghost"
                onClick={onCancelAction ?? onClose}
                loading={isCancelLoading}
                w={{ base: "full", sm: "auto" }}
              >
                {cancelActionLabel ?? t("actions.cancel")}
              </Button>
              {primaryActionLabel && onPrimaryAction ? (
                <Button
                  colorPalette={primaryColorScheme}
                  onClick={onPrimaryAction}
                  loading={isPrimaryLoading}
                  disabled={isPrimaryDisabled}
                  w={{ base: "full", sm: "auto" }}
                >
                  {primaryActionLabel}
                </Button>
              ) : null}
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
