import "server-only";
import { prisma } from "@/lib/prisma";

export async function getClientes(query?: string) {
  const termo = query?.trim();

  return prisma.cliente.findMany({
    where: termo
      ? {
          OR: [
            { nome: { contains: termo, mode: "insensitive" } },
            { telefone: { contains: termo, mode: "insensitive" } },
            { whatsapp: { contains: termo, mode: "insensitive" } },
            {
              veiculos: {
                some: {
                  OR: [
                    { placa: { contains: termo, mode: "insensitive" } },
                    { modelo: { contains: termo, mode: "insensitive" } },
                    { marca: { contains: termo, mode: "insensitive" } },
                  ],
                },
              },
            },
          ],
        }
      : undefined,
    include: {
      veiculos: { select: { id: true, tipo: true } },
    },
    orderBy: { nome: "asc" },
  });
}

export async function getClienteById(id: string) {
  return prisma.cliente.findUnique({
    where: { id },
    include: {
      veiculos: {
        orderBy: { criadoEm: "desc" },
        include: {
          proximaTroca: true,
          _count: { select: { servicos: true } },
        },
      },
    },
  });
}
