"use client";

// ============================================================================
// FontSources — lista dos 10 sites de fonts com filtro
// ============================================================================

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Search, Star } from "lucide-react";
import { FONT_SOURCES, FONT_FILTER_SUGGESTIONS } from "@/lib/font-sources";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FontSources() {
  const [filter, setFilter] = useState("");

  const filtrados = useMemo(() => {
    if (!filter.trim()) return FONT_SOURCES;
    const q = filter.toLowerCase();
    return FONT_SOURCES.filter((s) => {
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.filters.some((f) => f.includes(q))
      );
    });
  }, [filter]);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold">10 Font Sources</h4>
          <p className="text-[11px] text-muted-foreground">
            Os melhores sites para encontrar fonts. Filtra por tipo, licença ou uso.
          </p>
        </div>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          {filtrados.length} / {FONT_SOURCES.length}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtra por tipo (gratuito, premium, variable, display...)"
          className="h-8 border-border bg-background/50 pl-8 text-xs"
        />
      </div>

      {/* Filter suggestions */}
      <div className="flex flex-wrap gap-1">
        {FONT_FILTER_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(filter === s ? "" : s)}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] transition-colors",
              filter === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Lista de sources */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {filtrados.map((src, i) => (
          <motion.a
            key={src.id}
            href={src.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group flex items-start gap-3 rounded-xl border border-border bg-background/40 p-3 transition-all hover:border-primary/40 hover:bg-primary/5"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold">{src.name}</span>
                {src.badge && (
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-500/10 px-1 py-0 text-[9px] font-semibold text-amber-500">
                    <Star className="h-2 w-2" />
                    {src.badge}
                  </span>
                )}
                <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                {src.description}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span
                  className={cn(
                    "rounded px-1 py-0.5 text-[9px] font-semibold uppercase",
                    src.license === "Free" && "bg-emerald-500/10 text-emerald-500",
                    src.license === "Free + Paid" && "bg-amber-500/10 text-amber-500",
                    src.license === "Paid" && "bg-rose-500/10 text-rose-500",
                    src.license === "Open Source" && "bg-blue-500/10 text-blue-500"
                  )}
                >
                  {src.license}
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {filtrados.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          Nenhuma source encontrada para "{filter}".
        </div>
      )}
    </div>
  );
}
