import "server-only";
import { prisma } from "@/lib/prisma";

export async function getProdutos(params?: { query?: string; categoria?: string }) {
  const termo = params?.query?.trim();
  const categoria = params?.categoria;

  return prisma.produto.findMany({
    where: {
      AND: [
        categoria && categoria !== "TODAS" ? { categoria: categoria as any } : {},
        termo
          ? {
              OR: [
                { marca: { contains: termo, mode: "insensitive" } },
                { linha: { contains: termo, mode: "insensitive" } },
                { codigo: { contains: termo, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    include: { fornecedor: true },
    orderBy: [{ marca: "asc" }, { linha: "asc" }],
  });
}

export async function getProdutoById(id: string) {
  return prisma.produto.findUnique({
    where: { id },
    include: { fornecedor: true },
  });
}

export async function getFornecedores() {
  return prisma.fornecedor.findMany({ orderBy: { nome: "asc" } });
}

/** Usado pelo seletor de produtos dentro da Ordem de Serviço. */
export async function getProdutosParaSelect(query?: string) {
  const termo = query?.trim();
  return prisma.produto.findMany({
    where: termo
      ? {
          OR: [
            { marca: { contains: termo, mode: "insensitive" } },
            { linha: { contains: termo, mode: "insensitive" } },
            { codigo: { contains: termo, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ marca: "asc" }],
    take: 15,
  });
}
