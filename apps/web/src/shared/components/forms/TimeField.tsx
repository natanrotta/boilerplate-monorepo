import { Suspense, lazy } from "react";
import { Field, Input } from "@chakra-ui/react";
import type { TimeFieldProps } from "./TimeFieldPicker";

export type { TimeFieldProps } from "./TimeFieldPicker";

// Same on-demand split as DateField — see the comment there.
const TimeFieldPicker = lazy(() => import("./TimeFieldPicker"));

function TimeFieldFallback({ label, error, placeholder }: TimeFieldProps) {
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

export function TimeField(props: TimeFieldProps) {
  return (
    <Suspense fallback={<TimeFieldFallback {...props} />}>
      <TimeFieldPicker {...props} />
    </Suspense>
  );
}
