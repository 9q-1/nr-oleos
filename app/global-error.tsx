"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function GlobalError({
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
    <html lang="pt-BR" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-brand-black px-4 font-sans">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertTriangle className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-white">Erro inesperado</h1>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              O sistema encontrou um problema. Tente novamente em instantes.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-black"
          >
            <RotateCw className="h-4 w-4" /> Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
