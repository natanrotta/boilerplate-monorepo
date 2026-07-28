import { memo, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  Box,
  Button,
  Field,
  Popover,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiChevronDown } from "@/shared/components/icons";
import { useTranslation } from "react-i18next";
import { SearchField } from "./SearchField";
import { COUNTRIES, flagFromCode } from "@/shared/constants/countries";

interface CountrySelectFieldProps {
  label?: string;
  /** ISO 3166-1 alpha-2 (uppercase) or empty string for "no country selected". */
  value: string;
  /** Receives the new ISO code. */
  onChange: (code: string) => void;
  placeholder?: string;
  error?: string;
}

interface CountryOption {
  code: string;
  flag: string;
  name: string;
}

/**
 * Returns localized country names using the browser's built-in
 * `Intl.DisplayNames`. Avoids shipping ~250 translated strings per locale
 * and stays in sync with whatever the OS/browser ships. Falls back to the
 * raw ISO code if `Intl.DisplayNames` is unavailable (very old browsers).
 */
function buildLocalizedNames(language: string): Map<string, string> {
  const map = new Map<string, string>();
  const DisplayNames = (Intl as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames;
  if (!DisplayNames) {
    COUNTRIES.forEach((c) => map.set(c.code, c.code));
    return map;
  }

  try {
    const formatter = new DisplayNames([language], { type: "region", fallback: "code" });
    COUNTRIES.forEach((c) => map.set(c.code, formatter.of(c.code) ?? c.code));
  } catch {
    COUNTRIES.forEach((c) => map.set(c.code, c.code));
  }

  return map;
}

/**
 * Diacritic-insensitive lowercase normalization. Lets users search "uniao"
 * and match "União", "espana" → "España", etc. without typing the accents.
 */
function foldText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function CountrySelectFieldComponent({
  label,
  value,
  onChange,
  placeholder,
  error,
}: CountrySelectFieldProps) {
  const { i18n, t } = useTranslation("common");
  const { open, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const tryFocus = (attempt = 0) => {
      if (cancelled) return;
      const el = searchInputRef.current;
      if (el && document.contains(el)) {
        el.focus({ preventScroll: true });
        if (document.activeElement === el) return;
      }
      if (attempt < 10) {
        requestAnimationFrame(() => tryFocus(attempt + 1));
      }
    };
    tryFocus();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const allOptions = useMemo<CountryOption[]>(() => {
    const names = buildLocalizedNames(i18n.language);
    return COUNTRIES.map((c) => ({
      code: c.code,
      flag: c.flag,
      name: names.get(c.code) ?? c.code,
    })).sort((a, b) => a.name.localeCompare(b.name, i18n.language));
  }, [i18n.language]);

  const filteredOptions = useMemo<CountryOption[]>(() => {
    const trimmed = search.trim();
    if (!trimmed) return allOptions;
    const folded = foldText(trimmed);
    return allOptions.filter(
      (option) =>
        foldText(option.name).includes(folded) || option.code.toLowerCase().includes(folded)
    );
  }, [allOptions, search]);

  const selected = useMemo<CountryOption | null>(() => {
    if (!value) return null;
    const found = allOptions.find((option) => option.code === value);
    if (found) return found;
    return { code: value, flag: flagFromCode(value), name: value };
  }, [allOptions, value]);

  const handleOpen = useCallback(() => {
    setSearch("");
    setActiveIndex(0);
    onOpen();
  }, [onOpen]);

  const handleSelect = useCallback(
    (code: string) => {
      onChange(code);
      onClose();
    },
    [onChange, onClose]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, Math.max(filteredOptions.length - 1, 0)));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        const target = filteredOptions[activeIndex];
        if (target) handleSelect(target.code);
      } else if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    },
    [filteredOptions, activeIndex, handleSelect, onClose]
  );

  const triggerPlaceholder = placeholder ?? t("address.placeholder.countryCode");

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
          if (e.open) handleOpen();
          else onClose();
        }}
        positioning={{ placement: "bottom-start", sameWidth: true }}
        autoFocus={false}
        lazyMount
        unmountOnExit
      >
        <Popover.Trigger asChild>
          <Button
            type="button"
            variant="outline"
            justifyContent="space-between"
            w="100%"
            fontWeight="normal"
            color={selected ? "text.primary" : "text.muted"}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={label ?? t("address.fields.countryCode")}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            // Mirror the FormField <Input> look (theme/components/input.ts) so the
            // country trigger matches the surrounding address inputs exactly.
            h={{ base: "44px", md: "40px" }}
            px={4}
            bg="bg.surface"
            borderWidth="1.5px"
            borderColor="border.default"
            borderRadius="sm"
            fontSize={{ base: "16px", md: "sm" }}
            transition="all 0.2s cubic-bezier(0.22, 1, 0.36, 1)"
            _hover={{ borderColor: "border.strong", bg: "bg.surface" }}
            _active={{ bg: "bg.surface" }}
            _focusVisible={{
              borderColor: "border.focus",
              boxShadow: "input-focus",
              bg: "bg.surface",
            }}
            _expanded={{ borderColor: "border.focus", boxShadow: "input-focus" }}
          >
            <Box
              as="span"
              display="flex"
              alignItems="center"
              gap={2}
              overflow="hidden"
              textAlign="left"
              minW={0}
            >
              {selected ? (
                <>
                  <Box as="span" lineHeight={1} fontSize="md" flexShrink={0}>
                    {selected.flag}
                  </Box>
                  <Box as="span" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {selected.name}
                  </Box>
                </>
              ) : (
                <Box as="span" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                  {triggerPlaceholder}
                </Box>
              )}
            </Box>
            <FiChevronDown />
          </Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content
              w="100%"
              maxW="100%"
              borderColor="border.default"
              boxShadow="shadow.cardHover"
            >
              <Popover.Body p={2}>
                <Box mb={2}>
                  <SearchField
                    inputRef={searchInputRef}
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setActiveIndex(0);
                    }}
                    onClear={() => {
                      setSearch("");
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={t("address.placeholder.countrySearch")}
                    autoFocus
                  />
                </Box>
                <Box ref={listRef} h="240px" overflowY="auto" role="listbox">
                  {filteredOptions.length === 0 ? (
                    <Text fontSize="sm" color="text.muted" p={3} textAlign="center">
                      {t("address.noCountryResults")}
                    </Text>
                  ) : (
                    filteredOptions.map((option, index) => {
                      const isSelected = option.code === value;
                      const isActive = index === activeIndex;
                      return (
                        <Box
                          key={option.code}
                          role="option"
                          aria-selected={isSelected}
                          px={3}
                          py={2}
                          cursor="pointer"
                          borderRadius="md"
                          bg={
                            isActive
                              ? "bg.brand.subtle"
                              : isSelected
                                ? "bg.sunken"
                                : "transparent"
                          }
                          color="text.primary"
                          fontSize="sm"
                          onClick={() => handleSelect(option.code)}
                          onMouseEnter={() => setActiveIndex(index)}
                        >
                          <Box as="span" mr={2}>
                            {option.flag}
                          </Box>
                          {option.name}
                          <Box as="span" ml={2} color="text.muted" fontSize="xs">
                            {option.code}
                          </Box>
                        </Box>
                      );
                    })
                  )}
                </Box>
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

export const CountrySelectField = memo(CountrySelectFieldComponent);
