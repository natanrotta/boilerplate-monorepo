import { Field as ChakraField } from "@chakra-ui/react";
import * as React from "react";

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
}

/**
 * Label / helper / error chrome for every form control. `Field` is a multi-part
 * component in Chakra v3, so its slots are styled here rather than through a
 * theme slot recipe — one definition point for the whole `shared/components/forms`
 * family.
 */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(props, ref) {
  const { label, children, helperText, errorText, optionalText, ...rest } = props;
  return (
    <ChakraField.Root ref={ref} width="full" {...rest}>
      {label && (
        <ChakraField.Label
          fontSize="xs"
          fontWeight="600"
          color="text.secondary"
          letterSpacing="0.01em"
          mb={1}
        >
          {label}
          <ChakraField.RequiredIndicator fallback={optionalText} />
        </ChakraField.Label>
      )}
      {children}
      {helperText && (
        <ChakraField.HelperText fontSize="xs" color="text.secondary">
          {helperText}
        </ChakraField.HelperText>
      )}
      {errorText && (
        <ChakraField.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {errorText}
        </ChakraField.ErrorText>
      )}
    </ChakraField.Root>
  );
});

export const FieldRoot = ChakraField.Root;
export const FieldLabel = ChakraField.Label;
export const FieldErrorText = ChakraField.ErrorText;
export const FieldHelperText = ChakraField.HelperText;
