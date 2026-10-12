import { Button, Code, Flex, Stack } from "@chakra-ui/react";
import { buttonRecipe } from "@boilerplate/theme";
import { SaveButton } from "@/shared/components/ui/SaveButton";
import { Group } from "../styleguide/Section";

const buttonVariants = Object.keys(buttonRecipe.variants?.variant ?? {});
const BUTTON_SIZES = ["xs", "sm", "md"] as const;

export function ButtonSection() {
  return (
    <Stack gap={8}>
      <Stack gap={4}>
        {buttonVariants.map((variant) => (
          <Flex key={variant} gap={3} align="center" wrap="wrap">
            <Code minW="80px">{variant}</Code>
            {BUTTON_SIZES.map((size) => (
              // The recipe adds variants Chakra's generated types don't know.
              <Button key={size} size={size} variant={variant as "solid"}>
                {size}
              </Button>
            ))}
            <Button size="sm" variant={variant as "solid"} disabled>
              desabilitado
            </Button>
            <Button size="sm" variant={variant as "solid"} loading>
              carregando
            </Button>
          </Flex>
        ))}
      </Stack>
      <Group title="SaveButton — com e sem alterações pendentes">
        <Flex gap={4} align="center" wrap="wrap">
          <SaveButton isDirty isSaving={false} onClick={() => {}} />
          <SaveButton isDirty={false} isSaving={false} onClick={() => {}} />
          <SaveButton isDirty isSaving onClick={() => {}} />
        </Flex>
      </Group>
    </Stack>
  );
}
