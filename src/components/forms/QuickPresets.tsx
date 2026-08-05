"use client";

// ============================================================================
// QuickPresets — 25 combos curados de (estética + efeitos + mood + cor style)
// ============================================================================
// 1 clique aplica um "starter kit" completo ao state do SimpleForge.
// Inspirado em sites Awwwards SOTD reais (Linear, Vercel, Stripe, Framer, etc.)
//
// Categorias:
//  - Portfolio (5)      → Awwwards Folio, Minimal Swiss, Brutalist Raw, 3D WebGL, Photographer
//  - SaaS (5)           → Launch Conv, Dashboard, Fintech Trust, DevTools, AI Landing
//  - Commerce (3)       → Boutique Premium, Headless Perf, Marketplace
//  - Editorial (3)      → Magazine, Blog Authority, Documentation
//  - Local/Restaurant (2) → Restaurant Orders, Hotel Luxury
//  - Creative (3)       → Motion Studio, Architect Spatial, Musician Immersive
//  - Tech/Brutalist (2) → Dev Terminal, Gaming Esports
//  - Misc (2)           → Event Campaign, Real Estate
// ============================================================================

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Briefcase, AppWindow, ShoppingBag, Newspaper, UtensilsCrossed,
  Wand2 as WandIcon, Cpu, Calendar, Home, Layers, ChevronDown,
  Check, Sparkles, Rocket, Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Categorias ──────────────────────────────────────────────────────────────
const CATEGORIES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "saas", label: "SaaS", icon: AppWindow },
  { id: "commerce", label: "Commerce", icon: ShoppingBag },
  { id: "editorial", label: "Editorial", icon: Newspaper },
  { id: "local", label: "Local", icon: UtensilsCrossed },
  { id: "creative", label: "Creative", icon: WandIcon },
  { id: "tech", label: "Tech", icon: Cpu },
  { id: "misc", label: "Outros", icon: Layers },
];

// ── Estrutura de 1 preset (o que aplica ao state) ──────────────────────────
export interface QuickPreset {
  id: string;
  name: string;
  tagline: string;
  category: string;
  badge?: "awwwards" | "conversion" | "speed" | "enterprise" | "flagship";
  vibeColor: string; // gradient preview
  // Patches a aplicar no SimpleForgeValues:
  patch: {
    aesthetic?: string;
    mood?: string[];
    effectsStyle?: string[];
    colorStyle?: string;
    colorPreset?: string;
    projectType?: string;
  };
}

// ── Os 25 presets curados ───────────────────────────────────────────────────
export const QUICK_PRESETS: QuickPreset[] = [
  // ─── Portfolio (5) ──────────────────────────────────────────────────────
  {
    id: "qp-folio-cinematic",
    name: "Folio Cinematic",
    tagline: "Portfolio full-bleed com motion editorial",
    category: "portfolio",
    badge: "awwwards",
    vibeColor: "from-violet-500/30 via-purple-500/20 to-fuchsia-500/30",
    patch: {
      aesthetic: "dark-premium",
      mood: ["Luxo", "Criativo"],
      effectsStyle: ["Cinematic", "Smooth scroll", "Reveal on scroll", "Parallax"],
      colorStyle: "editorial-dark",
      colorPreset: "trend-aurora",
      projectType: "portfolio",
    },
  },
  {
    id: "qp-folio-swiss",
    name: "Folio Minimal Swiss",
    tagline: "Grelha rígida, tipo forte, zero decoração",
    category: "portfolio",
    badge: "speed",
    vibeColor: "from-zinc-300/30 via-stone-300/20 to-neutral-400/30",
    patch: {
      aesthetic: "minimal-swiss",
      mood: ["Minimalista", "Profissional"],
      effectsStyle: ["Minimal classic", "Reveal on scroll"],
      colorStyle: "swiss-clean",
      colorPreset: "trend-mono",
      projectType: "portfolio",
    },
  },
  {
    id: "qp-folio-brutalist",
    name: "Folio Brutalist Raw",
    tagline: "HTML cru, tipografia gigante, sem filtres",
    category: "portfolio",
    badge: "flagship",
    vibeColor: "from-orange-500/30 via-red-500/20 to-yellow-500/30",
    patch: {
      aesthetic: "brutalist",
      mood: ["Ousado", "Criativo"],
      effectsStyle: ["Marquee Infinite", "Text Reveal Mask", "Cursor Custom"],
      colorStyle: "brutalist",
      colorPreset: "trend-volcano",
      projectType: "portfolio",
    },
  },
  {
    id: "qp-folio-3d",
    name: "Folio 3D WebGL",
    tagline: "Experiência imersiva Three.js / R3F",
    category: "portfolio",
    badge: "awwwards",
    vibeColor: "from-indigo-500/30 via-blue-500/20 to-cyan-500/30",
    patch: {
      aesthetic: "3d-immersive",
      mood: ["Techy", "Ousado"],
      effectsStyle: ["3D / WebGL leve", "Smooth scroll", "Cursor Custom", "Spotlight Follow"],
      colorStyle: "futuristic",
      colorPreset: "trend-deepsea",
      projectType: "portfolio",
    },
  },
  {
    id: "qp-photographer",
    name: "Photographer Gallery",
    tagline: "Galeria full-bleed com image reveal",
    category: "portfolio",
    vibeColor: "from-slate-700/30 via-zinc-700/20 to-neutral-800/30",
    patch: {
      aesthetic: "dark-premium",
      mood: ["Luxo", "Minimalista"],
      effectsStyle: ["Image Reveal Clip", "Smooth scroll", "Fullscreen sections"],
      colorStyle: "editorial-dark",
      colorPreset: "trend-mono",
      projectType: "portfolio",
    },
  },

  // ─── SaaS (5) ───────────────────────────────────────────────────────────
  {
    id: "qp-saas-launch",
    name: "SaaS Launch",
    tagline: "Landing de conversão com bento grid + social proof",
    category: "saas",
    badge: "conversion",
    vibeColor: "from-blue-500/30 via-cyan-500/20 to-emerald-500/30",
    patch: {
      aesthetic: "modern-clean",
      mood: ["Profissional", "Techy"],
      effectsStyle: ["Bento Grid Animated", "Reveal on scroll", "Number Counter", "Marquee Infinite"],
      colorStyle: "saas-clean",
      colorPreset: "trend-aurora",
      projectType: "saas",
    },
  },
  {
    id: "qp-saas-dashboard",
    name: "SaaS Dashboard",
    tagline: "App com sidebar + cards de stats + gráficos",
    category: "saas",
    badge: "enterprise",
    vibeColor: "from-slate-600/30 via-blue-600/20 to-indigo-600/30",
    patch: {
      aesthetic: "modern-clean",
      mood: ["Profissional", "Techy"],
      effectsStyle: ["Bento Grid Animated", "Number Counter", "Scroll Progress"],
      colorStyle: "saas-clean",
      colorPreset: "trend-deepsea",
      projectType: "dashboard",
    },
  },
  {
    id: "qp-saas-fintech",
    name: "SaaS Fintech Trust",
    tagline: "Confiança + segurança + animações subtis",
    category: "saas",
    badge: "enterprise",
    vibeColor: "from-emerald-600/30 via-teal-600/20 to-cyan-700/30",
    patch: {
      aesthetic: "corporate-trust",
      mood: ["Profissional", "Luxo"],
      effectsStyle: ["Minimal classic", "Reveal on scroll", "Number Counter"],
      colorStyle: "corporate",
      colorPreset: "trend-forest",
      projectType: "saas",
    },
  },
  {
    id: "qp-saas-devtools",
    name: "SaaS DevTools",
    tagline: "Plataforma API com terminal aesthetic",
    category: "saas",
    badge: "conversion",
    vibeColor: "from-zinc-700/30 via-gray-700/20 to-slate-800/30",
    patch: {
      aesthetic: "ai-futuristic",
      mood: ["Techy", "Minimalista"],
      effectsStyle: ["Cursor Custom", "Text Reveal Mask", "Scroll Progress"],
      colorStyle: "terminal",
      colorPreset: "trend-cyber",
      projectType: "saas",
    },
  },
  {
    id: "qp-saas-ai",
    name: "AI Product Landing",
    tagline: "Landing de produto AI com aurora + glow",
    category: "saas",
    badge: "flagship",
    vibeColor: "from-cyan-500/30 via-blue-500/20 to-violet-500/30",
    patch: {
      aesthetic: "ai-futuristic",
      mood: ["Techy", "Ousado"],
      effectsStyle: ["Aurora Boreal", "Gradient Mesh BG", "Spotlight Follow", "Reveal on scroll"],
      colorStyle: "futuristic",
      colorPreset: "trend-aurora",
      projectType: "saas",
    },
  },

  // ─── Commerce (3) ───────────────────────────────────────────────────────
  {
    id: "qp-shop-boutique",
    name: "Boutique Premium",
    tagline: "E-commerce de marca com editorial feel",
    category: "commerce",
    badge: "awwwards",
    vibeColor: "from-amber-500/30 via-orange-500/20 to-rose-500/30",
    patch: {
      aesthetic: "editorial-serif",
      mood: ["Luxo", "Criativo"],
      effectsStyle: ["Image Reveal Clip", "Smooth scroll", "Parallax", "Magnetic Hover"],
      colorStyle: "editorial-warm",
      colorPreset: "trend-sunset",
      projectType: "ecommerce",
    },
  },
  {
    id: "qp-shop-headless",
    name: "Headless Performance",
    tagline: "Shop ultra-rápido com minimal classic",
    category: "commerce",
    badge: "speed",
    vibeColor: "from-emerald-500/30 via-green-500/20 to-teal-500/30",
    patch: {
      aesthetic: "minimal-swiss",
      mood: ["Profissional", "Minimalista"],
      effectsStyle: ["Minimal classic", "Reveal on scroll"],
      colorStyle: "swiss-clean",
      colorPreset: "trend-forest",
      projectType: "ecommerce",
    },
  },
  {
    id: "qp-shop-marketplace",
    name: "Marketplace Multi",
    tagline: "Multi-vendor com bento + infinite scroll",
    category: "commerce",
    vibeColor: "from-purple-500/30 via-violet-500/20 to-indigo-500/30",
    patch: {
      aesthetic: "modern-clean",
      mood: ["Profissional", "Amigável"],
      effectsStyle: ["Bento Grid Animated", "Marquee Infinite", "Reveal on scroll", "Masonry Pinterest"],
      colorStyle: "saas-clean",
      colorPreset: "trend-coral",
      projectType: "marketplace",
    },
  },

  // ─── Editorial (3) ──────────────────────────────────────────────────────
  {
    id: "qp-editorial-magazine",
    name: "Magazine Digital",
    tagline: "Revista online com tipografia editorial",
    category: "editorial",
    badge: "awwwards",
    vibeColor: "from-rose-500/30 via-pink-500/20 to-orange-500/30",
    patch: {
      aesthetic: "editorial-serif",
      mood: ["Criativo", "Luxo"],
      effectsStyle: ["Reveal on scroll", "Smooth scroll", "Image Reveal Clip", "Sticky sections"],
      colorStyle: "editorial-warm",
      colorPreset: "trend-sunset",
      projectType: "blog",
    },
  },
  {
    id: "qp-editorial-blog",
    name: "Blog Authority SEO",
    tagline: "Blog limpo focado em leitura + SEO",
    category: "editorial",
    badge: "conversion",
    vibeColor: "from-blue-500/30 via-indigo-500/20 to-violet-500/30",
    patch: {
      aesthetic: "minimal-swiss",
      mood: ["Profissional", "Minimalista"],
      effectsStyle: ["Reveal on scroll", "Scroll Progress"],
      colorStyle: "swiss-clean",
      colorPreset: "trend-aurora",
      projectType: "blog",
    },
  },
  {
    id: "qp-editorial-docs",
    name: "Documentation Portal",
    tagline: "Docs técnicas com sidebar + search",
    category: "editorial",
    badge: "speed",
    vibeColor: "from-slate-500/30 via-gray-500/20 to-zinc-500/30",
    patch: {
      aesthetic: "minimal-swiss",
      mood: ["Techy", "Minimalista"],
      effectsStyle: ["Minimal classic", "Scroll Progress"],
      colorStyle: "swiss-clean",
      colorPreset: "trend-mono",
      projectType: "saas",
    },
  },

  // ─── Local (2) ──────────────────────────────────────────────────────────
  {
    id: "qp-restaurant",
    name: "Restaurant Orders",
    tagline: "Site de restaurante com menu + pedidos online",
    category: "local",
    vibeColor: "from-amber-600/30 via-orange-600/20 to-red-600/30",
    patch: {
      aesthetic: "editorial-serif",
      mood: ["Luxo", "Amigável"],
      effectsStyle: ["Image Reveal Clip", "Smooth scroll", "Parallax"],
      colorStyle: "editorial-warm",
      colorPreset: "trend-volcano",
      projectType: "restaurant",
    },
  },
  {
    id: "qp-hotel-luxury",
    name: "Hotel Luxury",
    tagline: "Hotel boutique com hero fullscreen + cinematic",
    category: "local",
    badge: "awwwards",
    vibeColor: "from-yellow-600/30 via-amber-600/20 to-stone-600/30",
    patch: {
      aesthetic: "dark-premium",
      mood: ["Luxo", "Minimalista"],
      effectsStyle: ["Cinematic", "Fullscreen sections", "Smooth scroll", "Parallax"],
      colorStyle: "editorial-dark",
      colorPreset: "trend-sunset",
      projectType: "realestate",
    },
  },

  // ─── Creative (3) ───────────────────────────────────────────────────────
  {
    id: "qp-motion-studio",
    name: "Motion Studio Reel",
    tagline: "Agência com reel fullscreen + transitions",
    category: "creative",
    badge: "awwwards",
    vibeColor: "from-fuchsia-500/30 via-pink-500/20 to-rose-500/30",
    patch: {
      aesthetic: "3d-immersive",
      mood: ["Criativo", "Ousado"],
      effectsStyle: ["Cinematic", "Fullscreen sections", "Smooth scroll", "Liquid Morph"],
      colorStyle: "futuristic",
      colorPreset: "trend-coral",
      projectType: "agency",
    },
  },
  {
    id: "qp-architect-spatial",
    name: "Architect Spatial",
    tagline: "Estúdio de arquitetura com 3D + spatial feel",
    category: "creative",
    badge: "awwwards",
    vibeColor: "from-stone-500/30 via-neutral-500/20 to-zinc-500/30",
    patch: {
      aesthetic: "3d-immersive",
      mood: ["Luxo", "Minimalista"],
      effectsStyle: ["3D / WebGL leve", "Parallax", "Smooth scroll", "Image Reveal Clip"],
      colorStyle: "editorial-warm",
      colorPreset: "trend-mono",
      projectType: "agency",
    },
  },
  {
    id: "qp-musician-immersive",
    name: "Musician Immersive",
    tagline: "Artista com player + visualizador + neon",
    category: "creative",
    badge: "flagship",
    vibeColor: "from-violet-500/30 via-purple-500/20 to-indigo-500/30",
    patch: {
      aesthetic: "3d-immersive",
      mood: ["Ousado", "Criativo"],
      effectsStyle: ["Neon Glow Pulse", "Liquid Morph", "Gradient Mesh BG", "Cursor Custom"],
      colorStyle: "futuristic",
      colorPreset: "trend-cyber",
      projectType: "portfolio",
    },
  },

  // ─── Tech (2) ───────────────────────────────────────────────────────────
  {
    id: "qp-dev-terminal",
    name: "Dev Terminal",
    tagline: "Portfolio dev com aesthetic terminal + mono",
    category: "tech",
    vibeColor: "from-green-600/30 via-emerald-600/20 to-teal-600/30",
    patch: {
      aesthetic: "ai-futuristic",
      mood: ["Techy", "Minimalista"],
      effectsStyle: ["Cursor Custom", "Text Reveal Mask", "Scroll Progress", "Minimal classic"],
      colorStyle: "terminal",
      colorPreset: "trend-forest",
      projectType: "portfolio",
    },
  },
  {
    id: "qp-gaming-esports",
    name: "Gaming Esports",
    tagline: "Team page com neon + tilt cards + confetti",
    category: "tech",
    badge: "flagship",
    vibeColor: "from-cyan-500/30 via-blue-500/20 to-purple-500/30",
    patch: {
      aesthetic: "playful-colorful",
      mood: ["Ousado", "Techy"],
      effectsStyle: ["Neon Glow Pulse", "Tilt 3D Cards", "Confetti Burst", "Marquee Infinite"],
      colorStyle: "futuristic",
      colorPreset: "trend-cyber",
      projectType: "landing",
    },
  },

  // ─── Misc (2) ───────────────────────────────────────────────────────────
  {
    id: "qp-event-campaign",
    name: "Event Campaign",
    tagline: "Conference/evento com countdown + lineup",
    category: "misc",
    badge: "conversion",
    vibeColor: "from-pink-500/30 via-rose-500/20 to-orange-500/30",
    patch: {
      aesthetic: "playful-colorful",
      mood: ["Ousado", "Amigável"],
      effectsStyle: ["Number Counter", "Marquee Infinite", "Confetti Burst", "Reveal on scroll"],
      colorStyle: "vibrant",
      colorPreset: "trend-coral",
      projectType: "landing",
    },
  },
  {
    id: "qp-real-estate",
    name: "Real Estate Listings",
    tagline: "Imobiliário com galeria + map + filtros",
    category: "misc",
    vibeColor: "from-blue-600/30 via-sky-600/20 to-cyan-600/30",
    patch: {
      aesthetic: "modern-clean",
      mood: ["Profissional", "Luxo"],
      effectsStyle: ["Image Reveal Clip", "Bento Grid Animated", "Reveal on scroll", "Parallax"],
      colorStyle: "saas-clean",
      colorPreset: "trend-deepsea",
      projectType: "realestate",
    },
  },
];

// ── Badges styles ───────────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, string> = {
  awwwards:   "border-purple-500/30 text-purple-400 bg-purple-500/5",
  conversion: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
  speed:      "border-blue-500/30 text-blue-400 bg-blue-500/5",
  enterprise: "border-amber-500/30 text-amber-400 bg-amber-500/5",
  flagship:   "border-pink-500/30 text-pink-400 bg-pink-500/5",
};

interface QuickPresetsProps {
  activeId?: string;
  onApply: (preset: QuickPreset) => void;
}

export function QuickPresets({ activeId, onApply }: QuickPresetsProps) {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<boolean>(false);

  // Filtra por categoria (ou mostra todos)
  const filtered = filter === "all" ? QUICK_PRESETS : QUICK_PRESETS.filter((p) => p.category === filter);

  // Quando colapsado mostra só os primeiros 8 (preview)
  const visible = expanded ? filtered : filtered.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold">Quick Presets · 25 starter kits</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[10px] text-primary hover:underline"
        >
          {expanded ? "Ver menos" : `Ver todos (${QUICK_PRESETS.length})`}
          <ChevronDown className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")} />
        </button>
      </div>

      {/* Filtros por categoria */}
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-md px-2 py-1 text-[10px] font-medium transition-all",
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <Layers className="mr-1 inline h-2.5 w-2.5" />
          Todos ({QUICK_PRESETS.length})
        </button>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = QUICK_PRESETS.filter((p) => p.category === cat.id).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all",
                filter === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-2.5 w-2.5" strokeWidth={1.75} />
              {cat.label}
              <span className="opacity-60">·{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid de presets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter + String(expanded)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              active={activeId === preset.id}
              onApply={onApply}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Hint quando filtro tem mais que 8 e está colapsado */}
      {!expanded && filtered.length > 8 && (
        <div className="text-center text-[10px] text-muted-foreground">
          A mostrar 8 de {filtered.length} · clica "Ver todos" para expandir
        </div>
      )}
    </motion.div>
  );
}

// ─── Card individual de preset ──────────────────────────────────────────────
function PresetCard({
  preset,
  active,
  onApply,
}: {
  preset: QuickPreset;
  active: boolean;
  onApply: (p: QuickPreset) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onApply(preset)}
      className={cn(
        "group relative overflow-hidden rounded-lg border p-2 text-left transition-all",
        active
          ? "border-primary bg-primary/10 ring-1 ring-primary"
          : "border-border bg-card/30 hover:border-primary/50 hover:bg-card/50"
      )}
      title={`${preset.name} — ${preset.tagline}`}
    >
      {/* Preview strip — gradient que dá vibe da paleta + efeitos */}
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", preset.vibeColor)} />

      {/* Badge */}
      {preset.badge && (
        <span
          className={cn(
            "absolute right-1.5 top-2 rounded border px-1 py-0.5 text-[7px] font-bold uppercase tracking-wider",
            BADGE_STYLES[preset.badge]
          )}
        >
          {preset.badge}
        </span>
      )}

      {/* Active check */}
      {active && (
        <div className="absolute right-1.5 top-6 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-2.5 w-2.5" />
        </div>
      )}

      {/* Nome + tagline */}
      <div className="mt-1 pr-12">
        <div className="text-[11px] font-bold leading-tight">{preset.name}</div>
        <div className="mt-0.5 text-[9px] leading-snug text-muted-foreground line-clamp-2">
          {preset.tagline}
        </div>
      </div>

      {/* Meta: efeitos + style */}
      <div className="mt-1.5 flex flex-wrap gap-0.5">
        {preset.patch.effectsStyle?.slice(0, 3).map((fx) => (
          <span
            key={fx}
            className="rounded bg-muted/60 px-1 py-0 text-[7px] font-medium text-muted-foreground"
          >
            {fx}
          </span>
        ))}
        {preset.patch.effectsStyle && preset.patch.effectsStyle.length > 3 && (
          <span className="rounded bg-muted/60 px-1 py-0 text-[7px] font-medium text-muted-foreground">
            +{preset.patch.effectsStyle.length - 3}
          </span>
        )}
      </div>

      {/* Mood hint */}
      {preset.patch.mood && preset.patch.mood.length > 0 && (
        <div className="mt-1 text-[7px] italic text-muted-foreground/70">
          {preset.patch.mood.join(" · ")}
        </div>
      )}
    </button>
  );
}
