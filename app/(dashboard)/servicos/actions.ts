"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { servicoFormSchema } from "@/lib/validations/servico";
import { getVeiculosParaSelect } from "@/lib/data/servicos";
import { registrarLog } from "@/lib/log";

export interface ServicoActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseArrayFields(formData: FormData, prefix: string) {
  const map = new Map<number, Record<string, string>>();
  const regex = new RegExp(`^${prefix}\\[(\\d+)\\]\\.(\\w+)$`);
  for (const [key, value] of formData.entries()) {
    const match = key.match(regex);
    if (!match) continue;
    const index = Number(match[1]);
    const field = match[2];
    if (!field) continue;
    if (!map.has(index)) map.set(index, {});
    map.get(index)![field] = String(value);
  }
  return Array.from(map.keys())
    .sort((a, b) => a - b)
    .map((i) => map.get(i)!);
}

function parseServico(formData: FormData) {
  const itens = parseArrayFields(formData, "itens").map((i) => ({
    produtoId: i.produtoId,
    quantidade: i.quantidade,
    precoUnitario: i.precoUnitario,
  }));
  const outrosServicos = parseArrayFields(formData, "outrosServicos").map((o) => ({
    tipo: o.tipo,
    descricao: o.descricao,
    preco: o.preco,
  }));

  const radiadorAtivo = formData.get("radiadorAtivo") === "true";

  return servicoFormSchema.safeParse({
    veiculoId: formData.get("veiculoId"),
    data: formData.get("data"),
    hora: formData.get("hora"),
    quilometragem: formData.get("quilometragem"),
    valorMaoDeObra: formData.get("valorMaoDeObra"),
    desconto: formData.get("desconto") || 0,
    formaPagamento: formData.get("formaPagamento"),
    observacoes: formData.get("observacoes") || undefined,
    itens,
    radiadorAtivo,
    radiadorTipo: radiadorAtivo ? formData.get("radiadorTipo") || undefined : undefined,
    radiadorPreco: radiadorAtivo ? formData.get("radiadorPreco") || 0 : undefined,
    outrosServicos,
    proximaTrocaTipo: formData.get("proximaTrocaTipo"),
    proximaTrocaIntervaloKm: formData.get("proximaTrocaIntervaloKm") || undefined,
    proximaTrocaIntervaloMeses: formData.get("proximaTrocaIntervaloMeses") || undefined,
  });
}

function fieldErrorsFrom(issues: { path: (string | number)[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

async function montarChildrenData(tx: any, data: ReturnType<typeof servicoFormSchema.parse>) {
  if (data.itens.length === 0) {
    return { trocaOleoData: null as any, produtosMap: new Map<string, any>(), valorProdutos: 0 };
  }

  const produtos = await tx.produto.findMany({
    where: { id: { in: data.itens.map((i) => i.produtoId) } },
  });
  const produtosMap = new Map(produtos.map((p: any) => [p.id, p]));

  for (const item of data.itens) {
    const produto: any = produtosMap.get(item.produtoId);
    if (!produto) throw new Error("Produto não encontrado no catálogo.");
    if (produto.quantidade < item.quantidade) {
      throw new Error(`Estoque insuficiente de ${produto.marca} ${produto.linha ?? ""}.`.trim());
    }
  }

  const valorProdutos = data.itens.reduce((sum, i) => sum + i.quantidade * i.precoUnitario, 0);

  const itemOleo = data.itens.find((i) => {
    const p: any = produtosMap.get(i.produtoId);
    return p && (p.categoria === "OLEO_MOTOR" || p.categoria === "OLEO_CAMBIO");
  });
  const produtoOleo: any = itemOleo ? produtosMap.get(itemOleo.produtoId) : null;

  const trocaOleoData =
    produtoOleo && itemOleo
      ? {
          marca: produtoOleo.marca,
          viscosidade: produtoOleo.viscosidade ?? "—",
          tipo: produtoOleo.tipoOleo ?? "SINTETICO",
          quantidadeLitros: itemOleo.quantidade,
          preco: itemOleo.precoUnitario * itemOleo.quantidade,
        }
      : null;

  return { trocaOleoData, produtosMap, valorProdutos };
}

export async function criarServicoAction(
  _prevState: ServicoActionState,
  formData: FormData
): Promise<ServicoActionState> {
  const session = await getSession();
  if (!session) return { error: "Sessão expirada. Faça login novamente." };

  const parsed = parseServico(formData);
  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const data = parsed.data;

  let novoServicoId = "";
  let veiculoIdRedirect = "";

  try {
    await prisma.$transaction(async (tx) => {
      const veiculo = await tx.veiculo.findUnique({ where: { id: data.veiculoId } });
      if (!veiculo) throw new Error("Veículo não encontrado.");
      veiculoIdRedirect = veiculo.id;

      const { trocaOleoData, valorProdutos } = await montarChildrenData(tx, data);

      const totalOutros = data.outrosServicos.reduce((sum, o) => sum + o.preco, 0);
      const totalRadiador = data.radiadorAtivo ? data.radiadorPreco ?? 0 : 0;
      const valorMaoDeObraTotal = data.valorMaoDeObra + totalOutros + totalRadiador;
      const valorTotal = valorMaoDeObraTotal + valorProdutos - data.desconto;

      const servico = await tx.servico.create({
        data: {
          data: new Date(`${data.data}T${data.hora}:00`),
          hora: data.hora,
          funcionarioId: session.sub,
          clienteId: veiculo.clienteId,
          veiculoId: veiculo.id,
          quilometragem: data.quilometragem,
          valorMaoDeObra: valorMaoDeObraTotal,
          valorProdutos,
          desconto: data.desconto,
          formaPagamento: data.formaPagamento,
          valorTotal,
          observacoes: data.observacoes || null,
          itensProduto: {
            create: data.itens.map((i) => ({
              produtoId: i.produtoId,
              quantidade: i.quantidade,
              precoUnitario: i.precoUnitario,
            })),
          },
          ...(trocaOleoData ? { trocaOleo: { create: trocaOleoData } } : {}),
          ...(data.radiadorAtivo
            ? {
                servicoRadiador: {
                  create: {
                    tipo: data.radiadorTipo ?? "LIMPEZA",
                    quantidade: 1,
                    preco: data.radiadorPreco ?? 0,
                  },
                },
              }
            : {}),
          ...(data.outrosServicos.length > 0
            ? {
                outrosServicos: {
                  create: data.outrosServicos.map((o) => ({
                    tipo: o.tipo as any,
                    descricao: o.descricao || null,
                    preco: o.preco,
                  })),
                },
              }
            : {}),
        },
      });
      novoServicoId = servico.id;

      for (const item of data.itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: { quantidade: { decrement: item.quantidade } },
        });
        await tx.movimentoEstoque.create({
          data: {
            produtoId: item.produtoId,
            tipo: "SAIDA",
            quantidade: item.quantidade,
            observacao: `Uso na Ordem de Serviço de ${data.data}`,
          },
        });
      }

      await tx.veiculo.update({
        where: { id: veiculo.id },
        data: { quilometragemAtual: data.quilometragem },
      });

      const dataServico = new Date(`${data.data}T${data.hora}:00`);
      const proximaData =
        data.proximaTrocaTipo === "DATA"
          ? new Date(
              dataServico.getFullYear(),
              dataServico.getMonth() + (data.proximaTrocaIntervaloMeses ?? 6),
              dataServico.getDate()
            )
          : null;
      const proximaKm =
        data.proximaTrocaTipo === "QUILOMETRAGEM"
          ? data.quilometragem + (data.proximaTrocaIntervaloKm ?? 5000)
          : null;

      await tx.proximaTroca.upsert({
        where: { veiculoId: veiculo.id },
        create: {
          veiculoId: veiculo.id,
          tipoAlerta: data.proximaTrocaTipo,
          data: proximaData,
          quilometragem: proximaKm,
        },
        update: {
          tipoAlerta: data.proximaTrocaTipo,
          data: proximaData,
          quilometragem: proximaKm,
        },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/servicos");
    revalidatePath("/produtos");
    revalidatePath("/estoque");
    revalidatePath(`/veiculos/${veiculoIdRedirect}`);
    await registrarLog({ acao: "criou", entidade: "Servico", entidadeId: novoServicoId });
  } catch (error: any) {
    console.error(error);
    return { error: error?.message ?? "Não foi possível salvar o serviço. Tente novamente." };
  }

  redirect(`/servicos/${novoServicoId}`);
}

export async function excluirServicoAction(id: string) {
  const servico = await prisma.servico.findUnique({
    where: { id },
    include: { itensProduto: true },
  });
  if (!servico) redirect("/servicos");

  await prisma.$transaction(async (tx) => {
    for (const item of servico!.itensProduto) {
      await tx.produto.update({
        where: { id: item.produtoId },
        data: { quantidade: { increment: Number(item.quantidade) } },
      });
      await tx.movimentoEstoque.create({
        data: {
          produtoId: item.produtoId,
          tipo: "ENTRADA",
          quantidade: Number(item.quantidade),
          observacao: "Estorno por exclusão de serviço",
        },
      });
    }
    await tx.servico.delete({ where: { id } });
  });

  revalidatePath("/dashboard");
  revalidatePath("/servicos");
  revalidatePath("/produtos");
  revalidatePath("/estoque");
  revalidatePath(`/veiculos/${servico!.veiculoId}`);
  await registrarLog({ acao: "excluiu", entidade: "Servico", entidadeId: id });
  redirect(`/veiculos/${servico!.veiculoId}`);
}

export async function atualizarServicoAction(
  id: string,
  _prevState: ServicoActionState,
  formData: FormData
): Promise<ServicoActionState> {
  const data = formData.get("data") as string;
  const hora = formData.get("hora") as string;
  const quilometragem = Number(formData.get("quilometragem"));
  const valorMaoDeObraBase = Number(formData.get("valorMaoDeObra"));
  const desconto = Number(formData.get("desconto") || 0);
  const formaPagamento = formData.get("formaPagamento") as string;
  const observacoes = (formData.get("observacoes") as string) || null;

  if (!data || !hora || Number.isNaN(quilometragem)) {
    return { error: "Verifique os campos destacados." };
  }

  try {
    const atual = await prisma.servico.findUnique({
      where: { id },
      include: { outrosServicos: true, servicoRadiador: true },
    });
    if (!atual) return { error: "Serviço não encontrado." };

    const totalOutros = atual.outrosServicos.reduce((sum, o) => sum + Number(o.preco), 0);
    const totalRadiador = atual.servicoRadiador ? Number(atual.servicoRadiador.preco) : 0;
    const valorMaoDeObraTotal = valorMaoDeObraBase + totalOutros + totalRadiador;
    const valorTotal = valorMaoDeObraTotal + Number(atual.valorProdutos) - desconto;

    await prisma.servico.update({
      where: { id },
      data: {
        data: new Date(`${data}T${hora}:00`),
        hora,
        quilometragem,
        valorMaoDeObra: valorMaoDeObraTotal,
        desconto,
        formaPagamento: formaPagamento as any,
        observacoes,
        valorTotal,
      },
    });

    revalidatePath("/servicos");
    revalidatePath(`/servicos/${id}`);
    revalidatePath(`/veiculos/${atual.veiculoId}`);
    revalidatePath("/dashboard");
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error(error);
    return { error: "Não foi possível atualizar o serviço. Tente novamente." };
  }

  redirect(`/servicos/${id}`);
}

export async function buscarVeiculosParaSelectAction(query: string) {
  return getVeiculosParaSelect(query);
}
