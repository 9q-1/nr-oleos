"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TIPO_VEICULO_LABELS, TIPO_VEICULO_ICONS } from "@/lib/constants/veiculo";
import { formatDate } from "@/lib/utils";
import type { TipoVeiculo } from "@prisma/client";

interface VeiculoCardProps {
  id: string;
  marca: string;
  modelo: string;
  placa: string;
  tipo: TipoVeiculo;
  cor: string;
  clienteNome?: string;
  fotoUrl?: string | null;
  trocaVencida?: boolean;
  proximaTrocaData?: Date | null;
  index?: number;
}

export function VeiculoCard({
  id,
  marca,
  modelo,
  placa,
  tipo,
  cor,
  clienteNome,
  fotoUrl,
  trocaVencida,
  proximaTrocaData,
  index = 0,
}: VeiculoCardProps) {
  const Icon = TIPO_VEICULO_ICONS[tipo] ?? TIPO_VEICULO_ICONS.CARRO;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link href={`/veiculos/${id}`} className="glass-card hover-lift flex items-center gap-4 p-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt={modelo} className="h-full w-full object-cover" />
          ) : (
            <Icon className="h-6 w-6 text-brand-yellow" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">
            {marca} {modelo}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {placa} · {cor} {clienteNome ? `· ${clienteNome}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant="muted">{TIPO_VEICULO_LABELS[tipo] ?? tipo}</Badge>
          {trocaVencida && (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3" /> Vencida
            </Badge>
          )}
          {!trocaVencida && proximaTrocaData && (
            <Badge variant="warning">{formatDate(proximaTrocaData)}</Badge>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
