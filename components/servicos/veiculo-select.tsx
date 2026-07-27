"use client";

import { CarFront } from "lucide-react";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { buscarVeiculosParaSelectAction } from "@/app/(dashboard)/servicos/actions";

export interface VeiculoOption {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
  cliente: { id: string; nome: string; telefone: string };
}

interface VeiculoSelectProps {
  name?: string;
  defaultValue?: VeiculoOption | null;
  locked?: boolean;
  error?: string;
}

export function VeiculoSelect({
  name = "veiculoId",
  defaultValue = null,
  locked = false,
  error,
}: VeiculoSelectProps) {
  return (
    <SearchableSelect<VeiculoOption>
      name={name}
      defaultValue={defaultValue}
      locked={locked}
      error={error}
      placeholder="Selecione o cliente e o veículo"
      searchPlaceholder="Nome, telefone, placa ou modelo..."
      emptyLabel="Nenhum veículo encontrado."
      fetchOptions={buscarVeiculosParaSelectAction}
      getId={(v) => v.id}
      renderOption={(v) => (
        <>
          <span className="font-medium text-foreground">
            {v.marca} {v.modelo} · {v.placa}
          </span>{" "}
          <span className="text-muted-foreground">— {v.cliente.nome}</span>
        </>
      )}
      renderSelected={(v) => `${v.marca} ${v.modelo} · ${v.placa} — ${v.cliente.nome}`}
      renderLocked={(v) => (
        <>
          <CarFront className="h-4 w-4 text-brand-yellow" />
          <span className="font-medium text-foreground">
            {v.marca} {v.modelo} · {v.placa}
          </span>
          <span className="text-muted-foreground">— {v.cliente.nome}</span>
        </>
      )}
    />
  );
}
