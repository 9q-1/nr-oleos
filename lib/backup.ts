import "server-only";
import { prisma } from "@/lib/prisma";

export const BACKUP_VERSAO = 1;

export async function exportarDadosBackup() {
  const [clientes, veiculos, proximasTrocas, fornecedores, produtos, configuracaoEmpresa] =
    await Promise.all([
      prisma.cliente.findMany(),
      prisma.veiculo.findMany(),
      prisma.proximaTroca.findMany(),
      prisma.fornecedor.findMany(),
      prisma.produto.findMany(),
      prisma.configuracaoEmpresa.findFirst(),
    ]);

  return {
    versao: BACKUP_VERSAO,
    geradoEm: new Date().toISOString(),
    tabelas: { clientes, veiculos, proximasTrocas, fornecedores, produtos, configuracaoEmpresa },
  };
}

interface BackupPayload {
  versao: number;
  tabelas: {
    clientes: any[];
    veiculos: any[];
    proximasTrocas: any[];
    fornecedores: any[];
    produtos: any[];
    configuracaoEmpresa: any;
  };
}

export function validarBackup(json: unknown): json is BackupPayload {
  if (!json || typeof json !== "object") return false;
  const obj = json as any;
  return (
    typeof obj.versao === "number" &&
    obj.tabelas &&
    Array.isArray(obj.tabelas.clientes) &&
    Array.isArray(obj.tabelas.veiculos) &&
    Array.isArray(obj.tabelas.produtos)
  );
}

/**
 * Restaura clientes, veículos, próximas trocas, fornecedores e produtos a partir de um backup.
 * ATENÇÃO: operação destrutiva — substitui os dados atuais dessas tabelas.
 * Serviços já realizados (histórico) e usuários NÃO são afetados por este processo.
 */
export async function restaurarDadosBackup(payload: BackupPayload) {
  await prisma.$transaction(async (tx) => {
    // Ordem: filhos antes dos pais na exclusão, pais antes dos filhos na recriação.
    await tx.proximaTroca.deleteMany({});
    await tx.veiculo.deleteMany({});
    await tx.cliente.deleteMany({});
    await tx.produto.deleteMany({});
    await tx.fornecedor.deleteMany({});

    if (payload.tabelas.clientes.length > 0) {
      await tx.cliente.createMany({ data: payload.tabelas.clientes, skipDuplicates: true });
    }
    if (payload.tabelas.fornecedores.length > 0) {
      await tx.fornecedor.createMany({ data: payload.tabelas.fornecedores, skipDuplicates: true });
    }
    if (payload.tabelas.produtos.length > 0) {
      await tx.produto.createMany({ data: payload.tabelas.produtos, skipDuplicates: true });
    }
    if (payload.tabelas.veiculos.length > 0) {
      await tx.veiculo.createMany({ data: payload.tabelas.veiculos, skipDuplicates: true });
    }
    if (payload.tabelas.proximasTrocas.length > 0) {
      await tx.proximaTroca.createMany({ data: payload.tabelas.proximasTrocas, skipDuplicates: true });
    }
    if (payload.tabelas.configuracaoEmpresa) {
      const existente = await tx.configuracaoEmpresa.findFirst();
      if (existente) {
        await tx.configuracaoEmpresa.update({
          where: { id: existente.id },
          data: { ...payload.tabelas.configuracaoEmpresa, id: undefined },
        });
      }
    }
  });
}
