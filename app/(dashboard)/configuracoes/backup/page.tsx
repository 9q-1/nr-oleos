import Link from "next/link";
import { ArrowLeft, DatabaseBackup, Info } from "lucide-react";
import { ExportarBackupButton, RestaurarBackupDialog } from "@/components/configuracoes/backup-actions";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Backup e Restauração" };

export default async function BackupPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/configuracoes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para configurações
      </Link>

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
          <DatabaseBackup className="h-6 w-6 text-brand-yellow" /> Backup e Restauração
        </h1>
        <p className="text-sm text-muted-foreground">
          Exporte ou restaure clientes, veículos, próximas trocas, fornecedores e produtos.
        </p>
      </div>

      <div className="glass-card flex items-start gap-3 p-5 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" />
        <p>
          O backup cobre o cadastro (clientes, veículos, próximas trocas, fornecedores e produtos). O
          histórico de serviços já realizados e os usuários do sistema não fazem parte deste backup —
          restaurá-lo não apaga nem recria essas informações.
        </p>
      </div>

      <div className="glass-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">Gerar backup agora</p>
          <p className="text-sm text-muted-foreground">Baixa um arquivo .json com todos os dados de cadastro.</p>
        </div>
        <ExportarBackupButton />
      </div>

      <div className="glass-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">Restaurar a partir de um arquivo</p>
          <p className="text-sm text-muted-foreground">Substitui os dados atuais pelos do backup selecionado.</p>
        </div>
        <RestaurarBackupDialog />
      </div>
    </div>
  );
}
