import "server-only";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, addDays } from "date-fns";

export async function getLembretes(query?: string) {
  const termo = query?.trim();
  const hoje = startOfDay(new Date());

  const alertas = await prisma.proximaTroca.findMany({
    where: {
      tipoAlerta: "DATA",
      data: { not: null },
      veiculo: termo
        ? {
            OR: [
              { placa: { contains: termo, mode: "insensitive" } },
              { cliente: { nome: { contains: termo, mode: "insensitive" } } },
              { cliente: { telefone: { contains: termo, mode: "insensitive" } } },
            ],
          }
        : undefined,
    },
    include: { veiculo: { include: { cliente: true } } },
    orderBy: { data: "asc" },
  });

  const buckets = {
    vencidas: [] as typeof alertas,
    hoje: [] as typeof alertas,
    em7Dias: [] as typeof alertas,
    em15Dias: [] as typeof alertas,
    em30Dias: [] as typeof alertas,
  };

  for (const alerta of alertas) {
    const data = alerta.data!;
    if (data < hoje) buckets.vencidas.push(alerta);
    else if (data <= endOfDay(hoje)) buckets.hoje.push(alerta);
    else if (data <= endOfDay(addDays(hoje, 7))) buckets.em7Dias.push(alerta);
    else if (data <= endOfDay(addDays(hoje, 15))) buckets.em15Dias.push(alerta);
    else if (data <= endOfDay(addDays(hoje, 30))) buckets.em30Dias.push(alerta);
  }

  return buckets;
}
