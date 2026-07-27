import { Boxes, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EntradaEstoqueDialog } from "@/components/estoque/entrada-estoque-dialog";
import { ExportarExcelButton } from "@/components/shared/exportar-excel-button";
import { getEstoqueOverview } from "@/lib/data/estoque";
import { CATEGORIA_PRODUTO_LABELS } from "@/lib/constants/produto";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Estoque" };
export const dynamic = "force-dynamic";

export default async function EstoquePage() {
  const { produtos, movimentos } = await getEstoqueOverview();
  const baixos = produtos.filter((p) => p.quantidade <= p.estoqueMinimo);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <Boxes className="h-6 w-6 text-brand-yellow" /> Estoque
          </h1>
          <p className="text-sm text-muted-foreground">
            {baixos.length > 0
              ? `${baixos.length} produto(s) com estoque baixo ou zerado.`
              : "Todos os produtos estão com estoque saudável."}
          </p>
        </div>
        <ExportarExcelButton tipo="estoque" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-foreground">Produtos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {produtos.map((p) => {
              const estoqueBaixo = p.quantidade <= p.estoqueMinimo;
              return (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {p.marca} {p.linha ?? ""}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.codigo} · {CATEGORIA_PRODUTO_LABELS[p.categoria]}
                    </p>
                  </div>
                  <Badge variant={estoqueBaixo ? (p.quantidade === 0 ? "destructive" : "warning") : "success"}>
                    {p.quantidade} / mín. {p.estoqueMinimo}
                  </Badge>
                  <EntradaEstoqueDialog produtoId={p.id} nome={`${p.marca} ${p.linha ?? ""}`.trim()} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Movimentações recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {movimentos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma movimentação registrada ainda.</p>
            ) : (
              movimentos.map((m) => (
                <div key={m.id} className="flex items-start gap-2.5 text-sm">
                  {m.tipo === "ENTRADA" ? (
                    <ArrowUpCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <ArrowDownCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-foreground">
                      {m.produto.marca} {m.produto.linha ?? ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {m.tipo === "ENTRADA" ? "+" : "-"}
                      {Number(m.quantidade)} · {formatDate(m.criadoEm)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
