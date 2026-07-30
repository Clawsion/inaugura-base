"use client";

// ============================================================================
// SkinSwitcher — pills horizontais no topo da app
// ============================================================================
// Clicar num pill aplica instantaneamente os tokens do skin a toda a app.
// O "Reset" volta ao tema default do ProjectForge AI.
// Pequeno e discreto: não é preview grande, é switcher rápido.
// ============================================================================

import { motion } from "framer-motion";
import { SKINS } from "@/lib/skins";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

interface SkinSwitcherProps {
  activeSkin: string | null; // null = default theme
  onChange: (id: string | null) => void;
}

export function SkinSwitcher({ activeSkin, onChange }: SkinSwitcherProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:inline">
        Skin:
      </span>
      <div
        className={cn(
          "flex items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-card/50 p-1 backdrop-blur-sm",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {/* Reset button */}
        <button
          type="button"
          onClick={() => onChange(null)}
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all",
            activeSkin === null
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          title="Reset ao tema default"
        >
          <RotateCcw className="h-3 w-3" />
        </button>

        {/* Skin pills */}
        {SKINS.map((skin) => {
          const active = activeSkin === skin.id;
          return (
            <button
              key={skin.id}
              type="button"
              onClick={() => onChange(active ? null : skin.id)}
              title={`${skin.name} — ${skin.description}`}
              className={cn(
                "group relative flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all",
                active
                  ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              {/* Mini color dots */}
              <span className="flex gap-0.5">
                <span
                  className="h-2 w-2 rounded-full ring-1 ring-border"
                  style={{ backgroundColor: skin.dark.bg }}
                />
                <span
                  className="h-2 w-2 rounded-full ring-1 ring-border"
                  style={{ backgroundColor: skin.dark.accent }}
                />
                <span
                  className="h-2 w-2 rounded-full ring-1 ring-border"
                  style={{ backgroundColor: skin.light.bg }}
                />
                <span
                  className="h-2 w-2 rounded-full ring-1 ring-border"
                  style={{ backgroundColor: skin.light.accent }}
                />
              </span>
              <span className="hidden sm:inline">{skin.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
