"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Search, Loader2, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buscarProdutosParaSelectAction } from "@/app/(dashboard)/estoque/actions";
import { CATEGORIA_PRODUTO_LABELS } from "@/lib/constants/produto";
import { formatCurrency } from "@/lib/utils";
import type { CategoriaProduto } from "@prisma/client";

export interface ProdutoOption {
  id: string;
  marca: string;
  linha: string | null;
  codigo: string;
  categoria: CategoriaProduto;
  quantidade: number;
  precoVenda: number;
}

export interface ItemLinha {
  produto: ProdutoOption;
  quantidade: number;
  precoUnitario: number;
}

interface ProdutosPickerProps {
  itens: ItemLinha[];
  onChange: (itens: ItemLinha[]) => void;
}

export function ProdutosPicker({ itens, onChange }: ProdutosPickerProps) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<ProdutoOption[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    startTransition(async () => {
      const data = await buscarProdutosParaSelectAction(query);
      setOptions(
        data.map((p) => ({
          id: p.id,
          marca: p.marca,
          linha: p.linha,
          codigo: p.codigo,
          categoria: p.categoria,
          quantidade: p.quantidade,
          precoVenda: Number(p.precoVenda),
        }))
      );
    });
  }, [query, open]);

  function adicionar(produto: ProdutoOption) {
    if (itens.some((i) => i.produto.id === produto.id)) {
      setOpen(false);
      return;
    }
    onChange([...itens, { produto, quantidade: 1, precoUnitario: produto.precoVenda }]);
    setOpen(false);
    setQuery("");
  }

  function atualizarLinha(index: number, patch: Partial<ItemLinha>) {
    const atual = itens[index];
    if (!atual) return;
    const novaLista = [...itens];
    novaLista[index] = { ...atual, ...patch };
    onChange(novaLista);
  }

  function removerLinha(index: number) {
    onChange(itens.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-full items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/[0.03] px-3.5 text-sm text-muted-foreground transition-colors hover:border-brand-yellow/40 hover:text-foreground"
        >
          <Plus className="h-4 w-4" /> Adicionar produto do estoque
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-popover shadow-glass">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Marca, linha ou código..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
              {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <div className="max-h-64 overflow-y-auto p-1.5">
              {options.length === 0 && !isPending && (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                  Nenhum produto encontrado.
                </p>
              )}
              {options.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => adicionar(p)}
                  disabled={p.quantidade === 0}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5 disabled:opacity-40"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-medium text-foreground">
                      {p.marca} {p.linha ?? ""}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      · {p.codigo} · {CATEGORIA_PRODUTO_LABELS[p.categoria]}
                    </span>
                  </span>
                  <Badge variant={p.quantidade === 0 ? "destructive" : "muted"} className="shrink-0">
                    {p.quantidade} un.
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {itens.length > 0 && (
        <div className="space-y-2">
          {itens.map((item, index) => (
            <div
              key={item.produto.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.produto.marca} {item.produto.linha ?? ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.produto.codigo} · {item.produto.quantidade} em estoque
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-muted-foreground">Qtd.</label>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  max={item.produto.quantidade}
                  value={item.quantidade}
                  onChange={(e) => atualizarLinha(index, { quantidade: Number(e.target.value) })}
                  className="h-9 w-20 text-sm"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-muted-foreground">R$</label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.precoUnitario}
                  onChange={(e) => atualizarLinha(index, { precoUnitario: Number(e.target.value) })}
                  className="h-9 w-24 text-sm"
                />
              </div>
              <p className="w-24 shrink-0 text-right text-sm font-medium tabular-nums text-brand-yellow">
                {formatCurrency(item.quantidade * item.precoUnitario)}
              </p>
              <Button type="button" variant="ghost" size="icon" onClick={() => removerLinha(index)} aria-label="Remover produto">
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Campos ocultos serializados para o Server Action */}
      {itens.map((item, i) => (
        <div key={item.produto.id}>
          <input type="hidden" name={`itens[${i}].produtoId`} value={item.produto.id} />
          <input type="hidden" name={`itens[${i}].quantidade`} value={item.quantidade} />
          <input type="hidden" name={`itens[${i}].precoUnitario`} value={item.precoUnitario} />
        </div>
      ))}
    </div>
  );
}
