"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette } from "lucide-react";
import { DESIGN_VISUAL_CATALOG, getDesignVisualForNicho, type DesignVisualOption, type SkillMode } from "@/lib/design-visual-catalog";
import { detectarNicho } from "@/lib/perfect-combo";
import { cn } from "@/lib/utils";
import { CategoryAccordion } from "@/components/skills/CategoryAccordion";
import { SectionHeader } from "@/components/skills/SectionHeader";

interface DesignVisualProps {
  briefing: string;
  nicho: string;
  selectedOptions: string[];
  onChange: (options: string[]) => void;
}

const MODE_LABELS: Record<SkillMode, string> = {
  recomendada: "Recomendada", alternativa: "Alternativa",
  opcional: "Opcional", manual: "Manual", off: "Off",
};
const MODE_COLORS: Record<SkillMode, string> = {
  recomendada: "border-emerald-500 bg-emerald-500/10 text-emerald-500",
  alternativa: "border-blue-500 bg-blue-500/10 text-blue-500",
  opcional: "border-amber-500 bg-amber-500/10 text-amber-500",
  manual: "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500",
  off: "border-border bg-card/40 text-muted-foreground",
};

export function DesignVisual({ briefing, nicho, selectedOptions, onChange }: DesignVisualProps) {
  const [modes, setModes] = useState<Record<string, SkillMode>>({});
  const [lockedCats, setLockedCats] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [activeMode, setActiveMode] = useState<SkillMode | null>(null);
  const prevNicho = useRef<string | null>(null);
  const nichoDetetado = nicho || (briefing ? detectarNicho(briefing) : null);

  useEffect(() => {
    if (!nichoDetetado || prevNicho.current === nichoDetetado) return;
    prevNicho.current = nichoDetetado;
    applyMode("recomendada");
  }, [nichoDetetado]);

  const syncOnChange = (newModes: Record<string, SkillMode>) => {
    const activeIds = Object.entries(newModes).filter(([, m]) => m !== "off").map(([k]) => k);
    onChange(activeIds);
  };

  const applyMode = (mode: SkillMode) => {
    setActiveMode(mode);
    const recommended = nichoDetetado ? getDesignVisualForNicho(nichoDetetado) : [];
    const recIds = new Set(recommended.map((r) => r.id));

    const newModes: Record<string, SkillMode> = {};
    for (const opt of DESIGN_VISUAL_CATALOG) {
      if (lockedCats.has(opt.categoria)) {
        newModes[opt.id] = modes[opt.id] ?? "off";
        continue;
      }
      if (mode === "off" || mode === "manual") {
        newModes[opt.id] = "off";
      } else if (mode === "recomendada") {
        newModes[opt.id] = recIds.has(opt.id) || opt.modoDefault === "recomendada" ? "recomendada" : "off";
      } else if (mode === "alternativa") {
        newModes[opt.id] = (opt.modoDefault === "alternativa" || opt.modoDefault === "recomendada") ? "alternativa" : "off";
      } else if (mode === "opcional") {
        newModes[opt.id] = opt.modoDefault !== "off" ? "opcional" : "off";
      }
    }
    setModes(newModes);
    syncOnChange(newModes);
    const cats = new Set<string>();
    for (const o of DESIGN_VISUAL_CATALOG) { if (newModes[o.id] !== "off") cats.add(o.categoria); }
    setExpandedCats(cats);
  };

  const toggleMode = (id: string) => {
    setActiveMode(null);
    setModes((prev) => {
      const current = prev[id] ?? "off";
      const cycle: SkillMode[] = ["off", "recomendada", "alternativa", "opcional", "manual"];
      const next = { ...prev, [id]: cycle[(cycle.indexOf(current) + 1) % cycle.length] };
      syncOnChange(next);
      return next;
    });
  };

  const toggleLockCat = (cat: string) => {
    setLockedCats((prev) => { const n = new Set(prev); if (n.has(cat)) n.delete(cat); else n.add(cat); return n; });
  };

  const toggleCat = (cat: string) => {
    setExpandedCats((prev) => { const n = new Set(prev); if (n.has(cat)) n.delete(cat); else n.add(cat); return n; });
  };

  const activeInfo = pinned ?? hovered;
  const activeItem = activeInfo ? DESIGN_VISUAL_CATALOG.find((o) => o.id === activeInfo) : null;
  const byCategory = useMemo(() => { const g: Record<string, DesignVisualOption[]> = {}; for (const o of DESIGN_VISUAL_CATALOG) (g[o.categoria] ||= []).push(o); return g; }, []);
  const activeCount = Object.values(modes).filter((m) => m !== "off").length;

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Design Visual"
        iconName={<Palette className="h-3.5 w-3.5 text-primary" />}
        description="Carrega num modo para aplicar automaticamente. Lock = bloqueia categoria."
        activeCount={activeCount}
        totalCount={DESIGN_VISUAL_CATALOG.length}
        nichoDetetado={nichoDetetado}
        activeMode={activeMode}
        onModeSelect={applyMode}
      />
      <div className="space-y-1">
        {Object.entries(byCategory).map(([cat, items]) => (
          <CategoryAccordion
            key={cat} categoria={cat} items={items}
            modes={modes} locked={lockedCats.has(cat)}
            isExpanded={expandedCats.has(cat)}
            onToggleExpand={() => toggleCat(cat)}
            onToggleLock={() => toggleLockCat(cat)}
            onToggleMode={toggleMode}
            onHover={setHovered}
            onPin={(id) => setPinned((p) => (p === id ? null : id))}
            pinnedId={pinned}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeItem && (
          <motion.div key={activeItem.id} initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }} className={cn("overflow-hidden rounded-xl border bg-card/50", pinned ? "border-primary/40" : "border-primary/30")}>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">{activeItem.nome}</h4>
                <div className="flex items-center gap-1.5">
                  <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-medium", MODE_COLORS[modes[activeItem.id] ?? "off"])}>{MODE_LABELS[modes[activeItem.id] ?? "off"]}</span>
                  {pinned && <button onClick={() => setPinned(null)} className="text-[10px] text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>}
                </div>
              </div>
              <p className="mt-1 text-xs text-foreground/90">{activeItem.descricao}</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div><div className="text-[9px] font-bold uppercase text-muted-foreground">Quando usar</div><p className="text-[10px] text-foreground/80">{activeItem.quandoUsar}</p></div>
                <div><div className="text-[9px] font-bold uppercase text-muted-foreground">Exemplos</div><p className="text-[10px] italic text-muted-foreground">{activeItem.exemplo}</p></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
