import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Wrench, User, Gauge, Fuel, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteVeiculoButton } from "@/components/veiculos/delete-veiculo-button";
import { ServicosTimeline } from "@/components/veiculos/timeline";
import { getVeiculoById } from "@/lib/data/veiculos";
import { TIPO_VEICULO_LABELS, TIPO_VEICULO_ICONS, COMBUSTIVEL_LABELS } from "@/lib/constants/veiculo";
import { formatDate } from "@/lib/utils";

export default async function VeiculoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const veiculo = await getVeiculoById(id);
  if (!veiculo) notFound();

  const Icon = TIPO_VEICULO_ICONS[veiculo.tipo] ?? TIPO_VEICULO_ICONS.CARRO;
  const trocaVencida = Boolean(veiculo.proximaTroca?.data && veiculo.proximaTroca.data < new Date());

  return (
    <div className="space-y-6">
      <Link
        href={`/clientes/${veiculo.clienteId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para {veiculo.cliente.nome}
      </Link>

      <div className="glass-card flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            {veiculo.fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={veiculo.fotoUrl} alt={veiculo.modelo} className="h-full w-full object-cover" />
            ) : (
              <Icon className="h-7 w-7 text-brand-yellow" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {veiculo.marca} {veiculo.modelo}
              </h1>
              <Badge variant="muted">{TIPO_VEICULO_LABELS[veiculo.tipo]}</Badge>
              {trocaVencida && <Badge variant="destructive">Troca vencida</Badge>}
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <Link href={`/clientes/${veiculo.clienteId}`} className="hover:text-brand-yellow hover:underline">
                {veiculo.cliente.nome}
              </Link>
              <span>· {veiculo.cliente.telefone}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/servicos/novo?veiculoId=${veiculo.id}`}>
              <Wrench className="h-4 w-4" /> Novo Serviço
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/veiculos/${veiculo.id}/editar`}>
              <Pencil className="h-4 w-4" /> Editar
            </Link>
          </Button>
          <DeleteVeiculoButton
            id={veiculo.id}
            clienteId={veiculo.clienteId}
            descricao={`${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InfoStat label="Placa" value={veiculo.placa} />
        <InfoStat label="Ano" value={String(veiculo.ano)} />
        <InfoStat label="Cor" value={veiculo.cor} icon={Palette} />
        <InfoStat label="Combustível" value={COMBUSTIVEL_LABELS[veiculo.combustivel]} icon={Fuel} />
        <InfoStat
          label="Km atual"
          value={veiculo.quilometragemAtual ? `${veiculo.quilometragemAtual.toLocaleString("pt-BR")} km` : "—"}
          icon={Gauge}
        />
        {veiculo.renavam && <InfoStat label="Renavam" value={veiculo.renavam} />}
        {veiculo.motor && <InfoStat label="Motor" value={veiculo.motor} />}
        {veiculo.proximaTroca?.data && (
          <InfoStat label="Próxima troca" value={formatDate(veiculo.proximaTroca.data)} />
        )}
      </div>

      {veiculo.observacoes && (
        <div className="glass-card p-5 text-sm text-muted-foreground">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground">Observações</p>
          {veiculo.observacoes}
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Histórico de serviços</h2>
        <ServicosTimeline
          servicos={veiculo.servicos.map((s) => ({
            ...s,
            valorTotal: Number(s.valorTotal),
          }))}
          veiculoId={veiculo.id}
          veiculoDescricao={`${veiculo.marca} ${veiculo.modelo} · ${veiculo.placa}`}
          clienteNome={veiculo.cliente.nome}
          clienteTelefone={veiculo.cliente.whatsapp ?? veiculo.cliente.telefone}
        />
      </div>
    </div>
  );
}

function InfoStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Gauge;
}) {
  return (
    <div className="glass-card p-4">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <p className="mt-1 truncate font-semibold text-foreground">{value}</p>
    </div>
  );
}
