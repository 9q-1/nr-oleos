import {
  getUltimosServicos,
  getClientesParaContatarHoje,
  getProdutosEstoqueBaixo,
  getProximasTrocas,
} from "@/lib/data/dashboard";
import { UltimosServicosPanel, ClientesParaContatarPanel, ProdutosEstoqueBaixoPanel, TrocasPanel } from "./panels";

export async function DashboardPanels() {
  const [ultimosServicos, clientesParaContatar, produtosEstoqueBaixo, trocas] = await Promise.all([
    getUltimosServicos(6),
    getClientesParaContatarHoje(),
    getProdutosEstoqueBaixo(),
    getProximasTrocas(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <UltimosServicosPanel servicos={ultimosServicos} />
      <div className="space-y-4">
        <ClientesParaContatarPanel clientes={clientesParaContatar} />
        <ProdutosEstoqueBaixoPanel produtos={produtosEstoqueBaixo} />
      </div>
      <div className="lg:col-span-3">
        <TrocasPanel proximas={trocas.proximas} vencidas={trocas.vencidas} />
      </div>
    </div>
  );
}
