import { memo } from "react";
import { Field, Textarea, type TextareaProps } from "@chakra-ui/react";

interface TextAreaFieldProps extends Omit<TextareaProps, "onChange" | "value"> {
  label?: string;
  value: string;
  error?: string;
  /** Optional helper copy rendered under the textarea when no error is present. */
  helperText?: string;
  onChange: (value: string) => void;
}

function TextAreaFieldComponent({
  label,
  value,
  error,
  helperText,
  onChange,
  ...props
}: TextAreaFieldProps) {
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
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} {...props} />
      {error ? (
        <Field.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {error}
        </Field.ErrorText>
      ) : helperText ? (
        <Field.HelperText>{helperText}</Field.HelperText>
      ) : null}
    </Field.Root>
  );
}

export const TextAreaField = memo(TextAreaFieldComponent);
