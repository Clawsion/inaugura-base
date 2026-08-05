#!/usr/bin/env python3
"""Limpa e filtra fonts extraídas, removendo duplicados com fonts existentes."""
import json
import re

# Carregar fonts extraídas
with open("/tmp/fonts-extracted.json", "r", encoding="utf-8") as f:
    extracted = json.load(f)

# Carregar fonts existentes do catálogo
existing_names = set()
with open("/home/z/my-project/src/lib/font-catalog.ts", "r", encoding="utf-8") as f:
    content = f.read()
for match in re.finditer(r'name:\s*"([^"]+)"', content):
    existing_names.add(match.group(1).lower())

# Carregar fonts do new-fonts-2026.ts
with open("/home/z/my-project/src/lib/new-fonts-2026.ts", "r", encoding="utf-8") as f:
    new_content = f.read()
for match in re.finditer(r'name:\s*"([^"]+)"', new_content):
    existing_names.add(match.group(1).lower())

print(f"Fonts existentes no catálogo: {len(existing_names)}")

# Padrões de nomes inválidos para filtrar
INVALID_PATTERNS = [
    r'^\d+$',  # só números
    r'^\d+\.\d+',  # versões (3.0.255)
    r'^0x',  # hex
    r'^[a-f0-9]{6,}$',  # hash hex
    r'Toggle|Switch|Navigation|Menu|Search|Home|About|Contact|Category|Tag|Page',
    r'Cookie|Privacy|Terms|Subscribe|Newsletter',
    r'Load More|View All|Next|Previous',
    r'All Font|Font Categories',
    r'^[a-z]$',  # só 1 letra
    r'^\W+$',  # só símbolos
]

def is_valid_name(name):
    if not name or len(name) < 2 or len(name) > 50:
        return False
    for pattern in INVALID_PATTERNS:
        if re.search(pattern, name, re.IGNORECASE):
            return False
    return True

def clean_name(name):
    # Remover tags HTML residuais
    clean = re.sub(r'<[^>]+>', '', name).strip()
    # Remover sufixos de descrição
    clean = re.sub(r'\s*[-–—|]\s*.*$', '', clean)
    # Remover "Font" suffix se for redundante
    clean = re.sub(r'\s+Font$', '', clean, flags=re.IGNORECASE)
    # Remover números no início
    clean = re.sub(r'^\d+\s*', '', clean)
    # Strip
    clean = clean.strip(' "\'.,;:!?()[]{}–—')
    # Capitalizar primeira letra de cada palavra
    if clean:
        clean = ' '.join(word.capitalize() if not word.isupper() else word for word in clean.split())
    return clean

# Processar e filtrar
final = {}
total_new = 0
total_skipped = 0

for site, fonts in extracted.items():
    cleaned_fonts = []
    seen = set()

    for name in fonts:
        clean = clean_name(name)

        if not is_valid_name(clean):
            total_skipped += 1
            continue

        # Verificar duplicado com fonts existentes
        if clean.lower() in existing_names:
            total_skipped += 1
            continue

        # Verificar duplicado dentro do mesmo site
        if clean.lower() in seen:
            total_skipped += 1
            continue

        seen.add(clean.lower())
        cleaned_fonts.append(clean)
        total_new += 1

    final[site] = sorted(cleaned_fonts)

# Guardar
with open("/tmp/fonts-clean.json", "w", encoding="utf-8") as f:
    json.dump(final, f, ensure_ascii=False, indent=2)

print(f"\n✓ Limpeza completa")
print(f"Total novas fonts: {total_new}")
print(f"Total filtradas (inválidas/duplicadas): {total_skipped}")
print()
for site, fonts in final.items():
    print(f"  {site}: {len(fonts)} fonts novas")
    if fonts:
        print(f"    Exemplos: {fonts[:5]}")
