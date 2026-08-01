#!/usr/bin/env python3
"""
Testa a Server Action simulando exatamente o cenário que falhava:
- Origin: https://preview-chat-ce9c7347-xxx.space-z.ai (browser)
- X-Forwarded-Host: ws-abaac-fceeaf-ogxipghktr.cn-hongkong-vpc.fcapp.run (proxy Alibaba FC)
- Host: localhost:3000
- Content-Type: multipart/form-data (Server Actions usam isto)
- Next-Action header com action ID

Antes da correção: HTTP 500 "Invalid Server Actions request"
Depois da correção: deve passar pelo check CSRF e tentar executar a action
"""

import re
import sys
import urllib.request

# 1. Fetch homepage to discover the action ID
print("=== PASSO 1: buscar homepage e descobrir Action ID ===")
req = urllib.request.Request("http://localhost:3000/")
html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8")
print(f"  Homepage: {len(html)} bytes")

# Server Actions em Next 16 geram um hash de 32-64 hex chars como action ID
# Ele aparece no HTML dentro de "$ACTION_ID_..." ou em chunks JS
action_ids = set(re.findall(r'\$ACTION_ID_([a-f0-9]{32,64})', html))
if not action_ids:
    # Try a different pattern - the action ID is in the inline script
    action_ids = set(re.findall(r'"([a-f0-9]{40,64})"', html))

if not action_ids:
    # Look in the JS chunks
    js_chunks = re.findall(r'src="(/_next/static/chunks/[^"]+\.js)"', html)
    print(f"  JS chunks found: {len(js_chunks)}")
    for chunk in js_chunks[:5]:
        url = f"http://localhost:3000{chunk}"
        try:
            chunk_content = urllib.request.urlopen(url, timeout=10).read().decode("utf-8")
            ids_in_chunk = set(re.findall(r'"([a-f0-9]{40,64})"', chunk_content))
            action_ids.update(ids_in_chunk)
            if ids_in_chunk:
                print(f"    {chunk}: found {len(ids_in_chunk)} IDs")
                break
        except Exception as e:
            print(f"    {chunk}: error {e}")

print(f"  Total Action IDs found: {len(action_ids)}")
if not action_ids:
    print("  ERROR: No action IDs found!")
    sys.exit(1)

action_id = list(action_ids)[0]
print(f"  Using Action ID: {action_id}")

# 2. Simular o POST à Server Action com headers de proxy
print("\n=== PASSO 2: POST à Server Action com headers de proxy ===")

# Boundary para multipart/form-data
boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
# FormValues mínimo (com briefing válido)
form_values = {
    "briefing": "Estou a criar uma plataforma SaaS B2B para gestão de equipas remotas. O público-alvo são CTOs e Head of Ops de startups em fase Series A-B. Tom deve ser confiante, técnico mas acessível.",
    "nicho": "SaaS B2B",
    "siteType": "single-page",
    "seccoes": ["Hero", "Features", "CTA", "Footer"],
    "efeitos": ["Reveal on scroll", "Smooth scroll"],
    "paletaMode": "auto",
    "typographyMode": "auto",
    "promptMode": "compact",
    "nivel": "mvp",
    "idioma": "pt",
    "incluirMockups": "true",
    "incluirDesignTokens": "true",
    "incluirRoadmap": "false",
    "skinsSelecionados": [],
    "selectedSkills": [],
    "selectedIntegrations": [],
    "selectedDesignVisual": [],
    "fontsPlayground": [],
    "paletaManual": [],
    "referencias": [],
    "funcionalidadesEspeciais": [],
    "conteudoTextos": "false",
    "conteudoVideos": "false",
}

# Construir body multipart
body_parts = []
# Server Action args são enviados como array na chave "1"
import json
body_parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"1_$ACTION_REF_\"\r\n\r\n{action_id}")
body_parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"1_$ACTION_1:0\"\r\n\r\n{json.dumps([form_values])}")
form_values_json = json.dumps(form_values)
body_parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"0\"\r\n\r\n[{form_values_json}]")
body_parts.append(f"--{boundary}--\r\n")
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
    "http://localhost:3000/",
    data=body,
    headers=headers,
    method="POST",
)

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        status = resp.status
        resp_body = resp.read().decode("utf-8", errors="replace")
        print(f"  HTTP Status: {status}")
        print(f"  Response: {resp_body[:500]}")
        if status == 200:
            print("\n✅ SUCESSO: A Server Action passou no check CSRF e executou!")
        else:
            print(f"\n⚠️  Status {status} — ver logs acima")
except urllib.error.HTTPError as e:
    err_body = e.read().decode("utf-8", errors="replace")
    print(f"  HTTP Error: {e.code}")
    print(f"  Response: {err_body[:500]}")
    if "Invalid Server Actions" in err_body:
        print("\n❌ AINDA FALHA: 'Invalid Server Actions request' persiste")
    else:
        print(f"\n⚠️  Erro diferente (pode ser esperado se a action executou mas falhou internamente)")
except Exception as e:
    print(f"  Exception: {e}")

# 3. Verificar dev.log para ver se há logs relevantes
print("\n=== PASSO 3: verificar dev.log ===")
import subprocess
result = subprocess.run(["tail", "-15", "/home/z/my-project/dev.log"], capture_output=True, text=True)
print(result.stdout)
