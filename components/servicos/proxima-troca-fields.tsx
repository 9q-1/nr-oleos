"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ProximaTrocaFieldsProps {
  tipo: "QUILOMETRAGEM" | "DATA";
  onTipoChange: (tipo: "QUILOMETRAGEM" | "DATA") => void;
  intervaloKm: number;
  onIntervaloKmChange: (v: number) => void;
  intervaloMeses: number;
  onIntervaloMesesChange: (v: number) => void;
}

export function ProximaTrocaFields({
  tipo,
  onTipoChange,
  intervaloKm,
  onIntervaloKmChange,
  intervaloMeses,
  onIntervaloMesesChange,
}: ProximaTrocaFieldsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <p className="text-sm font-medium text-foreground">Próxima troca</p>
      <div className="flex gap-2">
        {(["QUILOMETRAGEM", "DATA"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onTipoChange(opt)}
            className={cn(
              "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
              tipo === opt
                ? "border-brand-yellow/50 bg-brand-yellow/10 text-brand-yellow"
                : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/5"
            )}
          >
            {opt === "QUILOMETRAGEM" ? "Por quilometragem" : "Por data"}
          </button>
        ))}
      </div>
      <input type="hidden" name="proximaTrocaTipo" value={tipo} />

      {tipo === "QUILOMETRAGEM" ? (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Intervalo até a próxima troca (km)</Label>
          <Input
            type="number"
            name="proximaTrocaIntervaloKm"
            min={500}
            step={500}
            value={intervaloKm}
            onChange={(e) => onIntervaloKmChange(Number(e.target.value))}
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Intervalo até a próxima troca (meses)</Label>
          <Input
            type="number"
            name="proximaTrocaIntervaloMeses"
            min={1}
            max={24}
            value={intervaloMeses}
            onChange={(e) => onIntervaloMesesChange(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
