"use client";

// ============================================================================
// FontPreviewPopup — popup com preview grande da font
// ============================================================================
// Mostra a font em diferentes tamanhos (H1, H2, H3, body, button, code)
// com a transform aplicada. Atualiza em tempo real.
// ============================================================================

import { Eye } from "lucide-react";
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle,
} from "@/components/ui/dialog";
import { FONT_TRANSFORMS } from "@/lib/font-transforms";
import { FONTS_MODERNAS, fontStackFor, PESOS_LABELS } from "@/lib/fonts-modernas";
import type { FontSlotState } from "./FontPlayground";

interface FontPreviewPopupProps {
  state: FontSlotState;
  texto: string;
}

export function FontPreviewPopup({ state, texto }: FontPreviewPopupProps) {
  const transform = state.transformId
    ? FONT_TRANSFORMS.find((t) => t.id === state.transformId)
    : undefined;

  const fontInfo = FONTS_MODERNAS.find((f) => f.family === state.fonte);
  const fontStack = state.customFontName
    ? `"${state.customFontName}", var(--font-inter), sans-serif`
    : fontStackFor(fontInfo ?? state.fonte);

  const pesoPrincipal = (state.pesos ?? [400])[0];
  const fontStyle = state.italic ? "italic" : "normal";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Preview popup da font"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-background/50 hover:text-foreground"
        >
          <Eye className="h-3 w-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl gap-0 border-border bg-card p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Preview da font</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="text-sm font-semibold">{state.fonte}</h3>
            <p className="text-[11px] text-muted-foreground">
              {transform ? `Transform: ${transform.name}` : "Sem transform"} · Peso: {PESOS_LABELS[pesoPrincipal]} · {state.italic ? "Italic" : "Regular"}
            </p>
          </div>
        </div>

        {/* Hierarquia completa */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          <PreviewRow label="H1 — Display" size="text-5xl" weight={900} />
          <PreviewRow label="H2 — Title" size="text-3xl" weight={700} />
          <PreviewRow label="H3 — Subtitle" size="text-xl" weight={600} />
          <PreviewRow label="H4 — Heading" size="text-lg" weight={500} />
          <PreviewRow label="Body — Large" size="text-base" weight={400} multiline />
          <PreviewRow label="Body — Small" size="text-sm" weight={400} multiline />
          <PreviewRow label="Caption" size="text-xs" weight={400} />
        </div>
      </DialogContent>
    </Dialog>
  );

  function PreviewRow({
    label, size, weight, multiline,
  }: {
    label: string;
    size: string;
    weight: number;
    multiline?: boolean;
  }) {
    return (
      <div>
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div
          className={`${size} leading-tight`}
          style={{
            fontFamily: fontStack,
            fontWeight: weight,
            fontStyle,
            ...transform?.css,
          }}
        >
          {multiline
            ? `${texto}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
            : texto}
        </div>
      </div>
    );
  }
}
