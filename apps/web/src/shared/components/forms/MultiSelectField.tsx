import { memo } from "react";
import {
  Checkbox,
  Flex,
  Field,
  Icon,
  Popover,
  Portal,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiChevronDown } from "@/shared/components/icons";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectFieldProps {
  label?: string;
  value: string[];
  options: MultiSelectOption[];
  error?: string;
  onChange: (value: string[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

function MultiSelectFieldComponent({
  label,
  value,
  options,
  error,
  onChange,
  isDisabled,
  placeholder = "Selecione...",
}: MultiSelectFieldProps) {
  const { open, onOpen, onClose } = useDisclosure();
  const selectedSet = new Set(value);

  function handleToggle(optionValue: string) {
    if (selectedSet.has(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  function handleRemove(optionValue: string) {
    onChange(value.filter((v) => v !== optionValue));
  }

  const selectedLabels = options.filter((o) => selectedSet.has(o.value));

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
      <Popover.Root
        open={open}
        onOpenChange={(e) => {
          if (isDisabled) return;
          if (e.open) onOpen();
          else onClose();
        }}
        positioning={{ placement: "bottom-start", sameWidth: true }}
      >
        <Popover.Trigger asChild>
          <Flex
            borderWidth="1.5px"
            borderColor={open ? "brand.400" : "gray.200"}
            borderRadius="sm"
            px={3}
            py={2}
            minH="40px"
            align="center"
            cursor={isDisabled ? "not-allowed" : "pointer"}
            opacity={isDisabled ? 0.7 : 1}
            bg={isDisabled ? "gray.50" : "white"}
            _hover={isDisabled ? undefined : { borderColor: "gray.300" }}
            boxShadow={open ? "input-focus" : "none"}
            transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
          >
            <Flex flex={1} gap={1.5} flexWrap="wrap" align="center" minW={0}>
              {selectedLabels.length > 0 ? (
                selectedLabels.map((opt) => (
                  <Tag.Root
                    key={opt.value}
                    size="sm"
                    colorPalette="brand"
                    variant="subtle"
                    borderRadius="sm"
                  >
                    <Tag.Label>{opt.label}</Tag.Label>
                    {!isDisabled && (
                      <Tag.EndElement>
                        <Tag.CloseTrigger
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(opt.value);
                          }}
                        />
                      </Tag.EndElement>
                    )}
                  </Tag.Root>
                ))
              ) : (
                <Text fontSize="sm" color="text.muted">
                  {placeholder}
                </Text>
              )}
            </Flex>
            <Icon as={FiChevronDown} boxSize={4} color="text.muted" flexShrink={0} ml={2} />
          </Flex>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content
              w="100%"
              borderWidth="1.5px"
              borderColor="border.default"
              borderRadius="lg"
              boxShadow="shadow.card"
              _focusVisible={{ outline: "none" }}
            >
              <Popover.Body p={1}>
                <Flex direction="column" maxH="200px" overflowY="auto">
                  {options.map((option) => (
                    <Flex
                      key={option.value}
                      align="center"
                      gap={2}
                      px={3}
                      py={2}
                      borderRadius="xs"
                      cursor="pointer"
                      transition="background 0.15s ease"
                      _hover={{ bg: "bg.hover" }}
                      onClick={() => handleToggle(option.value)}
                    >
                      <Checkbox.Root
                        checked={selectedSet.has(option.value)}
                        colorPalette="brand"
                        pointerEvents="none"
                        size="sm"
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control borderColor="border.strong" />
                      </Checkbox.Root>
                      <Text fontSize="sm" color="text.primary">
                        {option.label}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
      {error ? (
        <Field.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {error}
        </Field.ErrorText>
      ) : null}
    </Field.Root>
  );
}

export const MultiSelectField = memo(MultiSelectFieldComponent);
