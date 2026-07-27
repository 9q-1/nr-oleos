import { getSession } from "@/lib/auth";
import { getEstoqueOverview } from "@/lib/data/estoque";
import { gerarPlanilhaBuffer, respostaXlsx } from "@/lib/xlsx";
import { CATEGORIA_PRODUTO_LABELS } from "@/lib/constants/produto";
import { formatDate } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Não autorizado", { status: 401 });

  const { produtos, movimentos } = await getEstoqueOverview();

  const linhasEstoque = produtos.map((p) => ({
    Marca: p.marca,
    Linha: p.linha ?? "",
    Código: p.codigo,
    Categoria: CATEGORIA_PRODUTO_LABELS[p.categoria] ?? p.categoria,
    Quantidade: p.quantidade,
    "Estoque mínimo": p.estoqueMinimo,
    Status: p.quantidade === 0 ? "Zerado" : p.quantidade <= p.estoqueMinimo ? "Baixo" : "Normal",
  }));

  const linhasMovimentos = movimentos.map((m) => ({
    Produto: `${m.produto.marca} ${m.produto.linha ?? ""}`.trim(),
    Tipo: m.tipo === "ENTRADA" ? "Entrada" : m.tipo === "SAIDA" ? "Saída" : "Ajuste",
    Quantidade: Number(m.quantidade),
    Observação: m.observacao ?? "",
    Data: formatDate(m.criadoEm),
  }));

  const buffer = gerarPlanilhaBuffer([
    { nome: "Estoque", linhas: linhasEstoque },
    { nome: "Movimentações", linhas: linhasMovimentos },
  ]);
  return respostaXlsx(buffer, "estoque.xlsx");
}
