import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProdutoForm } from "@/components/produtos/produto-form";
import { getFornecedores } from "@/lib/data/produtos";
import { criarProdutoAction } from "../actions";

export const metadata = { title: "Novo Produto" };

export default async function NovoProdutoPage() {
  const fornecedores = await getFornecedores();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/produtos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para produtos
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Novo Produto</h1>
        <p className="text-sm text-muted-foreground">Cadastre um item do catálogo.</p>
      </div>
      <ProdutoForm fornecedores={fornecedores} action={criarProdutoAction} />
    </div>
  );
}
