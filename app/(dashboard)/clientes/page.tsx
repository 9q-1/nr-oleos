import Link from "next/link";
import { Suspense } from "react";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";
import { ExportarExcelButton } from "@/components/shared/exportar-excel-button";
import { ClienteCard } from "@/components/clientes/cliente-card";
import { ListCardSkeleton } from "@/components/dashboard/dashboard-skeletons";
import { getClientes } from "@/lib/data/clientes";

export const metadata = { title: "Clientes" };
export const dynamic = "force-dynamic";

async function ClientesList({ query }: { query?: string }) {
  const clientes = await getClientes(query);

  if (clientes.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center gap-3 p-12 text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {query ? `Nenhum cliente encontrado para "${query}".` : "Nenhum cliente cadastrado ainda."}
        </p>
        <Button asChild size="sm">
          <Link href="/clientes/novo">Cadastrar o primeiro cliente</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {clientes.map((c, i) => (
        <ClienteCard
          key={c.id}
          id={c.id}
          nome={c.nome}
          telefone={c.telefone}
          cidade={c.cidade}
          fotoUrl={c.fotoUrl}
          totalVeiculos={c.veiculos.length}
          index={i}
        />
      ))}
    </div>
  );
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Clientes</h1>
          <p className="text-sm text-muted-foreground">Gerencie os clientes cadastrados na loja.</p>
        </div>
        <Button asChild>
          <Link href="/clientes/novo">
            <UserPlus className="h-4 w-4" /> Novo Cliente
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar placeholder="Buscar por nome, telefone, placa ou modelo..." />
        <ExportarExcelButton tipo="clientes" />
      </div>

      <Suspense key={q ?? ""} fallback={<ListCardSkeleton rows={4} />}>
        <ClientesList query={q} />
      </Suspense>
    </div>
  );
}
