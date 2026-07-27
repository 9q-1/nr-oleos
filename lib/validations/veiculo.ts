import { z } from "zod";

const anoAtual = new Date().getFullYear();

const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/; // aceita padrão antigo e Mercosul

export const veiculoFormSchema = z.object({
  clienteId: z.string().uuid("Selecione um cliente"),
  marca: z.string().min(2, "Informe a marca"),
  modelo: z.string().min(1, "Informe o modelo"),
  ano: z.coerce
    .number({ invalid_type_error: "Informe o ano" })
    .int()
    .min(1950, "Ano inválido")
    .max(anoAtual + 1, "Ano inválido"),
  cor: z.string().min(2, "Informe a cor"),
  placa: z
    .string()
    .min(7, "Placa inválida")
    .transform((v) => v.toUpperCase().replace(/[^A-Z0-9]/g, ""))
    .refine((v) => placaRegex.test(v), "Formato de placa inválido"),
  renavam: z.string().optional().or(z.literal("")),
  tipo: z.enum(["CARRO", "MOTO", "JET_SKI", "CAMINHONETE", "SUV", "UTILITARIO"]),
  combustivel: z.enum(["GASOLINA", "ETANOL", "DIESEL", "FLEX", "HIBRIDO", "ELETRICO"]),
  motor: z.string().optional().or(z.literal("")),
  chassi: z.string().optional().or(z.literal("")),
  observacoes: z.string().optional().or(z.literal("")),
  quilometragemAtual: z.coerce
    .number({ invalid_type_error: "Informe a quilometragem" })
    .int()
    .min(0, "Quilometragem inválida")
    .optional(),
  fotoUrl: z.string().optional().or(z.literal("")),
});

export type VeiculoFormValues = z.infer<typeof veiculoFormSchema>;
