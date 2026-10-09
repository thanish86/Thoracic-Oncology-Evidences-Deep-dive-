import type { BadgeTone } from "@/components/ui/primitives";

export const DISEASE_TONE: Record<string, BadgeTone> = {
  breast: "rose", nsclc: "blue", sclc: "lavender", thymic: "sand", mesothelioma: "sage",
};

export const DISEASE_ROUTE: Record<string, string> = {
  breast: "/breast", nsclc: "/nsclc", sclc: "/sclc", thymic: "/thymoma", mesothelioma: "/mesothelioma",
};

export const RESULT_TONE: Record<string, BadgeTone> = {
  POSITIVE: "sage", NEGATIVE: "danger", NON_INFERIOR: "blue", MIXED: "warning", PENDING: "neutral", DESCRIPTIVE: "lavender",
};

export const CLASS_LABEL: Record<string, string> = {
  chemotherapy: "Chemotherapy", immunotherapy: "Immunotherapy", tki: "Tyrosine kinase inhibitor", adc: "Antibody–drug conjugate",
  endocrine: "Endocrine therapy", cdk46: "CDK4/6 inhibitor", "her2-directed": "HER2-directed", parp: "PARP inhibitor",
  "pi3k-akt": "PI3K/AKT pathway", antiangiogenic: "Antiangiogenic", radiotherapy: "Radiotherapy", surgery: "Surgery",
  bispecific: "Bispecific T-cell engager", screening: "Screening", other: "Other",
};

export const STAGE_LABEL: Record<string, string> = {
  early: "Early", "locally-advanced": "Locally advanced", metastatic: "Metastatic", "limited-stage": "Limited stage",
  "extensive-stage": "Extensive stage", resectable: "Resectable", unresectable: "Unresectable", recurrent: "Recurrent",
  screening: "Screening", dcis: "DCIS", any: "Any stage",
};

export const TIMELINE_TYPE_LABEL: Record<string, string> = {
  LANDMARK_TRIAL: "Landmark trial", NEGATIVE_TRIAL: "Negative trial", PRACTICE_CHANGE: "Practice change",
  MOLECULAR_BREAKTHROUGH: "Molecular breakthrough", RADIATION_MILESTONE: "Radiation milestone",
  SURGERY_MILESTONE: "Surgery milestone", GUIDELINE_UPDATE: "Guideline update", DRUG_APPROVAL: "Drug approval",
};

export const ENDPOINT_LABEL: Record<string, string> = {
  OS: "Overall survival", PFS: "Progression-free survival", EFS: "Event-free survival", DFS: "Disease-free survival",
  IDFS: "Invasive disease-free survival", iDFS: "Invasive disease-free survival", RFS: "Recurrence-free survival",
  DRFI: "Distant recurrence-free interval", DRFS: "Distant relapse-free survival", TTF: "Time to treatment failure",
  TTP: "Time to progression", ORR: "Objective response rate", CR: "Complete response", pCR: "Pathological complete response",
  MPR: "Major pathological response", DoR: "Duration of response", DCR: "Disease control rate", CNS_ORR: "CNS objective response",
  CNS_PFS: "CNS progression-free survival", LC: "Local control", QOL: "Quality of life", OTHER: "Other endpoint",
};

export const SAFETY_LABEL: Record<string, string> = {
  GRADE3PLUS: "Grade ≥3 adverse events", SERIOUS: "Serious adverse events", IMMUNE: "Immune-related adverse events",
  DISCONTINUATION: "Discontinuations", DEATHS: "Treatment-related deaths", SPECIFIC: "Specific safety signal", GENERAL: "Adverse events (any grade)",
};

export const PUBLICATION_TYPE_LABEL: Record<string, string> = {
  PRIMARY: "Primary publication", UPDATE: "Updated analysis", FINAL_OS: "Final OS analysis", SUBGROUP: "Subgroup analysis",
  SAFETY: "Safety analysis", QOL: "Patient-reported outcomes", PROTOCOL: "Protocol", META_ANALYSIS: "Meta-analysis", OTHER: "Other",
};

export function labelFor(map: Record<string, string>, key: string) {
  return map[key] ?? key.replace(/[-_]/g, " ");
}
