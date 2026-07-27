"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/shared/image-upload";
import { atualizarEmpresaAction, type ConfigActionState } from "@/app/(dashboard)/configuracoes/actions";
import type { ConfiguracaoEmpresa } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Salvar configurações
    </Button>
  );
}

export function EmpresaForm({ config }: { config: ConfiguracaoEmpresa }) {
  const [state, formAction] = useActionState<ConfigActionState, FormData>(atualizarEmpresaAction, {});
  const [logoUrl, setLogoUrl] = useState(config.logoUrl ?? "");
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.success) toast.success("Configurações da empresa atualizadas.");
  }, [state.success]);

  return (
    <form action={formAction} className="glass-card space-y-6 p-6 lg:p-8">
      <input type="hidden" name="logoUrl" value={logoUrl} />

      <div>
        <Label className="mb-2 block">Logo da empresa</Label>
        <ImageUpload pasta="produtos" value={logoUrl} onChange={setLogoUrl} label="Logo" shape="square" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nomeEmpresa">Nome da empresa *</Label>
          <Input id="nomeEmpresa" name="nomeEmpresa" defaultValue={config.nomeEmpresa} />
          {errors.nomeEmpresa && <p className="text-xs text-red-400">{errors.nomeEmpresa}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slogan">Slogan</Label>
          <Input id="slogan" name="slogan" defaultValue={config.slogan} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" name="telefone" defaultValue={config.telefone ?? ""} placeholder="(11) 3333-4444" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefoneWhatsapp">WhatsApp</Label>
          <Input
            id="telefoneWhatsapp"
            name="telefoneWhatsapp"
            defaultValue={config.telefoneWhatsapp ?? ""}
            placeholder="(11) 99999-9999"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" name="endereco" defaultValue={config.endereco ?? ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mensagemLembreteTroca">Mensagem padrão de lembrete de troca (WhatsApp)</Label>
          <Textarea
            id="mensagemLembreteTroca"
            name="mensagemLembreteTroca"
            rows={5}
            defaultValue={config.mensagemLembreteTroca ?? ""}
          />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
