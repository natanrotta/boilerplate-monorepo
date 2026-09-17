import { memo } from "react";
import { IconButton } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
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
    <MenuRoot>
      {/* v3 drives the trigger with `asChild` instead of v2's `as={IconButton}`,
          and every item needs a stable `value` (it is the selection key). */}
      <MenuTrigger asChild>
        <IconButton
          aria-label={t("actions.actions")}
          variant="ghost"
          size="sm"
          borderRadius="md"
        >
          <FiMoreVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        {normalItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <MenuItem
              key={item.id ?? item.label}
              value={item.id ?? item.label}
              onClick={item.onClick}
              disabled={item.isDisabled}
            >
              {ItemIcon ? <ItemIcon /> : null}
              {item.label}
            </MenuItem>
          );
        })}
        {dangerItems.length > 0 && normalItems.length > 0 && <MenuSeparator />}
        {dangerItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <MenuItem
              key={item.id ?? item.label}
              value={item.id ?? item.label}
              onClick={item.onClick}
              disabled={item.isDisabled}
              color="status.error.fg"
              // v3 drives the hovered row with `data-highlighted` (pointer AND
              // keyboard), so `_highlighted` is what has to be overridden here.
              _highlighted={{ bg: "status.error.bg", color: "status.error.fg" }}
            >
              {/* Icon inherits the item's `status.error.fg` via currentColor. */}
              {ItemIcon ? <ItemIcon /> : null}
              {item.label}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
}

export const ActionMenu = memo(ActionMenuComponent);
