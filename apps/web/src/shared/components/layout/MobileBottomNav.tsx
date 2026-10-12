import { memo } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { LayoutGroup } from "motion/react";
import { useTranslation } from "react-i18next";
import { SlidingIndicator } from "@/shared/components/animations/SlidingIndicator";
import { AnimatedIcon, useHoverPlay } from "@/shared/components/icons/animated";
import type { NavigationItem } from "@/shared/components/layout/navigation";
import { navigationItems } from "@/shared/components/layout/navigation";

const NavItem = memo(function NavItem({ item }: { item: NavigationItem }) {
  const { t } = useTranslation("common");
  const { playing, hostProps } = useHoverPlay();

  return (
    <NavLink to={item.to} style={{ flex: 1 }} {...hostProps}>
      {({ isActive }) => (
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap={0.5}
          py={1.5}
          color={isActive ? "text.brand" : "text.muted"}
          cursor="pointer"
          transition="color 0.15s ease"
          _active={{ transform: "scale(0.92)" }}
          role="group"
        >
          <Flex position="relative" align="center" justify="center" w={10} h={7}>
            {/* The pill hops to the tapped item. */}
            {isActive ? (
              <SlidingIndicator
                layoutId="bottom-nav-active"
                bg="bg.brand.subtle"
                borderRadius="full"
              />
            ) : null}
            <Flex position="relative">
              <AnimatedIcon name={item.icon} size={20} playing={playing} />
            </Flex>
          </Flex>
          <Text
            fontSize="2xs"
            fontWeight={isActive ? "700" : "500"}
            lineHeight="1"
            letterSpacing="0.01em"
          >
            {t(item.labelKey)}
          </Text>
        </Flex>
      )}
    </NavLink>
  );
});

export const MobileBottomNav = memo(function MobileBottomNav() {
  return (
    <Box
      display={{ base: "block", lg: "none" }}
      position="fixed"
      bottom="calc(env(safe-area-inset-bottom) + 12px)"
      left={3}
      right={3}
      zIndex={10}
      bg="bg.topbar"
      backdropFilter="blur(20px)"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="2xl"
      boxShadow="shadow.cardHover"
      overflow="hidden"
    >
      <Flex as="nav" role="navigation" aria-label="Main navigation">
        <LayoutGroup id="mobile-bottom-nav">
          {navigationItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </LayoutGroup>
      </Flex>
    </Box>
  );
});
