import { z } from "zod";

export const produtoFormSchema = z.object({
  marca: z.string().min(2, "Informe a marca"),
  linha: z.string().optional().or(z.literal("")),
  codigo: z.string().min(2, "Informe o código"),
  categoria: z.enum([
    "OLEO_MOTOR",
    "FILTRO_OLEO",
    "FILTRO_AR",
    "FILTRO_CABINE",
    "FILTRO_COMBUSTIVEL",
    "OLEO_CAMBIO",
    "FLUIDO_RADIADOR",
    "ADITIVO",
    "PALHETA",
    "OUTROS",
  ]),
  viscosidade: z.string().optional().or(z.literal("")),
  tipoOleo: z.enum(["SINTETICO", "SEMISSINTETICO", "MINERAL"]).optional().or(z.literal("")),
  quantidade: z.coerce.number({ invalid_type_error: "Informe a quantidade" }).int().min(0),
  estoqueMinimo: z.coerce.number({ invalid_type_error: "Informe o estoque mínimo" }).int().min(0),
  precoCusto: z.coerce.number({ invalid_type_error: "Informe o preço de custo" }).min(0),
  precoVenda: z.coerce.number({ invalid_type_error: "Informe o preço de venda" }).min(0),
  fornecedorId: z.string().optional().or(z.literal("")),
  fotoUrl: z.string().optional().or(z.literal("")),
});

export type ProdutoFormValues = z.infer<typeof produtoFormSchema>;
