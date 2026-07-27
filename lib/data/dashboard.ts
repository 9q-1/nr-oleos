import "server-only";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, addDays, subDays, format } from "date-fns";

function toNumber(v: unknown): number {
  if (v === null || v === undefined) return 0;
  return typeof v === "object" && "toNumber" in (v as any) ? (v as any).toNumber() : Number(v);
}

/** Contadores principais do topo do dashboard. */
export async function getDashboardCounters() {
  const now = new Date();
  const hojeInicio = startOfDay(now);
  const hojeFim = endOfDay(now);
  const mesInicio = startOfMonth(now);
  const mesFim = endOfMonth(now);

  const [
    totalClientes,
    totalVeiculos,
    servicosHoje,
    servicosMes,
    faturamentoMesAgg,
    produtosEstoqueBaixoCount,
  ] = await Promise.all([
    prisma.cliente.count(),
    prisma.veiculo.count(),
    prisma.servico.count({ where: { data: { gte: hojeInicio, lte: hojeFim } } }),
    prisma.servico.count({ where: { data: { gte: mesInicio, lte: mesFim } } }),
    prisma.servico.aggregate({
      where: { data: { gte: mesInicio, lte: mesFim } },
      _sum: { valorTotal: true },
    }),
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint as count FROM produtos WHERE quantidade <= "estoqueMinimo"
    `,
  ]);

  return {
    totalClientes,
    totalVeiculos,
    servicosHoje,
    servicosMes,
    faturamentoMes: toNumber(faturamentoMesAgg._sum.valorTotal),
    produtosEstoqueBaixo: Number(produtosEstoqueBaixoCount[0]?.count ?? 0),
  };
}

/** Próximas trocas (por data, nos próximos 15 dias) e trocas já vencidas. */
export async function getProximasTrocas() {
  const hoje = startOfDay(new Date());
  const em15Dias = endOfDay(addDays(hoje, 15));

  const [proximasPorData, vencidasPorData] = await Promise.all([
    prisma.proximaTroca.findMany({
      where: { tipoAlerta: "DATA", data: { gte: hoje, lte: em15Dias } },
      include: {
        veiculo: { include: { cliente: true } },
      },
      orderBy: { data: "asc" },
      take: 8,
    }),
    prisma.proximaTroca.findMany({
      where: { tipoAlerta: "DATA", data: { lt: hoje } },
      include: {
        veiculo: { include: { cliente: true } },
      },
      orderBy: { data: "desc" },
      take: 8,
    }),
  ]);

  return {
    proximas: proximasPorData,
    vencidas: vencidasPorData,
    totalProximas: proximasPorData.length,
    totalVencidas: vencidasPorData.length,
  };
}

/** Clientes cujo veículo tem alerta de troca vencendo hoje. */
export async function getClientesParaContatarHoje() {
  const hoje = startOfDay(new Date());
  const hojeFim = endOfDay(new Date());

  const alertas = await prisma.proximaTroca.findMany({
    where: { tipoAlerta: "DATA", data: { gte: hoje, lte: hojeFim } },
    include: { veiculo: { include: { cliente: true } } },
  });

  return alertas.map((a) => ({
    id: a.id,
    cliente: a.veiculo.cliente,
    veiculo: a.veiculo,
  }));
}

/** Produtos com estoque no ou abaixo do mínimo. */
export async function getProdutosEstoqueBaixo() {
  return prisma.$queryRaw<
    Array<{
      id: string;
      marca: string;
      linha: string | null;
      codigo: string;
      quantidade: number;
      estoqueMinimo: number;
    }>
  >`
    SELECT id, marca, linha, codigo, quantidade, "estoqueMinimo"
    FROM produtos
    WHERE quantidade <= "estoqueMinimo"
    ORDER BY quantidade ASC
    LIMIT 8
  `;
}

/** Últimos serviços realizados, com cliente/veículo/responsável. */
export async function getUltimosServicos(limit = 6) {
  const servicos = await prisma.servico.findMany({
    orderBy: { data: "desc" },
    take: limit,
    include: {
      cliente: true,
      veiculo: true,
      funcionario: true,
      trocaOleo: true,
    },
  });

  return servicos.map((s) => ({
    id: s.id,
    data: s.data,
    cliente: s.cliente.nome,
    veiculo: `${s.veiculo.marca} ${s.veiculo.modelo}`,
    placa: s.veiculo.placa,
    funcionario: s.funcionario.nome,
    valorTotal: toNumber(s.valorTotal),
    tipoOleo: s.trocaOleo ? `${s.trocaOleo.marca} ${s.trocaOleo.viscosidade}` : null,
  }));
}

/** Série diária de serviços realizados nos últimos 14 dias (para o gráfico). */
export async function getServicosPorPeriodo(dias = 14) {
  const inicio = startOfDay(subDays(new Date(), dias - 1));

  const servicos = await prisma.servico.findMany({
    where: { data: { gte: inicio } },
    select: { data: true, valorTotal: true },
  });

  const buckets = new Map<string, { quantidade: number; faturamento: number }>();
  for (let i = 0; i < dias; i++) {
    const dia = format(addDays(inicio, i), "dd/MM");
    buckets.set(dia, { quantidade: 0, faturamento: 0 });
  }

  for (const s of servicos) {
    const chave = format(s.data, "dd/MM");
    const atual = buckets.get(chave);
    if (atual) {
      atual.quantidade += 1;
      atual.faturamento += toNumber(s.valorTotal);
    }
  }

  return Array.from(buckets.entries()).map(([dia, valores]) => ({
    dia,
    quantidade: valores.quantidade,
    faturamento: Number(valores.faturamento.toFixed(2)),
  }));
}

/** Top produtos mais utilizados nos serviços (por quantidade). */
export async function getProdutosMaisUtilizados(limit = 6) {
  const agrupado = await prisma.itemServicoProduto.groupBy({
    by: ["produtoId"],
    _sum: { quantidade: true },
    orderBy: { _sum: { quantidade: "desc" } },
    take: limit,
  });

  if (agrupado.length === 0) return [];

  const produtos = await prisma.produto.findMany({
    where: { id: { in: agrupado.map((a) => a.produtoId) } },
  });

  return agrupado.map((a) => {
    const produto = produtos.find((p) => p.id === a.produtoId);
    return {
      nome: produto ? `${produto.marca} ${produto.linha ?? ""}`.trim() : "Produto removido",
      quantidade: toNumber(a._sum.quantidade),
    };
  });
}

/** Agrega tudo que o dashboard precisa em paralelo. */
export async function getDashboardData() {
  const [
    contadores,
    proximasTrocas,
    clientesParaContatar,
    produtosEstoqueBaixo,
    ultimosServicos,
    servicosPorPeriodo,
    produtosMaisUtilizados,
  ] = await Promise.all([
    getDashboardCounters(),
    getProximasTrocas(),
    getClientesParaContatarHoje(),
    getProdutosEstoqueBaixo(),
    getUltimosServicos(),
    getServicosPorPeriodo(),
    getProdutosMaisUtilizados(),
  ]);

  return {
    contadores,
    proximasTrocas,
    clientesParaContatar,
    produtosEstoqueBaixo,
    ultimosServicos,
    servicosPorPeriodo,
    produtosMaisUtilizados,
  };
}
