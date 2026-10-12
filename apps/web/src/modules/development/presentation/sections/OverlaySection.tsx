import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { AppModal } from "@/shared/components/ui/AppModal";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { useNotify } from "@/shared/hooks/useNotify";

export function OverlaySection() {
  const modal = useDisclosure();
  const confirm = useDisclosure();
  const { showSuccess, showInfo, showWarning, showError } = useNotify();

  return (
    <>
      <Flex gap={3} wrap="wrap">
        <Button size="sm" variant="outline" onClick={modal.onOpen}>
          Abrir modal
        </Button>
        <Button size="sm" variant="outline" onClick={confirm.onOpen}>
          Abrir confirmação
        </Button>
        <Button size="sm" variant="ghost" onClick={() => showSuccess("Salvo com sucesso")}>
          Toast success
        </Button>
        <Button size="sm" variant="ghost" onClick={() => showInfo("Informação")}>
          Toast info
        </Button>
        <Button size="sm" variant="ghost" onClick={() => showWarning("Atenção")}>
          Toast warning
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => showError(new Error("Algo deu errado"), "Algo deu errado")}
        >
          Toast error
        </Button>
      </Flex>
      <AppModal
        isOpen={modal.open}
        onClose={modal.onClose}
        title="Novo registro"
        primaryActionLabel="Criar"
        onPrimaryAction={modal.onClose}
      >
        <Text>Conteúdo do modal.</Text>
      </AppModal>
      <ConfirmDialog
        isOpen={confirm.open}
        onClose={confirm.onClose}
        onConfirm={confirm.onClose}
        title="Excluir registro?"
        description="Esta ação não pode ser desfeita."
      />
    </>
  );
}
