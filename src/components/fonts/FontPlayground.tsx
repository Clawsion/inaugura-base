"use client";

// ============================================================================
// FontPlayground — playground de fonts com 5 slots
// ============================================================================
// Funcionalidades:
//  - 5 slots lado a lado (responsive grid)
//  - Cada slot tem font picker, preview, transform, generate button
//  - Upload de fonts (.ttf/.otf/.woff/.woff2) via FontFace API
//  - Lista de 10 sites de fonts com filtro (FontSources)
//  - Sincroniza com o form (onChange) para incluir no system prompt
// ============================================================================

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Type, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FontSlot, type FontSlotState } from "./FontSlot";
import { FontSources } from "./FontSources";
import { toast } from "sonner";

interface FontPlaygroundProps {
  states: FontSlotState[];
  onChange: (states: FontSlotState[]) => void;
}

const DEFAULT_STATES: FontSlotState[] = [
  { fonte: "Inter" },
  { fonte: "Geist" },
  { fonte: "Plus Jakarta Sans" },
  { fonte: "Outfit" },
  { fonte: "Montserrat" },
];

interface UploadedFont {
  name: string;
  family: string;
  url: string;
}

export function FontPlayground({ states, onChange }: FontPlaygroundProps) {
  // Inicializa com defaults se vazio
  const slotStates = states.length === 5 ? states : DEFAULT_STATES;
  const [uploadedFonts, setUploadedFonts] = useState<UploadedFont[]>([]);

  // Sincroniza com parent
  useEffect(() => {
    if (states.length !== 5) {
      onChange(DEFAULT_STATES);
    }
  }, [states.length, onChange]);

  const updateSlot = (i: number, s: FontSlotState) => {
    const next = [...slotStates];
    next[i] = s;
    onChange(next);
  };

  const handleUploadFont = useCallback(async (file: File) => {
    // Cria object URL e regista via FontFace API
    const url = URL.createObjectURL(file);
    const familyName = file.name.replace(/\.(ttf|otf|woff|woff2)$/i, "").replace(/[^a-zA-Z0-9]/g, "-");

    try {
      const fontFace = new FontFace(familyName, `url(${url})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      setUploadedFonts((prev) => [...prev, { name: familyName, family: familyName, url }]);
      toast.success(`Font "${familyName}" carregada e pronta a usar!`);
    } catch (err) {
      toast.error(`Falha ao carregar font: ${file.name}`);
      console.error(err);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="flex items-center gap-1.5 text-sm font-semibold">
            <Type className="h-3.5 w-3.5 text-primary" />
            Font Playground — 5 slots
          </Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Compara 5 fonts lado a lado. Clica em <strong>Generate</strong> (ícone ⚡)
            para aplicar uma das 50 transforms CSS visuais a essa font apenas.
            Faz upload das tuas próprias fonts em .ttf/.otf/.woff.
          </p>
        </div>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          50 transforms disponíveis
        </span>
      </div>

      {/* 5 slots em grid responsivo */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {slotStates.map((s, i) => (
          <FontSlot
            key={i}
            index={i}
            state={s}
            onChange={(ns) => updateSlot(i, ns)}
            uploadedFonts={uploadedFonts}
            onUploadFont={handleUploadFont}
          />
        ))}
      </div>

      {/* Lista de transform categories */}
      <div className="rounded-xl border border-border bg-background/30 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          Categorias de transforms (clica Generate para aleatório, ou escolhe no dropdown)
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {[
            "Stretch & Scale (7)",
            "Rotation & Skew (7)",
            "Outline & Stroke (5)",
            "Color & Filter (8)",
            "Blur & Contrast (5)",
            "Shadow & Glow (8)",
            "Style & Decoration (10)",
          ].map((c) => (
            <span
              key={c}
              className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Font Sources (10 sites) */}
      <FontSources />
    </motion.div>
  );
}
