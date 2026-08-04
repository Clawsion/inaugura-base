"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LayoutSelector } from "@/components/forms/LayoutSelector";
import {
  Sparkles, Lightbulb, Plus, Trash2, ChevronDown, Wand2, ArrowRight,
  Dices, Eye, X, Layers, Zap, Lock, RefreshCw, Palette, Maximize2, Check, Info, BookOpen, Cpu,
  Rocket, AppWindow, ShoppingBag, Briefcase, LayoutDashboard, FileText, Store,
  UtensilsCrossed, GraduationCap, Home, Wand2 as WandIcon, MoreHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CATALOG } from "@/lib/catalog";
import { FONT_CATALOG, getFontsByCategory, type FontDef } from "@/lib/font-catalog";
import { adjustColor, generatePalette, generateRandomPalette, polishPalette, optimizePalette, polishSingleColor, hexToHsl, hslToHex, COLOR_TRENDS_2026, COLOR_STYLES, POLISH_TYPES, type ColorStyle, type PolishType } from "@/lib/color-engine";
import { useFontLoader, getCssFontName } from "@/lib/use-font-loader";

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
  // Overrides por trend — quando o user gera variação individual ou global,
  // cada trend pode ter as suas próprias cores geradas, independentes do trend ativo
  trendOverrides: Record<string, { hex: string; role: string }[]>;
  // Estilo de geração (Awwwards, Premium SaaS, Editorial, etc.) — afeta como Generate cria paletes
  colorStyle: ColorStyle | "auto";
  // Tipo de polimento (Jewel, Cream, Vivid, Dark Premium, etc.) — afeta o tom final
  polishType: PolishType;
  typographyPref: "auto" | "modern-sans" | "geometric" | "humanist" | "editorial-serif" | "mono-tech";
  fontHeading: string;
  fontBody: string;
  fontMono: string;
  // Quantas fonts usar: 2 = heading + body (sem mono), 3 = heading + body + mono
  fontCount: 2 | 3;
  fontLocked: { heading: boolean; body: boolean; mono: boolean };
  customFonts: string[];
  animations: boolean;
  motionCombo: string;
  stackPref: "auto" | "modern" | "fullstack" | "supabase" | "python" | "ai-first" | "custom";
  stackCombo: string;
  integrations: string[];
  level: "mvp" | "production" | "enterprise";
  idioma: "pt" | "en";
  // Layout style (hero type, grid style, etc.)
  layoutStyle: string;
  // Effects style (scroll, hover, transitions)
  effectsStyle: string[];
}

interface SimpleForgeProps {
  value: SimpleForgeValues;
  onChange: (patch: Partial<SimpleForgeValues>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onSwitchToAdvanced: () => void;
}

// Ícones minimalistas
const PROJECT_TYPES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "landing", label: "Landing Page", icon: Rocket },
  { id: "saas", label: "SaaS / Web App", icon: AppWindow },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
  { id: "portfolio", label: "Portfolio / Agência", icon: Briefcase },
  { id: "dashboard", label: "Dashboard / Admin", icon: LayoutDashboard },
  { id: "blog", label: "Blog / Conteúdo", icon: FileText },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "restaurant", label: "Restaurante / Food", icon: UtensilsCrossed },
  { id: "education", label: "Educação / EdTech", icon: GraduationCap },
  { id: "realestate", label: "Imobiliário", icon: Home },
  { id: "agency", label: "Agência Criativa", icon: WandIcon },
  { id: "other", label: "Outro", icon: MoreHorizontal },
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

// ============================================================================
// FONT_COMBOS — Perfect Combos curados (50+ combinações premium)
// ============================================================================
// Cada combo é um trio (heading + body + mono) testado visualmente.
// Inspirado em sites Awwwards SOTD, Linear, Vercel, Stripe, Resend, Cursor.
// ============================================================================
const FONT_COMBOS = [
  // ─── Combos Vercel/Linear style (premium SaaS dark) ───
  { heading: "Geist", body: "Inter", mono: "Geist Mono", vibe: "Vercel", tags: ["SaaS", "Dark", "Tech"] },
  { heading: "Geist", body: "Geist", mono: "Geist Mono", vibe: "Vercel Pure", tags: ["SaaS", "Minimal"] },
  { heading: "Inter", body: "Inter", mono: "Geist Mono", vibe: "Linear", tags: ["SaaS", "Clean"] },
  { heading: "Inter", body: "Inter", mono: "JetBrains Mono", vibe: "Cursor", tags: ["SaaS", "Dev"] },

  // ─── Combos Satoshi/General Sans (Fontshare premium) ───
  { heading: "Satoshi", body: "General Sans", mono: "Geist Mono", vibe: "Stripe", tags: ["Editorial", "Premium"] },
  { heading: "Satoshi", body: "Satoshi", mono: "JetBrains Mono", vibe: "Resend", tags: ["Editorial", "Cream"] },
  { heading: "Satoshi Variable", body: "General Sans", mono: "Geist Mono", vibe: "Modern SaaS", tags: ["Premium", "Variable"] },

  // ─── Combos Clash Display (Awwwards top) ───
  { heading: "Clash Display", body: "Inter", mono: "Geist Mono", vibe: "Awwwards", tags: ["Bold", "Display"] },
  { heading: "Clash Display", body: "Clash Grotesk", mono: "Space Mono", vibe: "Studio", tags: ["Agency", "Creative"] },
  { heading: "Clash Grotesk", body: "Clash Grotesk", mono: "JetBrains Mono", vibe: "Bureau Cool", tags: ["Studio", "Bold"] },

  // ─── Combos Cabinet Grotesk (Fontshare) ───
  { heading: "Cabinet Grotesk", body: "SWitzer", mono: "Space Mono", vibe: "Editorial", tags: ["Magazine", "Refined"] },
  { heading: "Cabinet Grotesk", body: "Inter", mono: "Geist Mono", vibe: "Premium SaaS", tags: ["SaaS", "Display"] },

  // ─── Combos Plus Jakarta (modern friendly) ───
  { heading: "Plus Jakarta Sans", body: "Inter", mono: "JetBrains Mono", vibe: "Friendly SaaS", tags: ["Approachable", "Modern"] },
  { heading: "Plus Jakarta Sans", body: "Plus Jakarta Sans", mono: "Geist Mono", vibe: "Friendly Pure", tags: ["Approachable"] },

  // ─── Combos Space Grotesk (tech/developer) ───
  { heading: "Space Grotesk", body: "Inter", mono: "Space Mono", vibe: "Tech", tags: ["Developer", "Mono"] },
  { heading: "Space Grotesk", body: "DM Sans", mono: "JetBrains Mono", vibe: "Tech Modern", tags: ["Developer"] },

  // ─── Combos Sora/Syne/Unbounded (experimental) ───
  { heading: "Sora", body: "Inter", mono: "Geist Mono", vibe: "Modern", tags: ["Geometric"] },
  { heading: "Syne", body: "Inter", mono: "JetBrains Mono", vibe: "Experimental", tags: ["Bold", "Variable"] },
  { heading: "Unbounded", body: "Inter", mono: "Space Mono", vibe: "Awwwards", tags: ["Bold", "Display"] },

  // ─── Combos Bricolage Grotesque (trendy 2026) ───
  { heading: "Bricolage Grotesque", body: "Inter", mono: "Geist Mono", vibe: "Trending 2026", tags: ["Personality", "Modern"] },
  { heading: "Bricolage Grotesque", body: "DM Sans", mono: "JetBrains Mono", vibe: "Trending", tags: ["Personality"] },

  // ─── Combos serif editorial ───
  { heading: "Fraunces", body: "Inter", mono: "JetBrains Mono", vibe: "Editorial", tags: ["Serif", "Magazine"] },
  { heading: "Fraunces", body: "Newsreader", mono: "Space Mono", vibe: "Editorial Pure", tags: ["Serif", "Editorial"] },
  { heading: "Instrument Serif", body: "Inter", mono: "Geist Mono", vibe: "Stripe Editorial", tags: ["Serif", "Premium"] },
  { heading: "Instrument Serif", body: "Instrument Sans", mono: "JetBrains Mono", vibe: "Editorial Modern", tags: ["Serif", "Refined"] },
  { heading: "PP Editorial New", body: "Inter", mono: "Geist Mono", vibe: "Premium Editorial", tags: ["Serif", "Luxury"] },

  // ─── Combos Hanken Grotesk (clean) ───
  { heading: "Hanken Grotesk", body: "Hanken Grotesk", mono: "JetBrains Mono", vibe: "Clean", tags: ["Minimal", "Clean"] },

  // ─── Combos Figtree/DM Sans/Manrope (Google modern) ───
  { heading: "Figtree", body: "Figtree", mono: "Geist Mono", vibe: "Modern Google", tags: ["Clean", "Free"] },
  { heading: "DM Sans", body: "DM Sans", mono: "JetBrains Mono", vibe: "Modern Google", tags: ["Clean", "Free"] },
  { heading: "Manrope", body: "Manrope", mono: "Space Mono", vibe: "Modern Google", tags: ["Clean", "Free"] },
  { heading: "Albert Sans", body: "Albert Sans", mono: "Geist Mono", vibe: "Modern Google", tags: ["Clean", "Free"] },
  { heading: "Lexend", body: "Lexend", mono: "JetBrains Mono", vibe: "Readable", tags: ["Accessible", "Clean"] },

  // ─── Combos Archivo (display + body) ───
  { heading: "Archivo", body: "Inter", mono: "Geist Mono", vibe: "Display", tags: ["Display", "Modern"] },
  { heading: "Archivo", body: "Archivo", mono: "JetBrains Mono", vibe: "Archivo Pure", tags: ["Display"] },

  // ─── Combos mono-focused (developer tools) ───
  { heading: "Geist Mono", body: "Inter", mono: "Geist Mono", vibe: "Developer", tags: ["Mono", "Tech"] },
  { heading: "JetBrains Mono", body: "Inter", mono: "JetBrains Mono", vibe: "Developer Pure", tags: ["Mono", "Tech"] },
  { heading: "Berkeley Mono", body: "Inter", mono: "Berkeley Mono", vibe: "Terminal", tags: ["Mono", "Terminal"] },
  { heading: "Commit Mono", body: "Inter", mono: "Commit Mono", vibe: "Terminal", tags: ["Mono", "Terminal"] },

  // ─── Combos Aeonik (CoType premium) ───
  { heading: "Aeonik", body: "Aeonik", mono: "Aeonik Mono", vibe: "Premium SaaS", tags: ["Premium", "Modern"] },
  { heading: "Aeonik", body: "Inter", mono: "Geist Mono", vibe: "Premium", tags: ["Premium"] },

  // ─── Combos Hubot Sans/Mona Sans (GitHub/Figma style) ───
  { heading: "Hubot Sans", body: "Inter", mono: "Geist Mono", vibe: "GitHub", tags: ["SaaS", "Dev"] },
  { heading: "Mona Sans", body: "Mona Sans", mono: "JetBrains Mono", vibe: "Figma", tags: ["SaaS", "Design"] },

  // ─── Combos Luxe/Sartoria (luxury premium) ───
  { heading: "Sartoria", body: "Inter", mono: "Geist Mono", vibe: "Luxury", tags: ["Serif", "Luxury"] },
  { heading: "GT Sectra", body: "Inter", mono: "JetBrains Mono", vibe: "Luxury Editorial", tags: ["Serif", "Premium"] },
  { heading: "Tiempos Text", body: "Inter", mono: "Space Mono", vibe: "Editorial Classic", tags: ["Serif", "Editorial"] },

  // ─── Combos Awwwards top-tier (creative agencies) ───
  { heading: "Cabinet Grotesk", body: "General Sans", mono: "Berkeley Mono", vibe: "Studio Premium", tags: ["Agency", "Premium"] },
  { heading: "Clash Display", body: "Satoshi", mono: "Commit Mono", vibe: "Awwwards Bold", tags: ["Agency", "Bold"] },
  { heading: "Bricolage Grotesque", body: "Satoshi", mono: "Geist Mono", vibe: "Awwwards Trendy", tags: ["Trending", "Bold"] },
  { heading: "Unbounded", body: "Inter", mono: "Berkeley Mono", vibe: "Awwwards Bold", tags: ["Bold", "Display"] },
  { heading: "Syne", body: "Satoshi", mono: "JetBrains Mono", vibe: "Experimental", tags: ["Variable", "Bold"] },

  // ─── Combos Newsreader (editorial calm) ───
  { heading: "Newsreader", body: "Inter", mono: "Space Mono", vibe: "Editorial Calm", tags: ["Serif", "Calm"] },
  { heading: "Newsreader", body: "Newsreader", mono: "JetBrains Mono", vibe: "Editorial Pure", tags: ["Serif"] },

  // ─── Combos Schibsted Grotesk (Scandinavian) ───
  { heading: "Schibsted Grotesk", body: "Inter", mono: "Geist Mono", vibe: "Scandinavian", tags: ["Clean", "Nordic"] },

  // ─── Combos Be Vietnam Pro (multilingual) ───
  { heading: "Be Vietnam Pro", body: "Be Vietnam Pro", mono: "JetBrains Mono", vibe: "Multilingual", tags: ["Multilingual", "Clean"] },

  // ─── Combos Anybody/Big Shoulders (display bold) ───
  { heading: "Anybody", body: "Inter", mono: "Space Mono", vibe: "Display Bold", tags: ["Display", "Bold"] },
  { heading: "Big Shoulders Display", body: "Inter", mono: "JetBrains Mono", vibe: "Display Bold", tags: ["Display", "Bold"] },
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
  { id: "awwwards", label: "🏆 Awwwards" },
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
  awwwards: { label: "🏆 Awwwards", color: "bg-pink-500/20 text-pink-400" },
  developer: { label: "💻 Dev Award", color: "bg-cyan-500/20 text-cyan-400" },
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
  // ─── Novos filtros por nicho (research 2026) ───
  { id: "fintech", label: "Fintech" },
  { id: "healthcare", label: "Healthcare" },
  { id: "realestate", label: "Real Estate" },
  { id: "restaurant", label: "Restaurant" },
  { id: "agency", label: "Agency" },
  { id: "education", label: "Education" },
  { id: "editorial", label: "Editorial" },
];

// Mapear tendências para filtros
const TREND_FILTERS: Record<string, string[]> = {
  "electric-lavender": ["ai", "saas"],
  "terminal-green": ["brutalist", "ai"],
  "sunset-coral": ["ecommerce", "wellness"],
  "nordic-ice": ["saas", "corporate"],
  "obsidian-gold": ["luxury", "realestate"],
  "matrix-amber": ["brutalist", "gaming"],
  "soft-sage": ["wellness", "healthcare"],
  "cyber-magenta": ["gaming", "creative"],
  "muted-clay": ["ecommerce", "creative", "restaurant"],
  "deep-ocean": ["corporate", "saas", "fintech"],
  "neon-punk": ["creative", "gaming", "agency"],
  "pure-mono": ["minimal", "corporate"],
  // ─── Novas paletes de marcas reais ───
  "linear-purple": ["saas", "ai"],
  "vercel-mono": ["saas", "minimal", "ai"],
  "stripe-editorial": ["editorial", "fintech", "saas"],
  "notion-warm": ["saas", "editorial", "education"],
  "resend-cream": ["editorial", "minimal", "saas"],
  "fintech-navy": ["fintech", "corporate"],
  "healthcare-sage": ["healthcare", "wellness"],
  "luxury-gold": ["luxury", "realestate", "editorial"],
  "restaurant-cacao": ["restaurant", "ecommerce"],
  "agency-bold": ["agency", "creative"],
  "edu-friendly": ["education", "creative"],
  "pantone-cloud": ["minimal", "wellness", "editorial"],
  "mocha-mousse": ["restaurant", "luxury", "ecommerce"],
};

export function SimpleForge({ value, onChange, onSubmit, isLoading, onSwitchToAdvanced }: SimpleForgeProps) {
  const [showExtras, setShowExtras] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showFontPopup, setShowFontPopup] = useState(false);
  const [expandedStackGroup, setExpandedStackGroup] = useState<string | null>(null);
  const [showSecretMotion, setShowSecretMotion] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState("all");
  const [colorEditIndex, setColorEditIndex] = useState<number | null>(null);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [manualComboId, setManualComboId] = useState<string | null>(null);
  const [mockupStyle, setMockupStyle] = useState<"saas" | "ecommerce" | "portfolio" | "editorial" | "brutalist" | "vintage" | "tech">("saas");
  const [expandedMockup, setExpandedMockup] = useState(false);

  // 🔥 CARREGA FONTS EM TEMPO REAL — quando mudas uma font, ela carrega do CDN
  useFontLoader([value.fontHeading, value.fontBody, value.fontMono]);

  const toggleArray = useCallback((key: "references" | "mood" | "integrations", item: string) => {
    const arr = value[key];
    if (arr.includes(item)) {
      onChange({ [key]: arr.filter((i) => i !== item) } as Partial<SimpleForgeValues>);
    } else {
      onChange({ [key]: [...arr, item] } as Partial<SimpleForgeValues>);
    }
  }, [value, onChange]);

  // I'm Lucky — escolhe combo de font aleatório (respeita locks)
  // Pool de 60+ combos premium curados de sites Awwwards
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
    const vibe = random.vibe ? ` · ${random.vibe}` : "";
    const tags = random.tags ? ` (${random.tags.join(", ")})` : "";
    toast.success(`I'm Lucky! ${random.heading} + ${random.body} + ${random.mono}${vibe}${tags}`, {
      duration: 4000,
    });
  }, [value.fontHeading, value.fontBody, value.fontMono, value.fontLocked, onChange]);

  // Polimento — dá toque moderno premium à cor (usa engine robusto)
  const polishColor = useCallback(() => {
    const currentColors: { hex: string; role: string }[] = value.customColors.length > 0
      ? value.customColors
      : (() => {
          const trend = COLOR_TRENDS_2026.find((t) => t.id === value.colorPreset) ?? COLOR_TRENDS_2026[0];
          const roles = ["Background", "Secundária", "Suporte", "Destaque"];
          return trend.colors.slice(0, value.colorCount).map((hex, i) => ({ hex, role: roles[i] ?? `Cor ${i + 1}` }));
        })();

    const polished = polishPalette(currentColors, value.polishType);
    const effectiveTrendId = value.colorPreset !== "auto" ? value.colorPreset : "electric-lavender";
    onChange({
      customColors: polished,
      colorPreset: effectiveTrendId,
      trendOverrides: { ...value.trendOverrides, [effectiveTrendId]: polished },
    });
    const polishName = POLISH_TYPES.find(p => p.id === value.polishType)?.name ?? "Jewel";
    toast.success(`Polimento ${polishName} aplicado — tom ${polished.find(c => c.role === "Suporte")?.hex ?? polished[0].hex}`);
  }, [value.customColors, value.colorCount, value.colorPreset, value.trendOverrides, value.polishType, onChange]);

  // AJUSTE TOTAL — otimiza TODAS as cores para "aquela cor de site caro"
  const optimizeColorPalette = useCallback(() => {
    const currentColors: { hex: string; role: string }[] = value.customColors.length > 0
      ? value.customColors
      : (() => {
          const trend = COLOR_TRENDS_2026.find((t) => t.id === value.colorPreset) ?? COLOR_TRENDS_2026[0];
          const roles = ["Background", "Secundária", "Suporte", "Destaque"];
          return trend.colors.slice(0, value.colorCount).map((hex, i) => ({ hex, role: roles[i] ?? `Cor ${i + 1}` }));
        })();

    const optimized = optimizePalette(currentColors);
    const effectiveTrendId = value.colorPreset !== "auto" ? value.colorPreset : "electric-lavender";
    onChange({
      customColors: optimized,
      colorPreset: effectiveTrendId,
      trendOverrides: { ...value.trendOverrides, [effectiveTrendId]: optimized },
    });
    toast.success(`Ajuste Total aplicado — cores otimizadas para site premium`, { duration: 3000 });
  }, [value.customColors, value.colorCount, value.colorPreset, value.trendOverrides, onChange]);

  // POLIMENTO INDIVIDUAL — polir uma cor específica
  const polishSingleColorHandler = useCallback((index: number) => {
    if (value.customColors.length === 0) return;
    const color = value.customColors[index];
    if (!color) return;
    const polishedHex = polishSingleColor(color.hex, color.role, value.polishType);
    const newColors = [...value.customColors];
    newColors[index] = { ...color, hex: polishedHex };
    const effectiveTrendId = value.colorPreset !== "auto" ? value.colorPreset : "electric-lavender";
    onChange({
      customColors: newColors,
      trendOverrides: { ...value.trendOverrides, [effectiveTrendId]: newColors },
    });
    toast.success(`${color.role} polida: ${polishedHex}`);
  }, [value.customColors, value.polishType, value.colorPreset, value.trendOverrides, onChange]);

  // Generate INDIVIDUAL — gera variação para UMA palete específica
  // (atualiza apenas o override desse trend; se for o ativo, atualiza customColors também)
  const generatePaletteVariation = useCallback((trendId?: string) => {
    const effectiveTrendId = trendId ?? (value.colorPreset !== "auto" ? value.colorPreset : "electric-lavender");
    const trend = COLOR_TRENDS_2026.find((t) => t.id === effectiveTrendId) ?? COLOR_TRENDS_2026[0];

    // Usa a função robusta do color-engine com o style selecionado
    const styleForGen = value.colorStyle === "auto" ? undefined : value.colorStyle;
    const colors = generateRandomPalette(value.colorCount, trend.colors, styleForGen);

    // Atualiza o override deste trend específico
    const newOverrides = { ...value.trendOverrides, [effectiveTrendId]: colors };

    // Se for o trend ativo, sincroniza customColors para o preview seguir a mesma cor
    if (effectiveTrendId === value.colorPreset) {
      onChange({ customColors: colors, trendOverrides: newOverrides });
    } else {
      onChange({ trendOverrides: newOverrides });
    }
    const styleName = value.colorStyle === "auto" ? "Auto" : (COLOR_STYLES.find(s => s.id === value.colorStyle)?.name ?? "Auto");
    toast.success(`"${trend.name}" regenerada — estilo ${styleName}`);
  }, [value.colorCount, value.colorPreset, value.trendOverrides, value.colorStyle, onChange]);

  // Generate GLOBAL — gera variação para TODAS as paletes visíveis no grid
  // Cada trend recebe a sua própria combinação compatível (override independente)
  const generateAllPalettes = useCallback(() => {
    const newOverrides: Record<string, { hex: string; role: string }[]> = { ...value.trendOverrides };
    const trendsToGenerate = paletteFilter === "all"
      ? COLOR_TRENDS_2026
      : COLOR_TRENDS_2026.filter((t) => (TREND_FILTERS[t.id] ?? []).includes(paletteFilter));

    const styleForGen = value.colorStyle === "auto" ? undefined : value.colorStyle;
    for (const trend of trendsToGenerate) {
      newOverrides[trend.id] = generateRandomPalette(value.colorCount, trend.colors, styleForGen);
    }

    // Atualiza customColors também se houver um trend ativo
    const activeTrendId = value.colorPreset !== "auto" ? value.colorPreset : null;
    const patch: Partial<SimpleForgeValues> = { trendOverrides: newOverrides };
    if (activeTrendId && newOverrides[activeTrendId]) {
      patch.customColors = newOverrides[activeTrendId];
    }
    onChange(patch);
    const styleName = value.colorStyle === "auto" ? "Auto" : (COLOR_STYLES.find(s => s.id === value.colorStyle)?.name ?? "Auto");
    toast.success(`${trendsToGenerate.length} paletes regeneradas — estilo ${styleName}`);
  }, [value.colorCount, value.colorPreset, value.trendOverrides, value.colorStyle, paletteFilter, onChange]);

  // Paletes filtradas
  const filteredPalettes = useMemo(() => {
    if (paletteFilter === "all") return COLOR_TRENDS_2026;
    return COLOR_TRENDS_2026.filter((t) => (TREND_FILTERS[t.id] ?? []).includes(paletteFilter));
  }, [paletteFilter]);

  // Cor ativa para preview — SEMPRE usa customColors se existirem, senão gera da tendência
  const activePalette = useMemo(() => {
    const roles = ["Background", "Secundária", "Suporte", "Destaque"];
    if (value.customColors.length >= value.colorCount) {
      return value.customColors.slice(0, value.colorCount);
    }
    if (value.customColors.length > 0 && value.customColors.length < value.colorCount) {
      // Tem customColors mas menos que colorCount — completar com cores da tendência
      const trend = COLOR_TRENDS_2026.find((t) => t.id === value.colorPreset) ?? COLOR_TRENDS_2026[0];
      const result = [...value.customColors];
      for (let i = value.customColors.length; i < value.colorCount; i++) {
        result.push({ hex: trend.colors[i] ?? "#5E6AD2", role: roles[i] ?? `Cor ${i + 1}` });
      }
      return result;
    }
    const trend = COLOR_TRENDS_2026.find((t) => t.id === value.colorPreset) ?? COLOR_TRENDS_2026[0];
    return trend.colors.slice(0, value.colorCount).map((hex, i) => ({
      hex,
      role: roles[i] ?? `Cor ${i + 1}`,
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
          {PROJECT_TYPES.map((pt) => {
            const Icon = pt.icon;
            return (
            <button key={pt.id} type="button" onClick={() => onChange({ projectType: pt.id })}
              className={cn("flex flex-col items-center gap-1 rounded-xl border p-3 transition-all", value.projectType === pt.id ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card/30 hover:border-primary/40")}>
              <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
              <span className="text-[11px] font-medium leading-tight text-center">{pt.label}</span>
            </button>
            );
          })}
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
      {/* ESTILO DE LAYOUT & EFEITOS — MESMO componente do AdvancedForge         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <LayoutSelector
        efeitos={value.effectsStyle}
        onToggle={(e) => {
          const newEffects = value.effectsStyle.includes(e)
            ? value.effectsStyle.filter((id) => id !== e)
            : [...value.effectsStyle, e];
          onChange({ effectsStyle: newEffects });
        }}
      />

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
              <button key={n} type="button" onClick={() => {
                // Ao mudar colorCount, ajustar customColors também
                if (value.customColors.length > 0) {
                  const roles = ["Background", "Secundária", "Suporte", "Destaque"];
                  const trend = COLOR_TRENDS_2026.find((t) => t.id === value.colorPreset) ?? COLOR_TRENDS_2026[0];
                  const newColors = [...value.customColors];
                  while (newColors.length < n) {
                    const idx = newColors.length;
                    newColors.push({ hex: trend.colors[idx] ?? "#5E6AD2", role: roles[idx] ?? `Cor ${idx + 1}` });
                  }
                  onChange({ colorCount: n, customColors: newColors.slice(0, n) });
                } else {
                  onChange({ colorCount: n });
                }
              }}
                className={cn("flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold transition-all", value.colorCount === n ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted")}>
                {n}
              </button>
            ))}
            {/* Generate global — gera TODAS as paletes visíveis no grid */}
            <Button type="button" size="sm" variant="outline" onClick={() => generateAllPalettes()} className="h-6 gap-1 px-2 text-[10px]" title="Gerar todas as paletes visíveis (cada uma com a sua harmonia)">
              <RefreshCw className="h-3 w-3" /> Generate
            </Button>
            {/* Polimento — dá toque premium à cor ativa */}
            <Button type="button" size="sm" variant="outline" onClick={() => polishColor()} className="h-6 gap-1 px-2 text-[10px]" title="Polimento — tom premium com hue tint visível">
              <Sparkles className="h-3 w-3" /> Polimento
            </Button>
            {/* Ajuste Total — otimiza TODAS as cores para site premium */}
            <Button type="button" size="sm" variant="default" onClick={() => optimizeColorPalette()} className="h-6 gap-1 px-2 text-[10px] font-semibold" title="Ajuste Total — otimiza todas as cores para look de site caro (Linear/Stripe/Vercel)">
              <Zap className="h-3 w-3" /> Ajuste Total
            </Button>
          </div>
        </div>

        {/* Estilos de Geração — botões para escolher "cara do site" (Awwwards, Premium, Editorial, etc.) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Estilo de Geração</span>
            <button
              type="button"
              onClick={() => setShowStylePicker(!showStylePicker)}
              className="text-[10px] text-primary hover:underline"
            >
              {showStylePicker ? "Fechar" : "Ver todos"}
            </button>
          </div>
          <div className={cn("flex flex-wrap gap-1", !showStylePicker && "max-h-[60px] overflow-hidden")}>
            <button
              type="button"
              onClick={() => onChange({ colorStyle: "auto" })}
              className={cn(
                "rounded-md px-2 py-1 text-[9px] font-medium transition-all",
                value.colorStyle === "auto"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
              title="Geração sem restrições de estilo"
            >
              ⚡ Auto
            </button>
            {COLOR_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange({ colorStyle: s.id })}
                className={cn(
                  "rounded-md px-2 py-1 text-[9px] font-medium transition-all",
                  value.colorStyle === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
                title={`${s.description}\nRefs: ${s.references.join(", ")}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo de Polimento — botões para escolher o tom/qualidade (Jewel, Cream, Vivid, etc.) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Tipo de Polimento</span>
            <span className="text-[9px] text-muted-foreground">
              {POLISH_TYPES.find(p => p.id === value.polishType)?.description}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {POLISH_TYPES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ polishType: p.id })}
                className={cn(
                  "rounded-md px-2 py-1 text-[9px] font-medium transition-all",
                  value.polishType === p.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
                title={p.description}
              >
                {p.name}
              </button>
            ))}
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
            // Ordem de prioridade das cores a mostrar:
            //   1. Se for o trend ativo E tem customColors → usa customColors (inclui edições finas do user)
            //   2. Senão, se tiver override gerado → usa o override (gerado pelo Generate individual ou global)
            //   3. Senão, usa as cores estáticas originais do trend
            const override = value.trendOverrides[trend.id];
            const displayColors = isActive && value.customColors.length > 0
              ? value.customColors.slice(0, value.colorCount).map(c => c.hex)
              : override
                ? override.slice(0, value.colorCount).map(c => c.hex)
                : trend.colors.slice(0, value.colorCount);
            return (
              <div key={trend.id} className={cn("rounded-lg border p-2 transition-all", isActive ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card/30 hover:border-primary/40")}>
                <button type="button" onClick={() => {
                  // Ao selecionar um trend: se tiver override gerado, carrega-o para customColors
                  // (permite continuar a editar a partir das cores geradas); senão limpa para usar cores estáticas
                  const existingOverride = value.trendOverrides[trend.id];
                  onChange({
                    colorPreset: trend.id,
                    customColors: existingOverride ? existingOverride : [],
                  });
                }}
                  className="w-full text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold">{trend.name}</span>
                    <span className="text-[8px] text-muted-foreground">{trend.tags.slice(0, 2).join(" · ")}</span>
                  </div>
                </button>
                {/* Swatches — cada uma com ícone para editar individualmente */}
                <div className="mt-1.5 flex gap-1">
                  {displayColors.map((c, i) => (
                    <div key={i} className="group relative flex-1">
                      <div className="h-8 rounded-md transition-colors duration-200" style={{ background: c }} />
                      {/* Ícone para ampliar cor individualmente */}
                      <button type="button" onClick={() => {
                        // Ao abrir o editor, garantir que customColors tem as cores atuais
                        if (value.customColors.length === 0) {
                          const trend = COLOR_TRENDS_2026.find((t) => t.id === value.colorPreset) ?? COLOR_TRENDS_2026[0];
                          const roles = ["Background", "Secundária", "Suporte", "Destaque"];
                          const newCustom = trend.colors.slice(0, value.colorCount).map((hex, idx) => ({
                            hex, role: roles[idx] ?? `Cor ${idx + 1}`,
                          }));
                          onChange({ customColors: newCustom });
                        }
                        setColorEditIndex(colorEditIndex === i ? null : i);
                      }}
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
                  {/* Polimento individual — polir cada cor */}
                  {isActive && value.customColors.length > 0 && (
                    <button type="button"
                      onClick={() => {
                        // Polir cada cor individualmente
                        const newColors = value.customColors.map((c, idx) => ({
                          ...c,
                          hex: polishSingleColor(c.hex, c.role, value.polishType),
                        }));
                        onChange({
                          customColors: newColors,
                          trendOverrides: { ...value.trendOverrides, [trend.id]: newColors },
                        });
                        toast.success(`Cores polidas individualmente — ${value.polishType}`);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary"
                      title="Polir cada cor individualmente com o tipo de polimento selecionado">
                      <Sparkles className="h-3 w-3" />
                    </button>
                  )}
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

        {/* Preview expandido — 4 estilos de mockup com botões de troca */}
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => setShowColorPopup(!showColorPopup)}
            className="flex items-center gap-1 text-[10px] text-primary hover:underline">
            <Eye className="h-3 w-3" /> {showColorPopup ? "Fechar preview" : "Ver preview do website"}
          </button>
          {showColorPopup && (
            <>
              <span className="text-[10px] text-muted-foreground ml-1">Estilo:</span>
              {([
                { id: "saas", label: "SaaS" },
                { id: "ecommerce", label: "E-commerce" },
                { id: "portfolio", label: "Portfolio" },
                { id: "editorial", label: "Editorial" },
                { id: "brutalist", label: "Brutalist" },
                { id: "vintage", label: "Vintage" },
                { id: "tech", label: "Tech" },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMockupStyle(m.id)}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[9px] font-medium transition-all",
                    mockupStyle === m.id ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {m.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setExpandedMockup(true)}
                className="ml-auto flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-[9px] text-muted-foreground hover:border-primary hover:text-primary"
                title="Ampliar mockup"
              >
                <Maximize2 className="h-3 w-3" /> Ampliar
              </button>
            </>
          )}
        </div>
        <AnimatePresence>
          {showColorPopup && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              {/* ═══ MOCKUP INLINE (compacto) ═══ */}
              <MockupPreview
                style={mockupStyle}
                bg={previewBg}
                text={previewText}
                accent={previewAccent}
                card={previewCard}
                colors={previewColors}
                fontHeading={value.fontHeading}
                fontBody={value.fontBody}
                fontMono={value.fontMono}
                fontCount={value.fontCount}
                colorCount={value.colorCount}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ POPUP EXPANDIDO (3x maior, style switcher dentro, click fora fecha) ═══ */}
        <AnimatePresence>
          {expandedMockup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2"
              onClick={() => setExpandedMockup(false)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-2 border-border bg-card shadow-2xl"
              >
                {/* Header com style switcher DENTRO do popup */}
                <div className="flex items-center justify-between border-b border-border p-3">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] font-semibold text-muted-foreground mr-1">Estilo:</span>
                    {([
                      { id: "saas", label: "SaaS" },
                      { id: "ecommerce", label: "E-commerce" },
                      { id: "portfolio", label: "Portfolio" },
                      { id: "editorial", label: "Editorial" },
                      { id: "brutalist", label: "Brutalist" },
                      { id: "vintage", label: "Vintage" },
                      { id: "tech", label: "Tech" },
                    ] as const).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMockupStyle(m.id)}
                        className={cn(
                          "rounded-md px-2 py-1 text-[10px] font-medium transition-all",
                          mockupStyle === m.id ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedMockup(false)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {/* Mockup content — scrollable */}
                <div className="overflow-y-auto p-4">
                  <MockupPreview
                    style={mockupStyle}
                    bg={previewBg}
                    text={previewText}
                    accent={previewAccent}
                    card={previewCard}
                    colors={previewColors}
                    fontHeading={value.fontHeading}
                    fontBody={value.fontBody}
                    fontMono={value.fontMono}
                    fontCount={value.fontCount}
                    colorCount={value.colorCount}
                    expanded
                  />
                </div>
              </motion.div>
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
          <div className="flex items-center gap-1.5">
            {/* Seletor de quantas fonts: 2 ou 3 */}
            <span className="text-[10px] text-muted-foreground">Fonts:</span>
            {([2, 3] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange({ fontCount: n })}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold transition-all",
                  value.fontCount === n ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
                title={n === 2 ? "2 fonts: Heading + Body (sem Mono)" : "3 fonts: Heading + Body + Mono"}
              >
                {n}
              </button>
            ))}
            <Button type="button" size="sm" variant="outline" onClick={imLuckyFont} className="h-6 gap-1 px-2 text-[10px]" title="Escolhe combo aleatório">
              <Dices className="h-3 w-3" /> I'm Lucky
            </Button>
          </div>
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

        {/* Seletores de font individuais — Heading + Body (sempre) + Mono (só se fontCount=3) */}
        <div className={cn("grid gap-1.5", value.fontCount === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
          <FontSelector label="Heading" value={value.fontHeading} locked={value.fontLocked.heading} onChange={(v) => onChange({ fontHeading: v })} onToggleLock={() => onChange({ fontLocked: { ...value.fontLocked, heading: !value.fontLocked.heading } })} />
          <FontSelector label="Body" value={value.fontBody} locked={value.fontLocked.body} onChange={(v) => onChange({ fontBody: v })} onToggleLock={() => onChange({ fontLocked: { ...value.fontLocked, body: !value.fontLocked.body } })} />
          {value.fontCount === 3 && (
            <FontSelector label="Mono" value={value.fontMono} locked={value.fontLocked.mono} onChange={(v) => onChange({ fontMono: v })} onToggleLock={() => onChange({ fontLocked: { ...value.fontLocked, mono: !value.fontLocked.mono } })} />
          )}
        </div>

        {/* Preview de font em tempo real (influenciado pela palete de cores) */}
        <div className="rounded-lg border p-3" style={{ background: previewBg, color: previewText }}>
          <div className="space-y-1">
            <div className="text-xl font-bold" style={{ fontFamily: getCssFontName(value.fontHeading) }}>The quick brown fox</div>
            <div className="text-sm" style={{ fontFamily: getCssFontName(value.fontBody) }}>jumps over the lazy dog — 0123456789</div>
            <div className="text-xs font-mono" style={{ fontFamily: getCssFontName(value.fontMono) }}>const hello = "world";</div>
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
                    <div className="text-3xl font-extrabold" style={{ fontFamily: getCssFontName(value.fontHeading) }}>The quick brown fox jumps</div>
                    <div className="text-sm leading-relaxed opacity-80" style={{ fontFamily: getCssFontName(value.fontBody) }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    <div className="text-xs font-mono opacity-60" style={{ fontFamily: getCssFontName(value.fontMono) }}>const inaugura = await generate();</div>
                  </div>
                </div>

                {/* Vista 2: Light mode (fundo branco, texto escuro) */}
                <div className="rounded-xl border-2 border-border bg-white p-4 text-zinc-900">
                  <span className="text-[10px] font-semibold text-zinc-400">Vista 2 · Light Mode (branco)</span>
                  <div className="mt-3 space-y-3">
                    <div className="text-3xl font-extrabold" style={{ fontFamily: getCssFontName(value.fontHeading) }}>The quick brown fox jumps</div>
                    <div className="text-sm leading-relaxed text-zinc-600" style={{ fontFamily: getCssFontName(value.fontBody) }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</div>
                    <div className="text-xs font-mono text-zinc-500" style={{ fontFamily: getCssFontName(value.fontMono) }}>const inaugura = await generate();</div>
                  </div>
                </div>

                {/* Vista 3: Card / Component (simula botão + card + UI) */}
                <div className="rounded-xl border-2 border-border bg-zinc-100 p-4">
                  <span className="text-[10px] font-semibold text-zinc-400">Vista 3 · Component / UI</span>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="text-lg font-bold" style={{ fontFamily: getCssFontName(value.fontHeading) }}>Card Title</div>
                      <div className="text-xs text-zinc-500" style={{ fontFamily: getCssFontName(value.fontBody) }}>Card description with body font for readability.</div>
                    </div>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white" style={{ fontFamily: getCssFontName(value.fontHeading) }}>Button Action</button>
                    <code className="block rounded-md bg-zinc-900 p-2 text-[10px] text-green-400" style={{ fontFamily: getCssFontName(value.fontMono) }}>npm install @inaugura/core</code>
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
              title={`${s.label}\n\n${s.desc}`}
              className={cn("flex items-center gap-2 rounded-lg border p-2 text-left transition-all", value.stackPref === s.id ? "border-primary bg-primary/10" : "border-border bg-card/30 hover:border-primary/40")}>
              <div className="flex-1"><div className="text-[11px] font-semibold">{s.label}</div><div className="text-[10px] text-muted-foreground">{s.desc}</div></div>
              <Info className="h-3 w-3 text-muted-foreground/40 shrink-0" />
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

        {/* Combos do grupo expandido — info completa visível no card */}
        <AnimatePresence>
          {expandedStackGroup && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {CATALOG.stackCombos.filter((c) => c.category === expandedStackGroup).map((combo) => {
                  const isActive = value.stackCombo === combo.id;
                  const badge = combo.badge ? COMBO_BADGES[combo.badge] : null;
                  return (
                    <div
                      key={combo.id}
                      className={cn(
                        "relative flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-all",
                        isActive ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card/30 hover:border-primary/40"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => onChange({ stackCombo: isActive ? "" : combo.id })}
                        className="flex flex-col gap-1.5 text-left"
                      >
                        {/* Header: nome + badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold leading-tight">{combo.name}</span>
                          {badge && <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold", badge.color)}>{badge.label}</span>}
                        </div>

                        {/* Descrição */}
                        {combo.description && (
                          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">{combo.description}</p>
                        )}

                        {/* Stack */}
                        <div className="rounded bg-muted/40 px-1.5 py-1">
                          <code className="text-[9px] text-foreground/80 line-clamp-2 leading-snug">{combo.stack}</code>
                        </div>

                        {/* When to use */}
                        {combo.whenToUse && (
                          <div className="flex items-start gap-1">
                            <span className="text-[8px] font-semibold text-primary/70 uppercase mt-0.5">When:</span>
                            <span className="text-[9px] text-muted-foreground line-clamp-1">{combo.whenToUse}</span>
                          </div>
                        )}

                        {/* Site type + best for */}
                        <div className="flex flex-wrap gap-1">
                          {combo.siteType && (
                            <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[8px] text-blue-400">
                              🌐 {combo.siteType.length > 30 ? combo.siteType.slice(0, 30) + "..." : combo.siteType}
                            </span>
                          )}
                          {combo.bestFor && combo.bestFor.slice(0, 2).map((b) => (
                            <span key={b} className="rounded bg-muted px-1.5 py-0.5 text-[8px] text-muted-foreground">
                              {b}
                            </span>
                          ))}
                        </div>

                        {/* Examples */}
                        {combo.examples && combo.examples.length > 0 && (
                          <div className="flex items-start gap-1 border-t border-border pt-1.5">
                            <span className="text-[8px] font-semibold text-muted-foreground/70 uppercase mt-0.5">Ex:</span>
                            <div className="flex flex-wrap gap-1">
                              {combo.examples.slice(0, 3).map((ex, i) => (
                                <span key={i} className="text-[9px] text-foreground/70">
                                  {ex}{i < Math.min(combo.examples!.length, 3) - 1 ? "," : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Performance note */}
                        {combo.performanceNote && (
                          <div className="flex items-center gap-1 text-[8px] text-muted-foreground/60 italic">
                            <span className="text-[8px]">⚡</span>
                            <span className="line-clamp-1">{combo.performanceNote}</span>
                          </div>
                        )}
                      </button>

                      {/* Botão Manual — abre popup com guia de implementação */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setManualComboId(combo.id);
                        }}
                        className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground hover:border-primary hover:text-primary transition-all"
                        title="Ver manual de implementação"
                      >
                        <BookOpen className="h-3 w-3" />
                      </button>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* POPUP MANUAL — guia de implementação passo-a-passo                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {manualComboId && (() => {
          const combo = CATALOG.stackCombos.find((c) => c.id === manualComboId);
          if (!combo) return null;
          const badge = combo.badge ? COMBO_BADGES[combo.badge] : null;
          // Gerar passos de implementação a partir do stack
          const stackParts = combo.stack.split("+").map((s) => s.trim()).filter(Boolean);
          const steps = [
            { title: "1. Inicialização do projeto", desc: `Cria o projeto com: ${stackParts.slice(0, 3).join(" + ")}`, cmd: stackParts[0]?.includes("Next") ? "npx create-next-app@latest --typescript --tailwind --app" : "Ver documentação do framework" },
            { title: "2. Instalar dependências core", desc: `Instala as bibliotecas base: ${stackParts.slice(1, 4).join(", ")}`, cmd: `npm install ${stackParts.slice(1, 4).map(s => s.toLowerCase().replace(/\s/g, "")).join(" ")}` },
            { title: "3. Configurar design system", desc: "Define tokens de cor, tipografia, espaçamento e component library (shadcn/ui ou similar).", cmd: "npx shadcn@latest init" },
            { title: "4. Setup de animações", desc: stackParts.some(s => s.includes("GSAP")) ? "Instala GSAP + Lenis para smooth scroll e animações." : "Configura Framer Motion ou CSS animations.", cmd: stackParts.some(s => s.includes("GSAP")) ? "npm install gsap @gsap/react lenis" : "npm install motion" },
            { title: "5. Configurar 3D (se aplicável)", desc: stackParts.some(s => s.includes("Three") || s.includes("R3F")) ? "Instala Three.js ou React Three Fiber para 3D." : "Skip — este stack não usa 3D.", cmd: stackParts.some(s => s.includes("R3F")) ? "npm install three @react-three/fiber @react-three/drei" : "# Skip" },
            { title: "6. Setup de CMS (se aplicável)", desc: stackParts.some(s => s.includes("Sanity") || s.includes("Payload") || s.includes("CMS")) ? "Configura o CMS headless." : "Skip — sem CMS neste stack.", cmd: stackParts.some(s => s.includes("Sanity")) ? "npm install @sanity/client next-sanity" : "# Skip" },
            { title: "7. Configurar deploy", desc: "Configura build de produção e deploy (Vercel, Netlify, ou self-hosted).", cmd: "vercel deploy --prod" },
            { title: "8. Otimizar performance", desc: combo.performanceNote ?? "Verifica Lighthouse, Core Web Vitals, e otimiza imagens/fonts.", cmd: "npx lighthouse http://localhost:3000 --view" },
          ];

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setManualComboId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-bold">{combo.name}</h2>
                      {badge && <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold", badge.color)}>{badge.label}</span>}
                    </div>
                    {combo.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{combo.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setManualComboId(null)}
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Info rápida */}
                <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg border border-border bg-muted/20 p-3 text-xs">
                  {combo.siteType && (
                    <div>
                      <span className="font-semibold text-muted-foreground">Tipo de site:</span>
                      <p className="mt-0.5">{combo.siteType}</p>
                    </div>
                  )}
                  {combo.bestFor && combo.bestFor.length > 0 && (
                    <div>
                      <span className="font-semibold text-muted-foreground">Ideal para:</span>
                      <p className="mt-0.5">{combo.bestFor.join(", ")}</p>
                    </div>
                  )}
                  {combo.whenToUse && (
                    <div className="col-span-2">
                      <span className="font-semibold text-muted-foreground">Quando usar:</span>
                      <p className="mt-0.5">{combo.whenToUse}</p>
                    </div>
                  )}
                  {combo.examples && combo.examples.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-semibold text-muted-foreground">Exemplos reais:</span>
                      <p className="mt-0.5">{combo.examples.join(" · ")}</p>
                    </div>
                  )}
                  {combo.performanceNote && (
                    <div className="col-span-2">
                      <span className="font-semibold text-muted-foreground">⚡ Performance:</span>
                      <p className="mt-0.5 italic">{combo.performanceNote}</p>
                    </div>
                  )}
                </div>

                {/* Stack completo */}
                <div className="mb-4">
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stack completo</h3>
                  <code className="block rounded-lg bg-muted/40 p-3 text-xs leading-relaxed">{combo.stack}</code>
                </div>

                {/* Guia passo-a-passo */}
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Guia de implementação</h3>
                  <div className="space-y-2">
                    {steps.map((step, i) => (
                      <div key={i} className="rounded-lg border border-border p-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                          <span className="text-sm font-semibold">{step.title.replace(/^\d+\.\s*/, "")}</span>
                        </div>
                        <p className="mt-1 pl-7 text-xs text-muted-foreground">{step.desc}</p>
                        {step.cmd && step.cmd !== "# Skip" && (
                          <div className="mt-1.5 flex items-center gap-2 pl-7">
                            <code className="flex-1 rounded bg-zinc-900 px-2 py-1 text-[10px] text-green-400 overflow-x-auto">{step.cmd}</code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(step.cmd);
                                toast.success("Comando copiado!");
                              }}
                              className="shrink-0 rounded px-1.5 py-0.5 text-[9px] text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              Copiar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI's Recomendados por função — Ouro/Prata/Bronze + Open Source */}
                <div className="border-t border-border pt-3">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                    <Cpu className="h-3 w-3" /> AI's Recomendados por função
                  </h3>
                  <p className="mb-3 text-[10px] text-muted-foreground/70 italic">
                    Melhores modelos para cada função do stack. Ouro = melhor qualidade. Prata = bom equilíbrio. Bronze = custo baixo. Open Source = grátis/self-host.
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { fn: "Architect (spec/riscos)", gold: "Claude Opus 5", goldNote: "Max reasoning", silver: "GPT-5.5", silverNote: "Agentic", bronze: "GLM-5.2", bronzeNote: "Free", open: "DeepSeek R1", openNote: "Open weight reasoning" },
                      { fn: "Design System", gold: "Claude Fable 5", goldNote: "Topo design", silver: "Kimi K3", silverNote: "1M context", bronze: "Qwen 3.5 Coder", bronzeNote: "Free", open: "GLM-5.2", openNote: "Coding top" },
                      { fn: "Frontend / UI", gold: "Kimi K3", goldNote: "Excelente UI", silver: "Claude Sonnet 5", silverNote: "Workhorse", bronze: "Qwen 3.5 Coder", bronzeNote: "Free", open: "GLM-5.2", openNote: "Open weight" },
                      { fn: "Backend / Logic", gold: "GPT-5.3 Codex", goldNote: "Agentic coding", silver: "DeepSeek V4 Pro", silverNote: "Open weight", bronze: "Claude Sonnet 5", bronzeNote: "Reliable", open: "DeepSeek V4 Flash", openNote: "$0.28/M" },
                      { fn: "Motion / 3D", gold: "Kimi K3", goldNote: "1M context", silver: "Claude Sonnet 5", silverNote: "Bom gosto", bronze: "Gemini 3.1 Flash", bronzeNote: "Barato", open: "GLM-5.2", openNote: "Coding" },
                      { fn: "Security", gold: "Claude Opus 5", goldNote: "Deep reasoning", silver: "GPT-5.5", silverNote: "Audit", bronze: "DeepSeek V4 Pro", bronzeNote: "Open", open: "GLM-5.2", openNote: "Free" },
                      { fn: "QA / Testing", gold: "Claude Sonnet 5", goldNote: "Reliable", silver: "Gemini 3.1 Flash", silverNote: "Rápido", bronze: "Claude Haiku 4.5", bronzeNote: "Barato", open: "GLM-5.2", openNote: "Free" },
                      { fn: "Deploy / Ship", gold: "Claude Sonnet 5", goldNote: "Handover", silver: "GPT-5.5", silverNote: "Agentic", bronze: "Gemini 3.1 Flash", bronzeNote: "Low cost", open: "DeepSeek V4 Flash", openNote: "Cheap" },
                    ].map((rec) => (
                      <div key={rec.fn} className="rounded-lg border border-border p-2">
                        <div className="mb-1.5 text-[11px] font-semibold">{rec.fn}</div>
                        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                          {/* Ouro */}
                          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-1.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px]">🥇</span>
                              <span className="text-[9px] font-bold text-amber-400">Ouro</span>
                            </div>
                            <div className="mt-0.5 text-[10px] font-semibold">{rec.gold}</div>
                            <div className="text-[8px] text-muted-foreground">{rec.goldNote}</div>
                          </div>
                          {/* Prata */}
                          <div className="rounded-md border border-slate-400/30 bg-slate-400/5 p-1.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px]">🥈</span>
                              <span className="text-[9px] font-bold text-slate-300">Prata</span>
                            </div>
                            <div className="mt-0.5 text-[10px] font-semibold">{rec.silver}</div>
                            <div className="text-[8px] text-muted-foreground">{rec.silverNote}</div>
                          </div>
                          {/* Bronze */}
                          <div className="rounded-md border border-orange-700/30 bg-orange-700/5 p-1.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px]">🥉</span>
                              <span className="text-[9px] font-bold text-orange-600">Bronze</span>
                            </div>
                            <div className="mt-0.5 text-[10px] font-semibold">{rec.bronze}</div>
                            <div className="text-[8px] text-muted-foreground">{rec.bronzeNote}</div>
                          </div>
                          {/* Open Source */}
                          <div className="rounded-md border border-green-500/30 bg-green-500/5 p-1.5">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px]">🔧</span>
                              <span className="text-[9px] font-bold text-green-400">Open Source</span>
                            </div>
                            <div className="mt-0.5 text-[10px] font-semibold">{rec.open}</div>
                            <div className="text-[8px] text-muted-foreground">{rec.openNote}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links de exemplos */}
                {combo.exampleLinks && combo.exampleLinks.length > 0 && (
                  <div className="border-t border-border pt-3">
                    <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Links de referência</h3>
                    <div className="flex flex-wrap gap-2">
                      {combo.exampleLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] text-primary hover:bg-primary/10"
                        >
                          <ArrowRight className="h-3 w-3" />
                          {link.replace(/^https?:\/\//, "").replace(/\/$/, "").slice(0, 30)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

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
// FontSelector — dropdown com 100+ fonts reais agrupadas por categoria
// ============================================================================
function FontSelector({ label, value, locked, onChange, onToggleLock, category }: { label: string; value: string; locked: boolean; onChange: (v: string) => void; onToggleLock: () => void; category?: "sans" | "display" | "serif" | "mono" }) {
  // Se category é especificado, mostra só dessa categoria; senão mostra todas agrupadas
  const sansFonts = getFontsByCategory("sans");
  const displayFonts = getFontsByCategory("display");
  const serifFonts = getFontsByCategory("serif");
  const monoFonts = getFontsByCategory("mono");

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
        {category ? (
          // Modo filtrado por categoria
          getFontsByCategory(category).map((f) => (
            <option key={f.name} value={f.name} style={{ fontFamily: f.name }} title={`${f.source} · ${f.foundry} · ${f.siteType.join(", ")}`}>
              {f.name} — {f.source}
            </option>
          ))
        ) : (
          // Modo completo: agrupado por categoria
          <>
            <optgroup label={`── Sans-serif (${sansFonts.length}) ──`}>
              {sansFonts.map((f) => (
                <option key={f.name} value={f.name} style={{ fontFamily: f.name }} title={`${f.source} · ${f.foundry}`}>
                  {f.name} — {f.source}
                </option>
              ))}
            </optgroup>
            <optgroup label={`── Display/Grotesk (${displayFonts.length}) ──`}>
              {displayFonts.map((f) => (
                <option key={f.name} value={f.name} style={{ fontFamily: f.name }} title={`${f.source} · ${f.foundry}`}>
                  {f.name} — {f.source}
                </option>
              ))}
            </optgroup>
            <optgroup label={`── Serif/Editorial (${serifFonts.length}) ──`}>
              {serifFonts.map((f) => (
                <option key={f.name} value={f.name} style={{ fontFamily: f.name }} title={`${f.source} · ${f.foundry}`}>
                  {f.name} — {f.source}
                </option>
              ))}
            </optgroup>
            <optgroup label={`── Mono/Dev (${monoFonts.length}) ──`}>
              {monoFonts.map((f) => (
                <option key={f.name} value={f.name} style={{ fontFamily: f.name }} title={`${f.source} · ${f.foundry}`}>
                  {f.name} — {f.source}
                </option>
              ))}
            </optgroup>
          </>
        )}
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

// ============================================================================
// MockupPreview — SITES COMPLETOS realistas (nav + hero + secções + footer)
// ============================================================================
// Cada estilo é um website diferente com múltiplas secções visíveis.
// Respeita: cores (c0-c3), fonts (heading/body/mono), colorCount, fontCount.
// NUNCA mostra c.role ou c.hex como texto dentro do mockup.
// ============================================================================
function MockupPreview({
  style, bg, text, accent, card, colors, fontHeading, fontBody, fontMono, fontCount, colorCount, expanded,
}: {
  style: "saas" | "ecommerce" | "portfolio" | "editorial" | "brutalist" | "vintage" | "tech";
  bg: string; text: string; accent: string; card: string;
  colors: { hex: string; role: string }[];
  fontHeading: string; fontBody: string; fontMono: string;
  fontCount: 2 | 3; colorCount: 2 | 3 | 4; expanded?: boolean;
}) {
  const hf = getCssFontName(fontHeading);
  const bf = getCssFontName(fontBody);
  const mf = fontCount === 3 ? getCssFontName(fontMono) : bf;
  const sz = expanded ? "text-sm" : "text-[9px]";
  const hsz = expanded ? "text-4xl" : "text-base";
  const pd = expanded ? "p-6" : "p-2.5";
  const c0 = colors[0]?.hex ?? bg;
  const c1 = colors[1]?.hex ?? text;
  const c2 = colors[2]?.hex ?? accent;
  const c3 = colors[3]?.hex ?? accent;
  const base: React.CSSProperties = { background: c0, color: c1, fontFamily: bf, fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1', textRendering: "optimizeLegibility" };
  const hd: React.CSSProperties = { fontFamily: hf, letterSpacing: "-0.025em", fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1, "ss01" 1', textRendering: "optimizeLegibility" };
  const mn: React.CSSProperties = { fontFamily: mf, fontFeatureSettings: '"kern" 1, "liga" 1, "zero" 1' };
  const r = expanded ? "rounded-xl" : "rounded-md";
  const gap = expanded ? "gap-3" : "gap-1.5";
  const sec = expanded ? "py-6" : "py-2.5";
  const bdr = expanded ? "2px" : "1px";

  // ═══ 1. SAAS — Dashboard completo com sidebar + chart + table ═══
  if (style === "saas") return (
    <div>
      <div className={cn("overflow-hidden border", r)} style={{ ...base, borderColor: c1 + "20" }}>
        {/* TOP NAV */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `${bdr} solid ${c1}15`, background: c0 }}>
          <div className="flex items-center gap-2"><div className={cn("rounded", expanded ? "h-5 w-5" : "h-3 w-3")} style={{ background: c2 }} /><span className={cn("font-bold", expanded ? "text-sm" : "text-[10px]")} style={hd}>Dashboard</span></div>
          <div className="flex items-center gap-3">{["Overview", "Analytics", "Customers", "Settings"].map((l, i) => <span key={l} className={cn(expanded ? "text-[11px]" : "text-[8px]", i === 0 ? "font-semibold" : "opacity-50")}>{l}</span>)}<div className={cn("rounded-full", expanded ? "h-6 w-6" : "h-3 w-3")} style={{ background: c3 }} /></div>
        </div>
        {/* BODY: sidebar + content */}
        <div className="flex" style={{ minHeight: expanded ? 400 : 160 }}>
          {/* Sidebar */}
          <div className="flex flex-col gap-1 p-2" style={{ width: expanded ? 120 : 50, borderRight: `${bdr} solid ${c1}10`, background: c1 + "05" }}>
            {["Home", "Sales", "Products", "Reports", "Users"].map((s, i) => <div key={s} className={cn("flex items-center gap-1.5 rounded px-2 py-1.5", expanded ? "text-[10px]" : "text-[7px]")} style={{ background: i === 1 ? c2 + "20" : "transparent", color: i === 1 ? c2 : c1, opacity: i === 1 ? 1 : 0.6 }}><div className={cn("rounded", expanded ? "h-3 w-3" : "h-2 w-2")} style={{ background: i === 1 ? c2 : c1, opacity: 0.5 }} />{expanded && s}</div>)}
          </div>
          {/* Main content */}
          <div className="flex-1 p-3 space-y-3">
            {/* Stats row */}
            <div className={cn("grid grid-cols-3", gap)}>
              {[{ l: "Revenue", v: "€48.2K", d: "↑12%", c: c2 }, { l: "Orders", v: "1,284", d: "↑8%", c: c3 }, { l: "Visitors", v: "32.1K", d: "↑23%", c: c1 }].map((s) => <div className={cn("p-2", r)} style={{ background: c1 + "06", border: `${bdr} solid ${c1}10` }}><div className={cn("opacity-50 uppercase", expanded ? "text-[9px]" : "text-[6px]")} style={mn}>{s.l}</div><div className={cn("font-extrabold", expanded ? "text-xl" : "text-[10px]")} style={{ ...hd, color: s.c }}>{s.v}</div><div className={cn(expanded ? "text-[9px]" : "text-[6px]")} style={{ color: c3 }}>{s.d}</div></div>)}
            </div>
            {/* Chart area */}
            <div className={cn("p-2", r)} style={{ background: c1 + "06", border: `${bdr} solid ${c1}10` }}>
              <div className="flex items-center justify-between mb-2"><span className={cn("font-semibold", expanded ? "text-[10px]" : "text-[8px]")} style={hd}>Weekly Performance</span><span className={cn(expanded ? "text-[9px]" : "text-[7px]")} style={{ ...mn, color: c2 }}>Last 7 days</span></div>
              <div className="flex items-end gap-1" style={{ height: expanded ? 100 : 40 }}>{[40, 65, 45, 80, 55, 90, 70].map((h, i) => <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i % 2 === 0 ? c2 : c3, opacity: 0.4 + (h / 100) * 0.6 }} />)}</div>
            </div>
            {/* Table preview */}
            <div className={cn(r)} style={{ border: `${bdr} solid ${c1}10`, overflow: "hidden" }}>
              <div className="flex items-center px-2 py-1.5" style={{ background: c1 + "08", borderBottom: `${bdr} solid ${c1}10` }}><span className={cn("font-semibold", expanded ? "text-[10px]" : "text-[7px]")} style={hd}>Recent Orders</span></div>
              {[1, 2, 3].map((row) => <div key={row} className="flex items-center gap-2 px-2 py-1.5" style={{ borderBottom: row < 3 ? `${bdr} solid ${c1}08` : "none" }}><div className={cn("rounded-full", expanded ? "h-5 w-5" : "h-3 w-3")} style={{ background: row === 1 ? c2 : row === 2 ? c3 : c1, opacity: 0.6 }} /><div className="flex-1"><div className={cn(expanded ? "text-[10px]" : "text-[7px]", "font-medium")}>Order #00{row * 127}</div><div className={cn("opacity-40", expanded ? "text-[9px]" : "text-[6px]")} style={mn}>2 min ago</div></div><span className={cn("font-bold", expanded ? "text-[10px]" : "text-[7px]")} style={{ color: c2 }}>€{row * 149}.00</span></div>)}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: `${bdr} solid ${c1}10`, background: c1 + "05" }}><span className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")} style={mn}>© 2026 Dashboard Inc.</span><div className="flex gap-2">{["Privacy", "Terms"].map(l => <span key={l} className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")}>{l}</span>)}</div></div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

  // ═══ 2. E-COMMERCE — Loja completa com hero + produtos + CTA + footer ═══
  if (style === "ecommerce") return (
    <div>
      <div className={cn("overflow-hidden border", r)} style={{ ...base, borderColor: c1 + "20" }}>
        {/* NAV with hamburger + search + cart */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `${bdr} solid ${c1}15` }}>
          <div className="flex items-center gap-2"><div className="flex flex-col gap-0.5">{[0, 1, 2].map(j => <div key={j} className={cn(expanded ? "w-4 h-0.5" : "w-2.5 h-px")} style={{ background: c1 }} />)}</div><span className={cn("font-bold", expanded ? "text-base" : "text-[10px]")} style={hd}>Boutique</span></div>
          <div className="flex items-center gap-3">{["Shop", "About", "Contact"].map(l => <span key={l} className={cn("opacity-60", expanded ? "text-[11px]" : "text-[8px]")} style={bf ? { fontFamily: bf } : {}}>{l}</span>)}<div className={cn("rounded-full flex items-center justify-center", expanded ? "h-6 w-6" : "h-3 w-3")} style={{ background: c2 }}><span className={cn("font-bold", expanded ? "text-[9px]" : "text-[6px]")} style={{ color: c0 }}>2</span></div></div>
        </div>
        {/* HERO: split product showcase */}
        <div className={cn("grid grid-cols-2", expanded ? "gap-4 p-6" : "gap-2 p-2.5")}>
          <div className="space-y-2"><span className={cn("font-bold uppercase tracking-wider", expanded ? "text-[10px]" : "text-[7px]")} style={{ color: c2 }}>New Collection</span><h1 className={cn("font-bold leading-tight", expanded ? "text-3xl" : "text-sm")} style={hd}>Autumn<br/>Essentials</h1><p className={cn("opacity-60 leading-relaxed", sz)}>Premium handcrafted pieces designed for the modern lifestyle. Free shipping on orders over €50.</p><div className="flex gap-2"><button className={cn("font-bold", expanded ? "px-4 py-2 text-[11px]" : "px-2 py-1 text-[8px]", r)} style={{ background: c2, color: c0 }}>Shop Now →</button><button className={cn("font-bold border", expanded ? "px-4 py-2 text-[11px]" : "px-2 py-1 text-[8px]", r)} style={{ borderColor: c1 + "40", color: c1 }}>Wishlist</button></div></div>
          <div className={cn("flex items-center justify-center relative overflow-hidden", r)} style={{ background: c2 + "20", minHeight: expanded ? 200 : 80 }}>
            <div className={cn("rounded-full opacity-50", expanded ? "h-24 w-24" : "h-10 w-10")} style={{ background: c3 }} />
            <div className="absolute top-2 right-2 rounded-full px-2 py-0.5" style={{ background: c3 }}><span className={cn("font-bold", expanded ? "text-[10px]" : "text-[7px]")} style={{ color: c0 }}>-30%</span></div>
            {fontCount === 3 && <div className="absolute bottom-2 left-2" style={{ ...mn, color: c1, opacity: 0.4 }}><code className={cn(expanded ? "text-[9px]" : "text-[7px]")}>SKU-2026-AW</code></div>}
          </div>
        </div>
        {/* SECTION: Product grid */}
        <div className={cn("px-4 py-3")} style={{ borderTop: `${bdr} solid ${c1}10` }}>
          <div className="flex items-center justify-between mb-2"><h2 className={cn("font-bold", expanded ? "text-sm" : "text-[10px]")} style={hd}>Best Sellers</h2><span className={cn("opacity-50", expanded ? "text-[10px]" : "text-[7px]")} style={{ color: c2 }}>View all →</span></div>
          <div className={cn("grid", gap, colorCount === 2 ? "grid-cols-2" : colorCount === 3 ? "grid-cols-3" : "grid-cols-4")}>
            {colors.map((c, i) => <div key={i} className={cn("overflow-hidden", r)} style={{ border: `${bdr} solid ${c1}15` }}>
              <div className={cn("relative", expanded ? "h-28" : "h-12")} style={{ background: c.hex }}><div className={cn("absolute top-1 right-1 rounded-full", expanded ? "h-4 w-4" : "h-2 w-2")} style={{ background: c0, opacity: 0.4 }} /></div>
              <div className="p-1.5"><div className={cn("font-semibold", expanded ? "text-[11px]" : "text-[8px]")} style={hd}>Product {i + 1}</div><div className={cn("opacity-50", expanded ? "text-[9px]" : "text-[7px]")}>Premium quality</div><div className={cn("font-bold mt-0.5", expanded ? "text-xs" : "text-[8px]")} style={{ color: c2 }}>€{(i + 1) * 49}.00</div></div>
            </div>)}
          </div>
        </div>
        {/* CTA banner */}
        <div className={cn("mx-4 my-3 p-3 flex items-center justify-between", r)} style={{ background: c2 }}>
          <div><div className={cn("font-bold", expanded ? "text-sm" : "text-[9px]")} style={{ color: c0 }}>Free shipping over €50</div><div className={cn("opacity-70", expanded ? "text-[10px]" : "text-[7px]")} style={{ color: c0 }}>Limited time offer</div></div>
          <button className={cn("font-bold rounded px-3 py-1.5", expanded ? "text-[10px]" : "text-[8px]")} style={{ background: c0, color: c2 }}>Claim →</button>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: `${bdr} solid ${c1}10`, background: c1 + "05" }}><span className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")} style={mn}>© 2026 Boutique</span><div className="flex gap-2">{["Shipping", "Returns", "FAQ"].map(l => <span key={l} className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")}>{l}</span>)}</div></div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

  // ═══ 3. PORTFOLIO — Agency site com hero fullscreen + cases + about + contact ═══
  if (style === "portfolio") return (
    <div>
      <div className={cn("overflow-hidden border", r)} style={{ ...base, borderColor: c1 + "20" }}>
        {/* NAV */}
        <div className="flex items-center justify-between px-4 py-2.5"><span className={cn("font-bold tracking-tight", expanded ? "text-lg" : "text-[11px]")} style={hd}>STUDIO</span><div className="flex items-center gap-3">{["Work", "About", "Contact"].map(l => <span key={l} className={cn("opacity-60", expanded ? "text-[11px]" : "text-[8px]")}>{l}</span>)}<button className={cn("rounded-full px-3 py-1 font-bold", expanded ? "text-[10px]" : "text-[7px]")} style={{ background: c2, color: c0 }}>Hire Us</button></div></div>
        {/* HERO fullscreen */}
        <div className="text-center py-8 px-4">
          <span className={cn("font-semibold uppercase tracking-widest", expanded ? "text-[10px]" : "text-[7px]")} style={{ color: c2 }}>Digital Design Studio</span>
          <h1 className={cn("font-extrabold leading-none mt-2", expanded ? "text-6xl" : "text-2xl")} style={hd}>We craft<br/><span style={{ color: c2 }}>digital</span> experiences</h1>
          <p className={cn("opacity-50 mt-3 max-w-md mx-auto", sz)}>Award-winning studio building the future of the web. We blend design, technology, and storytelling.</p>
          <div className="flex justify-center gap-2 mt-4"><button className={cn("rounded-full px-4 py-2 font-bold", expanded ? "text-[11px]" : "text-[8px]")} style={{ background: c2, color: c0 }}>View Work →</button><button className={cn("rounded-full border px-4 py-2 font-bold", expanded ? "text-[11px]" : "text-[8px]")} style={{ borderColor: c1 + "40", color: c1 }}>Our Process</button></div>
        </div>
        {/* STATS */}
        <div className={cn("grid grid-cols-4 gap-2 px-4 py-3")} style={{ borderTop: `${bdr} solid ${c1}10`, borderBottom: `${bdr} solid ${c1}10` }}>
          {[{ n: "150+", l: "Projects" }, { n: "28", l: "Awards" }, { n: "12y", l: "Experience" }, { n: "98%", l: "Happy" }].map((s, i) => <div className="text-center"><div className={cn("font-extrabold", expanded ? "text-2xl" : "text-[10px]")} style={{ ...hd, color: [c2, c3, c1, c2][i] }}>{s.n}</div><div className={cn("opacity-40 uppercase", expanded ? "text-[9px]" : "text-[6px]")}>{s.l}</div></div>)}
        </div>
        {/* PROJECT CASES */}
        <div className="px-4 py-3">
          <h2 className={cn("font-bold mb-2", expanded ? "text-sm" : "text-[10px]")} style={hd}>Selected Work</h2>
          <div className={cn("grid gap-2", colorCount === 2 ? "grid-cols-2" : "grid-cols-3")}>
            {colors.slice(0, colorCount).map((c, i) => <div key={i} className={cn("overflow-hidden flex flex-col", expanded ? "h-36" : "h-16", r)} style={{ background: c.hex }}>
              <div className="flex-1 flex items-center justify-center relative"><div className={cn("rounded-full opacity-30", expanded ? "h-12 w-12" : "h-6 w-6")} style={{ background: c0 }} />{i === 0 && <div className={cn("absolute top-1 right-1 rounded px-1 py-0.5", expanded ? "text-[8px]" : "text-[6px]")} style={{ background: c3, color: c0 }}>SOTD</div>}</div>
              <div className="p-1.5" style={{ background: c0 + "90" }}><div className={cn("font-bold", expanded ? "text-[11px]" : "text-[8px]")} style={{ ...hd, color: c1 }}>Case {i + 1}</div><div className={cn("opacity-50", expanded ? "text-[9px]" : "text-[7px]")} style={{ color: c1 }}>Brand · Web · Motion</div></div>
            </div>)}
          </div>
        </div>
        {/* SERVICES strip */}
        <div className={cn("grid grid-cols-3 gap-2 px-4 py-3")} style={{ background: c1 + "05", borderTop: `${bdr} solid ${c1}10` }}>
          {["Strategy", "Design", "Development"].map((s, i) => <div className="text-center"><div className={cn("mb-1", expanded ? "text-lg" : "text-[10px]")} style={{ color: [c2, c3, c2][i] }}>{["◆", "✦", "▲"][i]}</div><div className={cn("font-bold", expanded ? "text-[11px]" : "text-[8px]")} style={hd}>{s}</div><div className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")}>Lorem ipsum dolor sit</div></div>)}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-3"><div><div className={cn("font-bold", expanded ? "text-sm" : "text-[10px]")} style={hd}>STUDIO</div><div className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")} style={mn}>hello@studio.design</div></div><div className="flex gap-2">{["Tw", "Ig", "Be"].map(s => <div key={s} className={cn("flex items-center justify-center rounded-full", expanded ? "h-7 w-7" : "h-4 w-4")} style={{ border: `${bdr} solid ${c1}30`, color: c1, opacity: 0.5 }}><span className={cn(expanded ? "text-[9px]" : "text-[6px]")}>{s}</span></div>)}</div></div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

  // ═══ 4. EDITORIAL — Magazine completo com featured + grid + newsletter ═══
  if (style === "editorial") return (
    <div>
      <div className={cn("overflow-hidden border", r)} style={{ ...base, borderColor: c1 + "20" }}>
        {/* MASTHEAD */}
        <div className="text-center py-3 px-4" style={{ borderBottom: `${bdr} solid ${c1}20` }}>
          <div className={cn("mb-1", expanded ? "text-[10px]" : "text-[7px]")} style={{ color: c3, letterSpacing: "0.2em" }}>VOL. 24 · 2026</div>
          <span className={cn("font-bold", expanded ? "text-2xl" : "text-sm")} style={{ ...hd, letterSpacing: "0.03em" }}>The Journal</span>
        </div>
        {/* NAV */}
        <div className="flex items-center justify-center gap-4 py-2" style={{ borderBottom: `${bdr} solid ${c1}15` }}>{["Culture", "Design", "Tech", "Essays"].map((l, i) => <span key={l} className={cn(expanded ? "text-[10px]" : "text-[8px]", i === 0 ? "font-bold" : "opacity-50")} style={i === 0 ? { color: c2 } : {}}>{l}</span>)}</div>
        {/* FEATURED */}
        <div className={cn("grid grid-cols-3 gap-3 p-4")}>
          <div className="col-span-2 space-y-1.5">
            <span className={cn("font-bold uppercase tracking-wider rounded px-1.5 py-0.5", expanded ? "text-[9px]" : "text-[7px]")} style={{ background: c2, color: c0, display: "inline-block" }}>Featured</span>
            <h1 className={cn("font-bold leading-tight", expanded ? "text-3xl" : "text-sm")} style={hd}>The future of spec-driven development is here</h1>
            <p className={cn("opacity-60 leading-relaxed", sz)}>How AI is transforming the way we build websites — from idea to production in minutes. A deep dive into the tools, workflows, and design systems shaping tomorrow's web.</p>
            <div className="flex items-center gap-2"><div className={cn("rounded-full", expanded ? "h-5 w-5" : "h-3 w-3")} style={{ background: c3 }} /><span className={cn("opacity-50", sz)}>By Sarah Chen · 5 min read</span></div>
          </div>
          <div className={cn("flex items-center justify-center overflow-hidden", r)} style={{ background: c3 + "20", minHeight: expanded ? 160 : 60 }}><div className={cn("rounded-lg opacity-40", expanded ? "h-20 w-14" : "h-8 w-5")} style={{ background: c3 }} /></div>
        </div>
        {/* ARTICLE GRID */}
        <div className={cn("grid gap-2 px-4 pb-3", colorCount === 2 ? "grid-cols-2" : "grid-cols-3")}>
          {colors.map((c, i) => <div key={i} className={cn("overflow-hidden", r)} style={{ border: `${bdr} solid ${c1}15` }}>
            <div className={cn(expanded ? "h-20" : "h-10")} style={{ background: c.hex, opacity: 0.8 }} />
            <div className="p-2"><span className={cn("font-bold uppercase", expanded ? "text-[8px]" : "text-[6px]")} style={{ color: c2 }}>Category</span><div className={cn("font-semibold leading-tight mt-0.5", expanded ? "text-[11px]" : "text-[8px]")} style={hd}>Article title goes here with impact</div><div className={cn("opacity-40 mt-0.5", expanded ? "text-[9px]" : "text-[7px]")} style={mn}>3 min · Author</div></div>
          </div>)}
        </div>
        {/* NEWSLETTER */}
        <div className={cn("mx-4 mb-3 p-3 text-center", r)} style={{ background: c2 + "10", border: `${bdr} solid ${c2}30` }}>
          <div className={cn("font-bold", expanded ? "text-sm" : "text-[10px]")} style={{ ...hd, color: c2 }}>Subscribe to The Journal</div>
          <div className={cn("opacity-50 mt-0.5", sz)}>Weekly insights on design and technology</div>
          <div className="flex gap-1 mt-2 justify-center"><input className={cn("px-2 py-1 rounded border", expanded ? "text-[10px] w-40" : "text-[8px] w-20")} style={{ background: c0, borderColor: c1 + "30", color: c1 }} placeholder="your@email.com" readOnly /><button className={cn("font-bold rounded px-2 py-1", expanded ? "text-[10px]" : "text-[8px]")} style={{ background: c2, color: c0 }}>Subscribe</button></div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: `${bdr} solid ${c1}10` }}><span className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")} style={mn}>© 2026 The Journal</span><div className="flex gap-2">{["About", "Contact", "RSS"].map(l => <span key={l} className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")}>{l}</span>)}</div></div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

  // ═══ 5. BRUTALIST — Hard edges, bold, monospace, raw blocks ═══
  if (style === "brutalist") return (
    <div>
      <div style={{ ...base, border: `3px solid ${c1}`, borderRadius: 0 }}>
        {/* NAV — raw blocks */}
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: `2px solid ${c1}` }}>
          <span className={cn("font-black uppercase tracking-tight", expanded ? "text-xl" : "text-[11px]")} style={{ ...hd, fontFamily: mf, letterSpacing: "-0.05em" }}>BRAND//</span>
          <div className="flex items-center gap-0">{["WORK", "INFO", "CTA"].map((l, i) => <span key={l} className={cn("font-bold uppercase px-2 py-1", expanded ? "text-[10px]" : "text-[7px]")} style={{ background: i === 2 ? c2 : "transparent", color: i === 2 ? c0 : c1, border: `1px solid ${c1}`, fontFamily: mf }}>{l}</span>)}</div>
        </div>
        {/* HERO — huge, no rounding */}
        <div className="px-4 py-6">
          <h1 className={cn("font-black leading-none uppercase", expanded ? "text-7xl" : "text-3xl")} style={{ ...hd, letterSpacing: "-0.04em" }}>RAW<br/><span style={{ color: c2, background: c1, padding: "0 6px" }}>DESIGN</span></h1>
          <p className={cn("mt-3 font-bold uppercase", expanded ? "text-[11px]" : "text-[8px]")} style={{ ...mn, color: c3 }}>NO ROUNDS / NO BORDERS / NO LIMITS</p>
          <div className="flex gap-0 mt-3"><button className={cn("font-black uppercase px-3 py-2", expanded ? "text-[11px]" : "text-[8px]")} style={{ background: c2, color: c0, fontFamily: mf, border: `2px solid ${c1}` }}>ENTER →</button><button className={cn("font-black uppercase px-3 py-2", expanded ? "text-[11px]" : "text-[8px]")} style={{ background: "transparent", color: c1, fontFamily: mf, border: `2px solid ${c1}` }}>INFO</button></div>
        </div>
        {/* MARQUEE strip */}
        <div className="flex items-center gap-4 px-4 py-1.5 overflow-hidden" style={{ background: c3, color: c0 }}><span className={cn("font-black uppercase whitespace-nowrap", expanded ? "text-[10px]" : "text-[7px]")} style={{ fontFamily: mf }}>★ NEW DROP ★ NEW DROP ★ NEW DROP ★ NEW DROP ★ NEW DROP ★</span></div>
        {/* GRID — hard rectangles */}
        <div className={cn("grid p-4", gap, colorCount === 2 ? "grid-cols-2" : colorCount === 3 ? "grid-cols-3" : "grid-cols-4")}>
          {colors.map((c, i) => <div key={i} className="p-2" style={{ background: c.hex, border: `2px solid ${c1}` }}>
            <div className={cn("font-black uppercase mb-1", expanded ? "text-[11px]" : "text-[8px]")} style={{ color: c0, fontFamily: mf }}>BLOCK_{i + 1}</div>
            <div className={cn(expanded ? "h-12" : "h-6", "mb-1")} style={{ background: c0, opacity: 0.15 }} />
            <div className={cn("font-bold uppercase", expanded ? "text-[9px]" : "text-[7px]")} style={{ color: c0, opacity: 0.7, fontFamily: mf }}>// 0{i + 1} / RAW</div>
          </div>)}
        </div>
        {/* MANIFESTO */}
        <div className="px-4 py-4" style={{ borderTop: `2px solid ${c1}` }}>
          <div className={cn("font-black uppercase leading-tight", expanded ? "text-2xl" : "text-sm")} style={{ ...hd, fontFamily: mf }}>WE DON'T DO<br/>PRETTY. WE DO<br/><span style={{ background: c2, color: c0, padding: "0 4px" }}>REAL.</span></div>
          <p className={cn("mt-2 font-bold uppercase opacity-60", expanded ? "text-[10px]" : "text-[7px]")} style={{ ...mn, color: c3 }}>EST. 2026 / NO COMPROMISE / NO BULLSHIT</p>
        </div>
        {/* FOOTER bar */}
        <div className="flex items-center justify-between px-4 py-2" style={{ background: c2, color: c0, borderTop: `2px solid ${c1}` }}>
          <span className={cn("font-black uppercase", expanded ? "text-[10px]" : "text-[7px]")} style={{ fontFamily: mf }}>// END_OF_PAGE</span>
          <span className={cn("font-bold", expanded ? "text-[10px]" : "text-[7px]")} style={{ fontFamily: mf }}>2026 © BRAND//</span>
        </div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

  // ═══ 6. VINTAGE — Ornamental, serif, classic luxury ═══
  if (style === "vintage") return (
    <div>
      <div className={cn("border-2", pd, r)} style={{ ...base, borderColor: c1 + "30", boxShadow: `inset 0 0 30px ${c1}08` }}>
        {/* MASTHEAD ornamental */}
        <div className="text-center mb-3 pb-3" style={{ borderBottom: `2px solid ${c1}20` }}>
          <div className={cn("mb-1", expanded ? "text-[12px]" : "text-[8px]")} style={{ color: c3, letterSpacing: "0.3em" }}>✦ EST. 1924 ✦</div>
          <span className={cn("font-bold", expanded ? "text-3xl" : "text-base")} style={{ ...hd, letterSpacing: "0.05em" }}>The Atelier</span>
          <div className={cn("mt-1 italic", expanded ? "text-[10px]" : "text-[7px]")} style={{ color: c2 }}>"Craftsmanship & Heritage"</div>
        </div>
        {/* NAV ornamental */}
        <div className="text-center mb-3"><div className={cn("flex items-center justify-center gap-3", expanded ? "text-[10px]" : "text-[8px]")}><span style={{ color: c3 }}>·</span>{["Collection", "Atelier", "Heritage", "Contact"].map((l, i) => <span key={l} className={cn("italic", i === 0 ? "font-bold" : "opacity-60")} style={{ color: i === 0 ? c2 : c1 }}>{l}</span>)}<span style={{ color: c3 }}>·</span></div></div>
        {/* HERO split */}
        <div className={cn("grid grid-cols-2 gap-3 mb-3")}>
          <div className="space-y-1.5"><span className={cn("italic", expanded ? "text-[10px]" : "text-[8px]")} style={{ color: c2 }}>— No. XII —</span><h1 className={cn("font-bold leading-tight", expanded ? "text-3xl" : "text-sm")} style={{ ...hd, fontStyle: "italic" }}>A Timeless<br/>Collection</h1><p className={cn("opacity-70 leading-relaxed italic", sz)}>Curated with passion, crafted by hand, for those who appreciate the finer things in life. Each piece tells a story of dedication.</p><button className={cn("px-3 py-1.5 font-semibold italic", expanded ? "text-[11px]" : "text-[8px]", r)} style={{ border: `1px solid ${c2}`, color: c2, background: "transparent" }}>Discover →</button></div>
          <div className={cn("flex items-center justify-center", r)} style={{ background: c2 + "15", border: `1px solid ${c2}30`, minHeight: expanded ? 140 : 60 }}><div className="text-center"><div className={cn(expanded ? "text-3xl" : "text-lg")} style={{ color: c3 }}>❦</div><div className={cn("italic opacity-50 mt-1", expanded ? "text-[9px]" : "text-[7px]")} style={{ color: c2 }}>Handcrafted<br/>with care</div></div></div>
        </div>
        {/* Ornamental divider */}
        <div className="text-center my-3" style={{ color: c3, letterSpacing: "0.5em" }}>· · ·</div>
        {/* COLLECTION grid */}
        <div className="mb-3">
          <div className="text-center mb-2"><span className={cn("italic font-semibold", expanded ? "text-[12px]" : "text-[9px]")} style={{ ...hd, color: c2 }}>The Collection</span></div>
          <div className={cn("grid", gap, colorCount === 2 ? "grid-cols-2" : "grid-cols-3")}>
            {colors.map((c, i) => <div key={i} className={cn("p-2 text-center", r)} style={{ border: `1px solid ${c1}20`, background: c.hex + "08" }}>
              <div className={cn("mb-1", expanded ? "text-[12px]" : "text-[8px]")} style={{ color: c3 }}>❧</div>
              <div className={cn("font-semibold italic", expanded ? "text-[12px]" : "text-[9px]")} style={{ ...hd, color: c.hex }}>Piece {i + 1}</div>
              <div className={cn("italic opacity-50", expanded ? "text-[9px]" : "text-[7px]")}>No. {i + 1} · Limited</div>
              {fontCount === 3 && <div className={cn("italic opacity-30 mt-0.5", expanded ? "text-[8px]" : "text-[6px]")} style={mn}>Ref: 19{24 + i}</div>}
            </div>)}
          </div>
        </div>
        {/* HERITAGE quote */}
        <div className={cn("text-center py-3 my-2", r)} style={{ background: c2 + "08", borderTop: `1px solid ${c2}20`, borderBottom: `1px solid ${c2}20` }}>
          <div className={cn("italic font-semibold", expanded ? "text-[14px]" : "text-[10px]")} style={{ ...hd, color: c2 }}>"Quality is never an accident;<br/>it is always the result of intelligent effort."</div>
          <div className={cn("mt-1 opacity-50 italic", expanded ? "text-[9px]" : "text-[7px]")} style={mn}>— John Ruskin</div>
        </div>
        {/* FOOTER */}
        <div className="text-center py-2"><div style={{ color: c3, letterSpacing: "0.3em" }} className={cn(expanded ? "text-[9px]" : "text-[7px]")}>✦ ✦ ✦</div><div className={cn("italic opacity-40 mt-1", expanded ? "text-[9px]" : "text-[7px]")} style={mn}>© The Atelier · Since 1924</div></div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

  // ═══ 7. TECH — Terminal/code, glow, dark, status bars ═══
  if (style === "tech") return (
    <div>
      <div className={cn("border-2", pd, r)} style={{ ...base, borderColor: c2 + "40", boxShadow: `0 0 ${expanded ? "30px" : "12px"} ${c2}20` }}>
        {/* Terminal nav */}
        <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: `1px solid ${c2}30` }}>
          <div className="flex gap-1">{[c2, c3, c1].map((col, i) => <div key={i} className={cn("rounded-full", expanded ? "h-3 w-3" : "h-2 w-2")} style={{ background: col, opacity: 0.7 }} />)}</div>
          <code className={cn(expanded ? "text-[11px]" : "text-[8px]")} style={{ ...mn, color: c2 }}>~/inaugura-base</code>
          <span className={cn("ml-auto flex items-center gap-1", expanded ? "text-[10px]" : "text-[8px]")} style={{ ...mn, color: c3 }}><span style={{ color: c3 }}>●</span> LIVE</span>
        </div>
        {/* Terminal output */}
        <div className="space-y-1 mb-4">
          <code className={cn(expanded ? "text-[11px]" : "text-[8px]")} style={{ ...mn, color: c3 }}>$ inaugura init --premium --awwwards</code>
          <code className={cn(expanded ? "text-[11px]" : "text-[8px]")} style={{ ...mn, color: c1, opacity: 0.5 }}>→ Initializing project structure...</code>
          <code className={cn(expanded ? "text-[11px]" : "text-[8px]")} style={{ ...mn, color: c1, opacity: 0.5 }}>→ Installing dependencies [████████████] 100%</code>
          <code className={cn(expanded ? "text-[11px]" : "text-[8px]")} style={{ ...mn, color: c2 }}>✓ Ready in 3.2s</code>
          <h1 className={cn("font-bold mt-2", expanded ? "text-4xl" : "text-lg")} style={{ ...hd, ...mn, color: c2 }}>Build.Ship.Scale.</h1>
          <code className={cn(expanded ? "text-[10px]" : "text-[8px]")} style={{ ...mn, color: c1, opacity: 0.5 }}>// Production-ready spec-driven development</code>
        </div>
        {/* CTA buttons */}
        <div className="flex gap-2 mb-4"><button className={cn("font-bold px-3 py-1.5", expanded ? "text-[11px]" : "text-[8px]", r)} style={{ background: c2, color: c0, fontFamily: mf }}>$ deploy --prod</button><button className={cn("font-bold px-3 py-1.5", expanded ? "text-[11px]" : "text-[8px]", r)} style={{ border: `1px solid ${c2}`, color: c2, fontFamily: mf, background: "transparent" }}>--docs</button><button className={cn("font-bold px-3 py-1.5", expanded ? "text-[11px]" : "text-[8px]", r)} style={{ border: `1px solid ${c3}`, color: c3, fontFamily: mf, background: "transparent" }}>--help</button></div>
        {/* METRICS grid */}
        <div className={cn("grid", gap, colorCount === 2 ? "grid-cols-2" : "grid-cols-3")}>
          {colors.map((c, i) => <div key={i} className={cn("p-2", r)} style={{ background: c.hex + "0A", border: `1px solid ${c.hex}30` }}>
            <div className="flex items-center justify-between mb-1"><code className={cn(expanded ? "text-[9px]" : "text-[7px]")} style={{ ...mn, color: c.hex }}>metric_{i + 1}</code><span className={cn("font-bold", expanded ? "text-[10px]" : "text-[7px]")} style={{ ...mn, color: c.hex }}>{[98, 45, 12, 87][i] ?? 50}%</span></div>
            <div className={cn(expanded ? "h-10" : "h-5", "rounded flex items-end gap-0.5")}>{[60, 80, 45, 90, 70, 55].map((h, j) => <div key={j} className="flex-1 rounded-t" style={{ height: `${h}%`, background: c.hex, opacity: 0.3 + j * 0.12 }} />)}</div>
            <div className={cn("mt-1 flex items-center gap-1", expanded ? "text-[8px]" : "text-[6px]")} style={{ ...mn, color: c1, opacity: 0.4 }}><span style={{ color: c3 }}>●</span> running</div>
          </div>)}
        </div>
        {/* STATUS bar */}
        <div className={cn("mt-3 flex items-center justify-between px-3 py-1.5", r)} style={{ background: c1 + "08" }}>
          <div className="flex items-center gap-3"><code className={cn(expanded ? "text-[9px]" : "text-[7px]")} style={{ ...mn, color: c3 }}>CPU: 12%</code><code className={cn(expanded ? "text-[9px]" : "text-[7px]")} style={{ ...mn, color: c3 }}>MEM: 340MB</code><code className={cn(expanded ? "text-[9px]" : "text-[7px]")} style={{ ...mn, color: c2 }}>↑ 1.2KB/s</code></div>
          <code className={cn(expanded ? "text-[9px]" : "text-[7px]")} style={{ ...mn, color: c2 }}>200 OK ✓</code>
        </div>
        {/* Footer */}
        <div className={cn("mt-2 flex items-center justify-between", expanded ? "text-[9px]" : "text-[7px]")} style={{ ...mn, color: c1, opacity: 0.3 }}><span>// inaugura-base v0.3.0</span><span>uptime: 99.9%</span></div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

  return null;
}

// ============================================================================
// ColorLegend — legenda com cores discriminadas em baixo do mockup
// ============================================================================
function ColorLegend({ colors, expanded }: { colors: { hex: string; role: string }[]; expanded?: boolean }) {
  return (
    <div className={cn("mt-2 flex flex-wrap gap-2 rounded-lg border border-border bg-card/30 p-2", expanded && "p-3")}>
      {colors.map((c, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={cn("rounded shrink-0", expanded ? "h-5 w-5" : "h-3 w-3")} style={{ background: c.hex, border: `1px solid ${c.hex}40` }} />
          <div>
            <div className={cn("font-semibold", expanded ? "text-[10px]" : "text-[8px]")} style={{ color: "hsl(var(--foreground))" }}>{c.role}</div>
            <div className={cn("opacity-50", expanded ? "text-[9px]" : "text-[7px]")} style={{ fontFamily: "monospace" }}>{c.hex}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
