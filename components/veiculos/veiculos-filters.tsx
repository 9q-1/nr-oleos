"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TIPO_VEICULO_OPTIONS } from "@/lib/constants/veiculo";

export function TipoVeiculoFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tipoAtual = searchParams.get("tipo") ?? "TODOS";

  function onChange(tipo: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tipo === "TODOS") params.delete("tipo");
    else params.set("tipo", tipo);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select value={tipoAtual} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-52">
        <SelectValue placeholder="Tipo de veículo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="TODOS">Todos os tipos</SelectItem>
        {TIPO_VEICULO_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
