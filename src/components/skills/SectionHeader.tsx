"use client";

// ============================================================================
// SectionHeader — header principal com R/A/O/M + Auto + Limpar
// ============================================================================
// Os botões R/A/O/M aplicam o modo a TODAS as categorias dessa secção.
// ============================================================================

import { cn } from "@/lib/utils";
import type { SkillMode } from "@/lib/skills-catalog";

const QUICK_SELECT: { mode: SkillMode; label: string; fullLabel: string; color: string; bg: string }[] = [
  { mode: "recomendada", label: "R", fullLabel: "Recomendada", color: "text-emerald-500", bg: "border-emerald-500/40 hover:bg-emerald-500/10" },
  { mode: "alternativa", label: "A", fullLabel: "Alternativa", color: "text-blue-500", bg: "border-blue-500/40 hover:bg-blue-500/10" },
  { mode: "opcional", label: "O", fullLabel: "Opcional", color: "text-amber-500", bg: "border-amber-500/40 hover:bg-amber-500/10" },
  { mode: "manual", label: "M", fullLabel: "Manual", color: "text-fuchsia-500", bg: "border-fuchsia-500/40 hover:bg-fuchsia-500/10" },
];

interface SectionHeaderProps {
  title: string;
  iconName: React.ReactNode;
  description: string;
  activeCount: number;
  totalCount: number;
  nichoDetetado: string | null;
  onSetAllMode: (mode: SkillMode) => void;
  onAuto: () => void;
  onClear: () => void;
}

export function SectionHeader({
  title, iconName, description, activeCount, totalCount,
  nichoDetetado, onSetAllMode, onAuto, onClear,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          {iconName}
          {title}
        </h3>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Contador */}
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          {activeCount} ativas
        </span>

        {/* R/A/O/M — botões principais que aplicam a TODAS as categorias */}
        <div className="flex gap-0.5 rounded-md border border-border bg-card/50 p-0.5">
          {QUICK_SELECT.map((qs) => (
            <button
              key={qs.mode}
              type="button"
              onClick={() => onSetAllMode(qs.mode)}
              className={cn(
                "flex h-5 items-center justify-center rounded px-1.5 text-[9px] font-bold transition-all",
                qs.color,
                qs.bg,
                "border border-transparent"
              )}
              title={`Aplicar "${qs.fullLabel}" a todas as categorias`}
            >
              {qs.label}
            </button>
          ))}
        </div>

        {/* Auto (recomendado por nicho) */}
        <button
          type="button"
          onClick={onAuto}
          disabled={!nichoDetetado}
          className="rounded-md border border-primary/40 px-2 py-0.5 text-[9px] font-medium text-primary hover:bg-primary/10 disabled:opacity-40"
          title="Aplica automaticamente as recomendações para o nicho detetado"
        >
          Auto
        </button>

        {/* Limpar */}
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-border px-2 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground"
          title="Desativa todos"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
