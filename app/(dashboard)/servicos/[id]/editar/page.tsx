import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ServicoEditarForm } from "@/components/servicos/servico-editar-form";
import { getServicoById } from "@/lib/data/servicos";
import { atualizarServicoAction } from "../../actions";

export const metadata = { title: "Editar Serviço" };

export default async function EditarServicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const servico = await getServicoById(id);
  if (!servico) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/servicos/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar Serviço</h1>
        <p className="text-sm text-muted-foreground">
          {servico.veiculo.marca} {servico.veiculo.modelo} · {servico.veiculo.placa} — {servico.cliente.nome}
        </p>
      </div>
      <ServicoEditarForm servico={servico} action={atualizarServicoAction.bind(null, id)} />
    </div>
  );
}
