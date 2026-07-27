"use client";

import { useActionState, useRef, useState, useTransition, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Download, Upload, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  gerarBackupAction,
  restaurarBackupAction,
  type RestaurarBackupState,
} from "@/app/(dashboard)/configuracoes/actions";

export function ExportarBackupButton() {
  const [isPending, startTransition] = useTransition();

  function exportar() {
    startTransition(async () => {
      try {
        const dados = await gerarBackupAction();
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-nr-lubrificantes-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Backup gerado com sucesso.");
      } catch {
        toast.error("Não foi possível gerar o backup.");
      }
    });
  }

  return (
    <Button onClick={exportar} disabled={isPending}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Baixar backup (.json)
    </Button>
  );
}

function SubmitRestaurar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Confirmar restauração
    </Button>
  );
}

export function RestaurarBackupDialog() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState<RestaurarBackupState, FormData>(restaurarBackupAction, {});

  useEffect(() => {
    if (state.success) {
      toast.success("Backup restaurado com sucesso. Atualize a página para ver os dados.");
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4" /> Restaurar backup
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">Restaurar backup</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Esta ação <strong>substitui</strong> clientes, veículos, próximas trocas, fornecedores e
              produtos atuais pelos dados do arquivo. Serviços já realizados e usuários não são afetados.
              Não pode ser desfeita.
            </p>
          </div>
        </div>

        <form action={formAction} className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="arquivo">Arquivo de backup (.json)</Label>
            <Input id="arquivo" name="arquivo" type="file" accept="application/json" ref={fileRef} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmacao">
              Digite <strong>RESTAURAR</strong> para confirmar
            </Label>
            <Input
              id="confirmacao"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="RESTAURAR"
            />
          </div>
          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            {confirmText === "RESTAURAR" ? (
              <SubmitRestaurar />
            ) : (
              <Button type="button" variant="destructive" disabled>
                Confirmar restauração
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
