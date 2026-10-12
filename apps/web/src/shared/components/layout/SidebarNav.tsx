import { memo, useId } from "react";
import { LayoutGroup } from "motion/react";
import { Box, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import { useColorMode } from "@/components/ui/color-mode";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiChevronUp,
  FiChevronsLeft,
  FiChevronsRight,
  FiLogOut,
  FiMoon,
  FiSettings,
  FiSun,
} from "@/shared/components/icons";
import { AnimatedIcon, useHoverPlay } from "@/shared/components/icons/animated";
import { SlidingIndicator } from "@/shared/components/animations/SlidingIndicator";
import { BrandMark } from "@/shared/components/ui/BrandMark";
import type { NavigationItem } from "@/shared/components/layout/navigation";
import { navigationSections } from "@/shared/components/layout/navigation";
import { AppVersion } from "@/shared/components/layout/AppVersion";
import { useAuth } from "@/modules/auth";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";
import { useSidebar } from "@/shared/contexts/useSidebar";

interface SidebarNavProps {
  forceExpanded?: boolean;
  onNavigate?: () => void;
}

interface NavRowProps {
  item: NavigationItem;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

const NavRow = memo(function NavRow({ item, isCollapsed, onNavigate }: NavRowProps) {
  const { t } = useTranslation("common");
  // The whole row plays the icon: hover or keyboard focus on the link.
  const { playing, hostProps } = useHoverPlay();

  const renderItem = (isActive: boolean) => {
    const navItem = (
      <Flex
        position="relative"
        align="center"
        justify={isCollapsed ? "center" : "flex-start"}
        gap={3}
        px={isCollapsed ? 0 : 3}
        py={{ base: 2.5, lg: 2 }}
        borderRadius="md"
        color={isActive ? "text.brand" : "text.secondary"}
        borderLeftWidth={isCollapsed ? "0" : "3px"}
        borderLeftColor="transparent"
        cursor="pointer"
        _hover={{
          bg: isActive ? "transparent" : "bg.hover",
          transform: isActive || isCollapsed ? "none" : "translateX(2px)",
        }}
        transition="all 0.18s cubic-bezier(0.22, 1, 0.36, 1)"
      >
        {/* The tint and its marker glide from the previous row to this one.
            It covers the row's (transparent) left border too. */}
        {isActive ? (
          <SlidingIndicator
            layoutId="sidebar-active"
            left={isCollapsed ? 0 : "-3px"}
            bg="bg.brand.subtle"
            borderRadius="md"
            borderLeftWidth={isCollapsed ? "0" : "3px"}
            borderLeftColor="brand.500"
          />
        ) : null}
        <Flex position="relative" flexShrink={0}>
          <AnimatedIcon name={item.icon} size={18} playing={playing} />
        </Flex>
        <Text
          position="relative"
          fontWeight={isActive ? "700" : "500"}
          fontSize="sm"
          opacity={isCollapsed ? 0 : 1}
          w={isCollapsed ? 0 : "auto"}
          overflow="hidden"
          transition="opacity 0.15s ease"
          whiteSpace="nowrap"
        >
          {t(item.labelKey)}
        </Text>
      </Flex>
    );

    if (isCollapsed) {
      return (
        <Tooltip
          content={t(item.labelKey)}
          positioning={{ placement: "right" }}
          showArrow
          openDelay={200}
        >
          {navItem}
        </Tooltip>
      );
    }

    return navItem;
  };

  return (
    <NavLink to={item.to} onClick={onNavigate} {...hostProps}>
      {({ isActive }) => renderItem(isActive)}
    </NavLink>
  );
});

export function SidebarNav({ forceExpanded, onNavigate }: SidebarNavProps) {
  const layoutGroupId = useId();
  const { t } = useTranslation("common");
  const { user, signOut, isSubmitting } = useAuth();
  const sidebar = useSidebar();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const isCollapsed = forceExpanded ? false : sidebar.isCollapsed;
  const toggleSidebar = sidebar.toggleSidebar;

  const showToggle = !forceExpanded;

  return (
    <Flex
      direction="column"
      h="full"
      px={isCollapsed ? 2 : 4}
      py={4}
      gap={3}
      overflow="hidden"
      transition="padding 0.2s ease"
    >
      {/* Logo */}
      <Flex align="center" gap={3} px={1} justify={isCollapsed ? "center" : "flex-start"}>
        <BrandMark size={36} />
        <Box
          flex={1}
          minW={0}
          opacity={isCollapsed ? 0 : 1}
          transition="opacity 0.15s ease"
          display={isCollapsed ? "none" : "block"}
        >
          <Text
            fontSize="sm"
            fontWeight="800"
            color="text.primary"
            letterSpacing="-0.01em"
            whiteSpace="nowrap"
          >
            {t("platform.name", "Boilerplate")}
          </Text>
          <Text fontSize="xs" color="text.muted" whiteSpace="nowrap">
            {t("platform.tagline", "")}
          </Text>
        </Box>
      </Flex>

      {/* Toggle button — separate row */}
      {showToggle && (
        <Flex justify={isCollapsed ? "center" : "flex-end"} px={1}>
          <IconButton
            aria-label={
              isCollapsed
                ? t("sidebar.expand", "Expandir menu")
                : t("sidebar.collapse", "Recolher menu")
            }
            size="xs"
            variant="ghost"
            color="text.muted"
            _hover={{ color: "text.primary", bg: "bg.hover" }}
            onClick={toggleSidebar}
          >
            <Icon as={isCollapsed ? FiChevronsRight : FiChevronsLeft} />
          </IconButton>
        </Flex>
      )}

      {/* Navigation */}
      <Flex
        direction="column"
        gap={4}
        flex={1}
        minH={0}
        overflowY="auto"
        css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
      >
        {/* Its own group: the desktop sidebar and the mobile drawer never
            trade indicators. */}
        <LayoutGroup id={layoutGroupId}>
          {navigationSections.map((section) => (
            <Box key={t(section.labelKey)}>
              <Text
                px={2}
                fontSize="xs"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="wider"
                color="text.muted"
                opacity={isCollapsed ? 0 : 1}
                h={isCollapsed ? 0 : "auto"}
                mb={isCollapsed ? 0 : 1.5}
                overflow="hidden"
                transition="opacity 0.15s ease, height 0.2s ease, margin 0.2s ease"
                whiteSpace="nowrap"
              >
                {t(section.labelKey)}
              </Text>
              <Flex direction="column" gap={1}>
                {section.items.map((item) => (
                  <NavRow
                    key={item.to}
                    item={item}
                    isCollapsed={isCollapsed}
                    onNavigate={onNavigate}
                  />
                ))}
              </Flex>
            </Box>
          ))}
        </LayoutGroup>
      </Flex>

      {/* User area - Discord style */}
      {user && (
        <Flex
          align="center"
          gap={2}
          borderTopWidth="1px"
          borderColor="border.subtle"
          px={isCollapsed ? 0 : 3}
          py={2}
          mx={isCollapsed ? 0 : -1}
        >
          <MenuRoot positioning={{ placement: "top-start" }}>
            <Tooltip
              content={isCollapsed ? user.name : ""}
              positioning={{ placement: "right" }}
              showArrow
              disabled={!isCollapsed}
            >
              <MenuTrigger asChild>
                <Box
                  data-cy="user-menu-trigger"
                  cursor="pointer"
                  borderRadius="lg"
                  _hover={{ bg: "bg.hover" }}
                  transition="all 0.15s ease"
                  flex={1}
                  minW={0}
                  px={isCollapsed ? 0 : 1}
                  py={1}
                >
                  <Flex align="center" gap={3} justify={isCollapsed ? "center" : "flex-start"}>
                    <Avatar
                      size="sm"
                      bg="brand.500"
                      color="text.onBrand"
                      fontSize="xs"
                      fontWeight="700"
                      flexShrink={0}
                      name={user.name}
                      src={user.avatarUrl || undefined}
                    />
                    <Box
                      flex={1}
                      minW={0}
                      opacity={isCollapsed ? 0 : 1}
                      display={isCollapsed ? "none" : "block"}
                      transition="opacity 0.15s ease"
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="text.primary"
                        lineClamp={1}
                        lineHeight="short"
                        whiteSpace="nowrap"
                      >
                        {user.name}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="text.muted"
                        lineClamp={1}
                        lineHeight="short"
                        whiteSpace="nowrap"
                      >
                        {user.email}
                      </Text>
                    </Box>
                    {!isCollapsed && (
                      <Icon
                        as={FiChevronUp}
                        boxSize={4}
                        color="text.muted"
                        flexShrink={0}
                        aria-hidden
                      />
                    )}
                  </Flex>
                </Box>
              </MenuTrigger>
            </Tooltip>
            <MenuContent fontSize="sm">
              <MenuItem value="settings" onClick={() => navigate(ROUTE_PATHS.settings)}>
                <Icon as={FiSettings} boxSize={4} />
                {t("nav.settings")}
              </MenuItem>
              <MenuItem value="toggleTheme" onClick={toggleColorMode} closeOnSelect={false}>
                <Icon as={isDark ? FiSun : FiMoon} boxSize={4} />
                {isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
              </MenuItem>
              <MenuSeparator />
              {/* Icon rendered as a child (not the `icon` prop) so the row's
               *  children are direct flex items — lets <AppVersion ml="auto">
               *  push the version to the far right. */}
              <MenuItem
                data-cy="user-menu-sign-out"
                value="signOut"
                color="status.error.fg"
                onClick={signOut}
                disabled={isSubmitting}
              >
                <Icon as={FiLogOut} boxSize={4} me={3} aria-hidden />
                {t("actions.signOut")}
                <AppVersion ml="auto" pl={3} />
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </Flex>
      )}
    </Flex>
  );
}
