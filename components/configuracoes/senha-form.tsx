"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { alterarSenhaAction, type ConfigActionState } from "@/app/(dashboard)/configuracoes/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
      Alterar senha
    </Button>
  );
}

export function SenhaForm() {
  const [state, formAction] = useActionState<ConfigActionState, FormData>(alterarSenhaAction, {});
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.success) toast.success("Senha alterada com sucesso.");
  }, [state.success]);

  return (
    <form action={formAction} className="glass-card space-y-4 p-6 lg:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Alterar senha</h2>

      <div className="space-y-2">
        <Label htmlFor="senhaAtual">Senha atual</Label>
        <Input id="senhaAtual" name="senhaAtual" type="password" />
        {errors.senhaAtual && <p className="text-xs text-red-400">{errors.senhaAtual}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="novaSenha">Nova senha</Label>
          <Input id="novaSenha" name="novaSenha" type="password" />
          {errors.novaSenha && <p className="text-xs text-red-400">{errors.novaSenha}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
          <Input id="confirmarSenha" name="confirmarSenha" type="password" />
          {errors.confirmarSenha && <p className="text-xs text-red-400">{errors.confirmarSenha}</p>}
        </div>
      </div>

      {state.error && !Object.keys(errors).length && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
