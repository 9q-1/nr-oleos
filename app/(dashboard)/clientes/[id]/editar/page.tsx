import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { getClienteById } from "@/lib/data/clientes";
import { atualizarClienteAction } from "../../actions";

export const metadata = { title: "Editar Cliente" };

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await getClienteById(id);
  if (!cliente) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/clientes/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar Cliente</h1>
        <p className="text-sm text-muted-foreground">Atualize os dados de {cliente.nome}.</p>
      </div>
      <ClienteForm cliente={cliente} action={atualizarClienteAction.bind(null, id)} />
    </div>
  );
}
