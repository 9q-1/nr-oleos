import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServicoForm } from "@/components/servicos/servico-form";
import { prisma } from "@/lib/prisma";
import { getServicoById } from "@/lib/data/servicos";
import { criarServicoAction } from "../actions";

export const metadata = { title: "Novo Serviço" };

export default async function NovoServicoPage({
  searchParams,
}: {
  searchParams: Promise<{ veiculoId?: string; duplicarDe?: string }>;
}) {
  const { veiculoId, duplicarDe } = await searchParams;

  const veiculo = veiculoId
    ? await prisma.veiculo.findUnique({
        where: { id: veiculoId },
        include: { cliente: { select: { id: true, nome: true, telefone: true } } },
      })
    : null;

  const servicoOrigem = duplicarDe ? await getServicoById(duplicarDe) : null;

  const valoresIniciais = servicoOrigem
    ? {
        valorMaoDeObra: Number(servicoOrigem.valorMaoDeObra) -
          servicoOrigem.outrosServicos.reduce((s, o) => s + Number(o.preco), 0) -
          (servicoOrigem.servicoRadiador ? Number(servicoOrigem.servicoRadiador.preco) : 0),
        formaPagamento: servicoOrigem.formaPagamento,
        observacoes: servicoOrigem.observacoes ?? "",
        itens: servicoOrigem.itensProduto.map((i) => ({
          produto: {
            id: i.produto.id,
            marca: i.produto.marca,
            linha: i.produto.linha,
            codigo: i.produto.codigo,
            categoria: i.produto.categoria,
            quantidade: i.produto.quantidade,
            precoVenda: Number(i.produto.precoVenda),
          },
          quantidade: Number(i.quantidade),
          precoUnitario: Number(i.precoUnitario),
        })),
        radiadorAtivo: Boolean(servicoOrigem.servicoRadiador),
        radiadorTipo: servicoOrigem.servicoRadiador?.tipo,
        radiadorPreco: servicoOrigem.servicoRadiador ? Number(servicoOrigem.servicoRadiador.preco) : 0,
        outrosServicos: servicoOrigem.outrosServicos.map((o) => ({
          tipo: o.tipo,
          descricao: o.descricao ?? "",
          preco: Number(o.preco),
        })),
      }
    : undefined;

  const voltarPara = veiculoId ? `/veiculos/${veiculoId}` : "/servicos";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href={voltarPara} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {servicoOrigem ? "Duplicar Serviço" : "Nova Ordem de Serviço"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {veiculo
            ? `${veiculo.marca} ${veiculo.modelo} · ${veiculo.placa} — ${veiculo.cliente.nome}`
            : "Selecione o cliente, o veículo e registre o atendimento."}
        </p>
      </div>
      <ServicoForm
        veiculoInicial={veiculo ? { id: veiculo.id, marca: veiculo.marca, modelo: veiculo.modelo, placa: veiculo.placa, cliente: veiculo.cliente } : null}
        bloquearVeiculo={Boolean(veiculo)}
        valoresIniciais={valoresIniciais}
        action={criarServicoAction}
      />
    </div>
  );
}
