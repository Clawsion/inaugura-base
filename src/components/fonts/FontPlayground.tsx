"use client";

// ============================================================================
// FontPlayground — 5 barras horizontais grandes em fila vertical
// ============================================================================
// Redesign completo conforme pedido do utilizador:
//  - Cada slot é uma BARRA HORIZONTAL grande (não card pequeno)
//  - 5 barras distribuídas verticalmente (1 em cada linha)
//  - Ícone expand/collapse para mostrar/esconder cada slot
//  - Generate GLOBAL: um botão aplica transforms a todas as 5
//  - Cada barra tem também o seu próprio Generate individual
//  - Font picker + transform picker expandidos quando aberto
// ============================================================================

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Zap, ChevronDown, ChevronUp, Upload, Wand2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FONT_TRANSFORMS,
  getRandomTransform,
  getTransformsByCategory,
  type FontTransform,
} from "@/lib/font-transforms";
import { FONTES_DISPONIVEIS } from "@/lib/fonts";
import { FontSources } from "./FontSources";
import { toast } from "sonner";

export interface FontSlotState {
  fonte: string;
  transformId?: string;
  customFontName?: string;
}

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
}

export function FontPlayground({ states, onChange }: FontPlaygroundProps) {
  const slotStates = states.length === 5 ? states : DEFAULT_STATES;
  const [uploadedFonts, setUploadedFonts] = useState<UploadedFont[]>([]);
  const [expanded, setExpanded] = useState<boolean[]>([true, true, true, true, true]);
  const [textoGlobal, setTextoGlobal] = useState("The quick brown fox jumps over the lazy dog");

  useEffect(() => {
    if (states.length !== 5) onChange(DEFAULT_STATES);
  }, [states.length, onChange]);

  const updateSlot = (i: number, s: FontSlotState) => {
    const next = [...slotStates];
    next[i] = s;
    onChange(next);
  };

  const toggleExpand = (i: number) => {
    setExpanded((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const expandAll = () => setExpanded([true, true, true, true, true]);
  const collapseAll = () => setExpanded([false, false, false, false, false]);

  // Generate GLOBAL: aplica transform aleatória a todas as 5
  const generateAll = useCallback(() => {
    const next = slotStates.map((s) => ({
      ...s,
      transformId: getRandomTransform(s.transformId).id,
    }));
    onChange(next);
    toast.success("Transforms aplicadas às 5 fonts!");
  }, [slotStates, onChange]);

  const handleUploadFont = useCallback(async (file: File) => {
    const familyName = file.name
      .replace(/\.(ttf|otf|woff|woff2)$/i, "")
      .replace(/[^a-zA-Z0-9]/g, "-");
    const url = URL.createObjectURL(file);
    try {
      const fontFace = new FontFace(familyName, `url(${url})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      setUploadedFonts((prev) => [...prev, { name: familyName, family: familyName }]);
      toast.success(`Font "${familyName}" carregada!`);
    } catch {
      toast.error(`Falha ao carregar font: ${file.name}`);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {/* Header com Generate All global */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          <div>
            <Label className="text-sm font-semibold">Font Playground</Label>
            <p className="text-[10px] text-muted-foreground">
              5 barras · 50 transforms · upload · 10 sources
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="h-7 text-xs"
          >
            <ChevronUp className="h-3 w-3" /> Expandir
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="h-7 text-xs"
          >
            <ChevronDown className="h-3 w-3" /> Fechar
          </Button>
          <Button
            type="button"
            onClick={generateAll}
            className="h-7 gap-1 rounded-md bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
          >
            <Wand2 className="h-3 w-3" /> Generate All 5
          </Button>
        </div>
      </div>

      {/* Texto global partilhado por todas as barras */}
      <Input
        value={textoGlobal}
        onChange={(e) => setTextoGlobal(e.target.value)}
        placeholder="Texto de preview (partilhado por todas as barras)"
        className="h-8 border-border bg-background/50 text-xs"
      />

      {/* 5 BARRAS HORIZONAIS GRANDES em fila vertical */}
      <div className="space-y-2">
        {slotStates.map((s, i) => (
          <FontBar
            key={i}
            index={i}
            state={s}
            texto={textoGlobal}
            expanded={expanded[i]}
            onToggleExpand={() => toggleExpand(i)}
            onChange={(ns) => updateSlot(i, ns)}
            uploadedFonts={uploadedFonts}
            onUploadFont={handleUploadFont}
          />
        ))}
      </div>

      {/* Font Sources (10 sites) — colapsável por defeito */}
      <FontSources />
    </motion.div>
  );
}

// ============================================================================
// FontBar — uma barra horizontal grande (1 das 5)
// ============================================================================
interface FontBarProps {
  index: number;
  state: FontSlotState;
  texto: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onChange: (s: FontSlotState) => void;
  uploadedFonts: UploadedFont[];
  onUploadFont: (file: File) => void;
}

function FontBar({
  index,
  state,
  texto,
  expanded,
  onToggleExpand,
  onChange,
  uploadedFonts,
  onUploadFont,
}: FontBarProps) {
  const transformAtual = state.transformId
    ? FONT_TRANSFORMS.find((t) => t.id === state.transformId)
    : undefined;

  const aplicarTransformAleatoria = () => {
    onChange({ ...state, transformId: getRandomTransform(state.transformId).id });
  };

  const fontValue = state.customFontName ?? state.fonte;
  const fontStack = state.customFontName
    ? `"${state.customFontName}", var(--font-inter), sans-serif`
    : fontStackFor(state.fonte);

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Header da barra (sempre visível) */}
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-background/50"
          aria-label={expanded ? "Fechar" : "Expandir"}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
          {index + 1}
        </span>

        <span className="font-mono text-xs font-semibold">{fontValue}</span>

        {transformAtual && (
          <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            {transformAtual.name}
          </span>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            onClick={aplicarTransformAleatoria}
            className="h-7 gap-1 rounded-md bg-primary px-2 text-[10px] text-primary-foreground hover:bg-primary/90"
            title="Aplica transform aleatória a esta font"
          >
            <Zap className="h-3 w-3" /> Generate
          </Button>
        </div>
      </div>

      {/* Preview grande horizontal — sempre visível */}
      <div className="px-3 pb-3">
        <div className="relative min-h-[70px] overflow-hidden rounded-xl border border-border bg-background/30 px-4 py-4">
          <div className="flex h-full min-h-[50px] items-center">
            <span
              className="text-3xl font-bold leading-tight sm:text-4xl"
              style={{
                fontFamily: fontStack,
                ...transformAtual?.css,
              }}
            >
              {texto}
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo expandido: font picker + transform picker + upload */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-3">
              {/* Font picker */}
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

              {/* Upload button */}
              <UploadButton onUpload={onUploadFont} />

              {/* Transform picker */}
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
                  {Object.entries(getTransformsByCategory()).map(([cat, items]) => (
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Helper: upload button reutilizável
function UploadButton({ onUpload }: { onUpload: (f: File) => void }) {
  return (
    <label className="flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-background/50 px-3 text-[10px] text-muted-foreground hover:border-primary/40 hover:text-foreground">
      <Upload className="h-3 w-3" />
      Upload .ttf/.otf/.woff
      <input
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
    </label>
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
