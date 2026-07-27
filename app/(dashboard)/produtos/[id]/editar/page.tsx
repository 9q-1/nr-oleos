import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProdutoForm } from "@/components/produtos/produto-form";
import { getProdutoById, getFornecedores } from "@/lib/data/produtos";
import { atualizarProdutoAction } from "../../actions";

export const metadata = { title: "Editar Produto" };

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [produto, fornecedores] = await Promise.all([getProdutoById(id), getFornecedores()]);
  if (!produto) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/produtos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para produtos
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar Produto</h1>
        <p className="text-sm text-muted-foreground">
          {produto.marca} {produto.linha} · {produto.codigo}
        </p>
      </div>
      <ProdutoForm produto={produto} fornecedores={fornecedores} action={atualizarProdutoAction.bind(null, id)} />
    </div>
  );
}
