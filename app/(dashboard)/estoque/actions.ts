"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getProdutosParaSelect } from "@/lib/data/produtos";

export interface EstoqueActionState {
  error?: string;
  success?: boolean;
}

const entradaSchema = z.object({
  produtoId: z.string().uuid(),
  quantidade: z.coerce.number().int().positive("Informe uma quantidade válida"),
  observacao: z.string().optional(),
});

export async function registrarEntradaEstoqueAction(
  _prevState: EstoqueActionState,
  formData: FormData
): Promise<EstoqueActionState> {
  const parsed = entradaSchema.safeParse({
    produtoId: formData.get("produtoId"),
    quantidade: formData.get("quantidade"),
    observacao: formData.get("observacao") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { produtoId, quantidade, observacao } = parsed.data;

  try {
    await prisma.$transaction([
      prisma.produto.update({
        where: { id: produtoId },
        data: { quantidade: { increment: quantidade } },
      }),
      prisma.movimentoEstoque.create({
        data: {
          produtoId,
          tipo: "ENTRADA",
          quantidade,
          observacao: observacao || "Entrada manual de estoque",
        },
      }),
    ]);
    revalidatePath("/estoque");
    revalidatePath("/produtos");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível registrar a entrada. Tente novamente." };
  }
}

export async function buscarProdutosParaSelectAction(query: string) {
  return getProdutosParaSelect(query);
}
