import { NextResponse } from "next/server";
import { z } from "zod";
import { getTrial } from "@/server/services/trials";

export const dynamic = "force-dynamic";

/** GET /api/trials/:slug — full trial record with every outcome's source and quote. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!z.string().regex(/^[a-z0-9-]+$/).safeParse(slug).success) return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
  const trial = await getTrial(slug);
  if (!trial) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(trial);
}
