import { breastHer2Early } from "./breast-her2-early";
import { breastTnbcEarly } from "./breast-tnbc-early";
import { mesotheliomaFirstLine } from "./mesothelioma-first-line";
import { nsclcAdvancedNonSquamous } from "./nsclc-advanced-nonsquamous";
import { nsclcResectable } from "./nsclc-resectable";
import { nsclcUnresectableStageIII } from "./nsclc-unresectable-stage-iii";
import { sclcExtensive } from "./sclc-extensive";
import type { TreatmentAlgorithm } from "./types";

export * from "./types";

export const ALGORITHMS: TreatmentAlgorithm[] = [
  nsclcAdvancedNonSquamous,
  nsclcResectable,
  nsclcUnresectableStageIII,
  breastHer2Early,
  breastTnbcEarly,
  sclcExtensive,
  mesotheliomaFirstLine,
];

export function getAlgorithm(slug: string): TreatmentAlgorithm | undefined {
  return ALGORITHMS.find((a) => a.slug === slug);
}

export function algorithmTrialSlugs(a: TreatmentAlgorithm): string[] {
  return [...new Set(a.nodes.flatMap((n) => n.trialSlugs ?? []))];
}
