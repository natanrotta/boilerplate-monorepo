import { useRef } from "react";
import { Button, Dialog, Portal } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isDanger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isLoading = false,
  isDanger = true,
}: ConfirmDialogProps) {
  const { t } = useTranslation("common");
  const cancelRef = useRef<HTMLButtonElement>(null);

  const resolvedTitle = title ?? t("confirmDialog.defaultTitle");
  const resolvedDescription = description ?? t("confirmDialog.defaultDescription");
  const resolvedConfirmLabel = confirmLabel ?? t("actions.confirm");
  const resolvedCancelLabel = cancelLabel ?? t("actions.cancel");

  return (
    <Dialog.Root
      role="alertdialog"
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      // Focus the least-destructive (cancel) button when the dialog opens,
      // preserving the v2 `leastDestructiveRef` behavior.
      initialFocusEl={() => cancelRef.current}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="lg" mx={{ base: 4, md: 0 }}>
            <Dialog.Header fontSize="md" fontWeight="700">
              <Dialog.Title>{resolvedTitle}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body fontSize="sm" color="text.secondary">
              {resolvedDescription}
            </Dialog.Body>
            <Dialog.Footer gap={2}>
              <Button ref={cancelRef} size="sm" variant="ghost" onClick={onClose}>
                {resolvedCancelLabel}
              </Button>
              <Button
                size="sm"
                colorPalette={isDanger ? "red" : "brand"}
                onClick={onConfirm}
                loading={isLoading}
              >
                {resolvedConfirmLabel}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
