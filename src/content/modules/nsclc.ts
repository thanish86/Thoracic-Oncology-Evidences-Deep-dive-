import { EDITORIAL_STATUS, type DiseaseModuleContent, type ModuleSection } from "./types";

const drivers: ModuleSection[] = [
  {
    id: "driver-egfr",
    title: "EGFR",
    summary:
      "Sensitising EGFR mutations — exon 19 deletions and L858R — are enriched in adenocarcinoma, never-smokers and East Asian patients. Third-generation TKI-based strategies dominate first line.",
    keyPoints: [
      "Biology: activating kinase-domain mutations; classical (exon 19 deletion, L858R), uncommon (G719X, L861Q, S768I) and exon 20 insertions behave differently pharmacologically.",
      "Assay: tissue NGS preferred (DNA, with RNA for fusions); plasma ctDNA is acceptable to start therapy when tissue is insufficient but cannot exclude a mutation.",
      "First-line classes: osimertinib monotherapy (FLAURA); osimertinib plus platinum–pemetrexed (FLAURA2); amivantamab plus lazertinib (MARIPOSA). Earlier generations (gefitinib, erlotinib, afatinib) established the paradigm (IPASS, EURTAC, LUX-Lung 3).",
      "CNS: osimertinib has strong CNS penetration; intensified regimens are often considered with brain metastases or co-mutations (e.g. TP53).",
      "Resistance: T790M after first/second-generation TKIs (osimertinib, AURA3); after osimertinib — heterogeneous (MET amplification, C797S, bypass tracks, histological transformation to SCLC or squamous). Re-biopsy is encouraged.",
      "Post-osimertinib options include amivantamab plus chemotherapy (MARIPOSA-2), platinum doublets, and biomarker-directed trials; immunotherapy monotherapy is generally ineffective.",
      "Exon 20 insertions are resistant to classical TKIs and are treated with exon 20–directed agents (e.g. amivantamab-based therapy).",
      "Amivantamab: infusion reactions, skin/paronychia and venous thromboembolism require prophylaxis strategies.",
    ],
    pearls: [
      "Avoid sequencing a PD-(L)1 inhibitor immediately before osimertinib — pneumonitis risk.",
      "Transformation to SCLC: RB1 and TP53 loss; look for rising NSE/ProGRP and rapid progression.",
    ],
    trialSlugs: ["ipass", "eurtac", "lux-lung-3", "flaura", "flaura2", "mariposa", "aura3", "mariposa-2", "adaura", "laura"],
    evidenceType: "prospective",
  },
  {
    id: "driver-alk",
    title: "ALK",
    summary:
      "ALK rearrangements occur in younger never/light smokers with adenocarcinoma. Next-generation ALK inhibitors with CNS activity provide prolonged disease control.",
    keyPoints: [
      "Biology: fusion (most commonly EML4::ALK) producing a constitutively active kinase; variant and TP53 status modulate prognosis.",
      "Assay: IHC (D5F3) is a validated screening/standalone test; FISH or RNA-based NGS confirm and define fusion partners.",
      "First-line classes: alectinib (ALEX), brigatinib (ALTA-1L) and lorlatinib (CROWN) superseded crizotinib (PROFILE 1014).",
      "CNS: second- and third-generation agents have marked intracranial activity; lorlatinib is the most CNS-penetrant.",
      "Resistance: on-target kinase-domain mutations (e.g. G1202R, compound mutations) and off-target bypass; lorlatinib covers many single on-target mutations.",
      "Lorlatinib toxicity: hyperlipidaemia, weight gain, and CNS effects (mood, cognition).",
      "Adjuvant alectinib after resection of ALK-positive disease (ALINA).",
    ],
    pearls: ["Crizotinib's poor CNS penetration explains why intracranial progression dominated early ALK experience."],
    trialSlugs: ["profile-1014", "alex", "alta-1l", "crown", "alina"],
    evidenceType: "prospective",
  },
  {
    id: "driver-ros1",
    title: "ROS1",
    summary: "ROS1 fusions define a distinct TKI-sensitive subset with a clinical phenotype similar to ALK.",
    keyPoints: [
      "Assay: RNA-based NGS or FISH; IHC is sensitive but requires confirmation.",
      "Treatment classes: crizotinib (PROFILE 1001 ROS1 cohort), entrectinib, and next-generation ROS1 TKIs (e.g. repotrectinib, taletrectinib) with improved CNS activity and coverage of resistance mutations.",
      "CNS: brain metastases are common; crizotinib has limited intracranial activity.",
      "Resistance: G2032R solvent-front mutation is the archetypal on-target mechanism.",
    ],
    trialSlugs: ["profile-1001-ros1"],
    evidenceType: "prospective",
  },
  {
    id: "driver-braf",
    title: "BRAF",
    summary: "BRAF V600E-mutant NSCLC responds to combined BRAF and MEK inhibition. Non-V600 mutations are biologically distinct.",
    keyPoints: [
      "Classes: class I (V600, RAS-independent monomer), class II (RAS-independent dimer) and class III (kinase-impaired, RAS-dependent).",
      "Treatment: dabrafenib plus trametinib (BRF113928) or encorafenib plus binimetinib for V600E; BRAF monotherapy is inferior to combination.",
      "BRAF mutations occur more often in smokers than other drivers; immunotherapy-based therapy remains an option.",
      "Pyrexia is a characteristic dabrafenib–trametinib toxicity.",
    ],
    trialSlugs: ["brf113928"],
    evidenceType: "prospective",
  },
  {
    id: "driver-met",
    title: "MET",
    summary: "MET exon 14 skipping alterations and high-level MET amplification are distinct entities. Selective MET TKIs are active in exon 14–altered disease.",
    keyPoints: [
      "Exon 14 skipping is enriched in older patients and in sarcomatoid carcinoma; RNA-based NGS improves detection of splice-site alterations.",
      "Treatment: capmatinib and tepotinib (VISION) are selective MET inhibitors; peripheral oedema is a common class toxicity.",
      "MET amplification is a frequent acquired resistance mechanism to EGFR TKIs, motivating EGFR/MET combination strategies.",
      "c-MET protein overexpression is being explored as an antibody–drug conjugate target.",
    ],
    trialSlugs: ["vision"],
    evidenceType: "prospective",
  },
  {
    id: "driver-ret",
    title: "RET",
    summary: "RET fusions (commonly KIF5B::RET) are sensitive to selective RET inhibitors, which replaced multikinase inhibitors.",
    keyPoints: [
      "Assay: RNA-based NGS preferred for fusion detection.",
      "Treatment: selpercatinib (LIBRETTO-001, LIBRETTO-431) and pralsetinib; both have CNS activity.",
      "Toxicities: hypertension, transaminitis, QT prolongation and hypersensitivity (selpercatinib); pneumonitis (pralsetinib).",
      "Resistance: solvent-front mutations (e.g. G810) and MET-driven bypass.",
    ],
    trialSlugs: ["libretto-001", "libretto-431"],
    evidenceType: "prospective",
  },
  {
    id: "driver-ntrk",
    title: "NTRK",
    summary: "NTRK1/2/3 fusions are rare in NSCLC but highly targetable with tumour-agnostic TRK inhibitors.",
    keyPoints: [
      "Assay: RNA-based NGS is most reliable; pan-TRK IHC is a screening tool only.",
      "Treatment: larotrectinib and entrectinib; next-generation agents (e.g. repotrectinib) address solvent-front resistance.",
      "On-target TRK inhibition causes dizziness, weight gain and withdrawal pain — mechanism-based effects.",
    ],
    evidenceType: "prospective",
  },
  {
    id: "driver-kras",
    title: "KRAS",
    summary: "KRAS mutations are the most common drivers in Western, smoking-associated adenocarcinoma. KRAS G12C is directly targetable.",
    keyPoints: [
      "Biology: G12C locks KRAS in the GTP-bound state; covalent inhibitors bind the inactive GDP-bound form.",
      "Co-mutations (STK11, KEAP1) shape immunotherapy sensitivity and prognosis.",
      "First line is usually immunotherapy-based; sotorasib (CodeBreaK 200) and adagrasib (KRYSTAL-1) are established after prior therapy, with first-line combinations under investigation.",
      "Hepatotoxicity is accentuated when G12C inhibitors closely follow checkpoint inhibitors.",
      "Pan-RAS and G12D-directed agents are in development.",
    ],
    trialSlugs: ["codebreak-200", "krystal-1"],
    evidenceType: "prospective",
  },
  {
    id: "driver-her2",
    title: "HER2 (ERBB2)",
    summary: "HER2 mutations, amplification and protein overexpression are distinct in lung cancer; activating mutations are the principal actionable alteration.",
    keyPoints: [
      "Mutations cluster in exon 20 (e.g. the YVMA insertion); detected by NGS.",
      "Trastuzumab deruxtecan is active in HER2-mutant NSCLC (DESTINY-Lung01) and in HER2-overexpressing disease.",
      "Oral HER2-selective TKIs that spare wild-type EGFR are an emerging class.",
      "Interstitial lung disease is the key ADC toxicity; baseline lung disease warrants caution.",
    ],
    pearls: ["Lung “HER2-positive” is not breast “HER2-positive”: the actionable lung alteration is usually a mutation, not amplification."],
    trialSlugs: ["destiny-lung01"],
    evidenceType: "prospective",
  },
  {
    id: "driver-nrg1",
    title: "NRG1",
    summary: "NRG1 fusions are rare, enriched in invasive mucinous adenocarcinoma, and drive HER2/HER3 signalling.",
    keyPoints: [
      "Assay: RNA-based NGS is needed — DNA panels frequently miss NRG1 fusions.",
      "Treatment: HER2/HER3 bispecific antibody (zenocutuzumab) and pan-ERBB strategies; benefit from immunotherapy appears limited.",
      "Consider NRG1 testing particularly in driver-negative invasive mucinous adenocarcinoma.",
    ],
    evidenceType: "prospective",
  },
];

export const nsclcModule: DiseaseModuleContent = {
  diseaseSlug: "nsclc",
  asOf: "2026-10-09",
  status: EDITORIAL_STATUS,
  groups: [
    {
      id: "foundations",
      title: "Foundations",
      sections: [
        {
          id: "epidemiology-tobacco",
          title: "Epidemiology & tobacco",
          summary:
            "Lung cancer remains the leading cause of cancer death worldwide. Tobacco is the dominant cause, but a growing proportion arises in never-smokers, with distinct molecular profiles.",
          keyPoints: [
            "Tobacco smoking accounts for most cases; risk persists for years after cessation but declines progressively.",
            "Other exposures: radon, occupational carcinogens (asbestos, silica, diesel exhaust), air pollution (PM2.5), and second-hand smoke.",
            "Never-smoker lung cancer is enriched for adenocarcinoma, female sex, East Asian ancestry and oncogenic drivers (EGFR, ALK, ROS1).",
            "Smoking cessation at diagnosis improves outcomes and treatment tolerance and should be offered as part of cancer care.",
          ],
          evidenceType: "mixed",
        },
        {
          id: "screening",
          title: "Screening (low-dose CT)",
          summary:
            "Annual low-dose CT screening of high-risk individuals reduces lung cancer mortality. Success depends on eligibility selection, nodule management protocols and smoking cessation integration.",
          keyPoints: [
            "Randomised evidence: NLST (versus chest radiography) and NELSON (versus no screening, volumetric nodule management).",
            "Eligibility is defined by age and cumulative smoking exposure; risk-prediction models (e.g. PLCOm2012) can improve selection.",
            "Structured reporting (Lung-RADS or volumetric protocols) controls false positives and invasive work-up.",
            "Harms: false positives, overdiagnosis, radiation exposure and incidental findings.",
          ],
          pearls: ["NELSON's volumetric, volume-doubling-time approach lowered false-positive rates compared with diameter-based protocols."],
          trialSlugs: ["nlst", "nelson"],
          evidenceType: "prospective",
        },
        {
          id: "pathology-who",
          title: "Pathology & WHO classification",
          summary:
            "The WHO Classification of Thoracic Tumours (5th edition) and IASLC recommendations emphasise tissue conservation for molecular testing and minimise “NSCLC-NOS”.",
          keyPoints: [
            "Adenocarcinoma spectrum: atypical adenomatous hyperplasia, adenocarcinoma in situ, minimally invasive adenocarcinoma, invasive non-mucinous (lepidic, acinar, papillary, micropapillary, solid) and invasive mucinous adenocarcinoma.",
            "IASLC grading of invasive non-mucinous adenocarcinoma: predominant pattern plus the proportion of high-grade patterns (solid, micropapillary, complex glandular); ≥20% high-grade pattern defines grade 3.",
            "Small biopsies: TTF-1 (adenocarcinoma) and p40 (squamous) with a parsimonious IHC panel; preserve tissue for NGS and PD-L1.",
            "Spread through air spaces (STAS) is an adverse feature relevant to sublobar resection.",
            "Large-cell neuroendocrine carcinoma and sarcomatoid carcinoma are separate high-grade entities.",
          ],
          pearls: ["“NSCLC favour adenocarcinoma” based on IHC is treated as adenocarcinoma for molecular testing and pemetrexed eligibility."],
          evidenceType: "consensus",
        },
        {
          id: "staging",
          title: "Staging",
          summary:
            "Accurate staging integrates TNM classification, PET-CT, brain imaging and invasive mediastinal sampling. The IASLC 9th edition TNM refines nodal and metastatic categories.",
          keyPoints: [
            "IASLC 9th edition: N2 is split into N2a (single N2 station) and N2b (multiple N2 stations); M1c is split into M1c1 (multiple extrathoracic metastases in one organ system) and M1c2 (multiple organ systems). T categories are unchanged from the 8th edition.",
            "PET-CT is standard for radical-intent staging; FDG-avid nodes require pathological confirmation before excluding curative treatment.",
            "Contrast-enhanced brain MRI (more sensitive than CT) is recommended for higher-stage disease being considered for radical treatment and for any neurological symptoms; guideline stage thresholds differ.",
            "Invasive mediastinal staging (EBUS-TBNA ± EUS-FNA, the combination improving access to stations) is indicated for PET-positive mediastinal nodes, central tumours, suspected N1 disease and larger tumours; mediastinoscopy is used when needle sampling is negative but suspicion remains.",
            "Systematic, station-based sampling (IASLC lymph-node map) is required for accurate N-staging.",
          ],
          pearls: ["A negative EBUS in a high-suspicion mediastinum should be confirmed surgically before resection."],
          evidenceType: "consensus",
        },
      ],
    },
    {
      id: "early-locally-advanced",
      title: "Early & locally advanced disease",
      sections: [
        {
          id: "surgery",
          title: "Surgery, including sublobar resection",
          summary:
            "Anatomical resection with systematic nodal dissection is the curative standard for operable early-stage disease. Sublobar resection is now evidence-based for small peripheral tumours.",
          keyPoints: [
            "Lobectomy (minimally invasive where feasible) with systematic mediastinal nodal dissection or sampling is standard.",
            "Segmentectomy was shown to be an alternative to lobectomy for small peripheral NSCLC (JCOG0802/WJOG4607L); sublobar resection (wedge or segment) was non-inferior in CALGB 140503.",
            "Margin adequacy, nodal sampling and STAS are central when choosing sublobar resection.",
            "Stereotactic ablative radiotherapy (SABR) is the standard for medically inoperable early-stage disease.",
            "Physiological assessment (FEV1, DLCO, cardiopulmonary exercise testing when indicated) determines operability.",
          ],
          trialSlugs: ["jcog0802", "calgb-140503"],
          evidenceType: "prospective",
        },
        {
          id: "adjuvant-chemotherapy",
          title: "Adjuvant chemotherapy",
          summary: "Cisplatin-based adjuvant chemotherapy provides a modest survival benefit after resection of stage II–IIIA disease.",
          keyPoints: [
            "Evidence from IALT, JBR.10, ANITA and the LACE meta-analysis supports cisplatin-based doublets (commonly with vinorelbine; pemetrexed for non-squamous).",
            "Benefit is not established in stage IA; stage IB with larger tumours is individualised.",
            "Carboplatin substitution is pragmatic when cisplatin is contraindicated, with less direct evidence.",
            "Molecular testing (at least EGFR and ALK) and PD-L1 on resected specimens are required to select adjuvant targeted or immunotherapy.",
          ],
          trialSlugs: ["ialt", "jbr-10", "anita", "lace"],
          evidenceType: "prospective",
        },
        {
          id: "adjuvant-targeted",
          title: "Adjuvant targeted therapy",
          summary: "Adjuvant TKIs reduce recurrence after resection of EGFR-mutant and ALK-positive NSCLC.",
          keyPoints: [
            "Osimertinib after resection (± adjuvant chemotherapy) of EGFR-mutant stage IB–IIIA disease (ADAURA), including reduced CNS recurrence.",
            "Alectinib after resection of ALK-positive disease (ALINA) in place of platinum chemotherapy.",
            "Driver-positive patients should generally not receive adjuvant or perioperative immunotherapy in preference to targeted therapy.",
          ],
          trialSlugs: ["adaura", "alina"],
          evidenceType: "prospective",
        },
        {
          id: "perioperative-immunotherapy",
          title: "Neoadjuvant, perioperative & adjuvant immunotherapy",
          summary:
            "Checkpoint inhibitors are now integrated across the resectable pathway. Neoadjuvant chemo-immunotherapy improves pathological response and event-free survival; perioperative regimens add an adjuvant phase.",
          keyPoints: [
            "Neoadjuvant: nivolumab plus platinum chemotherapy (CheckMate 816).",
            "Perioperative: pembrolizumab (KEYNOTE-671), durvalumab (AEGEAN), nivolumab (CheckMate 77T) — each with chemo-immunotherapy before and immunotherapy after surgery.",
            "Adjuvant only: atezolizumab after chemotherapy in PD-L1-positive disease (IMpower010); pembrolizumab (PEARLS/KEYNOTE-091).",
            "Pathological complete response and major pathological response are strongly prognostic.",
            "Exclude EGFR and ALK alterations before starting neoadjuvant immunotherapy; multidisciplinary resectability assessment must precede treatment.",
            "The incremental value of the adjuvant phase over neoadjuvant-only therapy is not yet directly resolved.",
          ],
          pearls: ["Test for EGFR/ALK before neoadjuvant IO — biopsy material, not the resection specimen, must answer this."],
          trialSlugs: ["checkmate-816", "keynote-671", "aegean", "checkmate-77t", "impower010", "pearls-keynote-091"],
          evidenceType: "prospective",
        },
        {
          id: "unresectable-stage-iii",
          title: "Unresectable stage III",
          summary:
            "Concurrent platinum-based chemoradiotherapy followed by consolidation therapy is standard for fit patients with unresectable stage III disease.",
          keyPoints: [
            "Concurrent chemoradiotherapy is preferred over sequential in fit patients.",
            "Radiation dose escalation beyond the standard did not improve and may worsen outcomes (RTOG 0617).",
            "Consolidation durvalumab after chemoradiotherapy without progression (PACIFIC).",
            "EGFR-mutant disease: consolidation osimertinib after chemoradiotherapy (LAURA); the benefit of durvalumab in driver-positive disease is uncertain.",
            "Pneumonitis risk relates to lung dose parameters; modern planning (IMRT, image guidance) is standard.",
          ],
          trialSlugs: ["rtog-0617", "pacific", "laura"],
          evidenceType: "prospective",
        },
      ],
    },
    {
      id: "metastatic",
      title: "Metastatic disease",
      sections: [
        {
          id: "metastatic-driver-negative",
          title: "Driver-negative disease by PD-L1 and histology",
          summary:
            "In the absence of an actionable driver, first-line therapy is checkpoint inhibitor-based, selected by PD-L1 tumour proportion score (TPS), histology, disease burden and fitness.",
          keyPoints: [
            "Complete molecular testing before starting first-line immunotherapy whenever possible.",
            "PD-L1 TPS ≥50%: single-agent pembrolizumab, cemiplimab or atezolizumab (KEYNOTE-024 established the category) or chemo-immunotherapy for high burden.",
            "PD-L1 TPS 1–49%: chemo-immunotherapy preferred; single-agent pembrolizumab in this group (KEYNOTE-042) is less favoured.",
            "PD-L1 <1%: chemo-immunotherapy; dual checkpoint blockade (nivolumab plus ipilimumab, CheckMate 227, ± two cycles of chemotherapy, CheckMate 9LA) is an alternative.",
            "Non-squamous: platinum–pemetrexed plus pembrolizumab (KEYNOTE-189) or atezolizumab-bevacizumab-carboplatin-paclitaxel (IMpower150).",
            "Squamous: carboplatin with paclitaxel or nab-paclitaxel plus pembrolizumab (KEYNOTE-407); pemetrexed is not used in squamous histology.",
            "STK11/KEAP1 co-mutations identify a less immunotherapy-responsive group.",
          ],
          pearls: ["PD-L1 TPS (tumour cells) in NSCLC vs CPS in other tumours — know which score each trial used."],
          trialSlugs: ["keynote-024", "keynote-042", "keynote-189", "keynote-407", "impower150", "checkmate-227", "checkmate-9la"],
          evidenceType: "prospective",
        },
        {
          id: "subsequent-line",
          title: "Subsequent-line therapy",
          summary:
            "After progression on first-line chemo-immunotherapy, options are limited: docetaxel-based therapy remains the reference, with biomarker-directed agents and trials preferred where available.",
          keyPoints: [
            "Immunotherapy-naive patients after chemotherapy: nivolumab (CheckMate 017, CheckMate 057), atezolizumab (OAK) or pembrolizumab (PD-L1-positive) over docetaxel.",
            "After chemo-immunotherapy: docetaxel ± an antiangiogenic (ramucirumab; nintedanib in adenocarcinoma).",
            "Driver alterations detected later (e.g. KRAS G12C, HER2 mutation, MET exon 14, BRAF) should be targeted.",
            "Antibody–drug conjugates (e.g. TROP2-directed) are evolving options; clinical trial enrolment is encouraged.",
          ],
          trialSlugs: ["checkmate-017", "checkmate-057", "oak", "codebreak-200", "destiny-lung01"],
          evidenceType: "prospective",
        },
      ],
    },
    {
      id: "oncogenic-drivers",
      title: "Oncogenic drivers",
      description: "Biology, assay, treatment classes, CNS activity, resistance and sequencing for each actionable driver. Broad NGS (DNA plus RNA) at diagnosis is the standard for non-squamous NSCLC and for squamous NSCLC in never/light smokers.",
      sections: drivers,
    },
  ],
};
