import "server-only";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export interface NotificationItem {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "vencida" | "hoje" | "estoque";
  href: string;
}

export async function getHeaderNotifications(): Promise<NotificationItem[]> {
  const hojeInicio = startOfDay(new Date());
  const hojeFim = endOfDay(new Date());

  const [vencidas, hoje, estoqueBaixo] = await Promise.all([
    prisma.proximaTroca.findMany({
      where: { tipoAlerta: "DATA", data: { lt: hojeInicio } },
      include: { veiculo: { include: { cliente: true } } },
      orderBy: { data: "desc" },
      take: 4,
    }),
    prisma.proximaTroca.findMany({
      where: { tipoAlerta: "DATA", data: { gte: hojeInicio, lte: hojeFim } },
      include: { veiculo: { include: { cliente: true } } },
      take: 4,
    }),
    prisma.$queryRaw<
      Array<{ id: string; marca: string; linha: string | null; quantidade: number }>
    >`SELECT id, marca, linha, quantidade FROM produtos WHERE quantidade <= "estoqueMinimo" LIMIT 4`,
  ]);

  const items: NotificationItem[] = [
    ...vencidas.map((v) => ({
      id: `vencida-${v.id}`,
      titulo: `Troca vencida — ${v.veiculo.cliente.nome}`,
      descricao: `${v.veiculo.marca} ${v.veiculo.modelo} · ${v.veiculo.placa}`,
      tipo: "vencida" as const,
      href: `/veiculos/${v.veiculo.id}`,
    })),
    ...hoje.map((h) => ({
      id: `hoje-${h.id}`,
      titulo: `Troca vence hoje — ${h.veiculo.cliente.nome}`,
      descricao: `${h.veiculo.marca} ${h.veiculo.modelo} · ${h.veiculo.placa}`,
      tipo: "hoje" as const,
      href: `/veiculos/${h.veiculo.id}`,
    })),
    ...estoqueBaixo.map((p) => ({
      id: `estoque-${p.id}`,
      titulo: `Estoque baixo — ${p.marca} ${p.linha ?? ""}`.trim(),
      descricao: `${p.quantidade} unidade(s) restante(s)`,
      tipo: "estoque" as const,
      href: `/estoque`,
    })),
  ];

  return items;
}
