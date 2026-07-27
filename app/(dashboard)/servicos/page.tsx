import Link from "next/link";
import { Suspense } from "react";
import { Wrench, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";
import { ExportarExcelButton } from "@/components/shared/exportar-excel-button";
import { ServicoActionsMenu } from "@/components/servicos/servico-actions-menu";
import { ListCardSkeleton } from "@/components/dashboard/dashboard-skeletons";
import { getServicos } from "@/lib/data/servicos";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Serviços" };
export const dynamic = "force-dynamic";

async function ServicosList({ query }: { query?: string }) {
  const servicos = await getServicos({ query });

  if (servicos.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center gap-3 p-12 text-center">
        <Wrench className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Nenhum serviço encontrado{query ? ` para "${query}"` : ""}.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      {servicos.map((s) => (
        <div key={s.id} className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-white/[0.03]">
          <Link href={`/servicos/${s.id}`} className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{s.cliente.nome}</p>
            <p className="truncate text-xs text-muted-foreground">
              {s.veiculo.marca} {s.veiculo.modelo} · {s.veiculo.placa}
              {s.trocaOleo ? ` · ${s.trocaOleo.marca} ${s.trocaOleo.viscosidade}` : ""}
            </p>
          </Link>
          <div className="text-right">
            <p className="font-medium tabular-nums text-foreground">{formatCurrency(Number(s.valorTotal))}</p>
            <p className="text-xs text-muted-foreground">{formatDate(s.data)}</p>
          </div>
          <ServicoActionsMenu
            servicoId={s.id}
            veiculoId={s.veiculoId}
            clienteNome={s.cliente.nome}
            clienteTelefone={s.cliente.whatsapp ?? s.cliente.telefone}
            veiculoDescricao={`${s.veiculo.marca} ${s.veiculo.modelo} · ${s.veiculo.placa}`}
            data={s.data}
          />
        </div>
      ))}
    </div>
  );
}

export default async function ServicosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Serviços</h1>
          <p className="text-sm text-muted-foreground">Histórico completo de atendimentos.</p>
        </div>
        <Button asChild>
          <Link href="/servicos/novo">
            <Plus className="h-4 w-4" /> Novo Serviço
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar placeholder="Buscar por cliente, telefone ou placa..." />
        <ExportarExcelButton tipo="servicos" />
      </div>

      <Suspense key={q ?? ""} fallback={<ListCardSkeleton rows={6} />}>
        <ServicosList query={q} />
      </Suspense>
    </div>
  );
}
