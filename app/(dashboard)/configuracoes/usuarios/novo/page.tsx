import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UsuarioForm } from "@/components/configuracoes/usuario-form";
import { requireAdmin } from "@/lib/auth";
import { criarUsuarioAction } from "../../actions";

export const metadata = { title: "Novo Usuário" };

export default async function NovoUsuarioPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/configuracoes/usuarios" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Novo Usuário</h1>
        <p className="text-sm text-muted-foreground">Crie um acesso para um administrador ou funcionário.</p>
      </div>
      <UsuarioForm action={criarUsuarioAction} />
    </div>
  );
}
