"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sparkles, Lightbulb, Plus, Trash2, ChevronDown, Wand2, ArrowRight,
  Dices, Eye, Sliders, X, Layers, Zap, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CATALOG } from "@/lib/catalog";

export interface SimpleForgeValues {
  briefing: string;
  references: string[];
  projectType: string;
  aesthetic: string;
  mood: string[];
  palette: "auto" | "light" | "dark" | "brand";
  colorPreset: string;
  colorAdjust: { brightness: number; contrast: number; saturation: number };
  customColors: { hex: string; role: string }[];
  typographyPref: "auto" | "modern-sans" | "geometric" | "humanist" | "editorial-serif" | "mono-tech";
  fontHeading: string;
  fontBody: string;
  fontMono: string;
  customFonts: string[];
  animations: boolean;
  motionCombo: string;
  stackPref: "auto" | "modern" | "fullstack" | "supabase" | "python" | "ai-first" | "custom";
  stackCombo: string;
  integrations: string[];
  level: "mvp" | "production" | "enterprise";
  idioma: "pt" | "en";
}

interface SimpleForgeProps {
  value: SimpleForgeValues;
  onChange: (patch: Partial<SimpleForgeValues>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onSwitchToAdvanced: () => void;
}

// Ícones minimalistas (unicode/svg leves em vez de emojis)
const PROJECT_TYPES = [
  { id: "landing", label: "Landing Page", icon: "◢" },
  { id: "saas", label: "SaaS / Web App", icon: "▣" },
  { id: "ecommerce", label: "E-commerce", icon: "⬡" },
  { id: "portfolio", label: "Portfolio / Agência", icon: "◐" },
  { id: "dashboard", label: "Dashboard / Admin", icon: "▦" },
  { id: "blog", label: "Blog / Conteúdo", icon: "☰" },
  { id: "marketplace", label: "Marketplace", icon: "◈" },
  { id: "other", label: "Outro", icon: "✦" },
];

const AESTHETICS = [
  { id: "modern-clean", label: "Modern Clean", color: "from-blue-500/20 to-cyan-500/20" },
  { id: "brutalist", label: "Brutalist", color: "from-orange-500/20 to-red-500/20" },
  { id: "minimal-swiss", label: "Minimal Swiss", color: "from-gray-500/20 to-slate-500/20" },
  { id: "glassmorphism", label: "Glassmorphism", color: "from-purple-500/20 to-pink-500/20" },
  { id: "dark-premium", label: "Dark Premium", color: "from-zinc-700/30 to-zinc-900/30" },
  { id: "editorial-serif", label: "Editorial Serif", color: "from-amber-500/20 to-yellow-500/20" },
  { id: "3d-immersive", label: "3D / Immersive", color: "from-indigo-500/20 to-violet-500/20" },
  { id: "playful-colorful", label: "Playful / Colorful", color: "from-green-500/20 to-emerald-500/20" },
  { id: "corporate-trust", label: "Corporate Trust", color: "from-blue-600/20 to-indigo-600/20" },
  { id: "ai-futuristic", label: "AI / Futuristic", color: "from-cyan-500/20 to-blue-500/20" },
];

const MOODS = ["Profissional", "Criativo", "Luxo", "Techy", "Amigável", "Ousado", "Minimalista"];

const COLOR_PRESETS = [
  { id: "auto", label: "Auto", color1: "#5E6AD2", color2: "#8B5CF6" },
  { id: "modern-blue", label: "Modern Blue", color1: "#2563EB", color2: "#3B82F6" },
  { id: "violet-ai", label: "Violet AI", color1: "#8B5CF6", color2: "#22D3EE" },
  { id: "emerald-fresh", label: "Emerald", color1: "#10B981", color2: "#34D399" },
  { id: "neutral-premium", label: "Neutral Premium", color1: "#18181B", color2: "#71717A" },
  { id: "warm-coral", label: "Warm Coral", color1: "#F97316", color2: "#FB923C" },
  { id: "dark-premium", label: "Dark Premium", color1: "#0A0A0B", color2: "#5E6AD2" },
  { id: "soft-pastel", label: "Soft Pastel", color1: "#FDA4AF", color2: "#A78BFA" },
  { id: "high-contrast", label: "High Contrast", color1: "#000000", color2: "#00FF88" },
  { id: "monochrome", label: "Monochrome", color1: "#1A1A1A", color2: "#A1A1AA" },
];

const TYPOGRAPHY_PRESETS = [
  { id: "auto", label: "Auto (Perfect Combo)", desc: "IA escolhe o combo ideal" },
  { id: "modern-sans", label: "Modern Sans", desc: "Inter / Geist / Plus Jakarta" },
  { id: "geometric", label: "Geometric", desc: "Satoshi / General Sans" },
  { id: "humanist", label: "Humanist", desc: "SWitzer / Instrument Sans" },
  { id: "editorial-serif", label: "Editorial Serif", desc: "Georgia + Sans limpa" },
  { id: "mono-tech", label: "Mono / Tech", desc: "Geist Mono / JetBrains" },
];

// Fonts populares para I'm Lucky
const FONTS_POOL = [
  { heading: "Geist", body: "Inter", mono: "Geist Mono" },
  { heading: "Plus Jakarta Sans", body: "Inter", mono: "JetBrains Mono" },
  { heading: "Satoshi", body: "General Sans", mono: "Geist Mono" },
  { heading: "Cabinet Grotesk", body: "SWitzer", mono: "Space Mono" },
  { heading: "Clash Display", body: "Inter", mono: "Geist Mono" },
  { heading: "Instrument Sans", body: "Instrument Sans", mono: "JetBrains Mono" },
  { heading: "General Sans", body: "Inter", mono: "Space Mono" },
  { heading: "Bricolage Grotesque", body: "Inter", mono: "Geist Mono" },
  { heading: "Outfit", body: "Inter", mono: "JetBrains Mono" },
  { heading: "Space Grotesk", body: "Inter", mono: "Space Mono" },
  { heading: "Sora", body: "Inter", mono: "Geist Mono" },
  { heading: "Unbounded", body: "Inter", mono: "JetBrains Mono" },
  { heading: "Syne", body: "Inter", mono: "Space Mono" },
  { heading: "Onest", body: "Onest", mono: "Geist Mono" },
  { heading: "Hanken Grotesk", body: "Hanken Grotesk", mono: "JetBrains Mono" },
];

const STACK_PREFS = [
  { id: "auto", label: "Auto (Recomendado)", desc: "IA escolhe a melhor" },
  { id: "modern", label: "Modern Frontend", desc: "Next.js + React + Tailwind + shadcn" },
  { id: "fullstack", label: "Full-stack JS", desc: "Next.js + API + DB" },
  { id: "supabase", label: "Supabase Full", desc: "Auth+DB+Storage+Realtime" },
  { id: "ai-first", label: "AI-First", desc: "Next.js + Vercel AI SDK" },
  { id: "python", label: "Python / FastAPI", desc: "Backend Python" },
  { id: "custom", label: "Custom", desc: "Especificar no briefing" },
];

const STACK_COMBO_CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "saas", label: "SaaS" },
  { id: "ai", label: "AI" },
  { id: "indie", label: "Indie" },
  { id: "enterprise", label: "Enterprise" },
  { id: "commerce", label: "Commerce" },
  { id: "python", label: "Python" },
  { id: "mobile", label: "Mobile" },
  { id: "content", label: "Content" },
];

const COMBO_BADGES: Record<string, { label: string; color: string }> = {
  recommended: { label: "⭐ Mais usado", color: "bg-yellow-500/20 text-yellow-400" },
  trending: { label: "🔥 Trending", color: "bg-purple-500/20 text-purple-400" },
  speed: { label: "⚡ Mais rápido", color: "bg-blue-500/20 text-blue-400" },
  budget: { label: "💸 Mais barato", color: "bg-green-500/20 text-green-400" },
  enterprise: { label: "🏢 Melhor B2B", color: "bg-amber-500/20 text-amber-400" },
};

const INTEGRATIONS = [
  { id: "auth", label: "Auth (Clerk/Supabase)" },
  { id: "payments", label: "Pagamentos (Stripe)" },
  { id: "database", label: "Database (Supabase)" },
  { id: "email", label: "Email (Resend)" },
  { id: "analytics", label: "Analytics" },
  { id: "cms", label: "CMS" },
  { id: "ai", label: "AI Features" },
  { id: "i18n", label: "Multi-idioma" },
];

const LEVELS = [
  { id: "mvp", label: "MVP", desc: "Essencial, rápido" },
  { id: "production", label: "Produção", desc: "Awwwards-ready" },
  { id: "enterprise", label: "Enterprise", desc: "Máxima robustez" },
];

export function SimpleForge({ value, onChange, onSubmit, isLoading, onSwitchToAdvanced }: SimpleForgeProps) {
  const [showExtras, setShowExtras] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showFontPopup, setShowFontPopup] = useState(false);
  const [stackComboFilter, setStackComboFilter] = useState("all");
  const [showSecretMotion, setShowSecretMotion] = useState(false);

  const toggleArray = useCallback((key: "references" | "mood" | "integrations", item: string) => {
    const arr = value[key];
    if (arr.includes(item)) {
      onChange({ [key]: arr.filter((i) => i !== item) } as Partial<SimpleForgeValues>);
    } else {
      onChange({ [key]: [...arr, item] } as Partial<SimpleForgeValues>);
    }
  }, [value, onChange]);

  // I'm Lucky — escolhe font aleatória
  const imLuckyFont = useCallback(() => {
    const pool = FONTS_POOL.filter(
      (f) => f.heading !== value.fontHeading
    );
    const random = pool[Math.floor(Math.random() * pool.length)];
    onChange({
      fontHeading: random.heading,
      fontBody: random.body,
      fontMono: random.mono,
      typographyPref: "auto",
    });
    toast.success(`I'm Lucky! ${random.heading} + ${random.body} + ${random.mono}`);
  }, [value.fontHeading, onChange]);

  // Filtar stack combos
  const filteredStackCombos = useMemo(() => {
    if (stackComboFilter === "all") return CATALOG.stackCombos;
    return CATALOG.stackCombos.filter((c) => c.category === stackComboFilter);
  }, [stackComboFilter]);

  // Cor ativa para preview
  const activeColorPreset = COLOR_PRESETS.find((c) => c.id === value.colorPreset) ?? COLOR_PRESETS[0];
  const previewBg = value.palette === "light" ? "#F8FAFC" : value.palette === "dark" ? "#0A0A0B" : activeColorPreset.color1;
  const previewFg = value.palette === "light" ? "#0F172A" : "#FAFAFA";
  const previewAccent = activeColorPreset.color1;

  // CSS filter para ajustes
  const previewFilter = `brightness(${1 + value.colorAdjust.brightness / 100}) contrast(${1 + value.colorAdjust.contrast / 100}) saturate(${1 + value.colorAdjust.saturation / 100})`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Briefing */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="simple-briefing" className="text-sm font-semibold">Briefing do projeto <span className="text-primary">*</span></Label>
          <button type="button" onClick={() => toast.info("A IA vai detetar nicho, tom, público e stack automaticamente.")} className="flex items-center gap-1 text-[10px] text-primary hover:underline">
            <Lightbulb className="h-3 w-3" /> Auto-detetar a partir do briefing
          </button>
        </div>
        <Textarea
          id="simple-briefing"
          value={value.briefing}
          onChange={(e) => onChange({ briefing: e.target.value })}
          placeholder="Ex: Estou a criar uma plataforma SaaS B2B para gestão de equipas remotas. O público-alvo são CTOs e Head of Ops de startups em fase Series A-B..."
          className="min-h-[140px] resize-y border-border bg-card/50 text-sm leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">{value.briefing.length} caracteres · mínimo 20</p>
      </motion.div>

      {/* Referências */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Referências (opcional, máx 3)</Label>
        <div className="space-y-1.5">
          {value.references.map((ref, i) => (
            <div key={i} className="flex gap-1.5">
              <input type="url" value={ref} onChange={(e) => { const refs = [...value.references]; refs[i] = e.target.value; onChange({ references: refs }); }} placeholder="https://exemplo.com" className="flex-1 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs" />
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onChange({ references: value.references.filter((_, idx) => idx !== i) })}><Trash2 className="h-3 w-3" /></Button>
            </div>
          ))}
          {value.references.length < 3 && (
            <Button type="button" variant="outline" size="sm" onClick={() => onChange({ references: [...value.references, ""] })} className="h-7 gap-1 border-dashed text-[11px]"><Plus className="h-3 w-3" /> Adicionar referência</Button>
          )}
        </div>
      </div>

      {/* Tipo de Projeto */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Tipo de Projeto</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PROJECT_TYPES.map((pt) => (
            <button key={pt.id} type="button" onClick={() => onChange({ projectType: pt.id })}
              className={cn("flex flex-col items-center gap-1 rounded-xl border p-3 transition-all", value.projectType === pt.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card/30 hover:border-primary/40")}>
              <span className="text-lg font-light text-primary">{pt.icon}</span>
              <span className="text-[11px] font-medium leading-tight text-center">{pt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Estilo Visual */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Estilo Visual</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {AESTHETICS.map((a) => (
            <button key={a.id} type="button" onClick={() => onChange({ aesthetic: a.id })}
              className={cn("relative overflow-hidden rounded-xl border p-3 transition-all", value.aesthetic === a.id ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40")}>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", a.color)} />
              <div className="relative text-[10px] font-semibold leading-tight">{a.label}</div>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map((m) => (
            <button key={m} type="button" onClick={() => toggleArray("mood", m)}
              className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all", value.mood.includes(m) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card/30 text-muted-foreground hover:border-primary/40")}>{m}</button>
          ))}
        </div>
      </div>

      {/* Cores & Tipografia com Preview + Ajustes + I'm Lucky + Popups */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Cores & Tipografia</Label>
          <button type="button" onClick={() => setShowColorPopup(!showColorPopup)}
            className="flex items-center gap-1 text-[10px] text-primary hover:underline">
            <Eye className="h-3 w-3" /> {showColorPopup ? "Fechar preview" : "Ver preview"}
          </button>
        </div>

        {/* Modo de cor + swatches */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Modo:</span>
          {(["auto", "light", "dark", "brand"] as const).map((p) => (
            <button key={p} type="button" onClick={() => onChange({ palette: p })}
              className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium capitalize transition-all", value.palette === p ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted")}>
              {p === "auto" ? "Auto" : p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COLOR_PRESETS.map((cp) => (
            <button key={cp.id} type="button" onClick={() => onChange({ colorPreset: cp.id })}
              className={cn("group relative overflow-hidden rounded-lg border-2 p-0.5 transition-all", value.colorPreset === cp.id ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40")}
              title={cp.label}>
              <div className="h-6 w-6 rounded-md" style={{ background: `linear-gradient(135deg, ${cp.color1}, ${cp.color2})` }} />
            </button>
          ))}
        </div>

        {/* Ajustes de cor (brilho, contraste, saturação) */}
        <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card/20 p-2">
          <Slider label="Brilho" value={value.colorAdjust.brightness} onChange={(v) => onChange({ colorAdjust: { ...value.colorAdjust, brightness: v } })} />
          <Slider label="Contraste" value={value.colorAdjust.contrast} onChange={(v) => onChange({ colorAdjust: { ...value.colorAdjust, contrast: v } })} />
          <Slider label="Saturação" value={value.colorAdjust.saturation} onChange={(v) => onChange({ colorAdjust: { ...value.colorAdjust, saturation: v } })} />
        </div>

        {/* Cores personalizadas — opção + (máx 4, combos de 3-4) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Cores personalizadas (máx 4 · ideal 3)</span>
            {value.customColors.length < 4 && (
              <button type="button" onClick={() => {
                const roles = ["Background", "Secundária", "Suporte", "Destaque"];
                onChange({ customColors: [...value.customColors, { hex: "#5E6AD2", role: roles[value.customColors.length] ?? "Extra" }] });
              }} className="flex items-center gap-0.5 text-[10px] text-primary hover:underline">
                <Plus className="h-3 w-3" /> Adicionar cor
              </button>
            )}
          </div>
          {value.customColors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {value.customColors.map((cc, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-card/30 p-1">
                  <input type="color" value={cc.hex} onChange={(e) => {
                    const colors = [...value.customColors]; colors[i] = { ...colors[i], hex: e.target.value };
                    onChange({ customColors: colors });
                  }} className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent" />
                  <span className="text-[9px] text-muted-foreground">{cc.role}</span>
                  <button type="button" onClick={() => onChange({ customColors: value.customColors.filter((_, idx) => idx !== i) })} className="text-muted-foreground hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {value.customColors.length > 0 && (
            <p className="text-[9px] text-muted-foreground">
              Distribuição ideal: 60% bg · 20% secundária · 10% suporte · 10% destaque
            </p>
          )}
        </div>

        {/* Tipografia + I'm Lucky */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Tipografia:</span>
          <div className="flex flex-1 flex-wrap gap-1">
            {TYPOGRAPHY_PRESETS.map((tp) => (
              <button key={tp.id} type="button" onClick={() => onChange({ typographyPref: tp.id as SimpleForgeValues["typographyPref"] })}
                className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium transition-all", value.typographyPref === tp.id ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted")}>
                {tp.label}
              </button>
            ))}
          </div>
          <Button type="button" size="sm" variant="outline" onClick={imLuckyFont} className="h-7 gap-1 text-[10px] shrink-0" title="Escolhe font aleatória de bibliotecas online">
            <Dices className="h-3 w-3" /> I'm Lucky
          </Button>
        </div>

        {/* Preview de font escolhida + opção + para fonts personalizadas (máx 3) */}
        <div className="rounded-lg border border-border bg-card/20 p-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Heading: {value.fontHeading || "Auto"}</span>
            <span>Body: {value.fontBody || "Auto"}</span>
            <span>Mono: {value.fontMono || "Auto"}</span>
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-xl font-bold" style={{ fontFamily: value.fontHeading || "inherit" }}>The quick brown fox</div>
            <div className="text-sm" style={{ fontFamily: value.fontBody || "inherit" }}>jumps over the lazy dog — 0123456789</div>
            <div className="text-xs font-mono" style={{ fontFamily: value.fontMono || "monospace" }}>const hello = "world";</div>
          </div>

          {/* Fonts personalizadas — opção + (máx 3) */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {value.customFonts.map((font, i) => (
              <div key={i} className="flex items-center gap-1 rounded-md border border-border bg-card/30 px-1.5 py-0.5">
                <span className="text-[9px]" style={{ fontFamily: font }}>{font}</span>
                <button type="button" onClick={() => onChange({ customFonts: value.customFonts.filter((_, idx) => idx !== i) })} className="text-muted-foreground hover:text-destructive">
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            {value.customFonts.length < 3 && (
              <div className="flex items-center gap-1">
                <input type="text" placeholder="Nome da font" onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) {
                      onChange({ customFonts: [...value.customFonts, val] });
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }} className="w-24 rounded-md border border-border bg-card/50 px-1.5 py-0.5 text-[9px]" />
                <button type="button" onClick={() => {
                  const input = document.querySelector('input[placeholder="Nome da font"]') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    onChange({ customFonts: [...value.customFonts, input.value.trim()] });
                    input.value = "";
                  }
                }} className="flex items-center gap-0.5 text-[10px] text-primary hover:underline">
                  <Plus className="h-3 w-3" /> Font
                </button>
              </div>
            )}
            {value.customFonts.length > 0 && (
              <span className="text-[9px] text-muted-foreground">Máx 3 fonts (1 heading + 1 body + 1 mono)</span>
            )}
          </div>

          <button type="button" onClick={() => setShowFontPopup(!showFontPopup)} className="mt-2 flex items-center gap-1 text-[10px] text-primary hover:underline">
            <Layers className="h-3 w-3" /> {showFontPopup ? "Fechar" : "Expandir"} mockup tipografia
          </button>
        </div>

        {/* Preview expandido de Cores (popup mockup website) */}
        <AnimatePresence>
          {showColorPopup && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="rounded-xl border-2 border-border p-4" style={{ background: previewBg, color: previewFg, filter: previewFilter }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ fontFamily: value.fontHeading || "inherit" }}>Logo / Brand</span>
                  <button type="button" onClick={() => setShowColorPopup(false)} className="rounded p-1 text-xs opacity-60 hover:opacity-100"><X className="h-3 w-3" /></button>
                </div>
                <div className="mt-4 space-y-3">
                  <h2 className="text-2xl font-extrabold" style={{ fontFamily: value.fontHeading || "inherit" }}>Forja projetos production-ready</h2>
                  <p className="text-sm opacity-80" style={{ fontFamily: value.fontBody || "inherit" }}>Análise de nicho, paleta WCAG-AA, tipografia, design tokens — tudo em segundos.</p>
                  <div className="flex gap-2">
                    <button className="rounded-lg px-4 py-2 text-xs font-semibold" style={{ background: previewAccent, color: "#fff" }}>Get Started →</button>
                    <button className="rounded-lg border px-4 py-2 text-xs font-semibold" style={{ borderColor: previewFg, color: previewFg }}>Learn more</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Feature 1", color: previewAccent },
                      { label: "Feature 2", color: activeColorPreset.color2 },
                      { label: "Feature 3", color: previewFg },
                    ].map((f, i) => (
                      <div key={i} className="rounded-lg border p-2" style={{ borderColor: previewFg + "33" }}>
                        <div className="h-6 w-6 rounded-full" style={{ background: f.color }} />
                        <div className="mt-1 text-[10px] font-semibold">{f.label}</div>
                        <div className="text-[9px] opacity-60">Description text</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview expandido de Tipografia (popup mockup maior) */}
        <AnimatePresence>
          {showFontPopup && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="rounded-xl border-2 border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Mockup Tipografia</span>
                  <button type="button" onClick={() => setShowFontPopup(false)} className="rounded p-1 text-xs text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                </div>
                <div className="mt-3 space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Heading (H1)</div>
                    <div className="text-4xl font-extrabold" style={{ fontFamily: value.fontHeading || "inherit" }}>The quick brown fox jumps</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Heading (H2)</div>
                    <div className="text-2xl font-bold" style={{ fontFamily: value.fontHeading || "inherit" }}>Over the lazy dog</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Body Text</div>
                    <div className="text-sm leading-relaxed" style={{ fontFamily: value.fontBody || "inherit" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mono / Code</div>
                    <div className="text-xs font-mono" style={{ fontFamily: value.fontMono || "monospace" }}>const inaugura = await generate(&#123; brief, stack, palette &#125;);</div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Sparkles className="h-3 w-3" /> Combo: {value.fontHeading || "Auto"} + {value.fontBody || "Auto"} + {value.fontMono || "Auto"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stack & Combos — organizado por categoria com expand/recolher */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Stack & Combos</Label>
        {/* Preferência de stack */}
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {STACK_PREFS.map((s) => (
            <button key={s.id} type="button" onClick={() => onChange({ stackPref: s.id as SimpleForgeValues["stackPref"] })}
              className={cn("flex items-center gap-2 rounded-lg border p-2 text-left transition-all", value.stackPref === s.id ? "border-primary bg-primary/10" : "border-border bg-card/30 hover:border-primary/40")}>
              <div className="flex-1"><div className="text-[11px] font-semibold">{s.label}</div><div className="text-[10px] text-muted-foreground">{s.desc}</div></div>
            </button>
          ))}
        </div>

        {/* Filtros por categoria — clicar expande/recolhe essa categoria */}
        <div className="space-y-1.5">
          {STACK_COMBO_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const combos = CATALOG.stackCombos.filter((c) => c.category === cat.id);
            if (combos.length === 0) return null;
            const isExpanded = stackComboFilter === cat.id;
            return (
              <div key={cat.id} className="overflow-hidden rounded-lg border border-border bg-card/20">
                <button type="button" onClick={() => setStackComboFilter(isExpanded ? "all" : cat.id)}
                  className="flex w-full items-center justify-between p-2 hover:bg-accent/5">
                  <span className="text-[11px] font-semibold">{cat.label} <span className="text-muted-foreground">({combos.length})</span></span>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border p-1.5">
                      <div className="grid grid-cols-1 gap-1.5">
                        {combos.map((combo) => {
                          const isActive = value.stackCombo === combo.id;
                          const badge = combo.badge ? COMBO_BADGES[combo.badge] : null;
                          return (
                            <button key={combo.id} type="button" onClick={() => onChange({ stackCombo: isActive ? "" : combo.id })}
                              className={cn("flex flex-col gap-1 rounded-lg border p-2 text-left transition-all", isActive ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card/30 hover:border-primary/40")}>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold">{combo.name}</span>
                                {badge && <span className={cn("rounded px-1 py-0.5 text-[8px] font-bold", badge.color)}>{badge.label}</span>}
                              </div>
                              <span className="text-[9px] text-muted-foreground line-clamp-2">{combo.stack}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motion & Awwwards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Motion & Awwwards</Label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input type="checkbox" checked={value.animations} onChange={(e) => onChange({ animations: e.target.checked })} className="h-3.5 w-3.5 rounded" />
            <span className="text-[11px] font-medium">Ativar</span>
          </label>
        </div>
        {value.animations && (
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {CATALOG.motionCombos.map((mc) => {
              const isActive = value.motionCombo === mc.id;
              return (
                <button key={mc.id} type="button" onClick={() => onChange({ motionCombo: isActive ? "" : mc.id })}
                  className={cn("flex flex-col gap-1 rounded-lg border p-2 text-left transition-all", isActive ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card/30 hover:border-primary/40")}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold">{mc.name}</span>
                    <span className="text-[8px] text-muted-foreground">{"⭐".repeat(mc.complexity)}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground line-clamp-2">{mc.feeling}</span>
                </button>
              );
            })}
          </div>
        )}
        {value.animations && (
          <div>
            <button type="button" onClick={() => setShowSecretMotion(!showSecretMotion)} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
              <Lock className="h-3 w-3" /> {showSecretMotion ? "Ocultar" : "Mostrar"} Combos Secretos (Elite)
            </button>
            <AnimatePresence>
              {showSecretMotion && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {CATALOG.secretMotionCombos.map((mc) => {
                      const isActive = value.motionCombo === mc.id;
                      return (
                        <button key={mc.id} type="button" onClick={() => onChange({ motionCombo: isActive ? "" : mc.id })}
                          className={cn("flex flex-col gap-1 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-left transition-all", isActive ? "border-amber-500 ring-1 ring-amber-500" : "hover:border-amber-500/40")}>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-amber-400">{mc.name}</span>
                            <span className="text-[8px] text-amber-500/60">{"⭐".repeat(mc.complexity)}</span>
                          </div>
                          <span className="text-[9px] text-muted-foreground line-clamp-2">{mc.feeling}</span>
                          {mc.rarity && <span className="text-[8px] italic text-amber-500/50">🔒 {mc.rarity}</span>}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Integrações */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Integrações Essenciais</Label>
        <div className="flex flex-wrap gap-1.5">
          {INTEGRATIONS.map((i) => (
            <button key={i.id} type="button" onClick={() => toggleArray("integrations", i.id)}
              className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all", value.integrations.includes(i.id) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card/30 text-muted-foreground hover:border-primary/40")}>
              {i.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mais opções */}
      <div className="rounded-xl border border-border bg-card/20">
        <button type="button" onClick={() => setShowExtras(!showExtras)} className="flex w-full items-center justify-between p-3">
          <span className="text-xs font-semibold text-muted-foreground">Mais opções (idioma, nível)</span>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showExtras && "rotate-180")} />
        </button>
        <AnimatePresence>
          {showExtras && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border p-3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Idioma:</span>
                {(["pt", "en"] as const).map((l) => (
                  <button key={l} type="button" onClick={() => onChange({ idioma: l })} className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", value.idioma === l ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground")}>{l}</button>
                ))}
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground">Nível:</span>
                <div className="mt-1 grid grid-cols-3 gap-1.5">
                  {LEVELS.map((lv) => (
                    <button key={lv.id} type="button" onClick={() => onChange({ level: lv.id as SimpleForgeValues["level"] })}
                      className={cn("rounded-lg border p-2 text-center transition-all", value.level === lv.id ? "border-primary bg-primary/10" : "border-border bg-card/30 hover:border-primary/40")}>
                      <div className="text-[11px] font-semibold">{lv.label}</div>
                      <div className="text-[9px] text-muted-foreground">{lv.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gerar Pack */}
      <div className="space-y-2">
        <Button type="button" onClick={onSubmit} disabled={isLoading || value.briefing.length < 20}
          className="group relative w-full overflow-hidden bg-primary py-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] disabled:opacity-50">
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Wand2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
            {isLoading ? "A gerar pack…" : "Gerar Pack"}
            {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </span>
        </Button>
        {value.briefing.length < 20 && <p className="text-center text-xs text-muted-foreground">Escreve pelo menos 20 caracteres no briefing.</p>}
        <button type="button" onClick={onSwitchToAdvanced} className="flex w-full items-center justify-center gap-1.5 py-2 text-[11px] text-muted-foreground hover:text-foreground">
          <Zap className="h-3 w-3" /> Precisas de controlo total? Mudar para versão Avançada
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Slider component para ajustes de cor
// ============================================================================
function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-16">{label}</span>
      <input type="range" min={-50} max={50} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-muted accent-primary" />
      <span className="text-[9px] text-muted-foreground w-6">{value > 0 ? "+" : ""}{value}</span>
    </div>
  );
}
