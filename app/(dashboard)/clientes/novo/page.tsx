import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { criarClienteAction } from "../actions";

export const metadata = { title: "Novo Cliente" };

export default function NovoClientePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/clientes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para clientes
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Novo Cliente</h1>
        <p className="text-sm text-muted-foreground">Preencha os dados do cliente.</p>
      </div>
      <ClienteForm action={criarClienteAction} />
    </div>
  );
}
