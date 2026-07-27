"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/shared/image-upload";
import {
  CATEGORIA_PRODUTO_OPTIONS,
  CATEGORIAS_OLEO,
  TIPO_OLEO_OPTIONS,
  VISCOSIDADE_OPTIONS,
} from "@/lib/constants/produto";
import type { ProdutoActionState } from "@/app/(dashboard)/produtos/actions";
import type { Produto, Fornecedor, CategoriaProduto } from "@prisma/client";

interface ProdutoFormProps {
  produto?: Produto | null;
  fornecedores: Fornecedor[];
  action: (state: ProdutoActionState, formData: FormData) => Promise<ProdutoActionState>;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {isEdit ? "Salvar alterações" : "Cadastrar produto"}
    </Button>
  );
}

export function ProdutoForm({ produto, fornecedores, action }: ProdutoFormProps) {
  const [state, formAction] = useActionState<ProdutoActionState, FormData>(action, {});
  const [fotoUrl, setFotoUrl] = useState(produto?.fotoUrl ?? "");
  const [categoria, setCategoria] = useState(produto?.categoria ?? "OLEO_MOTOR");
  const errors = state.fieldErrors ?? {};
  const ehOleo = CATEGORIAS_OLEO.includes(categoria);

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
        <Label className="mb-2 block">Foto do produto</Label>
        <ImageUpload pasta="produtos" value={fotoUrl} onChange={setFotoUrl} label="Foto" shape="square" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input id="marca" name="marca" defaultValue={produto?.marca} placeholder="Mobil" />
          {errors.marca && <p className="text-xs text-red-400">{errors.marca}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linha">Linha</Label>
          <Input id="linha" name="linha" defaultValue={produto?.linha ?? ""} placeholder="Super 5W30" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="codigo">Código *</Label>
          <Input id="codigo" name="codigo" defaultValue={produto?.codigo} placeholder="OL-MOB-5W30" />
          {errors.codigo && <p className="text-xs text-red-400">{errors.codigo}</p>}
        </div>

        <div className="space-y-2">
          <Label>Categoria *</Label>
          <Select
            name="categoria"
            value={categoria}
            onValueChange={(value) => setCategoria(value as CategoriaProduto)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIA_PRODUTO_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {ehOleo && (
          <>
            <div className="space-y-2">
              <Label>Viscosidade</Label>
              <Select name="viscosidade" defaultValue={produto?.viscosidade ?? undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {VISCOSIDADE_OPTIONS.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select name="tipoOleo" defaultValue={produto?.tipoOleo ?? undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_OLEO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade em estoque *</Label>
          <Input id="quantidade" name="quantidade" type="number" defaultValue={produto?.quantidade ?? 0} />
          {errors.quantidade && <p className="text-xs text-red-400">{errors.quantidade}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="estoqueMinimo">Estoque mínimo *</Label>
          <Input
            id="estoqueMinimo"
            name="estoqueMinimo"
            type="number"
            defaultValue={produto?.estoqueMinimo ?? 5}
          />
          {errors.estoqueMinimo && <p className="text-xs text-red-400">{errors.estoqueMinimo}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="precoCusto">Preço de custo (R$) *</Label>
          <Input
            id="precoCusto"
            name="precoCusto"
            type="number"
            step="0.01"
            defaultValue={produto ? Number(produto.precoCusto) : ""}
          />
          {errors.precoCusto && <p className="text-xs text-red-400">{errors.precoCusto}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="precoVenda">Preço de venda (R$) *</Label>
          <Input
            id="precoVenda"
            name="precoVenda"
            type="number"
            step="0.01"
            defaultValue={produto ? Number(produto.precoVenda) : ""}
          />
          {errors.precoVenda && <p className="text-xs text-red-400">{errors.precoVenda}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Fornecedor</Label>
          <Select name="fornecedorId" defaultValue={produto?.fornecedorId ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {fornecedores.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <SubmitButton isEdit={Boolean(produto)} />
      </div>
    </motion.form>
  );
}
