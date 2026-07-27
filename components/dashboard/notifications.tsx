"use client";

import Link from "next/link";
import { Bell, AlertTriangle, Clock, PackageX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { NotificationItem } from "@/lib/data/notifications";

const ICONS: Record<NotificationItem["tipo"], typeof Bell> = {
  vencida: AlertTriangle,
  hoje: Clock,
  estoque: PackageX,
};

const COLORS: Record<NotificationItem["tipo"], string> = {
  vencida: "text-red-400 bg-red-500/10",
  hoje: "text-amber-400 bg-amber-500/10",
  estoque: "text-brand-yellow bg-brand-yellow/10",
};

export function Notifications({ items }: { items: NotificationItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
          <Bell className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-yellow opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-yellow" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            Tudo em dia por aqui.
          </p>
        ) : (
          <div className="max-h-80 space-y-0.5 overflow-y-auto">
            {items.map((item) => {
              const Icon = ICONS[item.tipo];
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-start gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-colors hover:bg-white/5"
                >
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${COLORS[item.tipo]}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground">{item.titulo}</span>
                    <span className="block truncate text-xs text-muted-foreground">{item.descricao}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
