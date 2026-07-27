import { z } from "zod";

export const empresaFormSchema = z.object({
  nomeEmpresa: z.string().min(2, "Informe o nome da empresa"),
  slogan: z.string().optional().or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
  telefoneWhatsapp: z.string().optional().or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  mensagemLembreteTroca: z.string().optional().or(z.literal("")),
});

export const usuarioFormSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo"),
  email: z.string().email("E-mail inválido"),
  papel: z.enum(["ADMINISTRADOR", "FUNCIONARIO"]),
  senha: z.string().min(6, "Mínimo de 6 caracteres").optional().or(z.literal("")),
  ativo: z.boolean().default(true),
});

export const senhaFormSchema = z
  .object({
    senhaAtual: z.string().min(1, "Informe sua senha atual"),
    novaSenha: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmarSenha: z.string().min(6, "Mínimo de 6 caracteres"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export const perfilFormSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo"),
  fotoUrl: z.string().optional().or(z.literal("")),
});
