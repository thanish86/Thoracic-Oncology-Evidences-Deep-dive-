/**
 * Disease taxonomy shared by the seed, navigation and module pages.
 * Qualitative, classification-level content only (no statistics).
 */
import type { DiseaseSlug } from "./content/schema";

export interface DiseaseDef {
  slug: DiseaseSlug;
  name: string;
  shortName: string;
  organSystem: "thoracic" | "breast";
  accent: "blue" | "sage" | "lavender" | "rose" | "sand";
  tagline: string;
  description: string;
  subtypes: { slug: string; name: string; description?: string }[];
  histologies: { name: string; classification: string; description?: string }[];
  stageSystems: { name: string; versions: string[] }[];
}

export const DISEASE_DEFS: DiseaseDef[] = [
  {
    slug: "breast",
    name: "Breast Cancer",
    shortName: "Breast",
    organSystem: "breast",
    accent: "rose",
    tagline: "From DCIS to HER2-ultralow: the receptor-defined continuum",
    description:
      "Hormone receptor, HER2 and triple-negative disease across screening, early, locally advanced and metastatic settings, with genomic risk assays, CDK4/6 inhibition, HER2-directed ADCs and PI3K/AKT pathway targeting.",
    subtypes: [
      { slug: "hr-pos-her2-neg", name: "HR+/HER2−", description: "Luminal-like; endocrine therapy backbone" },
      { slug: "her2-pos", name: "HER2+", description: "HER2 IHC 3+ or ISH-amplified" },
      { slug: "her2-low", name: "HER2-low / ultralow", description: "IHC 1+ or 2+/ISH− (low); IHC 0 with faint incomplete staining (ultralow)" },
      { slug: "tnbc", name: "Triple-negative", description: "ER/PR negative or low, HER2-negative" },
      { slug: "dcis", name: "DCIS", description: "Non-invasive ductal carcinoma in situ" },
      { slug: "ibc", name: "Inflammatory breast cancer", description: "Clinical diagnosis; T4d" },
    ],
    histologies: [
      { name: "Invasive carcinoma of no special type (NST)", classification: "WHO Breast Tumours, 5th ed." },
      { name: "Invasive lobular carcinoma", classification: "WHO Breast Tumours, 5th ed.", description: "E-cadherin loss; discohesive single-file growth" },
      { name: "Metaplastic carcinoma", classification: "WHO Breast Tumours, 5th ed." },
      { name: "Mucinous, tubular and other special types", classification: "WHO Breast Tumours, 5th ed." },
      { name: "Ductal carcinoma in situ", classification: "WHO Breast Tumours, 5th ed." },
    ],
    stageSystems: [{ name: "AJCC TNM (anatomic and prognostic stage groups)", versions: ["AJCC 8th edition"] }],
  },
  {
    slug: "nsclc",
    name: "Non-Small-Cell Lung Cancer",
    shortName: "NSCLC",
    organSystem: "thoracic",
    accent: "blue",
    tagline: "Screening, perioperative immunotherapy and the driver-oncogene era",
    description:
      "Low-dose CT screening, surgery and adjuvant/perioperative therapy, chemoradiation with consolidation, and metastatic disease stratified by actionable drivers and PD-L1.",
    subtypes: [
      { slug: "adenocarcinoma", name: "Adenocarcinoma" },
      { slug: "squamous", name: "Squamous cell carcinoma" },
      { slug: "driver-positive", name: "Driver-positive", description: "EGFR, ALK, ROS1, BRAF, MET, RET, NTRK, KRAS G12C, HER2, NRG1" },
      { slug: "driver-negative", name: "Driver-negative", description: "Immunotherapy ± chemotherapy by PD-L1 and histology" },
    ],
    histologies: [
      { name: "Adenocarcinoma (lepidic, acinar, papillary, micropapillary, solid)", classification: "WHO Thoracic Tumours, 5th ed." },
      { name: "Squamous cell carcinoma", classification: "WHO Thoracic Tumours, 5th ed.", description: "p40/CK5/6 positive, TTF-1 negative" },
      { name: "Large-cell carcinoma", classification: "WHO Thoracic Tumours, 5th ed.", description: "Diagnosis of exclusion on resection specimens" },
      { name: "Adenosquamous carcinoma", classification: "WHO Thoracic Tumours, 5th ed." },
      { name: "Sarcomatoid carcinoma", classification: "WHO Thoracic Tumours, 5th ed.", description: "Enriched for MET exon 14 skipping" },
    ],
    stageSystems: [{ name: "TNM", versions: ["IASLC/UICC 8th edition", "IASLC 9th edition (effective 2025)"] }],
  },
  {
    slug: "sclc",
    name: "Small-Cell Lung Cancer",
    shortName: "SCLC",
    organSystem: "thoracic",
    accent: "lavender",
    tagline: "Chemoradiation, chemo-immunotherapy and DLL3-directed T-cell engagers",
    description:
      "Neuroendocrine high-grade carcinoma: limited-stage chemoradiotherapy and consolidation, extensive-stage chemo-immunotherapy, cranial management, and relapse therapy including DLL3 bispecifics.",
    subtypes: [
      { slug: "limited-stage", name: "Limited stage", description: "Encompassable in a tolerable radiation field" },
      { slug: "extensive-stage", name: "Extensive stage" },
      { slug: "transformed", name: "Transformed SCLC", description: "Histologic transformation from EGFR-mutant adenocarcinoma" },
    ],
    histologies: [
      { name: "Small-cell carcinoma", classification: "WHO Thoracic Tumours, 5th ed.", description: "Neuroendocrine markers, high Ki-67, RB1/TP53 loss" },
      { name: "Combined small-cell carcinoma", classification: "WHO Thoracic Tumours, 5th ed." },
    ],
    stageSystems: [
      { name: "TNM", versions: ["IASLC/UICC 8th edition", "IASLC 9th edition (effective 2025)"] },
      { name: "VALG limited/extensive", versions: ["Veterans Administration Lung Study Group"] },
    ],
  },
  {
    slug: "thymic",
    name: "Thymoma & Thymic Carcinoma",
    shortName: "Thymic",
    organSystem: "thoracic",
    accent: "sand",
    tagline: "Rare tumours, autoimmune biology and resection-driven care",
    description:
      "Thymic epithelial tumours: WHO histotypes, Masaoka–Koga and TNM staging, resection completeness, radiotherapy, anthracycline-platinum chemotherapy, and the autoimmune hazards of immunotherapy.",
    subtypes: [
      { slug: "thymoma", name: "Thymoma", description: "WHO types A, AB, B1, B2, B3" },
      { slug: "thymic-carcinoma", name: "Thymic carcinoma", description: "Most commonly squamous; CD5/CD117 positive" },
      { slug: "thymic-net", name: "Thymic neuroendocrine tumours" },
    ],
    histologies: [
      { name: "Type A thymoma", classification: "WHO Thoracic Tumours, 5th ed.", description: "Spindle/oval epithelial cells, few lymphocytes" },
      { name: "Type AB thymoma", classification: "WHO Thoracic Tumours, 5th ed." },
      { name: "Type B1 thymoma", classification: "WHO Thoracic Tumours, 5th ed.", description: "Thymus-like, lymphocyte-rich" },
      { name: "Type B2 thymoma", classification: "WHO Thoracic Tumours, 5th ed." },
      { name: "Type B3 thymoma", classification: "WHO Thoracic Tumours, 5th ed.", description: "Epithelial-predominant, mild atypia" },
      { name: "Thymic squamous cell carcinoma", classification: "WHO Thoracic Tumours, 5th ed." },
    ],
    stageSystems: [
      { name: "Masaoka–Koga", versions: ["Masaoka–Koga (ITMIG-refined definitions)"] },
      { name: "TNM", versions: ["IASLC/ITMIG 8th edition", "IASLC 9th edition"] },
    ],
  },
  {
    slug: "mesothelioma",
    name: "Pleural & Peritoneal Mesothelioma",
    shortName: "Mesothelioma",
    organSystem: "thoracic",
    accent: "sage",
    tagline: "Histology-led systemic therapy and the retreat from radical surgery",
    description:
      "Asbestos-associated and BAP1-related mesothelioma of pleura and peritoneum: histology, IHC, staging, chemotherapy, dual checkpoint blockade, surgical controversy and CRS/HIPEC.",
    subtypes: [
      { slug: "pleural", name: "Pleural mesothelioma" },
      { slug: "peritoneal", name: "Peritoneal mesothelioma" },
      { slug: "epithelioid", name: "Epithelioid" },
      { slug: "non-epithelioid", name: "Non-epithelioid (biphasic / sarcomatoid)" },
    ],
    histologies: [
      { name: "Epithelioid mesothelioma", classification: "WHO Thoracic Tumours, 5th ed." },
      { name: "Biphasic mesothelioma", classification: "WHO Thoracic Tumours, 5th ed." },
      { name: "Sarcomatoid mesothelioma", classification: "WHO Thoracic Tumours, 5th ed." },
      { name: "Mesothelioma in situ", classification: "WHO Thoracic Tumours, 5th ed.", description: "Requires BAP1 and/or MTAP loss" },
    ],
    stageSystems: [{ name: "TNM (pleural)", versions: ["IASLC/UICC 8th edition", "IASLC 9th edition"] }],
  },
];

export const DISEASE_BY_SLUG: Record<DiseaseSlug, DiseaseDef> = Object.fromEntries(
  DISEASE_DEFS.map((d) => [d.slug, d]),
) as Record<DiseaseSlug, DiseaseDef>;

export const PATHWAYS: { slug: string; name: string; description: string }[] = [
  { slug: "egfr-pathway", name: "EGFR signalling", description: "ErbB receptor tyrosine kinase signalling through RAS–MAPK and PI3K–AKT." },
  { slug: "alk-fusion", name: "Fusion kinases (ALK / ROS1 / RET / NTRK)", description: "Ligand-independent constitutive kinase activation from gene rearrangement." },
  { slug: "mapk", name: "RAS–RAF–MEK–ERK", description: "Mitogen-activated protein kinase cascade downstream of receptor tyrosine kinases." },
  { slug: "pi3k-akt-mtor", name: "PI3K–AKT–mTOR", description: "Growth and survival pathway; PIK3CA, AKT1 and PTEN alterations." },
  { slug: "dna-damage-repair", name: "DNA damage repair", description: "Homologous recombination (BRCA1/2, PALB2) and synthetic lethality with PARP inhibition." },
  { slug: "pd1-pdl1", name: "PD-1 / PD-L1 checkpoint", description: "Adaptive immune resistance at the tumour–T-cell interface." },
  { slug: "ctla4", name: "CTLA-4 checkpoint", description: "Priming-phase inhibitory receptor on T cells." },
  { slug: "estrogen-receptor", name: "Oestrogen receptor signalling", description: "ER-driven transcription; target of endocrine therapy and SERDs." },
  { slug: "her2-pathway", name: "HER2 signalling", description: "ERBB2 homo/heterodimerisation; target of antibodies, TKIs and ADCs." },
  { slug: "dll3-notch", name: "DLL3 / Notch", description: "Inhibitory Notch ligand aberrantly expressed on neuroendocrine tumour cell surfaces." },
  { slug: "tumour-suppressor", name: "Tumour suppressors", description: "BAP1, CDKN2A/MTAP, NF2 and related loss-of-function events." },
];
