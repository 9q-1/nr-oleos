import Link from "next/link";
import { Droplet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-black px-4">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-yellow/10 blur-[120px]" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-yellow shadow-glow">
          <Droplet className="h-8 w-8 text-brand-black" fill="currentColor" />
        </div>
        <p className="font-display text-6xl font-bold text-white">404</p>
        <h1 className="mt-2 text-xl font-semibold text-white">Página não encontrada</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          O endereço acessado não existe ou foi movido. Confira o link ou volte para o painel.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" /> Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
