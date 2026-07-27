"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { ConfigActionState } from "@/app/(dashboard)/configuracoes/actions";
import type { Usuario } from "@prisma/client";

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {isEdit ? "Salvar alterações" : "Criar usuário"}
    </Button>
  );
}

export function UsuarioForm({
  usuario,
  action,
}: {
  usuario?: Usuario | null;
  action: (state: ConfigActionState, formData: FormData) => Promise<ConfigActionState>;
}) {
  const [state, formAction] = useActionState<ConfigActionState, FormData>(action, {});
  const [ativo, setAtivo] = useState(usuario?.ativo ?? true);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="glass-card space-y-5 p-6 lg:p-8">
      <input type="hidden" name="ativo" value={ativo ? "true" : "false"} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo *</Label>
          <Input id="nome" name="nome" defaultValue={usuario?.nome} />
          {errors.nome && <p className="text-xs text-red-400">{errors.nome}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input id="email" name="email" type="email" defaultValue={usuario?.email} />
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label>Nível de acesso *</Label>
          <Select name="papel" defaultValue={usuario?.papel ?? "FUNCIONARIO"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
              <SelectItem value="FUNCIONARIO">Funcionário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="senha">{usuario ? "Nova senha (opcional)" : "Senha *"}</Label>
          <Input id="senha" name="senha" type="password" placeholder="••••••••" />
          {errors.senha && <p className="text-xs text-red-400">{errors.senha}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground md:col-span-2">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-brand-yellow"
          />
          Usuário ativo (pode fazer login)
        </label>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <SubmitButton isEdit={Boolean(usuario)} />
      </div>
    </form>
  );
}
