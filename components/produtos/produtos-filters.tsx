"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CATEGORIA_PRODUTO_OPTIONS } from "@/lib/constants/produto";

export function CategoriaFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoriaAtual = searchParams.get("categoria") ?? "TODAS";

  function onChange(categoria: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoria === "TODAS") params.delete("categoria");
    else params.set("categoria", categoria);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select value={categoriaAtual} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="TODAS">Todas as categorias</SelectItem>
        {CATEGORIA_PRODUTO_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
