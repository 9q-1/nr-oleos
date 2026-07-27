import Link from "next/link";
import { ArrowLeft, Plus, ShieldCheck, User as UserIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DeleteUsuarioButton } from "@/components/configuracoes/delete-usuario-button";
import { getUsuarios } from "@/lib/data/configuracoes";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Usuários" };
export const dynamic = "force-dynamic";

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default async function UsuariosPage() {
  const session = await requireAdmin();
  const usuarios = await getUsuarios();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/configuracoes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para configurações
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Usuários</h1>
          <p className="text-sm text-muted-foreground">Gerencie quem tem acesso ao sistema.</p>
        </div>
        <Button asChild>
          <Link href="/configuracoes/usuarios/novo">
            <Plus className="h-4 w-4" /> Novo Usuário
          </Link>
        </Button>
      </div>

      <div className="space-y-2.5">
        {usuarios.map((u) => (
          <div key={u.id} className="glass-card flex flex-wrap items-center gap-3 p-4">
            <Avatar>
              {u.fotoUrl && <AvatarImage src={u.fotoUrl} alt={u.nome} />}
              <AvatarFallback>{iniciais(u.nome)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {u.nome} {u.id === session.sub && <span className="text-xs text-muted-foreground">(você)</span>}
              </p>
              <p className="truncate text-xs text-muted-foreground">{u.email}</p>
            </div>
            <Badge variant={u.papel === "ADMINISTRADOR" ? "default" : "muted"}>
              {u.papel === "ADMINISTRADOR" ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
              {u.papel === "ADMINISTRADOR" ? "Administrador" : "Funcionário"}
            </Badge>
            {!u.ativo && <Badge variant="destructive">Inativo</Badge>}
            <div className="flex gap-1.5">
              <Button asChild variant="outline" size="icon" aria-label="Editar usuário">
                <Link href={`/configuracoes/usuarios/${u.id}/editar`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              {u.id !== session.sub && <DeleteUsuarioButton id={u.id} nome={u.nome} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
