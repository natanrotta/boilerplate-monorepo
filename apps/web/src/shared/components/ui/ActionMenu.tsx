import { memo } from "react";
import { IconButton, Menu, Portal } from "@chakra-ui/react";
import { FiMoreVertical } from "@/shared/components/icons";
import type { IconType } from "@/shared/components/icons";
import { useTranslation } from "react-i18next";

export interface ActionMenuItem {
  label: string;
  // Stable value for the v3 Menu.Item state machine. Falls back to `label`
  // (keeps behavior when callers don't set it) but pass `id` when two items
  // could share a translated label or when the label is i18n-volatile.
  id?: string;
  icon?: IconType;
  onClick: () => void;
  isDisabled?: boolean;
  isDanger?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
}

function ActionMenuComponent({ items }: ActionMenuProps) {
  const { t } = useTranslation("common");
  const normalItems = items.filter((item) => !item.isDanger);
  const dangerItems = items.filter((item) => item.isDanger);

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          aria-label={t("actions.actions")}
          variant="ghost"
          size="sm"
          borderRadius="md"
        >
          <FiMoreVertical />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {normalItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Menu.Item
                  key={item.id ?? item.label}
                  value={item.id ?? item.label}
                  onClick={item.onClick}
                  disabled={item.isDisabled}
                >
                  {ItemIcon ? <ItemIcon /> : null}
                  {item.label}
                </Menu.Item>
              );
            })}
            {dangerItems.length > 0 && normalItems.length > 0 && <Menu.Separator />}
            {dangerItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Menu.Item
                  key={item.id ?? item.label}
                  value={item.id ?? item.label}
                  onClick={item.onClick}
                  disabled={item.isDisabled}
                  color="status.error.fg"
                  _hover={{ bg: "status.error.bg", color: "status.error.fg" }}
                >
                  {/* Icon inherits the item's `status.error.fg` via currentColor. */}
                  {ItemIcon ? <ItemIcon /> : null}
                  {item.label}
                </Menu.Item>
              );
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export const ActionMenu = memo(ActionMenuComponent);
