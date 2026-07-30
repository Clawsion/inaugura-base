"use client";

// ============================================================================
// FontPlayground — 5 barras horizontais com tudo
// ============================================================================
// Features:
//  - Filtro por categoria (todos/sans/serif/mono/geist/awwwards)
//  - Generate All global: busca fonts aleatórias dos sites + aplica transforms
//  - Generate individual: mesma coisa mas por slot
//  - Lock individual (cadeado): bloqueia o slot para não ser afetado pelo Generate All
//  - Copy/Paste individual por slot (copia estado, cola de outro slot)
//  - Random transforms (ícone separado, não muda a font)
//  - Pesos multi-seleção (Bold, Italic, Regular, Thin, etc.)
//  - Italic toggle
//  - Expand/collapse por barra
// ============================================================================

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type, Zap, ChevronDown, ChevronUp, Upload, Wand2,
  Lock, Unlock, Copy, ClipboardPaste, Shuffle,
  Bold, Italic, Eye,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FONT_TRANSFORMS, getRandomTransform, getTransformsByCategory,
  type FontTransform,
} from "@/lib/font-transforms";
import {
  FONTS_MODERNAS, FONT_FILTERS, PESOS_LABELS, PESOS_DISPONIVEIS,
  loadFont, getRandomFontByFilter, fontStackFor,
  type FontInfo,
} from "@/lib/fonts-modernas";
import { FONTES_DISPONIVEIS } from "@/lib/fonts";
import { FontSources } from "./FontSources";
import { FontPreviewPopup } from "./FontPreviewPopup";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface FontSlotState {
  fonte: string;
  transformId?: string;
  customFontName?: string;
  pesos?: number[];
  italic?: boolean;
  locked?: boolean;
}

interface FontPlaygroundProps {
  states: FontSlotState[];
  onChange: (states: FontSlotState[]) => void;
}

const DEFAULT_STATES: FontSlotState[] = [
  { fonte: "Inter", pesos: [400, 700] },
  { fonte: "Geist", pesos: [400, 600] },
  { fonte: "Plus Jakarta Sans", pesos: [400, 700] },
  { fonte: "Outfit", pesos: [400, 500] },
  { fonte: "Montserrat", pesos: [400, 600] },
];

interface UploadedFont {
  name: string;
  family: string;
}

export function FontPlayground({ states, onChange }: FontPlaygroundProps) {
  const slotStates = states.length === 5 ? states : DEFAULT_STATES;
  const [uploadedFonts, setUploadedFonts] = useState<UploadedFont[]>([]);
  const [expanded, setExpanded] = useState<boolean[]>([false, false, false, false, false]);
  const [textoGlobal, setTextoGlobal] = useState("The quick brown fox jumps over the lazy dog");
  const [filtro, setFiltro] = useState("todos");
  const [clipboard, setClipboard] = useState<FontSlotState | null>(null);

  useEffect(() => {
    if (states.length !== 5) onChange(DEFAULT_STATES);
  }, [states.length, onChange]);

  // Carrega as fonts iniciais ao montar
  useEffect(() => {
    slotStates.forEach((s) => {
      const info = FONTS_MODERNAS.find((f) => f.family === s.fonte);
      if (info) loadFont(info);
    });
  }, []);

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

  // GENERATE ALL — respeita locks: busca font aleatória + transform aleatória
  const generateAll = useCallback(async () => {
    const next = await Promise.all(
      slotStates.map(async (s) => {
        if (s.locked) return s; // respeita o lock
        const font = getRandomFontByFilter(filtro, s.fonte);
        await loadFont(font);
        return {
          ...s,
          fonte: font.family,
          customFontName: undefined,
          transformId: getRandomTransform(s.transformId).id,
        };
      })
    );
    onChange(next);
    const lockedCount = slotStates.filter((s) => s.locked).length;
    toast.success(
      `5 fonts geradas!${lockedCount > 0 ? ` (${lockedCount} bloqueadas mantidas)` : ""}`
    );
  }, [slotStates, onChange, filtro]);

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

  // Copy individual
  const copySlot = (i: number) => {
    setClipboard({ ...slotStates[i] });
    toast.success(`Slot ${i + 1} copiado para clipboard interno`);
  };

  // Paste individual
  const pasteSlot = (i: number) => {
    if (!clipboard) {
      toast.error("Nada colado ainda. Copia um slot primeiro.");
      return;
    }
    updateSlot(i, { ...clipboard });
    toast.success(`Slot ${i + 1} colado`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {/* Header com filtro + Generate All global */}
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <div>
              <Label className="text-sm font-semibold">Font Playground</Label>
              <p className="text-[10px] text-muted-foreground">
                5 barras · busca de 40+ fonts · 50 transforms
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={expandAll} className="h-7 text-xs">
              <ChevronUp className="h-3 w-3" /> Expandir
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll} className="h-7 text-xs">
              <ChevronDown className="h-3 w-3" /> Fechar
            </Button>
            <Button
              onClick={generateAll}
              className="h-7 gap-1 rounded-md bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <Wand2 className="h-3 w-3" /> Generate All 5
            </Button>
          </div>
        </div>

        {/* Filtros por categoria */}
        <div className="mt-2 flex flex-wrap gap-1">
          {FONT_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              title={f.desc}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-all",
                filtro === f.id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Texto global partilhado */}
      <Input
        value={textoGlobal}
        onChange={(e) => setTextoGlobal(e.target.value)}
        placeholder="Texto de preview (partilhado por todas as barras)"
        className="h-8 border-border bg-background/50 text-xs"
      />

      {/* 5 BARRAS HORIZONTAIS GRANDES em fila vertical */}
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
            filtro={filtro}
            onCopy={() => copySlot(i)}
            onPaste={() => pasteSlot(i)}
            hasClipboard={clipboard !== null}
          />
        ))}
      </div>

      {/* Font Sources (10 sites) */}
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
  filtro: string;
  onCopy: () => void;
  onPaste: () => void;
  hasClipboard: boolean;
}

function FontBar({
  index, state, texto, expanded, onToggleExpand, onChange,
  uploadedFonts, onUploadFont, filtro, onCopy, onPaste, hasClipboard,
}: FontBarProps) {
  const transformAtual = state.transformId
    ? FONT_TRANSFORMS.find((t) => t.id === state.transformId)
    : undefined;

  // Generate individual — busca font aleatória do filtro + transform aleatória
  const gerarIndividual = async () => {
    const font = getRandomFontByFilter(filtro, state.fonte);
    await loadFont(font);
    onChange({
      ...state,
      fonte: font.family,
      customFontName: undefined,
      transformId: getRandomTransform(state.transformId).id,
    });
    toast.success(`Slot ${index + 1}: ${font.family}`);
  };

  // Randomiza SÓ a transform (não muda a font)
  const randomTransform = () => {
    onChange({ ...state, transformId: getRandomTransform(state.transformId).id });
  };

  // Toggle lock
  const toggleLock = () => {
    onChange({ ...state, locked: !state.locked });
    toast.success(state.locked ? `Slot ${index + 1} desbloqueado` : `Slot ${index + 1} bloqueado`);
  };

  // Toggle peso (multi-seleção)
  const togglePeso = (peso: number) => {
    const current = state.pesos ?? [400];
    const next = current.includes(peso)
      ? current.filter((p) => p !== peso)
      : [...current, peso].sort((a, b) => a - b);
    onChange({ ...state, pesos: next.length > 0 ? next : [400] });
  };

  // Toggle italic
  const toggleItalic = () => {
    onChange({ ...state, italic: !state.italic });
  };

  const fontValue = state.customFontName ?? state.fonte;
  const fontInfo = FONTS_MODERNAS.find((f) => f.family === state.fonte);
  const fontStack = state.customFontName
    ? `"${state.customFontName}", var(--font-inter), sans-serif`
    : fontStackFor(fontInfo ?? state.fonte);
  const pesosAtivos = (state.pesos ?? [400]).sort((a, b) => a - b);
  const pesoPrincipal = pesosAtivos[0];

  return (
    <motion.div
      layout
      className={cn(
        "overflow-hidden rounded-2xl border bg-card transition-colors",
        state.locked ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
      )}
    >
      {/* Header da barra (sempre visível) */}
      <div className="flex flex-wrap items-center gap-2 p-3">
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-background/50"
          aria-label={expanded ? "Fechar" : "Expandir"}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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

        {pesosAtivos.length > 1 ? (
          <span className="rounded-md bg-background/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {pesosAtivos.length} pesos
          </span>
        ) : (
          <span className="rounded-md bg-background/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {PESOS_LABELS[pesoPrincipal]}
          </span>
        )}

        {state.italic && (
          <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
            <Italic className="h-2.5 w-2.5 inline" />
          </span>
        )}

        {state.locked && (
          <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            <Lock className="h-2.5 w-2.5 inline mr-0.5" />Lock
          </span>
        )}

        {/* Actions */}
        <div className="ml-auto flex items-center gap-0.5">
          {/* Lock */}
          <IconBtn onClick={toggleLock} active={state.locked} title={state.locked ? "Desbloquear" : "Bloquear (Generate All não afeta)"}>
            {state.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          </IconBtn>
          {/* Copy */}
          <IconBtn onClick={onCopy} title="Copiar slot">
            <Copy className="h-3 w-3" />
          </IconBtn>
          {/* Paste */}
          <IconBtn onClick={onPaste} disabled={!hasClipboard} title="Colar slot">
            <ClipboardPaste className="h-3 w-3" />
          </IconBtn>
          {/* Preview popup */}
          <FontPreviewPopup state={state} texto={texto} />
          {/* Random transform (ícone shuffle) */}
          <IconBtn onClick={randomTransform} title="Randomizar apenas a transform">
            <Shuffle className="h-3 w-3" />
          </IconBtn>
          {/* Pesos (multi-seleção) */}
          <PesosPopover pesos={pesosAtivos} onToggle={togglePeso} />
          {/* Italic */}
          <IconBtn onClick={toggleItalic} active={state.italic} title="Itálico">
            <Italic className="h-3 w-3" />
          </IconBtn>
          {/* Generate individual */}
          <Button
            type="button"
            size="sm"
            onClick={gerarIndividual}
            className="h-7 gap-1 rounded-md bg-primary px-2 text-[10px] text-primary-foreground hover:bg-primary/90"
            title="Busca font aleatória (do filtro) + aplica transform"
          >
            <Zap className="h-3 w-3" /> Generate
          </Button>
        </div>
      </div>

      {/* Preview grande horizontal — sempre visível */}
      <div className="px-3 pb-3">
        <div className="relative min-h-[80px] overflow-hidden rounded-xl border border-border bg-background/30 px-4 py-3">
          {/* Mostra uma linha por peso ativo (para comparar pesos) */}
          <div className="space-y-1">
            {pesosAtivos.slice(0, 3).map((p, idx) => (
              <div
                key={p}
                className="flex items-baseline gap-3"
                style={{ opacity: 1 - idx * 0.2 }}
              >
                {pesosAtivos.length > 1 && (
                  <span className="w-12 shrink-0 font-mono text-[9px] uppercase text-muted-foreground">
                    {PESOS_LABELS[p]}
                  </span>
                )}
                <span
                  className="text-2xl font-bold leading-tight sm:text-3xl"
                  style={{
                    fontFamily: fontStack,
                    fontWeight: p,
                    fontStyle: state.italic ? "italic" : "normal",
                    ...transformAtual?.css,
                  }}
                >
                  {texto}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo expandido */}
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
                onValueChange={async (v) => {
                  if (v.startsWith("__custom__:")) {
                    const name = v.replace("__custom__:", "");
                    onChange({ ...state, customFontName: name, fonte: name });
                  } else {
                    const info = FONTS_MODERNAS.find((f) => f.family === v);
                    if (info) await loadFont(info);
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
                      Modernas curadas ({FONTS_MODERNAS.length})
                    </SelectLabel>
                    {FONTS_MODERNAS.map((f) => (
                      <SelectItem key={f.family} value={f.family} className="text-xs">
                        <span style={{ fontFamily: fontStackFor(f) }}>{f.nome}</span>
                        <span className="ml-1 text-[10px] text-muted-foreground">
                          {f.awwwards ? "★" : ""} {f.categoria.join("/")}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] uppercase tracking-wider">
                      Predefinidas
                    </SelectLabel>
                    {FONTES_DISPONIVEIS.filter((f) => !FONTS_MODERNAS.find((fm) => fm.family === f)).map((f) => (
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
                        <SelectItem key={f.family} value={`__custom__:${f.name}`} className="text-xs">
                          <span style={{ fontFamily: `"${f.family}", sans-serif` }}>{f.name}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>

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

// ============================================================================
// IconBtn — botão de ícone pequeno reutilizável
// ============================================================================
function IconBtn({
  onClick, children, active, disabled, title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md transition-all",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

// ============================================================================
// PesosPopover — popover com checkboxes para multi-seleção de pesos
// ============================================================================
function PesosPopover({
  pesos, onToggle,
}: {
  pesos: number[];
  onToggle: (p: number) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Pesos (multi-seleção)"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-background/50 hover:text-foreground"
        >
          <Bold className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Pesos ({pesos.length} ativos)
        </div>
        <div className="space-y-1">
          {PESOS_DISPONIVEIS.map((p) => (
            <label
              key={p}
              htmlFor={`peso-${p}`}
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 hover:bg-background/50"
            >
              <Checkbox
                id={`peso-${p}`}
                checked={pesos.includes(p)}
                onCheckedChange={() => onToggle(p)}
              />
              <span className="text-xs">
                {p} — <span className="text-muted-foreground">{PESOS_LABELS[p]}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-1.5 border-t border-border pt-1 text-[9px] text-muted-foreground">
          Multi-seleção: compara pesos na preview
        </div>
      </PopoverContent>
    </Popover>
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
