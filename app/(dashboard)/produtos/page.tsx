import Link from "next/link";
import { Suspense } from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";
import { ExportarExcelButton } from "@/components/shared/exportar-excel-button";
import { CategoriaFilter } from "@/components/produtos/produtos-filters";
import { ProdutoRow } from "@/components/produtos/produto-row";
import { ListCardSkeleton } from "@/components/dashboard/dashboard-skeletons";
import { getProdutos } from "@/lib/data/produtos";

export const metadata = { title: "Produtos" };
export const dynamic = "force-dynamic";

async function ProdutosList({ query, categoria }: { query?: string; categoria?: string }) {
  const produtos = await getProdutos({ query, categoria });

  if (produtos.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center gap-3 p-12 text-center">
        <Package className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Nenhum produto encontrado{query ? ` para "${query}"` : ""}.
        </p>
        <Button asChild size="sm">
          <Link href="/produtos/novo">Cadastrar o primeiro produto</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {produtos.map((p, i) => (
        <ProdutoRow
          key={p.id}
          id={p.id}
          marca={p.marca}
          linha={p.linha}
          codigo={p.codigo}
          categoria={p.categoria}
          quantidade={p.quantidade}
          estoqueMinimo={p.estoqueMinimo}
          precoVenda={Number(p.precoVenda)}
          index={i}
        />
      ))}
    </div>
  );
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const { q, categoria } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Produtos</h1>
          <p className="text-sm text-muted-foreground">Catálogo completo — nunca digitado manualmente no balcão.</p>
        </div>
        <Button asChild>
          <Link href="/produtos/novo">
            <Plus className="h-4 w-4" /> Novo Produto
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchBar placeholder="Buscar por marca, linha ou código..." />
        <CategoriaFilter />
        <ExportarExcelButton tipo="produtos" />
      </div>

      <Suspense key={`${q ?? ""}-${categoria ?? ""}`} fallback={<ListCardSkeleton rows={5} />}>
        <ProdutosList query={q} categoria={categoria} />
      </Suspense>
    </div>
  );
}
