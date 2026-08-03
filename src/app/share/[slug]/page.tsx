// ============================================================================
// /share/[slug]/page.tsx — Página pública de um pack partilhado
// ============================================================================
// Qualquer pessoa com o link pode ver o pack (read-only).
// Não requer auth.
// ============================================================================

import { notFound } from "next/navigation";
import { db as prisma } from "@/lib/db";
import { Share2, Copy, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { InauguraPack } from "@/lib/schema/inaugura-pack";

export const dynamic = "force-dynamic";

interface SharePageProps {
  params: Promise<{ slug: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { slug } = await params;

  const pack = await prisma.pack.findUnique({
    where: { shareSlug: slug },
    include: { project: true },
  });

  // Se não existe OU não é público → 404
  if (!pack || !pack.isPublic) {
    notFound();
  }

  const packData = JSON.parse(pack.packJson) as InauguraPack;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur">
        <div className="container mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Pack partilhado</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/50 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              Copiar link
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Criar o meu
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6 py-8 space-y-8">
        {/* Meta */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {packData.meta.title}
          </h1>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">
              {packData.meta.level}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
              {packData.meta.mode}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
              {packData.meta.cost_profile}
            </span>
            {packData.overview.days_estimate && (
              <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                {packData.overview.days_estimate} dias
              </span>
            )}
          </div>
        </div>

        {/* Overview */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Overview
          </h2>
          <p className="text-sm leading-relaxed">{packData.overview.summary}</p>
          {packData.overview.stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {packData.overview.stack.map((tech) => (
                <code key={tech} className="rounded bg-muted px-2 py-0.5 text-[10px]">
                  {tech}
                </code>
              ))}
            </div>
          )}
        </section>

        {/* Design tokens */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Design
          </h2>
          <pre className="overflow-auto rounded-lg border border-border bg-card/30 p-4 text-xs">
            {packData.design_md.slice(0, 2000)}
            {packData.design_md.length > 2000 ? "\n\n[... truncado]" : ""}
          </pre>
        </section>

        {/* Routing */}
        {packData.routing?.build_routing && packData.routing.build_routing.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Build Routing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {packData.routing.build_routing.map((r) => (
                <div key={r.function_id} className="rounded-lg border border-border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-semibold">{r.function_id}</code>
                    <code className="text-[10px] text-primary">{r.model_id}</code>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Host: {r.host}
                  </div>
                  {r.skills.length > 0 && (
                    <div className="text-[10px] text-muted-foreground">
                      Skills: {r.skills.slice(0, 3).join(", ")}
                      {r.skills.length > 3 ? ` +${r.skills.length - 3}` : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Selection */}
        {packData.selection && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Selection
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {packData.selection.skills.length > 0 && (
                <div>
                  <div className="font-medium mb-1">Skills ({packData.selection.skills.length})</div>
                  <div className="space-y-0.5 text-muted-foreground">
                    {packData.selection.skills.slice(0, 5).map((s) => (
                      <div key={s.id}>{s.name ?? s.id}</div>
                    ))}
                  </div>
                </div>
              )}
              {packData.selection.mcps.length > 0 && (
                <div>
                  <div className="font-medium mb-1">MCPs ({packData.selection.mcps.length})</div>
                  <div className="space-y-0.5 text-muted-foreground">
                    {packData.selection.mcps.slice(0, 5).map((m) => (
                      <div key={m.id}>{m.name ?? m.id}</div>
                    ))}
                  </div>
                </div>
              )}
              {packData.selection.integrations.length > 0 && (
                <div>
                  <div className="font-medium mb-1">Integrations ({packData.selection.integrations.length})</div>
                  <div className="space-y-0.5 text-muted-foreground">
                    {packData.selection.integrations.map((i) => (
                      <div key={i.id ?? (typeof i === "string" ? i : "")}>{typeof i === "string" ? i : i.id}</div>
                    ))}
                  </div>
                </div>
              )}
              {packData.selection.effects.length > 0 && (
                <div>
                  <div className="font-medium mb-1">Effects ({packData.selection.effects.length})</div>
                  <div className="space-y-0.5 text-muted-foreground">
                    {packData.selection.effects.slice(0, 5).map((e) => (
                      <div key={typeof e === "string" ? e : e.id}>{typeof e === "string" ? e : e.id}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>
            Gerado com Inaugura-Base em{" "}
            {new Date(pack.createdAt).toLocaleDateString("pt-PT", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-1">
            <Link href="/" className="text-primary hover:underline">
              Cria o teu próprio spec →
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}

// Metadata para SEO
export async function generateMetadata({ params }: SharePageProps) {
  const { slug } = await params;
  const pack = await prisma.pack.findUnique({
    where: { shareSlug: slug },
    select: { packJson: true, isPublic: true },
  });

  if (!pack || !pack.isPublic) {
    return { title: "Pack não encontrado" };
  }

  const packData = JSON.parse(pack.packJson);
  return {
    title: `${packData.meta?.title ?? "Pack"} — Inaugura-Base`,
    description: packData.overview?.summary?.slice(0, 160) ?? "",
  };
}
