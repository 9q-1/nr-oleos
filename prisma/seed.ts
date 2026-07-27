import { PrismaClient, PapelUsuario, CategoriaProduto } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Usuário administrador inicial
  const senhaHash = await bcrypt.hash("nrlubrificantes123", 10);

  await prisma.usuario.upsert({
    where: { email: "admin@nrlubrificantes.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@nrlubrificantes.com",
      senhaHash,
      papel: PapelUsuario.ADMINISTRADOR,
    },
  });

  // Configuração inicial da empresa
  const configExistente = await prisma.configuracaoEmpresa.findFirst();
  if (!configExistente) {
    await prisma.configuracaoEmpresa.create({
      data: {
        nomeEmpresa: "NR Lubrificantes",
        slogan: "Super Troca de Óleo",
        mensagemLembreteTroca:
          "Olá {{cliente}}! Passando para lembrar que seu veículo está próximo da próxima troca de óleo.\n\nVeículo: {{veiculo}}\nPlaca: {{placa}}\nÚltima troca: {{ultimaTroca}}\nPróxima: {{proximaTroca}}\n\nAgende conosco!\nNR Lubrificantes — Super Troca de Óleo",
      },
    });
  }

  // Fornecedor de exemplo
  const fornecedor = await prisma.fornecedor.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      nome: "Distribuidora Padrão",
    },
  });

  // Catálogo base de produtos (evita digitação manual no balcão)
  const produtos = [
    { marca: "Mobil", linha: "Super 5W30", codigo: "OL-MOB-5W30", categoria: CategoriaProduto.OLEO_MOTOR, precoCusto: 28, precoVenda: 45 },
    { marca: "Shell", linha: "Helix 5W40", codigo: "OL-SHL-5W40", categoria: CategoriaProduto.OLEO_MOTOR, precoCusto: 30, precoVenda: 48 },
    { marca: "Tecfil", linha: "PSL55", codigo: "FO-TEC-PSL55", categoria: CategoriaProduto.FILTRO_OLEO, precoCusto: 12, precoVenda: 22 },
    { marca: "Fram", linha: "CA10234", codigo: "FA-FRM-CA10234", categoria: CategoriaProduto.FILTRO_AR, precoCusto: 18, precoVenda: 32 },
    { marca: "Tecfil", linha: "ACP123", codigo: "FC-TEC-ACP123", categoria: CategoriaProduto.FILTRO_CABINE, precoCusto: 15, precoVenda: 28 },
  ];

  for (const p of produtos) {
    await prisma.produto.upsert({
      where: { codigo: p.codigo },
      update: {},
      create: { ...p, quantidade: 20, estoqueMinimo: 5, fornecedorId: fornecedor.id },
    });
  }

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
