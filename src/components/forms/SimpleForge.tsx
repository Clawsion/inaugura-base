"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  Lightbulb,
  Plus,
  Trash2,
  ChevronDown,
  Zap,
  Wand2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ============================================================================
// SimpleForge — versão simplificada do Forge
// ============================================================================
// Filosofia: "Eu confio na IA. Só quero o melhor resultado com mínimo de decisões."
// ============================================================================

export interface SimpleForgeValues {
  briefing: string;
  references: string[];
  projectType: string;
  aesthetic: string;
  mood: string[];
  palette: "auto" | "light" | "dark" | "brand";
  animations: boolean;
  stackPref: "auto" | "modern" | "fullstack" | "python" | "custom";
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

// Presets de tipo de projeto (chips grandes)
const PROJECT_TYPES = [
  { id: "landing", label: "Landing Page", icon: "🚀" },
  { id: "saas", label: "SaaS / Web App", icon: "💻" },
  { id: "ecommerce", label: "E-commerce", icon: "🛒" },
  { id: "portfolio", label: "Portfolio / Agência", icon: "📁" },
  { id: "dashboard", label: "Dashboard / Admin", icon: "📊" },
  { id: "blog", label: "Blog / Conteúdo", icon: "📰" },
  { id: "marketplace", label: "Marketplace", icon: "🏪" },
  { id: "other", label: "Outro", icon: "✨" },
];

// Presets de estética (grid visual)
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

const STACKS = [
  { id: "auto", label: "Auto (recomendado)", desc: "IA escolhe a melhor" },
  { id: "modern", label: "Modern Frontend", desc: "Next.js + React + Tailwind + shadcn" },
  { id: "fullstack", label: "Full-stack JS", desc: "Next.js + API + DB" },
  { id: "python", label: "Python / FastAPI", desc: "Backend Python" },
  { id: "custom", label: "Custom", desc: "Especificar no briefing" },
];

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

  const toggleArray = useCallback((key: "references" | "mood" | "integrations", item: string) => {
    const arr = value[key];
    if (arr.includes(item)) {
      onChange({ [key]: arr.filter((i) => i !== item) } as Partial<SimpleForgeValues>);
    } else {
      onChange({ [key]: [...arr, item] } as Partial<SimpleForgeValues>);
    }
  }, [value, onChange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Briefing — grande e proeminente */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="simple-briefing" className="text-sm font-semibold">
            Briefing do projeto <span className="text-primary">*</span>
          </Label>
          <button
            type="button"
            onClick={() => toast.info("A IA vai detetar nicho, tom, público e stack automaticamente.")}
            className="flex items-center gap-1 text-[10px] text-primary hover:underline"
          >
            <Lightbulb className="h-3 w-3" />
            Auto-detetar a partir do briefing
          </button>
        </div>
        <Textarea
          id="simple-briefing"
          value={value.briefing}
          onChange={(e) => onChange({ briefing: e.target.value })}
          placeholder="Ex: Estou a criar uma plataforma SaaS B2B para gestão de equipas remotas. O público-alvo são CTOs e Head of Ops de startups em fase Series A-B. Tom deve ser confiante, técnico mas acessível..."
          className="min-h-[140px] resize-y border-border bg-card/50 text-sm leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          {value.briefing.length} caracteres · mínimo 20
        </p>
      </motion.div>

      {/* Referências — compacto */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Referências (opcional, máx 3)</Label>
        <div className="space-y-1.5">
          {value.references.map((ref, i) => (
            <div key={i} className="flex gap-1.5">
              <input
                type="url"
                value={ref}
                onChange={(e) => {
                  const refs = [...value.references];
                  refs[i] = e.target.value;
                  onChange({ references: refs });
                }}
                placeholder="https://exemplo.com"
                className="flex-1 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => onChange({ references: value.references.filter((_, idx) => idx !== i) })}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {value.references.length < 3 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange({ references: [...value.references, ""] })}
              className="h-7 gap-1 border-dashed text-[11px]"
            >
              <Plus className="h-3 w-3" /> Adicionar referência
            </Button>
          )}
        </div>
      </div>

      {/* Tipo de Projeto */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Tipo de Projeto</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PROJECT_TYPES.map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => onChange({ projectType: pt.id })}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border p-3 transition-all",
                value.projectType === pt.id
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border bg-card/30 hover:border-primary/40"
              )}
            >
              <span className="text-xl">{pt.icon}</span>
              <span className="text-[11px] font-medium leading-tight text-center">{pt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Estilo Visual */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Estilo Visual</Label>

        {/* Estética — grid de presets visuais */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {AESTHETICS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onChange({ aesthetic: a.id })}
              className={cn(
                "relative overflow-hidden rounded-xl border p-3 transition-all",
                value.aesthetic === a.id
                  ? "border-primary ring-1 ring-primary"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", a.color)} />
              <div className="relative text-[10px] font-semibold leading-tight">{a.label}</div>
            </button>
          ))}
        </div>

        {/* Mood — chips */}
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleArray("mood", m)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                value.mood.includes(m)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/30 text-muted-foreground hover:border-primary/40"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Paleta + Animações */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Paleta:</span>
            {(["auto", "light", "dark", "brand"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChange({ palette: p })}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-medium capitalize transition-all",
                  value.palette === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {p === "auto" ? "Auto" : p}
              </button>
            ))}
          </div>

          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={value.animations}
              onChange={(e) => onChange({ animations: e.target.checked })}
              className="h-3.5 w-3.5 rounded"
            />
            <span className="text-[11px] font-medium">Animações premium</span>
          </label>
        </div>
      </div>

      {/* Stack & Integrações */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Stack & Integrações</Label>

        {/* Preferência de stack */}
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {STACKS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange({ stackPref: s.id as SimpleForgeValues["stackPref"] })}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-2 text-left transition-all",
                value.stackPref === s.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/30 hover:border-primary/40"
              )}
            >
              <div className="flex-1">
                <div className="text-[11px] font-semibold">{s.label}</div>
                <div className="text-[10px] text-muted-foreground">{s.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Integrações essenciais — chips toggle */}
        <div className="flex flex-wrap gap-1.5">
          {INTEGRATIONS.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => toggleArray("integrations", i.id)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                value.integrations.includes(i.id)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card/30 text-muted-foreground hover:border-primary/40"
              )}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mais opções (colapsável) */}
      <div className="rounded-xl border border-border bg-card/20">
        <button
          type="button"
          onClick={() => setShowExtras(!showExtras)}
          className="flex w-full items-center justify-between p-3"
        >
          <span className="text-xs font-semibold text-muted-foreground">Mais opções (idioma, nível, detalhe)</span>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showExtras && "rotate-180")} />
        </button>
        <AnimatePresence>
          {showExtras && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border p-3 space-y-3"
            >
              {/* Idioma */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">Idioma da spec:</span>
                {(["pt", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onChange({ idioma: l })}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                      value.idioma === l ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Nível */}
              <div>
                <span className="text-[11px] text-muted-foreground">Nível:</span>
                <div className="mt-1 grid grid-cols-3 gap-1.5">
                  {LEVELS.map((lv) => (
                    <button
                      key={lv.id}
                      type="button"
                      onClick={() => onChange({ level: lv.id as SimpleForgeValues["level"] })}
                      className={cn(
                        "rounded-lg border p-2 text-center transition-all",
                        value.level === lv.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card/30 hover:border-primary/40"
                      )}
                    >
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

      {/* Botão Gerar Pack — grande e proeminente */}
      <div className="space-y-2">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || value.briefing.length < 20}
          className="group relative w-full overflow-hidden bg-primary py-6 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Wand2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
            {isLoading ? "A gerar pack…" : "Gerar Pack"}
            {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </span>
        </Button>
        {value.briefing.length < 20 && (
          <p className="text-center text-xs text-muted-foreground">
            Escreve pelo menos 20 caracteres no briefing para continuar.
          </p>
        )}

        {/* Switch to Advanced */}
        <button
          type="button"
          onClick={onSwitchToAdvanced}
          className="flex w-full items-center justify-center gap-1.5 py-2 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <Zap className="h-3 w-3" />
          Precisas de controlo total? Mudar para versão Avançada
        </button>
      </div>
    </motion.div>
  );
}
