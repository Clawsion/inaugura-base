// ============================================================================
// fonts-modernas.ts — Catálogo de 1500+ fonts (Google + Fontshare + curadas)
// ============================================================================
// Three-tier strategy:
//  1. CURATED: 45 fonts à mão (sempre disponíveis, com metadados ricos)
//  2. GOOGLE DYNAMIC: ~1500 fonts fetched at runtime from
//     https://fonts.google.com/metadata/fonts (public, no auth)
//  3. FONTSHARE: 40+ premium ITF fonts
//
// SKILL: Google Fonts CSS2 API + Fontshare API — loaders dinâmicos via <link>
// ============================================================================

export type FontCategory = "sans" | "serif" | "mono" | "geist" | "awwwards" | "display" | "handwriting";
export type FontSource = "google" | "fontshare";

// NOTA: PAID_FONT_CLONES (em font-sources-catalog.ts) é usado APENAS para
// sugestões no upload. Não cria entradas no catálogo de fonts — as alternatives
// referenciam families REAIS de FONTS_MODERNAS + Google dynamic.
// Isto garante que não há duplicados no picker.

export interface FontInfo {
  nome: string;
  family: string; // nome CSS exato para font-family
  categoria: FontCategory[];
  source: FontSource;
  pesos: number[];
  italic?: boolean;
  awwwards?: boolean;
}

// ----------------------------------------------------------------------------
// LISTA CURADA — 45 fonts modernas
// ----------------------------------------------------------------------------
export const FONTS_MODERNAS: FontInfo[] = [
  // ── SANS TOP-TIER (as melhores para websites de topo 2026) ──────────────
  { nome: "Inter", family: "Inter", categoria: ["sans"], source: "google", pesos: [100,200,300,400,500,600,700,800,900], italic: true },
  { nome: "Plus Jakarta Sans", family: "Plus Jakarta Sans", categoria: ["sans"], source: "google", pesos: [200,300,400,500,600,700,800], italic: true },
  { nome: "Outfit", family: "Outfit", categoria: ["sans"], source: "google", pesos: [100,200,300,400,500,600,700,800,900] },
  { nome: "Sora", family: "Sora", categoria: ["sans"], source: "google", pesos: [100,200,300,400,500,600,700,800] },
  { nome: "Space Grotesk", family: "Space Grotesk", categoria: ["sans", "awwwards"], source: "google", pesos: [300,400,500,600,700], awwwards: true },
  { nome: "Manrope", family: "Manrope", categoria: ["sans"], source: "google", pesos: [200,300,400,500,600,700,800] },
  { nome: "Figtree", family: "Figtree", categoria: ["sans", "awwwards"], source: "google", pesos: [300,400,500,600,700,800,900], awwwards: true },
  { nome: "Albert Sans", family: "Albert Sans", categoria: ["sans"], source: "google", pesos: [100,200,300,400,500,600,700,800,900] },
  { nome: "Onest", family: "Onest", categoria: ["sans", "awwwards"], source: "google", pesos: [100,200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Bricolage Grotesque", family: "Bricolage Grotesque", categoria: ["sans", "awwwards"], source: "google", pesos: [200,300,400,500,600,700,800], awwwards: true },
  { nome: "Instrument Sans", family: "Instrument Sans", categoria: ["sans", "awwwards"], source: "google", pesos: [400,500,600,700], awwwards: true },
  { nome: "Lexend", family: "Lexend", categoria: ["sans"], source: "google", pesos: [100,200,300,400,500,600,700,800,900] },
  { nome: "DM Sans", family: "DM Sans", categoria: ["sans"], source: "google", pesos: [100,200,300,400,500,600,700,800,900], italic: true },
  { nome: "Hanken Grotesk", family: "Hanken Grotesk", categoria: ["sans"], source: "google", pesos: [100,200,300,400,500,600,700,800,900], italic: true },
  // NOVAS — top awwwards sans
  { nome: "Schibsted Grotesk", family: "Schibsted Grotesk", categoria: ["sans", "awwwards"], source: "google", pesos: [400,500,600,700,800,900], awwwards: true },
  { nome: "Unbounded", family: "Unbounded", categoria: ["sans", "awwwards"], source: "google", pesos: [200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Anton", family: "Anton", categoria: ["sans", "awwwards"], source: "google", pesos: [400], awwwards: true },
  { nome: "Be Vietnam Pro", family: "Be Vietnam Pro", categoria: ["sans"], source: "google", pesos: [100,200,300,400,500,600,700,800,900], italic: true },
  { nome: "Mona Sans", family: "Mona Sans", categoria: ["sans", "awwwards"], source: "google", pesos: [200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Hubot Sans", family: "Hubot Sans", categoria: ["sans", "awwwards"], source: "google", pesos: [200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Geist", family: "Geist", categoria: ["geist", "sans"], source: "google", pesos: [100,200,300,400,500,600,700,800,900] },

  // ── GEIST (ecossistema Vercel) ──────────────────────────────────────────
  { nome: "Geist Mono", family: "Geist Mono", categoria: ["geist", "mono"], source: "google", pesos: [100,200,300,400,500,600,700,800,900] },

  // ── SERIF TOP-TIER (editoriais premium, awwwards) ───────────────────────
  { nome: "Fraunces", family: "Fraunces", categoria: ["serif", "awwwards"], source: "google", pesos: [100,200,300,400,500,600,700,800,900], italic: true, awwwards: true },
  { nome: "Newsreader", family: "Newsreader", categoria: ["serif", "awwwards"], source: "google", pesos: [200,300,400,500,600,700,800], italic: true, awwwards: true },
  { nome: "Instrument Serif", family: "Instrument Serif", categoria: ["serif", "awwwards"], source: "google", pesos: [400], italic: true, awwwards: true },
  { nome: "DM Serif Display", family: "DM Serif Display", categoria: ["serif"], source: "google", pesos: [400], italic: true },
  { nome: "Playfair Display", family: "Playfair Display", categoria: ["serif"], source: "google", pesos: [400,500,600,700,800,900], italic: true },
  { nome: "Lora", family: "Lora", categoria: ["serif"], source: "google", pesos: [400,500,600,700], italic: true },
  { nome: "Cormorant", family: "Cormorant", categoria: ["serif", "awwwards"], source: "google", pesos: [300,400,500,600,700], italic: true, awwwards: true },
  { nome: "Spectral", family: "Spectral", categoria: ["serif"], source: "google", pesos: [200,300,400,500,600,700,800], italic: true },
  // NOVAS — top serif editoriais
  { nome: "PT Serif", family: "PT Serif", categoria: ["serif"], source: "google", pesos: [400,700], italic: true },
  { nome: "Source Serif 4", family: "Source Serif 4", categoria: ["serif", "awwwards"], source: "google", pesos: [200,300,400,500,600,700,800,900], italic: true, awwwards: true },
  { nome: "Crimson Pro", family: "Crimson Pro", categoria: ["serif"], source: "google", pesos: [200,300,400,500,600,700,800,900], italic: true },
  { nome: "Libre Caslon Display", family: "Libre Caslon Display", categoria: ["serif", "awwwards"], source: "google", pesos: [400], awwwards: true },
  { nome: "Libre Caslon Text", family: "Libre Caslon Text", categoria: ["serif"], source: "google", pesos: [400,700], italic: true },
  { nome: "Marcellus", family: "Marcellus", categoria: ["serif", "awwwards"], source: "google", pesos: [400], awwwards: true },
  { nome: "Cardo", family: "Cardo", categoria: ["serif"], source: "google", pesos: [400,700], italic: true },
  { nome: "EB Garamond", family: "EB Garamond", categoria: ["serif"], source: "google", pesos: [400,500,600,700,800], italic: true },

  // ── MONO TOP-TIER ───────────────────────────────────────────────────────
  { nome: "JetBrains Mono", family: "JetBrains Mono", categoria: ["mono"], source: "google", pesos: [100,200,300,400,500,600,700,800], italic: true },
  { nome: "Fira Code", family: "Fira Code", categoria: ["mono"], source: "google", pesos: [300,400,500,600,700] },
  { nome: "IBM Plex Mono", family: "IBM Plex Mono", categoria: ["mono"], source: "google", pesos: [100,200,300,400,500,600,700], italic: true },
  { nome: "Space Mono", family: "Space Mono", categoria: ["mono", "awwwards"], source: "google", pesos: [400,700], italic: true, awwwards: true },
  { nome: "Source Code Pro", family: "Source Code Pro", categoria: ["mono"], source: "google", pesos: [200,300,400,500,600,700,800,900], italic: true },
  // NOVAS — top mono
  { nome: "Roboto Mono", family: "Roboto Mono", categoria: ["mono"], source: "google", pesos: [100,200,300,400,500,600,700], italic: true },
  { nome: "Cousine", family: "Cousine", categoria: ["mono"], source: "google", pesos: [400,700], italic: true },
  { nome: "Inconsolata", family: "Inconsolata", categoria: ["mono"], source: "google", pesos: [200,300,400,500,600,700,800,900] },

  // ── DISPLAY TOP-TIER (para headlines impactantes) ───────────────────────
  { nome: "Bebas Neue", family: "Bebas Neue", categoria: ["display", "awwwards"], source: "google", pesos: [400], awwwards: true },
  { nome: "Archivo Black", family: "Archivo Black", categoria: ["display", "awwwards"], source: "google", pesos: [900], awwwards: true },
  { nome: "Big Shoulders Display", family: "Big Shoulders Display", categoria: ["display", "awwwards"], source: "google", pesos: [100,200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Syne", family: "Syne", categoria: ["display", "awwwards"], source: "google", pesos: [400,500,600,700,800], awwwards: true },
  { nome: "Climate Crisis", family: "Climate Crisis", categoria: ["display", "awwwards"], source: "google", pesos: [200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Anybody", family: "Anybody", categoria: ["display", "awwwards"], source: "google", pesos: [100,200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Tasa Explorer", family: "Tasa Explorer", categoria: ["display", "awwwards"], source: "google", pesos: [400,500,600,700,800,900], awwwards: true },
  { nome: "Bagel Fat One", family: "Bagel Fat One", categoria: ["display", "awwwards"], source: "google", pesos: [400], awwwards: true },

  // ── AWWWARDS EXCLUSIVAS (via Fontshare — premium gratuitas ITF) ─────────
  { nome: "Clash Display", family: "Clash Display", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [200,300,400,500,600,700], awwwards: true },
  { nome: "Cabinet Grotesk", family: "Cabinet Grotesk", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [100,200,300,400,500,700,800,900], awwwards: true },
  { nome: "General Sans", family: "General Sans", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [200,300,400,500,600,700], awwwards: true },
  { nome: "Satoshi", family: "Satoshi", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [300,400,500,700,900], awwwards: true },
  { nome: "Argent", family: "Argent", categoria: ["serif", "awwwards"], source: "fontshare", pesos: [400,500,600,700], awwwards: true },
  { nome: "Migra", family: "Migra", categoria: ["serif", "awwwards"], source: "fontshare", pesos: [400,500,600,700,800,900], awwwards: true },
  { nome: "Boska", family: "Boska", categoria: ["serif", "awwwards"], source: "fontshare", pesos: [300,400,500,600,700,800,900], awwwards: true },
  { nome: "Panch", family: "Panch", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [400,500,600,700,800,900], awwwards: true },
  { nome: "Suprith", family: "Suprith", categoria: ["serif", "awwwards"], source: "fontshare", pesos: [400,500,600,700], italic: true, awwwards: true },
  { nome: "Zentry", family: "Zentry", categoria: ["serif", "awwwards"], source: "fontshare", pesos: [400,500,600,700], italic: true, awwwards: true },
  // NOVAS — Fontshare premium top-tier
  { nome: "Author", family: "Author", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [100,200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "SWitzer", family: "SWitzer", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [100,200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Pretendard", family: "Pretendard", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [100,200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Rival Sans", family: "Rival Sans", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [100,200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Clash Grotesk", family: "Clash Grotesk", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [200,300,400,500,600,700], awwwards: true },
  { nome: "Bonvoy", family: "Bonvoy", categoria: ["serif", "awwwards"], source: "fontshare", pesos: [200,300,400,500,600,700,800,900], italic: true, awwwards: true },
  { nome: "Chillax", family: "Chillax", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [200,300,400,500,600,700], awwwards: true },
  { nome: "Lexend Zetta", family: "Lexend Zetta", categoria: ["display", "awwwards"], source: "fontshare", pesos: [100,200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Excon", family: "Excon", categoria: ["display", "awwwards"], source: "fontshare", pesos: [100,200,300,400,500,600,700,800,900], awwwards: true },
  { nome: "Meclight", family: "Meclight", categoria: ["sans", "awwwards"], source: "fontshare", pesos: [400,500,600,700], awwwards: true },
  { nome: "Boser", family: "Boser", categoria: ["serif", "awwwards"], source: "fontshare", pesos: [400,500,600,700], italic: true, awwwards: true },
];

// ----------------------------------------------------------------------------
// FILTROS DISPONÍVEIS no UI
// ----------------------------------------------------------------------------
export const FONT_FILTERS: { id: string; label: string; desc: string }[] = [
  { id: "todos", label: "Todos", desc: "Todas as fonts (Google + Fontshare)" },
  { id: "awwwards", label: "Top Sites", desc: "As melhores para websites de topo" },
  { id: "sans", label: "Sans", desc: "Apenas sans-serif" },
  { id: "serif", label: "Serif", desc: "Apenas serif (incl. editoriais)" },
  { id: "mono", label: "Mono", desc: "Apenas monospaced" },
  { id: "display", label: "Display", desc: "Headlines impactantes" },
  { id: "geist", label: "Geist", desc: "Ecossistema Geist (Vercel)" },
];

// ----------------------------------------------------------------------------
// Loader dinâmico — carrega uma font via <link> tag
// ----------------------------------------------------------------------------
const loadedFonts = new Set<string>();

export async function loadFont(font: FontInfo): Promise<void> {
  const key = `${font.family}-${font.source}`;
  if (loadedFonts.has(key)) return;
  loadedFonts.add(key);

  if (font.source === "google") {
    const family = font.family.replace(/\s+/g, "+");
    const wght = font.pesos.join(";");
    const italicPart = font.italic ? `,ital,wght@0,${wght};1,${wght}` : `:wght@${wght}`;
    const href = `https://fonts.googleapis.com/css2?family=${family}${italicPart}&display=swap`;
    appendLink(key, href);
  } else if (font.source === "fontshare") {
    const family = font.family.toLowerCase().replace(/\s+/g, "-");
    const wght = font.pesos.join(",");
    const href = `https://api.fontshare.com/v2/css?f[]=${family}@${wght}&display=swap`;
    appendLink(key, href);
  }

  // Aguarda a font estar disponível
  try {
    await (document as any).fonts?.load(`400 16px "${font.family}"`);
  } catch {
    // ignora — a font pode não estar ainda pronta, mas o link está carregado
  }
}

function appendLink(id: string, href: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// ----------------------------------------------------------------------------
// Helper: escolher font aleatória por filtro
// ----------------------------------------------------------------------------
export function getRandomFontByFilter(filtro: string, exclude?: string): FontInfo {
  let pool = FONTS_MODERNAS;
  if (filtro !== "todos") {
    pool = FONTS_MODERNAS.filter((f) => f.categoria.includes(filtro as FontCategory));
  }
  if (exclude) {
    pool = pool.filter((f) => f.family !== exclude);
  }
  if (pool.length === 0) return FONTS_MODERNAS[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ----------------------------------------------------------------------------
// Helper: obter CSS stack para uma font
// ----------------------------------------------------------------------------
export function fontStackFor(font: FontInfo | string): string {
  const family = typeof font === "string" ? font : font.family;
  // Fallback inteligente baseado na categoria
  const info = typeof font === "string" ? FONTS_MODERNAS.find((f) => f.family === font) : font;
  const isMono = info?.categoria.includes("mono");
  const isSerif = info?.categoria.includes("serif");
  if (isMono) return `"${family}", ui-monospace, monospace`;
  if (isSerif) return `"${family}", Georgia, serif`;
  return `"${family}", var(--font-inter), system-ui, sans-serif`;
}

// ----------------------------------------------------------------------------
// PESOS — labels amigáveis
// ----------------------------------------------------------------------------
export const PESOS_LABELS: Record<number, string> = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

export const PESOS_DISPONIVEIS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

// ============================================================================
// CATÁLOGO DINÂMICO — 1500+ fonts do Google Fonts
// ============================================================================
// Fetch runtime de https://fonts.google.com/metadata/fonts (endpoint público,
// sem auth). Retorna JSON com todas as fonts Google (~1500).
// Cada entry: { family, category, subsets, variants, ... }
//
// Estratégia:
//  - CURATED (45) sempre disponíveis offline
//  - Dinâmico fetch incrementa para 1500+ quando online
//  - Merge: mantém metadados ricos das curadas, adiciona as dinâmicas
// ============================================================================

let dynamicCatalogCache: FontInfo[] | null = null;
let dynamicFetchPromise: Promise<FontInfo[]> | null = null;

/**
 * Busca o catálogo dinâmico do Google Fonts (1500+ fonts).
 * Usa proxy server-side (/api/fonts-catalog) para contornar CORS.
 * Cache em memória. Se o fetch falhar, retorna array vazio.
 */
export async function fetchGoogleFontsCatalog(): Promise<FontInfo[]> {
  if (dynamicCatalogCache) return dynamicCatalogCache;
  if (dynamicFetchPromise) return dynamicFetchPromise;

  dynamicFetchPromise = (async () => {
    try {
      // Proxy server-side para contornar CORS do Google Fonts metadata.
      const res = await fetch("/api/fonts-catalog", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const fonts: FontInfo[] = (json.familyMetadataList ?? json ?? []).map(
        (f: any) => {
          const family: string = f.family ?? f.name ?? "";
          const category: string = (f.category ?? "sans-serif").toLowerCase();

          // NOVO: o metadata do Google tem "fonts" como DICT onde as chaves
          // são os pesos (ex: {"100": {...}, "200": {...}, ...}).
          // Antes procurávamos "variants" que não existe — agora extraímos de "fonts".
          const fontsDict = f.fonts ?? {};
          const allWeights: string[] = Array.isArray(fontsDict)
            ? fontsDict.map((ft: any) => String(ft.weight ?? ""))
            : Object.keys(fontsDict);

          const pesos: number[] = allWeights
            .filter((w) => /^\d+$/.test(w))
            .map((w) => parseInt(w, 10))
            .filter((n) => PESOS_DISPONIVEIS.includes(n));
          if (pesos.length === 0) pesos.push(400);

          // Italic: procuramos em "axes" se há eixo "ital" ou slant != 0
          const axes = f.axes ?? [];
          const hasItalicAxis = Array.isArray(axes) && axes.some((a: any) => a.tag === "ital" || (a.tag === "slant" && a.max > 0));
          const italic = hasItalicAxis;

          const cat: FontCategory[] = [];
          if (category.includes("sans")) cat.push("sans");
          if (category.includes("serif")) cat.push("serif");
          if (category.includes("monospace")) cat.push("mono");
          if (category.includes("display")) cat.push("display");
          if (category.includes("handwriting")) cat.push("handwriting");
          if (cat.length === 0) cat.push("sans");
          return {
            nome: family,
            family,
            categoria: cat,
            source: "google" as FontSource,
            pesos: Array.from(new Set(pesos)).sort((a, b) => a - b),
            italic,
          };
        }
      );
      dynamicCatalogCache = fonts;
      return fonts;
    } catch (err) {
      console.warn("[fonts-modernas] fetchGoogleFontsCatalog failed:", err);
      dynamicCatalogCache = [];
      return [];
    } finally {
      dynamicFetchPromise = null;
    }
  })();

  return dynamicFetchPromise;
}

/**
 * Retorna o catálogo completo: curadas (45) + dinâmicas Google (1500+).
 * SEM duplicados — cada family aparece UMA vez.
 */
export async function getAllFonts(): Promise<FontInfo[]> {
  const dynamic = await fetchGoogleFontsCatalog();
  const curatedFamilies = new Set(FONTS_MODERNAS.map((f) => f.family));
  const dynamicUnique = dynamic.filter((f) => !curatedFamilies.has(f.family));
  return [...FONTS_MODERNAS, ...dynamicUnique];
}

/**
 * Helper: escolher font aleatória por filtro + source (async, usa catálogo completo)
 */
export async function getRandomFontByFilterAsync(
  filtro: string,
  source: string, // "todos" | "google" | "fontshare"
  exclude?: string
): Promise<FontInfo> {
  let pool = await getAllFonts();
  if (filtro !== "todos") {
    pool = pool.filter((f) => f.categoria.includes(filtro as FontCategory));
  }
  if (source !== "todos") {
    pool = pool.filter((f) => f.source === source);
  }
  if (exclude) {
    pool = pool.filter((f) => f.family !== exclude);
  }
  if (pool.length === 0) {
    // Fallback para as curadas
    pool = FONTS_MODERNAS;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Conta quantas fonts estão disponíveis por source (para mostrar no UI).
 */
export async function countFontsBySource(): Promise<{ total: number; google: number; fontshare: number; curated: number }> {
  const all = await getAllFonts();
  return {
    total: all.length,
    google: all.filter((f) => f.source === "google").length,
    fontshare: all.filter((f) => f.source === "fontshare").length,
    curated: FONTS_MODERNAS.length,
  };
}
