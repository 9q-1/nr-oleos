"use client";

import { Input } from "@/components/ui/input";
import { TIPO_OUTRO_SERVICO_OPTIONS } from "@/lib/constants/produto";
import { formatCurrency } from "@/lib/utils";

export interface OutroServicoLinha {
  tipo: string;
  descricao: string;
  preco: number;
}

interface OutrosServicosPickerProps {
  selecionados: OutroServicoLinha[];
  onChange: (itens: OutroServicoLinha[]) => void;
}

export function OutrosServicosPicker({ selecionados, onChange }: OutrosServicosPickerProps) {
  function toggle(tipo: string, label: string) {
    const existe = selecionados.some((s) => s.tipo === tipo);
    if (existe) {
      onChange(selecionados.filter((s) => s.tipo !== tipo));
    } else {
      onChange([...selecionados, { tipo, descricao: label, preco: 0 }]);
    }
  }

  function atualizarPreco(tipo: string, preco: number) {
    onChange(selecionados.map((s) => (s.tipo === tipo ? { ...s, preco } : s)));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TIPO_OUTRO_SERVICO_OPTIONS.map((opt) => {
          const ativo = selecionados.some((s) => s.tipo === opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value, opt.label)}
              className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                ativo
                  ? "border-brand-yellow/50 bg-brand-yellow/10 text-brand-yellow"
                  : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {selecionados.length > 0 && (
        <div className="space-y-2">
          {selecionados.map((s, i) => (
            <div
              key={s.tipo}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"
            >
              <p className="text-sm font-medium text-foreground">{s.descricao}</p>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">R$</label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={s.preco}
                  onChange={(e) => atualizarPreco(s.tipo, Number(e.target.value))}
                  className="h-9 w-24 text-sm"
                />
              </div>
              <input type="hidden" name={`outrosServicos[${i}].tipo`} value={s.tipo} />
              <input type="hidden" name={`outrosServicos[${i}].descricao`} value={s.descricao} />
              <input type="hidden" name={`outrosServicos[${i}].preco`} value={s.preco} />
            </div>
          ))}
          <p className="text-right text-xs text-muted-foreground">
            Subtotal: {formatCurrency(selecionados.reduce((sum, s) => sum + s.preco, 0))}
          </p>
        </div>
      )}
    </div>
  );
}
