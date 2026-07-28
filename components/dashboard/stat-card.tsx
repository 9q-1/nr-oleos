"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  hint?: string;
  tone?: "default" | "warning" | "danger" | "success";
  index?: number;
}

const TONES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-brand-yellow bg-brand-yellow/10",
  warning: "text-amber-400 bg-amber-500/10",
  danger: "text-red-400 bg-red-500/10",
  success: "text-emerald-400 bg-emerald-500/10",
};

export function StatCard({ label, value, icon, hint, tone = "default", index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className="glass-card hover-lift flex items-start justify-between p-5"
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-3xl font-bold tabular-nums text-white">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", TONES[tone])}>
        {icon}
      </span>
    </motion.div>
  );
}
