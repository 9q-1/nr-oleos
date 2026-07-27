import {
  FormaPagamento,
  CategoriaProduto,
  TipoOleo,
  TipoOutroServico,
  TipoServicoRadiador,
} from "@prisma/client";

export const CATEGORIA_PRODUTO_LABELS: Record<CategoriaProduto, string> = {
  OLEO_MOTOR: "Óleo do Motor",
  FILTRO_OLEO: "Filtro de Óleo",
  FILTRO_AR: "Filtro de Ar",
  FILTRO_CABINE: "Filtro de Cabine",
  FILTRO_COMBUSTIVEL: "Filtro de Combustível",
  OLEO_CAMBIO: "Óleo de Câmbio",
  FLUIDO_RADIADOR: "Fluido do Radiador",
  ADITIVO: "Aditivo",
  PALHETA: "Palheta",
  OUTROS: "Outros",
};
export const CATEGORIA_PRODUTO_OPTIONS = Object.entries(CATEGORIA_PRODUTO_LABELS).map(
  ([value, label]) => ({ value: value as CategoriaProduto, label })
);

/** Categorias em que faz sentido perguntar viscosidade/tipo do óleo. */
export const CATEGORIAS_OLEO: CategoriaProduto[] = ["OLEO_MOTOR", "OLEO_CAMBIO"];

export const TIPO_OLEO_LABELS: Record<TipoOleo, string> = {
  SINTETICO: "Sintético",
  SEMISSINTETICO: "Semissintético",
  MINERAL: "Mineral",
};
export const TIPO_OLEO_OPTIONS = Object.entries(TIPO_OLEO_LABELS).map(([value, label]) => ({
  value: value as TipoOleo,
  label,
}));

export const VISCOSIDADE_OPTIONS = [
  "0W20",
  "5W30",
  "5W40",
  "10W40",
  "15W40",
  "20W50",
];

export const TIPO_OUTRO_SERVICO_LABELS: Record<TipoOutroServico, string> = {
  AR_SECO: "Ar Seco",
  CALIBRAGEM: "Calibragem",
  HIGIENIZACAO_AR_CONDICIONADO: "Higienização Ar Condicionado",
  LIMPEZA_RADIADOR: "Limpeza Radiador",
  TROCA_FLUIDO_FREIO: "Troca Fluido Freio",
  TROCA_FLUIDO_DIRECAO: "Troca Fluido Direção",
  TROCA_OLEO_CAMBIO: "Troca Óleo Câmbio",
  DIAGNOSTICO: "Diagnóstico",
  LAVAGEM_TECNICA: "Lavagem Técnica",
  OUTROS: "Outros",
};
export const TIPO_OUTRO_SERVICO_OPTIONS = Object.entries(TIPO_OUTRO_SERVICO_LABELS).map(
  ([value, label]) => ({ value: value as TipoOutroServico, label })
);

export const TIPO_SERVICO_RADIADOR_LABELS: Record<TipoServicoRadiador, string> = {
  LIMPEZA: "Limpeza",
  TROCA_FLUIDO: "Troca de Fluido",
  COMPLETO: "Completo",
};
export const TIPO_SERVICO_RADIADOR_OPTIONS = Object.entries(TIPO_SERVICO_RADIADOR_LABELS).map(
  ([value, label]) => ({ value: value as TipoServicoRadiador, label })
);

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  PIX: "PIX",
  DINHEIRO: "Dinheiro",
  CARTAO: "Cartão",
  PARCELADO: "Parcelado",
};
export const FORMA_PAGAMENTO_OPTIONS = Object.entries(FORMA_PAGAMENTO_LABELS).map(
  ([value, label]) => ({ value: value as FormaPagamento, label })
);
