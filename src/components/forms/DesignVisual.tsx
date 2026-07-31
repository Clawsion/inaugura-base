"use client";

// ============================================================================
// DesignVisual — secção de Design Visual com modos e accordion por categoria
// ============================================================================
// Mesmo sistema de SkillsSelector: Recomendada/Alternativa/Opcional/Manual/Off
// Layout: accordion por categoria → expande com botões pequenos em grid
// ============================================================================

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Pin, X, Palette, ChevronDown, ChevronRight } from "lucide-react";
import {
  DESIGN_VISUAL_CATALOG, getDesignVisualForNicho,
  type DesignVisualOption, type SkillMode,
} from "@/lib/design-visual-catalog";
import { detectarNicho } from "@/lib/perfect-combo";
import { cn } from "@/lib/utils";

interface DesignVisualProps {
  briefing: string;
  nicho: string;
  selectedOptions: string[];
  onChange: (options: string[]) => void;
}

const MODE_LABELS: Record<SkillMode, string> = {
  recomendada: "Recomendada",
  alternativa: "Alternativa",
  opcional: "Opcional",
  manual: "Manual",
  off: "Off",
};

const MODE_COLORS: Record<SkillMode, string> = {
  recomendada: "border-emerald-500 bg-emerald-500/10 text-emerald-500",
  alternativa: "border-blue-500 bg-blue-500/10 text-blue-500",
  opcional: "border-amber-500 bg-amber-500/10 text-amber-500",
  manual: "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500",
  off: "border-border bg-card/40 text-muted-foreground",
};

const MODE_DOT: Record<SkillMode, string> = {
  recomendada: "bg-emerald-500",
  alternativa: "bg-blue-500",
  opcional: "bg-amber-500",
  manual: "bg-fuchsia-500",
  off: "bg-zinc-500",
};

export function DesignVisual({
  briefing, nicho, selectedOptions, onChange,
}: DesignVisualProps) {
  const [modes, setModes] = useState<Record<string, SkillMode>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const prevNicho = useRef<string | null>(null);
  const nichoDetetado = nicho || (briefing ? detectarNicho(briefing) : null);
  // Auto-aplicar quando nicho muda (com guarda contra loops)
  useEffect(() => {
    if (!nichoDetetado || prevNicho.current === nichoDetetado) return;
    prevNicho.current = nichoDetetado;
    const recommended = getDesignVisualForNicho(nichoDetetado);
    const newModes: Record<string, SkillMode> = {};
    for (const opt of DESIGN_VISUAL_CATALOG) {
      const isRec = recommended.some((r) => r.id === opt.id);
      if (isRec) { newModes[opt.id] = "recomendada"; }
      else if (opt.modoDefault === "alternativa") { newModes[opt.id] = "alternativa"; }
      else if (opt.modoDefault === "opcional") { newModes[opt.id] = "opcional"; }
      else { newModes[opt.id] = "off"; }
    }
    setModes(newModes);
    const catsToExpand = new Set<string>();
    for (const opt of DESIGN_VISUAL_CATALOG) {
      if (newModes[opt.id] === "recomendada") catsToExpand.add(opt.categoria);
    }
    setExpandedCats(catsToExpand);
  }, [nichoDetetado]);




  const toggleMode = (id: string) => {
    setModes((prev) => {
      const current = prev[id] ?? "off";
      const cycle: SkillMode[] = ["off", "recomendada", "alternativa", "opcional", "manual"];
      const idx = cycle.indexOf(current);
      const next = cycle[(idx + 1) % cycle.length];
      return { ...prev, [id]: next };
    });
  };

  const setAllOff = () => {
    const cleared: Record<string, SkillMode> = {};
    for (const o of DESIGN_VISUAL_CATALOG) cleared[o.id] = "off";
    setModes(cleared);
    onChange([]);
  };

  const setAllRecommended = () => {
    if (!nichoDetetado) return;
    const recommended = getDesignVisualForNicho(nichoDetetado);
    const newModes: Record<string, SkillMode> = {};
    for (const opt of DESIGN_VISUAL_CATALOG) {
      const isRec = recommended.some((r) => r.id === opt.id);
      newModes[opt.id] = isRec ? "recomendada" : "off";
    }
    setModes(newModes);
    const activeIds = Object.entries(newModes).filter(([, m]) => m !== "off").map(([k]) => k);
    onChange(activeIds);
  };

  const toggleCat = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const activeInfo = pinned ?? hovered;
  const activeItem = activeInfo ? DESIGN_VISUAL_CATALOG.find((o) => o.id === activeInfo) : null;

  const byCategory = useMemo(() => {
    const groups: Record<string, DesignVisualOption[]> = {};
    for (const opt of DESIGN_VISUAL_CATALOG) {
      (groups[opt.categoria] ||= []).push(opt);
    }
    return groups;
  }, []);

  const activeCount = Object.values(modes).filter((m) => m !== "off").length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold">
            <Palette className="h-3.5 w-3.5 text-primary" />
            Design Visual
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Estética, patterns, textures, effects. Clica numa categoria para expandir.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {activeCount} ativas
          </span>
          <button
            type="button"
            onClick={setAllRecommended}
            disabled={!nichoDetetado}
            className="rounded-md border border-primary/40 px-2 py-0.5 text-[9px] font-medium text-primary hover:bg-primary/10 disabled:opacity-40"
          >
            Auto
          </button>
          <button
            type="button"
            onClick={setAllOff}
            className="rounded-md border border-border px-2 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-1.5">
        {(["recomendada", "alternativa", "opcional", "manual", "off"] as SkillMode[]).map((mode) => (
          <div
            key={mode}
            className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium", MODE_COLORS[mode])}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", MODE_DOT[mode])} />
            {MODE_LABELS[mode]}
          </div>
        ))}
      </div>

      {/* Accordion por categoria */}
      <div className="space-y-1">
        {Object.entries(byCategory).map(([cat, items]) => {
          const isExpanded = expandedCats.has(cat);
          const activeInCat = items.filter((i) => modes[i.id] !== "off").length;
          return (
            <div key={cat} className="rounded-lg border border-border overflow-hidden">
              {/* Category header (click to expand) */}
              <button
                type="button"
                onClick={() => toggleCat(cat)}
                className="flex w-full items-center justify-between p-2 text-left transition-colors hover:bg-card/50"
              >
                <div className="flex items-center gap-1.5">
                  {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {cat}
                  </span>
                </div>
                <span className={cn(
                  "rounded-full px-1.5 py-0 text-[8px] font-bold",
                  activeInCat > 0 ? "bg-primary/15 text-primary" : "bg-card/50 text-muted-foreground"
                )}>
                  {activeInCat}/{items.length}
                </span>
              </button>

              {/* Expanded content: grid de botões pequenos */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-1 p-2 pt-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                      {items.map((item) => {
                        const mode = modes[item.id] ?? "off";
                        const isHovered = hovered === item.id;
                        const isPinned = pinned === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              toggleMode(item.id);
                              setPinned((p) => (p === item.id ? null : item.id));
                            }}
                            onMouseEnter={() => setHovered(item.id)}
                            onMouseLeave={() => setHovered(null)}
                            className={cn(
                              "relative flex flex-col items-center gap-0.5 rounded-lg border p-1.5 text-center transition-all active:scale-95",
                              MODE_COLORS[mode]
                            )}
                            title={item.nome}
                          >
                            {/* Status dot */}
                            <span className={cn(
                              "absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full",
                              MODE_DOT[mode]
                            )} />
                            <span className="text-[9px] font-bold leading-tight line-clamp-2">{item.nome}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Info painel */}
      <AnimatePresence mode="wait">
        {activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className={cn(
              "overflow-hidden rounded-xl border bg-card/50",
              pinned ? "border-primary/40" : "border-primary/30"
            )}
          >
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">{activeItem.nome}</h4>
                <div className="flex items-center gap-1.5">
                  <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-medium", MODE_COLORS[modes[activeItem.id] ?? "off"])}>
                    {MODE_LABELS[modes[activeItem.id] ?? "off"]}
                  </span>
                  {pinned && (
                    <button onClick={() => setPinned(null)} className="text-[10px] text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-foreground/90">{activeItem.descricao}</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Quando usar</div>
                  <p className="text-[10px] text-foreground/80">{activeItem.quandoUsar}</p>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Exemplos</div>
                  <p className="text-[10px] italic text-muted-foreground">{activeItem.exemplo}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
