import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, CarFront, Gauge, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ServicoActionsMenu } from "@/components/servicos/servico-actions-menu";
import { getServicoById } from "@/lib/data/servicos";
import { CATEGORIA_PRODUTO_LABELS, FORMA_PAGAMENTO_LABELS } from "@/lib/constants/produto";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ServicoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const servico = await getServicoById(id);
  if (!servico) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/veiculos/${servico.veiculoId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para o veículo
        </Link>
        <ServicoActionsMenu
          servicoId={servico.id}
          veiculoId={servico.veiculoId}
          clienteNome={servico.cliente.nome}
          clienteTelefone={servico.cliente.whatsapp ?? servico.cliente.telefone}
          veiculoDescricao={`${servico.veiculo.marca} ${servico.veiculo.modelo} · ${servico.veiculo.placa}`}
          data={servico.data}
        />
      </div>

      <div className="glass-card space-y-6 p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Ordem de Serviço</p>
            <h1 className="text-xl font-bold text-white">{formatDate(servico.data)} · {servico.hora}</h1>
          </div>
          <p className="text-2xl font-bold text-brand-yellow">{formatCurrency(Number(servico.valorTotal))}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoLine icon={User} label="Cliente" value={`${servico.cliente.nome} · ${servico.cliente.telefone}`} />
          <InfoLine
            icon={CarFront}
            label="Veículo"
            value={`${servico.veiculo.marca} ${servico.veiculo.modelo} · ${servico.veiculo.placa}`}
          />
          <InfoLine icon={Gauge} label="Quilometragem" value={`${servico.quilometragem.toLocaleString("pt-BR")} km`} />
          <InfoLine icon={Wallet} label="Pagamento" value={FORMA_PAGAMENTO_LABELS[servico.formaPagamento]} />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Produtos utilizados
          </p>
          {servico.itensProduto.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum produto registrado.</p>
          ) : (
            <div className="space-y-1.5">
              {servico.itensProduto.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">
                    {item.produto.marca} {item.produto.linha ?? ""}{" "}
                    <span className="text-muted-foreground">
                      ({CATEGORIA_PRODUTO_LABELS[item.produto.categoria]})
                    </span>
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {Number(item.quantidade)} × {formatCurrency(Number(item.precoUnitario))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {servico.trocaOleo && (
          <div className="rounded-lg border border-brand-yellow/20 bg-brand-yellow/5 p-3 text-sm">
            <span className="font-medium text-brand-yellow">Óleo:</span>{" "}
            {servico.trocaOleo.marca} {servico.trocaOleo.viscosidade} ·{" "}
            {Number(servico.trocaOleo.quantidadeLitros)}L
          </div>
        )}

        {(servico.servicoRadiador || servico.outrosServicos.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {servico.servicoRadiador && <Badge variant="muted">Radiador</Badge>}
            {servico.outrosServicos.map((o) => (
              <Badge key={o.id} variant="muted">
                {o.descricao ?? o.tipo}
              </Badge>
            ))}
          </div>
        )}

        {servico.observacoes && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Observações
            </p>
            <p className="text-sm text-muted-foreground">{servico.observacoes}</p>
          </div>
        )}

        <div className="flex justify-between border-t border-white/10 pt-4 text-sm text-muted-foreground">
          <span>Mão de obra: {formatCurrency(Number(servico.valorMaoDeObra))}</span>
          <span>Produtos: {formatCurrency(Number(servico.valorProdutos))}</span>
          <span>Desconto: {formatCurrency(Number(servico.desconto))}</span>
        </div>
      </div>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-brand-yellow" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
