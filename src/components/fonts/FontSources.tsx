"use client";

// ============================================================================
// FontSources — separador discreto no FontPlayground (NÃO secção grande)
// ============================================================================
// Mostra os 12 sites modernos numa linha horizontal (chips clicáveis).
// Cada chip: nome + badge (Popular/Awwwards/Premium) + contador de fonts.
// Clicar abre o site numa nova tab.
// ============================================================================

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { FONT_SOURCE_SITES, getCloneStats } from "@/lib/font-sources-catalog";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FontSources() {
  const [showAll, setShowAll] = useState(false);
  const stats = getCloneStats();
  const sites = showAll ? FONT_SOURCE_SITES : FONT_SOURCE_SITES.slice(0, 6);

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      {/* Header compacto */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sources modernos
          </span>
          <span className="rounded bg-primary/10 px-1 text-[9px] text-primary">
            {FONT_SOURCE_SITES.length} sites · {stats.total}+ clones
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-[10px] text-muted-foreground hover:text-foreground"
        >
          {showAll ? "Ver menos" : "Ver todos"}
        </button>
      </div>

      {/* Chips horizontais */}
      <div className="flex flex-wrap gap-1.5">
        {sites.map((site) => (
          <a
            key={site.id}
            href={site.url}
            target="_blank"
            rel="noreferrer"
            title={`${site.name} — ${site.description}`}
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-2.5 py-1 text-[10px] font-medium transition-all hover:border-primary/40 hover:bg-primary/5"
          >
            <span>{site.name}</span>
            {site.badge && (
              <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/10 px-1 text-[8px] font-bold uppercase text-amber-500">
                <Star className="h-2 w-2" />
                {site.badge}
              </span>
            )}
            <ExternalLink className="h-2 w-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </div>
  );
}
