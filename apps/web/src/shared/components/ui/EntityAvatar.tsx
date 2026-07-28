import { memo } from "react";
import { Avatar } from "@chakra-ui/react";
import { getInitials } from "@/shared/utils/string";

type AvatarSize = "sm" | "md" | "lg";

interface EntityAvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  /**
   * Two-color gradient stops for the fallback background (135° ≈ `to-br`).
   * Defaults to the brand ramp. Kept as a `[from, to]` tuple so the v3
   * gradient props can be wired directly.
   */
  gradient?: [from: string, to: string];
}

export const EntityAvatar = memo(function EntityAvatar({
  name,
  src,
  size = "sm",
  gradient = ["brand.400", "brand.600"],
}: EntityAvatarProps) {
  const fontSizeMap: Record<AvatarSize, string> = {
    sm: "xs",
    md: "sm",
    lg: "lg",
  };
  const [gradientFrom, gradientTo] = gradient;

  return (
    <Avatar.Root size={size} color="text.onBrand">
      <Avatar.Fallback
        // Gradient fallback (135deg ≈ to-br) shown when there's no image.
        bgGradient={src ? undefined : "to-br"}
        gradientFrom={src ? undefined : gradientFrom}
        gradientTo={src ? undefined : gradientTo}
        fontWeight="700"
        fontSize={fontSizeMap[size]}
      >
        {getInitials(name)}
      </Avatar.Fallback>
      <Avatar.Image src={src ?? undefined} />
    </Avatar.Root>
  );
});
