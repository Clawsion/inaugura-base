// ============================================================================
// expand-combos-batch2.ts — Info para os 20 combos que faltavam
// ============================================================================
import * as fs from "node:fs";

const comboInfo: Record<string, any> = {
  "ai-native": {
    description: "Vercel AI SDK nativo. Chat, streaming, tool calling out-of-the-box.",
    whenToUse: "Para AI chat apps e copilots rápidos.",
    siteType: "AI chat, copilots, AI tools",
    examples: ["Vercel AI Chat", "ChatGPT clones"],
    exampleLinks: ["https://sdk.vercel.ai/examples"],
    bestFor: ["AI chat", "Streaming", "Quick start"],
    performanceNote: "Edge runtime para AI",
  },
  "rag-powerhouse": {
    description: "RAG completo com pgvector. Search semântico em documentos.",
    whenToUse: "Para knowledge base e docs search.",
    siteType: "Knowledge base, docs AI, search",
    examples: ["Mintlify", "Inkeep"],
    exampleLinks: ["https://supabase.com/docs/guides/ai"],
    bestFor: ["RAG", "Semantic search", "Docs AI"],
    performanceNote: "pgvector nativo",
  },
  "agent-builder": {
    description: "Stack para AI agents com tools, memory, planning.",
    whenToUse: "Para AI agents autónomos.",
    siteType: "AI agents, automation",
    examples: ["AutoGPT clones", "Mastra apps"],
    exampleLinks: ["https://mastra.ai"],
    bestFor: ["Agents", "Automation", "Tools"],
    performanceNote: "Long-running tasks",
  },
  "ai-chat-app": {
    description: "Chat app completo com AI. Realtime, multi-turn, context.",
    whenToUse: "Para chatbots production.",
    siteType: "AI chat, customer support",
    examples: ["Intercom AI", "Crisp AI"],
    exampleLinks: ["https://sdk.vercel.ai/examples"],
    bestFor: ["Chat", "Realtime", "Support"],
    performanceNote: "WebSocket para realtime",
  },
  "indie-lightweight": {
    description: "Stack leve para side projects. Free tier generoso.",
    whenToUse: "Para side projects sem custo.",
    siteType: "Side projects, blogs, indie apps",
    examples: ["Indie hackers apps"],
    exampleLinks: ["https://indiehackers.com"],
    bestFor: ["Free tier", "Indie", "Side projects"],
    performanceNote: "Cloudflare free tier",
  },
  "astro-micro-saas": {
    description: "Astro para micro-SaaS. Static-first com islands interativos.",
    whenToUse: "Para micro-SaaS content-heavy.",
    siteType: "Micro-SaaS, content apps",
    examples: ["Indie Astro SaaS"],
    exampleLinks: ["https://astro.build/showcase"],
    bestFor: ["Micro-SaaS", "Content", "Performance"],
    performanceNote: "Static-first, islands seletivos",
  },
  "bun-speed-stack": {
    description: "Bun runtime para max speed. Startup <100ms.",
    whenToUse: "Para APIs high-performance.",
    siteType: "APIs, microservices, indie apps",
    examples: ["Bun demos", "Indie APIs"],
    exampleLinks: ["https://bun.sh"],
    bestFor: ["Speed", "Startup time", "APIs"],
    performanceNote: "Startup ~50ms",
  },
  "solo-founder": {
    description: "Stack otimizado para solo founders. Tudo simplificado.",
    whenToUse: "Para um só founder sem equipa.",
    siteType: "Solo SaaS, indie products",
    examples: ["Indie SaaS solo"],
    exampleLinks: ["https://indiehackers.com"],
    bestFor: ["Solo founder", "Simplicidade", "Indie"],
    performanceNote: "Tudo gerido, sem devops",
  },
  "enterprise-god-tier": {
    description: "Stack enterprise completo. SSO, audit, compliance, scale.",
    whenToUse: "Para clientes Fortune 500.",
    siteType: "Enterprise B2B, SaaS multi-org",
    examples: ["Vercel Enterprise", "Notion Enterprise"],
    exampleLinks: ["https://clerk.com/customers"],
    bestFor: ["Enterprise", "Compliance", "Scale"],
    performanceNote: "Multi-region, audit logs",
  },
  "multi-tenant-saas": {
    description: "SaaS multi-tenant com row-level security.",
    whenToUse: "Para SaaS com múltiplas organizações.",
    siteType: "B2B SaaS, multi-org",
    examples: ["Linear", "Notion"],
    exampleLinks: ["https://supabase.com/docs/guides/auth/multi-tenancy"],
    bestFor: ["Multi-tenant", "B2B", "Organizations"],
    performanceNote: "RLS no Postgres",
  },
  "corporate-dashboard": {
    description: "Dashboard corporate com charts, tables, filters.",
    whenToUse: "Para internal tools e dashboards.",
    siteType: "Internal tools, dashboards, admin",
    examples: ["Linear dashboard", "Vercel dashboard"],
    exampleLinks: ["https://tremor.so"],
    bestFor: ["Dashboards", "Internal tools", "Charts"],
    performanceNote: "TanStack Table para data-heavy",
  },
  "ecommerce-modern": {
    description: "E-commerce moderno com Next.js + Stripe.",
    whenToUse: "Para e-commerce small-medium.",
    siteType: "E-commerce, online stores",
    examples: ["Indie e-commerce"],
    exampleLinks: ["https://stripe.com/customers"],
    bestFor: ["E-commerce", "Stripe", "SMB"],
    performanceNote: "SSR + Stripe Checkout",
  },
  "headless-commerce": {
    description: "Headless commerce com CMS + Next.js frontend.",
    whenToUse: "Para e-commerce com frontend custom.",
    siteType: "E-commerce premium, custom stores",
    examples: ["Shopify Hydrogen", "Medusa"],
    exampleLinks: ["https://medusajs.com"],
    bestFor: ["Custom commerce", "Headless", "Premium"],
    performanceNote: "API-first, frontend Next.js",
  },
  "marketplace": {
    description: "Marketplace com multi-vendor, split payments.",
    whenToUse: "Para marketplaces (Etsy, Airbnb style).",
    siteType: "Marketplaces, multi-vendor",
    examples: ["Etsy clones", "Airbnb clones"],
    exampleLinks: ["https://stripe.com/connect"],
    bestFor: ["Marketplace", "Multi-vendor", "Split payments"],
    performanceNote: "Stripe Connect para split",
  },
  "python-hybrid": {
    description: "Next.js + Python backend (FastAPI). ML/AI no Python.",
    whenToUse: "Para AI apps com Python no backend.",
    siteType: "AI apps, data-heavy, ML",
    examples: ["AI products", "Data dashboards"],
    exampleLinks: ["https://fastapi.tiangolo.com"],
    bestFor: ["ML/AI", "Python ecosystem", "Data"],
    performanceNote: "Async Python, type-safe",
  },
  "django-full-stack": {
    description: "Django backend completo + Next.js frontend.",
    whenToUse: "Para apps com Django admin + ORM.",
    siteType: "Content platforms, B2B",
    examples: ["Instagram (early)", "Disqus"],
    exampleLinks: ["https://www.djangoproject.com"],
    bestFor: ["Admin panel", "ORM maduro", "Content"],
    performanceNote: "Batteries-included",
  },
  "ml-backend": {
    description: "ML backend com Python + Next.js frontend.",
    whenToUse: "Para ML pipelines e data viz.",
    siteType: "ML apps, data dashboards",
    examples: ["Hugging Face spaces", "ML demos"],
    exampleLinks: ["https://huggingface.co/spaces"],
    bestFor: ["ML", "Data viz", "Pipelines"],
    performanceNote: "GPU quando necessário",
  },
  "mobile-first": {
    description: "Mobile-first PWA com Next.js.",
    whenToUse: "Para apps web mobile-first.",
    siteType: "Mobile web apps, PWA",
    examples: ["Twitter Lite", "Pinterest PWA"],
    exampleLinks: ["https://web.dev/progressive-web-apps"],
    bestFor: ["Mobile-first", "PWA", "Installable"],
    performanceNote: "Service Worker cache",
  },
  "cross-platform-full": {
    description: "Cross-platform: web + iOS + Android com Expo.",
    whenToUse: "Para apps cross-platform.",
    siteType: "Apps mobile + web",
    examples: ["Bluesky", "Coinbase Wallet"],
    exampleLinks: ["https://expo.dev/showcase"],
    bestFor: ["Cross-platform", "iOS+Android+Web", "Code share"],
    performanceNote: "OTA updates",
  },
  "content-machine": {
    description: "Content machine com CMS + Next.js + SEO otimizado.",
    whenToUse: "Para blogs, magazines, content sites.",
    siteType: "Blogs, magazines, content",
    examples: ["Linear blog", "Vercel blog"],
    exampleLinks: ["https://sanity.io"],
    bestFor: ["Content", "SEO", "CMS"],
    performanceNote: "ISR para performance",
  },
};

const filePath = "src/lib/catalog/data/stack-combos.json";
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

let updated = 0;
data.combos.forEach((combo: any) => {
  const info = comboInfo[combo.id];
  if (info) {
    Object.assign(combo, info);
    updated++;
  }
});

data.version = "1.4.0";
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`✓ ${updated} combos atualizados nesta batch`);
console.log(`✓ Total combos com info: ${data.combos.filter((c:any) => c.description).length}/${data.combos.length}`);
