import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gerarPlanilhaBuffer, respostaXlsx } from "@/lib/xlsx";
import { CATEGORIA_PRODUTO_LABELS } from "@/lib/constants/produto";

export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Não autorizado", { status: 401 });

  const produtos = await prisma.produto.findMany({
    include: { fornecedor: true },
    orderBy: [{ marca: "asc" }],
  });

  const linhas = produtos.map((p) => ({
    Marca: p.marca,
    Linha: p.linha ?? "",
    Código: p.codigo,
    Categoria: CATEGORIA_PRODUTO_LABELS[p.categoria] ?? p.categoria,
    Viscosidade: p.viscosidade ?? "",
    "Tipo de óleo": p.tipoOleo ?? "",
    Quantidade: p.quantidade,
    "Estoque mínimo": p.estoqueMinimo,
    "Preço de custo": Number(p.precoCusto),
    "Preço de venda": Number(p.precoVenda),
    Fornecedor: p.fornecedor?.nome ?? "",
  }));

  const buffer = gerarPlanilhaBuffer([{ nome: "Produtos", linhas }]);
  return respostaXlsx(buffer, "produtos.xlsx");
}
