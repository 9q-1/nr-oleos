"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registrarEntradaEstoqueAction, type EstoqueActionState } from "@/app/(dashboard)/estoque/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Registrar entrada
    </Button>
  );
}

export function EntradaEstoqueDialog({ produtoId, nome }: { produtoId: string; nome: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<EstoqueActionState, FormData>(
    registrarEntradaEstoqueAction,
    {}
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Entrada registrada com sucesso.");
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PackagePlus className="h-4 w-4" /> Entrada
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6">
        <h2 className="text-base font-semibold text-foreground">Registrar entrada de estoque</h2>
        <p className="mt-1 text-sm text-muted-foreground">{nome}</p>
        <form action={formAction} className="mt-4 space-y-4">
          <input type="hidden" name="produtoId" value={produtoId} />
          <div className="space-y-2">
            <Label htmlFor={`qtd-${produtoId}`}>Quantidade recebida</Label>
            <Input id={`qtd-${produtoId}`} name="quantidade" type="number" min={1} defaultValue={1} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`obs-${produtoId}`}>Observação (opcional)</Label>
            <Input id={`obs-${produtoId}`} name="observacao" placeholder="Nota fiscal, fornecedor..." />
          </div>
          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
