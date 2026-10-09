import { ALGORITHM_AS_OF, JURISDICTION_LABEL, type TreatmentAlgorithm } from "./types";

export const mesotheliomaFirstLine: TreatmentAlgorithm = {
  slug: "pleural-mesothelioma-first-line",
  title: "Unresectable pleural mesothelioma — first line by histology",
  summary:
    "Histological subtype drives first-line choice: dual checkpoint blockade particularly for non-epithelioid disease; for epithelioid disease, immunotherapy, chemo-immunotherapy or platinum–pemetrexed ± bevacizumab are options.",
  disease: "mesothelioma",
  stage: "Unresectable / advanced",
  intent: "palliative",
  jurisdiction: JURISDICTION_LABEL,
  asOf: ALGORITHM_AS_OF,
  status: "AWAITING_VERIFICATION",
  nodes: [
    { id: "start", kind: "note", label: "Pleural mesothelioma", detail: "Adequate tissue biopsy (not cytology alone where possible) with IHC panel to confirm mesothelial origin and subtype." },
    { id: "resect", kind: "decision", label: "Surgical candidacy (MDT)", detail: "Radical surgery is now rarely recommended outside experienced centres or trials.", trialSlugs: ["mars", "mars-2"] },
    { id: "histo", kind: "test", label: "Histological subtype", detail: "Epithelioid vs non-epithelioid (sarcomatoid or biphasic)." },
    { id: "non-epi", kind: "treatment", label: "Non-epithelioid → nivolumab + ipilimumab", trialSlugs: ["checkmate-743"] },
    {
      id: "epi",
      kind: "decision",
      label: "Epithelioid → shared decision",
      detail: "Benefit of immunotherapy over chemotherapy appeared smaller in epithelioid subgroups; patient factors guide choice.",
    },
    { id: "nivo-ipi", kind: "treatment", label: "Nivolumab + ipilimumab", trialSlugs: ["checkmate-743"] },
    { id: "chemo-io", kind: "treatment", label: "Platinum–pemetrexed + pembrolizumab", trialSlugs: ["ind-227", "dream"] },
    { id: "chemo-bev", kind: "treatment", label: "Platinum–pemetrexed ± bevacizumab", trialSlugs: ["emphacis", "maps"] },
    { id: "relapse", kind: "note", label: "Relapse options", detail: "Nivolumab after prior chemotherapy (immunotherapy-naive), or ramucirumab + gemcitabine, among others.", trialSlugs: ["confirm", "rames"] },
  ],
  edges: [
    { source: "start", target: "resect" },
    { source: "resect", target: "histo", label: "Systemic therapy" },
    { source: "histo", target: "non-epi", label: "Non-epithelioid" },
    { source: "histo", target: "epi", label: "Epithelioid" },
    { source: "epi", target: "nivo-ipi" },
    { source: "epi", target: "chemo-io" },
    { source: "epi", target: "chemo-bev" },
    { source: "non-epi", target: "relapse", label: "Progression" },
    { source: "nivo-ipi", target: "relapse", label: "Progression" },
    { source: "chemo-io", target: "relapse", label: "Progression" },
    { source: "chemo-bev", target: "relapse", label: "Progression" },
  ],
};
