import { notFound } from "next/navigation";
import { Droplet } from "lucide-react";
import { ImprimirButton } from "@/components/servicos/imprimir-button";
import { getServicoById } from "@/lib/data/servicos";
import { CATEGORIA_PRODUTO_LABELS, FORMA_PAGAMENTO_LABELS } from "@/lib/constants/produto";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Comprovante" };

export default async function ComprovantePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const servico = await getServicoById(id);
  if (!servico) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6 print:max-w-none">
      <div className="flex justify-end print:hidden">
        <ImprimirButton />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white p-8 text-black print:border-none print:p-0 print:shadow-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
              <Droplet className="h-5 w-5 text-[#FFC107]" fill="currentColor" />
            </div>
            <div>
              <p className="font-bold">NR Lubrificantes</p>
              <p className="text-xs text-gray-500">Super Troca de Óleo</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>Comprovante de Serviço</p>
            <p>{formatDate(servico.data)} · {servico.hora}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase text-gray-400">Cliente</p>
            <p className="font-medium">{servico.cliente.nome}</p>
            <p className="text-gray-500">{servico.cliente.telefone}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400">Veículo</p>
            <p className="font-medium">
              {servico.veiculo.marca} {servico.veiculo.modelo} — {servico.veiculo.placa}
            </p>
            <p className="text-gray-500">{servico.quilometragem.toLocaleString("pt-BR")} km</p>
          </div>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs uppercase text-gray-400">
              <th className="py-2">Item</th>
              <th className="py-2 text-right">Qtd.</th>
              <th className="py-2 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {servico.itensProduto.map((item) => (
              <tr key={item.id} className="border-b border-black/5">
                <td className="py-2">
                  {item.produto.marca} {item.produto.linha ?? ""}
                  <span className="block text-xs text-gray-400">
                    {CATEGORIA_PRODUTO_LABELS[item.produto.categoria]}
                  </span>
                </td>
                <td className="py-2 text-right">{Number(item.quantidade)}</td>
                <td className="py-2 text-right">
                  {formatCurrency(Number(item.quantidade) * Number(item.precoUnitario))}
                </td>
              </tr>
            ))}
            {servico.servicoRadiador && (
              <tr className="border-b border-black/5">
                <td className="py-2">Serviço de radiador</td>
                <td className="py-2 text-right">1</td>
                <td className="py-2 text-right">{formatCurrency(Number(servico.servicoRadiador.preco))}</td>
              </tr>
            )}
            {servico.outrosServicos.map((o) => (
              <tr key={o.id} className="border-b border-black/5">
                <td className="py-2">{o.descricao ?? o.tipo}</td>
                <td className="py-2 text-right">1</td>
                <td className="py-2 text-right">{formatCurrency(Number(o.preco))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex flex-col items-end gap-1 text-sm">
          <p className="text-gray-500">Mão de obra: {formatCurrency(Number(servico.valorMaoDeObra))}</p>
          <p className="text-gray-500">Desconto: -{formatCurrency(Number(servico.desconto))}</p>
          <p className="text-gray-500">Pagamento: {FORMA_PAGAMENTO_LABELS[servico.formaPagamento]}</p>
          <p className="mt-1 text-lg font-bold">Total: {formatCurrency(Number(servico.valorTotal))}</p>
        </div>

        {servico.observacoes && (
          <p className="mt-4 border-t border-black/10 pt-3 text-xs text-gray-500">{servico.observacoes}</p>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">Obrigado pela preferência!</p>
      </div>
    </div>
  );
}
