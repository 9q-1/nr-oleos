"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Car } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ClienteCardProps {
  id: string;
  nome: string;
  telefone: string;
  cidade?: string | null;
  fotoUrl?: string | null;
  totalVeiculos: number;
  index?: number;
}

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export function ClienteCard({
  id,
  nome,
  telefone,
  cidade,
  fotoUrl,
  totalVeiculos,
  index = 0,
}: ClienteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link href={`/clientes/${id}`} className="glass-card hover-lift flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          {fotoUrl && <AvatarImage src={fotoUrl} alt={nome} />}
          <AvatarFallback>{iniciais(nome)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{nome}</p>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Phone className="h-3 w-3" /> {telefone} {cidade ? `· ${cidade}` : ""}
          </p>
        </div>
        <Badge variant="muted" className="shrink-0">
          <Car className="h-3 w-3" /> {totalVeiculos}
        </Badge>
      </Link>
    </motion.div>
  );
}
