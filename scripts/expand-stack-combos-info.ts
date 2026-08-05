// ============================================================================
// expand-stack-combos-info.ts — Adiciona info rica a TODOS os 50 combos
// ============================================================================
import * as fs from "node:fs";

// Info detalhada para cada combo (id → info)
const comboInfo: Record<string, {
  description: string;
  whenToUse: string;
  siteType: string;
  examples: string[];
  exampleLinks: string[];
  bestFor: string[];
  performanceNote: string;
}> = {
  // ─── SaaS ───
  "saas-god-tier": {
    description: "Stack SaaS production-ready mais usado em 2026. Tudo incluído: auth, DB, payments, email, analytics.",
    whenToUse: "Quando precisas de lançar SaaS completo sem pensar em decisões técnicas.",
    siteType: "SaaS B2B/B2C, dashboards, apps subscription",
    examples: ["Linear", "Vercel", "Cal.com", "Dub.co"],
    exampleLinks: ["https://linear.app", "https://cal.com", "https://dub.co"],
    bestFor: ["MVP rápido", "Production SaaS", "Multi-tenant"],
    performanceNote: "Edge-ready, SSR, 95+ Lighthouse",
  },
  "supabase-power": {
    description: "All-in-one Supabase stack: Auth + DB + Storage + Realtime. Mais rápido para MVP.",
    whenToUse: "Quando queres backend completo sem gerir infraestrutura.",
    siteType: "SaaS, apps realtime, chat, collab",
    examples: ["Supabase own apps", "Chat apps", "Collab tools"],
    exampleLinks: ["https://supabase.com/customers"],
    bestFor: ["Realtime apps", "Quick MVP", "Solo founders"],
    performanceNote: "Realtime subscriptions via WebSocket",
  },
  "t3-classic": {
    description: "T3 stack clássico: tRPC + Prisma + NextAuth. Type-safe end-to-end.",
    whenToUse: "Quando valorizas type-safety extrema e DX.",
    siteType: "SaaS B2B, internal tools, dashboards",
    examples: ["Theo's projects", "Indie SaaS"],
    exampleLinks: ["https://create.t3.gg"],
    bestFor: ["Type safety", "DX premium", "B2B"],
    performanceNote: "Type-safe API, sem GraphQL overhead",
  },
  "remix-full-stack": {
    description: "Remix com nested routing e web standards. SSR otimizado.",
    whenToUse: "Quando precisas de nested layouts e progressive enhancement.",
    siteType: "Apps data-heavy, e-commerce, dashboards",
    examples: ["Epic Stack", "Shopify Hydrogen"],
    exampleLinks: ["https://remix.run/showcase"],
    bestFor: ["Data-heavy", "E-commerce", "Nested layouts"],
    performanceNote: "SSR com streaming",
  },
  "sveltekit-modern": {
    description: "SvelteKit — leve, rápido, compila para vanilla JS. Menos bundle size.",
    whenToUse: "Quando queres max performance e bundle mínimo.",
    siteType: "Portfolios, landing pages, apps leves",
    examples: ["Vercel some pages", "Indie projects"],
    exampleLinks: ["https://svelte.dev/showcase"],
    bestFor: ["Performance", "Bundle size", "SEO"],
    performanceNote: "Bundle ~10KB vs ~80KB React",
  },
  // ─── AI ───
  "ai-native-sdk": {
    description: "Vercel AI SDK + OpenAI/Anthropic. Streaming responses, tool calling.",
    whenToUse: "Quando constróis chatbots, AI assistants, RAG apps.",
    siteType: "AI chat, AI tools, copilots",
    examples: ["ChatGPT clones", "Vercel AI SDK demos"],
    exampleLinks: ["https://sdk.vercel.ai/examples"],
    bestFor: ["AI chat", "Streaming", "Tool calling"],
    performanceNote: "Edge runtime para AI",
  },
  "ai-rag-supabase": {
    description: "RAG com Supabase pgvector + AI SDK. Search em documentos.",
    whenToUse: "Quando precisas de search semântico em docs/conhecimento.",
    siteType: "Knowledge base, docs search, AI assistants",
    examples: ["Mintlify", "Inkeep"],
    exampleLinks: ["https://supabase.com/docs/guides/ai"],
    bestFor: ["RAG", "Semantic search", "Docs AI"],
    performanceNote: "pgvector nativo do Postgres",
  },
  "ai-langchain": {
    description: "LangChain.js para pipelines AI complexos. Chains, agents, memory.",
    whenToUse: "Quando precisas de chains complexas, agents, multi-step reasoning.",
    siteType: "AI agents, complex pipelines, automation",
    examples: ["AutoGPT clones", "AI workflow tools"],
    exampleLinks: ["https://langchain.com"],
    bestFor: ["Agents", "Chains", "Complex AI"],
    performanceNote: "Overhead maior que AI SDK puro",
  },
  "ai-mastra": {
    description: "Mastra framework para agents production-ready. workflows, memory.",
    whenToUse: "Quando queres framework opinionado para agents.",
    siteType: "AI agents, workflow automation",
    examples: ["Mastra demos"],
    exampleLinks: ["https://mastra.ai"],
    bestFor: ["Agents", "Workflows", "Memory"],
    performanceNote: "Built-in observability",
  },
  // ─── Indie ───
  "indie-cloudflare": {
    description: "Cloudflare stack: D1 + Workers + Pages. Free tier generoso.",
    whenToUse: "Quando queres free tier real para side project.",
    siteType: "Side projects, indie apps, blogs",
    examples: ["Indie hackers apps"],
    exampleLinks: ["https://cloudflare.com/case-studies"],
    bestFor: ["Free tier", "Edge global", "Indie"],
    performanceNote: "Edge global, latency <50ms worldwide",
  },
  "indie-bun": {
    description: "Bun + Hono. Max speed, JavaScript runtime moderno.",
    whenToUse: "Quando queres startup time <100ms e max performance.",
    siteType: "APIs, microservices, indie apps",
    examples: ["Bun own demos"],
    exampleLinks: ["https://bun.sh/showcase"],
    bestFor: ["Speed", "Startup time", "APIs"],
    performanceNote: "Startup ~50ms vs Node ~200ms",
  },
  "indie-polar": {
    description: "Polar/Lemon Squeezy para SaaS. Merchant of Record (lida com VAT/tax).",
    whenToUse: "Quando vendes SaaS globalmente sem lidar com tax.",
    siteType: "Indie SaaS, digital products, subscriptions",
    examples: ["Indie SaaS solo founders"],
    exampleLinks: ["https://polar.sh", "https://lemonsqueezy.com"],
    bestFor: ["Solo founders", "Global SaaS", "No tax headache"],
    performanceNote: "Sem Stripe complexity",
  },
  "indie-turso": {
    description: "Turso SQLite na edge. Free tier generoso, multi-region.",
    whenToUse: "Quando queres SQLite com sync multi-region.",
    siteType: "Apps offline-first, edge apps, indie",
    examples: ["Indie apps", "Offline-first"],
    exampleLinks: ["https://turso.tech/customers"],
    bestFor: ["Edge DB", "Offline-first", "Free tier"],
    performanceNote: "Replica SQLite globalmente",
  },
  // ─── Enterprise ───
  "enterprise-clerk": {
    description: "Clerk auth enterprise. SSO, SAML, organizations, MFA.",
    whenToUse: "Quando precisas SSO/SAML para clientes enterprise.",
    siteType: "B2B enterprise, SaaS multi-org",
    examples: ["Vercel", "Linear", "Cursor"],
    exampleLinks: ["https://clerk.com/customers"],
    bestFor: ["Enterprise", "SSO/SAML", "Multi-org"],
    performanceNote: "Auth gerido, sem overhead",
  },
  "enterprise-workos": {
    description: "WorkOS para enterprise auth. SAML, SCIM, audit logs.",
    whenToUse: "Quando precisas SAML + SCIM + audit logs enterprise.",
    siteType: "Enterprise B2B, SaaS com clientes Fortune 500",
    examples: ["Vercel Pro", "Notion Enterprise"],
    exampleLinks: ["https://workos.com/customers"],
    bestFor: ["Enterprise", "Compliance", "SCIM"],
    performanceNote: "SCIM para user provisioning",
  },
  "enterprise-planetScale": {
    description: "PlanetScale MySQL serverless. Vitess, branching, scale.",
    whenToUse: "Quando precisas MySQL com branching e scale horizontal.",
    siteType: "Enterprise apps, high-traffic SaaS",
    examples: ["Notion", "Square", "MyFitnessPal"],
    exampleLinks: ["https://planetscale.com/customers"],
    bestFor: ["Scale", "Branching", "MySQL"],
    performanceNote: "Horizontally scalable",
  },
  // ─── Commerce ───
  "commerce-medusa": {
    description: "Medusa headless commerce. Open source, customizable.",
    whenToUse: "Quando queres commerce open source sem Shopify lock-in.",
    siteType: "E-commerce custom, marketplaces",
    examples: ["Indie commerce", "Custom marketplaces"],
    exampleLinks: ["https://medusajs.com/customers"],
    bestFor: ["Custom commerce", "Open source", "Marketplaces"],
    performanceNote: "Self-host, sem % por venda",
  },
  "commerce-shopify": {
    description: "Shopify Hydrogen + Next.js. Commerce escalável.",
    whenToUse: "Quando queres Shopify backend com frontend custom.",
    siteType: "E-commerce estabelecido, brands médias+",
    examples: ["Allbirds", "Kith", "Gymshark"],
    exampleLinks: ["https://shopify.engineering"],
    bestFor: ["E-commerce", "Scalable", "Payments ready"],
    performanceNote: "Shopify infra com Next.js frontend",
  },
  "commerce-stripe": {
    description: "Stripe direto. Mais flexível, sem merchant of record.",
    whenToUse: "Quando queres controlo total sobre payments.",
    siteType: "SaaS com payments, subscriptions",
    examples: ["Linear", "Vercel", "Notion"],
    exampleLinks: ["https://stripe.com/customers"],
    bestFor: ["Flexibilidade", "Subscriptions", "SaaS"],
    performanceNote: "Webhooks, sem lock-in",
  },
  // ─── Python ───
  "python-fastapi": {
    description: "Next.js + FastAPI backend. Python para ML/data.",
    whenToUse: "Quando precisas Python para ML/AI no backend.",
    siteType: "AI apps, data-heavy, ML pipelines",
    examples: ["AI products", "Data dashboards"],
    exampleLinks: ["https://fastapi.tiangolo.com/features/"],
    bestFor: ["ML/AI", "Python ecosystem", "Data"],
    performanceNote: "Async Python, type-safe",
  },
  "python-django": {
    description: "Next.js + Django. Batteries-included Python backend.",
    whenToUse: "Quando precisas Django admin + ORM maduro.",
    siteType: "Content platforms, marketplaces, B2B",
    examples: ["Instagram (Django)", "Disqus"],
    exampleLinks: ["https://www.djangoproject.com/start/"],
    bestFor: ["Admin panel", "ORM maduro", "Content"],
    performanceNote: "Batteries-included",
  },
  "python-flask": {
    description: "Next.js + Flask. Leve, micro-framework Python.",
    whenToUse: "Quando queres backend Python minimalista.",
    siteType: "APIs simples, protótipos, microservices",
    examples: ["Pinterest (early)", "LinkedIn (early)"],
    exampleLinks: ["https://flask.palletsprojects.com/"],
    bestFor: ["Minimal", "Protótipos", "APIs"],
    performanceNote: "Micro, sem overhead",
  },
  // ─── Mobile ───
  "mobile-expo": {
    description: "Expo + React Native. Cross-platform iOS/Android.",
    whenToUse: "Quando precisas app mobile iOS+Android com Next.js web.",
    siteType: "Apps mobile, cross-platform",
    examples: ["Bluesky", "Coinbase Wallet"],
    exampleLinks: ["https://expo.dev/showcase"],
    bestFor: ["Cross-platform", "Mobile", "iOS+Android"],
    performanceNote: "OTA updates, sem app store review",
  },
  "mobile-pwa": {
    description: "PWA com Next.js. Instalável, offline-first.",
    whenToUse: "Quando queres app-like sem app store.",
    siteType: "Apps web instaláveis, content apps",
    examples: ["Twitter Lite", "Pinterest PWA"],
    exampleLinks: ["https://web.dev/progressive-web-apps/"],
    bestFor: ["No app store", "Offline", "Installable"],
    performanceNote: "Service Worker cache",
  },
  // ─── Content ───
  "content-sanity": {
    description: "Sanity headless CMS. Real-time, customizable studio.",
    whenToUse: "Quando precisas CMS para editors não-técnicos.",
    siteType: "Blogs, magazines, content sites",
    examples: ["Linear blog", "Vercel docs", "Figma"],
    exampleLinks: ["https://www.sanity.io/customers"],
    bestFor: ["CMS", "Real-time", "Custom studio"],
    performanceNote: "Real-time collaboration",
  },
  // ─── Awwwards ───
  "god-tier-creative": {
    description: "Stack hardcore para Awwwards SOTY. Nuxt + GSAP full + Three.js + WebGL custom. Storytelling cinematográfico 3D imersivo.",
    whenToUse: "Quando queres ganhar Awwwards SOTY. Para agências que fazem sites experimentais de topo.",
    siteType: "Hardcore Agência, Experimental, Brand experiences imersivas",
    examples: ["Active Theory", "Resn", "Bureau Cool", "Locomotive"],
    exampleLinks: ["https://activetheory.net", "https://resn.co.nz", "https://bureau.co", "https://locomotive.ca"],
    bestFor: ["Awwwards SOTY", "Storytelling 3D", "Brand experiences"],
    performanceNote: "WebGL pesado, Lighthouse pode sofrer. Otimizar para 60fps.",
  },
  "soty-nocode-king": {
    description: "Stack do Lando Norris (SOTY 2025). Webflow + GSAP custom + Rive + WebGL embed. Visual build + dev avançado.",
    whenToUse: "Quando queres replicate o Lando Norris SOTY 2025. Para brands/athletes com visual forte.",
    siteType: "Brand experiences, Athletes, Product launches",
    examples: ["Lando Norris (SOTY 2025)", "Brand athlete sites"],
    exampleLinks: ["https://landonorris.com"],
    bestFor: ["SOTY replication", "Brand athletes", "Visual + Code"],
    performanceNote: "Webflow hosting + custom JS. Performance média.",
  },
  "react-immersive": {
    description: "Next.js + React Three Fiber + Drei. 3D React-friendly com deploy edge. Mais acessível que raw Three.js.",
    whenToUse: "Quando queres 3D em React sem aprender WebGL cru. Portfolios top.",
    siteType: "Portfolios 3D, agency sites, product configurators",
    examples: ["Trionn-like", "JSM tutoriais", "Portfolios 3D top"],
    exampleLinks: ["https://docs.pmnd.rs/react-three-fiber", "https://trionn.com"],
    bestFor: ["Portfolios 3D", "Agências React", "App-like"],
    performanceNote: "R3F é React-friendly. Bundle ~200KB para 3D.",
  },
  "trionn-architecture": {
    description: "React/Next + raw Three.js (não R3F) + Web Audio API + SplitText. Controle total do render loop.",
    whenToUse: "Quando precisas controle absoluto do render loop + som procedural. Codrops case study 2026.",
    siteType: "Studio websites high-end, experimental",
    examples: ["Trionn (Codrops 2026)"],
    exampleLinks: ["https://trionn.com", "https://tympanus.net/codrops"],
    bestFor: ["Studio high-end", "Render loop control", "Codrops quality"],
    performanceNote: "Raw Three.js = max controle, max complexidade.",
  },
  "vanilla-mastery": {
    description: "HTML/CSS/JS puro + custom WebGL engine + GLSL shaders + Barba.js. Zero framework, max performance.",
    whenToUse: "Quando queres Developer Award. Para developers que querem controle absoluto.",
    siteType: "Experimental, Developer Award, art projects",
    examples: ["Active Theory", "Resn", "Immersive Garden"],
    exampleLinks: ["https://activetheory.net", "https://resn.co.nz", "https://immersive-garden.com"],
    bestFor: ["Developer Award", "Max performance", "Zero overhead"],
    performanceNote: "Sem framework overhead. Bundle ~30KB.",
  },
  "astro-performance": {
    description: "Astro + Islands (Vue/React/Svelte) + GSAP + Three.js. Static-first ultra-rápido com hidratação seletiva.",
    whenToUse: "Quando valorizas Lighthouse 100 + storytelling. Editorial premium.",
    siteType: "Editorial, content-heavy, blogs premium",
    examples: ["Pego (Awwwards)", "Editorial sites top"],
    exampleLinks: ["https://astro.build/showcase"],
    bestFor: ["Lighthouse 100", "Editorial", "Content-heavy"],
    performanceNote: "Static-first, islands hidratam só o necessário.",
  },
  "svelte-fluid": {
    description: "SvelteKit + Threlte (Three.js Svelte) + GSAP. Reatividade nativa + 3D leve.",
    whenToUse: "Quando queres 3D com bundle mínimo. Modern experimental.",
    siteType: "Modern experimental, portfolios, product sites",
    examples: ["Svelte community sites"],
    exampleLinks: ["https://svelte.dev/showcase", "https://threlte.xyz"],
    bestFor: ["3D Svelte-native", "Leveza", "Modern"],
    performanceNote: "Svelte compila para vanilla, bundle ~10KB.",
  },
  "webflow-advanced-motion": {
    description: "Webflow + Rive + GSAP + Lottie + custom code. Design visual + state machines.",
    whenToUse: "Para brand/athlete/product sites com animações state-based leves.",
    siteType: "Brand, athlete, product launches",
    examples: ["Brand sites Webflow + Rive"],
    exampleLinks: ["https://webflow.com/showcase", "https://rive.app"],
    bestFor: ["Brand", "Athlete", "Product"],
    performanceNote: "Webflow hosting, performance média.",
  },
  "nuxt-pure-story": {
    description: "Nuxt + GSAP ScrollTrigger + Lenis + SplitText + Barba.js/View Transitions + Sanity. Narrativa scroll-driven.",
    whenToUse: "Para editorial/brand experiences com page transitions seamless.",
    siteType: "Editorial, brand experience, storytelling",
    examples: ["Awwwards SOTY editorial"],
    exampleLinks: ["https://nuxt.com/showcase"],
    bestFor: ["Narrativa scroll", "Page transitions", "Editorial"],
    performanceNote: "SSR Nuxt + GSAP, performance boa.",
  },
  "next-r3f-pro": {
    description: "Next.js + R3F + postprocessing + shaders + Zustand. 3D React completo com state management.",
    whenToUse: "Para product configurators, immersive product sites.",
    siteType: "Product configurators, immersive product",
    examples: ["Product sites 3D top"],
    exampleLinks: ["https://docs.pmnd.rs/react-three-fiber"],
    bestFor: ["3D React", "Product configurators", "Immersive"],
    performanceNote: "Zustand para state, R3F para 3D.",
  },
  "hybrid-headless-ecom": {
    description: "Next/Nuxt + Shopify Hydrogen ou Sanity/Payload + GSAP + Three.js. E-com premium com 3D product.",
    whenToUse: "Para luxury e-commerce com 3D product views.",
    siteType: "Luxury e-commerce, brands high-end",
    examples: ["Luxury brands e-com"],
    exampleLinks: ["https://www.shopify.com/partners/blog/hydrogen"],
    bestFor: ["Luxury e-commerce", "3D product", "Marcas high-end"],
    performanceNote: "Headless + 3D, performance otimizar bem.",
  },
  "rive-centric": {
    description: "Webflow ou Next + Rive (principal) + GSAP secundário + Three.js leve. Animações state machines interativas.",
    whenToUse: "Para UI complexa mobile-first premium. Rive em alta pós-Lando.",
    siteType: "Mobile-first premium, UI complexa",
    examples: ["Pós-Lando Norris sites"],
    exampleLinks: ["https://rive.app"],
    bestFor: ["State machines", "Mobile-first", "UI complexa"],
    performanceNote: "Rive é leve (~50KB), ideal para mobile.",
  },
  "framer-motion-hybrid": {
    description: "Next.js + Framer Motion + GSAP (só scroll pesado) + Lenis. Micro-interações rápidas + GSAP para o pesado.",
    whenToUse: "Para apps/dashboards criativos. Mais acessível que pure GSAP.",
    siteType: "Apps criativos, dashboards, SaaS premium",
    examples: ["Linear", "Vercel", "Resend"],
    exampleLinks: ["https://linear.app", "https://resend.com"],
    bestFor: ["Micro-interações", "Apps criativas", "Mais acessível"],
    performanceNote: "Framer para leve, GSAP para pesado. Equilíbrio ideal.",
  },
  "custom-webgl-engine": {
    description: "Vanilla ou framework leve + custom WebGL/WebGPU + GSAP + Lenis. Efeitos únicos: particles, distortion, generative.",
    whenToUse: "Para art/experimental. Studios como Lusion, Monks.",
    siteType: "Art, experimental, generative",
    examples: ["Lusion", "Monks", "Active Theory"],
    exampleLinks: ["https://lusion.co", "https://monks.com"],
    bestFor: ["Particles", "Distortion", "Generative"],
    performanceNote: "WebGPU quando disponível, WebGL fallback.",
  },
  "nuxt-pinia-gsap": {
    description: "Nuxt + Pinia + GSAP full + Lenis + Three.js. State robusto + animações + 3D.",
    whenToUse: "Para apps complexas criativas com state management robusto.",
    siteType: "Apps complexas criativas, interactive experiences",
    examples: ["Vue/Nuxt apps premium"],
    exampleLinks: ["https://nuxt.com/showcase"],
    bestFor: ["State robusto", "Apps complexas", "3D"],
    performanceNote: "Pinia leve, Nuxt SSR.",
  },
  "wp-headless-premium": {
    description: "Next/Nuxt + WP GraphQL ou Faust + GSAP + Lenis + Three.js. WordPress headless para clientes não-técnicos.",
    whenToUse: "Para agências com clientes não-técnicos que querem WordPress admin.",
    siteType: "Agências, clientes não-técnicos, content sites",
    examples: ["Agências WP premium"],
    exampleLinks: ["https://www.wpgraphql.com", "https://faustjs.org"],
    bestFor: ["Cliente não-técnico", "CMS fácil", "Award-winning"],
    performanceNote: "Headless, frontend Next.js.",
  },
  "svelte-threlte-gsap": {
    description: "SvelteKit + Threlte + GSAP + Lenis. 3D Svelte-native com leveza.",
    whenToUse: "Para modern experimental com 3D. Alternativa a R3F.",
    siteType: "Modern experimental, 3D portfolios",
    examples: ["Svelte 3D community"],
    exampleLinks: ["https://threlte.xyz"],
    bestFor: ["3D Svelte-native", "Leveza", "Experimental"],
    performanceNote: "Svelte + Threlte, bundle mínimo.",
  },
  "astro-react-3d-islands": {
    description: "Astro + R3F islands + GSAP + Lenis. Melhor dos dois mundos: static + 3D interativo.",
    whenToUse: "Para portfolios/landing com 3D seletivo. Performance monstro.",
    siteType: "Portfolios, landing pages, 3D seletivo",
    examples: ["Astro 3D sites top"],
    exampleLinks: ["https://astro.build/showcase"],
    bestFor: ["Static + 3D", "Performance monstro", "Portfolios"],
    performanceNote: "3D só hidrata onde precisa. Lighthouse 95+.",
  },
  "webflow-custom-heavy": {
    description: "Webflow + muito JS custom (GSAP/Three) + Memberstack. No-code base + dev avançado.",
    whenToUse: "Para rápido time-to-market premium. Muitos SOTD No-Code Honors.",
    siteType: "No-code premium, brand sites",
    examples: ["Awwwards SOTD No-Code Honors"],
    exampleLinks: ["https://webflow.com/showcase"],
    bestFor: ["No-code base", "Dev avançado", "Time-to-market"],
    performanceNote: "Webflow + custom JS, otimizar bem.",
  },
  "plain-barba-gsap": {
    description: "HTML/JS + Barba.js + GSAP + Lenis + Three.js. Transições de página perfeitas + zero framework.",
    whenToUse: "Para multi-page cinematic. Clássico ainda forte em Awwwards.",
    siteType: "Multi-page cinematic, portfolios, studios",
    examples: ["Studios premium multi-page"],
    exampleLinks: ["https://barba.js.org", "https://gsap.com/showcase"],
    bestFor: ["Transições perfeitas", "Zero framework", "Cinematic"],
    performanceNote: "Sem framework, bundle ~40KB.",
  },
  "next-tailwind-shadcn-gsap": {
    description: "Next + Tailwind + shadcn/ui + GSAP + Lenis. Design system rápido + animações premium.",
    whenToUse: "Para SaaS criativo/portfolios. Mais produto que experimental.",
    siteType: "SaaS criativo, portfolios premium",
    examples: ["Linear", "Vercel", "Resend"],
    exampleLinks: ["https://linear.app", "https://resend.com"],
    bestFor: ["SaaS criativo", "Portfolios", "Design system rápido"],
    performanceNote: "shadcn + GSAP, equilíbrio perfeito.",
  },
  "qwik-fresh-gsap": {
    description: "Qwik ou Fresh + GSAP + Lenis. Resumability extrema + animações.",
    whenToUse: "Para performance obsessiva. Nicho high-perf.",
    siteType: "Performance obsessiva, nicho",
    examples: ["Qwik/Fresh early adopters"],
    exampleLinks: ["https://qwik.builder.io", "https://fresh.deno.dev"],
    bestFor: ["Resumability extrema", "Performance obsessiva", "Nicho"],
    performanceNote: "Resumability = zero JS hidratação inicial.",
  },
  "threejs-physics": {
    description: "Framework + Three.js + Cannon/Rapier physics + GSAP. 3D com física realista.",
    whenToUse: "Para games-like experiences, interactive product configurators.",
    siteType: "Games-like, interactive product, 3D experiences",
    examples: ["3D product configurators", "Mini-games web"],
    exampleLinks: ["https://rapier.rs", "https://pmnd.rs"],
    bestFor: ["3D com física", "Games-like", "Interactive product"],
    performanceNote: "Physics engine overhead. Otimizar para 60fps.",
  },
  "rive-webflow-sound": {
    description: "Webflow + Rive + Howler.js/Web Audio + GSAP. Animações + feedback sonoro.",
    whenToUse: "Para brand emotional com camada extra de polish sonoro.",
    siteType: "Brand emotional, premium product",
    examples: ["Brand sites com som"],
    exampleLinks: ["https://howlerjs.com", "https://rive.app"],
    bestFor: ["Animações + som", "Brand emotional", "Polish extra"],
    performanceNote: "Audio loading lazy para não afetar LCP.",
  },
  "full-custom-studio": {
    description: "Custom engine (WebGL/WebGPU) + GSAP + own scroll + shaders + audio procedural + CI/CD avançado. Tudo in-house.",
    whenToUse: "Para top 1% studios (Active Theory level). Onde se ganha Developer Award consistentemente.",
    siteType: "Top 1% studios, award-winning experimental",
    examples: ["Active Theory", "Resn", "Lusion"],
    exampleLinks: ["https://activetheory.net", "https://resn.co.nz", "https://lusion.co"],
    bestFor: ["Top 1% studios", "Active Theory level", "Developer Award"],
    performanceNote: "Tudo custom. Equipe dev dedicada. Max performance.",
  },
};

// Carregar ficheiro
const filePath = "src/lib/catalog/data/stack-combos.json";
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

let updated = 0;
let missing = 0;

// Atualizar cada combo com info
data.combos.forEach((combo: any) => {
  const info = comboInfo[combo.id];
  if (info) {
    combo.description = info.description;
    combo.whenToUse = info.whenToUse;
    combo.siteType = info.siteType;
    combo.examples = info.examples;
    combo.exampleLinks = info.exampleLinks;
    combo.bestFor = info.bestFor;
    combo.performanceNote = info.performanceNote;
    updated++;
  } else {
    console.log(`⚠️  Sem info para: ${combo.id}`);
    missing++;
  }
});

data.version = "1.4.0";

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`✓ ${updated} combos atualizados com info rica`);
console.log(`⚠️  ${missing} combos sem info`);
console.log(`✓ Total combos: ${data.combos.length}`);
console.log(`✓ Versão: ${data.version}`);
