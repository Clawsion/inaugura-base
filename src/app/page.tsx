"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { BriefingForm } from "@/components/forms/BriefingForm";
import { LoadingSteps } from "@/components/loading-steps";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { InauguraPackResults } from "@/components/results/InauguraPackResults";
import { ThemeToggle } from "@/components/theme-toggle";
import { SkinSwitcher } from "@/components/skins/SkinSwitcher";
import { Logo } from "@/components/logo";
import { ProjectManager } from "@/components/project-manager";
import type { FormValues } from "@/lib/schemas";
import { useInauguraGenerate, formValuesToGenerateInput } from "@/hooks/use-inaugura-generate";
import { useAutosave } from "@/hooks/use-autosave";
import type { InauguraPack, Recommendation } from "@/lib/schema/inaugura-pack";
import { PresetSelector } from "@/components/forms/PresetSelector";
import { ExecutionBlock } from "@/components/forms/ExecutionBlock";
import { ModelsAgentsBlock } from "@/components/forms/ModelsAgentsBlock";
import { SimpleForge, type SimpleForgeValues } from "@/components/forms/SimpleForge";
import { SimpleAdvancedToggle } from "@/components/forms/SimpleAdvancedToggle";
import { SkinsDropdown } from "@/components/skins/SkinsDropdown";
import { useForgeMode } from "@/hooks/use-forge-mode";
import type { Preset } from "@/lib/catalog";
import { getSkinById } from "@/lib/skins";
import { toast } from "sonner";
import { Github, AlertCircle, RotateCcw, Folder } from "lucide-react";
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
  referencias: [],
  conteudoTextos: false,
  conteudoTextosObs: "",
  conteudoVideos: false,
  conteudoVideosObs: "",
  funcionalidadesEspeciais: [],
};

// ============================================================================
// Helper: converter SimpleForgeValues → GenerateInput (modo simplificado)
// ============================================================================
function simpleToGenerateInput(sf: SimpleForgeValues): import("@/lib/schema/inaugura-pack").GenerateInput {
  const projectTypeMap: Record<string, import("@/lib/schema/inaugura-pack").GenerateInput["project_type"]> = {
    landing: "portfolio",
    saas: "saas",
    ecommerce: "ecommerce",
    portfolio: "portfolio",
    dashboard: "saas",
    blog: "corporate",
    marketplace: "ecommerce",
    other: "other",
  };

  // Mapear integrações simples para IDs do catálogo
  const integrationMap: Record<string, string> = {
    auth: "auth-clerk",
    payments: "stripe",
    database: "supabase",
    email: "resend",
    analytics: "posthog",
    cms: "cms-sanity",
    ai: "posthog", // placeholder
    i18n: "i18n",
  };

  return {
    locale: sf.idioma,
    brief: sf.briefing,
    project_type: projectTypeMap[sf.projectType] || "other",
    references: sf.references.filter((r) => r.trim()).map((url) => ({ url, role: "visual_anchor" as const })),
    features: sf.integrations.map((i) => integrationMap[i] ?? i),
    sections_lock: [],
    effects_lock: sf.animations ? ["reveal-scroll", "smooth-scroll"] : [],
    visual: {
      locks: { aesthetic: sf.aesthetic, mood: sf.mood.join(","), palette: sf.palette },
    },
    execution: {
      mode: "auto",
      cost_profile: sf.level === "enterprise" ? "max" : sf.level === "production" ? "balanced" : "free_open",
      host_preference: "opencode",
    },
    locks: {
      skills: [],
      mcps: [],
      integrations: sf.integrations.map((i) => integrationMap[i] ?? i),
    },
    level: sf.level === "enterprise" ? "awwwards" : sf.level === "production" ? "pro" : "lite",
    options: {
      polish_design: false,
      include_opencode_json: true,
      include_zip_markdown: true,
    },
  };
}

export default function Home() {
  const { mode: forgeMode, toggle: toggleForgeMode, setAdvanced } = useForgeMode();
  const [form, setForm, resetForm] = useAutosave<FormValues>("inaugura:forge", FORM_INIT);
  const [simpleForm, setSimpleForm] = useAutosave<SimpleForgeValues>("inaugura:simple-forge", {
    briefing: "",
    references: [],
    projectType: "landing",
    aesthetic: "modern-clean",
    mood: [],
    palette: "auto",
    colorPreset: "auto",
    colorAdjust: { brightness: 0, contrast: 0, saturation: 0 },
    customColors: [],
    typographyPref: "auto",
    fontHeading: "",
    fontBody: "",
    fontMono: "",
    customFonts: [],
    animations: true,
    motionCombo: "",
    stackPref: "auto",
    stackCombo: "",
    integrations: [],
    level: "production",
    idioma: "pt",
  });
  const [showForm, setShowForm] = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  // Estado de execução (novos campos não estão no FormValues antigo)
  const [execMode, setExecMode] = useState<"individual" | "team" | "auto">("auto");
  const [execTier, setExecTier] = useState<string>("ouro");
  const [execCost, setExecCost] = useState<"free_open" | "balanced" | "max">("free_open");
  const [execHost, setExecHost] = useState<"opencode" | "claude" | "codex" | "hybrid">("opencode");
  // NOVO: skin ativo aplicado a toda a app (null = tema default)
  const [activeSkin, setActiveSkin] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hook da nova arquitetura Inaugura Base
  const { state: genState, generate, reset: resetGenerate } = useInauguraGenerate();

  useEffect(() => setMounted(true), []);

  const onChange = useCallback((patch: Partial<FormValues>) => {
    setForm((f) => ({ ...f, ...patch }));
  }, [setForm]);

  // Aplicar preset: preenche locks do form + execução + excellence
  const applyPreset = useCallback((preset: Preset) => {
    setActivePreset(preset.id);

    // Sections: flatten P0/P1/P2 para seccoes (mantendo ordem P0 → P1 → P2)
    const seccoes = [
      ...preset.sections.filter(s => s.priority === "P0").map(s => s.id),
      ...preset.sections.filter(s => s.priority === "P1").map(s => s.id),
      ...preset.sections.filter(s => s.priority === "P2").map(s => s.id),
    ];

    // Effects: flatten para efeitos
    const efeitos = preset.effects.map(e => e.id);

    // Só preenche brief se vazio (não sobrescreve)
    const newBrief = form.briefing.length < 20 && preset.brief_seed ? preset.brief_seed : form.briefing;

    setForm((f) => ({
      ...f,
      briefing: newBrief,
      nicho: preset.category === "portfolio" ? "Portfólio Pessoal" :
             preset.category === "agency" ? "Agência Criativa" :
             preset.category === "saas" ? "SaaS B2B" :
             preset.category === "commerce" ? "E-commerce" :
             preset.category === "content" ? "Blog / Media" :
             preset.category === "local" ? "Negócio Local" : f.nicho,
      siteType: preset.project_type === "saas" ? "dashboard" :
                preset.project_type === "ecommerce" ? "ecommerce" : "single-page",
      seccoes,
      efeitos,
      selectedSkills: preset.skills,
      selectedIntegrations: [...(preset.features ?? []), ...(preset.integrations ?? [])],
      nivel: preset.level === "awwwards" ? "production" : preset.level === "lite" ? "mvp" : "production",
    }));

    // Aplica execução do preset
    setExecMode(preset.execution.mode);
    if (preset.execution.tier) setExecTier(preset.execution.tier);
    setExecCost(preset.cost_profile as "free_open" | "balanced" | "max");
    setExecHost(preset.execution.host_preference);

    toast.success(`Preset "${preset.name}" aplicado · ${preset.sections.length} sec · ${preset.execution.tier ?? "individual"} · Perf≥${preset.excellence.lighthouse_perf}`);
  }, [setForm, form.briefing]);

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
    setShowForm(false);
    let input;
    if (forgeMode === "simple") {
      // Converter SimpleForgeValues → GenerateInput
      input = simpleToGenerateInput(simpleForm);
    } else {
      input = formValuesToGenerateInput(form, {
        mode: execMode,
        tier: execTier,
        costProfile: execCost,
        hostPreference: execHost,
      });
    }
    const r = await generate(input);
    if (r.ok) {
      toast.success("InauguraPack gerado com sucesso!");
    } else {
      toast.error("Falha na geração. Vê os detalhes abaixo.");
    }
  }, [form, simpleForm, forgeMode, generate, execMode, execTier, execCost, execHost]);

  const onSimpleSubmit = useCallback(async () => {
    setShowForm(false);
    const input = simpleToGenerateInput(simpleForm);
    const r = await generate(input);
    if (r.ok) {
      toast.success("InauguraPack gerado com sucesso!");
    } else {
      toast.error("Falha na geração. Vê os detalhes abaixo.");
    }
  }, [simpleForm, generate]);

  const onSimpleChange = useCallback((patch: Partial<SimpleForgeValues>) => {
    setSimpleForm((f) => ({ ...f, ...patch }));
  }, [setSimpleForm]);

  const onReset = useCallback(() => {
    resetGenerate();
    resetForm();
    setActivePreset(null);
    setShowForm(true);
  }, [resetGenerate, resetForm]);

  // NOVO: regenerar alternativas
  const [regenerating, setRegenerating] = useState(false);
  const onRegenerate = useCallback(async () => {
    if (!genState.pack) return;
    setRegenerating(true);
    const input = formValuesToGenerateInput(form, {
      mode: execMode,
      tier: execTier,
      costProfile: execCost,
      hostPreference: execHost,
    });
    const r = await generate(input);
    if (r.ok) {
      toast.success("Novas alternativas geradas!");
    } else {
      toast.error("Falha ao regenerar.");
    }
    setRegenerating(false);
  }, [form, genState.pack, generate, execMode, execTier, execCost, execHost]);

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
              <Logo size={36} accentColor={activeSkin ? getSkinById(activeSkin)?.dark.accent : undefined} />
              <div>
                <h1 className="text-sm font-bold leading-none tracking-tight">
                  Inaugura<span className="text-primary">-Base</span>
                </h1>
                <p className="text-[10px] leading-tight text-muted-foreground">
                  Forge → Pack → Execute
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Skins dropdown — entre logo e toggle */}
              {showForm && mounted && (
                <SkinsDropdown activeSkin={activeSkin} onChange={setActiveSkin} />
              )}
              {/* Toggle Simplificada/Avançada */}
              {showForm && (
                <SimpleAdvancedToggle mode={forgeMode} onToggle={toggleForgeMode} />
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => window.location.href = "/projects"}
              >
                <Folder className="mr-1.5 h-3.5 w-3.5" />
                Projetos
              </Button>
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
              <ProjectManager
                form={form}
                onResetAll={() => setForm(FORM_INIT)}
                onResetSection={(section) => {
                  const patches: Record<string, Partial<FormValues>> = {
                    briefing: { briefing: "", nicho: "" },
                    design: { selectedDesignVisual: [], efeitos: [] },
                    skills: { selectedSkills: [], selectedIntegrations: [] },
                    fonts: { fontsPlayground: FORM_INIT.fontsPlayground },
                    palette: { paletaMode: "auto" as const, paletaManual: FORM_INIT.paletaManual },
                    typography: { typographyMode: "auto" as const },
                    extras: { incluirMockups: true, incluirDesignTokens: true, incluirRoadmap: false, nivel: "production" as const, idioma: "pt" as const },
                  };
                  const patch = patches[section] ?? {};
                  setForm((f) => ({ ...f, ...patch }));
                }}
                onLoadProject={(loadedForm) => {
                  setForm(loadedForm);
                  setShowForm(true);
                  resetGenerate();
                }}
              />
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
                key={`form-${forgeMode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {forgeMode === "simple" ? (
                  // ── MODO SIMPLIFICADA ──
                  <SimpleForge
                    value={simpleForm}
                    onChange={onSimpleChange}
                    onSubmit={onSimpleSubmit}
                    isLoading={genState.loading}
                    onSwitchToAdvanced={() => setAdvanced()}
                  />
                ) : (
                  // ── MODO AVANÇADA ──
                  <>
                    {/* Presets no topo — 1 clique aplica locks */}
                    <PresetSelector activePreset={activePreset} onApply={applyPreset} />

                    {/* Form principal */}
                    <BriefingForm
                      value={form}
                      onChange={onChange}
                      onSubmit={onSubmit}
                      isLoading={genState.loading}
                    />

                    {/* Bloco Execução — Individual/Team + tiers + cost + host */}
                    <ExecutionBlock
                      mode={execMode}
                      tier={execTier}
                      costProfile={execCost}
                      hostPreference={execHost}
                      onChange={(patch) => {
                        if (patch.mode) setExecMode(patch.mode);
                        if (patch.tier) setExecTier(patch.tier);
                        if (patch.costProfile) setExecCost(patch.costProfile);
                        if (patch.hostPreference) setExecHost(patch.hostPreference);
                      }}
                    />

                    {/* Bloco Modelos & Agentes — keys + routing por função + alternativas */}
                    <ModelsAgentsBlock
                      mode={execMode}
                      tier={execTier}
                      costProfile={execCost}
                      hostPreference={execHost}
                      onChange={(patch) => {
                        if (patch.mode) setExecMode(patch.mode);
                        if (patch.tier) setExecTier(patch.tier);
                        if (patch.costProfile) setExecCost(patch.costProfile);
                        if (patch.hostPreference) setExecHost(patch.hostPreference);
                      }}
                    />

                    {/* Botão Gerar Pack (sticky) */}
                    <div className="sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/90 p-3 backdrop-blur-xl">
                      <div className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {execMode === "individual" ? "Individual · 5 prompts" :
                           execMode === "team" ? `Team · ${execTier} · ${form.seccoes?.length ?? 0} secções` :
                           "Auto · router decide"}
                        </span>
                        <span className="mx-2">·</span>
                        <span>{form.selectedSkills?.length ?? 0} skills</span>
                        <span className="mx-1">·</span>
                        <span>{form.selectedIntegrations?.length ?? 0} integrações</span>
                      </div>
                      <Button
                        type="button"
                        onClick={onSubmit}
                        disabled={genState.loading || form.briefing.length < 20}
                        className="min-w-[140px]"
                      >
                        {genState.loading ? "A gerar..." : "Gerar Pack →"}
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ) : genState.loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[60vh] items-center justify-center"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {genState.step || "A processar..."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {genState.message || "A gerar InauguraPack..."}
                    </p>
                  </div>
                </div>
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

                {genState.pack ? (
                  <InauguraPackResults
                    pack={genState.pack}
                    rec={genState.rec}
                    onRegenerate={onRegenerate}
                    regenerating={regenerating}
                    packId={genState.packId}
                    projectId={genState.projectId}
                    provider={genState.provider}
                    model={genState.model}
                    latencyMs={genState.latencyMs}
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
                          {genState.error}
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
