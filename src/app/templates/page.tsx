// ============================================================================
// /templates/page.tsx — Galeria pública de presets curados
// ============================================================================
// Mostra todos os presets do catálogo com filtros por categoria.
// Cada preset tem um botão "Usar este" que leva ao Forge com o preset pré-carregado.
// ============================================================================

import { CATALOG, type Preset } from "@/lib/catalog";
import Link from "next/link";
import { Sparkles, ArrowRight, Tag } from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 3600; // 1h

export const metadata = {
  title: "Templates — Inaugura-Base",
  description: "50+ presets curados para spec-driven projects. Portfolio, SaaS, e-commerce, agency, editorial e mais.",
};

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "portfolio", label: "Portfolio" },
  { id: "agency", label: "Agência" },
  { id: "saas", label: "SaaS" },
  { id: "commerce", label: "E-commerce" },
  { id: "content", label: "Conteúdo" },
  { id: "local", label: "Local" },
  { id: "product", label: "Produto" },
  { id: "experimental", label: "Experimental" },
];

const BADGE_STYLES: Record<string, string> = {
  awwwards: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  conversion: "bg-green-500/10 text-green-600 border-green-500/30",
  speed: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  enterprise: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  flagship: "bg-pink-500/10 text-pink-600 border-pink-500/30",
};

export default function TemplatesPage() {
  const presets = CATALOG.presets;

  // Agrupa por categoria
  const byCategory = CATEGORIES.reduce((acc, cat) => {
    if (cat.id === "all") acc[cat.id] = presets;
    else acc[cat.id] = presets.filter((p) => p.category === cat.id);
    return acc;
  }, {} as Record<string, Preset[]>);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/30 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Template Gallery</span>
          </div>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar ao Forge
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-12 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {presets.length} templates curados
          </h1>
          <p className="text-muted-foreground text-lg">
            Cada preset é uma configuração completa de spec — project type, level, cost profile,
            skills, MCPs, sections, effects e excellence targets. Copia um e começa a gerar.
          </p>
        </section>

        {/* Por categoria */}
        {CATEGORIES.filter(c => c.id !== "all").map((cat) => {
          const items = byCategory[cat.id] ?? [];
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  {cat.label}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({items.length})
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((preset) => (
                  <PresetCard key={preset.id} preset={preset} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

function PresetCard({ preset }: { preset: Preset }) {
  return (
    <Link
      href={`/?preset=${preset.id}`}
      className="group rounded-xl border border-border bg-card/30 p-5 hover:border-primary/40 hover:bg-card/50 transition-all space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
          {preset.name}
        </h3>
        {preset.badge && (
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
            BADGE_STYLES[preset.badge] ?? "bg-muted text-muted-foreground border-border"
          }`}>
            {preset.badge}
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">
        {preset.tagline}
      </p>

      <div className="flex flex-wrap gap-1">
        <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {preset.project_type}
        </span>
        <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {preset.level}
        </span>
        <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {preset.execution.mode}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
        <span>{preset.features.length} features</span>
        <span className="inline-flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Usar <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
