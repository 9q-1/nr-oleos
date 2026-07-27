"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/shared/image-upload";
import type { ClienteActionState } from "@/app/(dashboard)/clientes/actions";
import type { Cliente } from "@prisma/client";

interface ClienteFormProps {
  cliente?: Cliente | null;
  action: (state: ClienteActionState, formData: FormData) => Promise<ClienteActionState>;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {isEdit ? "Salvar alterações" : "Cadastrar cliente"}
    </Button>
  );
}

export function ClienteForm({ cliente, action }: ClienteFormProps) {
  const [state, formAction] = useActionState<ClienteActionState, FormData>(action, {});
  const [fotoUrl, setFotoUrl] = useState(cliente?.fotoUrl ?? "");
  const errors = state.fieldErrors ?? {};

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      action={formAction}
      className="glass-card space-y-6 p-6 lg:p-8"
    >
      <input type="hidden" name="fotoUrl" value={fotoUrl} />

      <div>
        <Label className="mb-2 block">Foto do cliente</Label>
        <ImageUpload pasta="clientes" value={fotoUrl} onChange={setFotoUrl} label="Foto" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nome">Nome completo *</Label>
          <Input id="nome" name="nome" defaultValue={cliente?.nome} placeholder="João da Silva" />
          {errors.nome && <p className="text-xs text-red-400">{errors.nome}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input id="telefone" name="telefone" defaultValue={cliente?.telefone} placeholder="(11) 99999-9999" />
          {errors.telefone && <p className="text-xs text-red-400">{errors.telefone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" defaultValue={cliente?.whatsapp ?? ""} placeholder="(11) 99999-9999" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF (opcional)</Label>
          <Input id="cpf" name="cpf" defaultValue={cliente?.cpf ?? ""} placeholder="000.000.000-00" />
          {errors.cpf && <p className="text-xs text-red-400">{errors.cpf}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" defaultValue={cliente?.email ?? ""} placeholder="cliente@email.com" />
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input id="cidade" name="cidade" defaultValue={cliente?.cidade ?? ""} placeholder="São Paulo" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" name="endereco" defaultValue={cliente?.endereco ?? ""} placeholder="Rua, número, bairro" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" defaultValue={cliente?.observacoes ?? ""} placeholder="Preferências, alertas, histórico relevante..." />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <SubmitButton isEdit={Boolean(cliente)} />
      </div>
    </motion.form>
  );
}
