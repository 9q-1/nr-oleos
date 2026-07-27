"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/shared/image-upload";
import { atualizarPerfilAction, type ConfigActionState } from "@/app/(dashboard)/configuracoes/actions";
import type { Usuario } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Salvar perfil
    </Button>
  );
}

export function PerfilForm({ usuario }: { usuario: Usuario }) {
  const [state, formAction] = useActionState<ConfigActionState, FormData>(atualizarPerfilAction, {});
  const [fotoUrl, setFotoUrl] = useState(usuario.fotoUrl ?? "");

  useEffect(() => {
    if (state.success) toast.success("Perfil atualizado.");
  }, [state.success]);

  return (
    <form action={formAction} className="glass-card space-y-5 p-6 lg:p-8">
      <input type="hidden" name="fotoUrl" value={fotoUrl} />

      <div>
        <Label className="mb-2 block">Foto</Label>
        <ImageUpload pasta="clientes" value={fotoUrl} onChange={setFotoUrl} label="Foto" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" name="nome" defaultValue={usuario.nome} />
      </div>

      <div className="space-y-2">
        <Label>E-mail</Label>
        <Input value={usuario.email} disabled className="opacity-60" />
        <p className="text-xs text-muted-foreground">
          Para alterar o e-mail, peça a um administrador em Configurações → Usuários.
        </p>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
