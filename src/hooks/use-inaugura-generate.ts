"use client";

// ============================================================================
// hooks/use-inaugura-generate.ts — Hook para chamar /api/v1/generate com SSE
// ============================================================================

import { useState, useCallback } from "react";
import type { GenerateInput, InauguraPack, Recommendation } from "@/lib/schema/inaugura-pack";

export interface GenerateState {
  loading: boolean;
  step: string;
  message: string;
  pack: InauguraPack | null;
  rec: Recommendation | null;
  error: string | null;
  projectId: string | null;
  packId: string | null;
  provider: string | null;
  model: string | null;
  latencyMs: number | null;
}

export function useInauguraGenerate() {
  const [state, setState] = useState<GenerateState>({
    loading: false,
    step: "",
    message: "",
    pack: null,
    rec: null,
    error: null,
    projectId: null,
    packId: null,
    provider: null,
    model: null,
    latencyMs: null,
  });

  const generate = useCallback(async (input: GenerateInput) => {
    setState({
      loading: true,
      step: "start",
      message: "A iniciar...",
      pack: null,
      rec: null,
      error: null,
      projectId: null,
      packId: null,
      provider: null,
      model: null,
      latencyMs: null,
    });

    try {
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream não disponível.");

      const decoder = new TextDecoder();
      let buffer = "";
      let finalPack: InauguraPack | null = null;
      let finalRec: Recommendation | null = null;
      let errorMsg: string | null = null;

      const parseSSE = (chunk: string) => {
        const events = chunk.split("\n\n");
        for (const evt of events) {
          const lines = evt.split("\n");
          let eventType = "";
          let dataStr = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) eventType = line.slice(7).trim();
            else if (line.startsWith("data: ")) dataStr += line.slice(6);
            else if (line.startsWith(":")) continue; // keepalive
          }
          if (!dataStr) continue;
          try {
            const data = JSON.parse(dataStr);
            if (eventType === "progress") {
              setState((s) => ({
                ...s,
                step: data.step || s.step,
                message: data.message || s.message,
              }));
            } else if (eventType === "recommendation") {
              finalRec = data.rec;
              setState((s) => ({ ...s, rec: data.rec }));
            } else if (eventType === "result") {
              finalPack = data.pack;
              finalRec = data.rec;
              setState((s) => ({
                ...s,
                pack: data.pack,
                rec: data.rec,
                loading: false,
                projectId: data.projectId,
                packId: data.packId,
                provider: data.provider,
                model: data.model,
                latencyMs: data.latencyMs,
              }));
            } else if (eventType === "error") {
              errorMsg = data.error;
              setState((s) => ({
                ...s,
                error: data.error,
                loading: false,
              }));
            }
          } catch {
            // ignore parse errors
          }
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const idx = buffer.lastIndexOf("\n\n");
        if (idx >= 0) {
          const complete = buffer.slice(0, idx + 2);
          buffer = buffer.slice(idx + 2);
          parseSSE(complete);
        }
      }
      if (buffer.trim()) parseSSE(buffer + "\n\n");

      if (errorMsg) {
        return { ok: false, error: errorMsg };
      }
      if (!finalPack) {
        setState((s) => ({ ...s, loading: false, error: "Stream terminou sem pack." }));
        return { ok: false, error: "Stream terminou sem pack." };
      }
      return { ok: true, pack: finalPack, rec: finalRec };
    } catch (e: any) {
      const err = e?.message ?? String(e);
      setState((s) => ({ ...s, loading: false, error: err }));
      return { ok: false, error: err };
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      step: "",
      message: "",
      pack: null,
      rec: null,
      error: null,
      projectId: null,
      packId: null,
      provider: null,
      model: null,
      latencyMs: null,
    });
  }, []);

  return { state, generate, reset };
}

// ============================================================================
// Helper: converter FormValues (UI antiga) → GenerateInput (nova API)
// ============================================================================
import type { FormValues } from "@/lib/schemas";

export function formValuesToGenerateInput(form: FormValues): GenerateInput {
  // Mapear siteType → project_type
  const projectTypeMap: Record<string, GenerateInput["project_type"]> = {
    "single-page": "portfolio",
    "multi-page": "corporate",
    dashboard: "saas",
    ecommerce: "ecommerce",
    outro: "other",
  };

  return {
    locale: form.idioma,
    brief: form.briefing,
    project_type: projectTypeMap[form.siteType] || "other",
    references: (form.referencias || [])
      .filter((r: string) => r.trim())
      .map((url: string) => ({ url, role: "visual_anchor" as const })),
    features: form.selectedIntegrations || [],
    sections_lock: form.seccoes || [],
    effects_lock: form.efeitos || [],
    visual: {
      locks: {},
      font_prefs: form.typographyManual || undefined,
    },
    execution: {
      mode: "auto",
      cost_profile: "free_open",
      host_preference: "opencode",
    },
    locks: {
      skills: form.selectedSkills || [],
      mcps: [],
      integrations: form.selectedIntegrations || [],
    },
    level: form.nivel === "production" ? "pro" : "lite",
    options: {
      polish_design: false,
      include_opencode_json: true,
      include_zip_markdown: true,
    },
  };
}
