import "server-only";
import { prisma } from "@/lib/prisma";

export interface SearchResult {
  tipo: "cliente" | "veiculo" | "produto";
  id: string;
  titulo: string;
  subtitulo: string;
  href: string;
}

export async function pesquisaGlobal(termo: string): Promise<SearchResult[]> {
  const query = termo.trim();
  if (query.length < 2) return [];

  const [clientes, veiculos, produtos] = await Promise.all([
    prisma.cliente.findMany({
      where: {
        OR: [
          { nome: { contains: query, mode: "insensitive" } },
          { telefone: { contains: query, mode: "insensitive" } },
          { whatsapp: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
    prisma.veiculo.findMany({
      where: {
        OR: [
          { placa: { contains: query, mode: "insensitive" } },
          { modelo: { contains: query, mode: "insensitive" } },
          { marca: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { cliente: true },
      take: 5,
    }),
    prisma.produto.findMany({
      where: {
        OR: [
          { marca: { contains: query, mode: "insensitive" } },
          { linha: { contains: query, mode: "insensitive" } },
          { codigo: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
  ]);

  return [
    ...clientes.map((c) => ({
      tipo: "cliente" as const,
      id: c.id,
      titulo: c.nome,
      subtitulo: c.telefone,
      href: `/clientes/${c.id}`,
    })),
    ...veiculos.map((v) => ({
      tipo: "veiculo" as const,
      id: v.id,
      titulo: `${v.marca} ${v.modelo} — ${v.placa}`,
      subtitulo: v.cliente.nome,
      href: `/veiculos/${v.id}`,
    })),
    ...produtos.map((p) => ({
      tipo: "produto" as const,
      id: p.id,
      titulo: `${p.marca} ${p.linha ?? ""}`.trim(),
      subtitulo: p.codigo,
      href: `/produtos/${p.id}`,
    })),
  ];
}
