import { ALGORITHM_AS_OF, JURISDICTION_LABEL, type TreatmentAlgorithm } from "./types";

export const nsclcUnresectableStageIII: TreatmentAlgorithm = {
  slug: "nsclc-unresectable-stage-iii",
  title: "Unresectable stage III NSCLC — chemoradiotherapy and consolidation",
  summary:
    "Concurrent platinum-based chemoradiotherapy for fit patients, followed by biomarker-directed consolidation: osimertinib for EGFR-mutant disease, durvalumab otherwise.",
  disease: "nsclc",
  stage: "Unresectable stage III",
  intent: "curative",
  jurisdiction: JURISDICTION_LABEL,
  asOf: ALGORITHM_AS_OF,
  status: "AWAITING_VERIFICATION",
  nodes: [
    { id: "start", kind: "note", label: "Unresectable stage III NSCLC", detail: "Unresectability confirmed by a multidisciplinary team; PET-CT and brain imaging for staging." },
    { id: "test", kind: "test", label: "EGFR / ALK testing + PD-L1", detail: "Obtain results before consolidation is chosen; they determine the consolidation branch." },
    { id: "fit", kind: "decision", label: "Fit for concurrent chemoradiotherapy?" },
    {
      id: "crt",
      kind: "treatment",
      label: "Concurrent platinum-based chemoradiotherapy",
      detail: "Conventionally fractionated radiotherapy; dose escalation beyond standard dose was not beneficial in a randomised comparison.",
      trialSlugs: ["rtog-0617"],
    },
    { id: "seq", kind: "note", label: "Not fit → sequential chemo-RT or RT alone", detail: "Individualised; consolidation evidence derives from concurrent-CRT populations." },
    { id: "nopd", kind: "decision", label: "No progression after CRT → biomarker status" },
    { id: "egfr", kind: "treatment", label: "EGFR-mutant → consolidation osimertinib", trialSlugs: ["laura"] },
    { id: "durva", kind: "treatment", label: "No EGFR mutation → consolidation durvalumab", trialSlugs: ["pacific"] },
    { id: "alk-note", kind: "note", label: "Other drivers (e.g., ALK) → individualised", detail: "Consolidation evidence for other drivers is limited; discuss at tumour board." },
  ],
  edges: [
    { source: "start", target: "test" },
    { source: "test", target: "fit" },
    { source: "fit", target: "crt", label: "Yes" },
    { source: "fit", target: "seq", label: "No" },
    { source: "crt", target: "nopd" },
    { source: "nopd", target: "egfr", label: "EGFR-mutant" },
    { source: "nopd", target: "durva", label: "No driver" },
    { source: "nopd", target: "alk-note", label: "Other driver" },
  ],
};
