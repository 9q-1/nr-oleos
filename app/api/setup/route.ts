import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PapelUsuario } from "@prisma/client";

/**
 * Rota de configuração inicial — cria o usuário administrador padrão.
 * Protegida por um token secreto (env var SETUP_SECRET) para que só você consiga acioná-la.
 *
 * Uso: acesse no navegador, uma única vez, após o primeiro deploy bem-sucedido:
 *   https://SEU-DOMINIO.vercel.app/api/setup?token=SEU_SETUP_SECRET
 *
 * Depois de confirmar que o login funciona, remova esta rota ou troque o SETUP_SECRET
 * nas variáveis de ambiente do Vercel para desativá-la.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const expected = process.env.SETUP_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "SETUP_SECRET não configurado nas variáveis de ambiente do Vercel." },
      { status: 500 }
    );
  }

  if (!token || token !== expected) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const senhaPadrao = "nrlubrificantes123";
  const senhaHash = await bcrypt.hash(senhaPadrao, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email: "admin@nrlubrificantes.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@nrlubrificantes.com",
      senhaHash,
      papel: PapelUsuario.ADMINISTRADOR,
    },
  });

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

  return NextResponse.json({
    ok: true,
    mensagem: "Usuário administrador criado (ou já existia). Faça login e troque a senha imediatamente.",
    email: usuario.email,
    senhaTemporaria: senhaPadrao,
  });
}
