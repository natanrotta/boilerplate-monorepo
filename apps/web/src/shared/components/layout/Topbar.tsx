import {
  Avatar,
  Flex,
  IconButton,
  Menu,
  Portal,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiLogOut, FiMenu, FiUser } from "@/shared/components/icons";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";
import { useAuth } from "@/modules/auth";
import { ColorModeToggle } from "@/shared/components/ui/ColorModeToggle";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const { t } = useTranslation("common");
  const { user, signOut, isSubmitting } = useAuth();
  const shouldShowMenuButton = useBreakpointValue({ base: true, lg: false });

  return (
    <Flex
      align="center"
      justify="space-between"
      px={{ base: 4, md: 6 }}
      py={3.5}
      borderBottomWidth="1px"
      borderColor="border.subtle"
      bg="bg.topbar"
      backdropFilter="blur(16px)"
      position="sticky"
      top={0}
      zIndex={5}
    >
      <Flex align="center" gap={3}>
        {shouldShowMenuButton ? (
          <IconButton
            aria-label="Open navigation"
            variant="ghost"
            size="sm"
            onClick={onOpenSidebar}
          >
            <FiMenu />
          </IconButton>
        ) : null}
      </Flex>

      <Flex align="center" gap={2}>
        <ColorModeToggle size="sm" />
        <Menu.Root>
          <Menu.Trigger asChild>
            <Flex align="center" gap={3} cursor="pointer">
              <Text
                display={{ base: "none", md: "block" }}
                fontWeight="500"
                color="text.secondary"
                fontSize="sm"
              >
                {user?.name}
              </Text>
              <Avatar.Root size="sm" bg="brand.500" color="text.onBrand">
                <Avatar.Image src={user?.avatarUrl} />
                <Avatar.Fallback name={user?.name} />
              </Avatar.Root>
            </Flex>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="profile" asChild>
                  <RouterLink to={ROUTE_PATHS.profile}>
                    <FiUser />
                    {t("topbar.myProfile")}
                  </RouterLink>
                </Menu.Item>
                <Menu.Item
                  value="signOut"
                  onClick={() => void signOut()}
                  disabled={isSubmitting}
                >
                  <FiLogOut />
                  {t("topbar.signOut")}
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  );
}
