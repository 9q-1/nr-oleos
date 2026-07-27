"use client";

import { User } from "lucide-react";
import { SearchableSelect } from "@/components/shared/searchable-select";
import { buscarClientesParaSelectAction } from "@/app/(dashboard)/veiculos/actions";

interface ClienteOption {
  id: string;
  nome: string;
  telefone: string;
}

interface ClienteSelectProps {
  name?: string;
  defaultValue?: ClienteOption | null;
  locked?: boolean;
  error?: string;
}

export function ClienteSelect({
  name = "clienteId",
  defaultValue = null,
  locked = false,
  error,
}: ClienteSelectProps) {
  return (
    <SearchableSelect<ClienteOption>
      name={name}
      defaultValue={defaultValue}
      locked={locked}
      error={error}
      placeholder="Selecione o cliente"
      searchPlaceholder="Buscar por nome ou telefone..."
      emptyLabel="Nenhum cliente encontrado."
      fetchOptions={buscarClientesParaSelectAction}
      getId={(c) => c.id}
      renderOption={(c) => (
        <>
          <span className="font-medium text-foreground">{c.nome}</span>{" "}
          <span className="text-muted-foreground">· {c.telefone}</span>
        </>
      )}
      renderSelected={(c) => `${c.nome} · ${c.telefone}`}
      renderLocked={(c) => (
        <>
          <User className="h-4 w-4 text-brand-yellow" />
          <span className="font-medium text-foreground">{c.nome}</span>
          <span className="text-muted-foreground">· {c.telefone}</span>
        </>
      )}
    />
  );
}
