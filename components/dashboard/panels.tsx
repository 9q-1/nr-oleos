import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PhoneCall, AlertTriangle, CalendarClock } from "lucide-react";

interface TrocaAlerta {
  id: string;
  data: Date | null;
  veiculo: { marca: string; modelo: string; placa: string; cliente: { nome: string } };
}

export function TrocasPanel({
  proximas,
  vencidas,
}: {
  proximas: TrocaAlerta[];
  vencidas: TrocaAlerta[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <CalendarClock className="h-4 w-4 text-brand-yellow" />
          Trocas — próximas e vencidas
        </CardTitle>
        <Link href="/lembretes" className="text-xs font-medium text-brand-yellow hover:underline">
          Ver todos
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {vencidas.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-400">Vencidas</p>
            {vencidas.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-3 rounded-lg bg-red-500/[0.06] px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{v.veiculo.cliente.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {v.veiculo.marca} {v.veiculo.modelo} · {v.veiculo.placa}
                  </p>
                </div>
                <Badge variant="destructive">{v.data ? formatDate(v.data) : "—"}</Badge>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Próximos 15 dias
          </p>
          {proximas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma troca prevista no período.</p>
          ) : (
            proximas.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{p.veiculo.cliente.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.veiculo.marca} {p.veiculo.modelo} · {p.veiculo.placa}
                  </p>
                </div>
                <Badge variant="warning">{p.data ? formatDate(p.data) : "—"}</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface UltimoServico {
  id: string;
  data: Date;
  cliente: string;
  veiculo: string;
  placa: string;
  funcionario: string;
  valorTotal: number;
  tipoOleo: string | null;
}

export function UltimosServicosPanel({ servicos }: { servicos: UltimoServico[] }) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base text-foreground">Últimos atendimentos</CardTitle>
        <Link href="/servicos" className="text-xs font-medium text-brand-yellow hover:underline">
          Ver todos
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {servicos.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-muted-foreground">
            Nenhum serviço registrado ainda.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {servicos.map((s) => (
              <Link
                key={s.id}
                href={`/servicos/${s.id}`}
                className="flex items-center justify-between gap-4 px-6 py-3.5 text-sm transition-colors hover:bg-white/5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{s.cliente}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.veiculo} · {s.placa} {s.tipoOleo ? `· ${s.tipoOleo}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-medium tabular-nums text-foreground">{formatCurrency(s.valorTotal)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(s.data)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ClienteParaContatar {
  id: string;
  cliente: { id: string; nome: string; telefone: string; whatsapp: string | null };
  veiculo: { id: string; marca: string; modelo: string; placa: string };
}

export function ClientesParaContatarPanel({ clientes }: { clientes: ClienteParaContatar[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <PhoneCall className="h-4 w-4 text-brand-yellow" />
          Contatar hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {clientes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum contato pendente para hoje.</p>
        ) : (
          clientes.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{item.cliente.nome}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.veiculo.marca} {item.veiculo.modelo} · {item.veiculo.placa}
                </p>
              </div>
              <a
                href={`https://wa.me/55${(item.cliente.whatsapp ?? item.cliente.telefone).replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                WhatsApp
              </a>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface ProdutoEstoqueBaixo {
  id: string;
  marca: string;
  linha: string | null;
  codigo: string;
  quantidade: number;
  estoqueMinimo: number;
}

export function ProdutosEstoqueBaixoPanel({ produtos }: { produtos: ProdutoEstoqueBaixo[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          Estoque baixo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {produtos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todos os produtos estão com estoque saudável.</p>
        ) : (
          produtos.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {p.marca} {p.linha ?? ""}
                </p>
                <p className="truncate text-xs text-muted-foreground">{p.codigo}</p>
              </div>
              <Badge variant={p.quantidade === 0 ? "destructive" : "warning"}>
                {p.quantidade}/{p.estoqueMinimo}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
