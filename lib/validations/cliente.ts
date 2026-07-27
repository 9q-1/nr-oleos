import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .transform((v) => v.replace(/\D/g, "")),
  whatsapp: z
    .string()
    .optional()
    .transform((v) => (v ? v.replace(/\D/g, "") : v)),
  cpf: z.string().optional().or(z.literal("")),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional().or(z.literal("")),
  fotoUrl: z.string().optional().or(z.literal("")),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;

// Versão usada no formulário (antes da transformação de telefone) — mantém o valor bruto
// para exibição, a limpeza de máscara acontece no schema acima ao submeter.
export const clienteFormSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo"),
  telefone: z.string().min(10, "Telefone inválido"),
  whatsapp: z.string().optional(),
  cpf: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  observacoes: z.string().optional(),
  fotoUrl: z.string().optional(),
});

export type ClienteFormInput = z.infer<typeof clienteFormSchema>;
