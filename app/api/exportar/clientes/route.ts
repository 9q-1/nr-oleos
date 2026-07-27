import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gerarPlanilhaBuffer, respostaXlsx } from "@/lib/xlsx";
import { formatDate } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return new Response("Não autorizado", { status: 401 });

  const clientes = await prisma.cliente.findMany({
    include: { veiculos: { select: { placa: true } } },
    orderBy: { nome: "asc" },
  });

  const linhas = clientes.map((c) => ({
    Nome: c.nome,
    Telefone: c.telefone,
    WhatsApp: c.whatsapp ?? "",
    CPF: c.cpf ?? "",
    "E-mail": c.email ?? "",
    Cidade: c.cidade ?? "",
    Endereço: c.endereco ?? "",
    Veículos: c.veiculos.map((v) => v.placa).join(", "),
    "Cadastrado em": formatDate(c.criadoEm),
  }));

  const buffer = gerarPlanilhaBuffer([{ nome: "Clientes", linhas }]);
  return respostaXlsx(buffer, "clientes.xlsx");
}
