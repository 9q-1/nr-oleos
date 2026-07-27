import Link from "next/link";
import { Users, ScrollText, DatabaseBackup, Settings2 } from "lucide-react";
import { EmpresaForm } from "@/components/configuracoes/empresa-form";
import { getConfiguracaoEmpresa } from "@/lib/data/configuracoes";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Configurações" };
export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const [config, session] = await Promise.all([getConfiguracaoEmpresa(), getSession()]);
  const isAdmin = session?.papel === "ADMINISTRADOR";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
          <Settings2 className="h-6 w-6 text-brand-yellow" /> Configurações
        </h1>
        <p className="text-sm text-muted-foreground">Dados da empresa e preferências do sistema.</p>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/configuracoes/usuarios" className="glass-card hover-lift flex items-center gap-3 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-yellow/10 text-brand-yellow">
              <Users className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-foreground">Usuários e permissões</span>
          </Link>
          <Link href="/configuracoes/logs" className="glass-card hover-lift flex items-center gap-3 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-yellow/10 text-brand-yellow">
              <ScrollText className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-foreground">Logs de ações</span>
          </Link>
          <Link href="/configuracoes/backup" className="glass-card hover-lift flex items-center gap-3 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-yellow/10 text-brand-yellow">
              <DatabaseBackup className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-foreground">Backup e restauração</span>
          </Link>
        </div>
      )}

      {isAdmin ? (
        <EmpresaForm config={config} />
      ) : (
        <div className="glass-card space-y-2 p-6 text-sm text-muted-foreground">
          <p>
            <span className="text-foreground">Empresa:</span> {config.nomeEmpresa} — {config.slogan}
          </p>
          {config.telefone && (
            <p>
              <span className="text-foreground">Telefone:</span> {config.telefone}
            </p>
          )}
          {config.endereco && (
            <p>
              <span className="text-foreground">Endereço:</span> {config.endereco}
            </p>
          )}
          <p className="text-xs">Somente administradores podem editar os dados da empresa.</p>
        </div>
      )}
    </div>
  );
}
