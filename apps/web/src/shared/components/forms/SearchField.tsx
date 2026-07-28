import { memo } from "react";
import { Field, Icon, IconButton, Input, InputGroup, type InputProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiX } from "@/shared/components/icons";

interface SearchFieldProps extends Omit<InputProps, "type" | "variant"> {
  onClear?: () => void;
  variant?: "default" | "rounded";
  label?: string;
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

function SearchFieldComponent({
  onClear,
  variant = "default",
  value,
  label,
  error,
  inputRef,
  m,
  mt,
  mb,
  ml,
  mr,
  mx,
  my,
  ...props
}: SearchFieldProps) {
  const { t } = useTranslation("common");
  const hasValue = Boolean(value && String(value).length > 0);

  return (
    // Margin props target the Field.Root, NOT the inner Input: a margin on the
    // input inflates the flex InputGroup's height, which pushes the absolutely
    // positioned (stretched) search icon below the input's centre.
    <Field.Root invalid={Boolean(error)} m={m} mt={mt} mb={mb} ml={ml} mr={mr} mx={mx} my={my}>
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
      {/* data-animate-host: lets the FiSearch icon animate on focus/hover of the group */}
      <InputGroup
        data-animate-host
        startElement={<Icon as={FiSearch} boxSize={4} color="text.muted" />}
        endElement={
          hasValue && onClear ? (
            <IconButton
              aria-label={t("forms.clearSearch")}
              variant="ghost"
              size="xs"
              color="text.muted"
              onClick={onClear}
            >
              <Icon as={FiX} />
            </IconButton>
          ) : undefined
        }
        endElementProps={{ pointerEvents: "auto" }}
      >
        <Input
          ref={inputRef}
          type="text"
          value={value}
          borderRadius={variant === "rounded" ? "full" : undefined}
          {...props}
        />
      </InputGroup>
      {error && (
        <Field.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
}

export const SearchField = memo(SearchFieldComponent);
