import { NextResponse, type NextRequest } from "next/server";
import { trialFilterSchema } from "@/server/services/filters";
import { listTrials } from "@/server/services/trials";

export const dynamic = "force-dynamic";

/** GET /api/trials — filtered trial list (same filters as /trials). */
export async function GET(req: NextRequest) {
  const filters = trialFilterSchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const trials = await listTrials(filters);
  return NextResponse.json({ count: trials.length, trials });
}
