import { Box, chakra } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "@/hooks/useLocale";

/**
 * One bordered square that shows where a press takes you — a sun while the
 * site is dark, a moon while it is light. Both icons are rendered and the
 * color mode's CSS class picks one, so there is no flash and no color-mode
 * branch in the markup.
 */
export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { dict } = useLocale();

  return (
    <chakra.button
      type="button"
      aria-label={dict.header.toggleTheme}
      title={dict.header.toggleTheme}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxSize="32px"
      flexShrink={0}
      borderRadius="sm"
      borderWidth="1px"
      borderColor="border.default"
      bg="bg.surface"
      color="text.primary"
      transition="background 0.15s"
      _hover={{ bg: "bg.hover" }}
      _focusVisible={{ outline: "none", borderColor: "border.focus", boxShadow: "shadow.focus" }}
    >
      <Box asChild boxSize="15px" display="none" _dark={{ display: "block" }} aria-hidden>
        <Sun />
      </Box>
      <Box asChild boxSize="15px" _dark={{ display: "none" }} aria-hidden>
        <Moon />
      </Box>
    </chakra.button>
  );
};
