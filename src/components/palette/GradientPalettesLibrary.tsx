"use client";

// ============================================================================
// GradientPalettesLibrary — popup com 8 paletas gradient premium prontas
// ============================================================================
// Mostra as 8 paletas do gradient-palettes.ts com:
//  - Preview do gradiente hero (mesh gradient visual)
//  - Nome, categoria, mood
//  - 4 cores principais (swatches)
//  - Botão "Aplicar" → aplica ao state + mostra CSS
//  - Botão "Ver CSS" → abre popup com todos os gradientes CSS copy-paste
// ============================================================================

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, Copy, Check, Layers, Eye, Code2, Wand2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  GRADIENT_PALETTES, GRADIENT_CATEGORIES, type GradientPalette,
} from "@/lib/gradient-palettes";

interface GradientPalettesLibraryProps {
  onApply: (palette: GradientPalette) => void;
}

export function GradientPalettesLibrary({ onApply }: GradientPalettesLibraryProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [cssPopup, setCssPopup] = useState<GradientPalette | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return GRADIENT_PALETTES;
    return GRADIENT_PALETTES.filter((p) => p.category === filter);
  }, [filter]);

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(`${field} copiado!`);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleApply = (palette: GradientPalette) => {
    onApply(palette);
    setOpen(false);
    toast.success(`Gradiente "${palette.name}" aplicado!`, {
      description: "Polimento mudou para Gradient Pro · CSS pronto nos gradientes",
      duration: 4000,
    });
  };

  // Trigger button
  const trigger = (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="relative h-6 gap-1 px-2 text-[10px] font-semibold"
      style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))",
        borderColor: "rgba(139,92,246,0.4)",
      }}
      title="8 paletas gradient premium prontas (Linear/Vercel/Stripe style)"
    >
      <Sparkles className="h-3 w-3" style={{ color: "#8B5CF6" }} />
      <span className="hidden sm:inline">Gradientes</span>
      <span
        className="absolute -right-1 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full px-1 text-[8px] font-bold text-white"
        style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)" }}
      >
        8
      </span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl gap-0 border-border bg-card p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Paletas gradient premium</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)" }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Paletas Gradient Premium</h3>
              <p className="text-[11px] text-muted-foreground">
                8 paletas prontas estilo Linear · Vercel · Stripe · Awwwards — com CSS copy-paste
              </p>
            </div>
          </div>
        </div>

        {/* Filtros por categoria */}
        <div className="border-b border-border p-3">
          <div className="flex flex-wrap gap-1">
            {GRADIENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                  filter === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de paletas */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((palette, idx) => (
              <GradientPaletteCard
                key={palette.id}
                palette={palette}
                idx={idx}
                onApply={handleApply}
                onViewCss={setCssPopup}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3 text-center text-[10px] text-muted-foreground">
          <Sparkles className="mr-1 inline h-2.5 w-2.5" />
          Aplicar muda automaticamente o polimento para <strong>Gradient Pro</strong> · Ver CSS dá-te todos os gradientes copy-paste
        </div>
      </DialogContent>

      {/* Popup CSS — mostra todos os gradientes CSS da paleta */}
      <CssPopup
        palette={cssPopup}
        onClose={() => setCssPopup(null)}
        onCopy={handleCopy}
        copiedField={copiedField}
      />
    </Dialog>
  );
}

// ─── Card individual de paleta gradient ─────────────────────────────────────
function GradientPaletteCard({
  palette, idx, onApply, onViewCss,
}: {
  palette: GradientPalette;
  idx: number;
  onApply: (p: GradientPalette) => void;
  onViewCss: (p: GradientPalette) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="group overflow-hidden rounded-xl border border-border bg-card/40"
    >
      {/* Preview do mesh gradient — usa o gradient hero da paleta */}
      <div
        className="relative h-24 w-full transition-all group-hover:h-28"
        style={{ background: palette.gradients.hero }}
      >
        {/* Overlay com mesh gradient (mais subtil) */}
        <div
          className="absolute inset-0 opacity-50"
          style={{ background: palette.gradients.mesh.split("\n").map(s => s.trim()).filter(Boolean).join(", ") }}
        />
        {/* Badge dark/light */}
        <span className="absolute right-2 top-2 rounded bg-black/40 px-1.5 py-0.5 text-[8px] font-bold text-white backdrop-blur-sm">
          {palette.isDark ? "DARK" : "LIGHT"}
        </span>
        {/* Nome sobreposto */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="text-xs font-bold text-white drop-shadow-md">{palette.name}</div>
          <div className="text-[9px] text-white/80 drop-shadow-sm">{palette.mood}</div>
        </div>
      </div>

      {/* Body: cores + ações */}
      <div className="p-3">
        {/* Swatches das 4 cores principais */}
        <div className="mb-2 flex gap-1">
          {palette.colors.map((c, i) => (
            <div
              key={i}
              className="h-7 flex-1 rounded-md border border-border"
              style={{ background: c.hex }}
              title={`${c.role}: ${c.hex}`}
            />
          ))}
        </div>

        {/* Hex codes pequenos */}
        <div className="mb-2 flex flex-wrap gap-1">
          {palette.colors.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-0.5 rounded bg-muted/60 px-1 py-0 font-mono text-[8px] text-muted-foreground"
            >
              {c.hex.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Meta: categoria + efeitos recomendados */}
        <div className="mb-2 flex flex-wrap gap-1 text-[8px]">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
            {palette.category}
          </span>
          {palette.recommendedEffects.slice(0, 2).map((fx) => (
            <span key={fx} className="rounded bg-muted/60 px-1.5 py-0.5 text-muted-foreground">
              {fx}
            </span>
          ))}
          {palette.recommendedEffects.length > 2 && (
            <span className="rounded bg-muted/60 px-1.5 py-0.5 text-muted-foreground">
              +{palette.recommendedEffects.length - 2}
            </span>
          )}
        </div>

        {/* WCAG note */}
        <p className="mb-2 text-[8px] italic text-muted-foreground/70 line-clamp-1">
          ✓ {palette.wcagNote}
        </p>

        {/* Ações */}
        <div className="flex gap-1.5">
          <Button
            type="button"
            size="sm"
            onClick={() => onApply(palette)}
            className="h-7 flex-1 gap-1 text-[10px] font-semibold"
            style={{
              background: "linear-gradient(90deg, " + palette.tokens.primary + ", " + palette.tokens.accent + ")",
              color: "#fff",
              border: "none",
            }}
          >
            <Wand2 className="h-3 w-3" />
            Aplicar
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onViewCss(palette)}
            className="h-7 gap-1 px-2 text-[10px]"
            title="Ver todos os gradientes CSS"
          >
            <Code2 className="h-3 w-3" />
            CSS
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Popup CSS — mostra todos os gradientes CSS da paleta ───────────────────
function CssPopup({
  palette, onClose, onCopy, copiedField,
}: {
  palette: GradientPalette | null;
  onClose: () => void;
  onCopy: (field: string, value: string) => void;
  copiedField: string | null;
}) {
  if (!palette) return null;

  const cssFields = [
    { key: "Hero Background", value: palette.gradients.hero, code: `background: ${palette.gradients.hero};` },
    { key: "Mesh Gradient", value: palette.gradients.mesh, code: `background:\n  ${palette.gradients.mesh.split("\n").map(s => s.trim()).filter(Boolean).join(",\n  ")};` },
    { key: "Button Primary", value: palette.gradients.button, code: `background: ${palette.gradients.button};` },
    { key: "Button Hover", value: palette.gradients.buttonHover, code: `background: ${palette.gradients.buttonHover};` },
    { key: "Card Surface", value: palette.gradients.card, code: `background: ${palette.gradients.card};` },
    { key: "Text Gradient", value: palette.gradients.text, code: `background: ${palette.gradients.text};\n-webkit-background-clip: text;\nbackground-clip: text;\ncolor: transparent;` },
    { key: "Glow", value: palette.gradients.glow, code: `box-shadow: 0 0 30px ${palette.gradients.glow};` },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-lg"
                  style={{ background: palette.gradients.hero }}
                />
                <div>
                  <h2 className="text-lg font-bold">{palette.name}</h2>
                  <p className="text-[11px] text-muted-foreground">
                    {palette.category} · {palette.mood}
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Preview grande do mesh gradient */}
          <div
            className="mb-4 h-32 rounded-xl border border-border"
            style={{ background: palette.gradients.hero }}
          />

          {/* Lista de gradientes CSS */}
          <div className="space-y-2">
            {cssFields.map((field) => (
              <div key={field.key} className="rounded-lg border border-border bg-zinc-900 p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{field.key}</span>
                  <button
                    type="button"
                    onClick={() => onCopy(field.key, field.code)}
                    className="flex items-center gap-1 rounded px-2 py-0.5 text-[9px] text-primary hover:bg-primary/10"
                  >
                    {copiedField === field.key ? (
                      <><Check className="h-2.5 w-2.5" /> Copiado</>
                    ) : (
                      <><Copy className="h-2.5 w-2.5" /> Copiar</>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto text-[10px] text-green-400 whitespace-pre-wrap">{field.code}</pre>
              </div>
            ))}
          </div>

          {/* Tokens */}
          <div className="mt-4 border-t border-border pt-3">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Design Tokens
            </h3>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {Object.entries(palette.tokens).map(([k, v]) => (
                <div key={k} className="rounded-md border border-border p-1.5">
                  <div className="flex items-center gap-1">
                    <div
                      className="h-3 w-3 rounded border border-border"
                      style={{ background: v }}
                    />
                    <span className="text-[9px] font-medium">{k}</span>
                  </div>
                  <code className="mt-0.5 block text-[8px] text-muted-foreground">{v}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Info extra */}
          <div className="mt-4 space-y-2 border-t border-border pt-3 text-[10px]">
            <div>
              <strong className="text-muted-foreground">Efeitos recomendados:</strong>{" "}
              <span>{palette.recommendedEffects.join(" · ")}</span>
            </div>
            <div>
              <strong className="text-muted-foreground">Tipografia:</strong>{" "}
              <span>{palette.recommendedTypography}</span>
            </div>
            <div>
              <strong className="text-muted-foreground">WCAG:</strong>{" "}
              <span className="text-emerald-500">{palette.wcagNote}</span>
            </div>
            <div>
              <strong className="text-muted-foreground">Descrição:</strong>{" "}
              <span className="italic">{palette.description}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
