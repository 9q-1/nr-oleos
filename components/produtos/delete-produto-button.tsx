"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { excluirProdutoAction } from "@/app/(dashboard)/produtos/actions";

export function DeleteProdutoButton({ id, nome }: { id: string; nome: string }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline" size="icon" className="text-red-400 hover:bg-red-500/10" aria-label="Excluir">
          <Trash2 className="h-4 w-4" />
        </Button>
      }
      title="Excluir produto"
      description={`Tem certeza que deseja excluir "${nome}" do catálogo? Serviços que já usaram este produto manterão o histórico, mas ele não poderá mais ser selecionado em novos atendimentos.`}
      onConfirm={() => excluirProdutoAction(id)}
    />
  );
}
