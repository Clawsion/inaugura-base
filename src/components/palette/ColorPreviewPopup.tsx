"use client";

// ============================================================================
// ColorPreviewPopup — preview popup com 3 mockups usando a cor em tempo real
// ============================================================================
// Mostra a cor selecionada em 3 mockups (Hero, Dashboard, Pricing).
// Quando a cor muda (no input), o popup atualiza em tempo real.
// Pode usar a font escolhida do playground (opcional).
// ============================================================================

import { motion } from "framer-motion";
import { Eye, Layout as LayoutIcon, BarChart3, CreditCard } from "lucide-react";
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { isHexValido } from "@/lib/color-utils";
import { FONTS_MODERNAS, fontStackFor } from "@/lib/fonts-modernas";

interface Cor {
  nome: string;
  hex: string;
  uso: string;
  locked?: boolean;
}

interface ColorPreviewPopupProps {
  cor: Cor;
  outrasCores: Cor[]; // para completar a paleta do mockup
  fontEscolhida?: string;
}

export function ColorPreviewPopup({ cor, outrasCores, fontEscolhida }: ColorPreviewPopupProps) {
  const [open, setOpen] = useState(false);

  // Helper: encontra outra cor por role
  const findCor = (keywords: string[], excludeHex?: string) => {
    const found = outrasCores.find(
      (c) =>
        c.hex !== excludeHex &&
        keywords.some(
          (k) =>
            c.uso.toLowerCase().includes(k) ||
            c.nome.toLowerCase().includes(k)
        )
    );
    return found?.hex;
  };

  // Se a cor atual tem role de Background, usá-la como bg; senão completar
  const isBg = ["background", "bg", "fundo", "base"].some((k) =>
    cor.uso.toLowerCase().includes(k) || cor.nome.toLowerCase().includes(k)
  );
  const isAccent = ["accent", "primary", "cta", "vibrant", "destaque"].some((k) =>
    cor.uso.toLowerCase().includes(k) || cor.nome.toLowerCase().includes(k)
  );
  const isCard = ["card", "surface", "superfície", "superficie", "elevated"].some((k) =>
    cor.uso.toLowerCase().includes(k) || cor.nome.toLowerCase().includes(k)
  );
  const isText = ["text", "texto", "foreground", "fg"].some((k) =>
    cor.uso.toLowerCase().includes(k) || cor.nome.toLowerCase().includes(k)
  );

  // Para o mockup, usar a cor atual na sua role + completar com outras
  const bg = isBg ? cor.hex : (findCor(["background", "bg", "fundo", "base"], cor.hex) ?? "#0A0A0B");
  const card = isCard ? cor.hex : (findCor(["card", "surface"], cor.hex) ?? "#141416");
  const text = isText ? cor.hex : (findCor(["text", "texto", "foreground"], cor.hex) ?? "#FAFAFA");
  const accent = isAccent ? cor.hex : (findCor(["accent", "primary", "cta"], cor.hex) ?? "#00FFB2");
  const muted = findCor(["muted", "secondary"], cor.hex) ?? "#9CA3AF";

  // Font stack
  const fontInfo = FONTS_MODERNAS.find((f) => f.family === fontEscolhida);
  const headingFont = fontStackFor(fontInfo ?? "Geist");
  const bodyFont = fontStackFor(fontInfo ?? "Inter");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Preview popup — vê a cor em 3 mockups"
          className="flex h-7 w-7 items-center justify-center rounded-md backdrop-blur-sm transition-all bg-black/20 hover:bg-black/40"
          style={{ color: isDarkColor(cor.hex) ? "#fff" : "#000" }}
        >
          <Eye className="h-3 w-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl gap-0 border-border bg-card p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Preview da cor em mockups</DialogTitle>

        {/* Header com a cor atual destacada */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg border-2 border-border"
              style={{ backgroundColor: cor.hex }}
            />
            <div>
              <h3 className="text-sm font-semibold">
                {cor.nome} <span className="font-mono text-muted-foreground">{cor.hex.toUpperCase()}</span>
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Role: {cor.uso} · Vê a cor aplicada em 3 mockups reais
              </p>
            </div>
          </div>
          {/* X removido — o Dialog já tem botão de fechar próprio no canto */}
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
              <HeroMockup bg={bg} card={card} text={text} accent={accent} muted={muted} headingFont={headingFont} bodyFont={bodyFont} />
            </TabsContent>
            <TabsContent value="dashboard" className="mt-0">
              <DashboardMockup bg={bg} card={card} text={text} accent={accent} muted={muted} headingFont={headingFont} bodyFont={bodyFont} />
            </TabsContent>
            <TabsContent value="pricing" className="mt-0">
              <PricingMockup bg={bg} card={card} text={text} accent={accent} muted={muted} headingFont={headingFont} bodyFont={bodyFont} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer com paleta usada */}
        <div className="border-t border-border p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Paleta usada nos mockups
          </div>
          <div className="flex gap-1.5">
            {[
              { hex: bg, label: "BG" },
              { hex: card, label: "Card" },
              { hex: text, label: "Text" },
              { hex: accent, label: "Accent" },
              { hex: muted, label: "Muted" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-1">
                <div
                  className="h-5 w-5 rounded border border-border"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[9px] text-muted-foreground">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Mockups (reutilizamos do PalettePreviews mas adaptados)
// ============================================================================
function HeroMockup({ bg, card, text, accent, muted, headingFont, bodyFont }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border"
      style={{ backgroundColor: bg, color: text, fontFamily: bodyFont }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md" style={{ backgroundColor: accent }} />
          <span className="text-sm font-bold" style={{ fontFamily: headingFont }}>Brand</span>
        </div>
        <div className="flex gap-4 text-xs" style={{ color: muted }}>
          <span>Features</span><span>Pricing</span><span>About</span>
        </div>
        <button
          className="rounded-lg px-3 py-1.5 text-xs font-semibold"
          style={{ backgroundColor: accent, color: bg }}
        >Sign in</button>
      </div>
      <div className="grid grid-cols-1 gap-6 px-6 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <div
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: `${accent}20`, color: accent }}
          >Novo · v2.0</div>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl" style={{ fontFamily: headingFont }}>
            Forja produtos que as pessoas amam usar
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: muted }}>
            A plataforma all-in-one para equipas remotas. Mais rápido, mais inteligente.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: accent, color: bg }}
            >Começar grátis →</button>
            <button
              className="rounded-lg border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: `${text}30`, color: text }}
            >Ver demo</button>
          </div>
        </div>
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
                <div key={i} className="rounded-lg p-2" style={{ backgroundColor: `${accent}15` }}>
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

function DashboardMockup({ bg, card, text, accent, muted, headingFont, bodyFont }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border"
      style={{ backgroundColor: bg, color: text, fontFamily: bodyFont }}
    >
      <div className="grid grid-cols-[180px_1fr]">
        <div className="space-y-1 border-r p-3" style={{ borderColor: `${text}15`, backgroundColor: card }}>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-5 w-5 rounded" style={{ backgroundColor: accent }} />
            <span className="text-xs font-bold" style={{ fontFamily: headingFont }}>Dashboard</span>
          </div>
          {["Overview", "Analytics", "Customers", "Settings"].map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]"
              style={i === 0 ? { backgroundColor: `${accent}20`, color: accent } : { color: muted }}
            >
              <div className="h-3 w-3 rounded" style={{ backgroundColor: "currentColor" }} />
              {item}
            </div>
          ))}
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ fontFamily: headingFont }}>Overview</h3>
            <div className="h-7 w-7 rounded-full" style={{ backgroundColor: accent }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Receita", value: "€48.2k", delta: "+12%" },
              { label: "Utilizadores", value: "1,847", delta: "+8%" },
              { label: "Conversão", value: "3.4%", delta: "+0.5%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg p-3" style={{ backgroundColor: card, border: `1px solid ${text}10` }}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: muted }}>{stat.label}</div>
                <div className="text-lg font-bold" style={{ fontFamily: headingFont }}>{stat.value}</div>
                <div className="text-[10px] font-semibold" style={{ color: accent }}>{stat.delta}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: card, border: `1px solid ${text}10` }}>
            <div className="mb-2 text-xs font-semibold">Atividade semanal</div>
            <div className="flex h-24 items-end gap-1.5">
              {[40, 65, 50, 80, 70, 95, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ height: `${h}%`, backgroundColor: i === 5 ? accent : `${accent}50` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PricingMockup({ bg, card, text, accent, muted, headingFont, bodyFont }: any) {
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
        <p className="mt-1 text-xs" style={{ color: muted }}>Sem custos escondidos. Cancela quando quiseres.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {planos.map((plano) => (
          <div
            key={plano.nome}
            className="rounded-xl p-4"
            style={{
              backgroundColor: card,
              border: plano.destaque ? `2px solid ${accent}` : `1px solid ${text}15`,
              boxShadow: plano.destaque ? `0 8px 24px ${accent}30` : undefined,
            }}
          >
            {plano.destaque && (
              <div
                className="mb-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: accent, color: bg }}
              >Recomendado</div>
            )}
            <div className="text-sm font-bold" style={{ fontFamily: headingFont }}>{plano.nome}</div>
            <div className="text-[11px]" style={{ color: muted }}>{plano.desc}</div>
            <div className="my-3 text-2xl font-bold" style={{ fontFamily: headingFont }}>
              {plano.preco}<span className="text-xs font-normal" style={{ color: muted }}>/mês</span>
            </div>
            <ul className="space-y-1.5">
              {plano.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[11px]">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
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
            >Escolher {plano.nome}</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Helper
function isDarkColor(hex: string): boolean {
  if (!isHexValido(hex)) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma < 0.5;
}
