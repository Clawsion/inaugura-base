"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BriefingForm } from "@/components/forms/BriefingForm";
import { LoadingSteps } from "@/components/loading-steps";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { ThemeToggle } from "@/components/theme-toggle";
import { generateProject, type GenerateResult } from "@/app/actions/generate";
import type { FormValues } from "@/lib/schemas";
import { toast } from "sonner";
import { Hammer, Github, AlertCircle, RotateCcw } from "lucide-react";
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
    { fonte: "Inter" },
    { fonte: "Geist" },
    { fonte: "Plus Jakarta Sans" },
    { fonte: "Outfit" },
    { fonte: "Montserrat" },
  ],
  incluirMockups: true,
  incluirDesignTokens: true,
  incluirRoadmap: false,
  nivel: "production",
  idioma: "pt",
};

export default function Home() {
  const [form, setForm] = useState<FormValues>(FORM_INIT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [showForm, setShowForm] = useState(true);

  const onChange = useCallback((patch: Partial<FormValues>) => {
    setForm((f) => ({ ...f, ...patch }));
  }, []);

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

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Background gradient overlay */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Hammer className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold leading-none tracking-tight">
                  ProjectForge <span className="text-primary">AI</span>
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
                <a
                  href="https://z.ai"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Z.ai"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

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
                Powered by GLM-4.6 · Function Calling
              </motion.div>
              <h2 className="mx-auto max-w-2xl text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
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
                  <ResultsPanel spec={result.data} tentativas={result.tentativas} />
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
            ProjectForge AI · Next.js 16 · GLM-4.6 · Tailwind 4 · Framer Motion
            · chroma.js · Zod
          </div>
        </footer>
      </div>
    </main>
  );
}
