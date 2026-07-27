"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserPlus,
  CarFront,
  Wrench,
  Package,
  Boxes,
  BarChart3,
  Settings,
} from "lucide-react";

const actions = [
  { label: "Novo Cliente", href: "/clientes/novo", icon: UserPlus },
  { label: "Novo Veículo", href: "/veiculos/novo", icon: CarFront },
  { label: "Novo Serviço", href: "/servicos/novo", icon: Wrench },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Estoque", href: "/estoque", icon: Boxes },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <Link
              href={action.href}
              className="hover-lift glass-card flex flex-col items-center gap-2 px-3 py-4 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow/10 text-brand-yellow">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
