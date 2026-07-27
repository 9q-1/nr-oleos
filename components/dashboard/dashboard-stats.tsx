import { Users, Car, Wrench, AlertTriangle, PackageX } from "lucide-react";
import { StatCard } from "./stat-card";
import { getDashboardCounters, getProximasTrocas } from "@/lib/data/dashboard";
import { formatCurrency } from "@/lib/utils";

export async function DashboardStats() {
  const [contadores, trocas] = await Promise.all([
    getDashboardCounters(),
    getProximasTrocas(),
  ]);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <StatCard index={0} label="Clientes" value={String(contadores.totalClientes)} icon={Users} />
      <StatCard index={1} label="Veículos" value={String(contadores.totalVeiculos)} icon={Car} />
      <StatCard
        index={2}
        label="Serviços hoje"
        value={String(contadores.servicosHoje)}
        icon={Wrench}
        tone="success"
      />
      <StatCard
        index={3}
        label="Faturamento do mês"
        value={formatCurrency(contadores.faturamentoMes)}
        hint={`${contadores.servicosMes} serviços no mês`}
        icon={Wrench}
      />
      <StatCard
        index={4}
        label="Trocas vencidas"
        value={String(trocas.totalVencidas)}
        icon={AlertTriangle}
        tone={trocas.totalVencidas > 0 ? "danger" : "default"}
      />
      <StatCard
        index={5}
        label="Estoque baixo"
        value={String(contadores.produtosEstoqueBaixo)}
        icon={PackageX}
        tone={contadores.produtosEstoqueBaixo > 0 ? "warning" : "default"}
      />
    </div>
  );
}
