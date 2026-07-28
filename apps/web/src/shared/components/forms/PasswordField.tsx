import { memo } from "react";
import { Field, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff } from "@/shared/components/icons";

interface PasswordFieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}

function PasswordFieldComponent({
  label,
  value,
  error,
  onChange,
  placeholder,
  autoComplete,
}: PasswordFieldProps) {
  const { t } = useTranslation("common");
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Field.Root invalid={Boolean(error)}>
      <Field.Label
        fontSize="xs"
        fontWeight="600"
        color="text.secondary"
        mb={1}
        letterSpacing="0.01em"
      >
        {label}
      </Field.Label>
      <InputGroup
        endElement={
          <IconButton
            aria-label={isVisible ? t("forms.hidePassword") : t("forms.showPassword")}
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible((state) => !state)}
          >
            {isVisible ? <FiEyeOff /> : <FiEye />}
          </IconButton>
        }
        endElementProps={{ pointerEvents: "auto" }}
      >
        <Input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
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

export const PasswordField = memo(PasswordFieldComponent);
