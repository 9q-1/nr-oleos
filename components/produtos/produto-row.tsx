"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteProdutoButton } from "./delete-produto-button";
import { CATEGORIA_PRODUTO_LABELS } from "@/lib/constants/produto";
import { formatCurrency } from "@/lib/utils";
import type { CategoriaProduto } from "@prisma/client";

interface ProdutoRowProps {
  id: string;
  marca: string;
  linha: string | null;
  codigo: string;
  categoria: CategoriaProduto;
  quantidade: number;
  estoqueMinimo: number;
  precoVenda: number;
  index?: number;
}

export function ProdutoRow({
  id,
  marca,
  linha,
  codigo,
  categoria,
  quantidade,
  estoqueMinimo,
  precoVenda,
  index = 0,
}: ProdutoRowProps) {
  const estoqueBaixo = quantidade <= estoqueMinimo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.2) }}
      className="glass-card flex flex-wrap items-center gap-4 p-4"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">
          {marca} {linha ?? ""}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {codigo} · {CATEGORIA_PRODUTO_LABELS[categoria] ?? categoria}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs text-muted-foreground">Venda</p>
        <p className="font-medium tabular-nums text-foreground">{formatCurrency(precoVenda)}</p>
      </div>

      <Badge variant={estoqueBaixo ? (quantidade === 0 ? "destructive" : "warning") : "success"}>
        {quantidade} em estoque
      </Badge>

      <div className="flex gap-1.5">
        <Button asChild variant="outline" size="icon" aria-label="Editar produto">
          <Link href={`/produtos/${id}/editar`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <DeleteProdutoButton id={id} nome={`${marca} ${linha ?? ""}`.trim()} />
      </div>
    </motion.div>
  );
}
