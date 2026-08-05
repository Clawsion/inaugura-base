#!/usr/bin/env python3
"""Substitui os mockups antigos por novos melhores no SimpleForge.tsx"""
import re

path = "/home/z/my-project/src/components/forms/SimpleForge.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Encontrar o bloco que começa com "// ═══ 1. SAAS" e acaba antes de "// ═══ 2. E-COMMERCE"
# Substituir por novo SaaS mockup
old_saas_start = "  // ═══ 1. SAAS — Dashboard completo com sidebar + chart + table ═══"
old_saas_end = "  // ═══ 2. E-COMMERCE"

# Encontrar as posições
start_idx = content.find(old_saas_start)
end_idx = content.find(old_saas_end)

if start_idx == -1 or end_idx == -1:
    print(f"✗ Não encontrou blocos (start={start_idx}, end={end_idx})")
    exit(1)

print(f"Encontrou SaaS mockup: {start_idx} a {end_idx} ({end_idx - start_idx} chars)")

# O novo mockup SaaS será mais simples e melhor
new_saas = """  // ═══ 1. SAAS — Linear/Vercel style: hero + bento features + pricing ═══
  if (style === "saas") return (
    <div>
      <div className={cn("overflow-hidden border", r)} style={{ ...base, borderColor: c1 + "20" }}>
        {/* NAV */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `${bdr} solid ${c1}10` }}>
          <div className="flex items-center gap-2">
            <div className={cn("rounded-md", expanded ? "h-5 w-5" : "h-3 w-3")} style={{ background: c2 }} />
            <span className={cn("font-bold tracking-tight", expanded ? "text-sm" : "text-[10px]")} style={hd}>Linear</span>
          </div>
          <div className="flex items-center gap-3">
            {["Product", "Pricing", "Docs"].map((l, i) => <span key={l} className={cn(expanded ? "text-[11px]" : "text-[8px]", i === 0 ? "font-semibold" : "opacity-50")} style={bf}>{l}</span>)}
            <button className={cn("rounded-md font-semibold", expanded ? "px-3 py-1 text-[10px]" : "px-1.5 py-0.5 text-[7px]")} style={{ background: c2, color: c0 }}>Sign in</button>
          </div>
        </div>
        {/* HERO */}
        <div className={cn("text-center px-6", sec)}>
          <div className={cn("inline-block rounded-full px-2.5 py-0.5 mb-2", expanded ? "text-[10px]" : "text-[7px]")} style={{ background: c2 + "15", color: c2 }}>New · v2.0</div>
          <h1 className={cn("font-bold leading-tight tracking-tight", expanded ? "text-4xl" : "text-lg")} style={hd}>Build better<br/><span style={{ color: c2 }}>products faster</span></h1>
          <p className={cn("mt-2 opacity-60 mx-auto", sz, expanded ? "max-w-sm" : "max-w-[180px]")}>The issue tracking tool that moves teams forward.</p>
          <div className="flex justify-center gap-2 mt-3">
            <button className={cn("rounded-md font-bold", expanded ? "px-4 py-2 text-[11px]" : "px-2 py-1 text-[8px]")} style={{ background: c2, color: c0 }}>Start free</button>
            <button className={cn("rounded-md font-bold border", expanded ? "px-4 py-2 text-[11px]" : "px-2 py-1 text-[8px]")} style={{ borderColor: c1 + "30", color: c1 }}>Demo</button>
          </div>
        </div>
        {/* BENTO FEATURES */}
        <div className={cn("grid gap-2 px-4 pb-3", expanded ? "grid-cols-3" : "grid-cols-2")}>
          {["Issues", "Cycles", "Roadmaps", "Projects", "Insights", "Git Sync"].slice(0, expanded ? 6 : 4).map((f, i) => (
            <div key={i} className={cn("p-2.5", r)} style={{ background: c1 + "05", border: `${bdr} solid ${c1}10` }}>
              <div className={cn("mb-1 rounded-md", expanded ? "h-6 w-6" : "h-3 w-3")} style={{ background: [c2, c3, c1, c2, c3, c1][i] + "30" }} />
              <div className={cn("font-bold", expanded ? "text-[11px]" : "text-[8px]")} style={hd}>{f}</div>
              <div className={cn("opacity-50", expanded ? "text-[10px]" : "text-[7px]")} style={bf}>{["Track work", "Sprint plan", "Timeline", "Group work", "Analytics", "GitHub"][i]}</div>
            </div>
          ))}
        </div>
        {/* SOCIAL PROOF */}
        <div className={cn("px-4 py-2 text-center", expanded ? "py-3" : "py-1.5")} style={{ borderTop: `${bdr} solid ${c1}10` }}>
          <div className={cn("opacity-40 mb-1", expanded ? "text-[10px]" : "text-[7px]")} style={bf}>Trusted by 10,000+ teams</div>
          <div className="flex justify-center gap-3 items-center">
            {["Vercel", "Stripe", "Notion", "Raycast"].map(brand => <span key={brand} className={cn("font-bold opacity-40", expanded ? "text-[11px]" : "text-[8px]")} style={hd}>{brand}</span>)}
          </div>
        </div>
        {/* PRICING */}
        <div className="grid gap-2 px-4 pb-3 grid-cols-3">
          {[{ n: "Free", p: "€0", f: false }, { n: "Pro", p: "€12", f: true }, { n: "Ent", p: "Custom", f: false }].map((plan, i) => (
            <div key={i} className={cn("p-2", r)} style={{ background: plan.f ? c2 + "10" : c1 + "05", border: `${bdr} solid ${plan.f ? c2 + "40" : c1 + "10"}` }}>
              <div className={cn("font-bold", expanded ? "text-[10px]" : "text-[7px]")} style={hd}>{plan.n}</div>
              <div className={cn("font-extrabold", expanded ? "text-lg" : "text-[9px]")} style={{ ...hd, color: plan.f ? c2 : c1 }}>{plan.p}</div>
            </div>
          ))}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-2" style={{ borderTop: `${bdr} solid ${c1}10`, background: c1 + "05" }}>
          <span className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")} style={mn}>© 2026 Linear</span>
          <div className="flex gap-2">{["Privacy", "Terms"].map(l => <span key={l} className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")} style={bf}>{l}</span>)}</div>
        </div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

"""

content = content[:start_idx] + new_saas + content[end_idx:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("✓ SaaS mockup substituído")
