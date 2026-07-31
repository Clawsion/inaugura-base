#!/usr/bin/env python3
"""
Move o bloco PREMIUM 2026 do INTEGRACOES_CATALOG (onde foi erroneamente
adicionado) para o final do SKILLS_CATALOG (onde deveria estar).
"""

FILE = "/home/z/my-project/src/lib/skills-catalog.ts"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1) Extrair o bloco PREMIUM 2026 (do comentário inicial até ao `];` final do
#    INTEGRACOES_CATALOG). O bloco começa depois da linha `app-store-reviews` e
#    antes do `];` que fecha INTEGRACOES_CATALOG.
bloco_inicio_marker = "\n  // ── PREMIUM 2026 (atualizado julho 2026 — Emil Kowalski + modernos) ──────\n"
idx_inicio = content.find(bloco_inicio_marker)
if idx_inicio == -1:
    raise SystemExit("Marca de inicio do bloco PREMIUM 2026 nao encontrada.")

# Encontrar o `];` que fecha o INTEGRACOES_CATALOG (apos o bloco)
apos_bloco_idx = content.find("\n];\n", idx_inicio)
if apos_bloco_idx == -1:
    raise SystemExit("`];` apos o bloco PREMIUM 2026 nao encontrado.")

# Partes:
parte_antes = content[:idx_inicio]
bloco_premium = content[idx_inicio:apos_bloco_idx]
parte_depois = content[apos_bloco_idx:]

# 2) Encontrar o `];` que fecha SKILLS_CATALOG (antes da definicao de Integracao).
skills_catalog_close_marker = "\n];\n\n// ============================================================================\n// INTEGRAÇÕES"
idx_skills_close = parte_antes.find(skills_catalog_close_marker)
if idx_skills_close == -1:
    raise SystemExit("Fecho do SKILLS_CATALOG nao encontrado.")

# Reconstruir:
novo_conteudo = (
    parte_antes[:idx_skills_close]
    + bloco_premium
    + "\n];\n"
    + parte_antes[idx_skills_close + 3 :]
    + parte_depois[1:]
)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(novo_conteudo)

print("OK: bloco PREMIUM 2026 movido de INTEGRACOES_CATALOG para SKILLS_CATALOG.")
print(f"  Tamanho original: {len(content)} bytes")
print(f"  Tamanho novo:     {len(novo_conteudo)} bytes")
