#!/usr/bin/env python3
"""Remove fonts que não carregam em nenhum CDN do catálogo."""
import re
import os

# Fontes que FUNCIONAM (GitHub repo + Google confirmed + Fontshare confirmed + Fontsource)
# Estas ficam, as outras são removidas

# Ler fonts no GitHub repo
github_fonts = set()
font_dir = "/home/z/my-project/font-files"
for d in os.listdir(font_dir):
    full = os.path.join(font_dir, d)
    if os.path.isdir(full):
        if any(f.endswith(('.woff2', '.ttf', '.woff')) for f in os.listdir(full)):
            github_fonts.add(d)

# Ler fonts confirmadas em CDN
with open("/home/z/my-project/src/lib/font-cdns.ts") as f:
    cdn_content = f.read()

google_confirmed = set(re.findall(r'"([^"]+)"', cdn_content.split("GOOGLE_FONTS_CONFIRMED")[1].split("]);")[0]))
fontshare_confirmed = set(re.findall(r'"([^"]+)"', cdn_content.split("FONTSHARE_FONTS_CONFIRMED")[1].split("]);")[0]))

def to_slug(name):
    s = name.lower().replace(' ', '-').replace('--', '-').strip()
    s = re.sub(r'[^a-z0-9-]', '', s)
    return s

def font_works(name):
    """Verifica se a font carrega em algum CDN"""
    slug = to_slug(name)
    if slug in github_fonts:
        return True
    if name in google_confirmed:
        return True
    if name in fontshare_confirmed:
        return True
    # Fontsource tem TODAS as Google Fonts — se está em google_confirmed, Fontsource tem
    return False

# Processar cada ficheiro
files_to_clean = [
    "/home/z/my-project/src/lib/font-catalog.ts",
    "/home/z/my-project/src/lib/new-fonts-2026.ts",
    "/home/z/my-project/src/lib/scraped-fonts.ts",
]

total_removed = 0
total_kept = 0

for filepath in files_to_clean:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Encontrar todas as entradas de font (linhas com { name: "..." )
    # Padrão: { name: "FontName", ... },
    lines = content.split('\n')
    new_lines = []
    removed = 0
    kept = 0

    for line in lines:
        # Verificar se é uma linha de font
        match = re.search(r'\{ name: "([^"]+)"', line)
        if match:
            font_name = match.group(1)
            if font_works(font_name):
                new_lines.append(line)
                kept += 1
            else:
                removed += 1
                # Não adicionar a linha (remover a font)
        else:
            new_lines.append(line)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write('\n'.join(new_lines))

    print(f"{filepath.split('/')[-1]}: {kept} mantidas, {removed} removidas")
    total_removed += removed
    total_kept += kept

print(f"\nTotal: {total_kept} mantidas, {total_removed} removidas")
