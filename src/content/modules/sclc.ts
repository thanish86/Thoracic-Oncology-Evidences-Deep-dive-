import { EDITORIAL_STATUS, type DiseaseModuleContent } from "./types";

export const sclcModule: DiseaseModuleContent = {
  diseaseSlug: "sclc",
  asOf: "2026-10-09",
  status: EDITORIAL_STATUS,
  groups: [
    {
      id: "foundations",
      title: "Biology, pathology & staging",
      sections: [
        {
          id: "biology",
          title: "Biology & transcriptional subtypes",
          summary:
            "Small cell lung cancer is a high-grade neuroendocrine carcinoma, almost universally driven by inactivation of TP53 and RB1 and strongly linked to heavy smoking. Transcriptional subtyping is reshaping biology but not yet routine treatment selection.",
          keyPoints: [
            "Near-universal biallelic loss of TP53 and RB1; frequent MYC-family amplification and NOTCH pathway inactivation.",
            "Transcriptional subtypes defined by dominant regulators: SCLC-A (ASCL1), SCLC-N (NEUROD1), SCLC-P (POU2F3) and an inflamed/YAP1-related group (SCLC-I) proposed as more immunotherapy-responsive; YAP1 as a standalone subtype is debated.",
            "Subtypes show plasticity, including under treatment pressure, contributing to rapid acquired resistance.",
            "DLL3 is an inhibitory Notch ligand expressed on the surface of most SCLC cells (especially ASCL1-high), making it a therapeutic target.",
            "Histological transformation from EGFR-mutant adenocarcinoma produces SCLC that retains the original EGFR mutation.",
          ],
          pearls: ["Never-smoker with “SCLC”? Look for transformed EGFR-mutant disease or an alternative diagnosis."],
          evidenceType: "mixed",
        },
        {
          id: "pathology",
          title: "Pathology",
          summary:
            "Diagnosis rests on morphology — small cells with scant cytoplasm, finely granular chromatin, absent nucleoli, nuclear moulding, high mitotic rate and necrosis — supported by IHC.",
          keyPoints: [
            "Neuroendocrine markers (synaptophysin, chromogranin, INSM1, CD56) support but are not required for diagnosis; a minority are marker-negative.",
            "TTF-1 is positive in most cases; Ki-67 proliferation is very high.",
            "Crush artefact on small biopsies is common — beware mimics such as lymphoma, basaloid squamous carcinoma and carcinoid tumours.",
            "Combined SCLC contains a non-small cell component and is classified as combined SCLC.",
            "Large-cell neuroendocrine carcinoma is the main high-grade differential within the neuroendocrine spectrum.",
          ],
          evidenceType: "consensus",
        },
        {
          id: "staging",
          title: "Staging: VALG and TNM",
          summary:
            "The Veterans Administration Lung Study Group (VALG) limited/extensive classification remains clinically embedded, while TNM is recommended for all patients and essential for identifying surgical candidates.",
          keyPoints: [
            "Limited stage: disease confined to one hemithorax that can be encompassed within a single tolerable radiation field.",
            "Extensive stage: disease beyond limited-stage boundaries, including distant metastases and malignant effusions in most definitions.",
            "TNM (IASLC 8th/9th edition) should be recorded; T1–2 N0 disease, confirmed by invasive mediastinal staging, may be considered for resection followed by adjuvant chemotherapy.",
            "Staging work-up: CT chest–abdomen, PET-CT where it would change management, and brain MRI for all patients.",
          ],
          pearls: ["Surgery for SCLC requires pathologically confirmed N0 — PET-negative is not enough."],
          evidenceType: "consensus",
        },
      ],
    },
    {
      id: "limited-stage",
      title: "Limited-stage disease",
      sections: [
        {
          id: "ls-chemoradiotherapy",
          title: "Concurrent chemoradiotherapy",
          summary:
            "Cisplatin–etoposide with early concurrent thoracic radiotherapy is the curative-intent standard for limited-stage SCLC, now followed by consolidation immunotherapy.",
          keyPoints: [
            "Thoracic radiotherapy should start early, ideally with the first or second chemotherapy cycle.",
            "Twice-daily hyperfractionated radiotherapy improved outcomes over once-daily radiotherapy of the same total dose (INT 0096).",
            "Higher-dose once-daily regimens were not shown to be superior to twice-daily hyperfractionation (CONVERT, CALGB 30610/RTOG 0538); both are accepted, chosen by logistics and toxicity.",
            "Consolidation durvalumab after chemoradiotherapy without progression (ADRIATIC).",
            "Carboplatin may substitute for cisplatin when cisplatin is contraindicated.",
          ],
          pearls: ["“Once vs twice daily” — CONVERT tested superiority of once-daily and did not show it; it was not an equivalence trial."],
          trialSlugs: ["int-0096", "convert", "calgb-30610", "adriatic"],
          evidenceType: "prospective",
        },
        {
          id: "pci-vs-mri",
          title: "PCI vs MRI surveillance",
          summary:
            "Prophylactic cranial irradiation (PCI) historically reduced brain metastases after response to therapy, but the era of routine MRI staging and surveillance has prompted re-evaluation.",
          keyPoints: [
            "Limited stage: PCI after good response remains an option; older evidence predates routine MRI staging. MRI surveillance is an accepted alternative, especially for older patients or those with smaller tumours.",
            "Extensive stage: an earlier trial without mandatory MRI suggested benefit (EORTC), whereas a later trial with MRI confirmation and surveillance showed no survival benefit from PCI (Japanese trial).",
            "Neurocognitive toxicity can be mitigated with hippocampal avoidance and memantine.",
            "Shared decision-making should weigh cognitive risk against intracranial control; MRI surveillance schedules require reliable access.",
          ],
          pearls: ["The key methodological difference between the EORTC and Japanese PCI trials is baseline and follow-up MRI."],
          trialSlugs: ["eortc-pci-es-sclc", "japanese-pci-es-sclc"],
          evidenceType: "mixed",
        },
      ],
    },
    {
      id: "extensive-stage",
      title: "Extensive-stage disease",
      sections: [
        {
          id: "es-chemo-io",
          title: "First-line chemo-immunotherapy",
          summary:
            "Platinum–etoposide plus a PD-L1 inhibitor followed by maintenance immunotherapy is the standard first-line therapy for extensive-stage SCLC.",
          keyPoints: [
            "Atezolizumab (IMpower133) and durvalumab (CASPIAN) with platinum–etoposide improved overall survival.",
            "Pembrolizumab (KEYNOTE-604) improved progression-free survival, but overall survival did not meet its prespecified significance threshold.",
            "Maintenance nivolumab ± ipilimumab after chemotherapy did not improve overall survival (CheckMate 451).",
            "A minority of patients derive durable benefit; robust predictive biomarkers are lacking (PD-L1 and TMB are not used for selection).",
            "Patients with significant autoimmune disease or poor performance status were under-represented in pivotal trials.",
          ],
          trialSlugs: ["impower133", "caspian", "keynote-604", "checkmate-451"],
          evidenceType: "prospective",
        },
        {
          id: "thoracic-consolidation",
          title: "Thoracic consolidation radiotherapy",
          summary:
            "Consolidative thoracic radiotherapy for residual intrathoracic disease after response to first-line chemotherapy reduces intrathoracic progression.",
          keyPoints: [
            "CREST did not meet its primary survival endpoint, but intrathoracic recurrence was reduced and secondary analyses favoured thoracic RT.",
            "Its role alongside chemo-immunotherapy is being clarified prospectively; it is reasonable in selected patients with residual thoracic disease and limited extrathoracic burden.",
          ],
          trialSlugs: ["crest"],
          evidenceType: "mixed",
        },
        {
          id: "relapse",
          title: "Relapse & platinum sensitivity",
          summary:
            "Most patients relapse. The interval from the end of first-line platinum to relapse classifies sensitivity and guides re-treatment.",
          keyPoints: [
            "Refractory: progression during first-line therapy; resistant: relapse within 90 days of completion; sensitive: relapse after ≥90 days (some guidelines use longer intervals for platinum rechallenge).",
            "Platinum-sensitive relapse: platinum–etoposide rechallenge is an option.",
            "Second-line options include topotecan and lurbinectedin (single-arm basket evidence); anthracycline-based regimens are alternatives.",
            "Nivolumab monotherapy ± ipilimumab showed activity in relapsed disease (CheckMate 032) but immunotherapy is now usually given first line.",
          ],
          trialSlugs: ["lurbinectedin-basket", "checkmate-032"],
          evidenceType: "mixed",
        },
        {
          id: "dll3-tarlatamab",
          title: "DLL3 & tarlatamab",
          summary:
            "Tarlatamab, a bispecific T-cell engager (BiTE) targeting DLL3 and CD3, is active in previously treated SCLC and has been compared with chemotherapy in a randomised phase III trial.",
          keyPoints: [
            "Evidence: phase II DeLLphi-301 and phase III DeLLphi-304 in previously treated SCLC.",
            "DLL3 expression testing is not required for treatment selection in current practice.",
            "Cytokine release syndrome and immune effector cell-associated neurotoxicity syndrome (ICANS) occur mostly early, during step-up dosing, and require monitoring and management protocols.",
            "Other DLL3-directed modalities (T-cell engagers, CAR-T, radioligands) are in development.",
          ],
          pearls: ["CRS and ICANS are graded with ASTCT consensus criteria — the same framework as CAR-T therapy."],
          trialSlugs: ["dellphi-301", "dellphi-304"],
          evidenceType: "prospective",
        },
        {
          id: "cns",
          title: "CNS disease",
          summary: "Brain metastases are frequent at diagnosis and during the disease course.",
          keyPoints: [
            "Brain MRI is required at staging for all patients.",
            "Symptomatic brain metastases are usually treated with radiotherapy; whole-brain RT has historically been standard, with stereotactic radiosurgery increasingly used for limited metastases.",
            "Asymptomatic brain metastases at diagnosis of extensive-stage disease may respond to first-line chemo-immunotherapy, with close MRI monitoring.",
            "Leptomeningeal disease carries a poor prognosis.",
          ],
          evidenceType: "mixed",
        },
        {
          id: "paraneoplastic-supportive",
          title: "Paraneoplastic syndromes & supportive care",
          summary:
            "SCLC is the classic source of endocrine and neurological paraneoplastic syndromes. Recognition can lead to diagnosis and affects management.",
          keyPoints: [
            "SIADH: hyponatraemia; treat the cancer, fluid restriction, and specialist agents (e.g. tolvaptan) with careful correction rates.",
            "Ectopic ACTH (Cushing's syndrome): hypokalaemia, hyperglycaemia, infection risk; associated with poorer outcomes.",
            "Lambert–Eaton myasthenic syndrome: P/Q-type voltage-gated calcium channel antibodies; proximal weakness improving with repeated effort, autonomic features.",
            "Anti-Hu (ANNA-1) syndromes: sensory neuronopathy, encephalomyelitis; others include paraneoplastic cerebellar degeneration and limbic encephalitis.",
            "Supportive care: early palliative care, G-CSF where indicated, thromboprophylaxis assessment and management of superior vena cava obstruction (stenting ± urgent therapy).",
          ],
          pearls: [
            "Hyponatraemia correction too fast risks osmotic demyelination.",
            "LEMS reflexes increase after sustained contraction (post-exercise facilitation) — unlike myasthenia gravis, which fatigues.",
          ],
          evidenceType: "consensus",
        },
      ],
    },
  ],
};
