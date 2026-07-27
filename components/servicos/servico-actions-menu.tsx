"use client";

import Link from "next/link";
import { MoreVertical, Pencil, Copy, FileText, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface ServicoActionsMenuProps {
  servicoId: string;
  veiculoId: string;
  clienteNome: string;
  clienteTelefone: string;
  veiculoDescricao: string;
  data: Date;
  proximaTrocaTexto?: string | null;
}

export function ServicoActionsMenu({
  servicoId,
  veiculoId,
  clienteNome,
  clienteTelefone,
  veiculoDescricao,
  data,
  proximaTrocaTexto,
}: ServicoActionsMenuProps) {
  const mensagem = [
    `Olá ${clienteNome.split(" ")[0]}!`,
    ``,
    `Aqui está o resumo do seu atendimento na NR Lubrificantes:`,
    ``,
    `Veículo: ${veiculoDescricao}`,
    `Data: ${formatDate(data)}`,
    proximaTrocaTexto ? `Próxima troca: ${proximaTrocaTexto}` : null,
    ``,
    `Obrigado pela confiança!`,
    `NR Lubrificantes — Super Troca de Óleo`,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappHref = `https://wa.me/55${clienteTelefone.replace(/\D/g, "")}?text=${encodeURIComponent(
    mensagem
  )}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Mais ações">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href={`/servicos/${servicoId}/editar`}>
            <Pencil className="h-4 w-4" /> Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/servicos/novo?veiculoId=${veiculoId}&duplicarDe=${servicoId}`}>
            <Copy className="h-4 w-4" /> Duplicar serviço
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/servicos/${servicoId}/comprovante`} target="_blank">
            <FileText className="h-4 w-4" /> Gerar PDF
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            <MessageCircle className="h-4 w-4" /> Abrir WhatsApp
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
