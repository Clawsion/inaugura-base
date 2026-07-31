"use client";

// ============================================================================
// SectionHeader — header principal com 5 botões toggle de modo
// ============================================================================
// Botões: Recomendada | Alternativa | Opcional | Manual | Off
// Cada botão aplica as skills adequadas para esse modo + nicho detetado.
// O botão ativo fica destacado com a sua cor.
// ============================================================================

import { cn } from "@/lib/utils";
import type { SkillMode } from "@/lib/skills-catalog";

const MODE_BUTTONS: { mode: SkillMode; label: string; color: string; activeBg: string; dotActive: string; dotInactive: string }[] = [
  { mode: "recomendada", label: "Recomendada", color: "text-emerald-500", activeBg: "border-emerald-500 bg-emerald-500/10 text-emerald-500", dotActive: "bg-emerald-500", dotInactive: "bg-emerald-500/40" },
  { mode: "alternativa", label: "Alternativa", color: "text-blue-500", activeBg: "border-blue-500 bg-blue-500/10 text-blue-500", dotActive: "bg-blue-500", dotInactive: "bg-blue-500/40" },
  { mode: "opcional", label: "Opcional", color: "text-amber-500", activeBg: "border-amber-500 bg-amber-500/10 text-amber-500", dotActive: "bg-amber-500", dotInactive: "bg-amber-500/40" },
  { mode: "manual", label: "Manual", color: "text-fuchsia-500", activeBg: "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-500", dotActive: "bg-fuchsia-500", dotInactive: "bg-fuchsia-500/40" },
  { mode: "off", label: "Off", color: "text-zinc-400", activeBg: "border-zinc-500 bg-zinc-500/10 text-zinc-300", dotActive: "bg-zinc-400", dotInactive: "bg-zinc-500/50" },
];

interface SectionHeaderProps {
  title: string;
  iconName: React.ReactNode;
  description: string;
  activeCount: number;
  totalCount: number;
  nichoDetetado: string | null;
  activeMode: SkillMode | null;
  onModeSelect: (mode: SkillMode) => void;
}

export function SectionHeader({
  title, iconName, description, activeCount, totalCount,
  nichoDetetado, activeMode, onModeSelect,
}: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold">
            {iconName}
            {title}
          </h3>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          {activeCount} ativas
        </span>
      </div>

      {/* 5 botões toggle de modo */}
      <div className="flex flex-wrap gap-1.5">
        {MODE_BUTTONS.map((btn) => {
          const isActive = activeMode === btn.mode;
          return (
            <button
              key={btn.mode}
              type="button"
              onClick={() => onModeSelect(btn.mode)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold transition-all active:scale-95",
                isActive
                  ? btn.activeBg
                  : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
              )}
              title={
                btn.mode === "recomendada" ? `Aplica as skills essenciais para ${nichoDetetado ?? "o nicho"}` :
                btn.mode === "alternativa" ? "Aplica boas alternativas" :
                btn.mode === "opcional" ? "Aplica skills nice-to-have" :
                btn.mode === "manual" ? "Limpa tudo para escolheres manualmente" :
                "Desativa tudo"
              }
            >
              <span className={cn(
                "h-2 w-2 rounded-full transition-all",
                isActive ? btn.dotActive : btn.dotInactive
              )} />
              {btn.label}
            </button>
          );
        })}
      </div>
      {/* Legenda de licenças */}
      <div className="flex flex-wrap gap-1.5">
        {["Free", "Freemium", "Subscrição"].map((lic) => (
          <span key={lic} className={cn(
            "rounded-full border px-2 py-0.5 text-[8px] font-bold",
            lic === "Free" && "border-emerald-500/30 bg-emerald-500/5 text-emerald-500",
            lic === "Freemium" && "border-amber-500/30 bg-amber-500/5 text-amber-500",
            lic === "Subscrição" && "border-rose-500/30 bg-rose-500/5 text-rose-500",
          )}>
            {lic}
          </span>
        ))}
      </div>
    </div>
  );
}
