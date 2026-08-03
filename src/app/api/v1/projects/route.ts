import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();

  // Se logado, só mostra seus projetos; se anónimo, todos os anónimos
  const where = user ? { userId: user.id } : { userId: null };

  const projects = await prisma.project.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      packs: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      executionStates: {
        select: { status: true },
      },
      _count: { select: { executionStates: true } },
    },
  });

  const result = projects.map((p) => {
    const latestPack = p.packs[0];
    const packData = latestPack ? JSON.parse(latestPack.packJson) : null;
    // Conta quantos PromptExecutionState estão done (status="done")
    const doneStates = p.executionStates.filter((s) => s.status === "done").length;

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
      doneCount: doneStates,
    };
  });

  return NextResponse.json({ ok: true, projects: result });
}
