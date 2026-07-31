---
Task ID: 1
Agent: Super Z (main)
Task: Instalar a melhor skill/plugin/integração na aplicação para ter os melhores prompts e workflows compatíveis para cada tipo de projeto (atualizado julho 2026)

Work Log:
- Corrigidos os erros de parse TypeScript em 4 ficheiros:
  - `src/app/actions/generate.ts`: variável `tentativas` → `tentativa` (loop counter)
  - `src/components/forms/BriefingForm.tsx`: import `FormValues`/`SiteType` movido de `form-options` para `schemas`; adicionado tipo explícito `Variants` ao `fadeUp` para resolver incompatibilidade framer-motion
  - `src/components/fonts/FontPlayground.tsx`: tipo de `onUploadFont` alterado de `(file: File) => void` para `Promise<void>` para corresponder à implementação `handleUploadFont` (async)
  - `src/lib/font-transforms.ts`: categoria inválida `"Low Contrast"` corrigida para `"Blur & Contrast"`
- Atualizado `tsconfig.json` para excluir `examples/`, `skills/`, `mini-services/`, `tests/` (não fazem parte da app Next.js)
- Pesquisadas as melhores ferramentas/skills para web dev 2026 (2 sub-agents em paralelo):
  - 106 ferramentas modernas catalogadas (Emil Kowalski libraries, MCPs oficiais, modern auth, code quality, performance, UI premium blocks, AI tools, animation libs, Next.js 16 features)
  - 50+ design skills modernas catalogadas (CSS 2026 features, motion, layout, micro, a11y WCAG 2.2, perf, typography, color OKLCH)
- Adicionadas 50+ novas ferramentas ao `SKILLS_CATALOG` em `src/lib/skills-catalog.ts`:
  - Emil Kowalski libs: Sonner, Vaul, Input OTP, Animations.dev (curso), AIforUI.dev (curso)
  - Modern Auth: Better Auth, Clerk
  - Code Quality: Biome, Oxlint, knip
  - MCPs oficiais 2026: shadcn MCP, 21st MCP, Chrome DevTools MCP, Playwright MCP, Vercel MCP, Linear MCP, Stripe Agent Toolkit, Cloudflare MCP, Sentry MCP, Neon MCP, Upstash MCP, Browserbase MCP
  - Performance: Million.js, React Scan, Highlight.io, Vercel Speed Insights, Vercel Web Analytics
  - Backend 2026: Convex, Loops email, Logflare, Logtail
  - Testing: Vitest, Playwright, Storybook 8, Ladle
  - UI Premium: Tweakcn, Tailark, shadcn Registry, Magic UI
  - AI: Vercel AI Gateway, Vercel AI SDK 5
  - Animation: Theatre.js, OGL, Curtains.js, Splitting.js, Scroll-Timeline Polyfill
  - Next.js 16 features: Partial Prerendering (PPR), View Transitions, Speculation Rules API, Serwist
  - Forms/Inputs: Input OTP, React DayPicker
  - Backend/API: ElysiaJS, Hono, ZSA
  - CSS/Design: OKLCH Colors, Open Props, Fontsource
- Expandido `src/lib/design-skills.ts` de 10 para 30 design skills modernas 2026:
  - 10 Motion (incl. CSS Scroll-Driven, @starting-style, Magnetic Buttons, Kinetic Typography, Scroll Storytelling, Reduced-motion-aware)
  - 8 Visual (Bento Grid, Neo-Brutalism 2.0, Editorial, Spatial UI, Liquid Shapes, AI Hero Imagery)
  - 7 Layout (Container Queries, Subgrid, Anchor Positioning, Popover API, CSS Nesting, :has(), Asymmetric Layouts)
  - 10 Micro (text-box-trim, OKLCH, color-mix, Relative Colors, light-dark, Variable Fonts, Optical Sizing)
  - 6 A11y (WCAG 2.2, Target Size 24x24, prefers-contrast, forced-colors, ARIA Live, Skip Links)
  - 9 Perf (React 19 Suspense, PPR, Image Optimization, Font Subsetting, content-visibility, CSS Containment, Speculation Rules, Resource Hints, Islands Architecture)
- Atualizado `src/lib/prompts/system-prompt.ts` com conhecimento 2026:
  - Stack base moderna: Next.js 16 + PPR + View Transitions, Tailwind 4 OKLCH, Sonner (Emil Kowalski), Vaul, Input OTP, Biome, knip
  - 16+ MCPs oficiais documentados (Figma, Context7, shadcn, 21st, Chrome DevTools, Playwright, GitHub, Vercel, Linear, Stripe, Cloudflare, Sentry, Neon, Upstash, Browserbase)
  - Auth options: Better Auth, Auth.js, Clerk, WorkOS
  - Backend: Prisma/Drizzle, Convex/Supabase, Neon, Upstash, Trigger.dev/Inngest, Resend/Loops, TanStack Query, ZSA
  - Modern CSS 2026 features (16 items)
  - 30 design skills categorizadas
  - Performance/Observability 2026
  - Testing 2026 (Vitest, Playwright, Storybook)
- Atualizado `getSkillsForNicho` em `src/lib/skills-catalog.ts` para incluir novas ferramentas premium nas recomendações automáticas por nicho (SaaS B2B, E-commerce, FinTech, HealthTech, EdTech, Gaming, Crypto, Agência Criativa, etc.)
- Verificado build completo: `npm run build` passou com sucesso (Next.js 16.1.3 + Turbopack, 5 páginas geradas em ~14s)

Stage Summary:
- ✅ 0 erros TypeScript (todos os erros de parse corrigidos)
- ✅ Build Next.js 16 passa com sucesso
- ✅ Catálogo de skills expandido de ~250 para ~300 ferramentas reais (atualizado julho 2026)
- ✅ Catálogo de design skills expandido de 10 para 30 (CSS 2026 + motion + a11y + perf)
- ✅ System prompt atualizado com conhecimento 2026 completo (Emil Kowalski libs, MCPs oficiais, modern auth, OKLCH, PPR, View Transitions, etc.)
- ✅ Helper `getSkillsForNicho` agora recomenda automaticamente as novas ferramentas premium conforme o nicho do projeto
- Artefactos: catálogo aplicação Next.js em /home/z/my-project (skills-catalog.ts, design-skills.ts, system-prompt.ts atualizados)
- Script de migração preservado em /home/z/my-project/scripts/move-premium-block.py
