import { Suspense } from "react";
import { BellRing } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import { LembretesBucket } from "@/components/lembretes/lembretes-bucket";
import { ListCardSkeleton } from "@/components/dashboard/dashboard-skeletons";
import { getLembretes } from "@/lib/data/lembretes";

export const metadata = { title: "Lembretes" };
export const dynamic = "force-dynamic";

async function LembretesContent({ query }: { query?: string }) {
  const buckets = await getLembretes(query);
  const total =
    buckets.vencidas.length +
    buckets.hoje.length +
    buckets.em7Dias.length +
    buckets.em15Dias.length +
    buckets.em30Dias.length;

  if (total === 0) {
    return (
      <div className="glass-card flex flex-col items-center gap-3 p-12 text-center">
        <BellRing className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {query ? `Nenhum lembrete encontrado para "${query}".` : "Nenhuma troca vencendo nos próximos 30 dias."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LembretesBucket titulo="Trocas vencidas" itens={buckets.vencidas} tom="vencidas" />
      <LembretesBucket titulo="Vencem hoje" itens={buckets.hoje} tom="hoje" />
      <LembretesBucket titulo="Vencem em até 7 dias" itens={buckets.em7Dias} tom="em7Dias" />
      <LembretesBucket titulo="Vencem em até 15 dias" itens={buckets.em15Dias} tom="em15Dias" />
      <LembretesBucket titulo="Vencem em até 30 dias" itens={buckets.em30Dias} tom="em30Dias" />
    </div>
  );
}

export default async function LembretesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
          <BellRing className="h-6 w-6 text-brand-yellow" /> Lembretes
        </h1>
        <p className="text-sm text-muted-foreground">
          Clientes para contatar sobre a próxima troca de óleo.
        </p>
      </div>

      <SearchBar placeholder="Buscar por nome, telefone ou placa..." />

      <Suspense key={q ?? ""} fallback={<ListCardSkeleton rows={4} />}>
        <LembretesContent query={q} />
      </Suspense>
    </div>
  );
}
