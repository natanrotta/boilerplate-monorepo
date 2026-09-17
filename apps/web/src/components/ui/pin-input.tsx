import { PinInput as ChakraPinInput, Group } from "@chakra-ui/react";
import * as React from "react";

export interface PinInputProps extends ChakraPinInput.RootProps {
  rootRef?: React.RefObject<HTMLDivElement | null>;
  count?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  attached?: boolean;
  /** Style props forwarded to every digit box (size, font, spacing). */
  inputStyle?: ChakraPinInput.InputProps;
}

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  function PinInput(props, ref) {
    const { count = 4, inputProps, inputStyle, rootRef, attached, ...rest } = props;
    return (
      // `count` drives BOTH the number of cells rendered here and the machine's
      // own completeness check — drop it from the root and `onValueComplete`
      // never fires, however many `Input`s are rendered.
      <ChakraPinInput.Root ref={rootRef} count={count} {...rest}>
        <ChakraPinInput.HiddenInput ref={ref} {...inputProps} />
        <ChakraPinInput.Control>
          <Group attached={attached}>
            {Array.from({ length: count }).map((_, index) => (
              // PinInput is a slot recipe, so the `input` recipe does not cover
              // it — the field language is applied here by hand.
              <ChakraPinInput.Input
                key={index}
                index={index}
                borderColor="border.default"
                focusVisibleRing="none"
                _hover={{ borderColor: "border.strong" }}
                _focusVisible={{
                  borderColor: "border.focus",
                  boxShadow: "input-focus",
                }}
                {...inputStyle}
              />
            ))}
          </Group>
        </ChakraPinInput.Control>
      </ChakraPinInput.Root>
    );
  },
);
