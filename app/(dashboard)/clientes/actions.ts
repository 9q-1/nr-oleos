"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clienteFormSchema } from "@/lib/validations/cliente";
import { registrarLog } from "@/lib/log";

export interface ClienteActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseCliente(formData: FormData) {
  return clienteFormSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
    whatsapp: formData.get("whatsapp") || undefined,
    cpf: formData.get("cpf") || undefined,
    email: formData.get("email") || undefined,
    endereco: formData.get("endereco") || undefined,
    cidade: formData.get("cidade") || undefined,
    observacoes: formData.get("observacoes") || undefined,
    fotoUrl: formData.get("fotoUrl") || undefined,
  });
}

function fieldErrorsFrom(issues: { path: (string | number)[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export async function criarClienteAction(
  _prevState: ClienteActionState,
  formData: FormData
): Promise<ClienteActionState> {
  const parsed = parseCliente(formData);
  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const data = parsed.data;

  try {
    const cliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        telefone: data.telefone.replace(/\D/g, ""),
        whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, "") : null,
        cpf: data.cpf || null,
        email: data.email || null,
        endereco: data.endereco || null,
        cidade: data.cidade || null,
        observacoes: data.observacoes || null,
        fotoUrl: data.fotoUrl || null,
      },
    });
    revalidatePath("/clientes");
    await registrarLog({ acao: "criou", entidade: "Cliente", entidadeId: cliente.id, detalhes: cliente.nome });
    redirect(`/clientes/${cliente.id}`);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "Já existe um cliente com este CPF.", fieldErrors: { cpf: "CPF já cadastrado" } };
    }
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error(error);
    return { error: "Não foi possível salvar o cliente. Tente novamente." };
  }
}

export async function atualizarClienteAction(
  id: string,
  _prevState: ClienteActionState,
  formData: FormData
): Promise<ClienteActionState> {
  const parsed = parseCliente(formData);
  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const data = parsed.data;

  try {
    await prisma.cliente.update({
      where: { id },
      data: {
        nome: data.nome,
        telefone: data.telefone.replace(/\D/g, ""),
        whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, "") : null,
        cpf: data.cpf || null,
        email: data.email || null,
        endereco: data.endereco || null,
        cidade: data.cidade || null,
        observacoes: data.observacoes || null,
        fotoUrl: data.fotoUrl || null,
      },
    });
    revalidatePath("/clientes");
    revalidatePath(`/clientes/${id}`);
    await registrarLog({ acao: "editou", entidade: "Cliente", entidadeId: id, detalhes: data.nome });
    redirect(`/clientes/${id}`);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "Já existe um cliente com este CPF.", fieldErrors: { cpf: "CPF já cadastrado" } };
    }
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error(error);
    return { error: "Não foi possível atualizar o cliente. Tente novamente." };
  }
}

export async function excluirClienteAction(id: string) {
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  await prisma.cliente.delete({ where: { id } });
  await registrarLog({ acao: "excluiu", entidade: "Cliente", entidadeId: id, detalhes: cliente?.nome });
  revalidatePath("/clientes");
  redirect("/clientes");
}
