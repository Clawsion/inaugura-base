#!/usr/bin/env python3
"""
Remove entradas duplicadas do SKILLS_CATALOG.
Mantém a PRIMEIRA ocorrência de cada ID, remove as duplicadas.
"""

import re

FILE = "/home/z/my-project/src/lib/skills-catalog.ts"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Encontra todos os blocos de skill (object literals com id: "...")
# Cada bloco começa com `  {` numa linha própriaria e termina com `  },`
# Vamos usar uma abordagem mais simples: encontrar todos os IDs e suas posições

# Pattern: encontra blocos completos de skill
# Um bloco é: { id: "...", ... },
skill_block_pattern = re.compile(
    r'^\s*\{\s*\n\s*id:\s*"([^"]+)",\s*\n.*?^\s*\},?\s*$',
    re.MULTILINE | re.DOTALL
)

# Alternativa mais simples: encontrar todas as posições de `id: "..."` e
# determinar o bloco completo que contém cada uma
lines = content.split("\n")

# Encontra todas as linhas com `id: "..."` e os blocos que as contêm
# Um bloco começa com `  {` (sozinho numa linha) e termina com `  },` ou `  }`
block_starts = []  # (line_index, id)
for i, line in enumerate(lines):
    if re.match(r'^\s*\{\s*$', line):
        # Verifica se a próxima linha não-vazia tem `id:`
        for j in range(i + 1, min(i + 5, len(lines))):
            m = re.match(r'^\s*id:\s*"([^"]+)",?\s*$', lines[j])
            if m:
                block_starts.append((i, m.group(1)))
                break

# Para cada bloco, encontra o fechamento `  },` ou `  }`
blocks = []  # (start, end, id)
for start, skill_id in block_starts:
    # Encontra o fechamento: primeira linha após start que é `  },` ou `  }`
    # (assumindo indentação de 2 espaços)
    for i in range(start + 1, len(lines)):
        if re.match(r'^\s*\},?\s*$', lines[i]) and i > start:
            blocks.append((start, i, skill_id))
            break

print(f"Encontrados {len(blocks)} blocos de skill")

# Encontra duplicados
seen_ids = set()
duplicates = []
for start, end, skill_id in blocks:
    if skill_id in seen_ids:
        duplicates.append((start, end, skill_id))
    else:
        seen_ids.add(skill_id)

print(f"Encontrados {len(duplicates)} duplicados:")
for start, end, skill_id in duplicates:
    print(f"  id={skill_id} linhas {start+1}-{end+1}")

# Remove os duplicados (do fim para o início para não afetar os índices)
lines_to_remove = set()
for start, end, skill_id in duplicates:
    for i in range(start, end + 1):
        lines_to_remove.add(i)

new_lines = [line for i, line in enumerate(lines) if i not in lines_to_remove]
new_content = "\n".join(new_lines)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"\nRemovidas {len(lines_to_remove)} linhas ({len(duplicates)} entradas duplicadas).")
print(f"Tamanho original: {len(content)} bytes")
print(f"Tamanho novo: {len(new_content)} bytes")
