"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CATALOG, type Preset } from "@/lib/catalog";
import { LayoutTemplate, Check, Filter } from "lucide-react";

interface PresetSelectorProps {
  activePreset: string | null;
  onApply: (preset: Preset) => void;
}

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "portfolio", label: "Portfolio" },
  { id: "agency", label: "Agency" },
  { id: "saas", label: "SaaS" },
  { id: "commerce", label: "Commerce" },
  { id: "content", label: "Content" },
  { id: "local", label: "Local" },
  { id: "product", label: "Product" },
  { id: "experimental", label: "Flagship" },
] as const;

const BADGE_COLORS: Record<string, string> = {
  awwwards: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  conversion: "bg-green-500/20 text-green-400 border-green-500/30",
  speed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  enterprise: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  flagship: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export function PresetSelector({ activePreset, onApply }: PresetSelectorProps) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return CATALOG.presets;
    return CATALOG.presets.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Robustos · Resultados de Excelência Reais</h3>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} presets · 1 clique</span>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-1">
        <Filter className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilter(cat.id)}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
              filter === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de presets */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((preset) => {
          const isActive = activePreset === preset.id;
          const tier = CATALOG.tiers.find((t) => t.id === preset.execution.tier);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApply(preset)}
              className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border bg-card/30 hover:border-primary/50 hover:bg-card/50"
              }`}
            >
              {isActive && (
                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}

              {/* Badge + Tier */}
              <div className="mb-1.5 flex items-center gap-1.5">
                {preset.badge && (
                  <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase ${BADGE_COLORS[preset.badge] ?? ""}`}>
                    {preset.badge}
                  </span>
                )}
                {tier && (
                  <span className="text-[10px] text-muted-foreground">
                    {tier.icon} {tier.name} · {tier.team_size}fn
                  </span>
                )}
              </div>

              {/* Nome + tagline */}
              <div className="text-xs font-bold leading-tight">{preset.name}</div>
              <div className="mt-0.5 text-[10px] leading-snug text-muted-foreground line-clamp-2">
                {preset.tagline}
              </div>

              {/* Stats */}
              <div className="mt-2 flex flex-wrap gap-1 text-[9px] text-muted-foreground">
                <span className="rounded bg-muted px-1 py-0.5">{preset.sections.length} sec</span>
                <span className="rounded bg-muted px-1 py-0.5">{preset.effects.length} fx</span>
                <span className="rounded bg-muted px-1 py-0.5">{preset.skills.length} sk</span>
                <span className="rounded bg-muted px-1 py-0.5">{preset.mcps.length} mcp</span>
                <span className="rounded bg-muted px-1 py-0.5">Perf≥{preset.excellence.lighthouse_perf}</span>
              </div>

              {/* Anti-slop hint */}
              {preset.anti_slop.length > 0 && (
                <div className="mt-1.5 text-[9px] italic text-muted-foreground/70 line-clamp-1">
                  ⚠ {preset.anti_slop[0]}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
