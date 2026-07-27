import { Wrench, Droplet, Fan, Sparkles } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ServicoActionsMenu } from "@/components/servicos/servico-actions-menu";

interface ServicoTimelineItem {
  id: string;
  data: Date;
  quilometragem: number;
  valorTotal: number;
  funcionario: { nome: string };
  observacoes: string | null;
  trocaOleo: { marca: string; viscosidade: string; tipo: string } | null;
  servicoRadiador: { tipo: string } | null;
  outrosServicos: { tipo: string; descricao: string | null }[];
  itensProduto: { produto: { marca: string; linha: string | null; categoria: string } }[];
}

function iconePara(item: ServicoTimelineItem) {
  if (item.trocaOleo) return Droplet;
  if (item.servicoRadiador) return Fan;
  if (item.outrosServicos.length > 0) return Sparkles;
  return Wrench;
}

export function ServicosTimeline({
  servicos,
  veiculoId,
  veiculoDescricao,
  clienteNome,
  clienteTelefone,
}: {
  servicos: ServicoTimelineItem[];
  veiculoId: string;
  veiculoDescricao: string;
  clienteNome: string;
  clienteTelefone: string;
}) {
  if (servicos.length === 0) {
    return (
      <div className="glass-card p-8 text-center text-sm text-muted-foreground">
        Nenhum serviço registrado para este veículo ainda.
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pl-6">
      <div className="absolute bottom-2 left-[11px] top-2 w-px bg-white/10" />
      {servicos.map((s) => {
        const Icon = iconePara(s);
        const filtros = s.itensProduto.filter((i) =>
          i.produto.categoria.startsWith("FILTRO")
        );

        return (
          <div key={s.id} className="relative">
            <span className="absolute -left-6 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-brand-yellow/40 bg-brand-black">
              <Icon className="h-3.5 w-3.5 text-brand-yellow" />
            </span>
            <div className="glass-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-foreground">{formatDate(s.data)}</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium tabular-nums text-brand-yellow">
                    {formatCurrency(s.valorTotal)}
                  </p>
                  <ServicoActionsMenu
                    servicoId={s.id}
                    veiculoId={veiculoId}
                    clienteNome={clienteNome}
                    clienteTelefone={clienteTelefone}
                    veiculoDescricao={veiculoDescricao}
                    data={s.data}
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {s.quilometragem.toLocaleString("pt-BR")} km · Responsável: {s.funcionario.nome}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.trocaOleo && (
                  <span className="rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-2.5 py-1 text-xs text-brand-yellow">
                    {s.trocaOleo.marca} {s.trocaOleo.viscosidade}
                  </span>
                )}
                {filtros.map((f, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {f.produto.marca} {f.produto.linha}
                  </span>
                ))}
                {s.servicoRadiador && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
                    Radiador
                  </span>
                )}
                {s.outrosServicos.map((o, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {o.descricao ?? o.tipo.replaceAll("_", " ").toLowerCase()}
                  </span>
                ))}
              </div>

              {s.observacoes && (
                <p className="mt-3 text-xs text-muted-foreground">{s.observacoes}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
