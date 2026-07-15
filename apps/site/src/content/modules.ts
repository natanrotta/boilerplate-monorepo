import {
  Activity,
  Calendar,
  Layers,
  SlidersHorizontal,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Generic product features shown in the Features carousel. Each slide pairs an
// icon with copy. Copy lives in the locale files under `modules.items.<id>`;
// the icon is a static Lucide glyph. Swap the icons and copy for your product.
export type FeatureId =
  | "workflows"
  | "automation"
  | "analytics"
  | "collaboration"
  | "integrations"
  | "customization";

export type FeatureSlide = {
  id: FeatureId;
  icon: LucideIcon;
};

export const FEATURE_SLIDES: FeatureSlide[] = [
  { id: "workflows", icon: Layers },
  { id: "automation", icon: Zap },
  { id: "analytics", icon: Activity },
  { id: "collaboration", icon: Users },
  { id: "integrations", icon: Calendar },
  { id: "customization", icon: SlidersHorizontal },
];
