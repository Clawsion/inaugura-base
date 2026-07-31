// ============================================================================
// /api/fonts-catalog — proxy server-side para o catálogo do Google Fonts
// ============================================================================
// O endpoint fonts.google.com/metadata/fonts tem `cross-origin-resource-policy: same-site`
// que bloqueia fetch do browser. Esta route faz o fetch server-side e devolve JSON.
//
// Cache em memória (5min) para evitar refetch em cada request.
// ============================================================================

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutos

let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

export async function GET() {
  // Cache hit?
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  }

  try {
    const res = await fetch("https://fonts.google.com/metadata/fonts", {
      headers: {
        Accept: "application/json",
        "User-Agent": "Inaugura-Base/1.0 (Next.js)",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Fonts API returned ${res.status}` },
        { status: 502 }
      );
    }

    const text = await res.text();
    // O endpoint pode retornar JSON puro ou com prefixo ")]}'"
    const cleaned = text.replace(/^\)\]\}'\n/, "");
    let json;
    try {
      json = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Google Fonts metadata" },
        { status: 502 }
      );
    }

    cache = { data: json, timestamp: Date.now() };

    return NextResponse.json(json, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Fetch failed: ${err?.message ?? "unknown"}` },
      { status: 500 }
    );
  }
}
