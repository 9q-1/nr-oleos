import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { UsuarioForm } from "@/components/configuracoes/usuario-form";
import { getUsuarioById } from "@/lib/data/configuracoes";
import { requireAdmin } from "@/lib/auth";
import { atualizarUsuarioAction } from "../../../actions";

export const metadata = { title: "Editar Usuário" };

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const usuario = await getUsuarioById(id);
  if (!usuario) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/configuracoes/usuarios" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar Usuário</h1>
        <p className="text-sm text-muted-foreground">{usuario.nome}</p>
      </div>
      <UsuarioForm usuario={usuario} action={atualizarUsuarioAction.bind(null, id)} />
    </div>
  );
}
