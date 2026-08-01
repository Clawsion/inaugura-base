"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATALOG, type Preset } from "@/lib/catalog";
import { LayoutTemplate, Check, ChevronDown, Expand, Minimize } from "lucide-react";

interface PresetSelectorProps {
  activePreset: string | null;
  onApply: (preset: Preset) => void;
}

// Categorias organizadas por "estilo/tipo" (não alfabético — por afinidade de uso)
const CATEGORY_GROUPS = [
  { id: "all", label: "Todos", icon: "🗂️" },
  { id: "portfolio", label: "Portfolio", icon: "📁" },
  { id: "agency", label: "Agency", icon: "🏢" },
  { id: "saas", label: "SaaS", icon: "💻" },
  { id: "commerce", label: "Commerce", icon: "🛒" },
  { id: "content", label: "Content", icon: "📰" },
  { id: "local", label: "Local", icon: "📍" },
  { id: "product", label: "Product", icon: "🚀" },
  { id: "experimental", label: "Flagship", icon: "🏆" },
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
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(["all"]));
  const [allExpanded, setAllExpanded] = useState(true);

  const filtered = useMemo(() => {
    if (filter === "all") return CATALOG.presets;
    return CATALOG.presets.filter((p) => p.category === filter);
  }, [filter]);

  // Agrupa por categoria quando "all" está selecionado
  const grouped = useMemo(() => {
    const map = new Map<string, Preset[]>();
    CATALOG.presets.forEach((p) => {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    });
    return map;
  }, []);

  const toggleCat = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const expandAll = () => {
    setAllExpanded(true);
    setExpandedCats(new Set(["all", ...CATEGORY_GROUPS.map((c) => c.id)]));
  };

  const collapseAll = () => {
    setAllExpanded(false);
    setExpandedCats(new Set());
  };

  const setFilterAndExpand = (cat: string) => {
    setFilter(cat);
    if (cat === "all") {
      // Em "Todos", expande todas as categorias por defeito
      setExpandedCats(new Set(["all", ...CATEGORY_GROUPS.map((c) => c.id)]));
      setAllExpanded(true);
    } else {
      // Numa categoria específica, mostra tudo dessa categoria
      setExpandedCats(new Set([cat]));
      setAllExpanded(false);
    }
  };

  const renderPresetCard = (preset: Preset) => {
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Robustos · Resultados de Excelência Reais</h3>
        <span className="ml-auto text-xs text-muted-foreground">{CATALOG.presets.length} presets · 1 clique</span>
      </div>

      {/* Filtros + expand/collapse controls */}
      <div className="flex flex-wrap items-center gap-1">
        {CATEGORY_GROUPS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilterAndExpand(cat.id)}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-all ${
              filter === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}

        {/* Expand/Collapse all */}
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={expandAll}
            className="rounded-md px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Expandir todos"
          >
            <Expand className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-md px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Minimizar todos"
          >
            <Minimize className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Render condicional: "Todos" = agrupado por categoria colapsável | categoria específica = grid direto */}
      {filter === "all" ? (
        <div className="space-y-2">
          {CATEGORY_GROUPS.filter((c) => c.id !== "all").map((cat) => {
            const items = grouped.get(cat.id) ?? [];
            if (items.length === 0) return null;
            const isExpanded = expandedCats.has(cat.id);
            const activeInCat = items.filter((p) => p.id === activePreset).length;

            return (
              <div key={cat.id} className="overflow-hidden rounded-xl border border-border bg-card/20">
                <button
                  type="button"
                  onClick={() => toggleCat(cat.id)}
                  className="flex w-full items-center justify-between gap-2 p-2.5 hover:bg-accent/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-sm font-semibold">{cat.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {items.length} presets
                    </span>
                    {activeInCat > 0 && (
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] text-primary">
                        {activeInCat} ativo{activeInCat > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border p-2"
                    >
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map(renderPresetCard)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(renderPresetCard)}
        </div>
      )}
    </motion.div>
  );
}
