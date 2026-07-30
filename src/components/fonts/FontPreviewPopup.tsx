"use client";

// ============================================================================
// FontPreviewPopup — preview popup com 3 skin previews + hierarquia
// ============================================================================
// Tabs:
//  1. Hierarquia — H1, H2, H3, H4, body, button, code (com a font + transform)
//  2. Dark — preview da font num contexto dark
//  3. Light — preview da font num contexto light
//  4. Brutalist — preview da font num contexto brutalist (sem radius, bordas duras)
// ============================================================================

import { Eye, X, Type, Moon, Sun, Square } from "lucide-react";
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FONT_TRANSFORMS, type FontTransform } from "@/lib/font-transforms";
import { FONTS_MODERNAS, fontStackFor, PESOS_LABELS } from "@/lib/fonts-modernas";
import type { FontSlotState } from "./FontPlayground";
import { useState } from "react";

interface FontPreviewPopupProps {
  state: FontSlotState;
  texto: string;
}

export function FontPreviewPopup({ state, texto }: FontPreviewPopupProps) {
  const [open, setOpen] = useState(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Preview popup da font (com 3 skins)"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-card/50 hover:text-foreground"
        >
          <Eye className="h-3 w-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl gap-0 border-border bg-card p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Preview da font em 3 skins</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="text-sm font-semibold">{state.fonte}</h3>
            <p className="text-[11px] text-muted-foreground">
              {transform ? `Transform: ${transform.name}` : "Sem transform"} · Peso: {PESOS_LABELS[pesoPrincipal]} · {state.italic ? "Italic" : "Regular"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-7 w-7">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Tabs defaultValue="hierarquia" className="w-full">
          <div className="border-b border-border px-4 pt-3">
            <TabsList className="grid w-full grid-cols-4 bg-card/50">
              <TabsTrigger value="hierarquia" className="text-xs">
                <Type className="mr-1 h-3 w-3" /> Hierarquia
              </TabsTrigger>
              <TabsTrigger value="dark" className="text-xs">
                <Moon className="mr-1 h-3 w-3" /> Dark
              </TabsTrigger>
              <TabsTrigger value="light" className="text-xs">
                <Sun className="mr-1 h-3 w-3" /> Light
              </TabsTrigger>
              <TabsTrigger value="brutalist" className="text-xs">
                <Square className="mr-1 h-3 w-3" /> Brutalist
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {/* TAB 1: Hierarquia completa */}
            <TabsContent value="hierarquia" className="mt-0 p-6 space-y-6">
              <PreviewRow label="H1 — Display" size="text-5xl" weight={900} />
              <PreviewRow label="H2 — Title" size="text-3xl" weight={700} />
              <PreviewRow label="H3 — Subtitle" size="text-xl" weight={600} />
              <PreviewRow label="H4 — Heading" size="text-lg" weight={500} />
              <PreviewRow label="Body — Large" size="text-base" weight={400} multiline />
              <PreviewRow label="Body — Small" size="text-sm" weight={400} multiline />
              <PreviewRow label="Caption" size="text-xs" weight={400} />
            </TabsContent>

            {/* TAB 2: Dark skin */}
            <TabsContent value="dark" className="mt-0">
              <SkinPreview
                bg="#08080A"
                card="#131316"
                text="#FAFAFA"
                muted="#9CA3AF"
                accent="#00FFB2"
                border="rgba(255,255,255,0.10)"
                radius="1.25rem"
                headingFont={fontStack}
                bodyFont={fontStack}
                peso={pesoPrincipal}
                fontStyle={fontStyle}
                transform={transform}
                texto={texto}
              />
            </TabsContent>

            {/* TAB 3: Light skin */}
            <TabsContent value="light" className="mt-0">
              <SkinPreview
                bg="#F8F9FB"
                card="#FFFFFF"
                text="#08080A"
                muted="#4B5563"
                accent="#00C77D"
                border="rgba(0,0,0,0.10)"
                radius="1.25rem"
                headingFont={fontStack}
                bodyFont={fontStack}
                peso={pesoPrincipal}
                fontStyle={fontStyle}
                transform={transform}
                texto={texto}
              />
            </TabsContent>

            {/* TAB 4: Brutalist skin */}
            <TabsContent value="brutalist" className="mt-0">
              <SkinPreview
                bg="#FFFEF0"
                card="#FFFFFF"
                text="#000000"
                muted="#444444"
                accent="#1A00E6"
                border="#000000"
                radius="0px"
                headingFont={fontStack}
                bodyFont={fontStack}
                peso={pesoPrincipal}
                fontStyle={fontStyle}
                transform={transform}
                texto={texto}
                brutalist
              />
            </TabsContent>
          </div>
        </Tabs>
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

// ============================================================================
// SkinPreview — mini mockup que usa a font com tokens de um skin específico
// ============================================================================
interface SkinPreviewProps {
  bg: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  radius: string;
  headingFont: string;
  bodyFont: string;
  peso: number;
  fontStyle: string;
  transform?: any;
  texto: string;
  brutalist?: boolean;
}

function SkinPreview({
  bg, card, text, muted, accent, border, radius,
  headingFont, bodyFont, peso, fontStyle, transform, texto, brutalist,
}: SkinPreviewProps) {
  return (
    <div
      className="p-6"
      style={{ backgroundColor: bg, color: text, fontFamily: bodyFont }}
    >
      {/* Nav */}
      <div
        className="mb-6 flex items-center justify-between border-b pb-3"
        style={{ borderColor: border }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6"
            style={{
              backgroundColor: accent,
              borderRadius: brutalist ? "0px" : "6px",
              border: brutalist ? `2px solid ${text}` : "none",
            }}
          />
          <span
            className="text-sm font-bold"
            style={{
              fontFamily: headingFont,
              fontWeight: peso,
              fontStyle,
              ...transform?.css,
            }}
          >
            Brand
          </span>
        </div>
        <div className="flex gap-3 text-xs" style={{ color: muted }}>
          <span>Features</span>
          <span>Pricing</span>
          <span>About</span>
        </div>
        <button
          className="px-3 py-1.5 text-xs font-semibold"
          style={{
            backgroundColor: accent,
            color: bg,
            borderRadius: radius,
            border: brutalist ? `2px solid ${text}` : "none",
            boxShadow: brutalist ? `3px 3px 0 ${text}` : "none",
          }}
        >
          Sign in
        </button>
      </div>

      {/* Hero content */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div
            className="inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${accent}20`,
              color: accent,
              borderRadius: brutalist ? "0px" : "9999px",
              border: brutalist ? `1px solid ${accent}` : "none",
            }}
          >
            Novo · v2.0
          </div>
          <h2
            className="text-3xl font-bold leading-tight md:text-4xl"
            style={{
              fontFamily: headingFont,
              fontWeight: peso,
              fontStyle,
              ...transform?.css,
            }}
          >
            Forja produtos que as pessoas amam usar
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: muted }}>
            A plataforma all-in-one para equipas remotas. Mais rápido, mais inteligente, mais humano.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              className="px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: accent,
                color: bg,
                borderRadius: radius,
                border: brutalist ? `2px solid ${text}` : "none",
                boxShadow: brutalist ? `3px 3px 0 ${text}` : "none",
              }}
            >
              Começar grátis →
            </button>
            <button
              className="px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: "transparent",
                color: text,
                borderRadius: radius,
                border: `1px solid ${text}30`,
              }}
            >
              Ver demo
            </button>
          </div>
        </div>

        {/* Card flutuante */}
        <div
          className="flex items-center justify-center p-4"
          style={{
            backgroundColor: card,
            border: brutalist ? `2px solid ${text}` : `1px solid ${border}`,
            borderRadius: radius,
            boxShadow: brutalist ? `5px 5px 0 ${text}` : "none",
          }}
        >
          <div className="w-full space-y-2">
            <div
              className="h-2 w-3/4"
              style={{ backgroundColor: `${text}20`, borderRadius: radius }}
            />
            <div
              className="h-2 w-full"
              style={{ backgroundColor: `${text}15`, borderRadius: radius }}
            />
            <div
              className="h-2 w-5/6"
              style={{ backgroundColor: `${text}15`, borderRadius: radius }}
            />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-2"
                  style={{
                    backgroundColor: `${accent}15`,
                    borderRadius: radius,
                    border: brutalist ? `1px solid ${text}` : "none",
                  }}
                >
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{
                      backgroundColor: accent,
                      borderRadius: brutalist ? "0px" : "9999px",
                    }}
                  />
                  <div
                    className="mt-1 h-1.5 w-full"
                    style={{ backgroundColor: `${text}20`, borderRadius: radius }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div
        className="mt-6 flex items-center justify-between rounded-lg p-3 text-xs"
        style={{
          backgroundColor: card,
          border: brutalist ? `2px solid ${text}` : `1px solid ${border}`,
          borderRadius: radius,
        }}
      >
        <span style={{ color: muted }}>
          Font: <span className="font-mono" style={{ color: text }}>{headingFont.split(",")[0].replace(/"/g, "")}</span>
          {" · "}Peso: <span style={{ color: text }}>{PESOS_LABELS[peso]}</span>
          {transform && <> · Transform: <span style={{ color: accent }}>{transform.name}</span></>}
        </span>
        <span style={{ color: muted }}>{brutalist ? "Brutalist" : ""}</span>
      </div>
    </div>
  );
}
