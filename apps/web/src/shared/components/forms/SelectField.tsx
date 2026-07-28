import { memo } from "react";
import { Field, NativeSelect } from "@chakra-ui/react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps extends Omit<NativeSelect.FieldProps, "onChange" | "value"> {
  label?: string;
  options: SelectOption[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function SelectFieldComponent({
  label,
  options,
  value,
  error,
  onChange,
  placeholder,
  ...props
}: SelectFieldProps) {
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
      <NativeSelect.Root>
        <NativeSelect.Field
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          cursor="pointer"
          color={value ? undefined : "text.muted"}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {error ? (
        <Field.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {error}
        </Field.ErrorText>
      ) : null}
    </Field.Root>
  );
}

export const SelectField = memo(SelectFieldComponent);
