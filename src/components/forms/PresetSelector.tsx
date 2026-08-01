"use client";

import { motion } from "framer-motion";
import { CATALOG, type Preset } from "@/lib/catalog";
import { LayoutTemplate, Check } from "lucide-react";

interface PresetSelectorProps {
  activePreset: string | null;
  onApply: (preset: Preset) => void;
}

export function PresetSelector({ activePreset, onApply }: PresetSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Preset do projeto</h3>
        <span className="ml-auto text-xs text-muted-foreground">1 clique aplica locks</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {CATALOG.presets.map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApply(preset)}
              className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border bg-card/30 hover:border-primary/50 hover:bg-card/50"
              }`}
            >
              {isActive && (
                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <div className="text-xs font-bold leading-tight">{preset.name}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">
                {preset.project_type}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="rounded bg-muted px-1 py-0.5 text-[9px] uppercase">
                  {preset.level}
                </span>
                {preset.mode && (
                  <span className="rounded bg-muted px-1 py-0.5 text-[9px] uppercase">
                    {preset.mode}
                  </span>
                )}
              </div>
              <div className="mt-1 text-[9px] text-muted-foreground">
                {preset.sections.length} sec · {preset.effects.length} fx · {preset.skills.length} skills
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
