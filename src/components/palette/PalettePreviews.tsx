"use client";

// ============================================================================
// PalettePreviews — 3 mockups a usar a paleta gerada, num popup
// ============================================================================
// 3 mockups:
//  1. Hero section — título, sub, CTA, imagem placeholder
//  2. Dashboard — sidebar + cards de stats + gráfico placeholder
//  3. Pricing — 3 cards de planos lado a lado
//
// Botão "Ver 3 previews" abre um Dialog com tabs para escolher o mockup.
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, Layout as LayoutIcon, BarChart3, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { ProjectSpec } from "@/lib/schemas";
import { useState } from "react";

interface PalettePreviewsProps {
  spec: ProjectSpec;
}

export function PalettePreviews({ spec }: PalettePreviewsProps) {
  const [open, setOpen] = useState(false);

  // Helpers para extrair cores da paleta por uso
  const getCor = (keywords: string[]) => {
    const found = spec.palette.find((c) =>
      keywords.some(
        (k) =>
          c.nome.toLowerCase().includes(k) ||
          c.uso.toLowerCase().includes(k)
      )
    );
    return found?.hex ?? spec.palette[0]?.hex ?? "#000000";
  };

  const bg = getCor(["fundo", "background", "bg", "base"]);
  const card = getCor(["card", "surface", "superfície", "superficie", "elevated"]);
  const text = getCor(["text", "texto", "foreground", "fg"]);
  const accent = getCor(["accent", "primary", "cta", "vibrant", "destaque"]);
  const muted = getCor(["muted", "secondary", "subtle", "subdued"]) ?? text;

  const trigger = (
    <Button
      type="button"
      variant="default"
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Eye className="mr-1.5 h-3.5 w-3.5" />
      Ver 3 previews
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl gap-0 border-border bg-card p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Previews da paleta</DialogTitle>
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="text-sm font-semibold">Previews da paleta em contexto real</h3>
            <p className="text-[11px] text-muted-foreground">
              3 mockups que usam a paleta gerada. Avalia o contraste e harmonia.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-7 w-7"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          <div className="border-b border-border px-4 pt-3">
            <TabsList className="grid w-full grid-cols-3 bg-card/50">
              <TabsTrigger value="hero" className="text-xs">
                <LayoutIcon className="mr-1 h-3 w-3" /> Hero
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="text-xs">
                <BarChart3 className="mr-1 h-3 w-3" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="pricing" className="text-xs">
                <CreditCard className="mr-1 h-3 w-3" /> Pricing
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-4">
            <TabsContent value="hero" className="mt-0">
              <HeroMockup bg={bg} card={card} text={text} accent={accent} muted={muted} heading={spec.typography.heading} body={spec.typography.body} />
            </TabsContent>
            <TabsContent value="dashboard" className="mt-0">
              <DashboardMockup bg={bg} card={card} text={text} accent={accent} muted={muted} heading={spec.typography.heading} body={spec.typography.body} />
            </TabsContent>
            <TabsContent value="pricing" className="mt-0">
              <PricingMockup bg={bg} card={card} text={text} accent={accent} muted={muted} heading={spec.typography.heading} body={spec.typography.body} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Mockup 1: Hero section
// ============================================================================
function HeroMockup({
  bg,
  card,
  text,
  accent,
  muted,
  heading,
  body,
}: {
  bg: string;
  card: string;
  text: string;
  accent: string;
  muted: string;
  heading: string;
  body: string;
}) {
  const headingFont = fontStack(heading);
  const bodyFont = fontStack(body);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border"
      style={{ backgroundColor: bg, color: text, fontFamily: bodyFont }}
    >
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md" style={{ backgroundColor: accent }} />
          <span className="text-sm font-bold" style={{ fontFamily: headingFont }}>
            Brand
          </span>
        </div>
        <div className="flex gap-4 text-xs" style={{ color: muted }}>
          <span>Features</span>
          <span>Pricing</span>
          <span>About</span>
        </div>
        <button
          className="rounded-lg px-3 py-1.5 text-xs font-semibold"
          style={{ backgroundColor: accent, color: bg }}
        >
          Sign in
        </button>
      </div>

      {/* Hero content */}
      <div className="grid grid-cols-1 gap-6 px-6 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <div
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: `${accent}20`, color: accent }}
          >
            Novo · v2.0
          </div>
          <h2
            className="text-3xl font-bold leading-tight md:text-4xl"
            style={{ fontFamily: headingFont }}
          >
            Forja produtos que as pessoas amam usar
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: muted }}>
            A plataforma all-in-one para equipas remotas. Mais rápido, mais
            inteligente, mais humano. Sem fricção, sem bureaucracy.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: accent, color: bg }}
            >
              Começar grátis →
            </button>
            <button
              className="rounded-lg border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: `${text}30`, color: text }}
            >
              Ver demo
            </button>
          </div>
        </div>

        {/* Right side: floating card */}
        <div
          className="flex items-center justify-center rounded-xl p-6"
          style={{ backgroundColor: card, border: `1px solid ${text}15` }}
        >
          <div className="w-full space-y-2">
            <div className="h-2 w-3/4 rounded" style={{ backgroundColor: `${text}20` }} />
            <div className="h-2 w-full rounded" style={{ backgroundColor: `${text}15` }} />
            <div className="h-2 w-5/6 rounded" style={{ backgroundColor: `${text}15` }} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${accent}15` }}
                >
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: accent }} />
                  <div className="mt-1 h-1.5 w-full rounded" style={{ backgroundColor: `${text}20` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Mockup 2: Dashboard
// ============================================================================
function DashboardMockup({
  bg,
  card,
  text,
  accent,
  muted,
  heading,
  body,
}: {
  bg: string;
  card: string;
  text: string;
  accent: string;
  muted: string;
  heading: string;
  body: string;
}) {
  const headingFont = fontStack(heading);
  const bodyFont = fontStack(body);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border"
      style={{ backgroundColor: bg, color: text, fontFamily: bodyFont }}
    >
      <div className="grid grid-cols-[180px_1fr]">
        {/* Sidebar */}
        <div
          className="space-y-1 border-r p-3"
          style={{ borderColor: `${text}15`, backgroundColor: card }}
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="h-5 w-5 rounded" style={{ backgroundColor: accent }} />
            <span className="text-xs font-bold" style={{ fontFamily: headingFont }}>
              Dashboard
            </span>
          </div>
          {["Overview", "Analytics", "Customers", "Settings"].map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]"
              style={
                i === 0
                  ? { backgroundColor: `${accent}20`, color: accent }
                  : { color: muted }
              }
            >
              <div className="h-3 w-3 rounded" style={{ backgroundColor: "currentColor" }} />
              {item}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="space-y-4 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ fontFamily: headingFont }}>
              Overview
            </h3>
            <div
              className="h-7 w-7 rounded-full"
              style={{ backgroundColor: accent }}
            />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Receita", value: "€48.2k", delta: "+12%" },
              { label: "Utilizadores", value: "1,847", delta: "+8%" },
              { label: "Conversão", value: "3.4%", delta: "+0.5%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-3"
                style={{ backgroundColor: card, border: `1px solid ${text}10` }}
              >
                <div className="text-[10px] uppercase tracking-wider" style={{ color: muted }}>
                  {stat.label}
                </div>
                <div className="text-lg font-bold" style={{ fontFamily: headingFont }}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-semibold" style={{ color: accent }}>
                  {stat.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: card, border: `1px solid ${text}10` }}
          >
            <div className="mb-2 text-xs font-semibold">Atividade semanal</div>
            <div className="flex h-24 items-end gap-1.5">
              {[40, 65, 50, 80, 70, 95, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 5 ? accent : `${accent}50`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Mockup 3: Pricing
// ============================================================================
function PricingMockup({
  bg,
  card,
  text,
  accent,
  muted,
  heading,
  body,
}: {
  bg: string;
  card: string;
  text: string;
  accent: string;
  muted: string;
  heading: string;
  body: string;
}) {
  const headingFont = fontStack(heading);
  const bodyFont = fontStack(body);

  const planos = [
    { nome: "Starter", preco: "€0", desc: "Para experimentar", features: ["5 projetos", "1GB storage", "Community support"], destaque: false },
    { nome: "Pro", preco: "€29", desc: "Para equipas em crescimento", features: ["Projetos ilimitados", "100GB storage", "Priority support", "Analytics avançadas"], destaque: true },
    { nome: "Enterprise", preco: "Custom", desc: "Para grandes organizações", features: ["SSO/SAML", "Storage ilimitado", "Dedicated manager", "SLA 99.9%"], destaque: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border p-6"
      style={{ backgroundColor: bg, color: text, fontFamily: bodyFont }}
    >
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold" style={{ fontFamily: headingFont }}>
          Planos simples, preços transparentes
        </h3>
        <p className="mt-1 text-xs" style={{ color: muted }}>
          Sem custos escondidos. Cancela quando quiseres.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {planos.map((plano) => (
          <div
            key={plano.nome}
            className="rounded-xl p-4"
            style={{
              backgroundColor: card,
              border: plano.destaque
                ? `2px solid ${accent}`
                : `1px solid ${text}15`,
              boxShadow: plano.destaque ? `0 8px 24px ${accent}30` : undefined,
            }}
          >
            {plano.destaque && (
              <div
                className="mb-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: accent, color: bg }}
              >
                Recomendado
              </div>
            )}
            <div className="text-sm font-bold" style={{ fontFamily: headingFont }}>
              {plano.nome}
            </div>
            <div className="text-[11px]" style={{ color: muted }}>
              {plano.desc}
            </div>
            <div className="my-3 text-2xl font-bold" style={{ fontFamily: headingFont }}>
              {plano.preco}
              <span className="text-xs font-normal" style={{ color: muted }}>
                /mês
              </span>
            </div>
            <ul className="space-y-1.5">
              {plano.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[11px]">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full rounded-lg py-2 text-xs font-semibold"
              style={{
                backgroundColor: plano.destaque ? accent : "transparent",
                color: plano.destaque ? bg : text,
                border: plano.destaque ? "none" : `1px solid ${text}30`,
              }}
            >
              Escolher {plano.nome}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Helper: mapear nome de font para CSS stack
function fontStack(nome: string): string {
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
