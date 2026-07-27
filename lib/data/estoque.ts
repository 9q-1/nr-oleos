import "server-only";
import { prisma } from "@/lib/prisma";

export async function getEstoqueOverview() {
  const [produtos, movimentos] = await Promise.all([
    prisma.produto.findMany({
      orderBy: [{ quantidade: "asc" }, { marca: "asc" }],
    }),
    prisma.movimentoEstoque.findMany({
      orderBy: { criadoEm: "desc" },
      take: 20,
      include: { produto: true },
    }),
  ]);

  return { produtos, movimentos };
}
