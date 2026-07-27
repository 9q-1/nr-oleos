import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ServicosPorPeriodoChart, ProdutosMaisUtilizadosChart } from "./charts";
import { getServicosPorPeriodo, getProdutosMaisUtilizados } from "@/lib/data/dashboard";

export async function DashboardCharts() {
  const [servicosPorPeriodo, produtosMaisUtilizados] = await Promise.all([
    getServicosPorPeriodo(14),
    getProdutosMaisUtilizados(6),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Serviços realizados</CardTitle>
          <CardDescription>Últimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ServicosPorPeriodoChart data={servicosPorPeriodo} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Produtos mais utilizados</CardTitle>
          <CardDescription>Por quantidade em serviços</CardDescription>
        </CardHeader>
        <CardContent>
          <ProdutosMaisUtilizadosChart data={produtosMaisUtilizados} />
        </CardContent>
      </Card>
    </div>
  );
}
