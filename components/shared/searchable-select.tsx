"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableSelectProps<T> {
  name: string;
  defaultValue?: T | null;
  locked?: boolean;
  error?: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
  fetchOptions: (query: string) => Promise<T[]>;
  getId: (item: T) => string;
  renderOption: (item: T) => React.ReactNode;
  renderSelected: (item: T) => React.ReactNode;
  renderLocked: (item: T) => React.ReactNode;
}

export function SearchableSelect<T>({
  name,
  defaultValue = null,
  locked = false,
  error,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  fetchOptions,
  getId,
  renderOption,
  renderSelected,
  renderLocked,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<T[]>([]);
  const [selected, setSelected] = useState<T | null>(defaultValue);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    startTransition(async () => {
      const data = await fetchOptions(query);
      setOptions(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  if (locked && selected) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm">
        {renderLocked(selected)}
        <input type="hidden" name={name} value={getId(selected)} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-white/[0.03] px-3.5 py-2 text-sm transition-colors",
          error ? "border-red-500/60" : "border-input"
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground/60")}>
          {selected ? renderSelected(selected) : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
      </button>
      <input type="hidden" name={name} value={selected ? getId(selected) : ""} />

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-popover shadow-glass"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <div className="max-h-64 overflow-y-auto p-1.5">
            {options.length === 0 && !isPending && (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">{emptyLabel}</p>
            )}
            {options.map((item) => (
              <button
                key={getId(item)}
                type="button"
                role="option"
                aria-selected={selected ? getId(selected) === getId(item) : false}
                onClick={() => {
                  setSelected(item);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5"
              >
                <span className="min-w-0 truncate">{renderOption(item)}</span>
                {selected && getId(selected) === getId(item) && (
                  <Check className="h-4 w-4 shrink-0 text-brand-yellow" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
