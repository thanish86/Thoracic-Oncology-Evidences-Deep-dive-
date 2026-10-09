import { ALGORITHM_AS_OF, JURISDICTION_LABEL, type TreatmentAlgorithm } from "./types";

export const breastTnbcEarly: TreatmentAlgorithm = {
  slug: "breast-tnbc-early",
  title: "Early triple-negative breast cancer — perioperative chemo-immunotherapy",
  summary:
    "KEYNOTE-522-style neoadjuvant pembrolizumab plus chemotherapy for higher-risk early TNBC, adjuvant pembrolizumab, and post-neoadjuvant escalation options for residual disease guided by germline BRCA status.",
  disease: "breast",
  stage: "Early (higher-risk stage II–III)",
  intent: "curative",
  jurisdiction: JURISDICTION_LABEL,
  asOf: ALGORITHM_AS_OF,
  status: "AWAITING_VERIFICATION",
  nodes: [
    { id: "start", kind: "note", label: "Early TNBC (higher risk)", detail: "ER-, PR- and HER2-negative by IHC/ISH. Smaller node-negative tumours may be managed differently." },
    { id: "gbrca", kind: "test", label: "Germline BRCA1/2 testing", detail: "Informs adjuvant PARP inhibitor eligibility, surgical planning and family counselling." },
    {
      id: "kn522",
      kind: "treatment",
      label: "Neoadjuvant pembrolizumab + chemotherapy (KEYNOTE-522 regimen)",
      detail: "Carboplatin–paclitaxel followed by anthracycline–cyclophosphamide, each with pembrolizumab.",
      trialSlugs: ["keynote-522"],
    },
    { id: "surgery", kind: "note", label: "Surgery and radiotherapy as indicated" },
    { id: "pcr", kind: "decision", label: "Pathological complete response?" },
    { id: "pcr-yes", kind: "treatment", label: "pCR → complete adjuvant pembrolizumab", trialSlugs: ["keynote-522"] },
    { id: "residual", kind: "decision", label: "Residual disease → continue adjuvant pembrolizumab; consider escalation" },
    { id: "cape", kind: "treatment", label: "Adjuvant capecitabine", detail: "Studied after neoadjuvant chemotherapy without immunotherapy; combination with pembrolizumab is extrapolated.", trialSlugs: ["create-x"] },
    { id: "olap", kind: "treatment", label: "gBRCA carrier → adjuvant olaparib", detail: "Studied in high-risk germline BRCA-mutated HER2-negative early breast cancer.", trialSlugs: ["olympia"] },
    { id: "note", kind: "note", label: "Combining escalation agents with pembrolizumab: limited prospective data" },
  ],
  edges: [
    { source: "start", target: "gbrca" },
    { source: "gbrca", target: "kn522" },
    { source: "kn522", target: "surgery" },
    { source: "surgery", target: "pcr" },
    { source: "pcr", target: "pcr-yes", label: "Yes" },
    { source: "pcr", target: "residual", label: "No" },
    { source: "residual", target: "cape", label: "Any" },
    { source: "residual", target: "olap", label: "gBRCA+" },
    { source: "cape", target: "note" },
    { source: "olap", target: "note" },
  ],
};
