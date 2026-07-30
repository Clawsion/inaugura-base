"use client";

import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Efeitos } from "@/lib/form-options";
import { cn } from "@/lib/utils";
import {
  Film,
  Eye,
  Layers,
  MoveHorizontal,
  Maximize,
  Box,
  Sparkles,
  Wine,
  MousePointerClick,
} from "lucide-react";

const ICONS: Record<string, any> = {
  "Cinematic": Film,
  "Reveal on scroll": Eye,
  "Parallax": Layers,
  "Smooth scroll": Sparkles,
  "Sticky sections": Wine,
  "Horizontal scroll": MoveHorizontal,
  "Fullscreen sections": Maximize,
  "3D / WebGL leve": Box,
  "Minimal classic": MousePointerClick,
  "Glassmorphism": Sparkles,
};

interface LayoutSelectorProps {
  efeitos: string[];
  onToggle: (e: string) => void;
}

export function LayoutSelector({ efeitos, onToggle }: LayoutSelectorProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <Label className="text-sm font-semibold">Estilo de Layout & Efeitos</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {Efeitos.map((e) => {
          const active = efeitos.includes(e);
          const Icon = ICONS[e] ?? Sparkles;
          return (
            <button
              key={e}
              type="button"
              onClick={() => onToggle(e)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all active:scale-95",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-medium leading-tight">{e}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
