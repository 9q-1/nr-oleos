import Link from "next/link";
import { Suspense } from "react";
import { CarFront, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";
import { TipoVeiculoFilter } from "@/components/veiculos/veiculos-filters";
import { VeiculoCard } from "@/components/veiculos/veiculo-card";
import { ListCardSkeleton } from "@/components/dashboard/dashboard-skeletons";
import { getVeiculos } from "@/lib/data/veiculos";

export const metadata = { title: "Veículos" };
export const dynamic = "force-dynamic";

async function VeiculosList({ query, tipo }: { query?: string; tipo?: string }) {
  const veiculos = await getVeiculos({ query, tipo });

  if (veiculos.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center gap-3 p-12 text-center">
        <CarFront className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Nenhum veículo encontrado{query ? ` para "${query}"` : ""}.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {veiculos.map((v, i) => (
        <VeiculoCard
          key={v.id}
          id={v.id}
          marca={v.marca}
          modelo={v.modelo}
          placa={v.placa}
          tipo={v.tipo}
          cor={v.cor}
          clienteNome={v.cliente.nome}
          fotoUrl={v.fotoUrl}
          trocaVencida={Boolean(v.proximaTroca?.data && v.proximaTroca.data < new Date())}
          proximaTrocaData={v.proximaTroca?.data}
          index={i}
        />
      ))}
    </div>
  );
}

export default async function VeiculosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string }>;
}) {
  const { q, tipo } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Veículos</h1>
          <p className="text-sm text-muted-foreground">Todos os veículos cadastrados na loja.</p>
        </div>
        <Button asChild>
          <Link href="/veiculos/novo">
            <Plus className="h-4 w-4" /> Novo Veículo
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar placeholder="Buscar por placa, modelo, marca ou cliente..." />
        <TipoVeiculoFilter />
      </div>

      <Suspense key={`${q ?? ""}-${tipo ?? ""}`} fallback={<ListCardSkeleton rows={4} />}>
        <VeiculosList query={q} tipo={tipo} />
      </Suspense>
    </div>
  );
}
