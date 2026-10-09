/**
 * Original educational questions (not copied from any official examination).
 * Status: AWAITING_VERIFICATION until reviewed by a named oncologist.
 * Facts are restricted to stable classification/criteria knowledge or to
 * trial facts present in the curated, source-quoted content.
 */
export type QuizFormat = "SINGLE_BEST_ANSWER" | "TYPE_K" | "VIGNETTE" | "TRIAL_INTERPRETATION" | "BIOMARKER" | "STAGING" | "IMAGE";

export interface QuizQuestionDef {
  slug: string;
  format: QuizFormat;
  topic: string;
  stem: string;
  /** SBA: options A–E. TYPE_K: four statements, each true/false. */
  options: { id: string; text: string }[];
  /** SBA: { correct: "C" }. TYPE_K: { truth: { "1": true, ... } } */
  answer: { correct: string } | { truth: Record<string, boolean> };
  explanation: string;
  sources: { label: string; url?: string; trialSlug?: string }[];
  trialSlugs: string[];
}

export const QUIZ_QUESTIONS: QuizQuestionDef[] = [
  {
    slug: "recist-progression-definition",
    format: "SINGLE_BEST_ANSWER",
    topic: "Response assessment — RECIST 1.1",
    stem: "A patient on first-line therapy for metastatic NSCLC has a nadir sum of target-lesion diameters of 40 mm. The current sum is 47 mm and there are no new lesions. Under RECIST 1.1, what is the target-lesion response?",
    options: [
      { id: "A", text: "Progressive disease, because the sum has increased by more than 5 mm" },
      { id: "B", text: "Stable disease, because the increase from nadir is less than 20%" },
      { id: "C", text: "Progressive disease, because the increase from nadir is 17.5%" },
      { id: "D", text: "Partial response, because the sum is still below baseline" },
      { id: "E", text: "Not evaluable until confirmatory imaging at 4 weeks" },
    ],
    answer: { correct: "B" },
    explanation:
      "RECIST 1.1 progressive disease for target lesions requires BOTH a ≥20% increase in the sum of diameters relative to the smallest sum on study (nadir) AND an absolute increase of ≥5 mm. Here the increase is 7 mm but only 17.5%, so the 20% relative threshold is not met — stable disease. Exam trap: the 5 mm rule is a necessary add-on, never sufficient on its own.",
    sources: [{ label: "Eisenhauer EA et al. New response evaluation criteria in solid tumours: revised RECIST guideline (version 1.1). Eur J Cancer 2009", url: "https://doi.org/10.1016/j.ejca.2008.10.026" }],
    trialSlugs: [],
  },
  {
    slug: "recist-target-lesion-rules",
    format: "TYPE_K",
    topic: "Response assessment — RECIST 1.1",
    stem: "Regarding selection of target lesions under RECIST 1.1, indicate whether each statement is true or false.",
    options: [
      { id: "1", text: "A maximum of five target lesions in total may be selected, with no more than two per organ." },
      { id: "2", text: "A lymph node must measure ≥15 mm in short axis to be selected as a target lesion." },
      { id: "3", text: "Lymph nodes are measured in their longest diameter, like other target lesions." },
      { id: "4", text: "A partial response requires at least a 30% decrease in the sum of diameters from baseline." },
    ],
    answer: { truth: { "1": true, "2": true, "3": false, "4": true } },
    explanation:
      "RECIST 1.1 reduced target lesions to 5 total / 2 per organ. Pathological nodes qualify as targets at ≥15 mm SHORT axis (10–<15 mm are non-target pathological; <10 mm normal), and nodes are always measured in short axis — statement 3 is false. PR = ≥30% decrease from BASELINE sum (whereas PD is measured from NADIR).",
    sources: [{ label: "Eisenhauer EA et al. Eur J Cancer 2009 (RECIST 1.1)", url: "https://doi.org/10.1016/j.ejca.2008.10.026" }],
    trialSlugs: [],
  },
  {
    slug: "keynote-024-eligibility",
    format: "TRIAL_INTERPRETATION",
    topic: "NSCLC — first-line immunotherapy",
    stem: "A 64-year-old with newly diagnosed metastatic lung adenocarcinoma has PD-L1 TPS 80%. Which result must be known before KEYNOTE-024-based single-agent pembrolizumab can be considered an evidence-concordant choice?",
    options: [
      { id: "A", text: "Tumour mutational burden" },
      { id: "B", text: "EGFR mutation and ALK rearrangement status" },
      { id: "C", text: "STK11 mutation status" },
      { id: "D", text: "Microsatellite instability status" },
      { id: "E", text: "Serum LDH" },
    ],
    answer: { correct: "B" },
    explanation:
      "KEYNOTE-024 enrolled previously untreated advanced NSCLC with PD-L1 ≥50% of tumour cells and NO sensitising EGFR mutation or ALK translocation. The trial's evidence does not apply to driver-positive tumours, so the driver panel (contemporary practice: broad NGS) must be resulted first. TMB, STK11 and LDH were not eligibility criteria.",
    sources: [{ label: "Reck M et al. N Engl J Med 2016 (KEYNOTE-024)", url: "https://doi.org/10.1056/NEJMoa1606774", trialSlug: "keynote-024" }],
    trialSlugs: ["keynote-024"],
  },
  {
    slug: "masaoka-koga-stage-iia",
    format: "STAGING",
    topic: "Thymic epithelial tumours — Masaoka–Koga",
    stem: "A resected thymoma shows microscopic transcapsular invasion into surrounding fat, without invasion of pericardium, pleura or great vessels. What is the Masaoka–Koga stage?",
    options: [
      { id: "A", text: "Stage I" },
      { id: "B", text: "Stage IIa" },
      { id: "C", text: "Stage IIb" },
      { id: "D", text: "Stage III" },
      { id: "E", text: "Stage IVa" },
    ],
    answer: { correct: "B" },
    explanation:
      "Masaoka–Koga: I = grossly and microscopically completely encapsulated; IIa = MICROSCOPIC transcapsular invasion; IIb = MACROSCOPIC invasion into thymic or surrounding fatty tissue, or grossly adherent to but not breaking through mediastinal pleura or pericardium; III = macroscopic invasion into neighbouring organs; IVa = pleural or pericardial dissemination; IVb = lymphogenous or haematogenous metastasis. Memory hack: 'a' = microscopic (a for 'a little'), 'b' = big/macroscopic.",
    sources: [{ label: "Detterbeck FC et al. ITMIG definitions for Masaoka–Koga staging. J Thorac Oncol 2011", url: "https://doi.org/10.1097/JTO.0b013e31821e8cd6" }],
    trialSlugs: [],
  },
  {
    slug: "who-thymoma-type-a",
    format: "SINGLE_BEST_ANSWER",
    topic: "Thymic epithelial tumours — WHO histology",
    stem: "Which WHO thymoma type is characterised by bland spindle/oval epithelial cells with few or no immature T lymphocytes?",
    options: [
      { id: "A", text: "Type A" },
      { id: "B", text: "Type AB" },
      { id: "C", text: "Type B1" },
      { id: "D", text: "Type B2" },
      { id: "E", text: "Type B3" },
    ],
    answer: { correct: "A" },
    explanation:
      "Type A thymoma consists of spindle/oval epithelial cells with few lymphocytes. AB mixes a type A component with a lymphocyte-rich B-like component; B1 resembles normal thymic cortex (lymphocyte-rich); B2 has more plump epithelial cells among lymphocytes; B3 is epithelial-predominant with mild atypia and few lymphocytes. Thymic carcinoma (most often squamous) is separate and typically CD5/CD117 positive.",
    sources: [{ label: "WHO Classification of Tumours: Thoracic Tumours, 5th edition (2021)" }],
    trialSlugs: [],
  },
  {
    slug: "mesothelioma-bap1-mtap",
    format: "BIOMARKER",
    topic: "Mesothelioma — pathology",
    stem: "In an atypical mesothelial proliferation on pleural biopsy, which immunohistochemical finding most strongly supports a diagnosis of mesothelioma over reactive mesothelial hyperplasia?",
    options: [
      { id: "A", text: "Calretinin positivity" },
      { id: "B", text: "WT1 nuclear positivity" },
      { id: "C", text: "Loss of nuclear BAP1 expression" },
      { id: "D", text: "Podoplanin (D2-40) positivity" },
      { id: "E", text: "Cytokeratin 5/6 positivity" },
    ],
    answer: { correct: "C" },
    explanation:
      "Calretinin, WT1, D2-40 and CK5/6 confirm MESOTHELIAL lineage but do not separate benign from malignant. Loss of nuclear BAP1 (with retained internal control in inflammatory/stromal cells) and/or loss of MTAP (surrogate for CDKN2A homozygous deletion) support malignancy. Exam trap: lineage markers ≠ malignancy markers.",
    sources: [{ label: "WHO Classification of Tumours: Thoracic Tumours, 5th edition (2021)" }],
    trialSlugs: [],
  },
  {
    slug: "egfr-c797s",
    format: "BIOMARKER",
    topic: "NSCLC — EGFR resistance",
    stem: "A patient with EGFR exon 19 deletion NSCLC progresses on first-line osimertinib. Which on-target resistance mutation is the classic tertiary EGFR alteration associated with third-generation TKI failure?",
    options: [
      { id: "A", text: "T790M" },
      { id: "B", text: "C797S" },
      { id: "C", text: "L858R" },
      { id: "D", text: "G719X" },
      { id: "E", text: "G1202R" },
    ],
    answer: { correct: "B" },
    explanation:
      "Osimertinib binds covalently to cysteine 797; C797S abolishes that covalent bond. T790M is the classic resistance mutation to first/second-generation TKIs (and the target of osimertinib in the second line). L858R and G719X are sensitising mutations. G1202R is an ALK solvent-front mutation (lorlatinib-relevant). Off-target resistance (MET amplification, histologic transformation to SCLC) is at least as common after osimertinib — rebiopsy matters.",
    sources: [{ label: "Educational synthesis — verify against primary resistance literature" }],
    trialSlugs: [],
  },
  {
    slug: "her2-low-definition",
    format: "TYPE_K",
    topic: "Breast — HER2 spectrum",
    stem: "Regarding HER2 categories in breast cancer, indicate whether each statement is true or false.",
    options: [
      { id: "1", text: "HER2-low includes IHC 1+ and IHC 2+ with negative in situ hybridisation." },
      { id: "2", text: "HER2-ultralow describes IHC 0 tumours with faint, incomplete membrane staining in ≤10% of tumour cells." },
      { id: "3", text: "HER2 IHC 2+ with amplified ISH is classified as HER2-low." },
      { id: "4", text: "HER2-low is a distinct intrinsic molecular subtype defined by gene-expression profiling." },
    ],
    answer: { truth: { "1": true, "2": true, "3": false, "4": false } },
    explanation:
      "HER2-low = IHC 1+ or IHC 2+/ISH-negative. Ultralow = IHC 0 with faint/barely perceptible incomplete membrane staining in ≤10% of cells (as opposed to IHC 'null' with no staining). IHC 2+/ISH-amplified is HER2-POSITIVE. HER2-low is a therapeutic (ADC-eligibility) category, not an intrinsic subtype — most HER2-low tumours are HR-positive/luminal.",
    sources: [{ label: "ASCO/CAP HER2 testing guideline updates (2018; 2023 affirmation)" }],
    trialSlugs: [],
  },
  {
    slug: "sclc-limited-stage-definition",
    format: "SINGLE_BEST_ANSWER",
    topic: "SCLC — staging",
    stem: "Under the VALG system, what defines limited-stage small-cell lung cancer?",
    options: [
      { id: "A", text: "Disease confined to one lobe" },
      { id: "B", text: "Disease confined to one hemithorax that can be encompassed in a tolerable radiotherapy field" },
      { id: "C", text: "Any disease without brain metastases" },
      { id: "D", text: "T1–2 N0 disease only" },
      { id: "E", text: "Disease without malignant pleural effusion, regardless of extent" },
    ],
    answer: { correct: "B" },
    explanation:
      "VALG limited stage = disease confined to one hemithorax (with regional nodes) that can be safely encompassed within a single tolerable radiation field. In TNM terms this broadly maps to stage I–III, excluding T3–4 disease from multiple lung nodules too extensive for a tolerable field. Contemporary trials and guidelines recommend TNM staging alongside VALG.",
    sources: [{ label: "IASLC staging recommendations for SCLC" }],
    trialSlugs: [],
  },
  {
    slug: "alk-g1202r",
    format: "BIOMARKER",
    topic: "NSCLC — ALK resistance",
    stem: "Which ALK kinase-domain mutation, a solvent-front substitution, confers resistance to second-generation ALK inhibitors but retains sensitivity to lorlatinib?",
    options: [
      { id: "A", text: "L1196M" },
      { id: "B", text: "G1202R" },
      { id: "C", text: "C797S" },
      { id: "D", text: "G2032R" },
      { id: "E", text: "D1203N" },
    ],
    answer: { correct: "B" },
    explanation:
      "ALK G1202R is the solvent-front mutation most associated with alectinib/brigatinib/ceritinib failure; lorlatinib was designed to retain activity against it. L1196M is the ALK gatekeeper. G2032R is the analogous ROS1 solvent-front mutation (repotrectinib-relevant). C797S is EGFR. Memory hack: 'G' for 'Gate'? No — G is solvent-front in both ALK (G1202R) and ROS1 (G2032R); the gatekeeper is L1196M.",
    sources: [{ label: "Educational synthesis — verify against primary resistance literature" }],
    trialSlugs: [],
  },
  {
    slug: "itt-vs-per-protocol",
    format: "SINGLE_BEST_ANSWER",
    topic: "Statistics — analysis populations",
    stem: "In a non-inferiority trial, why is a per-protocol analysis usually reported alongside the intention-to-treat analysis?",
    options: [
      { id: "A", text: "Per-protocol analysis is always the regulatory primary analysis" },
      { id: "B", text: "ITT tends to bias toward no difference, which in a non-inferiority design can falsely favour concluding non-inferiority" },
      { id: "C", text: "Per-protocol analysis removes all confounding" },
      { id: "D", text: "ITT cannot be calculated when patients cross over" },
      { id: "E", text: "Per-protocol analysis increases statistical power by including more patients" },
    ],
    answer: { correct: "B" },
    explanation:
      "Non-adherence, crossover and protocol deviations dilute between-arm differences. In a superiority trial this makes ITT conservative; in a non-inferiority trial the same dilution is ANTI-conservative because it pushes the estimate toward 'no difference'. Consistency between ITT and per-protocol results strengthens a non-inferiority conclusion (CONSORT extension for non-inferiority trials).",
    sources: [{ label: "Piaggio G et al. CONSORT extension for non-inferiority and equivalence trials. JAMA 2012", url: "https://doi.org/10.1001/jama.2012.87802" }],
    trialSlugs: [],
  },
  {
    slug: "hazard-ratio-interpretation",
    format: "TRIAL_INTERPRETATION",
    topic: "Statistics — hazard ratios",
    stem: "A trial reports an OS hazard ratio of 0.60 (95% CI 0.41–0.89) for drug X versus control. Which interpretation is most accurate?",
    options: [
      { id: "A", text: "Median survival is 40% longer with drug X" },
      { id: "B", text: "40% of patients are cured by drug X" },
      { id: "C", text: "At any time point, the instantaneous risk of death is estimated to be 40% lower with drug X, assuming proportional hazards" },
      { id: "D", text: "Drug X prolongs survival by 0.6 months" },
      { id: "E", text: "The result is not statistically significant because the CI is wide" },
    ],
    answer: { correct: "C" },
    explanation:
      "A HR summarises the ratio of instantaneous event rates over follow-up, assuming proportional hazards. It does not translate directly into a % gain in median survival or an absolute benefit. A 95% CI excluding 1.0 indicates statistical significance at the two-sided 5% level (subject to the trial's alpha-spending plan). The example numbers mirror KEYNOTE-024's interim OS report.",
    sources: [{ label: "Reck M et al. N Engl J Med 2016 (KEYNOTE-024)", url: "https://doi.org/10.1056/NEJMoa1606774", trialSlug: "keynote-024" }],
    trialSlugs: ["keynote-024"],
  },
  // ── Additional original items (stable definitions/concepts only; no efficacy numbers) ──
  {
    slug: "irecist-iupd-icpd",
    format: "SINGLE_BEST_ANSWER",
    topic: "Response assessment — iRECIST",
    stem: "A patient receiving a PD-1 inhibitor in a trial using iRECIST has a new lesion at the first restaging scan, meeting RECIST 1.1 criteria for progression. She is clinically stable and treatment continues. How is this time point categorised, and what is required next?",
    options: [
      { id: "A", text: "iCPD; treatment must be discontinued" },
      { id: "B", text: "iUPD; confirmation of progression (iCPD) is sought at the next assessment, typically 4–8 weeks later" },
      { id: "C", text: "iSD; the new lesion is ignored until it reaches 10 mm" },
      { id: "D", text: "iUPD; progression is automatically confirmed if the patient remains on treatment" },
      { id: "E", text: "Pseudoprogression; no further imaging is required" },
    ],
    answer: { correct: "B" },
    explanation:
      "Under iRECIST, RECIST 1.1-defined progression is first labelled unconfirmed progression (iUPD). Confirmation (iCPD) requires further evidence at the next assessment, recommended 4–8 weeks later — e.g. further increase in target or non-target disease or new-lesion burden, or additional new lesions. If subsequent imaging shows shrinkage meeting iSD/iPR/iCR, the 'bar' is reset. iRECIST is designed for trial data collection; in practice, continuing beyond iUPD is reserved for clinically stable patients.",
    sources: [{ label: "Seymour L et al. iRECIST: guidelines for response criteria for use in trials testing immunotherapeutics. Lancet Oncol 2017", url: "https://doi.org/10.1016/S1470-2045(17)30074-8" }],
    trialSlugs: [],
  },
  {
    slug: "rano-bm-principles",
    format: "TYPE_K",
    topic: "Response assessment — RANO-BM",
    stem: "Regarding the RANO-BM criteria for brain metastases, indicate whether each statement is true or false.",
    options: [
      { id: "1", text: "A measurable lesion is contrast-enhancing with a longest diameter of at least 10 mm on MRI." },
      { id: "2", text: "Tumour burden is measured bidimensionally, as the product of perpendicular diameters." },
      { id: "3", text: "Progressive disease includes at least a 20% increase in the sum of longest diameters of target lesions relative to nadir." },
      { id: "4", text: "Corticosteroid dose and clinical status are part of the response assessment." },
    ],
    answer: { truth: { "1": true, "2": false, "3": true, "4": true } },
    explanation:
      "RANO-BM uses unidimensional (longest-diameter) measurement, aligning with RECIST 1.1, unlike the bidimensional product used in the original RANO criteria for gliomas. Measurable disease is a contrast-enhancing lesion ≥10 mm in longest diameter (visible on more than one axial slice). PD is a ≥20% increase in the sum of longest diameters relative to nadir (among other criteria); PR is a ≥30% decrease from baseline. Steroid use and clinical status are integrated into the composite response.",
    sources: [{ label: "Lin NU et al. Response assessment criteria for brain metastases: proposal from the RANO group. Lancet Oncol 2015", url: "https://doi.org/10.1016/S1470-2045(15)70057-4" }],
    trialSlugs: [],
  },
  {
    slug: "ctcae-grade-3-definition",
    format: "SINGLE_BEST_ANSWER",
    topic: "Toxicity — CTCAE grading",
    stem: "Under the general CTCAE grading definitions, an adverse event that is severe or medically significant but not immediately life-threatening, for which hospitalisation is indicated and which limits self-care activities of daily living, is graded as:",
    options: [
      { id: "A", text: "Grade 1" },
      { id: "B", text: "Grade 2" },
      { id: "C", text: "Grade 3" },
      { id: "D", text: "Grade 4" },
      { id: "E", text: "Grade 5" },
    ],
    answer: { correct: "C" },
    explanation:
      "CTCAE general definitions: Grade 1 mild (asymptomatic/mild, observation only); Grade 2 moderate (minimal, local or non-invasive intervention; limits age-appropriate instrumental ADL); Grade 3 severe or medically significant but not immediately life-threatening (hospitalisation or prolongation indicated; disabling; limits self-care ADL); Grade 4 life-threatening consequences, urgent intervention indicated; Grade 5 death related to the AE. Instrumental ADL (e.g. shopping, managing money) → grade 2; self-care ADL (bathing, dressing, feeding) → grade 3.",
    sources: [{ label: "NCI Common Terminology Criteria for Adverse Events (CTCAE) v5.0, 2017", url: "https://ctep.cancer.gov/protocoldevelopment/electronic_applications/ctc.htm" }],
    trialSlugs: [],
  },
  {
    slug: "schoenfeld-allocation-ratio",
    format: "SINGLE_BEST_ANSWER",
    topic: "Statistics — power and sample size",
    stem: "A phase III trial is planned to detect an OS hazard ratio of 0.75 with two-sided α 0.05 and 80% power using 1:1 randomisation (≈380 events by the Schoenfeld formula). The sponsor changes to 2:1 randomisation, keeping all other assumptions fixed. What happens to the required number of events?",
    options: [
      { id: "A", text: "It falls, because more patients receive the experimental drug" },
      { id: "B", text: "It is unchanged, because events depend only on HR, α and power" },
      { id: "C", text: "It rises by about 12.5%" },
      { id: "D", text: "It doubles" },
      { id: "E", text: "It rises by about 50%" },
    ],
    answer: { correct: "C" },
    explanation:
      "Schoenfeld: D = (z₁₋α/₂ + z₁₋β)² / [p(1 − p)(ln HR)²], where p is the proportion allocated to one arm. p(1 − p) is maximal at 1:1 (0.25). With 2:1, p = 2/3 and p(1 − p) = 2/9 ≈ 0.222, so D increases by 0.25 / 0.222 = 1.125 — about 12.5% more events (≈428). Try it in the Statistics Academy power calculator.",
    sources: [{ label: "Schoenfeld DA. Sample-size formula for the proportional-hazards regression model. Biometrics 1983", url: "https://doi.org/10.2307/2531021" }],
    trialSlugs: [],
  },
  {
    slug: "non-inferiority-ci-logic",
    format: "TRIAL_INTERPRETATION",
    topic: "Statistics — non-inferiority",
    stem: "A non-inferiority trial pre-specifies a hazard-ratio margin of 1.25 for disease-free survival (experimental vs standard). The result is HR 1.02 (95% CI 0.88–1.18). Which conclusion is correct?",
    options: [
      { id: "A", text: "Experimental therapy is superior" },
      { id: "B", text: "Non-inferiority is demonstrated; superiority is not" },
      { id: "C", text: "The result is inconclusive because the CI includes 1" },
      { id: "D", text: "Experimental therapy is inferior because the HR is above 1" },
      { id: "E", text: "Equivalence is demonstrated because the CI includes 1" },
    ],
    answer: { correct: "B" },
    explanation:
      "Non-inferiority on the HR scale requires the upper CI bound to lie below the margin: 1.18 < 1.25, so non-inferiority is shown. Because the CI includes 1, superiority is not shown. A point estimate above 1 does not mean inferiority. Equivalence would need the entire CI within a pre-specified two-sided range (e.g. 0.80–1.25) — here 0.88–1.18 would satisfy that only if equivalence had been the pre-specified hypothesis. (Synthetic numbers for teaching.)",
    sources: [{ label: "Piaggio G et al. CONSORT extension for non-inferiority and equivalence trials. JAMA 2012", url: "https://doi.org/10.1001/jama.2012.87802" }],
    trialSlugs: [],
  },
  {
    slug: "immortal-time-bias-responders",
    format: "SINGLE_BEST_ANSWER",
    topic: "Statistics — bias",
    stem: "A retrospective series reports that patients who developed immune-related adverse events (irAEs) on checkpoint inhibitors had longer overall survival from treatment start than those who did not. Which bias most threatens this comparison, and which analytical approach best addresses it?",
    options: [
      { id: "A", text: "Lead-time bias; adjust for stage at diagnosis" },
      { id: "B", text: "Immortal-time bias; use a landmark analysis or model irAE as a time-dependent covariate" },
      { id: "C", text: "Length-time bias; restrict to screen-detected cases" },
      { id: "D", text: "Attrition bias; use per-protocol analysis" },
      { id: "E", text: "Confounding by indication; use a propensity score for treatment received" },
    ],
    answer: { correct: "B" },
    explanation:
      "Patients must survive long enough to develop an irAE; classifying them as 'irAE' from time zero credits this event-free 'immortal' period to the irAE group and biases survival in its favour. Remedies: a landmark analysis (classify by irAE status at a fixed time, analyse only survivors from that point) or a Cox model with irAE as a time-dependent covariate. The same bias affects responder-vs-non-responder comparisons.",
    sources: [{ label: "Suissa S. Immortal time bias in pharmaco-epidemiology. Am J Epidemiol 2008", url: "https://doi.org/10.1093/aje/kwm324" }],
    trialSlugs: [],
  },
  {
    slug: "her2-ihc-scoring",
    format: "TYPE_K",
    topic: "Breast cancer — HER2 testing",
    stem: "Regarding ASCO/CAP HER2 immunohistochemistry scoring in invasive breast cancer, indicate whether each statement is true or false.",
    options: [
      { id: "1", text: "IHC 3+ requires circumferential, complete, intense membrane staining in more than 10% of tumour cells." },
      { id: "2", text: "IHC 2+ (weak-to-moderate complete membrane staining in >10% of cells) is equivocal and requires reflex in situ hybridisation." },
      { id: "3", text: "IHC 1+ is defined as faint, barely perceptible, incomplete membrane staining in more than 10% of tumour cells." },
      { id: "4", text: "Strong cytoplasmic staining without membrane staining is scored as IHC 2+." },
    ],
    answer: { truth: { "1": true, "2": true, "3": true, "4": false } },
    explanation:
      "ASCO/CAP: 3+ = complete, intense circumferential membrane staining in >10% of cells (positive); 2+ = weak-to-moderate complete membrane staining in >10% (equivocal → reflex ISH); 1+ = faint/barely perceptible incomplete membrane staining in >10% (negative; 'HER2-low' when relevant); 0 = no staining or incomplete faint staining in ≤10%. Only MEMBRANE staining is scored — cytoplasmic staining is disregarded.",
    sources: [{ label: "Wolff AC et al. HER2 testing in breast cancer: ASCO/CAP clinical practice guideline focused update. J Clin Oncol 2018", url: "https://doi.org/10.1200/JCO.2018.77.8738" }],
    trialSlugs: [],
  },
  {
    slug: "masaoka-koga-iva-vs-ivb",
    format: "STAGING",
    topic: "Thymic epithelial tumours — Masaoka–Koga",
    stem: "At thymectomy for a thymoma, separate pleural implants ('drop metastases') are found on the parietal pleura. There is no lymph-node or distant haematogenous spread. What is the Masaoka–Koga stage?",
    options: [
      { id: "A", text: "Stage IIb" },
      { id: "B", text: "Stage III" },
      { id: "C", text: "Stage IVa" },
      { id: "D", text: "Stage IVb" },
      { id: "E", text: "Stage III if the implants are resected" },
    ],
    answer: { correct: "C" },
    explanation:
      "Masaoka–Koga stage IVa = pleural or pericardial dissemination (implants); IVb = lymphogenous or haematogenous metastasis. Stage III is macroscopic invasion into neighbouring organs (pericardium, great vessels, lung). Resectability does not change the stage. (In TNM 8th edition, separate pleural/pericardial nodules are M1a.)",
    sources: [{ label: "Detterbeck FC et al. ITMIG definitions for Masaoka–Koga staging. J Thorac Oncol 2011", url: "https://doi.org/10.1097/JTO.0b013e31821e8cd6" }],
    trialSlugs: [],
  },
  {
    slug: "mesothelioma-histology-prognosis",
    format: "SINGLE_BEST_ANSWER",
    topic: "Mesothelioma — pathology",
    stem: "Which ordering of diffuse pleural mesothelioma histological subtypes runs from the most favourable to the least favourable prognosis?",
    options: [
      { id: "A", text: "Sarcomatoid > biphasic > epithelioid" },
      { id: "B", text: "Biphasic > epithelioid > sarcomatoid" },
      { id: "C", text: "Epithelioid > biphasic > sarcomatoid" },
      { id: "D", text: "Epithelioid > sarcomatoid > biphasic" },
      { id: "E", text: "Prognosis does not differ by histological subtype" },
    ],
    answer: { correct: "C" },
    explanation:
      "Epithelioid mesothelioma carries the best prognosis, sarcomatoid the worst, and biphasic is intermediate. Histological subtype is one of the strongest prognostic factors and informs surgical candidacy and the interpretation of histology-stratified trial results. The 2021 WHO classification also recommends grading epithelioid tumours (nuclear grade, necrosis).",
    sources: [{ label: "WHO Classification of Tumours: Thoracic Tumours, 5th edition (2021)" }],
    trialSlugs: [],
  },
  {
    slug: "competing-risks-1-minus-km",
    format: "SINGLE_BEST_ANSWER",
    topic: "Statistics — competing risks",
    stem: "In an elderly cohort, investigators estimate the cumulative incidence of cancer-specific death at 5 years using 1 − Kaplan–Meier, censoring patients who die of other causes. What is the main problem with this approach?",
    options: [
      { id: "A", text: "It underestimates the cumulative incidence of cancer-specific death" },
      { id: "B", text: "It overestimates the cumulative incidence, because competing deaths are treated as if those patients could still die of cancer" },
      { id: "C", text: "It is unbiased provided censoring is administrative" },
      { id: "D", text: "It only matters if the proportional-hazards assumption fails" },
      { id: "E", text: "It cannot be calculated when competing events exist" },
    ],
    answer: { correct: "B" },
    explanation:
      "Censoring competing events assumes those patients remain at risk of the event of interest, violating non-informative censoring. 1 − KM then estimates incidence in a hypothetical world without competing deaths and systematically overestimates the real-world probability. The cumulative incidence function (Aalen–Johansen) is appropriate; groups are compared with Gray's test, and regression uses cause-specific Cox (aetiology) or Fine–Gray (subdistribution, prediction) models.",
    sources: [{ label: "Austin PC, Lee DS, Fine JP. Introduction to the analysis of survival data in the presence of competing risks. Circulation 2016", url: "https://doi.org/10.1161/CIRCULATIONAHA.115.017719" }],
    trialSlugs: [],
  },
];
