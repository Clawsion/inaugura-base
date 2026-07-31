"use client";

// ============================================================================
// SkillsSelector — accordion por categoria + botões pequenos em grid
// ============================================================================

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Pin, X, Lightbulb, ChevronDown, ChevronRight } from "lucide-react";
import {
  SKILLS_CATALOG, getSkillsForNicho,
  type Skill, type SkillMode,
} from "@/lib/skills-catalog";
import { detectarNicho } from "@/lib/perfect-combo";
import { cn } from "@/lib/utils";

interface SkillsSelectorProps {
  briefing: string;
  nicho: string;
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
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

export function SkillsSelector({
  briefing, nicho, selectedSkills, onChange,
}: SkillsSelectorProps) {
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
    const recommended = getSkillsForNicho(nichoDetetado);
    const newModes: Record<string, SkillMode> = {};
    for (const skill of SKILLS_CATALOG) {
      const isRec = recommended.some((r) => r.id === skill.id);
      if (isRec) { newModes[skill.id] = "recomendada"; }
      else if (skill.modoDefault === "alternativa") { newModes[skill.id] = "alternativa"; }
      else if (skill.modoDefault === "opcional") { newModes[skill.id] = "opcional"; }
      else { newModes[skill.id] = "off"; }
    }
    setModes(newModes);
    const catsToExpand = new Set<string>();
    for (const skill of SKILLS_CATALOG) {
      if (newModes[skill.id] === "recomendada") catsToExpand.add(skill.categoria);
    }
    setExpandedCats(catsToExpand);
  }, [nichoDetetado]);




  const toggleMode = (id: string) => {
    setModes((prev) => {
      const current = prev[id] ?? "off";
      const cycle: SkillMode[] = ["off", "recomendada", "alternativa", "opcional", "manual"];
      const idx = cycle.indexOf(current);
      const next = { ...prev, [id]: cycle[(idx + 1) % cycle.length] };
      const activeIds = Object.entries(next).filter(([, m]) => m !== "off").map(([k]) => k);
      onChange(activeIds);
      return next;
    });
  };

  const setAllOff = () => {
    const cleared: Record<string, SkillMode> = {};
    for (const s of SKILLS_CATALOG) cleared[s.id] = "off";
    setModes(cleared);
    onChange([]);
  };

  const setAllRecommended = () => {
    if (!nichoDetetado) return;
    const recommended = getSkillsForNicho(nichoDetetado);
    const newModes: Record<string, SkillMode> = {};
    for (const skill of SKILLS_CATALOG) {
      newModes[skill.id] = recommended.some((r) => r.id === skill.id) ? "recomendada" : "off";
    }
    setModes(newModes);
    const activeIds = Object.entries(newModes).filter(([, m]) => m !== "off").map(([k]) => k);
    onChange(activeIds);
  };

  const toggleCat = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const activeInfo = pinned ?? hovered;
  const activeItem = activeInfo ? SKILLS_CATALOG.find((s) => s.id === activeInfo) : null;

  const byCategory = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    for (const skill of SKILLS_CATALOG) (groups[skill.categoria] ||= []).push(skill);
    return groups;
  }, []);

  const activeCount = Object.values(modes).filter((m) => m !== "off").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold">
            <Lightbulb className="h-3.5 w-3.5 text-primary" />
            Skills & Ferramentas
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Clica numa categoria para expandir. Clica num skill para mudar modo.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{activeCount} ativas</span>
          <button type="button" onClick={setAllRecommended} disabled={!nichoDetetado} className="rounded-md border border-primary/40 px-2 py-0.5 text-[9px] font-medium text-primary hover:bg-primary/10 disabled:opacity-40">Auto</button>
          <button type="button" onClick={setAllOff} className="rounded-md border border-border px-2 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground">Limpar</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["recomendada", "alternativa", "opcional", "manual", "off"] as SkillMode[]).map((mode) => (
          <div key={mode} className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium", MODE_COLORS[mode])}>
            <span className={cn("h-1.5 w-1.5 rounded-full", MODE_DOT[mode])} />
            {MODE_LABELS[mode]}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {Object.entries(byCategory).map(([cat, skills]) => {
          const isExpanded = expandedCats.has(cat);
          const activeInCat = skills.filter((s) => modes[s.id] !== "off").length;
          return (
            <div key={cat} className="rounded-lg border border-border overflow-hidden">
              <button type="button" onClick={() => toggleCat(cat)} className="flex w-full items-center justify-between p-2 text-left transition-colors hover:bg-card/50">
                <div className="flex items-center gap-1.5">
                  {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{cat}</span>
                </div>
                <span className={cn("rounded-full px-1.5 py-0 text-[8px] font-bold", activeInCat > 0 ? "bg-primary/15 text-primary" : "bg-card/50 text-muted-foreground")}>{activeInCat}/{skills.length}</span>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-3 gap-1 p-2 pt-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                      {skills.map((skill) => {
                        const mode = modes[skill.id] ?? "off";
                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => { toggleMode(skill.id); setPinned((p) => (p === skill.id ? null : skill.id)); }}
                            onMouseEnter={() => setHovered(skill.id)}
                            onMouseLeave={() => setHovered(null)}
                            className={cn("relative flex flex-col items-center gap-0.5 rounded-lg border p-1.5 text-center transition-all active:scale-95", MODE_COLORS[mode])}
                            title={skill.nome}
                          >
                            <span className={cn("absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full", MODE_DOT[mode])} />
                            <span className="text-[9px] font-bold leading-tight line-clamp-2">{skill.nome}</span>
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
