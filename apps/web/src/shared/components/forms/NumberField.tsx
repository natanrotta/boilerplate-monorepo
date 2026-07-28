import { memo } from "react";
import { Field, NumberInput } from "@chakra-ui/react";

interface NumberFieldProps extends Omit<NumberInput.RootProps, "onChange" | "value"> {
  label?: string;
  value: number;
  error?: string;
  onChange: (value: number) => void;
}

function NumberFieldComponent({ label, value, error, onChange, ...props }: NumberFieldProps) {
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
      <NumberInput.Root
        value={String(value)}
        onValueChange={(details) =>
          onChange(Number.isNaN(details.valueAsNumber) ? 0 : details.valueAsNumber)
        }
        {...props}
      >
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
      {error ? (
        <Field.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {error}
        </Field.ErrorText>
      ) : null}
    </Field.Root>
  );
}

export const NumberField = memo(NumberFieldComponent);
