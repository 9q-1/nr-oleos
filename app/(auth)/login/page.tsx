import { Droplet } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Entrar — NR Lubrificantes",
};

export default function LoginPage() {
  return (
    <div className="relative z-10 w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-yellow shadow-glow">
          <Droplet className="h-8 w-8 text-brand-black" fill="currentColor" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          NR <span className="brand-gradient-text">Lubrificantes</span>
        </h1>
        <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Super Troca de Óleo
        </p>
      </div>

      <div className="glass-card px-8 py-8">
        <p className="mb-6 text-sm text-muted-foreground">
          Acesse o painel interno com seu e-mail e senha cadastrados.
        </p>
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/70">
        Acesso restrito à equipe NR Lubrificantes.
      </p>
    </div>
  );
}
