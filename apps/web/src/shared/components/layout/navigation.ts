import type { AnimatedIconName } from "@/shared/components/icons/animated";
import { ROUTE_PATHS } from "@/app/router/RoutePaths";

export interface NavigationItem {
  labelKey: string;
  to: string;
  /** An `AnimatedIcon` glyph — plays while the row is hovered or focused. */
  icon: AnimatedIconName;
}

export interface NavigationSection {
  labelKey: string;
  items: NavigationItem[];
}

export const navigationSections: NavigationSection[] = [
  {
    labelKey: "nav.sections.main",
    items: [
      {
        labelKey: "nav.dashboard",
        to: ROUTE_PATHS.dashboard,
        icon: "dashboard",
      },
      {
        labelKey: "nav.settings",
        to: ROUTE_PATHS.settings,
        icon: "settings",
      },
    ],
  },
];

export const navigationItems = navigationSections.flatMap((section) => section.items);
