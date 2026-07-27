"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { excluirUsuarioAction } from "@/app/(dashboard)/configuracoes/actions";

export function DeleteUsuarioButton({ id, nome }: { id: string; nome: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline" size="icon" className="text-red-400 hover:bg-red-500/10" aria-label="Excluir usuário">
          <Trash2 className="h-4 w-4" />
        </Button>
      }
      title="Excluir usuário"
      description={`Tem certeza que deseja excluir o acesso de "${nome}"? Esta ação não pode ser desfeita.`}
      onConfirm={() => excluirUsuarioAction(id)}
    />
  );
}
