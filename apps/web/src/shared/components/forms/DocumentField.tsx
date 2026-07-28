import { memo } from "react";
import { Field, Input, type InputProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { formatDocument, unformatDocument } from "@/shared/utils/document";

interface DocumentFieldProps extends Omit<InputProps, "onChange" | "value"> {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}

function DocumentFieldComponent({ label, error, value, onChange, ...props }: DocumentFieldProps) {
  const { t } = useTranslation("common");
  const displayValue = formatDocument(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = unformatDocument(e.target.value);
    onChange(raw);
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
      <Input
        value={displayValue}
        onChange={handleChange}
        placeholder={t("forms.documentPlaceholder")}
        {...props}
      />
      {error ? (
        <Field.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {error}
        </Field.ErrorText>
      ) : null}
    </Field.Root>
  );
}

export const DocumentField = memo(DocumentFieldComponent);
