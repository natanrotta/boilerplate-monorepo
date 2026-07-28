import { memo } from "react";
import { Field, Input, InputGroup, Text, type InputProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { formatMonetary, unformatMonetary } from "@/shared/utils/monetary";

interface MonetaryFieldProps extends Omit<InputProps, "onChange" | "value"> {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}

function MonetaryFieldComponent({ label, error, value, onChange, ...props }: MonetaryFieldProps) {
  const { t } = useTranslation("common");
  const displayValue = formatMonetary(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = unformatMonetary(e.target.value);
    onChange(raw.slice(0, 11));
  }

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
      <InputGroup
        startElement={
          <Text fontSize="sm" color="text.muted" fontWeight="500">
            {t("forms.currencySymbol")}
          </Text>
        }
        startElementProps={{ pointerEvents: "none" }}
      >
        <Input
          value={displayValue}
          onChange={handleChange}
          placeholder={t("forms.monetaryPlaceholder")}
          inputMode="numeric"
          {...props}
        />
      </InputGroup>
      {error ? (
        <Field.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {error}
        </Field.ErrorText>
      ) : null}
    </Field.Root>
  );
}

export const MonetaryField = memo(MonetaryFieldComponent);
