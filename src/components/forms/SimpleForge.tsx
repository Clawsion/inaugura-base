"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sparkles, Lightbulb, Plus, Trash2, ChevronDown, Wand2, ArrowRight,
  Dices, Eye, X, Layers, Zap, Lock, RefreshCw, Palette, Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CATALOG } from "@/lib/catalog";
import { adjustColor, generatePalette, hexToHsl, hslToHex, COLOR_TRENDS_2026 } from "@/lib/color-engine";

export interface SimpleForgeValues {
  briefing: string;
  nicho: string;
  references: string[];
  projectType: string;
  aesthetic: string;
  aestheticLocked: boolean;
  mood: string[];
  palette: "auto" | "light" | "dark" | "brand";
  colorPreset: string;
  colorCount: 2 | 3 | 4;
  colorAdjust: { brightness: number; contrast: number; saturation: number; hue: number };
  customColors: { hex: string; role: string }[];
  typographyPref: "auto" | "modern-sans" | "geometric" | "humanist" | "editorial-serif" | "mono-tech";
  fontHeading: string;
  fontBody: string;
  fontMono: string;
  fontLocked: { heading: boolean; body: boolean; mono: boolean };
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

// Ícones minimalistas
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

const TYPOGRAPHY_PRESETS = [
  { id: "auto", label: "Auto (Perfect Combo)" },
  { id: "modern-sans", label: "Modern Sans" },
  { id: "geometric", label: "Geometric" },
  { id: "humanist", label: "Humanist" },
  { id: "editorial-serif", label: "Editorial Serif" },
  { id: "mono-tech", label: "Mono / Tech" },
];

// Lista de fonts para seleção manual (ativas nos melhores sites 2026)
const ALL_FONTS = [
  "Geist", "Inter", "Plus Jakarta Sans", "Satoshi", "General Sans",
  "Instrument Sans", "SWitzer", "Cabinet Grotesk", "Clash Display",
  "Outfit", "Space Grotesk", "Sora", "Syne", "Onest", "Hanken Grotesk",
  "Unbounded", "Bricolage Grotesque", "Geist Mono", "JetBrains Mono", "Space Mono",
  // Fontshare (biblioteca online premium — infinitas possibilidades)
  "Pixer", "Roxboro", "TT Commons Pro", "Suprapower", "Satoshi Variable",
  "Migra", "Familjen Grotesk", "Hubot Sans", "Mona Sans", "Mier Book",
  // Google Fonts (variable, moderno)
  "Figtree", "DM Sans", "Manrope", "Albert Sans", "Be Vietnam Pro",
  "Lexend", "Schibsted Grotesk", "Anybody", "Big Shoulders Display",
  "Archivo", "Fraunces", "Newsreader", "Bricolage Grotesque",
];

// Combos de fonts predefinidos (Perfect Combos) — expandido para I'm Lucky infinito
const FONT_COMBOS = [
  { heading: "Geist", body: "Inter", mono: "Geist Mono" },
  { heading: "Plus Jakarta Sans", body: "Inter", mono: "JetBrains Mono" },
  { heading: "Satoshi", body: "General Sans", mono: "Geist Mono" },
  { heading: "Cabinet Grotesk", body: "SWitzer", mono: "Space Mono" },
  { heading: "Clash Display", body: "Inter", mono: "Geist Mono" },
  { heading: "Outfit", body: "Inter", mono: "JetBrains Mono" },
  { heading: "Space Grotesk", body: "Inter", mono: "Space Mono" },
  { heading: "Sora", body: "Inter", mono: "Geist Mono" },
  { heading: "Syne", body: "Inter", mono: "JetBrains Mono" },
  { heading: "Bricolage Grotesque", body: "Inter", mono: "Geist Mono" },
  { heading: "Unbounded", body: "Inter", mono: "Space Mono" },
  { heading: "Hanken Grotesk", body: "Hanken Grotesk", mono: "JetBrains Mono" },
  { heading: "Figtree", body: "Figtree", mono: "Geist Mono" },
  { heading: "DM Sans", body: "DM Sans", mono: "JetBrains Mono" },
  { heading: "Manrope", body: "Manrope", mono: "Space Mono" },
  { heading: "Albert Sans", body: "Albert Sans", mono: "Geist Mono" },
  { heading: "Lexend", body: "Lexend", mono: "JetBrains Mono" },
  { heading: "Archivo", body: "Inter", mono: "Geist Mono" },
  { heading: "Fraunces", body: "Inter", mono: "JetBrains Mono" },
  { heading: "Newsreader", body: "Inter", mono: "Space Mono" },
  { heading: "Hubot Sans", body: "Inter", mono: "Geist Mono" },
  { heading: "Mona Sans", body: "Mona Sans", mono: "JetBrains Mono" },
  { heading: "Suprapower", body: "Inter", mono: "Space Mono" },
  { heading: "Pixer", body: "Inter", mono: "Geist Mono" },
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

// Filtros por tipo de website para paletes de cor
const PALETTE_FILTERS = [
  { id: "all", label: "Todos" },
  { id: "saas", label: "SaaS" },
  { id: "ai", label: "AI/Tech" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "luxury", label: "Luxo" },
  { id: "wellness", label: "Wellness" },
  { id: "brutalist", label: "Brutalist" },
  { id: "gaming", label: "Gaming" },
  { id: "corporate", label: "Corporate" },
  { id: "creative", label: "Creative" },
  { id: "minimal", label: "Minimal" },
];

// Mapear tendências para filtros
const TREND_FILTERS: Record<string, string[]> = {
  "electric-lavender": ["ai", "saas"],
  "terminal-green": ["brutalist", "ai"],
  "sunset-coral": ["ecommerce", "wellness"],
  "nordic-ice": ["saas", "corporate"],
  "obsidian-gold": ["luxury"],
  "matrix-amber": ["brutalist", "gaming"],
  "soft-sage": ["wellness"],
  "cyber-magenta": ["gaming", "creative"],
  "muted-clay": ["ecommerce", "creative"],
  "deep-ocean": ["corporate", "saas"],
  "neon-punk": ["creative", "gaming"],
  "pure-mono": ["minimal", "corporate"],
};

export function SimpleForge({ value, onChange, onSubmit, isLoading, onSwitchToAdvanced }: SimpleForgeProps) {
  const [showExtras, setShowExtras] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showFontPopup, setShowFontPopup] = useState(false);
  const [expandedStackGroup, setExpandedStackGroup] = useState<string | null>(null);
  const [showSecretMotion, setShowSecretMotion] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState("all");
  const [colorEditIndex, setColorEditIndex] = useState<number | null>(null);

  const toggleArray = useCallback((key: "references" | "mood" | "integrations", item: string) => {
    const arr = value[key];
    if (arr.includes(item)) {
      onChange({ [key]: arr.filter((i) => i !== item) } as Partial<SimpleForgeValues>);
    } else {
      onChange({ [key]: [...arr, item] } as Partial<SimpleForgeValues>);
    }
  }, [value, onChange]);

  // I'm Lucky — escolhe combo de font aleatório (respeita locks)
  const imLuckyFont = useCallback(() => {
    const pool = FONT_COMBOS.filter((f) => {
      // Se heading está locked, não muda heading
      if (value.fontLocked.heading && f.heading !== value.fontHeading) return false;
      if (value.fontLocked.body && f.body !== value.fontBody) return false;
      if (value.fontLocked.mono && f.mono !== value.fontMono) return false;
      return true;
    });
    if (pool.length === 0) {
      toast.info("Todas as fonts estão bloqueadas. Desbloqueia pelo menos uma.");
      return;
    }
    const random = pool[Math.floor(Math.random() * pool.length)];
    const patch: Partial<SimpleForgeValues> = { typographyPref: "auto" };
    if (!value.fontLocked.heading) patch.fontHeading = random.heading;
    if (!value.fontLocked.body) patch.fontBody = random.body;
    if (!value.fontLocked.mono) patch.fontMono = random.mono;
    onChange(patch);
    toast.success(`I'm Lucky! ${random.heading} + ${random.body} + ${random.mono}`);
  }, [value.fontHeading, value.fontBody, value.fontMono, value.fontLocked, onChange]);

  // Polimento — dá toque moderno à cor (ajusta HSL para tom premium visto em websites de topo)
  const polishColor = useCallback(() => {
    // Usa a cor atual (seja de customColors ou da tendência ativa)
    const currentColors: { hex: string; role: string }[] = value.customColors.length > 0
      ? value.customColors
      : (COLOR_TRENDS_2026.find((t) => t.id === value.colorPreset)?.colors ?? COLOR_TRENDS_2026[0].colors).map((hex, i) => ({ hex, role: ["Background", "Secundária", "Suporte", "Destaque"][i] ?? `Cor ${i + 1}` }));
    const baseHex = currentColors.find((_, i) => i === 2)?.hex ?? currentColors[0].hex;
    const hsl = hexToHsl(baseHex);
    const polishedSat = Math.max(55, Math.min(85, hsl.s + 10));
    const polishedLight = Math.max(40, Math.min(58, hsl.l));
    const polishedHex = hslToHex(hsl.h, polishedSat, polishedLight);
    const count = value.colorCount;
    const roles = ["Background", "Secundária", "Suporte", "Destaque"];
    const colors: { hex: string; role: string }[] = [];
    for (let i = 0; i < count; i++) {
      if (i === 0) colors.push({ hex: hslToHex(hsl.h, Math.max(8, polishedSat * 0.15), 6), role: roles[0] });
      else if (i === 1) colors.push({ hex: hslToHex(hsl.h, polishedSat * 0.1, 95), role: roles[1] });
      else if (i === 2) colors.push({ hex: polishedHex, role: roles[2] });
      else colors.push({ hex: hslToHex((hsl.h + 30) % 360, polishedSat, polishedLight + 5), role: roles[3] });
    }
    onChange({ customColors: colors });
    toast.success(`Polimento aplicado — tom premium ${polishedHex}`);
  }, [value.customColors, value.colorCount, value.colorPreset, onChange]);

  // Generate — gera variação infinita de uma palete
  const generatePaletteVariation = useCallback((trendId?: string) => {
    const trend = COLOR_TRENDS_2026.find((t) => t.id === trendId) ?? COLOR_TRENDS_2026[0];
    const baseColor = trend.colors[0];
    const hsl = hexToHsl(baseColor);
    // Varia hue aleatoriamente mantendo saturação e lightness
    const newHue = (hsl.h + Math.random() * 60 - 30 + 360) % 360;
    const newSat = Math.max(40, Math.min(90, hsl.s + (Math.random() * 20 - 10)));
    const newLight = Math.max(35, Math.min(65, hsl.l + (Math.random() * 10 - 5)));
    const newHex = hslToHex(newHue, newSat, newLight);
    // Gera paleta com colorCount cores
    const count = value.colorCount;
    const colors: { hex: string; role: string }[] = [];
    const roles = ["Background", "Secundária", "Suporte", "Destaque"];
    for (let i = 0; i < count; i++) {
      const h = (newHue + i * (360 / count)) % 360;
      const l = i === 0 ? 8 : i === 1 ? 90 : i === 2 ? 50 : 65;
      colors.push({ hex: hslToHex(h, newSat, l), role: roles[i] ?? `Cor ${i + 1}` });
    }
    onChange({ customColors: colors, colorPreset: trendId ?? value.colorPreset });
    toast.success(`Palete gerada: ${count} cores · ${hslToHex(newHue, newSat, newLight)}`);
  }, [value.colorCount, value.colorPreset, onChange]);

  // Paletes filtradas
  const filteredPalettes = useMemo(() => {
    if (paletteFilter === "all") return COLOR_TRENDS_2026;
    return COLOR_TRENDS_2026.filter((t) => (TREND_FILTERS[t.id] ?? []).includes(paletteFilter));
  }, [paletteFilter]);

  // Cor ativa para preview — SEMPRE usa customColors se existirem, senão gera da tendência
  const activePalette = useMemo(() => {
    if (value.customColors.length > 0) {
      return value.customColors.slice(0, value.colorCount);
    }
    const trend = COLOR_TRENDS_2026.find((t) => t.id === value.colorPreset) ?? COLOR_TRENDS_2026[0];
    return trend.colors.slice(0, value.colorCount).map((hex, i) => ({
      hex,
      role: ["Background", "Secundária", "Suporte", "Destaque"][i] ?? `Cor ${i + 1}`,
    }));
  }, [value.customColors, value.colorPreset, value.colorCount]);

  // Preview colors (sempre do tamanho colorCount) — actualizado em tempo real
  const previewColors = activePalette;
  const previewAccent = previewColors.find((c) => c.role === "Destaque")?.hex ?? previewColors[0]?.hex ?? "#5E6AD2";
  const previewBg = previewColors.find((c) => c.role === "Background")?.hex ?? previewColors[0]?.hex ?? "#0A0A0B";
  const previewText = previewColors.find((c) => c.role === "Secundária")?.hex ?? "#FAFAFA";
  const previewCard = previewColors.find((c) => c.role === "Suporte")?.hex ?? previewBg;
  const previewMuted = previewText;

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
        <Textarea id="simple-briefing" value={value.briefing} onChange={(e) => onChange({ briefing: e.target.value })}
          placeholder="Ex: Estou a criar uma plataforma SaaS B2B para gestão de equipas remotas. O público-alvo são CTOs e Head of Ops de startups em fase Series A-B..."
          className="min-h-[140px] resize-y border-border bg-card/50 text-sm leading-relaxed" />
        <p className="text-xs text-muted-foreground">{value.briefing.length} caracteres · mínimo 20</p>
      </motion.div>

      {/* Tipo de Negócio / Nicho — por baixo do briefing */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">Tipo de Negócio / Nicho</Label>
        <input type="text" value={value.nicho} onChange={(e) => onChange({ nicho: e.target.value })}
          placeholder="Ex: SaaS B2B, E-commerce moda, Restaurante, Agência criativa..."
          className="w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm" />
      </div>

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

      {/* Estilo Visual — com botão "Neon Auto" que liga recomendação inteligente */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Estilo Visual</Label>
          <button type="button"
            onClick={() => {
              const newLocked = !value.aestheticLocked;
              onChange({ aestheticLocked: newLocked });
              if (newLocked) {
                // Liga neon auto — recomenda estética com base no briefing/nicho/tipo
                const text = `${value.briefing} ${value.nicho} ${value.projectType}`.toLowerCase();
                let recommended = "modern-clean";
                let reason = "Default SaaS";
                if (/\bai\b|artificial|intelig|futur|ia\b|machine learning/.test(text)) { recommended = "ai-futuristic"; reason = "AI/Tech"; }
                else if (/luxo|premium|lux\b|jewel|gold|fine|exclusive/.test(text)) { recommended = "dark-premium"; reason = "Luxo/Premium"; }
                else if (/brutalist|raw\b|bold\b|underground|punk/.test(text)) { recommended = "brutalist"; reason = "Brutalist"; }
                else if (/edit|magazine|journal|news|revista/.test(text)) { recommended = "editorial-serif"; reason = "Editorial"; }
                else if (/minimal|swiss|clean\b|simple\b|minimalist/.test(text)) { recommended = "minimal-swiss"; reason = "Minimal"; }
                else if (/glass|blur|soft\b|translucent|frosted/.test(text)) { recommended = "glassmorphism"; reason = "Glassmorphism"; }
                else if (/3d|webgl|immersive|spatial|three\.js/.test(text)) { recommended = "3d-immersive"; reason = "3D/Immersive"; }
                else if (/playful|fun\b|colorful|kids|game|jogo/.test(text)) { recommended = "playful-colorful"; reason = "Playful"; }
                else if (/corporate|enterprise|business|b2b|trust|confian/.test(text)) { recommended = "corporate-trust"; reason = "Corporate"; }
                else if (/saas|dashboard|app\b|software|ferramenta/.test(text)) { recommended = "modern-clean"; reason = "SaaS/App"; }
                onChange({ aesthetic: recommended });
                toast.success(`Neon Auto ON — ${reason} → ${AESTHETICS.find(a => a.id === recommended)?.label}`);
              } else {
                toast.info("Neon Auto OFF — podes escolher manualmente");
              }
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold transition-all",
              value.aestheticLocked
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                : "border-border bg-card/50 text-muted-foreground hover:border-cyan-400/50"
            )}
            title="Liga recomendação automática de estética baseada no briefing/nicho"
          >
            <span className={cn("h-1.5 w-1.5 rounded-full transition-all", value.aestheticLocked ? "bg-cyan-400 animate-pulse" : "bg-muted-foreground")} />
            {value.aestheticLocked ? "NEON AUTO ON" : "Neon Auto"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {AESTHETICS.map((a) => (
            <button key={a.id} type="button" onClick={() => {
              if (value.aestheticLocked) {
                toast.info("Neon Auto está ON — desliga para escolher manualmente");
                return;
              }
              onChange({ aesthetic: a.id });
            }}
              className={cn(
                "relative overflow-hidden rounded-xl border p-3 transition-all",
                value.aesthetic === a.id
                  ? value.aestheticLocked
                    ? "border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                    : "border-primary ring-1 ring-primary"
                  : "border-border hover:border-primary/40",
                value.aestheticLocked && "cursor-not-allowed opacity-60"
              )}>
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", a.color)} />
              <div className="relative text-[10px] font-semibold leading-tight">{a.label}</div>
              {value.aestheticLocked && value.aesthetic === a.id && (
                <div className="absolute right-1 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-cyan-400">
                  <Lock className="h-2 w-2 text-black" />
                </div>
              )}
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PALETES DE CORES — 2/3/4 cores + filtro + generate + preview + edit  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Paletes de Cores</Label>
          <div className="flex items-center gap-1.5">
            {/* Seletor de número de cores: 2 / 3 / 4 */}
            <span className="text-[10px] text-muted-foreground">Cores:</span>
            {([2, 3, 4] as const).map((n) => (
              <button key={n} type="button" onClick={() => onChange({ colorCount: n })}
                className={cn("flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold transition-all", value.colorCount === n ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted")}>
                {n}
              </button>
            ))}
            {/* Generate global — gera palete infinita */}
            <Button type="button" size="sm" variant="outline" onClick={() => generatePaletteVariation()} className="h-6 gap-1 px-2 text-[10px]" title="Gerar palete aleatória infinita">
              <RefreshCw className="h-3 w-3" /> Generate
            </Button>
            {/* Polimento — dá toque moderno à cor (visto em websites de topo) */}
            <Button type="button" size="sm" variant="outline" onClick={() => polishColor()} className="h-6 gap-1 px-2 text-[10px]" title="Polimento — tom premium moderno">
              <Sparkles className="h-3 w-3" /> Polimento
            </Button>
          </div>
        </div>

        {/* Filtros por tipo de website */}
        <div className="flex flex-wrap gap-1">
          {PALETTE_FILTERS.map((f) => (
            <button key={f.id} type="button" onClick={() => setPaletteFilter(f.id)}
              className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium transition-all", paletteFilter === f.id ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted")}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid de paletes — cada uma com swatches + generate individual + botão expandir cor */}
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {filteredPalettes.map((trend) => {
            const isActive = value.colorPreset === trend.id;
            const colors = trend.colors.slice(0, value.colorCount);
            return (
              <div key={trend.id} className={cn("rounded-lg border p-2 transition-all", isActive ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card/30 hover:border-primary/40")}>
                <button type="button" onClick={() => onChange({ colorPreset: trend.id, customColors: [] })}
                  className="w-full text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold">{trend.name}</span>
                    <span className="text-[8px] text-muted-foreground">{trend.tags.slice(0, 2).join(" · ")}</span>
                  </div>
                </button>
                {/* Swatches — cada uma com ícone para editar individualmente */}
                <div className="mt-1.5 flex gap-1">
                  {colors.map((c, i) => (
                    <div key={i} className="group relative flex-1">
                      <div className="h-8 rounded-md" style={{ background: c }} />
                      {/* Ícone para ampliar cor individualmente */}
                      <button type="button" onClick={() => setColorEditIndex(colorEditIndex === i ? null : i)}
                        className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-bl-md rounded-tr-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                        title="Editar cor individual">
                        <Maximize2 className="h-2.5 w-2.5 text-white" />
                      </button>
                    </div>
                  ))}
                  {/* Generate individual */}
                  <button type="button" onClick={() => generatePaletteVariation(trend.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    title="Gerar variação desta palete">
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
                {/* Editor de cor individual (popup inline) — com botão OK para confirmar */}
                <AnimatePresence>
                  {colorEditIndex !== null && isActive && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-1.5 overflow-hidden rounded-md border border-border bg-card/50 p-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-muted-foreground">Cor {colorEditIndex + 1}:</span>
                          <input type="color" value={previewColors[colorEditIndex]?.hex ?? "#5E6AD2"}
                            onChange={(e) => {
                              // Atualiza imediatamente — persiste em customColors
                              const newColors = [...value.customColors];
                              while (newColors.length <= colorEditIndex) newColors.push({ hex: "#5E6AD2", role: "" });
                              newColors[colorEditIndex] = { hex: e.target.value, role: ["Background", "Secundária", "Suporte", "Destaque"][colorEditIndex] ?? `Cor ${colorEditIndex + 1}` };
                              onChange({ customColors: newColors });
                            }}
                            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent" />
                          <code className="text-[9px] text-muted-foreground">{previewColors[colorEditIndex]?.hex ?? "#5E6AD2"}</code>
                          <Button type="button" size="sm" onClick={() => { setColorEditIndex(null); toast.success("Cor aplicada ao mockup"); }} className="h-5 gap-1 px-2 text-[9px]">OK</Button>
                          <button type="button" onClick={() => setColorEditIndex(null)} className="ml-auto text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                        </div>
                        {/* Sliders HSL individuais */}
                        <div className="flex flex-wrap gap-2">
                          <MiniSlider label="H" defaultValue={Math.round(hexToHsl(previewColors[colorEditIndex]?.hex ?? "#5E6AD2").h)} onChange={(v) => {
                            const hsl = hexToHsl(previewColors[colorEditIndex]?.hex ?? "#5E6AD2");
                            const newHex = hslToHex(v, hsl.s, hsl.l);
                            const newColors = [...value.customColors];
                            while (newColors.length <= colorEditIndex) newColors.push({ hex: newHex, role: "" });
                            newColors[colorEditIndex] = { hex: newHex, role: ["Background", "Secundária", "Suporte", "Destaque"][colorEditIndex] ?? `Cor ${colorEditIndex + 1}` };
                            onChange({ customColors: newColors });
                          }} />
                          <MiniSlider label="S" defaultValue={Math.round(hexToHsl(previewColors[colorEditIndex]?.hex ?? "#5E6AD2").s)} onChange={(v) => {
                            const hsl = hexToHsl(previewColors[colorEditIndex]?.hex ?? "#5E6AD2");
                            const newHex = hslToHex(hsl.h, v, hsl.l);
                            const newColors = [...value.customColors];
                            while (newColors.length <= colorEditIndex) newColors.push({ hex: newHex, role: "" });
                            newColors[colorEditIndex] = { hex: newHex, role: ["Background", "Secundária", "Suporte", "Destaque"][colorEditIndex] ?? `Cor ${colorEditIndex + 1}` };
                            onChange({ customColors: newColors });
                          }} />
                          <MiniSlider label="L" defaultValue={Math.round(hexToHsl(previewColors[colorEditIndex]?.hex ?? "#5E6AD2").l)} onChange={(v) => {
                            const hsl = hexToHsl(previewColors[colorEditIndex]?.hex ?? "#5E6AD2");
                            const newHex = hslToHex(hsl.h, hsl.s, v);
                            const newColors = [...value.customColors];
                            while (newColors.length <= colorEditIndex) newColors.push({ hex: newHex, role: "" });
                            newColors[colorEditIndex] = { hex: newHex, role: ["Background", "Secundária", "Suporte", "Destaque"][colorEditIndex] ?? `Cor ${colorEditIndex + 1}` };
                            onChange({ customColors: newColors });
                          }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Preview expandido (mockup website com a palete) — influenciado por colorCount */}
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowColorPopup(!showColorPopup)}
            className="flex items-center gap-1 text-[10px] text-primary hover:underline">
            <Eye className="h-3 w-3" /> {showColorPopup ? "Fechar preview" : "Ver preview do website"}
          </button>
        </div>
        <AnimatePresence>
          {showColorPopup && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="rounded-xl border-2 border-border p-4" style={{ background: previewBg, color: previewText }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ fontFamily: value.fontHeading || "inherit" }}>Logo / Brand</span>
                  <button type="button" onClick={() => setShowColorPopup(false)} className="rounded p-1 text-xs opacity-60 hover:opacity-100"><X className="h-3 w-3" /></button>
                </div>
                <div className="mt-4 space-y-3">
                  <h2 className="text-2xl font-extrabold" style={{ fontFamily: value.fontHeading || "inherit" }}>Forja projetos production-ready</h2>
                  <p className="text-sm opacity-80" style={{ fontFamily: value.fontBody || "inherit" }}>Análise de nicho, paleta WCAG-AA, tipografia, design tokens — tudo em segundos.</p>
                  <div className="flex gap-2">
                    <button className="rounded-lg px-4 py-2 text-xs font-semibold" style={{ background: previewAccent, color: previewBg }}>Get Started →</button>
                    <button className="rounded-lg border px-4 py-2 text-xs font-semibold" style={{ borderColor: previewText + "60", color: previewText }}>Learn more</button>
                  </div>
                  {/* Grid de features — número de cards = colorCount */}
                  <div className={cn("grid gap-2", value.colorCount === 2 ? "grid-cols-2" : value.colorCount === 3 ? "grid-cols-3" : "grid-cols-4")}>
                    {previewColors.map((c, i) => (
                      <div key={i} className="rounded-lg border p-2" style={{ borderColor: previewText + "20", background: previewText + "08" }}>
                        <div className="h-6 w-6 rounded-full" style={{ background: c.hex }} />
                        <div className="mt-1 text-[10px] font-semibold">{c.role}</div>
                        <div className="text-[9px] opacity-60">{c.hex}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TIPOGRAFIA — seletor manual + I'm Lucky + + (máx 3) + preview        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Tipografia</Label>
          <Button type="button" size="sm" variant="outline" onClick={imLuckyFont} className="h-7 gap-1 text-[10px]" title="Escolhe combo aleatório">
            <Dices className="h-3 w-3" /> I'm Lucky
          </Button>
        </div>

        {/* Presets de tipografia */}
        <div className="flex flex-wrap gap-1">
          {TYPOGRAPHY_PRESETS.map((tp) => (
            <button key={tp.id} type="button" onClick={() => onChange({ typographyPref: tp.id as SimpleForgeValues["typographyPref"] })}
              className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium transition-all", value.typographyPref === tp.id ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted")}>
              {tp.label}
            </button>
          ))}
        </div>

        {/* Seletores de font individuais (Heading / Body / Mono) — escolha manual */}
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          <FontSelector label="Heading" value={value.fontHeading} locked={value.fontLocked.heading} onChange={(v) => onChange({ fontHeading: v })} onToggleLock={() => onChange({ fontLocked: { ...value.fontLocked, heading: !value.fontLocked.heading } })} />
          <FontSelector label="Body" value={value.fontBody} locked={value.fontLocked.body} onChange={(v) => onChange({ fontBody: v })} onToggleLock={() => onChange({ fontLocked: { ...value.fontLocked, body: !value.fontLocked.body } })} />
          <FontSelector label="Mono" value={value.fontMono} locked={value.fontLocked.mono} onChange={(v) => onChange({ fontMono: v })} onToggleLock={() => onChange({ fontLocked: { ...value.fontLocked, mono: !value.fontLocked.mono } })} />
        </div>

        {/* Preview de font em tempo real (influenciado pela palete de cores) */}
        <div className="rounded-lg border p-3" style={{ background: previewBg, color: previewText }}>
          <div className="space-y-1">
            <div className="text-xl font-bold" style={{ fontFamily: value.fontHeading || "inherit" }}>The quick brown fox</div>
            <div className="text-sm" style={{ fontFamily: value.fontBody || "inherit" }}>jumps over the lazy dog — 0123456789</div>
            <div className="text-xs font-mono" style={{ fontFamily: value.fontMono || "monospace" }}>const hello = "world";</div>
          </div>
          <button type="button" onClick={() => setShowFontPopup(!showFontPopup)} className="mt-2 flex items-center gap-1 text-[10px] opacity-70 hover:opacity-100">
            <Layers className="h-3 w-3" /> {showFontPopup ? "Fechar" : "Expandir"} mockup tipografia
          </button>
        </div>

        {/* Mockup tipografia expandido — 3 vistas diferentes */}
        <AnimatePresence>
          {showFontPopup && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-3">
                {/* Vista 1: Dark mode (usa palete de cores atual) */}
                <div className="rounded-xl border-2 border-border p-4" style={{ background: previewBg, color: previewText }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold opacity-60">Vista 1 · Dark/Light (palete atual)</span>
                    <button type="button" onClick={() => setShowFontPopup(false)} className="rounded p-1 opacity-60 hover:opacity-100"><X className="h-3 w-3" /></button>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="text-3xl font-extrabold" style={{ fontFamily: value.fontHeading || "inherit" }}>The quick brown fox jumps</div>
                    <div className="text-sm leading-relaxed opacity-80" style={{ fontFamily: value.fontBody || "inherit" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    <div className="text-xs font-mono opacity-60" style={{ fontFamily: value.fontMono || "monospace" }}>const inaugura = await generate();</div>
                  </div>
                </div>

                {/* Vista 2: Light mode (fundo branco, texto escuro) */}
                <div className="rounded-xl border-2 border-border bg-white p-4 text-zinc-900">
                  <span className="text-[10px] font-semibold text-zinc-400">Vista 2 · Light Mode (branco)</span>
                  <div className="mt-3 space-y-3">
                    <div className="text-3xl font-extrabold" style={{ fontFamily: value.fontHeading || "inherit" }}>The quick brown fox jumps</div>
                    <div className="text-sm leading-relaxed text-zinc-600" style={{ fontFamily: value.fontBody || "inherit" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</div>
                    <div className="text-xs font-mono text-zinc-500" style={{ fontFamily: value.fontMono || "monospace" }}>const inaugura = await generate();</div>
                  </div>
                </div>

                {/* Vista 3: Card / Component (simula botão + card + UI) */}
                <div className="rounded-xl border-2 border-border bg-zinc-100 p-4">
                  <span className="text-[10px] font-semibold text-zinc-400">Vista 3 · Component / UI</span>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="text-lg font-bold" style={{ fontFamily: value.fontHeading || "inherit" }}>Card Title</div>
                      <div className="text-xs text-zinc-500" style={{ fontFamily: value.fontBody || "inherit" }}>Card description with body font for readability.</div>
                    </div>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white" style={{ fontFamily: value.fontHeading || "inherit" }}>Button Action</button>
                    <code className="block rounded-md bg-zinc-900 p-2 text-[10px] text-green-400" style={{ fontFamily: value.fontMono || "monospace" }}>npm install @inaugura/core</code>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Sparkles className="h-3 w-3" /> {value.fontHeading || "Auto"} + {value.fontBody || "Auto"} + {value.fontMono || "Auto"}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STACK & COMBOS — 1 botão por grupo que expande todos                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Stack & Combos</Label>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {STACK_PREFS.map((s) => (
            <button key={s.id} type="button" onClick={() => onChange({ stackPref: s.id as SimpleForgeValues["stackPref"] })}
              className={cn("flex items-center gap-2 rounded-lg border p-2 text-left transition-all", value.stackPref === s.id ? "border-primary bg-primary/10" : "border-border bg-card/30 hover:border-primary/40")}>
              <div className="flex-1"><div className="text-[11px] font-semibold">{s.label}</div><div className="text-[10px] text-muted-foreground">{s.desc}</div></div>
            </button>
          ))}
        </div>

        {/* 1 botão por grupo — clica e expande todos os combos desse grupo */}
        <div className="flex flex-wrap gap-1.5">
          {STACK_COMBO_CATEGORIES.map((cat) => {
            const count = CATALOG.stackCombos.filter((c) => c.category === cat.id).length;
            const isExpanded = expandedStackGroup === cat.id;
            return (
              <button key={cat.id} type="button" onClick={() => setExpandedStackGroup(isExpanded ? null : cat.id)}
                className={cn("flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all", isExpanded ? "border-primary bg-primary/10 text-primary" : "border-border bg-card/30 text-muted-foreground hover:border-primary/40")}>
                {cat.label} <span className="text-[9px] opacity-60">({count})</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-180")} />
              </button>
            );
          })}
        </div>

        {/* Combos do grupo expandido */}
        <AnimatePresence>
          {expandedStackGroup && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {CATALOG.stackCombos.filter((c) => c.category === expandedStackGroup).map((combo) => {
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
          <>
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
          </>
        )}
      </div>

      {/* Integrações */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Integrações Essenciais</Label>
        <div className="flex flex-wrap gap-1.5">
          {INTEGRATIONS.map((i) => (
            <button key={i.id} type="button" onClick={() => toggleArray("integrations", i.id)}
              className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all", value.integrations.includes(i.id) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card/30 text-muted-foreground hover:border-primary/40")}>{i.label}</button>
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
// FontSelector — dropdown de seleção manual de font com botão bloquear
// ============================================================================
function FontSelector({ label, value, locked, onChange, onToggleLock }: { label: string; value: string; locked: boolean; onChange: (v: string) => void; onToggleLock: () => void }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground">{label}</span>
        <button type="button" onClick={onToggleLock}
          className={cn("flex h-4 w-4 items-center justify-center rounded text-[9px] transition-all", locked ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted")}
          title={locked ? "Bloqueada — I'm Lucky não muda" : "Desbloqueada"}>
          {locked ? "🔒" : "🔓"}
        </button>
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-card/50 px-2 py-1.5 text-[11px] font-medium" disabled={locked}>
        <option value="">Auto</option>
        {ALL_FONTS.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
        ))}
      </select>
      <div className="text-[10px] truncate" style={{ fontFamily: value || "inherit" }}>Aa Bb Cc 0123</div>
    </div>
  );
}

// ============================================================================
// MiniSlider — slider mini para edição HSL individual
// ============================================================================
function MiniSlider({ label, defaultValue = 0, onChange }: { label: string; defaultValue?: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[8px] text-muted-foreground w-3">{label}</span>
      <input type="range" min={0} max={label === "H" ? 360 : 100} defaultValue={defaultValue} onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-muted accent-primary" />
    </div>
  );
}
