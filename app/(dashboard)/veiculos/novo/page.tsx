import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VeiculoForm } from "@/components/veiculos/veiculo-form";
import { prisma } from "@/lib/prisma";
import { criarVeiculoAction } from "../actions";

export const metadata = { title: "Novo Veículo" };

export default async function NovoVeiculoPage({
  searchParams,
}: {
  searchParams: Promise<{ clienteId?: string }>;
}) {
  const { clienteId } = await searchParams;

  const clienteInicial = clienteId
    ? await prisma.cliente.findUnique({
        where: { id: clienteId },
        select: { id: true, nome: true, telefone: true },
      })
    : null;

  const voltarPara = clienteId ? `/clientes/${clienteId}` : "/veiculos";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={voltarPara} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Novo Veículo</h1>
        <p className="text-sm text-muted-foreground">
          {clienteInicial ? `Cadastrando um veículo para ${clienteInicial.nome}.` : "Preencha os dados do veículo."}
        </p>
      </div>
      <VeiculoForm
        clienteInicial={clienteInicial}
        bloquearCliente={Boolean(clienteInicial)}
        action={criarVeiculoAction}
      />
    </div>
  );
}
