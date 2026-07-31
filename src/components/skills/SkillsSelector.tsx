"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";
import { SKILLS_CATALOG, getSkillsForNicho, type Skill, type SkillMode } from "@/lib/skills-catalog";
import { detectarNicho } from "@/lib/perfect-combo";
import { cn } from "@/lib/utils";
import { CategoryAccordion } from "./CategoryAccordion";
import { SectionHeader } from "./SectionHeader";

interface SkillsSelectorProps {
  briefing: string;
  nicho: string;
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
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

export function SkillsSelector({ briefing, nicho, selectedSkills, onChange }: SkillsSelectorProps) {
  const [modes, setModes] = useState<Record<string, SkillMode>>({});
  const [lockedCats, setLockedCats] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [activeMode, setActiveMode] = useState<SkillMode | null>(null);
  const prevNicho = useRef<string | null>(null);
  const nichoDetetado = nicho || (briefing ? detectarNicho(briefing) : null);

  // Auto-aplicar quando nicho é detetado
  useEffect(() => {
    if (!nichoDetetado || prevNicho.current === nichoDetetado) return;
    prevNicho.current = nichoDetetado;
    applyMode("recomendada");
  }, [nichoDetetado]);

  const syncOnChange = (newModes: Record<string, SkillMode>) => {
    const activeIds = Object.entries(newModes).filter(([, m]) => m !== "off").map(([k]) => k);
    onChange(activeIds);
  };

  // Aplicar um modo a todos os items (respeitando locks)
  const applyMode = (mode: SkillMode) => {
    setActiveMode(mode);
    const recommended = nichoDetetado ? getSkillsForNicho(nichoDetetado) : [];
    const recIds = new Set(recommended.map((r) => r.id));

    const newModes: Record<string, SkillMode> = {};
    for (const skill of SKILLS_CATALOG) {
      if (lockedCats.has(skill.categoria)) {
        newModes[skill.id] = modes[skill.id] ?? "off";
        continue;
      }
      if (mode === "off") {
        newModes[skill.id] = "off";
      } else if (mode === "manual") {
        // Manual = tudo off, utilizador escolhe
        newModes[skill.id] = "off";
      } else if (mode === "recomendada") {
        // Recomendada = apenas as essenciais do nicho + as que são sempre recomendadas
        newModes[skill.id] = recIds.has(skill.id) || skill.modoDefault === "recomendada" ? "recomendada" : "off";
      } else if (mode === "alternativa") {
        // Alternativa = as alternativas + as recomendadas (conjunto maior)
        newModes[skill.id] = (skill.modoDefault === "alternativa" || skill.modoDefault === "recomendada") ? "alternativa" : "off";
      } else if (mode === "opcional") {
        // Opcional = tudo que não é off (recomendadas + alternativas + opcionais)
        newModes[skill.id] = skill.modoDefault !== "off" ? "opcional" : "off";
      }
    }
    setModes(newModes);
    syncOnChange(newModes);

    // Auto-expande categorias que têm itens ativos
    const cats = new Set<string>();
    for (const s of SKILLS_CATALOG) { if (newModes[s.id] !== "off") cats.add(s.categoria); }
    setExpandedCats(cats);
  };

  const toggleMode = (id: string) => {
    setActiveMode(null); // modo manual quando utilizador toggles individual
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
  const activeItem = activeInfo ? SKILLS_CATALOG.find((s) => s.id === activeInfo) : null;
  const byCategory = useMemo(() => { const g: Record<string, Skill[]> = {}; for (const s of SKILLS_CATALOG) (g[s.categoria] ||= []).push(s); return g; }, []);
  const activeCount = Object.values(modes).filter((m) => m !== "off").length;

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Skills & Ferramentas"
        iconName={<Lightbulb className="h-3.5 w-3.5 text-primary" />}
        description="Carrega num modo para aplicar automaticamente. Lock = bloqueia categoria."
        activeCount={activeCount}
        totalCount={SKILLS_CATALOG.length}
        nichoDetetado={nichoDetetado}
        activeMode={activeMode}
        onModeSelect={applyMode}
      />
      <div className="space-y-1">
        {Object.entries(byCategory).map(([cat, skills]) => (
          <CategoryAccordion
            key={cat} categoria={cat} items={skills}
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
              {activeItem.url && <a href={activeItem.url} target="_blank" rel="noreferrer" className="mt-1.5 inline-block text-[10px] text-primary hover:underline">{activeItem.url} →</a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
