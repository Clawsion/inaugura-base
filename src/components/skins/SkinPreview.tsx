"use client";

// ============================================================================
// SkinPreview — mini-preview de um skin (dark + light lado a lado)
// ============================================================================

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Skin, SkinTokens } from "@/lib/skins";
import { cn } from "@/lib/utils";

interface SkinPreviewProps {
  skin: Skin;
  selected: boolean;
  onToggle: (id: string) => void;
  index: number;
}

export function SkinPreview({ skin, selected, onToggle, index }: SkinPreviewProps) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 120, damping: 18 }}
      whileHover={{ y: -4 }}
      onClick={() => onToggle(skin.id)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card text-left transition-all",
        selected
          ? "border-primary ring-2 ring-primary/40"
          : "border-border hover:border-primary/40"
      )}
    >
      {/* Badge de seleção */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="absolute right-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
        >
          <Check className="h-3.5 w-3.5" />
        </motion.div>
      )}

      {/* Header do card */}
      <div className="flex items-center justify-between px-3 py-2">
        <div>
          <h4 className="text-sm font-bold leading-tight">{skin.name}</h4>
          <p className="text-[10px] text-muted-foreground">{skin.description}</p>
        </div>
        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
          {skin.category}
        </span>
      </div>

      {/* Mini previews lado a lado: dark + light */}
      <div className="grid grid-cols-2 gap-px bg-border">
        <MiniPreview tokens={skin.dark} label="Dark" />
        <MiniPreview tokens={skin.light} label="Light" />
      </div>

      {/* Footer com indicador */}
      <div className="px-3 py-2 text-[10px] text-muted-foreground">
        {selected ? "Selecionado" : "Clica para selecionar (máx. 3)"}
      </div>
    </motion.button>
  );
}

// ============================================================================
// MiniPreview — um mini-mockup do skin com tokens reais aplicados
// ============================================================================
function MiniPreview({ tokens, label }: { tokens: SkinTokens; label: string }) {
  return (
    <div
      className="relative p-3"
      style={{
        backgroundColor: tokens.bg,
        color: tokens.text,
        fontFamily: tokens.bodyFont,
      }}
    >
      {/* Label */}
      <div
        className="absolute right-1 top-1 rounded px-1 py-0.5 text-[8px] font-bold uppercase opacity-60"
        style={{
          backgroundColor: tokens.accent,
          color: tokens.bg,
          borderRadius: tokens.radius,
        }}
      >
        {label}
      </div>

      {/* Mockup mini: heading + body + button + color row */}
      <div className="space-y-1.5">
        <div
          className="text-[11px] font-bold leading-tight"
          style={{ fontFamily: tokens.headingFont }}
        >
          Forge AI
        </div>
        <div
          className="h-1 w-full rounded"
          style={{
            backgroundColor: tokens.text,
            opacity: 0.15,
            borderRadius: tokens.radius,
          }}
        />
        <div
          className="h-1 w-3/4 rounded"
          style={{
            backgroundColor: tokens.text,
            opacity: 0.1,
            borderRadius: tokens.radius,
          }}
        />
        <div
          className="inline-block px-2 py-0.5 text-[9px] font-bold"
          style={{
            backgroundColor: tokens.accent,
            color: tokens.bg,
            borderRadius: tokens.radius,
            boxShadow: tokens.shadow === "none" ? undefined : tokens.shadow,
          }}
        >
          CTA
        </div>
        <div className="flex gap-1 pt-0.5">
          {[
            tokens.bg,
            tokens.card,
            tokens.text,
            tokens.accent,
            tokens.muted,
          ].map((c, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full border"
              style={{
                backgroundColor: c,
                borderColor: tokens.border,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
