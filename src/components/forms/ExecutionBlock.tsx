"use client";

import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CATALOG, getTier } from "@/lib/catalog";
import { Users, Zap, Cpu, Server } from "lucide-react";

interface ExecutionBlockProps {
  mode: "individual" | "team" | "auto";
  tier: string;
  costProfile: "free_open" | "balanced" | "max";
  hostPreference: "opencode" | "claude" | "codex" | "hybrid";
  onChange: (patch: {
    mode?: "individual" | "team" | "auto";
    tier?: string;
    costProfile?: "free_open" | "balanced" | "max";
    hostPreference?: "opencode" | "claude" | "codex" | "hybrid";
  }) => void;
}

export function ExecutionBlock({ mode, tier, costProfile, hostPreference, onChange }: ExecutionBlockProps) {
  const selectedTier = getTier(tier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-2xl border border-border bg-card/30 p-5"
    >
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Execução do projeto</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {mode === "individual" ? "5 prompts sequenciais" : mode === "team" ? `${selectedTier?.team_size ?? 0} agentes` : "auto-detect"}
        </span>
      </div>

      {/* Modo */}
      <div>
        <Label className="mb-2 block text-xs font-medium text-muted-foreground">Modo</Label>
        <RadioGroup
          value={mode}
          onValueChange={(v) => onChange({ mode: v as "individual" | "team" | "auto" })}
          className="grid grid-cols-3 gap-2"
        >
          <ModeCard value="individual" label="Individual" desc="5 prompts" icon={<Zap className="h-3.5 w-3.5" />} />
          <ModeCard value="team" label="Agents Team" desc="3–8 funções" icon={<Users className="h-3.5 w-3.5" />} />
          <ModeCard value="auto" label="Auto" desc="Router decide" icon={<Cpu className="h-3.5 w-3.5" />} />
        </RadioGroup>
      </div>

      {/* Tier (só se team ou auto) */}
      {(mode === "team" || mode === "auto") && (
        <div>
          <Label className="mb-2 block text-xs font-medium text-muted-foreground">
            Tier Team {selectedTier && <span className="text-primary">· {selectedTier.estimated_days}</span>}
          </Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {CATALOG.tiers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChange({ tier: t.id })}
                className={`relative rounded-lg border p-2 text-center transition-all ${
                  tier === t.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-card/30 hover:border-primary/50"
                }`}
                title={t.use_when}
              >
                <div className="text-lg">{t.icon}</div>
                <div className="mt-0.5 text-[10px] font-semibold leading-tight">{t.name}</div>
                <div className="text-[9px] text-muted-foreground">{t.team_size} fn</div>
              </button>
            ))}
          </div>
          {selectedTier && (
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedTier.description} — {selectedTier.use_when}
            </p>
          )}
        </div>
      )}

      {/* Cost profile */}
      <div>
        <Label className="mb-2 block text-xs font-medium text-muted-foreground">Cost profile (modelos)</Label>
        <RadioGroup
          value={costProfile}
          onValueChange={(v) => onChange({ costProfile: v as "free_open" | "balanced" | "max" })}
          className="grid grid-cols-3 gap-2"
        >
          <ProfileCard value="free_open" label="Free-open" desc="GLM/K3/DS" />
          <ProfileCard value="balanced" label="Balanced" desc="+ Sonnet" />
          <ProfileCard value="max" label="Max" desc="Fable/Opus" />
        </RadioGroup>
      </div>

      {/* Host preference */}
      <div>
        <Label className="mb-2 block text-xs font-medium text-muted-foreground">Host preferido</Label>
        <RadioGroup
          value={hostPreference}
          onValueChange={(v) => onChange({ hostPreference: v as "opencode" | "claude" | "codex" | "hybrid" })}
          className="grid grid-cols-4 gap-2"
        >
          <HostCard value="opencode" label="OpenCode" />
          <HostCard value="claude" label="Claude" />
          <HostCard value="codex" label="Codex" />
          <HostCard value="hybrid" label="Híbrido" />
        </RadioGroup>
      </div>

      {/* Resumo routing */}
      {mode === "team" && selectedTier && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Server className="h-3.5 w-3.5" />
            Routing ({selectedTier.team_size} funções)
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selectedTier.team_functions.map((fn) => (
              <Badge key={fn} variant="outline" className="border-primary/30 bg-card/50 text-[10px]">
                {fn}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ModeCard({ value, label, desc, icon }: { value: string; label: string; desc: string; icon: React.ReactNode }) {
  return (
    <Label
      htmlFor={`mode-${value}`}
      className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-border bg-card/30 p-2.5 transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:ring-1 has-[:checked]:ring-primary"
    >
      <RadioGroupItem value={value} id={`mode-${value}`} className="sr-only" />
      <div className="text-primary">{icon}</div>
      <div className="text-xs font-semibold">{label}</div>
      <div className="text-[10px] text-muted-foreground">{desc}</div>
    </Label>
  );
}

function ProfileCard({ value, label, desc }: { value: string; label: string; desc: string }) {
  return (
    <Label
      htmlFor={`profile-${value}`}
      className="flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border border-border bg-card/30 p-2 transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:ring-1 has-[:checked]:ring-primary"
    >
      <RadioGroupItem value={value} id={`profile-${value}`} className="sr-only" />
      <div className="text-xs font-semibold">{label}</div>
      <div className="text-[10px] text-muted-foreground">{desc}</div>
    </Label>
  );
}

function HostCard({ value, label }: { value: string; label: string }) {
  return (
    <Label
      htmlFor={`host-${value}`}
      className="flex cursor-pointer items-center justify-center rounded-lg border border-border bg-card/30 p-2 text-xs font-medium transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:ring-1 has-[:checked]:ring-primary"
    >
      <RadioGroupItem value={value} id={`host-${value}`} className="sr-only" />
      {label}
    </Label>
  );
}
