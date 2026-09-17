import { Button, Flex } from "@chakra-ui/react";
import type { PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  type DialogSize,
} from "@/components/ui/dialog";

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
    // `onOpenChange` fires for every dismissal route (X, overlay, Esc); routing
    // only the close transition to `onClose` keeps the v2 contract exactly.
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => {
        if (!open) onClose();
      }}
      size={size ? SIZE_MAP[size] : undefined}
      scrollBehavior={scrollBehavior}
      placement="center"
    >
      <DialogContent data-cy="app-modal" borderRadius={borderRadius} mx={{ base: 3, md: 0 }}>
        <DialogHeader>
          <DialogTitle fontSize={{ base: "md", md: "lg" }}>{title}</DialogTitle>
        </DialogHeader>
        {/* The snippet carries no copy of its own — the label comes from here
            so it follows the active locale. */}
        <DialogCloseTrigger aria-label={t("actions.close")} />
        <DialogBody>{children}</DialogBody>
        <DialogFooter flexDirection={{ base: "column-reverse", sm: "row" }} gap={2}>
          {footerLeft && <Flex mr="auto">{footerLeft}</Flex>}
          <Button
            data-cy="app-modal-cancel"
            variant="ghost"
            onClick={onCancelAction ?? onClose}
            loading={isCancelLoading}
            w={{ base: "full", sm: "auto" }}
          >
            {cancelActionLabel ?? t("actions.cancel")}
          </Button>
          {primaryActionLabel && onPrimaryAction ? (
            <Button
              data-cy="app-modal-primary"
              colorPalette={primaryColorScheme}
              onClick={onPrimaryAction}
              loading={isPrimaryLoading}
              disabled={isPrimaryDisabled}
              w={{ base: "full", sm: "auto" }}
            >
              {primaryActionLabel}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
