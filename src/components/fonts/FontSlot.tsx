"use client";

// ============================================================================
// FontSlot — um slot individual do playground (5 slots no total)
// ============================================================================
// Cada slot tem:
//  - Selector de font (predefinidas + uploaded)
//  - Texto de preview editável
//  - Transform atual aplicada (badge)
//  - Botão "Generate" (aplica transform aleatória)
//  - Dropdown para escolher transform específica das 50
//  - Botão para limpar transform
// ============================================================================

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronDown, X, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FONT_TRANSFORMS,
  getRandomTransform,
  getTransformsByCategory,
  type FontTransform,
} from "@/lib/font-transforms";
import { FONTES_DISPONIVEIS } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export interface FontSlotState {
  fonte: string;
  transformId?: string;
  customFontName?: string; // para fonts uploaded
}

interface FontSlotProps {
  index: number;
  state: FontSlotState;
  onChange: (s: FontSlotState) => void;
  uploadedFonts: { name: string; family: string }[];
  onUploadFont: (file: File) => void;
}

export function FontSlot({
  index,
  state,
  onChange,
  uploadedFonts,
  onUploadFont,
}: FontSlotProps) {
  const [texto, setTexto] = useState("The quick brown fox");
  const fileRef = useRef<HTMLInputElement>(null);

  const transformAtual = state.transformId
    ? FONT_TRANSFORMS.find((t) => t.id === state.transformId)
    : undefined;

  const aplicarTransformAleatoria = () => {
    const t = getRandomTransform(state.transformId);
    onChange({ ...state, transformId: t.id });
  };

  const limparTransform = () => {
    onChange({ ...state, transformId: undefined });
  };

  const fontValue = state.customFontName ?? state.fonte;
  const fontStack = state.customFontName
    ? `"${state.customFontName}", var(--font-inter), sans-serif`
    : fontStackFor(state.fonte);

  const transformsPorCategoria = getTransformsByCategory();

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3">
      {/* Header: slot number + actions */}
      <div className="flex items-center justify-between">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
          {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            onClick={aplicarTransformAleatoria}
            className="h-7 gap-1 rounded-md bg-primary px-2 text-xs text-primary-foreground hover:bg-primary/90"
            title="Aplica uma transform CSS aleatória a esta font"
          >
            <Zap className="h-3 w-3" /> Generate
          </Button>
          {state.transformId && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={limparTransform}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Font selector */}
      <Select
        value={fontValue}
        onValueChange={(v) => {
          if (v.startsWith("__custom__:")) {
            const name = v.replace("__custom__:", "");
            onChange({ ...state, customFontName: name, fonte: name });
          } else {
            onChange({ ...state, fonte: v, customFontName: undefined });
          }
        }}
      >
        <SelectTrigger className="h-8 border-border bg-background/50 text-xs">
          <SelectValue placeholder="Escolhe font" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-[10px] uppercase tracking-wider">
              Predefinidas
            </SelectLabel>
            {FONTES_DISPONIVEIS.map((f) => (
              <SelectItem key={f} value={f} className="text-xs">
                <span style={{ fontFamily: fontStackFor(f) }}>{f}</span>
              </SelectItem>
            ))}
          </SelectGroup>
          {uploadedFonts.length > 0 && (
            <SelectGroup>
              <SelectLabel className="text-[10px] uppercase tracking-wider">
                Uploads
              </SelectLabel>
              {uploadedFonts.map((f) => (
                <SelectItem
                  key={f.family}
                  value={`__custom__:${f.name}`}
                  className="text-xs"
                >
                  <span style={{ fontFamily: `"${f.family}", sans-serif` }}>
                    {f.name}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>

      {/* Upload button (mini) */}
      <input
        ref={fileRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUploadFont(f);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileRef.current?.click()}
        className="h-7 w-full gap-1 border-dashed text-[10px] text-muted-foreground"
      >
        <Upload className="h-3 w-3" /> Upload .ttf/.otf/.woff
      </Button>

      {/* Preview area — text + transform applied */}
      <div className="relative min-h-[100px] overflow-hidden rounded-xl border border-border bg-background/30 p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.transformId ?? "default"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex h-full min-h-[80px] items-center justify-center"
          >
            <span
              className="text-2xl font-bold leading-tight"
              style={{
                fontFamily: fontStack,
                ...transformAtual?.css,
              }}
            >
              {texto}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Badge com nome da transform ativa */}
        {transformAtual && (
          <span className="absolute bottom-1.5 right-1.5 rounded-md bg-primary/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
            {transformAtual.name}
          </span>
        )}
      </div>

      {/* Editable text input */}
      <Input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Texto de preview"
        className="h-8 border-border bg-background/50 text-xs"
      />

      {/* Transform picker (categorizado) */}
      <Select
        value={state.transformId ?? "__none__"}
        onValueChange={(v) =>
          onChange({ ...state, transformId: v === "__none__" ? undefined : v })
        }
      >
        <SelectTrigger className="h-8 border-border bg-background/50 text-xs">
          <SelectValue placeholder="Transform (50 estilos)" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectItem value="__none__" className="text-xs text-muted-foreground">
            — Sem transform —
          </SelectItem>
          {Object.entries(transformsPorCategoria).map(([cat, items]) => (
            <SelectGroup key={cat}>
              <SelectLabel className="text-[10px] uppercase tracking-wider text-primary">
                {cat}
              </SelectLabel>
              {items.map((t: FontTransform) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">
                  <span className="font-medium">{t.name}</span>
                  <span className="ml-1 text-muted-foreground">— {t.description}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Helper: mapear nome de font para CSS stack
function fontStackFor(nome: string): string {
  switch (nome.toLowerCase()) {
    case "inter":
      return "var(--font-inter), system-ui, sans-serif";
    case "geist":
      return "var(--font-geist-sans), system-ui, sans-serif";
    case "plus jakarta sans":
    case "plus jakarta":
      return "var(--font-jakarta), system-ui, sans-serif";
    case "geist mono":
      return "var(--font-mono), ui-monospace, monospace";
    case "outfit":
      return "Outfit, var(--font-inter), sans-serif";
    case "montserrat":
      return "Montserrat, var(--font-inter), sans-serif";
    case "satoshi":
      return "Satoshi, var(--font-inter), sans-serif";
    default:
      return "var(--font-inter), system-ui, sans-serif";
  }
}
