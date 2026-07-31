"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import type { CorValidada } from "@/lib/color-utils";

interface ColorSwatchProps {
  cor: { nome: string; hex: string; uso: string };
  validada?: CorValidada;
}

export function ColorSwatch({ cor, validada }: ColorSwatchProps) {
  const hex = cor.hex.toUpperCase();
  const isDark = isDarkColor(hex);
  const contrasteOk = validada?.contrasteOk ?? true;
  const ratio = validada?.contrasteVersusBg;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div
        className="relative h-32 w-full transition-all group-hover:scale-[1.02]"
        style={{ backgroundColor: hex }}
      >
        <div
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            isDark
              ? "bg-white/10 text-white"
              : "bg-black/10 text-black"
          }`}
        >
          {isDark ? "Dark" : "Light"}
        </div>
        {ratio !== undefined && (
          <div
            className={`absolute bottom-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              contrasteOk
                ? "bg-green-500/20 text-green-300"
                : "bg-destructive/20 text-destructive"
            } ${isDark ? "" : "text-black"}`}
          >
            {contrasteOk ? (
              <Check className="h-2.5 w-2.5" />
            ) : (
              <AlertTriangle className="h-2.5 w-2.5" />
            )}
            {ratio.toFixed(2)}:1
          </div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{cor.nome}</span>
          <CopyButton text={hex} size="icon" label="Copiar hex" />
        </div>
        <div className="font-mono text-xs text-muted-foreground">{hex}</div>
        {cor.uso && (
          <div className="text-xs text-muted-foreground/80">{cor.uso}</div>
        )}
      </div>
    </motion.div>
  );
}

function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma < 0.5;
}
