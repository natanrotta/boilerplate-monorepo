import type { ButtonProps } from "@chakra-ui/react";
import { IconButton as ChakraIconButton } from "@chakra-ui/react";
import * as React from "react";
import { FiX } from "@/shared/components/icons";

export type CloseButtonProps = ButtonProps;

/**
 * The dismiss affordance shared by every overlay (dialog, drawer). It carries
 * no copy of its own: the `aria-label` comes from the call site so it can be
 * translated (`t("actions.close")`).
 */
export const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(props, ref) {
    return (
      <ChakraIconButton
        variant="ghost"
        size="sm"
        borderRadius="md"
        color="text.muted"
        _hover={{ bg: "bg.hover", color: "text.primary" }}
        ref={ref}
        {...props}
      >
        {props.children ?? <FiX />}
      </ChakraIconButton>
    );
  },
);
