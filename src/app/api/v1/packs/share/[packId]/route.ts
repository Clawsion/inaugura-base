import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { withRateLimit } from "@/lib/security";
import crypto from "node:crypto";

export const runtime = "nodejs";

/**
 * POST /api/v1/packs/share/[packId]
 * Torna um pack público (gera shareSlug) ou privado (remove shareSlug).
 * Body: { public: boolean }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  const rl = await withRateLimit(req);
  if (rl) return rl;

  const { packId } = await params;
  const user = await getCurrentUser();

  // Busca o pack
  const pack = await prisma.pack.findUnique({
    where: { id: packId },
    include: { project: true },
  });

  if (!pack) {
    return NextResponse.json({ ok: false, error: "Pack não encontrado" }, { status: 404 });
  }

  // Verifica ownership (se pack tem user, só owner pode partilhar)
  if (pack.project.userId && user?.id !== pack.project.userId) {
    return NextResponse.json({ ok: false, error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json() as { public: boolean };

  if (body.public) {
    // Gera slug único (12 chars base64url)
    const shareSlug = crypto.randomBytes(9).toString("base64url").slice(0, 12);
    await prisma.pack.update({
      where: { id: packId },
      data: { isPublic: true, shareSlug },
    });
    return NextResponse.json({
      ok: true,
      shareSlug,
      shareUrl: `/share/${shareSlug}`,
    });
  } else {
    // Remove share
    await prisma.pack.update({
      where: { id: packId },
      data: { isPublic: false, shareSlug: null },
    });
    return NextResponse.json({ ok: true, shareSlug: null });
  }
}
