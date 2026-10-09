/**
 * Stable identity for an outcome analysis across re-seeds. Database IDs are
 * regenerated on every seed; verification records reference this key instead.
 */
export function analysisKey(parts: { trialSlug: string; endpoint: string; endpointLabel?: string | null; population?: string | null; analysisLabel: string }) {
  return [parts.trialSlug, parts.endpoint, parts.endpointLabel ?? parts.endpoint, parts.population ?? "ITT", parts.analysisLabel].join("|");
}
