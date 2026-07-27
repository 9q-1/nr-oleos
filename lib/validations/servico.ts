import { z } from "zod";

export const itemProdutoSchema = z.object({
  produtoId: z.string().uuid(),
  quantidade: z.coerce.number().int().positive("Quantidade inválida"),
  precoUnitario: z.coerce.number().min(0, "Preço inválido"),
});

export const outroServicoSchema = z.object({
  tipo: z.enum([
    "AR_SECO",
    "CALIBRAGEM",
    "HIGIENIZACAO_AR_CONDICIONADO",
    "LIMPEZA_RADIADOR",
    "TROCA_FLUIDO_FREIO",
    "TROCA_FLUIDO_DIRECAO",
    "TROCA_OLEO_CAMBIO",
    "DIAGNOSTICO",
    "LAVAGEM_TECNICA",
    "OUTROS",
  ]),
  descricao: z.string().optional(),
  preco: z.coerce.number().min(0),
});

export const servicoFormSchema = z.object({
  veiculoId: z.string().uuid("Selecione o veículo"),
  data: z.string().min(1, "Informe a data"),
  hora: z.string().min(1, "Informe a hora"),
  quilometragem: z.coerce.number().int().min(0, "Quilometragem inválida"),
  valorMaoDeObra: z.coerce.number().min(0),
  desconto: z.coerce.number().min(0).default(0),
  formaPagamento: z.enum(["PIX", "DINHEIRO", "CARTAO", "PARCELADO"]),
  observacoes: z.string().optional(),

  itens: z.array(itemProdutoSchema).default([]),

  radiadorAtivo: z.boolean().default(false),
  radiadorTipo: z.enum(["LIMPEZA", "TROCA_FLUIDO", "COMPLETO"]).optional(),
  radiadorPreco: z.coerce.number().min(0).optional(),

  outrosServicos: z.array(outroServicoSchema).default([]),

  proximaTrocaTipo: z.enum(["QUILOMETRAGEM", "DATA"]),
  proximaTrocaIntervaloKm: z.coerce.number().int().positive().optional(),
  proximaTrocaIntervaloMeses: z.coerce.number().int().positive().optional(),
});

export type ServicoFormValues = z.infer<typeof servicoFormSchema>;
