import { memo } from "react";
import { Field, Input, type InputProps } from "@chakra-ui/react";

interface FormFieldProps extends Omit<InputProps, "onChange"> {
  label?: string;
  error?: string;
  /** Optional helper copy rendered under the input when no error is present. */
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
}

export const FormField = memo(function FormField({
  label,
  error,
  helperText,
  value,
  onChange,
  ...props
}: FormFieldProps) {
  return (
    <Field.Root invalid={Boolean(error)}>
      {label && (
        <Field.Label
          fontSize="xs"
          fontWeight="600"
          color="text.secondary"
          mb={1}
          letterSpacing="0.01em"
        >
          {label}
        </Field.Label>
      )}
      <Input value={value} onChange={(event) => onChange(event.target.value)} {...props} />
      {error ? (
        <Field.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {error}
        </Field.ErrorText>
      ) : helperText ? (
        <Field.HelperText fontSize="xs" color="text.secondary">
          {helperText}
        </Field.HelperText>
      ) : null}
    </Field.Root>
  );
});
