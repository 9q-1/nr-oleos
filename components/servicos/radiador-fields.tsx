"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TIPO_SERVICO_RADIADOR_OPTIONS } from "@/lib/constants/produto";

interface RadiadorFieldsProps {
  ativo: boolean;
  onToggle: (ativo: boolean) => void;
  tipo: string;
  onTipoChange: (tipo: string) => void;
  preco: number;
  onPrecoChange: (preco: number) => void;
}

export function RadiadorFields({
  ativo,
  onToggle,
  tipo,
  onTipoChange,
  preco,
  onPrecoChange,
}: RadiadorFieldsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          checked={ativo}
          onChange={(e) => onToggle(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-white/5 accent-brand-yellow"
        />
        Serviço de radiador (limpeza / troca de fluido)
        <input type="hidden" name="radiadorAtivo" value={ativo ? "true" : "false"} />
      </label>

      {ativo && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Tipo do serviço</label>
            <Select name="radiadorTipo" value={tipo} onValueChange={onTipoChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPO_SERVICO_RADIADOR_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Valor (R$)</label>
            <Input
              type="number"
              name="radiadorPreco"
              min={0}
              step={0.01}
              value={preco}
              onChange={(e) => onPrecoChange(Number(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
