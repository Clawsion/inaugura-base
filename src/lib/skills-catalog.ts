// ============================================================================
// skills-catalog.ts — Catálogo de skills + integrações com modos de seleção
// ============================================================================
// SKILL: STEM Calculative Problem-Solving + Visual Exploration
// Cada skill tem: id, nome, categoria, descrição, quando usar, exemplo real
// Modos: Recomendada (auto), Alternativa, Opcional, Manual (escolho eu)
// ============================================================================

export type SkillMode = "recomendada" | "alternativa" | "opcional" | "manual" | "off";

export interface Skill {
  id: string;
  nome: string;
  categoria: "UI" | "Animações" | "MCP" | "Backend" | "IA" | "DevOps" | "Design";
  icone: string;
  descricao: string;
  quandoUsar: string;
  exemplo: string;
  url?: string;
  // Modo recomendado por defeito (baseado no nicho)
  modoDefault: SkillMode;
}

// ============================================================================
// SKILLS — catálogo completo (reais, sem inventar)
// ============================================================================
export const SKILLS_CATALOG: Skill[] = [
  // ── UI Base ──
  {
    id: "shadcn-ui",
    nome: "shadcn/ui",
    categoria: "UI",
    icone: "Component",
    descricao: "Component library baseada em Radix UI + Tailwind. Copy-paste, não npm install.",
    quandoUsar: "SEMPRE. É a foundation de qualquer projeto Next.js moderno.",
    exemplo: "Vercel, Linear, Resend, Cal.com — todos usam shadcn/ui.",
    url: "https://ui.shadcn.com",
    modoDefault: "recomendada",
  },
  {
    id: "radix-ui",
    nome: "Radix UI",
    categoria: "UI",
    icone: "Component",
    descricao: "Primitives headless acessíveis (dialogs, dropdowns, popovers). Acessibilidade WCAG.",
    quandoUsar: "Sempre que precisas de componentes interativos acessíveis.",
    exemplo: "shadcn/ui é built on top of Radix. Linear, Vercel usam Radix diretamente.",
    url: "https://radix-ui.com",
    modoDefault: "recomendada",
  },
  {
    id: "tailwind-4",
    nome: "Tailwind CSS 4",
    categoria: "UI",
    icone: "Palette",
    descricao: "CSS framework utility-first. V4 com @theme inline, CSS-first config, Oxide engine.",
    quandoUsar: "SEMPRE. É o standard da indústria para styling.",
    exemplo: "Vercel, Linear, Stripe, GitHub — todos usam Tailwind.",
    url: "https://tailwindcss.com",
    modoDefault: "recomendada",
  },
  {
    id: "next-themes",
    nome: "next-themes",
    categoria: "UI",
    icone: "Moon",
    descricao: "Dark/light mode para Next.js. SSR-safe, sem flash, persistente.",
    quandoUsar: "Sempre que precisas de dark mode (praticamente sempre).",
    exemplo: "Vercel, Linear, shadcn/ui docs — todos usam next-themes.",
    url: "https://github.com/pacocoursey/next-themes",
    modoDefault: "recomendada",
  },
  {
    id: "cmdk",
    nome: "cmdk",
    categoria: "UI",
    icone: "Command",
    descricao: "Command palette (Cmd+K). Busca fuzzy, keyboard navigation.",
    quandoUsar: "Em apps com mais de 5 páginas. Essencial para produtividade.",
    exemplo: "Vercel, Linear, Raycast, GitHub — todos têm Cmd+K.",
    url: "https://cmdk.paco.me",
    modoDefault: "alternativa",
  },
  {
    id: "sonner",
    nome: "sonner",
    categoria: "UI",
    icone: "Bell",
    descricao: "Toasts modernos com animações spring. Substitui radix-toast.",
    quandoUsar: "Sempre que precisas de notificações (toasts).",
    exemplo: "Vercel, Linear, shadcn/ui — todos migraram para sonner.",
    url: "https://sonner.emilkowal.ski",
    modoDefault: "recomendada",
  },

  // ── Animações ──
  {
    id: "motion",
    nome: "Motion (Framer Motion)",
    categoria: "Animações",
    icone: "Zap",
    descricao: "Biblioteca de animações para React. useScroll, useTransform, layout animations, springs.",
    quandoUsar: "SEMPRE. É o standard para animações em React/Next.js.",
    exemplo: "Vercel, Linear, Framer, Stripe — todos usam Motion.",
    url: "https://motion.dev",
    modoDefault: "recomendada",
  },
  {
    id: "lenis",
    nome: "Lenis",
    categoria: "Animações",
    icone: "MousePointerClick",
    descricao: "Smooth scroll leve. Substitui Locomotive Scroll. Hook useLenis.",
    quandoUsar: "Em sites premium com scroll (landing pages, portfolios, agências).",
    exemplo: "Awwwards SOTD, Framer, Apple product pages.",
    url: "https://lenis.studiofreight.com",
    modoDefault: "alternativa",
  },
  {
    id: "gsap",
    nome: "GSAP ScrollTrigger",
    categoria: "Animações",
    icone: "Film",
    descricao: "GreenSock Animation Platform. ScrollTrigger para animações complexas ao scroll.",
    quandoUsar: "Para animações avançadas (horizontal scroll, pin sections, timelines).",
    exemplo: "Awwwards sites, Apple product pages, Nike stories.",
    url: "https://gsap.com",
    modoDefault: "opcional",
  },
  {
    id: "rive",
    nome: "Rive",
    categoria: "Animações",
    icone: "Sparkles",
    descricao: "Animações vetoriais interativas com states e inputs. Pequenas e com personalidade.",
    quandoUsar: "Para micro-interactions orgânicas (loading, onboarding, empty states).",
    exemplo: "Mailchimp, Slack onboarding, Cash App.",
    url: "https://rive.app",
    modoDefault: "opcional",
  },
  {
    id: "lottie",
    nome: "Lottie (lottie-react)",
    categoria: "Animações",
    icone: "Sparkles",
    descricao: "Animações After Effects exportadas como JSON. Leves e escaláveis.",
    quandoUsar: "Alternativa ao Rive para animações já feitas em After Effects.",
    exemplo: "Airbnb, Slack, Dropbox, Google.",
    url: "https://lottiefiles.com",
    modoDefault: "opcional",
  },
  {
    id: "react-three-fiber",
    nome: "React Three Fiber",
    categoria: "Animações",
    icone: "Box",
    descricao: "Three.js para React. 3D scenes, partículas, modelos interativos.",
    quandoUsar: "Para 3D/WebGL (produtos físicos, configuradores, backgrounds vivos).",
    exemplo: "Apple Vision Pro, Nike By You, Awwwards 3D sites.",
    url: "https://docs.pmnd.rs/react-three-fiber",
    modoDefault: "opcional",
  },

  // ── MCP (Model Context Protocol) ──
  {
    id: "figma-mcp",
    nome: "Figma MCP Server",
    categoria: "MCP",
    icone: "Figma",
    descricao: "Handoff de design tokens e componentes Figma → código. Dev Mode, code connect.",
    quandoUsar: "SEMPRE quando há designer na equipa. Essencial para Figma → Next.js.",
    exemplo: "Vercel, Linear, Resend — todos usam Figma MCP para handoff.",
    url: "https://github.com/GLips/Figma-Context-MCP",
    modoDefault: "recomendada",
  },
  {
    id: "context7-mcp",
    nome: "Context7 MCP",
    categoria: "MCP",
    icone: "BookOpen",
    descricao: "Documentação atualizada de libs diretamente no LLM. Substitui knowledge cutoff.",
    quandoUsar: "SEMPRE. Garante que o GLM-5.2 usa a versão mais recente das libs.",
    exemplo: "Recomendado por Cursor, Claude Code, Windsurf.",
    url: "https://context7.com",
    modoDefault: "recomendada",
  },
  {
    id: "browser-tools-mcp",
    nome: "Browser Tools MCP",
    categoria: "MCP",
    icone: "Globe",
    descricao: "QA visual, debugging CSS, performance audit, Lighthouse. Inspeciona em runtime.",
    quandoUsar: "Para QA visual e debugging de CSS/accessibility.",
    exemplo: "Agências e equipas que fazem QA visual rigoroso.",
    url: "https://github.com/AgentDeskAI/browser-tools-mcp",
    modoDefault: "alternativa",
  },
  {
    id: "github-mcp",
    nome: "GitHub MCP",
    categoria: "MCP",
    icone: "Github",
    descricao: "Versionamento, PRs, code review automatizado, issues. Tudo via MCP.",
    quandoUsar: "SEMPRE. Git é essencial em qualquer projeto.",
    exemplo: "Qualquer equipa que usa GitHub.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
    modoDefault: "recomendada",
  },
  {
    id: "filesystem-mcp",
    nome: "Filesystem MCP",
    categoria: "MCP",
    icone: "Folder",
    descricao: "Acesso a ficheiros locais para scaffolding e gestão de assets.",
    quandoUsar: "Para fluxos com assets locais ou geração de múltiplos ficheiros.",
    exemplo: "Claude Code, Cursor com scaffolding.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    modoDefault: "opcional",
  },
  {
    id: "sequential-thinking-mcp",
    nome: "Sequential Thinking MCP",
    categoria: "MCP",
    icone: "Brain",
    descricao: "Multi-step reasoning para specs complexas. Quebra problemas em passos.",
    quandoUsar: "Para specs/arquitetura complexa que requer raciocínio step-by-step.",
    exemplo: "Modelscope, Anthropic recomenda para chain-of-thought.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
    modoDefault: "opcional",
  },
  {
    id: "magic-mcp",
    nome: "Magic MCP (21st.dev)",
    categoria: "MCP",
    icone: "Wand2",
    descricao: "Gera componentes UI premium sob demanda. Awwwards-quality components.",
    quandoUsar: "Para componentes complexos que demoram muito a construir à mão.",
    exemplo: "21st.dev community, usado por agências premium.",
    url: "https://21st.dev",
    modoDefault: "opcional",
  },
  {
    id: "puppeteer-mcp",
    nome: "Puppeteer MCP",
    categoria: "MCP",
    icone: "Globe",
    descricao: "E2E testing e scraping via Puppeteer. Alternativa ao Browser Tools.",
    quandoUsar: "Para E2E tests automatizados e screenshots.",
    exemplo: "Equipas que usam Puppeteer para CI/CD.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
    modoDefault: "opcional",
  },

  // ── Backend ──
  {
    id: "prisma",
    nome: "Prisma ORM",
    categoria: "Backend",
    icone: "Database",
    descricao: "ORM type-safe para PostgreSQL/MySQL/SQLite. Migrations, studio, introspection.",
    quandoUsar: "Sempre que precisas de base de dados. Standard para Next.js.",
    exemplo: "Cal.com, Vercel, Linear — todos usam Prisma.",
    url: "https://prisma.io",
    modoDefault: "recomendada",
  },
  {
    id: "supabase",
    nome: "Supabase",
    categoria: "Backend",
    icone: "Database",
    descricao: "Backend-as-a-service. Postgres + Auth + Storage + Realtime + Edge Functions.",
    quandoUsar: "Para MVPs rápidos ou quando precisas de Auth + DB sem configuração.",
    exemplo: "1Calendar, Markprompt, Mintlify — usam Supabase.",
    url: "https://supabase.com",
    modoDefault: "alternativa",
  },
  {
    id: "nextauth",
    nome: "Auth.js (NextAuth v5)",
    categoria: "Backend",
    icone: "Lock",
    descricao: "Autenticação para Next.js. OAuth, magic links, credentials, JWT, sessions.",
    quandoUsar: "Sempre que precisas de login/registro. Standard para Next.js.",
    exemplo: "Cal.com, Vercel dashboard, shadcn/ui admin.",
    url: "https://authjs.dev",
    modoDefault: "recomendada",
  },
  {
    id: "upstash",
    nome: "Upstash Redis",
    categoria: "Backend",
    icone: "Database",
    descricao: "Redis serverless para caching, rate limiting, queues. Pay-per-request.",
    quandoUsar: "Para caching, rate limiting, ou pub/sub em serverless.",
    exemplo: "Vercel, Next.js apps que precisam de cache edge.",
    url: "https://upstash.com",
    modoDefault: "opcional",
  },
  {
    id: "neon",
    nome: "Neon Postgres",
    categoria: "Backend",
    icone: "Database",
    descricao: "Postgres serverless com branching. Escala para zero. Free tier generoso.",
    quandoUsar: "Alternativa ao Supabase para só DB (sem Auth/Storage).",
    exemplo: "Replit, Vercel recommend Neon.",
    url: "https://neon.tech",
    modoDefault: "alternativa",
  },

  // ── IA ──
  {
    id: "vercel-ai-sdk",
    nome: "Vercel AI SDK",
    categoria: "IA",
    icone: "Brain",
    descricao: "SDK para streaming de LLMs, tool calling, RAG. Multi-provider (OpenAI, Anthropic, Google).",
    quandoUsar: "Sempre que o site tem features de IA (chatbot, recomendações, geração).",
    exemplo: "Vercel AI Chat, ChatGPT clones, Perplexity-like apps.",
    url: "https://sdk.vercel.ai",
    modoDefault: "recomendada",
  },
  {
    id: "openai",
    nome: "OpenAI API",
    categoria: "IA",
    icone: "Brain",
    descricao: "GPT-4o, GPT-4-vision, DALL-E, Whisper, TTS. Para chatbots, geração de conteúdo.",
    quandoUsar: "Para features de IA quando não usas Vercel AI SDK diretamente.",
    exemplo: "Quase todo SaaS com IA usa OpenAI.",
    url: "https://platform.openai.com",
    modoDefault: "alternativa",
  },
  {
    id: "anthropic",
    nome: "Anthropic Claude API",
    categoria: "IA",
    icone: "Brain",
    descricao: "Claude 3.5 Sonnet, Opus, Haiku. Para reasoning complexo, código longo, analysis.",
    quandoUsar: "Para tarefas que exigem mais reasoning que GPT-4o.",
    exemplo: "Cursor, Replit, Notion AI usam Claude.",
    url: "https://anthropic.com",
    modoDefault: "opcional",
  },
  {
    id: "glm",
    nome: "GLM-5.2 (Z.ai)",
    categoria: "IA",
    icone: "Brain",
    descricao: "Modelo GLM-5.2 via Z.ai. Function calling nativo, structured output, multimodal.",
    quandoUsar: "Para features de IA quando queres custo-benefício com quality.",
    exemplo: "Inaugura-Base usa GLM-5.2 para geração de specs.",
    url: "https://z.ai",
    modoDefault: "recomendada",
  },

  // ── DevOps ──
  {
    id: "vercel",
    nome: "Vercel",
    categoria: "DevOps",
    icone: "Triangle",
    descricao: "Deploy Next.js com 1 click. Edge functions, preview deployments, analytics.",
    quandoUsar: "SEMPRE para Next.js. É o host nativo.",
    exemplo: "Vercel, Linear, Cal.com, Resend — todos hosted na Vercel.",
    url: "https://vercel.com",
    modoDefault: "recomendada",
  },
  {
    id: "sentry",
    nome: "Sentry",
    categoria: "DevOps",
    icone: "AlertCircle",
    descricao: "Error tracking em tempo real. Stack traces, performance monitoring, session replay.",
    quandoUsar: "Production. Essencial para monitorar erros em produção.",
    exemplo: "Vercel, Linear, Discord — todos usam Sentry.",
    url: "https://sentry.io",
    modoDefault: "recomendada",
  },
  {
    id: "posthog",
    nome: "PostHog",
    categoria: "DevOps",
    icone: "BarChart3",
    descricao: "Product analytics, feature flags, session replay, A/B testing. Open source.",
    quandoUsar: "Production. Para entender como os utilizadores usam o site.",
    exemplo: "Vercel, Y Combinator startups.",
    url: "https://posthog.com",
    modoDefault: "alternativa",
  },
  {
    id: "github-actions",
    nome: "GitHub Actions CI/CD",
    categoria: "DevOps",
    icone: "GitBranch",
    descricao: "CI/CD pipelines. Lint, test, build, deploy automático em cada PR.",
    quandoUsar: "Production. Para garantir quality gates em cada merge.",
    exemplo: "Qualquer repo GitHub sério usa Actions.",
    url: "https://github.com/features/actions",
    modoDefault: "recomendada",
  },

  // ── Design ──
  {
    id: "figma-typography",
    nome: "Figma AI Typography",
    categoria: "Design",
    icone: "Type",
    descricao: "Plugin Figma que analisa hierarquia tipográfica e sugere pairings.",
    quandoUsar: "Durante a fase de Design System para validar tipografia.",
    exemplo: "Designers em agências premium usam para validar pairing.",
    url: "https://figma.com/community",
    modoDefault: "opcional",
  },
  {
    id: "figma-tokens",
    nome: "Figma Tokens Plugin",
    categoria: "Design",
    icone: "Palette",
    descricao: "Sync de design tokens entre Figma e código. CSS variables, Tailwind config.",
    quandoUsar: "Para manter tokens sincronizados entre design e dev.",
    exemplo: "Equipas que fazem design system sério.",
    url: "https://figma.com/community/plugin/843461159747178978",
    modoDefault: "alternativa",
  },
  {
    id: "chroma-js",
    nome: "chroma.js",
    categoria: "Design",
    icone: "Palette",
    descricao: "Biblioteca para manipulação de cores. WCAG contrast, scales, mixing.",
    quandoUsar: "Para gerar e validar paletas programaticamente.",
    exemplo: "Inaugura-Base usa chroma.js para validar WCAG AA.",
    url: "https://gka.github.io/chroma.js",
    modoDefault: "recomendada",
  },
  {
    id: "zod",
    nome: "Zod",
    categoria: "Design",
    icone: "ShieldCheck",
    descricao: "Schema validation type-safe. Para validar inputs, tool calling, configs.",
    quandoUsar: "SEMPRE para validar dados (server actions, API, tool calling).",
    exemplo: "Vercel, Linear, shadcn/ui form — todos usam Zod.",
    url: "https://zod.dev",
    modoDefault: "recomendada",
  },
];

// ============================================================================
// INTEGRAÇÕES — catálogo separado
// ============================================================================
export interface Integracao {
  id: string;
  nome: string;
  categoria: "Pagamentos" | "Email" | "Analytics" | "Auth" | "Storage" | "Search" | "Comunicação" | "Outro";
  icone: string;
  descricao: string;
  quandoUsar: string;
  exemplo: string;
  url?: string;
  modoDefault: SkillMode;
}

export const INTEGRACOES_CATALOG: Integracao[] = [
  // Pagamentos
  { id: "stripe", nome: "Stripe", categoria: "Pagamentos", icone: "CreditCard", descricao: "Pagamentos online. Subscriptions, one-time, marketplace, billing.", quandoUsar: "Para qualquer e-commerce ou SaaS com pagamentos.", exemplo: "Vercel, Linear, Notion — todos usam Stripe.", url: "https://stripe.com", modoDefault: "recomendada" },
  { id: "paypal", nome: "PayPal", categoria: "Pagamentos", icone: "CreditCard", descricao: "Alternative payment method. Popular em US/EU.", quandoUsar: "Como alternativa ao Stripe ou em mercados onde PayPal domina.", exemplo: "Etsy, eBay, freelancers.", url: "https://paypal.com", modoDefault: "opcional" },
  { id: "mbway", nome: "MB WAY", categoria: "Pagamentos", icone: "CreditCard", descricao: "Pagamentos via telemóvel. Popular em Portugal.", quandoUsar: "Para e-commerce em Portugal.", exemplo: "Lojas portuguesas, Continente, Worten.", modoDefault: "opcional" },
  { id: "lemon-squeezy", nome: "Lemon Squeezy", categoria: "Pagamentos", icone: "CreditCard", descricao: "Merchant of record para SaaS. Handles VAT/tax globalmente.", quandoUsar: "Para SaaS que vende globalmente sem lidar com tax.", exemplo: "Indie hackers, SaaS solo founders.", url: "https://lemonsqueezy.com", modoDefault: "alternativa" },

  // Email
  { id: "resend", nome: "Resend", categoria: "Email", icone: "Mail", descricao: "Email API para developers. React Email, DKIM, tracking.", quandoUsar: "Para enviar emails transacionais (welcome, reset, receipts).", exemplo: "Vercel, Linear, Cal.com — todos usam Resend.", url: "https://resend.com", modoDefault: "recomendada" },
  { id: "sendgrid", nome: "SendGrid", categoria: "Email", icone: "Mail", descricao: "Email delivery platform. Marketing + transactional.", quandoUsar: "Para volume alto de emails ou marketing campaigns.", exemplo: "Spotify, Airbnb, Uber.", url: "https://sendgrid.com", modoDefault: "alternativa" },
  { id: "react-email", nome: "React Email", categoria: "Email", icone: "Mail", descricao: "Escreve emails com React components. Preview, templates.", quandoUsar: "Sempre que usas Resend ou similar para templates.", exemplo: "Resend, Vercel, Linear.", url: "https://react.email", modoDefault: "recomendada" },

  // Analytics
  { id: "google-analytics", nome: "Google Analytics 4", categoria: "Analytics", icone: "BarChart3", descricao: "Web analytics standard. Eventos, conversões, audiências.", quandoUsar: "Para tracking básico de tráfego (standard da indústria).", exemplo: "Quase todo site usa GA4.", url: "https://analytics.google.com", modoDefault: "recomendada" },
  { id: "plausible", nome: "Plausible", categoria: "Analytics", icone: "BarChart3", descricao: "Analytics privacy-friendly, sem cookies. GDPR compliant.", quandoUsar: "Para analytics privacy-first (GDPR, sem cookies).", exemplo: "Vercel docs, Laravel, Bun.", url: "https://plausible.io", modoDefault: "alternativa" },
  { id: "mixpanel", nome: "Mixpanel", categoria: "Analytics", icone: "BarChart3", descricao: "Product analytics profundo. Funnels, retention, cohorts.", quandoUsar: "Para SaaS que precisa de product analytics detalhado.", exemplo: "Uber, Airbnb, OpenAI.", url: "https://mixpanel.com", modoDefault: "opcional" },

  // Auth
  { id: "clerk", nome: "Clerk", categoria: "Auth", icone: "Lock", descricao: "Auth-as-a-service. UI components prontos, social login, orgs.", quandoUsar: "Alternativa ao NextAuth quando queres UI pronto e rápido.", exemplo: "Replit, Vercel apps, YC startups.", url: "https://clerk.com", modoDefault: "alternativa" },
  { id: "auth0", nome: "Auth0", categoria: "Auth", icone: "Lock", descricao: "Enterprise auth. SSO, SAML, MFA, compliance.", quandoUsar: "Para enterprise/B2B que precisa de SSO/SAML.", exemplo: "Atlassian, Slack enterprise.", url: "https://auth0.com", modoDefault: "opcional" },

  // Storage
  { id: "uploadthing", nome: "UploadThing", categoria: "Storage", icone: "Upload", descricao: "File uploads para Next.js. Type-safe, sem backend.", quandoUsar: "Para upload de imagens/ficheiros em Next.js.", exemplo: "Vercel apps, indie hackers.", url: "https://uploadthing.com", modoDefault: "recomendada" },
  { id: "cloudinary", nome: "Cloudinary", categoria: "Storage", icone: "Image", descricao: "Image/video CDN com transformações on-the-fly.", quandoUsar: "Para manipulação de imagens (resize, format, optimize).", exemplo: "Etsy, News sites, e-commerce.", url: "https://cloudinary.com", modoDefault: "alternativa" },

  // Search
  { id: "algolia", nome: "Algolia", categoria: "Search", icone: "Search", descricao: "Search-as-a-service. Instant search, typo tolerance, faceting.", quandoUsar: "Para e-commerce ou sites com muito conteúdo pesquisável.", exemplo: "Stripe docs, Notion, Loom.", url: "https://algolia.com", modoDefault: "alternativa" },
  { id: "meilisearch", nome: "Meilisearch", categoria: "Search", icone: "Search", descricao: "Search open source. Self-hosted ou cloud. Rápido.", quandoUsar: "Alternativa self-hosted ao Algolia.", exemplo: "Indie hackers, open source projects.", url: "https://meilisearch.com", modoDefault: "opcional" },

  // Comunicação
  { id: "livechat", nome: "LiveChat / Intercom", categoria: "Comunicação", icone: "MessageCircle", descricao: "Chat ao vivo para suporte. Bots, tickets, helpdesk.", quandoUsar: "Para SaaS/e-commerce que precisa de suporte ao cliente.", exemplo: "SaaS B2B, e-commerce premium.", url: "https://intercom.com", modoDefault: "opcional" },
  { id: "pusher", nome: "Pusher / Ably", categoria: "Comunicação", icone: "Radio", descricao: "Realtime websockets. Chat, live updates, collaboration.", quandoUsar: "Para features realtime (chat, cursors, live data).", exemplo: "Figma, Linear, Google Docs.", url: "https://pusher.com", modoDefault: "opcional" },
];

// ============================================================================
// Helpers: recomendar skills por nicho
// ============================================================================
export function getSkillsForNicho(nicho: string): Skill[] {
  // Base: todas com modoDefault "recomendada" são incluídas
  const base = SKILLS_CATALOG.filter((s) => s.modoDefault === "recomendada");

  // Adicionais por nicho
  const adicionais: Record<string, string[]> = {
    "SaaS B2B": ["cmdk", "posthog"],
    "E-commerce Moda": ["cloudinary", "algolia"],
    "E-commerce Geral": ["stripe", "cloudinary", "algolia"],
    "FinTech": ["sentry", "posthog"],
    "HealthTech": ["sentry", "posthog"],
    "Gaming": ["react-three-fiber", "rive"],
    "Crypto / Web3": ["react-three-fiber"],
    "Agência Criativa": ["gsap", "react-three-fiber", "magic-mcp"],
    "Portfólio Pessoal": ["gsap"],
    "Blog / Media": ["algolia"],
  };

  const extraIds = adicionais[nicho] ?? [];
  const extras = SKILLS_CATALOG.filter((s) => extraIds.includes(s.id));

  return [...base, ...extras];
}

export function getIntegracoesForNicho(nicho: string): Integracao[] {
  const base = INTEGRACOES_CATALOG.filter((i) => i.modoDefault === "recomendada");

  const adicionais: Record<string, string[]> = {
    "SaaS B2B": ["clerk"],
    "E-commerce Moda": ["stripe", "cloudinary", "algolia"],
    "E-commerce Geral": ["stripe", "cloudinary"],
    "FinTech": ["stripe"],
  };

  const extraIds = adicionais[nicho] ?? [];
  const extras = INTEGRACOES_CATALOG.filter((i) => extraIds.includes(i.id));

  return [...base, ...extras];
}
