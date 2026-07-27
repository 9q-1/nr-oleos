import "server-only";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function registrarLog(params: {
  acao: string;
  entidade: string;
  entidadeId?: string;
  detalhes?: string;
}) {
  try {
    const session = await getSession();
    await prisma.logAcao.create({
      data: {
        usuarioId: session?.sub ?? null,
        usuarioNome: session?.nome ?? "Sistema",
        acao: params.acao,
        entidade: params.entidade,
        entidadeId: params.entidadeId ?? null,
        detalhes: params.detalhes ?? null,
      },
    });
  } catch (error) {
    // Log nunca deve derrubar a ação principal.
    console.error("Falha ao registrar log:", error);
  }
}
