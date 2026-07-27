import { redirect } from "next/navigation";
import { UserCircle } from "lucide-react";
import { PerfilForm } from "@/components/configuracoes/perfil-form";
import { SenhaForm } from "@/components/configuracoes/senha-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Meu Perfil" };
export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
          <UserCircle className="h-6 w-6 text-brand-yellow" /> Meu Perfil
        </h1>
        <p className="text-sm text-muted-foreground">Seus dados e sua senha de acesso.</p>
      </div>

      <PerfilForm usuario={usuario} />
      <SenhaForm />
    </div>
  );
}
