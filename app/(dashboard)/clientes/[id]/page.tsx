import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Phone, Mail, MapPin, CarFront, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VeiculoCard } from "@/components/veiculos/veiculo-card";
import { DeleteClienteButton } from "@/components/clientes/delete-cliente-button";
import { getClienteById } from "@/lib/data/clientes";
import { formatDate } from "@/lib/utils";

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await getClienteById(id);

  if (!cliente) notFound();

  return (
    <div className="space-y-6">
      <Link href="/clientes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para clientes
      </Link>

      <div className="glass-card flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {cliente.fotoUrl && <AvatarImage src={cliente.fotoUrl} alt={cliente.nome} />}
            <AvatarFallback className="text-lg">{iniciais(cliente.nome)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-white">{cliente.nome}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {cliente.telefone}</span>
              {cliente.email && (
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {cliente.email}</span>
              )}
              {cliente.cidade && (
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {cliente.cidade}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Cliente desde {formatDate(cliente.criadoEm)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/clientes/${cliente.id}/editar`}>
              <Pencil className="h-4 w-4" /> Editar
            </Link>
          </Button>
          <DeleteClienteButton id={cliente.id} nome={cliente.nome} />
        </div>
      </div>

      {cliente.observacoes && (
        <div className="glass-card p-5 text-sm text-muted-foreground">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground">Observações</p>
          {cliente.observacoes}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <CarFront className="h-5 w-5 text-brand-yellow" />
          Veículos
          <Badge variant="muted">{cliente.veiculos.length}</Badge>
        </h2>
        <Button asChild size="sm">
          <Link href={`/veiculos/novo?clienteId=${cliente.id}`}>
            <Plus className="h-4 w-4" /> Novo Veículo
          </Link>
        </Button>
      </div>

      {cliente.veiculos.length === 0 ? (
        <div className="glass-card p-8 text-center text-sm text-muted-foreground">
          Nenhum veículo cadastrado para este cliente ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {cliente.veiculos.map((v, i) => (
            <VeiculoCard
              key={v.id}
              id={v.id}
              marca={v.marca}
              modelo={v.modelo}
              placa={v.placa}
              tipo={v.tipo}
              cor={v.cor}
              fotoUrl={v.fotoUrl}
              trocaVencida={Boolean(
                v.proximaTroca?.data && v.proximaTroca.data < new Date()
              )}
              proximaTrocaData={v.proximaTroca?.data}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
