"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { excluirVeiculoAction } from "@/app/(dashboard)/veiculos/actions";

export function DeleteVeiculoButton({
  id,
  clienteId,
  descricao,
}: {
  id: string;
  clienteId: string;
  descricao: string;
}) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline" size="icon" className="text-red-400 hover:bg-red-500/10" aria-label="Excluir">
          <Trash2 className="h-4 w-4" />
        </Button>
      }
      title="Excluir veículo"
      description={`Tem certeza que deseja excluir "${descricao}"? Todo o histórico de serviços deste veículo também será removido. Esta ação não pode ser desfeita.`}
      onConfirm={() => excluirVeiculoAction(id, clienteId)}
    />
  );
}
