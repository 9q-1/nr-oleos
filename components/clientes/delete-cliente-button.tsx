"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { excluirClienteAction } from "@/app/(dashboard)/clientes/actions";

export function DeleteClienteButton({ id, nome }: { id: string; nome: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline" size="icon" className="text-red-400 hover:bg-red-500/10" aria-label="Excluir">
          <Trash2 className="h-4 w-4" />
        </Button>
      }
      title="Excluir cliente"
      description={`Tem certeza que deseja excluir "${nome}"? Todos os veículos e o histórico de serviços vinculados a este cliente também serão removidos. Esta ação não pode ser desfeita.`}
      onConfirm={() => excluirClienteAction(id)}
    />
  );
}
