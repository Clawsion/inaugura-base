"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { BriefingForm } from "@/components/forms/BriefingForm";
import { LoadingSteps } from "@/components/loading-steps";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { ThemeToggle } from "@/components/theme-toggle";
import { SkinSwitcher } from "@/components/skins/SkinSwitcher";
import { Logo } from "@/components/logo";
import { generateProject, type GenerateResult } from "@/app/actions/generate";
import type { FormValues } from "@/lib/schemas";
import { getSkinById } from "@/lib/skins";
import { toast } from "sonner";
import { Github, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const FORM_INIT: FormValues = {
  briefing: "",
  nicho: "",
  siteType: "single-page",
  seccoes: ["Hero", "Features", "CTA", "Footer"],
  efeitos: ["Reveal on scroll", "Smooth scroll"],
  paletaMode: "auto",
  paletaManual: [
    { nome: "Background", hex: "#0A0A0B", uso: "Fundo principal" },
    { nome: "Card", hex: "#141416", uso: "Superfícies elevadas" },
    { nome: "Accent", hex: "#00E5A0", uso: "CTAs, links, detalhes" },
    { nome: "Text", hex: "#F4F4F5", uso: "Texto principal" },
  ],
  typographyMode: "auto",
  typographyManual: { heading: "Geist", body: "Inter", mono: "Geist Mono" },
  promptMode: "compact",
  // NOVOS CAMPOS:
  skinsSelecionados: [],
  fontsPlayground: [
    { fonte: "Inter", pesos: [400, 700] },
    { fonte: "Geist", pesos: [400, 600] },
    { fonte: "Plus Jakarta Sans", pesos: [400, 700] },
  ],
  incluirMockups: true,
  incluirDesignTokens: true,
  incluirRoadmap: false,
  nivel: "production",
  idioma: "pt",
  selectedSkills: [],
  selectedIntegrations: [],
  selectedDesignVisual: [],
};

export default function Home() {
  const [form, setForm] = useState<FormValues>(FORM_INIT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [showForm, setShowForm] = useState(true);
  // NOVO: skin ativo aplicado a toda a app (null = tema default)
  const [activeSkin, setActiveSkin] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const onChange = useCallback((patch: Partial<FormValues>) => {
    setForm((f) => ({ ...f, ...patch }));
  }, []);

  // Helper: gera o style object com CSS variables do skin ativo
  // USA o tema atual (dark OU light) — respeita o toggle ThemeToggle
  const skinStyle = useMemo(() => {
    if (!activeSkin || !mounted) return undefined;
    const skin = getSkinById(activeSkin);
    if (!skin) return undefined;
    const isLight = theme === "light";
    const t = isLight ? skin.light : skin.dark;
    return {
      "--background": t.bg,
      "--foreground": t.text,
      "--card": t.card,
      "--card-foreground": t.text,
      "--popover": t.card,
      "--popover-foreground": t.text,
      "--primary": t.accent,
      "--primary-foreground": t.accentForeground,
      "--secondary": t.card,
      "--secondary-foreground": t.text,
      "--muted": t.card,
      "--muted-foreground": t.muted,
      "--accent": t.accent,
      "--accent-foreground": t.accentForeground,
      "--border": t.border,
      "--input": t.border,
      "--ring": t.accent,
      "--radius": t.radius,
      fontFamily: t.bodyFont,
      backgroundImage: t.bgPattern,
      backgroundAttachment: "fixed",
    } as React.CSSProperties;
  }, [activeSkin, theme, mounted]);

  // Aplica os tokens do skin diretamente no <html> para que TODA a app
  // (incluindo <body>) use os tokens. Isto garante que não há "vazamento"
  // do tema default por baixo do <main>.
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (!activeSkin) {
      // Sem skin: remove os tokens custom, volta ao default
      [
        "--background", "--foreground", "--card", "--card-foreground",
        "--primary", "--primary-foreground", "--secondary", "--secondary-foreground",
        "--muted", "--muted-foreground", "--accent", "--accent-foreground",
        "--border", "--input", "--ring", "--radius",
      ].forEach((p) => html.style.removeProperty(p));
      html.style.backgroundImage = "";
      html.style.backgroundAttachment = "";
      html.style.fontFamily = "";
      // Restaura a classe dark/light do ThemeProvider
      if (theme === "light") {
        html.classList.remove("dark");
        html.classList.add("light");
      } else {
        html.classList.remove("light");
        html.classList.add("dark");
      }
      return;
    }
    const skin = getSkinById(activeSkin);
    if (!skin) return;
    const isLight = theme === "light";
    const t = isLight ? skin.light : skin.dark;
    html.style.setProperty("--background", t.bg);
    html.style.setProperty("--foreground", t.text);
    html.style.setProperty("--card", t.card);
    html.style.setProperty("--card-foreground", t.text);
    html.style.setProperty("--primary", t.accent);
    html.style.setProperty("--primary-foreground", t.accentForeground);
    html.style.setProperty("--secondary", t.card);
    html.style.setProperty("--secondary-foreground", t.text);
    html.style.setProperty("--muted", t.card);
    html.style.setProperty("--muted-foreground", t.muted);
    html.style.setProperty("--accent", t.accent);
    html.style.setProperty("--accent-foreground", t.accentForeground);
    html.style.setProperty("--border", t.border);
    html.style.setProperty("--input", t.border);
    html.style.setProperty("--ring", t.accent);
    html.style.setProperty("--radius", t.radius);
    html.style.fontFamily = t.bodyFont;
    if (t.bgPattern) {
      html.style.backgroundImage = t.bgPattern;
      html.style.backgroundAttachment = "fixed";
    } else {
      html.style.backgroundImage = "";
    }
    // CRÍTICO: Remove as classes dark/light do ThemeProvider para que os
    // `dark:` variants do Tailwind (ex: dark:bg-input/30) NÃO se apliquem.
    // Os tokens do skin já definem tudo via CSS variables inline.
    html.classList.remove("dark", "light");
  }, [activeSkin, theme, mounted]);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setShowForm(false);
    try {
      const r = await generateProject(form);
      setResult(r);
      if (!r.ok) {
        toast.error("Falha na geração. Vê os detalhes abaixo.");
      } else {
        toast.success(`Especificação gerada em ${r.tentativas ?? 1} tentativa(s).`);
      }
    } catch (e: any) {
      setResult({
        ok: false,
        error: `Erro inesperado: ${e?.message ?? String(e)}`,
      });
      toast.error("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  const onReset = useCallback(() => {
    setResult(null);
    setShowForm(true);
  }, []);

  // NOVO: regenerar alternativas (mantém o briefing, gera nova variação)
  const [regenerating, setRegenerating] = useState(false);
  const onRegenerate = useCallback(async () => {
    if (!result?.ok) return;
    setRegenerating(true);
    try {
      const r = await generateProject(form);
      if (r.ok) {
        setResult(r);
        toast.success("Novas alternativas geradas!");
      } else {
        toast.error("Falha ao regenerar. Mantém o resultado anterior.");
      }
    } catch (e: any) {
      toast.error("Erro inesperado ao regenerar.");
    } finally {
      setRegenerating(false);
    }
  }, [form, result]);

  return (
    <main className="min-h-screen bg-background text-foreground" style={skinStyle}>
      {/* Background gradient overlay */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative">
        {/* Header — minimalista, sem skins inline */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <Logo size={36} />
              <div>
                <h1 className="text-sm font-bold leading-none tracking-tight">
                  Inaugura<span className="text-primary">-Base</span>
                </h1>
                <p className="text-[10px] leading-tight text-muted-foreground">
                  Briefing → spec production-ready
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground"
                asChild
              >
                <a href="https://z.ai" target="_blank" rel="noreferrer" aria-label="Z.ai">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Secção de Skins — abaixo do header, todas visíveis (wrap) */}
        <div className="border-b border-border bg-card/30">
          <div className="mx-auto max-w-5xl px-4 py-2.5 sm:px-6">
            <SkinSwitcher activeSkin={activeSkin} onChange={setActiveSkin} />
          </div>
        </div>

        {/* Hero — apenas quando o form está visível */}
        <AnimatePresence>
          {showForm && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-5xl px-4 pt-12 pb-6 text-center sm:px-6 sm:pt-20"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Function Calling · Structured Output
              </motion.div>
              <h2 className="mx-auto max-w-2xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Forja projetos <span className="text-gradient">production-ready</span> a partir de um briefing
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
                Análise de nicho, paleta WCAG-AA, tipografia, design tokens,
                layout/animações, skills/MCP detetados automaticamente e
                prompts finais prontos a copiar — tudo em segundos.
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Conteúdo principal */}
        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <BriefingForm
                  value={form}
                  onChange={onChange}
                  onSubmit={onSubmit}
                  isLoading={loading}
                />
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[60vh] items-center justify-center"
              >
                <LoadingSteps />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Botão de reset */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    className="border-border bg-card/50"
                  >
                    <RotateCcw className="mr-1.5 h-3 w-3" />
                    Novo projeto
                  </Button>
                </div>

                {result?.ok && result.data ? (
                  <ResultsPanel
                    spec={result.data}
                    tentativas={result.tentativas}
                    onRegenerate={onRegenerate}
                    regenerating={regenerating}
                  />
                ) : (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-destructive">
                          Falha na geração
                        </h3>
                        <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                          {result?.error}
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onSubmit}
                          className="mt-3"
                        >
                          Tentar novamente
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-border py-6">
          <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground sm:px-6">
            Inaugura-Base · Next.js 16 · Tailwind 4 · Motion · chroma.js · Zod
          </div>
        </footer>
      </div>
    </main>
  );
}
