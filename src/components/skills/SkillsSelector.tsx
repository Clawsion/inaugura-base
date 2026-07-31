"use client";

// ============================================================================
// SkillsSelector — seleção de skills com modos: Recomendada/Alternativa/Opcional/Manual/Off
// ============================================================================

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Pin, X, Lightbulb } from "lucide-react";
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

export function SkillsSelector({
  briefing, nicho, selectedSkills, onChange,
}: SkillsSelectorProps) {
  const [skillModes, setSkillModes] = useState<Record<string, SkillMode>>({});
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const nichoDetetado = nicho || (briefing ? detectarNicho(briefing) : null);

  // Auto-aplicar skills recomendadas quando nicho muda
  useEffect(() => {
    if (!nichoDetetado) return;
    const recommended = getSkillsForNicho(nichoDetetado);
    const newModes: Record<string, SkillMode> = {};
    for (const skill of SKILLS_CATALOG) {
      const isRecommended = recommended.some((r) => r.id === skill.id);
      if (isRecommended) {
        newModes[skill.id] = skill.modoDefault === "alternativa" ? "alternativa" : "recomendada";
      } else if (skill.modoDefault === "alternativa") {
        newModes[skill.id] = "alternativa";
      } else if (skill.modoDefault === "opcional") {
        newModes[skill.id] = "opcional";
      } else {
        newModes[skill.id] = "off";
      }
    }
    setSkillModes(newModes);
  }, [nichoDetetado]);

  // Sincroniza selectedSkills com skillModes
  useEffect(() => {
    const activeIds = Object.entries(skillModes)
      .filter(([_, mode]) => mode !== "off")
      .map(([id]) => id);
    onChange(activeIds);
  }, [skillModes]);

  const toggleMode = (skillId: string) => {
    setSkillModes((prev) => {
      const current = prev[skillId] ?? "off";
      const cycle: SkillMode[] = ["off", "recomendada", "alternativa", "opcional", "manual"];
      const idx = cycle.indexOf(current);
      const next = cycle[(idx + 1) % cycle.length];
      return { ...prev, [skillId]: next };
    });
  };

  const setAllOff = () => {
    const cleared: Record<string, SkillMode> = {};
    for (const s of SKILLS_CATALOG) cleared[s.id] = "off";
    setSkillModes(cleared);
  };

  const setAllRecommended = () => {
    if (!nichoDetetado) return;
    const recommended = getSkillsForNicho(nichoDetetado);
    const newModes: Record<string, SkillMode> = {};
    for (const skill of SKILLS_CATALOG) {
      const isRec = recommended.some((r) => r.id === skill.id);
      newModes[skill.id] = isRec ? "recomendada" : "off";
    }
    setSkillModes(newModes);
  };

  const activeInfo = pinned ?? hovered;
  const activeSkill = activeInfo ? SKILLS_CATALOG.find((s) => s.id === activeInfo) : null;

  const byCategory = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    for (const skill of SKILLS_CATALOG) {
      (groups[skill.categoria] ||= []).push(skill);
    }
    return groups;
  }, []);

  const activeCount = Object.values(skillModes).filter((m) => m !== "off").length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold">
            <Lightbulb className="h-3.5 w-3.5 text-primary" />
            Skills & Ferramentas
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Clica para mudar modo: Off → Recomendada → Alternativa → Opcional → Manual
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

      {/* Legenda de modos */}
      <div className="flex flex-wrap gap-1.5">
        {(["recomendada", "alternativa", "opcional", "manual", "off"] as SkillMode[]).map((mode) => (
          <div
            key={mode}
            className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium", MODE_COLORS[mode])}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {MODE_LABELS[mode]}
          </div>
        ))}
      </div>

      {/* Grid de skills por categoria */}
      <div className="space-y-3">
        {Object.entries(byCategory).map(([cat, skills]) => (
          <div key={cat}>
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {cat} ({skills.filter((s) => skillModes[s.id] !== "off").length}/{skills.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
              {skills.map((skill) => {
                const mode = skillModes[skill.id] ?? "off";
                const isHovered = hovered === skill.id;
                const isPinned = pinned === skill.id;
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => {
                      toggleMode(skill.id);
                      setPinned((p) => (p === skill.id ? null : skill.id));
                    }}
                    onMouseEnter={() => setHovered(skill.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "relative flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all active:scale-95",
                      MODE_COLORS[mode]
                    )}
                    title={skill.nome}
                  >
                    {isPinned && (
                      <Pin className="absolute right-1 top-1 h-2.5 w-2.5" fill="currentColor" />
                    )}
                    {!isPinned && (
                      <span className={cn("absolute right-1 top-1 transition-opacity", isHovered ? "opacity-100" : "opacity-30")}>
                        <Info className="h-2.5 w-2.5" />
                      </span>
                    )}
                    <span className="text-[10px] font-bold leading-tight">{skill.nome}</span>
                    <span className="text-[8px] uppercase opacity-70">{MODE_LABELS[mode]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info painel (hover + pin) */}
      <AnimatePresence mode="wait">
        {activeSkill && (
          <motion.div
            key={activeSkill.id}
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
                <h4 className="text-sm font-bold">{activeSkill.nome}</h4>
                <div className="flex items-center gap-1.5">
                  <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-medium", MODE_COLORS[skillModes[activeSkill.id] ?? "off"])}>
                    {MODE_LABELS[skillModes[activeSkill.id] ?? "off"]}
                  </span>
                  {pinned && (
                    <button onClick={() => setPinned(null)} className="text-[10px] text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-foreground/90">{activeSkill.descricao}</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Quando usar</div>
                  <p className="text-[10px] text-foreground/80">{activeSkill.quandoUsar}</p>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Exemplos</div>
                  <p className="text-[10px] italic text-muted-foreground">{activeSkill.exemplo}</p>
                </div>
              </div>
              {activeSkill.url && (
                <a
                  href={activeSkill.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-[10px] text-primary hover:underline"
                >
                  {activeSkill.url} →
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
