import { memo } from "react";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { motion } from "motion/react";
import { Tooltip } from "@/components/ui/tooltip";
import { TRANSITION_SLOW } from "@/shared/constants/animation";
import type { IconType } from "@/shared/components/icons";
import type { ReactNode } from "react";
import { ActionMenu, type ActionMenuItem } from "@/shared/components/ui/ActionMenu";

const MotionBox = motion.create(Box);

interface EntityCardMetaItem {
  icon: IconType;
  label: string;
  color?: string;
}

export interface EntityCardQuickAction {
  icon: IconType;
  label: string;
  onClick: () => void;
}

interface EntityCardProps {
  avatar?: ReactNode;
  title: string;
  subtitle?: string;
  badges?: ReactNode[];
  metaItems?: EntityCardMetaItem[];
  actionItems?: ActionMenuItem[];
  quickActions?: EntityCardQuickAction[];
  footerEnd?: ReactNode;
  onClick?: () => void;
  /**
   * Fired on `mouseenter` / `focus`. Use with `usePrefetchEntity` to
   * warm the detail cache before the user clicks the card.
   */
  onHover?: () => void;
}

export const EntityCard = memo(function EntityCard({
  avatar,
  title,
  subtitle,
  badges,
  metaItems,
  actionItems,
  quickActions,
  footerEnd,
  onClick,
  onHover,
}: EntityCardProps) {
  return (
    <MotionBox
      data-cy="entity-card"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="lg"
      boxShadow="shadow.card"
      p={4}
      h="100%"
      display="flex"
      flexDirection="column"
      style={{
        transition:
          "box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1), transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      // onFocus bubbles up from inner focusable buttons (ActionMenu /
      // quickActions), so keyboard users get the prefetch without us
      // making the whole card focusable.
      onMouseEnter={onHover}
      onFocus={onHover}
      // Chakra v3's `_groupHover` matches the `group` CLASS, not `role="group"`:
      // with the role alone the quick actions stayed at `opacity: 0` on desktop
      // and were unreachable.
      className="group"
      _hover={
        onClick
          ? {
              boxShadow: { base: "shadow.card", md: "shadow.cardHover" },
              transform: { base: "none", md: "translateY(-2px)" },
              borderColor: { base: "border.subtle", md: "border.brand" },
            }
          : undefined
      }
      _active={onClick ? { transform: "scale(0.98)" } : undefined}
      position="relative"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={TRANSITION_SLOW}
    >
      <Flex justify="space-between" align="flex-start" mb={3}>
        <Flex align="center" gap={3} flex={1} minW={0}>
          {avatar}
          <Box flex={1} minW={0}>
            <Tooltip
              content={title}
              showArrow
              openDelay={400}
              positioning={{ placement: "top" }}
              contentProps={{ fontSize: "xs" }}
            >
              <Text fontWeight="700" fontSize="sm" lineClamp={1}>
                {title}
              </Text>
            </Tooltip>
            {subtitle && (
              <Text fontSize="xs" color="text.secondary" lineClamp={1} mt={0.5}>
                {subtitle}
              </Text>
            )}
          </Box>
        </Flex>
        {actionItems && actionItems.length > 0 && (
          <Box onClick={(e) => e.stopPropagation()} flexShrink={0}>
            <ActionMenu items={actionItems} />
          </Box>
        )}
      </Flex>

      {badges && badges.length > 0 && (
        <Flex gap={1.5} flexWrap="wrap" align="center">
          {badges}
        </Flex>
      )}

      {(metaItems && metaItems.length > 0) ||
      (quickActions && quickActions.length > 0) ||
      footerEnd ? (
        <Flex
          align={{
            base: quickActions && quickActions.length > 0 ? "flex-end" : "center",
            md: "center",
          }}
          gap={3}
          pt={3}
          mt="auto"
          borderTopWidth="1px"
          borderColor="border.subtle"
          minW={0}
        >
          {/* Meta stacks vertically on mobile so the items don't crowd into a
              single clipped row; reverts to a scrollable row from md up. */}
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            gap={{ base: 1.5, md: 3 }}
            flex={1}
            minW={0}
            overflowX={{ base: "visible", md: "auto" }}
            css={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {metaItems?.map((meta) => {
              const MetaIcon = meta.icon;
              return (
                <Flex key={meta.label} align="center" gap={1.5} flexShrink={0}>
                  <Box asChild color={meta.color ?? "text.secondary"} flexShrink={0} boxSize={3.5}>
                    <MetaIcon />
                  </Box>
                  <Text fontSize="xs" color={meta.color ?? "text.secondary"} whiteSpace="nowrap">
                    {meta.label}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
          {footerEnd && (
            <Flex flexShrink={0} onClick={(e) => e.stopPropagation()} align="center">
              {footerEnd}
            </Flex>
          )}
          {quickActions && quickActions.length > 0 && (
            <Flex
              gap={1}
              flexShrink={0}
              onClick={(e) => e.stopPropagation()}
              opacity={{ base: 1, md: 0 }}
              _groupHover={{ opacity: 1 }}
              _groupFocusWithin={{ opacity: 1 }}
              transition="opacity 0.15s ease"
            >
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Tooltip
                    key={action.label}
                    content={action.label}
                    showArrow
                    contentProps={{ fontSize: "xs" }}
                  >
                    <IconButton
                      aria-label={action.label}
                      size="xs"
                      variant="ghost"
                      color="text.secondary"
                      _hover={{ color: "text.brand", bg: "bg.brand.subtle" }}
                      onClick={action.onClick}
                    >
                      <Box asChild boxSize={3.5}>
                        <ActionIcon />
                      </Box>
                    </IconButton>
                  </Tooltip>
                );
              })}
            </Flex>
          )}
        </Flex>
      ) : null}
    </MotionBox>
  );
});
