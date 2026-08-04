// ============================================================================
// add-awwwards-combos.ts — Script para adicionar 25 combos Awwwards top-tier
// ============================================================================
import * as fs from "node:fs";

const newCombos = [
  {
    id: "god-tier-creative",
    name: "God Tier Creative",
    category: "awwwards",
    badge: "awwwards",
    stack: "Nuxt 3/4 + GSAP full (ScrollTrigger, SplitText, Flip, Observer) + Lenis + Three.js/custom WebGL + Tailwind + Sanity",
    tags: ["Hardcore Agência", "SOTY", "3D Imersivo", "Storytelling"],
  },
  {
    id: "soty-nocode-king",
    name: "SOTY No-Code King",
    category: "awwwards",
    badge: "awwwards",
    stack: "Webflow Enterprise + GSAP custom + Rive + WebGL/Three.js embed + Figma",
    tags: ["No-Code Premium", "Lando Norris style", "Visual + Code"],
  },
  {
    id: "react-immersive",
    name: "React Immersive",
    category: "awwwards",
    badge: "recommended",
    stack: "Next.js + GSAP + Lenis + React Three Fiber (R3F) + Drei + Tailwind + Vercel",
    tags: ["Portfolios", "Agências React", "App-like"],
  },
  {
    id: "trionn-architecture",
    name: "Trionn Architecture",
    category: "awwwards",
    badge: "awwwards",
    stack: "React/Next + GSAP full + Three.js (raw) + Lenis + Web Audio API + Tailwind + SplitText",
    tags: ["Studio high-end", "Codrops case", "Render loop control"],
  },
  {
    id: "vanilla-mastery",
    name: "Vanilla Mastery",
    category: "awwwards",
    badge: "developer",
    stack: "HTML/CSS/JS puro + GSAP + custom WebGL engine + Lenis + shaders GLSL + Barba.js",
    tags: ["Max performance", "Developer Award", "Active Theory style"],
  },
  {
    id: "astro-performance",
    name: "Astro Performance",
    category: "awwwards",
    badge: "speed",
    stack: "Astro + Islands (Vue/React/Svelte) + GSAP + Lenis + Three.js + Tailwind",
    tags: ["Ultra-rápido", "Lighthouse 100", "Editorial premium"],
  },
  {
    id: "svelte-fluid",
    name: "Svelte Fluid",
    category: "awwwards",
    stack: "SvelteKit + GSAP + Lenis + Threlte (Three.js) + Tailwind",
    tags: ["Reatividade nativa", "Leve", "Modern"],
  },
  {
    id: "webflow-advanced-motion",
    name: "Webflow + Advanced Motion",
    category: "awwwards",
    stack: "Webflow + Rive + GSAP + Lottie + custom code",
    tags: ["Brand", "Athlete", "Product"],
  },
  {
    id: "nuxt-pure-story",
    name: "Nuxt Pure Story",
    category: "awwwards",
    badge: "awwwards",
    stack: "Nuxt + GSAP ScrollTrigger + Lenis + SplitText + Barba.js / View Transitions + Sanity",
    tags: ["Narrativa scroll", "Page transitions", "Editorial"],
  },
  {
    id: "next-r3f-pro",
    name: "Next + R3F Pro",
    category: "awwwards",
    stack: "Next.js + R3F + GSAP + Lenis + postprocessing + shaders + Zustand",
    tags: ["3D React", "Product configurators", "Immersive"],
  },
  {
    id: "hybrid-headless-ecom",
    name: "Hybrid Headless E-commerce",
    category: "awwwards",
    stack: "Next/Nuxt + Shopify Hydrogen ou Sanity/Payload + GSAP + Three.js + Tailwind",
    tags: ["Luxury e-commerce", "3D product", "Marcas high-end"],
  },
  {
    id: "rive-centric",
    name: "Rive-Centric",
    category: "awwwards",
    stack: "Webflow ou Next + Rive (principal) + GSAP secundário + Three.js leve",
    tags: ["State machines", "Mobile-first", "Pós-Lando"],
  },
  {
    id: "framer-motion-hybrid",
    name: "Framer Motion Hybrid",
    category: "awwwards",
    badge: "recommended",
    stack: "Next.js + Framer Motion + GSAP (scroll pesado) + Lenis + Tailwind",
    tags: ["Micro-interações", "Apps criativas", "Mais acessível"],
  },
  {
    id: "custom-webgl-engine",
    name: "Custom WebGL Engine",
    category: "awwwards",
    badge: "developer",
    stack: "Vanilla ou framework leve + custom WebGL/WebGPU + GSAP + Lenis",
    tags: ["Particles", "Distortion", "Generative", "Lusion style"],
  },
  {
    id: "nuxt-pinia-gsap",
    name: "Vue/Nuxt + Pinia + GSAP",
    category: "awwwards",
    stack: "Nuxt + Pinia + GSAP full + Lenis + Three.js",
    tags: ["State robusto", "Apps complexas", "3D"],
  },
  {
    id: "wp-headless-premium",
    name: "WordPress Headless Premium",
    category: "awwwards",
    stack: "Next/Nuxt + WP GraphQL ou Faust + GSAP + Lenis + Three.js",
    tags: ["Cliente não-técnico", "CMS fácil", "Award-winning"],
  },
  {
    id: "svelte-threlte-gsap",
    name: "Svelte + Threlte + GSAP",
    category: "awwwards",
    stack: "SvelteKit + Threlte + GSAP + Lenis",
    tags: ["3D Svelte-native", "Leveza", "Experimental"],
  },
  {
    id: "astro-react-3d-islands",
    name: "Astro + React Islands 3D",
    category: "awwwards",
    badge: "speed",
    stack: "Astro + R3F islands + GSAP + Lenis",
    tags: ["Static + 3D", "Performance monstro", "Portfolios"],
  },
  {
    id: "webflow-custom-heavy",
    name: "Webflow + Custom Code Heavy",
    category: "awwwards",
    stack: "Webflow + muito JS custom (GSAP/Three) + Memberstack ou similar",
    tags: ["No-code base", "Dev avançado", "Time-to-market"],
  },
  {
    id: "plain-barba-gsap",
    name: "Plain + Barba + GSAP",
    category: "awwwards",
    stack: "HTML/JS + Barba.js + GSAP + Lenis + Three.js",
    tags: ["Transições perfeitas", "Zero framework", "Cinematic"],
  },
  {
    id: "next-tailwind-shadcn-gsap",
    name: "Next + Tailwind + shadcn + GSAP",
    category: "awwwards",
    badge: "recommended",
    stack: "Next + Tailwind + shadcn/ui + GSAP + Lenis",
    tags: ["SaaS criativo", "Portfolios", "Design system rápido"],
  },
  {
    id: "qwik-fresh-gsap",
    name: "Qwik ou Fresh + GSAP",
    category: "awwwards",
    badge: "speed",
    stack: "Qwik/Fresh + GSAP + Lenis",
    tags: ["Resumability extrema", "Performance obsessiva", "Nicho"],
  },
  {
    id: "threejs-physics",
    name: "Three.js + Physics (Cannon/Rapier)",
    category: "awwwards",
    stack: "Framework + Three.js + Cannon/Rapier physics + GSAP",
    tags: ["3D com física", "Games-like", "Interactive product"],
  },
  {
    id: "rive-webflow-sound",
    name: "Rive + Webflow + Sound",
    category: "awwwards",
    stack: "Webflow + Rive + Howler.js / Web Audio + GSAP",
    tags: ["Animações + som", "Brand emotional", "Polish extra"],
  },
  {
    id: "full-custom-studio",
    name: "Full Custom Studio Stack",
    category: "awwwards",
    badge: "developer",
    stack: "Custom engine (WebGL/WebGPU) + GSAP + own scroll + shaders + audio procedural + CI/CD avançado",
    tags: ["Top 1% studios", "Active Theory level", "Developer Award"],
  },
];

// Carregar combos existentes
const filePath = "src/lib/catalog/data/stack-combos.json";
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Filtrar combos awwwards que ainda não existem (evitar duplicados)
const existingIds = new Set(data.combos.map((c: any) => c.id));
const toAdd = newCombos.filter((c) => !existingIds.has(c.id));

console.log(`Combos existentes: ${data.combos.length}`);
console.log(`Novos a adicionar: ${toAdd.length}`);

// Adicionar novos combos
data.combos.push(...toAdd);
data.version = "1.3.0";

// Escrever de volta
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`✓ Total agora: ${data.combos.length}`);
console.log(`✓ Versão: ${data.version}`);
console.log("");
console.log("Novos combos Awwwards adicionados:");
toAdd.forEach((c) => {
  console.log(`  - ${c.id.padEnd(30)} | ${c.name}`);
});
