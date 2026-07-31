#!/usr/bin/env python3
"""
Teste exaustivo da Server Action generateProject.
Testa CADA parâmetro do formulário isoladamente + combos completas.
Simula exatamente o que o browser envia (incluindo headers de proxy).
"""

import json
import urllib.request
import urllib.error
import re
import time
import sys

BASE_URL = "http://localhost:3000"

def get_action_id():
    """Extrai o action ID real do chunk JS onde generateProject está definido."""
    html = urllib.request.urlopen(f"{BASE_URL}/", timeout=30).read().decode("utf-8")
    # Busca todos os chunks src_app_*._
    chunks = re.findall(r'(/_next/static/chunks/src_app_[a-z0-9_]+\._\.js)', html)
    for chunk in chunks:
        url = f"{BASE_URL}{chunk}"
        content = urllib.request.urlopen(url, timeout=15).read().decode("utf-8")
        # Pattern Turbopack: createServerReference)("HASH", ..., "generateProject")
        m = re.search(r'createServerReference[^)]*\)\("([a-f0-9]{40,64})"[^)]*"generateProject"', content)
        if m:
            return m.group(1)
    # Fallback: any createServerReference in any src_app chunk
    for chunk in chunks:
        url = f"{BASE_URL}{chunk}"
        content = urllib.request.urlopen(url, timeout=15).read().decode("utf-8")
        m = re.search(r'createServerReference[^)]*\)\("([a-f0-9]{40,64})"', content)
        if m:
            return m.group(1)
    return None


def call_action(form_values, label=""):
    """Chama a Server Action com headers de proxy simulados."""
    action_id = get_action_id()
    if not action_id:
        return {"ok": False, "error": "Não foi possível obter action ID", "label": label}

    boundary = "----testboundary12345"
    body_parts = [
        f"--{boundary}",
        f'Content-Disposition: form-data; name="1_$ACTION_REF_"',
        "",
        action_id,
        f"--{boundary}",
        f'Content-Disposition: form-data; name="1_$ACTION_1:0"',
        "",
        json.dumps([form_values]),
        f"--{boundary}",
        f'Content-Disposition: form-data; name="0"',
        "",
        json.dumps([form_values]),
        f"--{boundary}--",
        "",
    ]
    body = "\r\n".join(body_parts).encode("utf-8")

    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Next-Action": action_id,
        "Accept": "text/x-component",
        "Origin": "https://preview-chat-ce9c7347-e84c-4f4b-a9e8-b9c6b1ee749c.space-z.ai",
        "X-Forwarded-Host": "ws-abaac-fceeaf-ogxipghktr.cn-hongkong-vpc.fcapp.run",
        "X-Forwarded-Proto": "https",
        "Host": "localhost:3000",
        "User-Agent": "Mozilla/5.0 (test)",
        "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8",
    }

    req = urllib.request.Request(
        f"{BASE_URL}/",
        data=body,
        headers=headers,
        method="POST",
    )

    start = time.time()
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            status = resp.status
            body_resp = resp.read().decode("utf-8", errors="replace")
            elapsed = time.time() - start
            # Extrai o JSON da resposta flight
            # Formato: ":N123.4\n0:{...}\n1:{...}\n"
            json_str = None
            for line in body_resp.split("\n"):
                if line.startswith("1:"):
                    json_str = line[2:]
                    break
            try:
                parsed = json.loads(json_str) if json_str else None
            except json.JSONDecodeError:
                parsed = None
            return {
                "ok": status == 200 and parsed and parsed.get("ok") is True,
                "status": status,
                "elapsed_s": round(elapsed, 1),
                "data": parsed,
                "raw": body_resp[:300] if status != 200 else "",
                "label": label,
            }
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        elapsed = time.time() - start
        return {
            "ok": False,
            "status": e.code,
            "elapsed_s": round(elapsed, 1),
            "raw": err_body[:300],
            "label": label,
        }
    except Exception as e:
        elapsed = time.time() - start
        return {
            "ok": False,
            "status": 0,
            "elapsed_s": round(elapsed, 1),
            "raw": str(e)[:300],
            "label": label,
        }


def make_form(**overrides):
    """FormValues base com todos os campos obrigatórios."""
    base = {
        "briefing": "Plataforma SaaS B2B para gestão de equipas remotas. Público: CTOs e Head of Ops de startups Series A-B. Tom: confiante, técnico mas acessível.",
        "nicho": "SaaS B2B",
        "siteType": "single-page",
        "seccoes": ["Hero", "Features", "CTA", "Footer"],
        "efeitos": ["Reveal on scroll", "Smooth scroll"],
        "paletaMode": "auto",
        "paletaManual": [],
        "typographyMode": "auto",
        "typographyManual": {"heading": "", "body": "", "mono": ""},
        "promptMode": "compact",
        "nivel": "mvp",
        "idioma": "pt",
        "incluirMockups": False,
        "incluirDesignTokens": True,
        "incluirRoadmap": False,
        "skinsSelecionados": [],
        "selectedSkills": [],
        "selectedIntegrations": [],
        "selectedDesignVisual": [],
        "fontsPlayground": [],
        "referencias": [],
        "funcionalidadesEspeciais": [],
        "conteudoTextos": False,
        "conteudoTextosObs": "",
        "conteudoVideos": False,
        "conteudoVideosObs": "",
    }
    base.update(overrides)
    return base


def print_result(r, label=""):
    status_icon = "✅" if r.get("ok") else "❌"
    print(f"{status_icon} [{label or r.get('label', '')}] HTTP {r.get('status')} em {r.get('elapsed_s', '?')}s")
    if not r.get("ok"):
        print(f"   raw: {r.get('raw', '')[:200]}")
        if r.get("data") and r["data"].get("error"):
            print(f"   error: {r['data']['error'][:300]}")


# ============================================================================
# TESTES — cada parâmetro isolado
# ============================================================================

print("=" * 70)
print("TESTE 1: Form mínimo (todos os campos base)")
print("=" * 70)
r = call_action(make_form(), "form-mínimo")
print_result(r, "form-mínimo")

print()
print("=" * 70)
print("TESTE 2: Briefing curto (< 20 chars) — deve dar erro de validação")
print("=" * 70)
r = call_action(make_form(briefing="oi"), "briefing-curto")
print_result(r, "briefing-curto")

print()
print("=" * 70)
print("TESTE 3: Paleta manual (4 cores)")
print("=" * 70)
r = call_action(make_form(
    paletaMode="manual",
    paletaManual=[
        {"nome": "Background", "hex": "#0A0A0B", "uso": "Fundo principal"},
        {"nome": "Card", "hex": "#141416", "uso": "Superfícies"},
        {"nome": "Accent", "hex": "#00E5A0", "uso": "CTAs"},
        {"nome": "Text", "hex": "#F4F4F5", "uso": "Texto"},
    ],
), "paleta-manual")
print_result(r, "paleta-manual")

print()
print("=" * 70)
print("TESTE 4: Tipografia manual")
print("=" * 70)
r = call_action(make_form(
    typographyMode="manual",
    typographyManual={"heading": "Geist", "body": "Inter", "mono": "Geist Mono"},
), "typography-manual")
print_result(r, "typography-manual")

print()
print("=" * 70)
print("TESTE 5: promptMode extended (com fases)")
print("=" * 70)
r = call_action(make_form(promptMode="extended"), "prompt-extended")
print_result(r, "prompt-extended")

print()
print("=" * 70)
print("TESTE 6: Nível production")
print("=" * 70)
r = call_action(make_form(nivel="production"), "nivel-production")
print_result(r, "nivel-production")

print()
print("=" * 70)
print("TESTE 7: Idioma en")
print("=" * 70)
r = call_action(make_form(idioma="en"), "idioma-en")
print_result(r, "idioma-en")

print()
print("=" * 70)
print("TESTE 8: Com skins selecionados")
print("=" * 70)
r = call_action(make_form(skinsSelecionados=["mono-ink", "brutalist-ink"]), "skins")
print_result(r, "skins")

print()
print("=" * 70)
print("TESTE 9: Com fonts playground (5 slots)")
print("=" * 70)
r = call_action(make_form(fontsPlayground=[
    {"fonte": "Inter", "pesos": [400, 700]},
    {"fonte": "Geist", "pesos": [400, 600]},
    {"fonte": "Plus Jakarta Sans", "pesos": [400, 700]},
]), "fonts-playground")
print_result(r, "fonts-playground")

print()
print("=" * 70)
print("TESTE 10: Com skills + integrações selecionadas")
print("=" * 70)
r = call_action(make_form(
    selectedSkills=["shadcn-ui", "motion", "sonner"],
    selectedIntegrations=["stripe", "posthog"],
), "skills-integrations")
print_result(r, "skills-integrations")

print()
print("=" * 70)
print("TESTE 11: Com design visual + referências")
print("=" * 70)
r = call_action(make_form(
    selectedDesignVisual=["Bento Grid", "Glassmorphism"],
    referencias=["https://linear.app", "https://vercel.com"],
), "design-visual")
print_result(r, "design-visual")

print()
print("=" * 70)
print("TESTE 12: Com incluir mockups + design tokens + roadmap")
print("=" * 70)
r = call_action(make_form(
    incluirMockups=True,
    incluirDesignTokens=True,
    incluirRoadmap=True,
), "full-extras")
print_result(r, "full-extras")

print()
print("=" * 70)
print("TESTE 13: Com funcionalidades especiais + conteúdo")
print("=" * 70)
r = call_action(make_form(
    funcionalidadesEspeciais=["Multi-idioma", "Dark mode", "PWA"],
    conteudoTextos=True,
    conteudoTextosObs="Preciso de textos para hero e features",
    conteudoVideos=True,
    conteudoVideosObs="Catálogo de 10 produtos",
), "funcionalidades")
print_result(r, "funcionalidades")

print()
print("=" * 70)
print("TESTE 14: siteType ecommerce")
print("=" * 70)
r = call_action(make_form(
    siteType="ecommerce",
    nicho="E-commerce Moda",
    seccoes=["Hero", "Product Grid", "Cart", "Checkout", "Footer"],
), "ecommerce")
print_result(r, "ecommerce")

print()
print("=" * 70)
print("TESTE 15: siteType dashboard")
print("=" * 70)
r = call_action(make_form(
    siteType="dashboard",
    nicho="SaaS B2B",
    seccoes=["Dashboard", "Auth", "Settings", "Profile"],
), "dashboard")
print_result(r, "dashboard")

print()
print("=" * 70)
print("RESUMO")
print("=" * 70)
# (os resultados já foram imprimidos acima)
