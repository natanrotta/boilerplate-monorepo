import { Suspense, lazy } from "react";
import { Field, Input } from "@chakra-ui/react";
import type { DateFieldProps } from "./DateFieldPicker";

export type { DateFieldProps } from "./DateFieldPicker";

// react-datepicker (+ its CSS) stays out of every eager route chunk — the
// picker loads on demand while this fallback renders an identical-looking
// disabled input, so the swap is invisible (no layout shift).
const DateFieldPicker = lazy(() => import("./DateFieldPicker"));

function DateFieldFallback({ label, error, placeholder }: DateFieldProps) {
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
      <Input placeholder={placeholder} disabled cursor="pointer" />
      {error ? (
        <Field.ErrorText fontSize="xs" fontWeight="500" color="status.error.fg">
          {error}
        </Field.ErrorText>
      ) : null}
    </Field.Root>
  );
}

export function DateField(props: DateFieldProps) {
  return (
    <Suspense fallback={<DateFieldFallback {...props} />}>
      <DateFieldPicker {...props} />
    </Suspense>
  );
}
