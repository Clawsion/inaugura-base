import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      packs: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { executionStates: true } },
    },
  });

  const result = projects.map((p) => {
    const latestPack = p.packs[0];
    const packData = latestPack ? JSON.parse(latestPack.packJson) : null;
    const doneStates = p._count.executionStates > 0
      ? Math.floor(Math.random() * p._count.executionStates) // placeholder; em produção contar done
      : 0;

    return {
      id: p.id,
      title: p.title,
      status: p.status,
      level: p.level,
      mode: p.mode,
      projectType: p.projectType,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      packId: latestPack?.id ?? null,
      packMode: packData?.meta?.mode ?? null,
      packTier: packData?.meta?.level ?? null,
      stepCount: p._count.executionStates,
    };
  });

  return NextResponse.json({ ok: true, projects: result });
}
