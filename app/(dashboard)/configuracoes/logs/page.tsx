import Link from "next/link";
import { ArrowLeft, ScrollText } from "lucide-react";
import { getLogs } from "@/lib/data/configuracoes";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Logs de Ações" };
export const dynamic = "force-dynamic";

function formatarDataHora(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}

export default async function LogsPage() {
  await requireAdmin();
  const logs = await getLogs();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/configuracoes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para configurações
      </Link>

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
          <ScrollText className="h-6 w-6 text-brand-yellow" /> Logs de Ações
        </h1>
        <p className="text-sm text-muted-foreground">Últimas {logs.length} ações registradas no sistema.</p>
      </div>

      {logs.length === 0 ? (
        <div className="glass-card p-8 text-center text-sm text-muted-foreground">
          Nenhuma ação registrada ainda.
        </div>
      ) : (
        <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 p-3.5 text-sm">
              <p className="text-foreground">
                <span className="font-medium">{log.usuarioNome}</span>{" "}
                <span className="text-muted-foreground">
                  {log.acao} {log.entidade}
                  {log.detalhes ? ` — ${log.detalhes}` : ""}
                </span>
              </p>
              <p className="shrink-0 text-xs text-muted-foreground">{formatarDataHora(log.criadoEm)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
