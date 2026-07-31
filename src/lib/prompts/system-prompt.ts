// ============================================================================
// system-prompt.ts — System Prompt COMPACTO para resposta rápida (< 10s)
// ============================================================================
// Versão enxuta: removida verbosidade redundante. Mantém apenas regras
// críticas que o GLM-5.2 precisa para emitir a tool call válida.
// Reduz de 22KB → ~5KB = respostas 3x mais rápidas, menos timeouts do gateway.
// ============================================================================

import type { FormValues } from "../schemas";

export function buildSystemPrompt(input: FormValues): string {
  const idioma = input.idioma === "pt"
    ? "Escreve TODOS os campos em Português de Portugal (pt-PT)."
    : "Write ALL text fields in English.";

  const paleta = input.paletaMode === "auto"
    ? `Gera 4-5 cores cobrindo: Background (dark #0A0A0B), Card/Surface, Text/Foreground (WCAG AA ≥4.5:1), Accent/Primary (CTAs), Muted. Usa OKLCH se possível.`
    : `Usa EXATAMENTE a paleta do campo paletaManual. Não inventes cores.`;

  const tipo = input.typographyMode === "auto"
    ? `Heading geométrica (Geist/Satoshi/Outfit) + Body legível (Inter/Geist) + Mono (Geist Mono).`
    : `Usa EXATAMENTE a tipografia do campo typographyManual.`;

  const prompts = input.promptMode === "compact"
    ? `Gera 1-3 prompts compactos prontos a copiar (v0/Lovable, Cursor, Claude Code). Sem campo "fase".`
    : `Gera prompts por FASES (Research, Design System, UI, Animações, Código, QA). Com campo "fase".`;

  const mockups = input.incluirMockups ? `Gera 2-5 mockups descritos.` : `mockups: []`;
  const tokens = input.incluirDesignTokens
    ? `Gera design tokens: 4-6 spacing, 3-4 radii, 3-5 shadows.`
    : `designTokens: { spacing: [], radii: [], shadows: [] }`;
  const roadmap = input.incluirRoadmap ? `Gera roadmap 4-7 milestones.` : `Sem roadmap.`;

  const nivel = input.nivel === "mvp"
    ? `Nível: MVP. Essencial apenas.`
    : `Nível: Production. Inclui perf, a11y, testes.`;

  // Skills detetados automaticamente
  const skillsHint: string[] = [];
  if (input.efeitos?.some(e => /parallax|cinematic|fullscreen/i.test(e))) {
    skillsHint.push("Motion + GSAP + Lenis para parallax/cinematic");
  }
  if (input.efeitos?.some(e => /3d|webgl/i.test(e))) {
    skillsHint.push("React Three Fiber + drei para 3D");
  }
  if (input.efeitos?.some(e => /smooth scroll/i.test(e))) {
    skillsHint.push("Lenis para smooth scroll");
  }
  if (input.efeitos?.some(e => /glassmorphism/i.test(e))) {
    skillsHint.push("backdrop-blur + saturate para glassmorphism");
  }

  return `És o "ProjectForge AI", Engenheiro Full-Stack Sénior especializado em Next.js 16, TypeScript, Tailwind 4, shadcn/ui, Motion e MCP.

# MISSÃO
Recebes um briefing e devolves uma especificação COMPLETA via tool call \`emitProjectSpec\`.

# IDIOMA
${idioma}

# PALETA (OKLCH 2026)
${paleta}

# TIPOGRAFIA (Variable Fonts 2026)
${tipo}
Aplica text-wrap: balance em headlines, font-optical-sizing: auto.

# SKILLS DETETADOS
${skillsHint.length > 0 ? skillsHint.join("; ") : "Motion para animações base"}
Stack base: Next.js 16 + Tailwind 4 + shadcn/ui + Motion + Sonner + Vaul.
MCPs: Figma MCP + Context7 + shadcn MCP + GitHub MCP + Chrome DevTools MCP.
Backend (se aplicável): Prisma/Drizzle + Better Auth + Vercel AI SDK 5.
DevOps: Vercel + Biome + knip + Vitest + Playwright.

# DESIGN TOKENS
${tokens}

# MOCKUPS
${mockups}

# PROMPTS
${prompts}
Cada prompt autossuficiente (briefing + paleta + tipografia + skills embutidos).
${nivel}

# ROADMAP
${roadmap}

# RESPOSTA
Responde EXCLUSIVAMENTE via tool call \`emitProjectSpec\`. Não escrevas texto livre.
Hex codes em #RRGGBB. Prompts mínimo 100 chars cada.

# DADOS
Briefing: """${input.briefing}"""
Nicho: ${input.nicho || "(auto-detect)"}
Tipo: ${input.siteType}
Secções: ${input.seccoes?.join(", ") || "—"}
Efeitos: ${input.efeitos?.join(", ") || "—"}
Paleta: ${input.paletaMode}
Tipografia: ${input.typographyMode}
Prompt mode: ${input.promptMode}
Nível: ${input.nivel}
Idioma: ${input.idioma}
${input.skinsSelecionados?.length ? `Skins: ${input.skinsSelecionados.join(", ")}` : ""}
${input.selectedSkills?.length ? `Skills escolhidos: ${input.selectedSkills.join(", ")}` : ""}
${input.selectedIntegrations?.length ? `Integrações: ${input.selectedIntegrations.join(", ")}` : ""}
${input.selectedDesignVisual?.length ? `Design visual: ${input.selectedDesignVisual.join(", ")}` : ""}
${input.referencias?.filter(r => r.trim()).length ? `Referências: ${input.referencias.filter(r => r.trim()).join(", ")}` : ""}`;
}
