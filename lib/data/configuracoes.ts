import "server-only";
import { prisma } from "@/lib/prisma";

export async function getConfiguracaoEmpresa() {
  const config = await prisma.configuracaoEmpresa.findFirst();
  if (config) return config;
  // Cria a configuração padrão na primeira visita, caso o seed não tenha rodado.
  return prisma.configuracaoEmpresa.create({ data: {} });
}

export async function getUsuarios() {
  return prisma.usuario.findMany({ orderBy: { nome: "asc" } });
}

export async function getUsuarioById(id: string) {
  return prisma.usuario.findUnique({ where: { id } });
}

export async function getLogs(limit = 100) {
  return prisma.logAcao.findMany({
    orderBy: { criadoEm: "desc" },
    take: limit,
  });
}
