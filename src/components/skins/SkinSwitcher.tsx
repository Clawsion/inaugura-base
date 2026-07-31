"use client";

// ============================================================================
// SkinSwitcher — 5 skins + Default, todos numa linha (compacto)
// ============================================================================

import { SKINS } from "@/lib/skins";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

interface SkinSwitcherProps {
  activeSkin: string | null;
  onChange: (id: string | null) => void;
}

export function SkinSwitcher({ activeSkin, onChange }: SkinSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      {/* Default */}
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all",
          activeSkin === null
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
        )}
        title="Reset ao tema default"
      >
        <RotateCcw className="h-2.5 w-2.5" />
        <span className="hidden sm:inline">Default</span>
      </button>

      {/* 5 Skins — compactos, numa linha */}
      {SKINS.map((skin) => {
        const active = activeSkin === skin.id;
        return (
          <button
            key={skin.id}
            type="button"
            onClick={() => onChange(active ? null : skin.id)}
            title={`${skin.name} — ${skin.description}`}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all active:scale-95",
              active
                ? "border-primary bg-primary/15 text-primary ring-1 ring-primary/30"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {/* Mini preview: 4 swatches (dark bg+accent + light bg+accent) */}
            <span className="flex gap-px rounded-sm overflow-hidden ring-1 ring-black/10">
              <span className="h-2.5 w-2.5" style={{ backgroundColor: skin.dark.bg }} />
              <span className="h-2.5 w-2.5" style={{ backgroundColor: skin.dark.accent }} />
              <span className="h-2.5 w-2.5" style={{ backgroundColor: skin.light.bg }} />
              <span className="h-2.5 w-2.5" style={{ backgroundColor: skin.light.accent }} />
            </span>
            <span>{skin.name}</span>
          </button>
        );
      })}
    </div>
  );
}
