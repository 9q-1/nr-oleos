import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface LembreteItem {
  id: string;
  data: Date | null;
  veiculo: {
    id: string;
    marca: string;
    modelo: string;
    placa: string;
    cliente: { nome: string; telefone: string; whatsapp: string | null };
  };
}

const TONS: Record<string, "destructive" | "warning" | "muted"> = {
  vencidas: "destructive",
  hoje: "destructive",
  em7Dias: "warning",
  em15Dias: "warning",
  em30Dias: "muted",
};

export function LembretesBucket({
  titulo,
  itens,
  tom = "muted",
}: {
  titulo: string;
  itens: LembreteItem[];
  tom?: string;
}) {
  if (itens.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {titulo}
        <Badge variant={TONS[tom]}>{itens.length}</Badge>
      </h2>
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {itens.map((item) => (
          <div
            key={item.id}
            className="glass-card flex items-center justify-between gap-3 p-4"
          >
            <Link href={`/veiculos/${item.veiculo.id}`} className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{item.veiculo.cliente.nome}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.veiculo.marca} {item.veiculo.modelo} · {item.veiculo.placa}
              </p>
              {item.data && <p className="text-xs text-muted-foreground">Vence em {formatDate(item.data)}</p>}
            </Link>
            <a
              href={`https://wa.me/55${(item.veiculo.cliente.whatsapp ?? item.veiculo.cliente.telefone).replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
            >
              <PhoneCall className="h-3 w-3" /> WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
