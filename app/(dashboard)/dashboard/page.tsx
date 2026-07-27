import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardPanels } from "@/components/dashboard/dashboard-panels";
import {
  StatCardsSkeleton,
  ChartCardSkeleton,
  ListCardSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {saudacao()}, {session?.nome?.split(" ")[0] ?? ""} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Aqui está o resumo da NR Lubrificantes em tempo real.
        </p>
      </div>

      <QuickActions />

      <Suspense fallback={<StatCardsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
        }
      >
        <DashboardCharts />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ListCardSkeleton rows={6} />
            </div>
            <ListCardSkeleton rows={4} />
          </div>
        }
      >
        <DashboardPanels />
      </Suspense>
    </div>
  );
}
