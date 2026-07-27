"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { VeiculoSelect, type VeiculoOption } from "./veiculo-select";
import { ProdutosPicker, type ItemLinha } from "./produtos-picker";
import { OutrosServicosPicker, type OutroServicoLinha } from "./outros-servicos-picker";
import { RadiadorFields } from "./radiador-fields";
import { ProximaTrocaFields } from "./proxima-troca-fields";
import { FORMA_PAGAMENTO_OPTIONS } from "@/lib/constants/produto";
import { formatCurrency } from "@/lib/utils";
import type { ServicoActionState } from "@/app/(dashboard)/servicos/actions";

export interface ServicoFormInitialValues {
  data?: string;
  hora?: string;
  quilometragem?: number;
  valorMaoDeObra?: number;
  desconto?: number;
  formaPagamento?: string;
  observacoes?: string;
  itens?: ItemLinha[];
  radiadorAtivo?: boolean;
  radiadorTipo?: string;
  radiadorPreco?: number;
  outrosServicos?: OutroServicoLinha[];
  proximaTrocaTipo?: "QUILOMETRAGEM" | "DATA";
  proximaTrocaIntervaloKm?: number;
  proximaTrocaIntervaloMeses?: number;
}

interface ServicoFormProps {
  veiculoInicial?: VeiculoOption | null;
  bloquearVeiculo?: boolean;
  valoresIniciais?: ServicoFormInitialValues;
  isEdit?: boolean;
  action: (state: ServicoActionState, formData: FormData) => Promise<ServicoActionState>;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {isEdit ? "Salvar alterações" : "Finalizar atendimento"}
    </Button>
  );
}

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

function agoraHHMM() {
  return new Date().toTimeString().slice(0, 5);
}

export function ServicoForm({
  veiculoInicial,
  bloquearVeiculo,
  valoresIniciais,
  isEdit = false,
  action,
}: ServicoFormProps) {
  const [state, formAction] = useActionState<ServicoActionState, FormData>(action, {});
  const errors = state.fieldErrors ?? {};

  const [itens, setItens] = useState<ItemLinha[]>(valoresIniciais?.itens ?? []);
  const [outrosServicos, setOutrosServicos] = useState<OutroServicoLinha[]>(
    valoresIniciais?.outrosServicos ?? []
  );
  const [radiadorAtivo, setRadiadorAtivo] = useState(valoresIniciais?.radiadorAtivo ?? false);
  const [radiadorTipo, setRadiadorTipo] = useState(valoresIniciais?.radiadorTipo ?? "LIMPEZA");
  const [radiadorPreco, setRadiadorPreco] = useState(valoresIniciais?.radiadorPreco ?? 0);
  const [proximaTrocaTipo, setProximaTrocaTipo] = useState<"QUILOMETRAGEM" | "DATA">(
    valoresIniciais?.proximaTrocaTipo ?? "QUILOMETRAGEM"
  );
  const [intervaloKm, setIntervaloKm] = useState(valoresIniciais?.proximaTrocaIntervaloKm ?? 5000);
  const [intervaloMeses, setIntervaloMeses] = useState(valoresIniciais?.proximaTrocaIntervaloMeses ?? 6);

  const totalProdutos = itens.reduce((sum, i) => sum + i.quantidade * i.precoUnitario, 0);
  const totalOutros = outrosServicos.reduce((sum, s) => sum + s.preco, 0) + (radiadorAtivo ? radiadorPreco : 0);

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      action={formAction}
      className="space-y-5"
    >
      <div className="glass-card space-y-5 p-6 lg:p-8">
        <div className="space-y-2">
          <Label>Cliente e veículo *</Label>
          <VeiculoSelect defaultValue={veiculoInicial ?? null} locked={Boolean(bloquearVeiculo)} error={errors.veiculoId} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Input id="data" name="data" type="date" defaultValue={valoresIniciais?.data ?? hojeISO()} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hora">Hora *</Label>
            <Input id="hora" name="hora" type="time" defaultValue={valoresIniciais?.hora ?? agoraHHMM()} />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="quilometragem">Km atual *</Label>
            <Input
              id="quilometragem"
              name="quilometragem"
              type="number"
              defaultValue={valoresIniciais?.quilometragem}
              placeholder="45230"
            />
            {errors.quilometragem && <p className="text-xs text-red-400">{errors.quilometragem}</p>}
          </div>
          <div className="space-y-2">
            <Label>Pagamento *</Label>
            <Select name="formaPagamento" defaultValue={valoresIniciais?.formaPagamento ?? "PIX"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMA_PAGAMENTO_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="glass-card space-y-4 p-6 lg:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Produtos utilizados (óleo, filtros, fluidos...)
        </h2>
        <p className="text-xs text-muted-foreground">
          Marca, viscosidade e tipo do óleo, e marca/código dos filtros são preenchidos automaticamente a
          partir do produto selecionado no estoque.
        </p>
        <ProdutosPicker itens={itens} onChange={setItens} />
      </div>

      <div className="glass-card space-y-4 p-6 lg:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Radiador</h2>
        <RadiadorFields
          ativo={radiadorAtivo}
          onToggle={setRadiadorAtivo}
          tipo={radiadorTipo}
          onTipoChange={setRadiadorTipo}
          preco={radiadorPreco}
          onPrecoChange={setRadiadorPreco}
        />
      </div>

      <div className="glass-card space-y-4 p-6 lg:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Outros serviços</h2>
        <OutrosServicosPicker selecionados={outrosServicos} onChange={setOutrosServicos} />
      </div>

      <div className="glass-card space-y-4 p-6 lg:p-8">
        <ProximaTrocaFields
          tipo={proximaTrocaTipo}
          onTipoChange={setProximaTrocaTipo}
          intervaloKm={intervaloKm}
          onIntervaloKmChange={setIntervaloKm}
          intervaloMeses={intervaloMeses}
          onIntervaloMesesChange={setIntervaloMeses}
        />
      </div>

      <div className="glass-card space-y-4 p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="valorMaoDeObra">Mão de obra (R$) *</Label>
            <Input
              id="valorMaoDeObra"
              name="valorMaoDeObra"
              type="number"
              step="0.01"
              defaultValue={valoresIniciais?.valorMaoDeObra ?? 0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desconto">Desconto (R$)</Label>
            <Input
              id="desconto"
              name="desconto"
              type="number"
              step="0.01"
              defaultValue={valoresIniciais?.desconto ?? 0}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" name="observacoes" defaultValue={valoresIniciais?.observacoes ?? ""} />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-brand-yellow/20 bg-brand-yellow/5 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Produtos: {formatCurrency(totalProdutos)} · Outros: {formatCurrency(totalOutros)}
          </span>
          <span className="text-lg font-bold text-brand-yellow">
            Estimado: {formatCurrency(totalProdutos + totalOutros)}
          </span>
        </div>

        {state.error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {state.error}
          </p>
        )}

        <div className="flex justify-end">
          <SubmitButton isEdit={isEdit} />
        </div>
      </div>
    </motion.form>
  );
}
