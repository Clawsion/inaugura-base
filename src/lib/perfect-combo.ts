// ============================================================================
// perfect-combo.ts — Algoritmo de matching font + cor + skin
// ============================================================================
// Gera combinações perfeitas (font + paleta + skin) com base em:
//  - Nicho detetado / tipo de site
//  - Compatibilidade tipográfica (heading + body + mono)
//  - Harmonia cromática (roles: bg, card, text, accent, muted)
//  - Estilo visual recomendado (qual skin funciona melhor)
// ============================================================================

import type { FontInfo } from "./fonts-modernas";
import { getTopAwwwardsFonts } from "./top-awwwards-fonts";
import type { Skin } from "./skins";
import { SKINS } from "./skins";

export interface PerfectCombo {
  id: string;
  nome: string;
  descricao: string;
  estilos: string[]; // ["brutalist", "minimal", "traditional", "vintage"]
  fonts: {
    heading: FontInfo;
    body: FontInfo;
    mono?: FontInfo;
  };
  paleta: {
    bg: string;
    card: string;
    text: string;
    accent: string;
    muted: string;
  };
  skin: Skin;
  razao: string; // porquê esta combo
}

// ============================================================================
// Algoritmo: para cada estilo, define font + paleta + skin compatíveis
// ============================================================================
export function generatePerfectCombos(): PerfectCombo[] {
  const topFonts = getTopAwwwardsFonts();
  const find = (family: string) => topFonts.find((f) => f.family === family) ?? topFonts[0];

  return [
    // ── 1. MODERN MINIMAL (Linear/Vercel/Stripe style) ────────────────────
    {
      id: "modern-minimal",
      nome: "Modern Minimal",
      descricao: "Limpo, técnico, confiável. Para SaaS B2B, dashboards, dev tools.",
      estilos: ["minimal", "tech", "clean"],
      fonts: {
        heading: find("Geist"),
        body: find("Inter"),
        mono: find("Geist Mono"),
      },
      paleta: {
        bg: "#08080A",
        card: "#131316",
        text: "#FAFAFC",
        accent: "#00FFB2",
        muted: "#9CA3AF",
      },
      skin: SKINS.find((s) => s.id === "mono-carbon") ?? SKINS[0],
      razao: "Geist + Inter é o stack moderno padrão da Vercel/Linear. Verde neon sobre preto = tech premium.",
    },

    // ── 2. EDITORIAL LUXURY (magazine, premium brands) ────────────────────
    {
      id: "editorial-luxury",
      nome: "Editorial Luxury",
      descricao: "Sofisticado, magazine-style. Para marcas premium, fashion, imobiliário de luxo.",
      estilos: ["traditional", "editorial", "luxury"],
      fonts: {
        heading: find("Fraunces"),
        body: find("Newsreader"),
        mono: find("IBM Plex Mono"),
      },
      paleta: {
        bg: "#1A1714",
        card: "#25221E",
        text: "#F2EBDD",
        accent: "#E08070",
        muted: "#A89E8E",
      },
      skin: SKINS.find((s) => s.id === "editorial-serif") ?? SKINS[0],
      razao: "Fraunces + Newsreader = hierarquia editorial clássica. Tons terracota/cream sobre couro escuro = luxury timeless.",
    },

    // ── 3. NEO-BRUTALIST PLAYFUL (agências criativas, startups) ───────────
    {
      id: "neo-brutalist",
      nome: "Neo-Brutalist",
      descricao: "Ousado, divertido, memorável. Para agências, portfólios, startups criativas.",
      estilos: ["brutalist", "playful", "bold"],
      fonts: {
        heading: find("Clash Display"),
        body: find("Satoshi"),
        mono: find("Space Mono"),
      },
      paleta: {
        bg: "#0A0A0A",
        card: "#1A1A1A",
        text: "#FFFFFF",
        accent: "#39FF14",
        muted: "#9CA3AF",
      },
      skin: SKINS.find((s) => s.id === "brutalist-ink") ?? SKINS[0],
      razao: "Clash Display + Satoshi = stack awwwards 2024. Verde fluorescente sobre preto + bordas brancas = impacto brutalist.",
    },

    // ── 4. WARM VINTAGE (artisanal, coffee, lifestyle) ────────────────────
    {
      id: "warm-vintage",
      nome: "Warm Vintage",
      descricao: "Caloroso, nostálgico, artesanal. Para cafés, marcas artesanais, lifestyle.",
      estilos: ["vintage", "warm", "artisanal"],
      fonts: {
        heading: find("Cormorant"),
        body: find("Lora"),
        mono: find("JetBrains Mono"),
      },
      paleta: {
        bg: "#FAF6EF",
        card: "#FFFFFF",
        text: "#1A1A1A",
        accent: "#8B1A1A",
        muted: "#6B6258",
      },
      skin: SKINS.find((s) => s.id === "editorial-serif") ?? SKINS[0],
      razao: "Cormorant + Lora = serifa vintage clássica. Vermelho bordô sobre creme = warmth artesanal.",
    },

    // ── 5. PURE LIGHT APPLE (Apple/Notion style) ──────────────────────────
    {
      id: "pure-light-apple",
      nome: "Pure Light Apple",
      descricao: "Limpo, arejado, premium light. Para produtos Apple-like, SaaS premium.",
      estilos: ["minimal", "light", "apple"],
      fonts: {
        heading: find("Plus Jakarta Sans"),
        body: find("Inter"),
        mono: find("JetBrains Mono"),
      },
      paleta: {
        bg: "#FFFFFF",
        card: "#FAFAFC",
        text: "#0F172A",
        accent: "#2563EB",
        muted: "#64748B",
      },
      skin: SKINS.find((s) => s.id === "pure-light") ?? SKINS[0],
      razao: "Plus Jakarta + Inter = stack moderno limpo. Azul cobalto sobre branco = Apple/Notion airy premium.",
    },

    // ── 6. CYBERPUNK GAMING (gaming, crypto, web3) ────────────────────────
    {
      id: "cyberpunk-gaming",
      nome: "Cyberpunk Gaming",
      descricao: "Neon, futurista, high-energy. Para gaming, crypto, web3, fintech disruptivo.",
      estilos: ["cyberpunk", "neon", "futuristic"],
      fonts: {
        heading: find("Space Grotesk"),
        body: find("Space Grotesk"),
        mono: find("JetBrains Mono"),
      },
      paleta: {
        bg: "#050505",
        card: "#1A1A1A",
        text: "#FFFFFF",
        accent: "#00FFB2",
        muted: "#888888",
      },
      skin: SKINS.find((s) => s.id === "neo-brutalist-3d") ?? SKINS[0],
      razao: "Space Grotesk = tech aesthetic awwwards. Verde neon + magenta em camadas 3D = cyberpunk energy.",
    },

    // ── 7. MONO INK LITERARY (blogs, publications, writers) ───────────────
    {
      id: "mono-ink-literary",
      nome: "Mono Ink Literary",
      descricao: "Literário, atemporal, focado em texto. Para blogs, publicações, writers.",
      estilos: ["traditional", "literary", "minimal"],
      fonts: {
        heading: find("Instrument Serif"),
        body: find("Spectral"),
        mono: find("Cousine"),
      },
      paleta: {
        bg: "#FAF7F0",
        card: "#FFFFFF",
        text: "#0A0A0A",
        accent: "#0A0A0A",
        muted: "#6B6B6B",
      },
      skin: SKINS.find((s) => s.id === "mono-ink") ?? SKINS[0],
      razao: "Instrument Serif + Spectral = readable literary perfection. Tinta sobre creme = atemporal como livros.",
    },

    // ── 8. BENTO MODERN (Apple-style bento, product showcases) ────────────
    {
      id: "bento-modern",
      nome: "Bento Modern",
      descricao: "Estruturado, visualmente rico. Para product showcases, features, Apple-style.",
      estilos: ["minimal", "bento", "structured"],
      fonts: {
        heading: find("Bricolage Grotesque"),
        body: find("DM Sans"),
        mono: find("Geist Mono"),
      },
      paleta: {
        bg: "#08080A",
        card: "#131316",
        text: "#FAFAFC",
        accent: "#00FFB2",
        muted: "#9CA3AF",
      },
      skin: SKINS.find((s) => s.id === "mono-carbon") ?? SKINS[0],
      razao: "Bricolage Grotesque + DM Sans = bento grid aesthetic. Verde neon sobre carbon = moderno estruturado.",
    },
  ];
}

// Helper: get combo by id
export function getComboById(id: string): PerfectCombo | undefined {
  return generatePerfectCombos().find((c) => c.id === id);
}

// ============================================================================
// Detetar nicho automaticamente a partir do briefing
// ============================================================================
// SKILL: STEM Calculative Problem-Solving + Visual Exploration
// Algoritmo robusto com:
//  - 30+ nichos cobertos
//  - Keywords em PT + EN + ES + FR
//  - Pesos diferenciados (keywords primárias valem mais)
//  - Score ponderado por keyword match
//  - Fallback para "SaaS B2B" se nada detetar
// ============================================================================
export function detectarNicho(briefing: string): string | null {
  if (!briefing || briefing.length < 10) return null;
  const b = briefing.toLowerCase();

  // Mapeamento de keywords → nicho (com peso)
  // peso 3 = keyword primária (muito específica)
  // peso 2 = keyword secundária
  // peso 1 = keyword genérica
  const keywords: Record<string, [string, number][]> = {
    "SaaS B2B": [
      ["saas", 3], ["b2b", 3], ["software as a service", 3],
      ["enterprise", 2], ["crm", 3], ["erp", 3], ["workflow", 2],
      ["platform", 1], ["dashboard", 2], ["tool", 1], ["subscription", 2],
      ["assintura", 2], [" plano ", 1], ["saas b2b", 3], ["gestão de equipas", 3],
      ["equipas remotas", 2], ["colaboração", 2], ["collaboration", 2],
      ["project management", 3], ["gestão de projetos", 3],
    ],
    "E-commerce Moda": [
      ["moda", 3], ["fashion", 3], ["roupa", 3], ["clothing", 3], ["apparel", 2],
      ["store", 1], ["loja de roupa", 3], ["boutique", 3], ["fashion store", 3],
      ["vestuário", 2], ["vestuario", 2], ["t-shirt", 2], ["calçado", 2],
      ["lookbook", 3], ["collection", 2], ["coleção", 2],
    ],
    "E-commerce Geral": [
      ["e-commerce", 3], ["ecommerce", 3], ["loja online", 3], ["online store", 3],
      ["shop online", 3], ["vendas online", 3], ["marketplace", 3], ["produto", 1],
      ["produtos", 1], ["carrinho", 2], ["cart", 2], ["checkout", 2],
      ["catálogo", 2], ["catalog", 2], ["payment", 1], ["pagamento", 1],
    ],
    "FinTech": [
      ["fintech", 3], ["banco", 2], ["bank", 2], ["banking", 3], ["pagamento", 2],
      ["payment", 2], ["finance", 3], ["financeiro", 3], ["financeira", 3],
      ["transfer", 2], ["transferência", 2], ["investment", 3], ["investimento", 3],
      ["trading", 3], ["carteira", 2], ["wallet", 2], ["cartão", 2], ["card", 1],
      ["iban", 3], ["mbway", 3], ["pix", 3], ["stripe", 3], ["paypal", 3],
    ],
    "HealthTech": [
      ["healthtech", 3], ["health", 2], ["saúde", 3], ["saude", 3],
      ["medical", 3], ["médico", 3], ["medico", 3], ["clinic", 3], ["clínica", 3],
      ["hospital", 3], ["consulta", 3], ["appointment", 2], ["patient", 2],
      ["doente", 2], ["diagnóstico", 3], ["diagnosis", 3], ["telemedicina", 3],
      ["telemedicine", 3], ["pharmacy", 2], ["farmácia", 2],
    ],
    "EdTech": [
      ["edtech", 3], ["education", 3], ["educação", 3], ["educacao", 3],
      ["course", 2], ["curso", 2], ["learning", 2], ["aprendizagem", 2],
      ["school", 2], ["escola", 2], ["student", 2], ["aluno", 2], ["estudante", 2],
      ["teacher", 2], ["professor", 2], ["aula", 2], ["lesson", 2],
      ["quiz", 2], ["exame", 2], ["exam", 2], ["lms", 3], ["moodle", 3],
    ],
    "Imobiliário": [
      ["imobiliário", 3], ["imobiliario", 3], ["real estate", 3], ["property", 2],
      ["propriedade", 2], ["house", 2], ["casa", 2], ["apartment", 2],
      ["apartamento", 2], ["terreno", 2], ["land", 1], ["venda", 1],
      ["arrendamento", 3], ["rent", 2], ["lease", 2], ["agência imobiliária", 3],
    ],
    "Restaurantes / Food": [
      ["restaurante", 3], ["restaurant", 3], ["food", 2], ["comida", 2],
      ["menu", 2], ["chef", 3], ["culinary", 3], ["gastronomy", 3],
      ["gastronomia", 3], ["cozinha", 2], ["kitchen", 2], ["receita", 2],
      ["recipe", 2], ["delivery food", 3], ["takeaway", 2], ["reservation", 2],
      ["reserva", 2], ["pizza", 3], ["burger", 3], ["café", 3], ["cafe", 2],
    ],
    "Viagens & Turismo": [
      ["travel", 3], ["viagens", 3], ["turismo", 3], ["tourism", 3],
      ["hotel", 3], ["booking", 2], ["reserva de hotel", 3], ["vacation", 2],
      ["férias", 2], ["ferias", 2], ["destination", 2], ["destino", 2],
      ["tour", 2], ["guia", 1], ["guide", 1], ["airline", 3], ["companhia aérea", 3],
      ["cruzeiro", 3], ["cruise", 3],
    ],
    "Agência Criativa": [
      ["agência", 3], ["agencia", 3], ["agency", 3], ["creative agency", 3],
      ["criativa", 2], ["creative", 2], ["studio", 2], ["design studio", 3],
      ["branding", 3], ["brand identity", 3], ["identidade visual", 3],
      ["marketing agency", 3], ["publicidade", 2], ["advertising", 2],
    ],
    "Portfólio Pessoal": [
      ["portfolio", 3], ["portfólio", 3], ["pessoal", 2], ["personal", 2],
      ["freelancer", 3], ["freelance", 3], ["designer", 2], ["developer", 2],
      ["programador", 2], ["photographer", 3], ["fotógrafo", 3], ["fotografo", 3],
      ["artist", 2], ["artista", 2], ["writer", 2], ["escritor", 2],
      ["about me", 3], ["sobre mim", 3],
    ],
    "Blog / Media": [
      ["blog", 3], ["media", 2], ["notícias", 3], ["noticias", 3], ["news", 3],
      ["article", 2], ["artigo", 2], ["magazine", 3], ["revista", 3],
      ["journalism", 3], ["jornalismo", 3], ["publishing", 2], ["editorial", 2],
      ["newsletter", 2], ["podcast", 3], ["youtube", 2], ["content creator", 3],
    ],
    "Gaming": [
      ["game", 2], ["gaming", 3], ["jogo", 2], ["jogos", 2], ["gamer", 3],
      ["esports", 3], ["play", 1], ["stream", 2], ["twitch", 3], ["steam", 3],
      ["playstation", 3], ["xbox", 3], ["nintendo", 3], ["gameplay", 3],
      ["rpg", 3], ["mmorpg", 3], ["fps", 3], ["indie game", 3],
    ],
    "Crypto / Web3": [
      ["crypto", 3], ["web3", 3], ["blockchain", 3], ["nft", 3], ["token", 2],
      ["defi", 3], ["wallet", 2], ["metamask", 3], ["ethereum", 3], ["bitcoin", 3],
      ["solidity", 3], ["smart contract", 3], ["contrato inteligente", 3],
      ["dao", 3], ["dapp", 3], ["mint", 2], ["staking", 3], ["exchange", 1],
    ],
    "Mobilidade": [
      ["mobilidade", 3], ["mobility", 3], ["transport", 2], ["transporte", 2],
      ["ride", 2], ["uber", 3], ["bolt", 3], ["vehicle", 2], ["carro", 1],
      ["car sharing", 3], ["scooter", 3], ["bicicleta", 2], ["bike", 2],
      ["moto", 2], ["motorcycle", 2], ["taxi", 3], ["condutor", 2], ["driver", 2],
    ],
    "Logística": [
      ["logística", 3], ["logistica", 3], ["logistics", 3], ["shipping", 3],
      ["envio", 2], ["delivery", 2], ["entrega", 2], ["supply chain", 3],
      ["cadeia de abastecimento", 3], ["warehouse", 3], ["armazém", 3],
      ["freight", 3], ["frete", 3], ["carga", 2], ["cargo", 2], ["fleet", 2],
      ["frota", 2], ["tracking", 2], ["rastreamento", 2],
    ],
    "Energia / Sustentabilidade": [
      ["energia", 3], ["energy", 3], ["solar", 3], ["photovoltaic", 3],
      ["fotovoltaico", 3], ["sustentabilidade", 3], ["sustainability", 3],
      ["green", 2], ["renewable", 3], ["renovável", 3], ["eco", 2],
      ["climate", 2], ["clima", 2], ["carbon", 2], ["carbono", 2],
      ["recycling", 3], ["reciclagem", 3], ["wind", 2], ["eólica", 3],
    ],
    "Fitness / Wellness": [
      ["fitness", 3], ["gym", 3], ["ginásio", 3], ["ginasio", 3], ["workout", 3],
      ["treino", 3], ["exercício", 2], ["exercise", 2], ["yoga", 3], ["pilates", 3],
      ["health club", 3], ["personal trainer", 3], ["crossfit", 3], ["musculação", 3],
      ["bodybuilding", 3], ["cardio", 2], ["meditation", 2], ["meditação", 2],
    ],
    "Beleza / Cosmética": [
      ["beleza", 3], ["beauty", 3], ["cosmética", 3], ["cosmetica", 3],
      ["cosmetic", 3], ["makeup", 3], ["maquilhagem", 3], ["maquiagem", 3],
      ["skincare", 3], ["salon", 2], ["salão", 2], ["salao", 2],
      ["barber", 3], ["barbeiro", 3], ["cabelo", 2], ["hair", 2],
      ["perfume", 3], ["fragrância", 2], ["spa", 3],
    ],
    "Imobiliário de Luxo": [
      ["luxo", 3], ["luxury", 3], ["premium", 2], ["exclusive", 2],
      ["high-end", 3], ["mansion", 3], ["penthouse", 3], ["villa", 3],
      ["mansão", 3], ["casa de luxo", 3], ["imóvel de luxo", 3],
      ["luxury real estate", 3], ["concierge", 3],
    ],
    "Advocacia / Jurídico": [
      ["advocacia", 3], ["law", 2], ["jurídico", 3], ["juridico", 3],
      ["lawyer", 3], ["advogado", 3], ["legal", 2], ["attorney", 3],
      ["solicitor", 3], ["notary", 3], ["notário", 3], ["tribunal", 2],
      ["court", 2], ["contrato", 2], ["contract", 2], ["compliance", 3],
      ["direito", 2], ["law firm", 3], ["escritório de advocacia", 3],
    ],
    "Consultoria": [
      ["consultoria", 3], ["consulting", 3], ["consultant", 3], ["consultor", 3],
      ["advisory", 3], ["strategy", 2], ["estratégia", 2], ["estrategia", 2],
      ["business consulting", 3], ["management consulting", 3],
      ["transformation", 2], ["m&a", 3], ["fusões", 2],
    ],
    "Manufatura / Indústria": [
      ["manufatura", 3], ["manufacturing", 3], ["indústria", 3], ["industria", 3],
      ["factory", 2], ["fábrica", 2], ["fabrica", 2], ["production", 2],
      ["produção", 2], ["producao", 2], ["assembly", 2], ["montagem", 2],
      ["cnc", 3], ["machining", 2], ["industrial", 2], ["plastic", 1],
      ["metal", 1], ["textile", 2], ["têxtil", 2],
    ],
    "ONG / Impacto Social": [
      ["ong", 3], ["ngo", 3], ["impacto social", 3], ["social impact", 3],
      ["charity", 3], ["solidário", 3], ["solidario", 3], ["nonprofit", 3],
      ["fundação", 3], ["foundation", 3], ["donation", 2], ["doação", 2],
      ["doacao", 2], ["volunteer", 2], ["voluntário", 2], ["voluntario", 2],
      ["humanitarian", 3], ["humanitária", 3],
    ],
    // NOVOS nichos
    "Imobiliário Comercial": [
      ["escritório", 2], ["office", 2], ["comercial", 2], ["commercial", 2],
      ["coworking", 3], ["co-working", 3], ["business center", 3],
      ["centro de negócios", 3], ["loja comercial", 3], ["store front", 2],
      ["retail space", 3], ["galpão", 2], ["warehouse commercial", 3],
    ],
    "Pet / Veterinário": [
      ["pet", 3], ["veterinário", 3], ["veterinario", 3], ["veterinary", 3],
      ["animal", 2], ["cão", 2], ["cao", 2], ["dog", 2], ["cat", 2], ["gato", 2],
      ["pet shop", 3], ["petstore", 3], ["grooming", 2], ["banho", 1],
      ["adoption", 2], ["adoção", 2], ["adocao", 2], ["kennel", 3],
    ],
    "Casamentos / Eventos": [
      ["casamento", 3], ["wedding", 3], ["noiva", 3], ["bride", 3],
      ["noivo", 3], ["groom", 3], ["evento", 2], ["event", 2], ["events", 2],
      ["eventos", 2], ["party", 2], ["festa", 2], ["celebração", 2],
      ["celebration", 2], ["catering", 3], ["buffet", 3], ["venue", 2],
      ["espaço para eventos", 3], ["wedding planner", 3],
    ],
    "Arquitetura / Construção": [
      ["arquitetura", 3], ["arquitectura", 3], ["architecture", 3],
      ["construção", 3], ["construcao", 3], ["construction", 3],
      ["engenharia civil", 3], ["civil engineering", 3], ["obra", 2],
      ["building", 2], ["architect", 2], ["arquiteto", 2], ["arquitecto", 2],
      ["blueprint", 2], ["projeto", 1], ["project", 1], ["contractor", 3],
      ["empreiteira", 3],
    ],
    "Música / Audio": [
      ["música", 3], ["musica", 3], ["music", 3], ["band", 2], ["banda", 2],
      ["album", 3], ["streaming music", 3], ["spotify", 2], ["soundcloud", 3],
      ["podcast audio", 2], ["audio production", 3], ["produção musical", 3],
      ["musician", 2], ["músico", 2], ["musico", 2], ["concert", 2],
      ["concerto", 2], ["festival", 2], ["dj", 3], ["beatmaker", 3],
    ],
    "Educação Infantil": [
      ["infantil", 3], ["children", 2], ["crianças", 3], ["criancas", 3],
      ["kids", 2], ["kid", 2], ["preschool", 3], ["pré-escola", 3],
      ["pre-escola", 3], ["nursery", 3], ["berçário", 3], ["bercario", 3],
      ["childcare", 3], ["creche", 3], ["playground", 2], ["toy", 2],
      ["brinquedo", 2], ["pedagogia", 3], ["pedagogy", 3],
    ],
    "Automóvel": [
      ["automóvel", 3], ["automovel", 3], ["automobile", 3], ["auto", 2],
      ["car dealership", 3], ["concessionário", 3], ["concessionario", 3],
      ["car sale", 3], ["venda de carros", 3], ["used cars", 3],
      ["carros usados", 3], ["automotive", 3], ["mecânico", 3], ["mecanico", 3],
      ["auto repair", 3], ["oficina", 2], ["garage", 2], ["car parts", 3],
    ],
    "Saúde Mental": [
      ["saúde mental", 3], ["saude mental", 3], ["mental health", 3],
      ["psychology", 3], ["psicologia", 3], ["therapist", 3], ["terapeuta", 3],
      ["therapy", 3], ["terapia", 3], ["counseling", 3], ["aconselhamento", 3],
      ["mindfulness", 3], ["meditation app", 3], ["psicólogo", 3], ["psicologo", 3],
      ["psychiatrist", 3], ["psiquiatra", 3], ["depression", 1], ["ansiedade", 1],
    ],
    "Agricultura / Agro": [
      ["agricultura", 3], ["agriculture", 3], ["agro", 3], ["farm", 3],
      ["fazenda", 3], ["farming", 3], ["crop", 2], ["cultura", 1],
      ["harvest", 2], ["colheita", 2], ["livestock", 3], ["gado", 2],
      ["organic farming", 3], ["agricultura orgânica", 3], ["tractor", 2],
      ["irrigation", 2], ["irrigação", 2], ["agritech", 3],
    ],
  };

  // Calcular score ponderado por nicho
  const scores: Record<string, number> = {};
  for (const [nicho, kws] of Object.entries(keywords)) {
    let score = 0;
    for (const [kw, peso] of kws) {
      // Keyword com espaços precisa de match exato
      // Keywords sem espaços podem ser substrings
      if (kw.includes(" ") || kw.length > 4) {
        if (b.includes(kw)) score += peso;
      } else {
        // Para keywords curtas, usa word boundary para evitar falsos positivos
        const regex = new RegExp(`\\b${kw}\\b`, "i");
        if (regex.test(b)) score += peso;
      }
    }
    if (score > 0) scores[nicho] = score;
  }

  // Retornar o nicho com maior score (mínimo 2 para evitar falsos positivos)
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0 && sorted[0][1] >= 2) {
    return sorted[0][0];
  }
  // Fallback: se há algum match mas fraco, retorna o primeiro
  if (sorted.length > 0) {
    return sorted[0][0];
  }
  return null;
}

// ============================================================================
// Mapear nicho → combo recomendada
// ============================================================================
export function getComboForNicho(nicho: string): PerfectCombo {
  const combos = generatePerfectCombos();
  const map: Record<string, string> = {
    "SaaS B2B": "modern-minimal",
    "E-commerce Moda": "editorial-luxury",
    "E-commerce Geral": "modern-minimal",
    "FinTech": "modern-minimal",
    "HealthTech": "warm-vintage",
    "EdTech": "bento-modern",
    "Imobiliário": "editorial-luxury",
    "Restaurantes / Food": "warm-vintage",
    "Viagens & Turismo": "editorial-luxury",
    "Agência Criativa": "neo-brutalist",
    "Portfólio Pessoal": "mono-ink-literary",
    "Blog / Media": "mono-ink-literary",
    "Gaming": "cyberpunk-gaming",
    "Crypto / Web3": "cyberpunk-gaming",
    "Mobilidade": "modern-minimal",
    "Logística": "bento-modern",
    "Energia / Sustentabilidade": "pure-light-apple",
    "Fitness / Wellness": "neo-brutalist",
    "Beleza / Cosmética": "editorial-luxury",
    "Imobiliário de Luxo": "editorial-luxury",
    "Advocacia / Jurídico": "mono-ink-literary",
    "Consultoria": "bento-modern",
    "Manufatura / Indústria": "bento-modern",
    "ONG / Impacto Social": "warm-vintage",
  };
  const comboId = map[nicho] ?? "modern-minimal";
  return combos.find((c) => c.id === comboId) ?? combos[0];
}
