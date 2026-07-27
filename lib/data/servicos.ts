import "server-only";
import { prisma } from "@/lib/prisma";

export async function getVeiculosParaSelect(query?: string) {
  const termo = query?.trim();
  return prisma.veiculo.findMany({
    where: termo
      ? {
          OR: [
            { placa: { contains: termo, mode: "insensitive" } },
            { modelo: { contains: termo, mode: "insensitive" } },
            { marca: { contains: termo, mode: "insensitive" } },
            { cliente: { nome: { contains: termo, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: { cliente: { select: { id: true, nome: true, telefone: true, whatsapp: true } } },
    orderBy: { criadoEm: "desc" },
    take: 10,
  });
}

const servicoDetalheInclude = {
  cliente: true,
  veiculo: true,
  funcionario: true,
  trocaOleo: true,
  servicoRadiador: true,
  outrosServicos: true,
  itensProduto: { include: { produto: true } },
} as const;

export async function getServicoById(id: string) {
  return prisma.servico.findUnique({
    where: { id },
    include: servicoDetalheInclude,
  });
}

export async function getServicos(params?: { query?: string }) {
  const termo = params?.query?.trim();

  return prisma.servico.findMany({
    where: termo
      ? {
          OR: [
            { cliente: { nome: { contains: termo, mode: "insensitive" } } },
            { cliente: { telefone: { contains: termo, mode: "insensitive" } } },
            { veiculo: { placa: { contains: termo, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: servicoDetalheInclude,
    orderBy: { data: "desc" },
    take: 60,
  });
}
