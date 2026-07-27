"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FORMA_PAGAMENTO_OPTIONS } from "@/lib/constants/produto";
import type { ServicoActionState } from "@/app/(dashboard)/servicos/actions";
import type { Servico } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Salvar alterações
    </Button>
  );
}

export function ServicoEditarForm({
  servico,
  action,
}: {
  servico: Servico;
  action: (state: ServicoActionState, formData: FormData) => Promise<ServicoActionState>;
}) {
  const [state, formAction] = useActionState<ServicoActionState, FormData>(action, {});

  return (
    <form action={formAction} className="glass-card space-y-5 p-6 lg:p-8">
      <div className="flex items-start gap-2 rounded-lg border border-brand-yellow/20 bg-brand-yellow/5 px-3.5 py-2.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-yellow" />
        Produtos utilizados não podem ser alterados aqui para preservar a integridade do estoque. Para
        trocar os itens, use &ldquo;Duplicar serviço&rdquo; e exclua este registro depois.
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data *</Label>
          <Input
            id="data"
            name="data"
            type="date"
            defaultValue={servico.data.toISOString().slice(0, 10)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hora">Hora *</Label>
          <Input id="hora" name="hora" type="time" defaultValue={servico.hora} />
        </div>
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label htmlFor="quilometragem">Km atual *</Label>
          <Input id="quilometragem" name="quilometragem" type="number" defaultValue={servico.quilometragem} />
        </div>
        <div className="space-y-2">
          <Label>Pagamento *</Label>
          <Select name="formaPagamento" defaultValue={servico.formaPagamento}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMA_PAGAMENTO_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="valorMaoDeObra">Mão de obra base (R$) *</Label>
          <Input
            id="valorMaoDeObra"
            name="valorMaoDeObra"
            type="number"
            step="0.01"
            defaultValue={Number(servico.valorMaoDeObra)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desconto">Desconto (R$)</Label>
          <Input
            id="desconto"
            name="desconto"
            type="number"
            step="0.01"
            defaultValue={Number(servico.desconto)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea id="observacoes" name="observacoes" defaultValue={servico.observacoes ?? ""} />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
