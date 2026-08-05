#!/usr/bin/env python3
"""Substitui Vintage e Tech por Landing e Restaurant."""

path = "/home/z/my-project/src/components/forms/SimpleForge.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# ─── Substituir VINTAGE por LANDING ──────────────────────────────────────
old_vintage_start = "  // ═══ 6. VINTAGE"
old_vintage_end = "  // ═══ 7. TECH"

start_idx = content.find(old_vintage_start)
end_idx = content.find(old_vintage_end)

if start_idx == -1 or end_idx == -1:
    print(f"✗ Não encontrou Vintage/Tech (start={start_idx}, end={end_idx})")
    exit(1)

print(f"Encontrou Vintage: {start_idx} a {end_idx} ({end_idx - start_idx} chars)")

new_landing = """  // ═══ 6. LANDING — Product launch page with hero + countdown + CTA ═══
  if (style === "landing") return (
    <div>
      <div className={cn("overflow-hidden border", r)} style={{ ...base, borderColor: c1 + "20" }}>
        {/* NAV */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `${bdr} solid ${c1}10` }}>
          <span className={cn("font-bold", expanded ? "text-sm" : "text-[10px]")} style={hd}>Nova</span>
          <div className="flex items-center gap-3">
            {["Features", "Pricing", "Blog"].map(l => <span key={l} className={cn("opacity-60", expanded ? "text-[11px]" : "text-[8px]")} style={bf}>{l}</span>)}
            <button className={cn("rounded-md font-bold", expanded ? "px-3 py-1 text-[10px]" : "px-1.5 py-0.5 text-[7px]")} style={{ background: c2, color: c0 }}>Get started</button>
          </div>
        </div>
        {/* HERO — countdown + email capture */}
        <div className={cn("text-center px-6", sec)}>
          <div className={cn("inline-block rounded-full px-2.5 py-0.5 mb-2", expanded ? "text-[10px]" : "text-[7px]")} style={{ background: c2 + "15", color: c2 }}>🚀 Launching in 3 days</div>
          <h1 className={cn("font-bold leading-tight", expanded ? "text-5xl" : "text-xl")} style={hd}>The future of<br/><span style={{ color: c2 }}>work is here</span></h1>
          <p className={cn("mt-2 opacity-60 mx-auto", sz, expanded ? "max-w-md" : "max-w-[200px]")}>Join 5,000+ early adopters. Be the first to experience the next generation of productivity.</p>
          {/* Email capture */}
          <div className={cn("flex justify-center gap-1 mt-3 max-w-xs mx-auto")}>
            <input className={cn("flex-1 rounded-md border px-2 py-1.5", expanded ? "text-[11px]" : "text-[8px]")} style={{ background: c0, borderColor: c1 + "30", color: c1 }} placeholder="your@email.com" readOnly />
            <button className={cn("rounded-md font-bold px-3 py-1.5 whitespace-nowrap", expanded ? "text-[11px]" : "text-[8px]")} style={{ background: c2, color: c0 }}>Notify me →</button>
          </div>
          {/* Countdown */}
          <div className={cn("flex justify-center gap-2 mt-3")}>
            {[{ v: "03", l: "days" }, { v: "14", l: "hrs" }, { v: "37", l: "min" }, { v: "52", l: "sec" }].map((t) => (
              <div className={cn("text-center rounded-md p-1.5", expanded ? "w-12" : "w-8")} style={{ background: c1 + "08", border: `${bdr} solid ${c1}15` }}>
                <div className={cn("font-extrabold", expanded ? "text-xl" : "text-[10px]")} style={{ ...hd, color: c2 }}>{t.v}</div>
                <div className={cn("opacity-40 uppercase", expanded ? "text-[8px]" : "text-[5px]")} style={mn}>{t.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* FEATURE SHOWCASE — 3 columns with icons */}
        <div className={cn("grid gap-3 px-4 py-3", expanded ? "grid-cols-3" : "grid-cols-3")} style={{ borderTop: `${bdr} solid ${c1}10` }}>
          {[
            { icon: "⚡", t: "Lightning Fast", d: "10x faster than competitors" },
            { icon: "🔒", t: "Bank-grade Security", d: "SOC2 + GDPR compliant" },
            { icon: "🤖", t: "AI Powered", d: "Smart automation built-in" },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <div className={cn("mb-1", expanded ? "text-2xl" : "text-sm")}>{f.icon}</div>
              <div className={cn("font-bold", expanded ? "text-[11px]" : "text-[8px]")} style={hd}>{f.t}</div>
              <div className={cn("opacity-50", expanded ? "text-[10px]" : "text-[7px]")} style={bf}>{f.d}</div>
            </div>
          ))}
        </div>
        {/* STATS bar */}
        <div className={cn("flex justify-around px-4 py-2", expanded ? "py-3" : "py-1.5")} style={{ background: c1 + "05", borderTop: `${bdr} solid ${c1}10` }}>
          {[{ n: "5K+", l: "Waitlist" }, { n: "98%", l: "Satisfaction" }, { n: "4.9★", l: "Rating" }].map((s, i) => (
            <div className="text-center">
              <div className={cn("font-extrabold", expanded ? "text-lg" : "text-[9px]")} style={{ ...hd, color: [c2, c3, c1][i] }}>{s.n}</div>
              <div className={cn("opacity-40", expanded ? "text-[9px]" : "text-[6px]")} style={bf}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-2" style={{ borderTop: `${bdr} solid ${c1}10` }}>
          <span className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")} style={mn}>© 2026 Nova</span>
          <div className="flex gap-2">{["Twitter", "Discord"].map(l => <span key={l} className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")} style={bf}>{l}</span>)}</div>
        </div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

"""

content = content[:start_idx] + new_landing + content[end_idx:]

# ─── Substituir TECH por RESTAURANT ──────────────────────────────────────
old_tech_start = "  // ═══ 7. TECH"
# O tech acaba antes do "return null;"
old_tech_end = "  return null;"

start_idx = content.find(old_tech_start)
end_idx = content.find(old_tech_end, start_idx)

if start_idx == -1 or end_idx == -1:
    print(f"✗ Não encontrou Tech (start={start_idx}, end={end_idx})")
    exit(1)

print(f"Encontrou Tech: {start_idx} a {end_idx} ({end_idx - start_idx} chars)")

new_restaurant = """  // ═══ 7. RESTAURANT — Menu + reservation + gallery ═══
  if (style === "restaurant") return (
    <div>
      <div className={cn("overflow-hidden border", r)} style={{ ...base, borderColor: c1 + "20" }}>
        {/* NAV */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `${bdr} solid ${c1}15` }}>
          <span className={cn("font-bold italic", expanded ? "text-base" : "text-[10px]")} style={{ ...hd, letterSpacing: "0.05em" }}>Bistro</span>
          <div className="flex items-center gap-3">
            {["Menu", "About", "Gallery"].map(l => <span key={l} className={cn("opacity-60", expanded ? "text-[11px]" : "text-[8px]")} style={bf}>{l}</span>)}
            <button className={cn("rounded font-semibold", expanded ? "px-3 py-1 text-[10px]" : "px-1.5 py-0.5 text-[7px]")} style={{ background: c2, color: c0 }}>Reserve</button>
          </div>
        </div>
        {/* HERO — full bleed image placeholder + overlay */}
        <div className={cn("relative flex items-end overflow-hidden", r)} style={{ background: c2 + "30", minHeight: expanded ? 200 : 80 }}>
          <div className={cn("absolute inset-0")} style={{ background: `linear-gradient(135deg, ${c0}00 0%, ${c0}CC 60%, ${c0} 100%)` }} />
          <div className={cn("relative p-4")}>
            <div className={cn("rounded-full px-2 py-0.5 mb-1 inline-block", expanded ? "text-[9px]" : "text-[6px]")} style={{ background: c3, color: c0 }}>★ Michelin Recommended</div>
            <h1 className={cn("font-bold leading-tight italic", expanded ? "text-3xl" : "text-sm")} style={{ ...hd, letterSpacing: "0.02em" }}>Seasonal<br/>Cuisine</h1>
            <p className={cn("opacity-70 italic mt-1", sz)}>Farm-to-table dining experience</p>
          </div>
        </div>
        {/* MENU — 3 sections with dishes */}
        <div className={cn("px-4 py-3 space-y-3")}>
          {[
            { cat: "Starters", items: [{ n: "Burrata", d: "Heirloom tomato, basil oil", p: "14" }, { n: "Ceviche", d: "Sea bass, citrus, chili", p: "18" }] },
            { cat: "Mains", items: [{ n: "Risotto", d: "Wild mushroom, parmesan", p: "26" }, { n: "Duck", d: "Confit, cherry, root veg", p: "32" }] },
            { cat: "Desserts", items: [{ n: "Crème brûlée", d: "Vanilla bean, berry", p: "12" }] },
          ].map((section) => (
            <div key={section.cat}>
              <div className={cn("font-bold italic mb-1.5", expanded ? "text-[12px]" : "text-[9px]")} style={{ ...hd, color: c2, borderBottom: `${bdr} solid ${c2}30`, paddingBottom: "2px" }}>{section.cat}</div>
              {section.items.map((item) => (
                <div className="flex items-baseline gap-2 mb-1">
                  <div className="flex-1">
                    <span className={cn("font-semibold", expanded ? "text-[11px]" : "text-[8px]")} style={hd}>{item.n}</span>
                    <span className={cn("opacity-50 italic ml-1", expanded ? "text-[10px]" : "text-[7px]")} style={bf}>— {item.d}</span>
                  </div>
                  <span className={cn("font-bold", expanded ? "text-[11px]" : "text-[8px]")} style={{ color: c2 }}>€{item.p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* RESERVATION CTA */}
        <div className={cn("mx-4 mb-3 p-3 flex items-center justify-between", r)} style={{ background: c2 + "10", border: `${bdr} solid ${c2}30` }}>
          <div>
            <div className={cn("font-bold italic", expanded ? "text-sm" : "text-[9px]")} style={{ ...hd, color: c2 }}>Reserve your table</div>
            <div className={cn("opacity-50 italic", expanded ? "text-[10px]" : "text-[7px]")} style={bf}>Tue–Sun · 18:00–23:00</div>
          </div>
          <button className={cn("rounded font-bold italic px-3 py-1.5", expanded ? "text-[10px]" : "text-[8px]")} style={{ background: c2, color: c0 }}>Book →</button>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-2" style={{ borderTop: `${bdr} solid ${c1}10` }}>
          <div>
            <span className={cn("font-bold italic", expanded ? "text-[10px]" : "text-[7px]")} style={hd}>Bistro</span>
            <span className={cn("opacity-40 italic ml-2", expanded ? "text-[9px]" : "text-[7px]")} style={bf}>123 Rue Saint-Honoré, Paris</span>
          </div>
          <div className="flex gap-2">{["Insta", "FB"].map(l => <span key={l} className={cn("opacity-40", expanded ? "text-[9px]" : "text-[7px]")} style={bf}>{l}</span>)}</div>
        </div>
      </div>
      <ColorLegend colors={colors} expanded={expanded} />
    </div>
  );

"""

content = content[:start_idx] + new_restaurant + content[end_idx:]

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("✓ Vintage → Landing substituído")
print("✓ Tech → Restaurant substituído")
