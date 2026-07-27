import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VeiculoForm } from "@/components/veiculos/veiculo-form";
import { getVeiculoById } from "@/lib/data/veiculos";
import { atualizarVeiculoAction } from "../../actions";

export const metadata = { title: "Editar Veículo" };

export default async function EditarVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const veiculo = await getVeiculoById(id);
  if (!veiculo) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/veiculos/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar Veículo</h1>
        <p className="text-sm text-muted-foreground">
          Atualize os dados de {veiculo.marca} {veiculo.modelo} — {veiculo.placa}.
        </p>
      </div>
      <VeiculoForm
        veiculo={veiculo}
        clienteInicial={{ id: veiculo.cliente.id, nome: veiculo.cliente.nome, telefone: veiculo.cliente.telefone }}
        bloquearCliente={false}
        action={atualizarVeiculoAction.bind(null, id)}
      />
    </div>
  );
}
