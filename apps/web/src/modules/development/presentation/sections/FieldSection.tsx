import { useState } from "react";
import { SimpleGrid, Stack } from "@chakra-ui/react";
import { FormField } from "@/shared/components/forms/FormField";
import { NumberField } from "@/shared/components/forms/NumberField";
import { PasswordField } from "@/shared/components/forms/PasswordField";
import { PasswordStrengthIndicator } from "@/shared/components/forms/PasswordStrengthIndicator";
import { SelectField } from "@/shared/components/forms/SelectField";
import { TextAreaField } from "@/shared/components/forms/TextAreaField";

export function FieldSection() {
  const [name, setName] = useState("Projeto principal");
  const [password, setPassword] = useState("Abc123!x");
  const [kind, setKind] = useState("text");
  const [count, setCount] = useState(3);
  const [notes, setNotes] = useState("");

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      <FormField label="Padrão" value={name} onChange={setName} />
      <FormField
        label="Com ajuda"
        value=""
        onChange={() => {}}
        placeholder="https://"
        helperText="Texto de apoio abaixo do campo."
      />
      <FormField label="Com erro" value="abc" onChange={() => {}} error="Formato inválido." />
      <FormField label="Desabilitado" value="somente leitura" onChange={() => {}} disabled />
      <Stack gap={2}>
        <PasswordField label="Senha" value={password} onChange={setPassword} />
        <PasswordStrengthIndicator password={password} />
      </Stack>
      <SelectField
        label="Seleção"
        value={kind}
        onChange={setKind}
        options={[
          { value: "text", label: "Texto" },
          { value: "image", label: "Imagem" },
        ]}
      />
      <NumberField label="Número" value={count} onChange={setCount} />
      <TextAreaField
        label="Texto longo"
        value={notes}
        onChange={setNotes}
        placeholder="Escreva algo…"
        helperText="Até 4096 caracteres."
      />
    </SimpleGrid>
  );
}
