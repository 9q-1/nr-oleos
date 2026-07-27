"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <div>
        <h1 className="text-lg font-semibold text-white">Algo deu errado</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Ocorreu um erro ao carregar esta página. Você pode tentar novamente ou voltar mais tarde.
        </p>
      </div>
      <Button onClick={() => reset()}>
        <RotateCw className="h-4 w-4" /> Tentar novamente
      </Button>
    </div>
  );
}
