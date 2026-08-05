#!/usr/bin/env python3
"""Remove o bloco do popup Special do SimpleForge.tsx (linhas 1464-1568)."""
path = "/home/z/my-project/src/components/forms/SimpleForge.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Identificar as linhas exatas
# Linha 1464 (index 1463): "      {/* ═══════════════════════════════════════════════════════════════════ */}"
# Linha 1567 (index 1566): "      </AnimatePresence>"
# Linha 1568 (index 1567): ""

# Confirmar
print(f"Line 1464: {lines[1463].rstrip()!r}")
print(f"Line 1465: {lines[1464].rstrip()!r}")
print(f"Line 1466: {lines[1465].rstrip()!r}")
print(f"Line 1467: {lines[1466].rstrip()!r}")
print(f"Line 1567: {lines[1566].rstrip()!r}")
print(f"Line 1568: {lines[1567].rstrip()!r}")
print(f"Line 1569: {lines[1568].rstrip()!r}")

# Verificar que é o bloco certo
assert "POPUP SPECIAL" in lines[1464], f"Expected POPUP SPECIAL in line 1465, got: {lines[1464]!r}"
assert "</AnimatePresence>" in lines[1566], f"Expected </AnimatePresence> in line 1567, got: {lines[1566]!r}"

# Remover linhas 1464 a 1568 (inclusive) = indices 1463 a 1567
new_lines = lines[:1463] + lines[1568:]

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"\n✓ Removed lines 1464-1568 ({1568 - 1464 + 1} lines)")
print(f"File now has {len(new_lines)} lines (was {len(lines)})")
