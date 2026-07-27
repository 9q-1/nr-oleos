"use server";

import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface UploadResult {
  url?: string;
  error?: string;
}

export async function uploadImagemAction(formData: FormData): Promise<UploadResult> {
  const session = await getSession();
  if (!session) return { error: "Sessão expirada. Faça login novamente." };

  const file = formData.get("file");
  const pasta = String(formData.get("pasta") ?? "geral");

  if (!(file instanceof File)) {
    return { error: "Nenhum arquivo enviado." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Formato inválido. Envie uma imagem JPG, PNG ou WEBP." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "A imagem deve ter até 5MB." };
  }

  try {
    const blob = await put(`${pasta}/${crypto.randomUUID()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return { url: blob.url };
  } catch (error) {
    console.error("Erro ao enviar imagem para o Blob:", error);
    return { error: "Falha ao enviar a imagem. Tente novamente." };
  }
}
