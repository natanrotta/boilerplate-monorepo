import { Flex } from "@chakra-ui/react";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";

const STATUSES = ["success", "info", "warning", "error", "neutral"] as const;

export function BadgeSection() {
  return (
    <Flex gap={2} wrap="wrap">
      {STATUSES.map((status) => (
        <StatusBadge key={status} status={status} label={status} />
      ))}
    </Flex>
  );
}
