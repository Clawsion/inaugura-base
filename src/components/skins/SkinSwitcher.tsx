"use client";

// ============================================================================
// SkinSwitcher — secção abaixo do header com os 5 skins
// ============================================================================
// Cada pill tem mini preview com 4 swatches (dark bg+accent + light bg+accent)
// + nome. Clicar aplica o skin instantaneamente (com padrão de fundo).
// ============================================================================

import { motion } from "framer-motion";
import { SKINS } from "@/lib/skins";
import { cn } from "@/lib/utils";
import { RotateCcw, Sparkles } from "lucide-react";

interface SkinSwitcherProps {
  activeSkin: string | null;
  onChange: (id: string | null) => void;
}

export function SkinSwitcher({ activeSkin, onChange }: SkinSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="mr-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        <span className="hidden sm:inline">5 Skins Premium</span>
      </div>

      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all",
          activeSkin === null
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
        )}
        title="Reset ao tema default"
      >
        <RotateCcw className="h-3 w-3" />
        <span className="hidden sm:inline">Default</span>
      </button>

      {SKINS.map((skin) => {
        const active = activeSkin === skin.id;
        return (
          <button
            key={skin.id}
            type="button"
            onClick={() => onChange(active ? null : skin.id)}
            title={`${skin.name} — ${skin.description}`}
            className={cn(
              "group flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all active:scale-95",
              active
                ? "border-primary bg-primary/15 text-primary ring-1 ring-primary/30"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {/* Mini preview: 4 quadrados com bg+accent dark+light */}
            <span className="flex gap-0.5 rounded-sm overflow-hidden ring-1 ring-black/10">
              <span
                className="h-3 w-3"
                style={{ backgroundColor: skin.dark.bg }}
              />
              <span
                className="h-3 w-3"
                style={{ backgroundColor: skin.dark.accent }}
              />
              <span
                className="h-3 w-3"
                style={{ backgroundColor: skin.light.bg }}
              />
              <span
                className="h-3 w-3"
                style={{ backgroundColor: skin.light.accent }}
              />
            </span>
            <span>{skin.name}</span>
          </button>
        );
      })}
    </div>
  );
}
