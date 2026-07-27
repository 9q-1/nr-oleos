import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gerarPlanilhaBuffer, respostaXlsx } from "@/lib/xlsx";
import { FORMA_PAGAMENTO_LABELS } from "@/lib/constants/produto";
import { formatDate } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Não autorizado", { status: 401 });

  const servicos = await prisma.servico.findMany({
    include: { cliente: true, veiculo: true, funcionario: true, trocaOleo: true },
    orderBy: { data: "desc" },
    take: 1000,
  });

  const linhas = servicos.map((s) => ({
    Data: formatDate(s.data),
    Hora: s.hora,
    Cliente: s.cliente.nome,
    Telefone: s.cliente.telefone,
    Veículo: `${s.veiculo.marca} ${s.veiculo.modelo}`,
    Placa: s.veiculo.placa,
    Quilometragem: s.quilometragem,
    Óleo: s.trocaOleo ? `${s.trocaOleo.marca} ${s.trocaOleo.viscosidade}` : "",
    "Mão de obra": Number(s.valorMaoDeObra),
    Produtos: Number(s.valorProdutos),
    Desconto: Number(s.desconto),
    Total: Number(s.valorTotal),
    Pagamento: FORMA_PAGAMENTO_LABELS[s.formaPagamento] ?? s.formaPagamento,
    Responsável: s.funcionario.nome,
  }));

  const buffer = gerarPlanilhaBuffer([{ nome: "Serviços", linhas }]);
  return respostaXlsx(buffer, "servicos.xlsx");
}
