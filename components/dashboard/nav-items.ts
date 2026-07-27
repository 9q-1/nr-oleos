import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Package,
  Boxes,
  Wallet,
  BarChart3,
  Settings,
  BellRing,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Veículos", href: "/veiculos", icon: Car },
  { label: "Serviços", href: "/servicos", icon: Wrench },
  { label: "Lembretes", href: "/lembretes", icon: BellRing },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Estoque", href: "/estoque", icon: Boxes },
  { label: "Financeiro", href: "/financeiro", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];
