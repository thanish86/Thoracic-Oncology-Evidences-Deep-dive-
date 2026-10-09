import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { globalSearch } from "@/server/services/search";

export const dynamic = "force-dynamic";

const querySchema = z.object({ q: z.string().trim().min(2).max(120) });

export async function GET(req: NextRequest) {
  const parsed = querySchema.safeParse({ q: req.nextUrl.searchParams.get("q") ?? "" });
  if (!parsed.success) return NextResponse.json({ hits: [] });
  try {
    const hits = await globalSearch(parsed.data.q);
    return NextResponse.json({ hits });
  } catch {
    return NextResponse.json({ hits: [], error: "search_unavailable" }, { status: 503 });
  }
}
