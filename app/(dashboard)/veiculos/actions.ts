"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { veiculoFormSchema } from "@/lib/validations/veiculo";
import { getClientesParaSelect } from "@/lib/data/veiculos";
import { registrarLog } from "@/lib/log";

export interface VeiculoActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function parseVeiculo(formData: FormData) {
  return veiculoFormSchema.safeParse({
    clienteId: formData.get("clienteId"),
    marca: formData.get("marca"),
    modelo: formData.get("modelo"),
    ano: formData.get("ano"),
    cor: formData.get("cor"),
    placa: formData.get("placa"),
    renavam: formData.get("renavam") || undefined,
    tipo: formData.get("tipo"),
    combustivel: formData.get("combustivel"),
    motor: formData.get("motor") || undefined,
    chassi: formData.get("chassi") || undefined,
    observacoes: formData.get("observacoes") || undefined,
    quilometragemAtual: formData.get("quilometragemAtual") || undefined,
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

export async function criarVeiculoAction(
  _prevState: VeiculoActionState,
  formData: FormData
): Promise<VeiculoActionState> {
  const parsed = parseVeiculo(formData);
  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const data = parsed.data;

  try {
    const veiculo = await prisma.veiculo.create({
      data: {
        clienteId: data.clienteId,
        marca: data.marca,
        modelo: data.modelo,
        ano: data.ano,
        cor: data.cor,
        placa: data.placa,
        renavam: data.renavam || null,
        tipo: data.tipo,
        combustivel: data.combustivel,
        motor: data.motor || null,
        chassi: data.chassi || null,
        observacoes: data.observacoes || null,
        quilometragemAtual: data.quilometragemAtual ?? null,
        fotoUrl: data.fotoUrl || null,
      },
    });
    revalidatePath("/veiculos");
    revalidatePath(`/clientes/${data.clienteId}`);
    await registrarLog({
      acao: "criou",
      entidade: "Veiculo",
      entidadeId: veiculo.id,
      detalhes: `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}`,
    });
    redirect(`/veiculos/${veiculo.id}`);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "Já existe um veículo com esta placa.", fieldErrors: { placa: "Placa já cadastrada" } };
    }
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error(error);
    return { error: "Não foi possível salvar o veículo. Tente novamente." };
  }
}

export async function atualizarVeiculoAction(
  id: string,
  _prevState: VeiculoActionState,
  formData: FormData
): Promise<VeiculoActionState> {
  const parsed = parseVeiculo(formData);
  if (!parsed.success) {
    return { error: "Verifique os campos destacados.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const data = parsed.data;

  try {
    await prisma.veiculo.update({
      where: { id },
      data: {
        clienteId: data.clienteId,
        marca: data.marca,
        modelo: data.modelo,
        ano: data.ano,
        cor: data.cor,
        placa: data.placa,
        renavam: data.renavam || null,
        tipo: data.tipo,
        combustivel: data.combustivel,
        motor: data.motor || null,
        chassi: data.chassi || null,
        observacoes: data.observacoes || null,
        quilometragemAtual: data.quilometragemAtual ?? null,
        fotoUrl: data.fotoUrl || null,
      },
    });
    revalidatePath("/veiculos");
    revalidatePath(`/veiculos/${id}`);
    revalidatePath(`/clientes/${data.clienteId}`);
    await registrarLog({
      acao: "editou",
      entidade: "Veiculo",
      entidadeId: id,
      detalhes: `${data.marca} ${data.modelo} - ${data.placa}`,
    });
    redirect(`/veiculos/${id}`);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "Já existe um veículo com esta placa.", fieldErrors: { placa: "Placa já cadastrada" } };
    }
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error(error);
    return { error: "Não foi possível atualizar o veículo. Tente novamente." };
  }
}

export async function excluirVeiculoAction(id: string, clienteId: string) {
  const veiculo = await prisma.veiculo.findUnique({ where: { id } });
  await prisma.veiculo.delete({ where: { id } });
  await registrarLog({
    acao: "excluiu",
    entidade: "Veiculo",
    entidadeId: id,
    detalhes: veiculo ? `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}` : undefined,
  });
  revalidatePath("/veiculos");
  revalidatePath(`/clientes/${clienteId}`);
  redirect(`/clientes/${clienteId}`);
}

export async function buscarClientesParaSelectAction(query: string) {
  return getClientesParaSelect(query);
}
