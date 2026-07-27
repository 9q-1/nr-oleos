import "server-only";
import { prisma } from "@/lib/prisma";

export async function getVeiculos(params?: { query?: string; tipo?: string }) {
  const termo = params?.query?.trim();
  const tipo = params?.tipo;

  return prisma.veiculo.findMany({
    where: {
      AND: [
        tipo && tipo !== "TODOS" ? { tipo: tipo as any } : {},
        termo
          ? {
              OR: [
                { placa: { contains: termo, mode: "insensitive" } },
                { modelo: { contains: termo, mode: "insensitive" } },
                { marca: { contains: termo, mode: "insensitive" } },
                { cliente: { nome: { contains: termo, mode: "insensitive" } } },
                { cliente: { telefone: { contains: termo, mode: "insensitive" } } },
              ],
            }
          : {},
      ],
    },
    include: {
      cliente: true,
      proximaTroca: true,
    },
    orderBy: { criadoEm: "desc" },
  });
}

export async function getVeiculoById(id: string) {
  return prisma.veiculo.findUnique({
    where: { id },
    include: {
      cliente: true,
      proximaTroca: true,
      servicos: {
        orderBy: { data: "desc" },
        include: {
          funcionario: true,
          trocaOleo: true,
          servicoRadiador: true,
          outrosServicos: true,
          itensProduto: { include: { produto: true } },
        },
      },
    },
  });
}

export async function getClientesParaSelect(query?: string) {
  const termo = query?.trim();
  if (!termo || termo.length < 2) {
    return prisma.cliente.findMany({
      orderBy: { nome: "asc" },
      take: 8,
      select: { id: true, nome: true, telefone: true },
    });
  }

  return prisma.cliente.findMany({
    where: {
      OR: [
        { nome: { contains: termo, mode: "insensitive" } },
        { telefone: { contains: termo, mode: "insensitive" } },
      ],
    },
    take: 8,
    select: { id: true, nome: true, telefone: true },
  });
}
