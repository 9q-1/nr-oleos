"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/shared/image-upload";
import { ClienteSelect } from "@/components/veiculos/cliente-select";
import { TIPO_VEICULO_OPTIONS, COMBUSTIVEL_OPTIONS } from "@/lib/constants/veiculo";
import type { VeiculoActionState } from "@/app/(dashboard)/veiculos/actions";
import type { Veiculo } from "@prisma/client";

interface VeiculoFormProps {
  veiculo?: Veiculo | null;
  clienteInicial?: { id: string; nome: string; telefone: string } | null;
  bloquearCliente?: boolean;
  action: (state: VeiculoActionState, formData: FormData) => Promise<VeiculoActionState>;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {isEdit ? "Salvar alterações" : "Cadastrar veículo"}
    </Button>
  );
}

export function VeiculoForm({ veiculo, clienteInicial, bloquearCliente, action }: VeiculoFormProps) {
  const [state, formAction] = useActionState<VeiculoActionState, FormData>(action, {});
  const [fotoUrl, setFotoUrl] = useState(veiculo?.fotoUrl ?? "");
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
        <Label className="mb-2 block">Foto do veículo</Label>
        <ImageUpload pasta="veiculos" value={fotoUrl} onChange={setFotoUrl} label="Foto" shape="square" />
      </div>

      <div className="space-y-2">
        <Label>Cliente *</Label>
        <ClienteSelect
          defaultValue={clienteInicial ?? null}
          locked={Boolean(bloquearCliente)}
          error={errors.clienteId}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input id="marca" name="marca" defaultValue={veiculo?.marca} placeholder="Toyota" />
          {errors.marca && <p className="text-xs text-red-400">{errors.marca}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo *</Label>
          <Input id="modelo" name="modelo" defaultValue={veiculo?.modelo} placeholder="Corolla" />
          {errors.modelo && <p className="text-xs text-red-400">{errors.modelo}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ano">Ano *</Label>
          <Input id="ano" name="ano" type="number" defaultValue={veiculo?.ano} placeholder="2022" />
          {errors.ano && <p className="text-xs text-red-400">{errors.ano}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cor">Cor *</Label>
          <Input id="cor" name="cor" defaultValue={veiculo?.cor} placeholder="Prata" />
          {errors.cor && <p className="text-xs text-red-400">{errors.cor}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="placa">Placa *</Label>
          <Input
            id="placa"
            name="placa"
            defaultValue={veiculo?.placa}
            placeholder="ABC1D23"
            className="uppercase"
          />
          {errors.placa && <p className="text-xs text-red-400">{errors.placa}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="renavam">Renavam (opcional)</Label>
          <Input id="renavam" name="renavam" defaultValue={veiculo?.renavam ?? ""} />
        </div>

        <div className="space-y-2">
          <Label>Tipo *</Label>
          <Select name="tipo" defaultValue={veiculo?.tipo ?? "CARRO"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPO_VEICULO_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Combustível *</Label>
          <Select name="combustivel" defaultValue={veiculo?.combustivel ?? "FLEX"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMBUSTIVEL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quilometragemAtual">Quilometragem atual</Label>
          <Input
            id="quilometragemAtual"
            name="quilometragemAtual"
            type="number"
            defaultValue={veiculo?.quilometragemAtual ?? ""}
            placeholder="45230"
          />
          {errors.quilometragemAtual && (
            <p className="text-xs text-red-400">{errors.quilometragemAtual}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="motor">Motor (opcional)</Label>
          <Input id="motor" name="motor" defaultValue={veiculo?.motor ?? ""} placeholder="2.0" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chassi">Chassi (opcional)</Label>
          <Input id="chassi" name="chassi" defaultValue={veiculo?.chassi ?? ""} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" defaultValue={veiculo?.observacoes ?? ""} />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <SubmitButton isEdit={Boolean(veiculo)} />
      </div>
    </motion.form>
  );
}
