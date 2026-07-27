"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, User, Car, Package, CornerDownLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { buscarGlobalAction } from "@/app/actions/search";
import type { SearchResult } from "@/lib/data/search";
import { cn } from "@/lib/utils";

const ICONS: Record<SearchResult["tipo"], typeof User> = {
  cliente: User,
  veiculo: Car,
  produto: Package,
};

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      startTransition(async () => {
        const data = await buscarGlobalAction(query);
        setResults(data);
      });
    }, 250);
    return () => clearTimeout(timeout);
  }, [query, open]);

  function goTo(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-white/20 hover:bg-white/[0.06]"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Pesquisar cliente, placa, produto...</span>
        <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome, telefone, placa, modelo ou código do produto"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            />
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {query.trim().length >= 2 && results.length === 0 && !isPending && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Nenhum resultado para &ldquo;{query}&rdquo;
              </p>
            )}

            {results.map((r) => {
              const Icon = ICONS[r.tipo];
              return (
                <button
                  key={`${r.tipo}-${r.id}`}
                  onClick={() => goTo(r.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/5"
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-yellow/10 text-brand-yellow">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">{r.titulo}</span>
                    <span className="block truncate text-xs text-muted-foreground">{r.subtitulo}</span>
                  </span>
                  <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                </button>
              );
            })}

            {query.trim().length < 2 && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Digite ao menos 2 caracteres para pesquisar em todo o sistema.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
