#!/usr/bin/env python3
"""Adiciona as novas fonts do Fontshare ao catálogo."""
import re

# Novas fonts Fontshare descarregadas
NEW_FONTS = [
    ("Kihim", "Display, Awwwards"),
    ("Synonym", "Sans, Premium"),
    ("Comico", "Display, Playful"),
    ("Gambarino", "Display, Bold"),
    ("Rowan", "Serif, Editorial"),
    ("Tabular", "Mono, Tech"),
    ("Expose", "Display, Bold"),
    ("Boxing", "Display, Sport"),
    ("Striper", "Display, Bold"),
    ("Pilcrow Rounded", "Sans, Rounded"),
    ("New Title", "Display, Editorial"),
    ("Alpino", "Sans, Geometric"),
    ("Amulya", "Sans, Modern"),
    ("Array", "Sans, Tech"),
    ("Bespoke Sans", "Sans, Premium"),
    ("Bespoke Slab", "Slab, Editorial"),
    ("Bespoke Stencil", "Display, Stencil"),
    ("Chubbo", "Sans, Rounded"),
    ("Britney", "Display, Bold"),
    ("Bonny", "Serif, Elegant"),
    ("Bevellier", "Display, Premium"),
    ("Kola", "Display, Bold"),
    ("Excon", "Sans, Tech"),
    ("Hoover", "Sans, Display"),
    ("Roundo", "Sans, Rounded"),
    ("Panchang", "Sans, Devanagari"),
    ("Neco", "Display, Bold"),
    ("Pramukh Rounded", "Sans, Rounded"),
    ("Paquito", "Display, Bold"),
    ("Sharpie", "Display, Handwritten"),
    ("Styro", "Sans, Tech"),
    ("Stardom", "Display, Bold"),
    ("Trench Slab", "Slab, Bold"),
    ("Quilon", "Serif, Editorial"),
    ("Zina", "Display, Bold"),
    ("Rosaline", "Display, Elegant"),
    ("Segment", "Mono, Tech"),
    ("Recia", "Serif, Editorial"),
    ("Plein", "Display, Bold"),
    ("RX100", "Display, Tech"),
]

# Ler font-catalog.ts para verificar duplicados
with open("/home/z/my-project/src/lib/font-catalog.ts") as f:
    existing = f.read()
existing_names = set(re.findall(r'name: "([^"]+)"', existing))

# Gerar entradas TypeScript
lines = []
added = 0
for name, desc in NEW_FONTS:
    if name in existing_names:
        continue
    
    # Determinar categoria
    cat = "sans"
    if any(w in desc.lower() for w in ["mono", "tabular", "segment"]):
        cat = "mono"
    elif any(w in desc.lower() for w in ["serif", "slab", "editorial"]):
        cat = "serif"
    elif any(w in desc.lower() for w in ["display", "bold", "stencil", "handwritten"]):
        cat = "display"
    
    # Determinar siteType
    if "Awwwards" in desc:
        site_type = '["Awwwards", "Premium"]'
    elif "Premium" in desc:
        site_type = '["Premium", "Modern"]'
    elif "Editorial" in desc:
        site_type = '["Editorial", "Magazine"]'
    elif "Tech" in desc:
        site_type = '["Tech", "Dev"]'
    elif "Rounded" in desc:
        site_type = '["Friendly", "Modern"]'
    else:
        site_type = '["Modern", "Display"]'
    
    slug = name.lower().replace(" ", "-")
    lines.append(f'  {{ name: "{name}", source: "Fontshare", category: "{cat}", foundry: "Fontshare", siteType: {site_type}, license: "free", personality: "{desc} — Fontshare premium" }},')
    added += 1

# Adicionar ao font-catalog.ts antes do fecho do array
insert_point = existing.find("  // ════════════════════════════════════════════════════════════════════════\n  // SCRAPED FONTS")
if insert_point == -1:
    insert_point = existing.find("...SCRAPED_FONTS")

if insert_point != -1:
    new_content = existing[:insert_point] + "\n  // ─── NOVAS FONTS FONTSHARE (Awwwards premium) ─────────────────────\n" + "\n".join(lines) + "\n\n" + existing[insert_point:]
    with open("/home/z/my-project/src/lib/font-catalog.ts", "w") as f:
        f.write(new_content)
    print(f"✓ {added} novas fonts adicionadas ao catálogo")
else:
    print("✗ Não encontrou ponto de inserção")
