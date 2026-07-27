"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession, requireAdmin } from "@/lib/auth";
import { registrarLog } from "@/lib/log";
import {
  empresaFormSchema,
  usuarioFormSchema,
  senhaFormSchema,
  perfilFormSchema,
} from "@/lib/validations/configuracoes";
import { exportarDadosBackup, validarBackup, restaurarDadosBackup } from "@/lib/backup";

export interface ConfigActionState {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
}

function fieldErrorsFrom(issues: { path: (string | number)[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

// ---------- Empresa ----------

export async function atualizarEmpresaAction(
  _prevState: ConfigActionState,
  formData: FormData
): Promise<ConfigActionState> {
  await requireAdmin();

  const parsed = empresaFormSchema.safeParse({
    nomeEmpresa: formData.get("nomeEmpresa"),
    slogan: formData.get("slogan") || undefined,
    telefone: formData.get("telefone") || undefined,
    telefoneWhatsapp: formData.get("telefoneWhatsapp") || undefined,
    endereco: formData.get("endereco") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
    mensagemLembreteTroca: formData.get("mensagemLembreteTroca") || undefined,
  });

  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const data = parsed.data;

  const existente = await prisma.configuracaoEmpresa.findFirst();
  await prisma.configuracaoEmpresa.upsert({
    where: { id: existente?.id ?? "00000000-0000-0000-0000-000000000000" },
    update: {
      nomeEmpresa: data.nomeEmpresa,
      slogan: data.slogan || "",
      telefone: data.telefone || null,
      telefoneWhatsapp: data.telefoneWhatsapp || null,
      endereco: data.endereco || null,
      logoUrl: data.logoUrl || null,
      mensagemLembreteTroca: data.mensagemLembreteTroca || null,
    },
    create: {
      nomeEmpresa: data.nomeEmpresa,
      slogan: data.slogan || "",
      telefone: data.telefone || null,
      telefoneWhatsapp: data.telefoneWhatsapp || null,
      endereco: data.endereco || null,
      logoUrl: data.logoUrl || null,
      mensagemLembreteTroca: data.mensagemLembreteTroca || null,
    },
  });

  await registrarLog({ acao: "atualizou", entidade: "ConfiguracaoEmpresa" });
  revalidatePath("/configuracoes");
  return { success: true };
}

// ---------- Usuários ----------

export async function criarUsuarioAction(
  _prevState: ConfigActionState,
  formData: FormData
): Promise<ConfigActionState> {
  await requireAdmin();

  const parsed = usuarioFormSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    papel: formData.get("papel"),
    senha: formData.get("senha"),
    ativo: formData.get("ativo") === "true",
  });

  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const data = parsed.data;
  if (!data.senha) {
    return { error: "Informe uma senha para o novo usuário.", fieldErrors: { senha: "Obrigatório" } };
  }

  try {
    const senhaHash = await bcrypt.hash(data.senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome: data.nome, email: data.email, papel: data.papel, senhaHash, ativo: data.ativo },
    });
    await registrarLog({ acao: "criou", entidade: "Usuario", entidadeId: usuario.id, detalhes: usuario.nome });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "Já existe um usuário com este e-mail.", fieldErrors: { email: "E-mail já cadastrado" } };
    }
    console.error(error);
    return { error: "Não foi possível criar o usuário." };
  }

  revalidatePath("/configuracoes/usuarios");
  redirect("/configuracoes/usuarios");
}

export async function atualizarUsuarioAction(
  id: string,
  _prevState: ConfigActionState,
  formData: FormData
): Promise<ConfigActionState> {
  await requireAdmin();

  const parsed = usuarioFormSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    papel: formData.get("papel"),
    senha: formData.get("senha") || "",
    ativo: formData.get("ativo") === "true",
  });

  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const data = parsed.data;

  try {
    await prisma.usuario.update({
      where: { id },
      data: {
        nome: data.nome,
        email: data.email,
        papel: data.papel,
        ativo: data.ativo,
        ...(data.senha ? { senhaHash: await bcrypt.hash(data.senha, 10) } : {}),
      },
    });
    await registrarLog({ acao: "editou", entidade: "Usuario", entidadeId: id, detalhes: data.nome });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "Já existe um usuário com este e-mail.", fieldErrors: { email: "E-mail já cadastrado" } };
    }
    console.error(error);
    return { error: "Não foi possível atualizar o usuário." };
  }

  revalidatePath("/configuracoes/usuarios");
  redirect("/configuracoes/usuarios");
}

export async function excluirUsuarioAction(id: string) {
  const session = await requireAdmin();
  if (session.sub === id) {
    throw new Error("Você não pode excluir o próprio usuário enquanto está logado com ele.");
  }
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  await prisma.usuario.delete({ where: { id } });
  await registrarLog({ acao: "excluiu", entidade: "Usuario", entidadeId: id, detalhes: usuario?.nome });
  revalidatePath("/configuracoes/usuarios");
  redirect("/configuracoes/usuarios");
}

// ---------- Senha e Perfil ----------

export async function alterarSenhaAction(
  _prevState: ConfigActionState,
  formData: FormData
): Promise<ConfigActionState> {
  const session = await getSession();
  if (!session) return { error: "Sessão expirada. Faça login novamente." };

  const parsed = senhaFormSchema.safeParse({
    senhaAtual: formData.get("senhaAtual"),
    novaSenha: formData.get("novaSenha"),
    confirmarSenha: formData.get("confirmarSenha"),
  });

  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: session.sub } });
  if (!usuario) return { error: "Usuário não encontrado." };

  const confere = await bcrypt.compare(parsed.data.senhaAtual, usuario.senhaHash);
  if (!confere) {
    return { error: "Senha atual incorreta.", fieldErrors: { senhaAtual: "Senha incorreta" } };
  }

  const novaSenhaHash = await bcrypt.hash(parsed.data.novaSenha, 10);
  await prisma.usuario.update({ where: { id: usuario.id }, data: { senhaHash: novaSenhaHash } });
  await registrarLog({ acao: "alterou a própria senha", entidade: "Usuario", entidadeId: usuario.id });

  return { success: true };
}

export async function atualizarPerfilAction(
  _prevState: ConfigActionState,
  formData: FormData
): Promise<ConfigActionState> {
  const session = await getSession();
  if (!session) return { error: "Sessão expirada. Faça login novamente." };

  const parsed = perfilFormSchema.safeParse({
    nome: formData.get("nome"),
    fotoUrl: formData.get("fotoUrl") || undefined,
  });
  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  await prisma.usuario.update({
    where: { id: session.sub },
    data: { nome: parsed.data.nome, fotoUrl: parsed.data.fotoUrl || null },
  });
  await registrarLog({ acao: "atualizou o próprio perfil", entidade: "Usuario", entidadeId: session.sub });

  revalidatePath("/perfil");
  return { success: true };
}

// ---------- Backup ----------

export async function gerarBackupAction() {
  await requireAdmin();
  const dados = await exportarDadosBackup();
  await registrarLog({ acao: "gerou backup", entidade: "Sistema" });
  return dados;
}

export interface RestaurarBackupState {
  error?: string;
  success?: boolean;
}

export async function restaurarBackupAction(
  _prevState: RestaurarBackupState,
  formData: FormData
): Promise<RestaurarBackupState> {
  await requireAdmin();

  const arquivo = formData.get("arquivo");
  if (!(arquivo instanceof File)) {
    return { error: "Selecione um arquivo de backup (.json)." };
  }

  try {
    const texto = await arquivo.text();
    const json = JSON.parse(texto);
    if (!validarBackup(json)) {
      return { error: "Arquivo inválido: não parece ser um backup gerado por este sistema." };
    }
    await restaurarDadosBackup(json);
    await registrarLog({ acao: "restaurou backup", entidade: "Sistema" });
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível restaurar o backup. Verifique o arquivo e tente novamente." };
  }

  revalidatePath("/");
  return { success: true };
}
