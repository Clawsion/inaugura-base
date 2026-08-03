import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { withRateLimit } from "@/lib/security";

export const runtime = "nodejs";

/**
 * GET /api/v1/packs/[packId]/versions
 * Lista todas as versões de um pack (histórico).
 * Cada pack no DB é uma versão separada com version: Int.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  const rl = await withRateLimit(req);
  if (rl) return rl;

  const { packId } = await params;
  const user = await getCurrentUser();

  // Busca o pack para obter o projectId
  const pack = await prisma.pack.findUnique({
    where: { id: packId },
    include: { project: true },
  });

  if (!pack) {
    return NextResponse.json({ ok: false, error: "Pack não encontrado" }, { status: 404 });
  }

  // Verifica ownership
  if (pack.project.userId && user?.id !== pack.project.userId) {
    return NextResponse.json({ ok: false, error: "Sem permissão" }, { status: 403 });
  }

  // Busca todas as versões do mesmo projeto
  const versions = await prisma.pack.findMany({
    where: { projectId: pack.projectId },
    orderBy: { version: "desc" },
    select: {
      id: true,
      version: true,
      compilerModel: true,
      compilerProvider: true,
      attempts: true,
      latencyMs: true,
      isPublic: true,
      shareSlug: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    ok: true,
    currentPackId: packId,
    currentVersion: pack.version,
    versions,
  });
}

/**
 * POST /api/v1/packs/[packId]/versions
 * Cria nova versão de um pack (a partir de um pack existente).
 * Body: { packJson: string } — novo conteúdo do pack
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  const rl = await withRateLimit(req);
  if (rl) return rl;

  const { packId } = await params;
  const user = await getCurrentUser();

  const pack = await prisma.pack.findUnique({
    where: { id: packId },
    include: { project: true },
  });

  if (!pack) {
    return NextResponse.json({ ok: false, error: "Pack não encontrado" }, { status: 404 });
  }

  if (pack.project.userId && user?.id !== pack.project.userId) {
    return NextResponse.json({ ok: false, error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json() as { packJson: string };
  if (!body.packJson) {
    return NextResponse.json({ ok: false, error: "packJson obrigatório" }, { status: 400 });
  }

  // Cria nova versão
  const newVersion = pack.version + 1;
  const newPack = await prisma.pack.create({
    data: {
      projectId: pack.projectId,
      version: newVersion,
      packJson: body.packJson,
      catalogVersion: pack.catalogVersion,
      schemaVersion: pack.schemaVersion,
      compilerModel: pack.compilerModel,
      compilerProvider: pack.compilerProvider,
      polishModel: pack.polishModel,
      attempts: 1,
      latencyMs: 0,
    },
  });

  // Atualiza status do projeto
  await prisma.project.update({
    where: { id: pack.projectId },
    data: { status: "generated" },
  });

  return NextResponse.json({
    ok: true,
    packId: newPack.id,
    version: newVersion,
  });
}
