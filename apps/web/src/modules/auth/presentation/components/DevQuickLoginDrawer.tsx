import { Badge, Button, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DevQuickLoginPanel } from "@/modules/auth/presentation/components/DevQuickLoginPanel";
import { useDevQuickLogin } from "@/modules/auth/presentation/hooks/useDevQuickLogin";

/**
 * The dev quick login, out of the way: a small floating "DEV" button on the
 * sign-in page that opens the user list in a drawer — the sign-in card itself
 * stays exactly as production shows it.
 *
 * IMPORTANT: mount it ONLY under `import.meta.env.DEV`. It renders nothing
 * when the API does not expose the dev routes (NODE_ENV=local +
 * DEV_QUICK_LOGIN_ENABLED=true).
 */
export function DevQuickLoginDrawer() {
  const { t } = useTranslation(["auth", "common"]);
  const { open, onOpen, onClose } = useDisclosure();
  const { isDisabled } = useDevQuickLogin();

  if (isDisabled) return null;

  return (
    <>
      <Button
        data-cy="dev-quick-login-trigger"
        size="sm"
        variant="outline"
        position="fixed"
        // Bottom-right: the bottom-left corner belongs to the query devtools.
        bottom={{ base: 4, md: 6 }}
        right={{ base: 4, md: 6 }}
        zIndex={2}
        bg="bg.elevated"
        onClick={onOpen}
      >
        <Badge colorPalette="gray" fontSize="2xs" px={1.5} borderRadius="sm">
          DEV
        </Badge>
        {t("auth:signIn.devLogin.title")}
      </Button>

      <DrawerRoot
        open={open}
        placement="end"
        onOpenChange={({ open: isOpen }) => {
          if (!isOpen) onClose();
        }}
      >
        <DrawerContent data-cy="dev-quick-login-drawer" maxW="380px">
          <DrawerHeader>
            <DrawerTitle fontSize="15px" fontWeight="500">
              {t("auth:signIn.devLogin.title")}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerCloseTrigger aria-label={t("common:actions.close")} />
          <DrawerBody>
            {/* Mounted only while open (the list itself is already cached by the trigger's query). */}
            {open ? <DevQuickLoginPanel /> : null}
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
}
