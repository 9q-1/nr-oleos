"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { produtoFormSchema } from "@/lib/validations/produto";
import { registrarLog } from "@/lib/log";

export interface ProdutoActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseProduto(formData: FormData) {
  return produtoFormSchema.safeParse({
    marca: formData.get("marca"),
    linha: formData.get("linha") || undefined,
    codigo: formData.get("codigo"),
    categoria: formData.get("categoria"),
    viscosidade: formData.get("viscosidade") || undefined,
    tipoOleo: formData.get("tipoOleo") || undefined,
    quantidade: formData.get("quantidade"),
    estoqueMinimo: formData.get("estoqueMinimo"),
    precoCusto: formData.get("precoCusto"),
    precoVenda: formData.get("precoVenda"),
    fornecedorId: formData.get("fornecedorId") || undefined,
    fotoUrl: formData.get("fotoUrl") || undefined,
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

export async function criarProdutoAction(
  _prevState: ProdutoActionState,
  formData: FormData
): Promise<ProdutoActionState> {
  const parsed = parseProduto(formData);
  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const data = parsed.data;

  try {
    const produto = await prisma.produto.create({
      data: {
        marca: data.marca,
        linha: data.linha || null,
        codigo: data.codigo,
        categoria: data.categoria,
        viscosidade: data.viscosidade || null,
        tipoOleo: data.tipoOleo || null,
        quantidade: data.quantidade,
        estoqueMinimo: data.estoqueMinimo,
        precoCusto: data.precoCusto,
        precoVenda: data.precoVenda,
        fornecedorId: data.fornecedorId || null,
        fotoUrl: data.fotoUrl || null,
      },
    });
    revalidatePath("/produtos");
    revalidatePath("/estoque");
    await registrarLog({
      acao: "criou",
      entidade: "Produto",
      entidadeId: produto.id,
      detalhes: `${produto.marca} ${produto.linha ?? ""}`.trim(),
    });
    redirect("/produtos");
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "Já existe um produto com este código.", fieldErrors: { codigo: "Código já cadastrado" } };
    }
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error(error);
    return { error: "Não foi possível salvar o produto. Tente novamente." };
  }
}

export async function atualizarProdutoAction(
  id: string,
  _prevState: ProdutoActionState,
  formData: FormData
): Promise<ProdutoActionState> {
  const parsed = parseProduto(formData);
  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const data = parsed.data;

  try {
    await prisma.produto.update({
      where: { id },
      data: {
        marca: data.marca,
        linha: data.linha || null,
        codigo: data.codigo,
        categoria: data.categoria,
        viscosidade: data.viscosidade || null,
        tipoOleo: data.tipoOleo || null,
        quantidade: data.quantidade,
        estoqueMinimo: data.estoqueMinimo,
        precoCusto: data.precoCusto,
        precoVenda: data.precoVenda,
        fornecedorId: data.fornecedorId || null,
        fotoUrl: data.fotoUrl || null,
      },
    });
    revalidatePath("/produtos");
    revalidatePath("/estoque");
    await registrarLog({
      acao: "editou",
      entidade: "Produto",
      entidadeId: id,
      detalhes: `${data.marca} ${data.linha ?? ""}`.trim(),
    });
    redirect("/produtos");
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "Já existe um produto com este código.", fieldErrors: { codigo: "Código já cadastrado" } };
    }
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error(error);
    return { error: "Não foi possível atualizar o produto. Tente novamente." };
  }
}

export async function excluirProdutoAction(id: string) {
  const produto = await prisma.produto.findUnique({ where: { id } });
  try {
    await prisma.produto.delete({ where: { id } });
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    if (error?.code === "P2003") {
      throw new Error(
        "Este produto já foi usado em algum serviço e não pode ser excluído. Você pode zerar o estoque ao invés de remover o cadastro."
      );
    }
    throw error;
  }
  await registrarLog({
    acao: "excluiu",
    entidade: "Produto",
    entidadeId: id,
    detalhes: produto ? `${produto.marca} ${produto.linha ?? ""}`.trim() : undefined,
  });
  revalidatePath("/produtos");
  revalidatePath("/estoque");
  redirect("/produtos");
}
