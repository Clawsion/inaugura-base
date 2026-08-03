import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { withRateLimit } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  const rl = await withRateLimit(req);
  if (rl) return rl;

  const { packId } = await params;

  const states = await prisma.promptExecutionState.findMany({
    where: { packId },
    orderBy: { stepIndex: "asc" },
  });

  const pack = await prisma.pack.findUnique({
    where: { id: packId },
    include: { project: true },
  });

  if (!pack) {
    return NextResponse.json({ ok: false, error: "Pack não encontrado" }, { status: 404 });
  }

  const packData = JSON.parse(pack.packJson);

  const total = states.length;
  const done = states.filter((s) => s.status === "done").length;
  const inProgress = states.filter((s) => s.status === "in_progress").length;
  const blocked = states.filter((s) => s.status === "blocked").length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  let nextAction: { stepId: string; stepIndex: number } | null = null;
  for (const s of states) {
    if (s.status === "todo") {
      nextAction = { stepId: s.stepId, stepIndex: s.stepIndex };
      break;
    }
  }

  return NextResponse.json({
    ok: true,
    project: pack.project,
    pack: packData,
    states,
    progress: { total, done, inProgress, blocked, percent: progress },
    nextAction,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  const rl = await withRateLimit(req);
  if (rl) return rl;

  const { packId } = await params;
  const body = await req.json();

  const { stepId, status, aiUsed, notes, blockedReason } = body as {
    stepId: string;
    status: "todo" | "in_progress" | "blocked" | "done";
    aiUsed?: string;
    notes?: string;
    blockedReason?: string;
  };

  const updated = await prisma.promptExecutionState.updateMany({
    where: { packId, stepId },
    data: {
      status,
      aiUsed: aiUsed ?? null,
      notes: notes ?? null,
      blockedReason: blockedReason ?? null,
      completedAt: status === "done" ? new Date() : null,
      updatedAt: new Date(),
    },
  });

  if (updated.count === 0) {
    return NextResponse.json({ ok: false, error: "Step não encontrado" }, { status: 404 });
  }

  const pack = await prisma.pack.findUnique({ where: { id: packId }, include: { project: true } });
  if (pack) {
    const allStates = await prisma.promptExecutionState.findMany({ where: { packId } });
    const allDone = allStates.every((s) => s.status === "done");
    const anyActive = allStates.some((s) => s.status === "in_progress" || s.status === "done");

    let newStatus = pack.project.status;
    if (allDone) newStatus = "completed";
    else if (anyActive) newStatus = "executing";

    if (newStatus !== pack.project.status) {
      await prisma.project.update({
        where: { id: pack.projectId },
        data: { status: newStatus },
      });
    }
  }

  return NextResponse.json({ ok: true, updated: updated.count });
}
