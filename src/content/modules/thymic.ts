import { EDITORIAL_STATUS, type DiseaseModuleContent } from "./types";

export const thymicModule: DiseaseModuleContent = {
  diseaseSlug: "thymic",
  asOf: "2026-10-09",
  status:
    EDITORIAL_STATUS +
    " Thymic epithelial tumours are rare: most recommendations rest on retrospective series, small phase II trials and expert consensus (ITMIG, ESMO/EURACAN, NCCN). Each section is labelled with its predominant evidence type.",
  groups: [
    {
      id: "foundations",
      title: "Foundations",
      sections: [
        {
          id: "epidemiology",
          title: "Epidemiology",
          summary:
            "Thymic epithelial tumours (TETs) are rare anterior mediastinal neoplasms, most often diagnosed in middle age. They comprise thymomas, thymic carcinomas and thymic neuroendocrine tumours.",
          keyPoints: [
            "TETs are the most common primary tumours of the anterior (prevascular) mediastinum in adults, but rare overall.",
            "No strong environmental risk factors are established.",
            "Differential diagnosis of an anterior mediastinal mass: thymic tumour, lymphoma, germ cell tumour, thyroid goitre and thymic hyperplasia/cyst.",
            "Thymomas are often indolent with late recurrence; thymic carcinomas are aggressive with frequent nodal and distant spread.",
          ],
          pearls: ["Anterior mediastinal mass differential: the “4 Ts” — thymoma, teratoma (germ cell), “terrible” lymphoma and thyroid."],
          evidenceType: "retrospective",
        },
        {
          id: "paraneoplastic-autoimmune",
          title: "Paraneoplastic & autoimmune syndromes",
          summary:
            "Thymoma uniquely causes autoimmunity through defective T-cell selection. Myasthenia gravis is the most frequent association and shapes perioperative and systemic management.",
          keyPoints: [
            "Myasthenia gravis (anti-acetylcholine receptor antibodies) is most often associated with type AB and B thymomas and is rare in thymic carcinoma.",
            "Screen all suspected thymoma patients clinically (and with AChR antibodies) for myasthenia before surgery to prevent perioperative myasthenic crisis.",
            "Other associations: pure red cell aplasia, Good syndrome (hypogammaglobulinaemia with immunodeficiency), autoimmune hepatitis, myositis/myocarditis, and thymoma-associated multiorgan autoimmunity.",
            "Autoimmune phenomena can appear or worsen after thymectomy and do not reliably track tumour activity.",
          ],
          pearls: [
            "Myasthenia with thymic carcinoma is unusual — reconsider the histology if it is present.",
            "Good syndrome: think thymoma in an adult with recurrent sino-pulmonary infections and low immunoglobulins.",
          ],
          evidenceType: "retrospective",
        },
        {
          id: "who-classification",
          title: "WHO classification",
          summary:
            "The WHO classification (5th edition) separates thymomas (A, AB, B1, B2, B3, plus rare types) from thymic carcinomas, based on epithelial cell morphology and the proportion of immature lymphocytes.",
          keyPoints: [
            "Type A: bland spindle/oval epithelial cells with few lymphocytes; atypical type A variant recognised.",
            "Type AB: mixture of lymphocyte-poor type A areas and lymphocyte-rich type B-like areas.",
            "Type B1: thymus-like, lymphocyte-rich with medullary islands.",
            "Type B2: increased epithelial cells scattered among abundant lymphocytes.",
            "Type B3: sheets of mildly atypical polygonal epithelial cells with few lymphocytes; behaves more aggressively than other thymomas.",
            "Thymic carcinoma: overt cytological malignancy, most commonly squamous cell carcinoma; lacks immature lymphocytes. NUT carcinoma is a distinct, highly aggressive entity in the differential.",
            "Molecular: GTF2I mutations are characteristic of type A and AB thymomas; thymic carcinomas show different alterations, with KIT mutations being rare.",
          ],
          pearls: ["Mixed histologies are common; report each component — the highest-grade component drives behaviour."],
          evidenceType: "consensus",
        },
        {
          id: "ihc",
          title: "Immunohistochemistry",
          summary:
            "IHC distinguishes thymic carcinoma from thymoma and from metastatic carcinomas, and highlights the immature T-cell population of thymomas.",
          keyPoints: [
            "CD5 and CD117 (KIT) are expressed by epithelial cells in most thymic carcinomas but usually not in thymomas or most lung squamous carcinomas — useful in excluding metastasis from the lung.",
            "TdT (with CD1a and CD99) marks immature T lymphocytes abundant in type B and AB thymomas; their absence supports thymic carcinoma.",
            "Keratins (e.g. AE1/AE3, CK19) and p63/p40 highlight thymic epithelial cells.",
            "Lymphocyte-rich thymoma vs T-lymphoblastic lymphoma: both contain TdT-positive cells, but a keratin-positive epithelial meshwork indicates thymoma.",
            "NUT IHC should be performed in poorly differentiated midline carcinomas.",
          ],
          pearls: ["TdT positivity is in the lymphocytes, not the tumour epithelium — a classic trap."],
          evidenceType: "consensus",
        },
        {
          id: "staging",
          title: "Staging: Masaoka–Koga and TNM",
          summary:
            "Masaoka–Koga staging (with ITMIG refinements) remains widely used for prognosis and treatment decisions; TNM (IASLC/ITMIG) is now recommended and incorporates nodal staging.",
          keyPoints: [
            "Masaoka–Koga I: grossly and microscopically completely encapsulated tumour.",
            "IIa: microscopic transcapsular invasion. IIb: macroscopic invasion into surrounding thymic or fatty tissue, or grossly adherent to but not breaking through mediastinal pleura or pericardium.",
            "III: macroscopic invasion into neighbouring organs (e.g. pericardium, great vessels, lung).",
            "IVa: pleural or pericardial dissemination. IVb: lymphogenous or haematogenous metastasis.",
            "TNM: T categories by depth of invasion of adjacent structures; N1 anterior (perithymic) nodes, N2 deep intrathoracic or cervical nodes; M1a separate pleural or pericardial nodules, M1b pulmonary intraparenchymal nodules or distant organ metastasis.",
            "The IASLC 9th edition introduces refinements; confirm category definitions against the edition in use at the treating centre.",
          ],
          pearls: ["Masaoka–Koga has no nodal descriptor before stage IVb — a key reason TNM was introduced."],
          evidenceType: "consensus",
        },
      ],
    },
    {
      id: "management",
      title: "Management",
      sections: [
        {
          id: "resectability",
          title: "Resectability & R0/R1/R2",
          summary:
            "Complete (R0) resection is the most important modifiable prognostic factor. Resectability is determined by a multidisciplinary thoracic team.",
          keyPoints: [
            "Standard procedure: complete thymectomy (tumour plus residual thymus and perithymic fat), usually via sternotomy; minimally invasive approaches for smaller, early-stage tumours in experienced hands.",
            "Biopsy is avoided when a resectable thymoma is clinically and radiologically likely, to prevent seeding; it is required when the diagnosis is uncertain or induction therapy is planned.",
            "R0 = microscopically complete; R1 = microscopic residual; R2 = macroscopic residual disease. Surgeons should mark areas of concern with clips for radiotherapy planning.",
            "Debulking (R2) surgery may have a role in selected thymomas but not generally in thymic carcinoma.",
            "Pleural dissemination (stage IVa) can be resected in selected patients, sometimes with pleurectomy/decortication or extrapleural approaches.",
          ],
          evidenceType: "retrospective",
        },
        {
          id: "port",
          title: "Postoperative radiotherapy (PORT)",
          summary:
            "PORT decisions rely on retrospective data and consensus, balancing local control against cardiopulmonary toxicity.",
          keyPoints: [
            "Not recommended after R0 resection of Masaoka–Koga stage I thymoma.",
            "Stage II: considered selectively for aggressive histology (B3) or close margins; data conflict.",
            "Stage III–IVa and incomplete resection (R1/R2): PORT is generally recommended.",
            "Thymic carcinoma: PORT is more often recommended after resection beyond stage I.",
            "Modern conformal techniques (IMRT, proton therapy) reduce dose to heart and lungs.",
          ],
          evidenceType: "retrospective",
        },
        {
          id: "definitive-rt",
          title: "Definitive radiotherapy",
          summary:
            "For unresectable or medically inoperable disease, radiotherapy (often with chemotherapy) can provide durable local control.",
          keyPoints: [
            "Used after induction chemotherapy when resection remains infeasible.",
            "Concurrent chemoradiotherapy may be considered for thymic carcinoma.",
            "Palliative radiotherapy for symptomatic local or metastatic disease.",
          ],
          evidenceType: "retrospective",
        },
        {
          id: "induction-cap",
          title: "Induction & cytotoxic chemotherapy",
          summary:
            "Induction chemotherapy can render locally advanced thymic tumours resectable. Anthracycline-containing regimens are favoured for thymoma; carboplatin–paclitaxel is favoured for thymic carcinoma.",
          keyPoints: [
            "Thymoma: cisplatin, doxorubicin and cyclophosphamide (CAP) is the classic regimen, supported by phase II intergroup data.",
            "Thymic carcinoma: carboplatin plus paclitaxel is commonly used, supported by phase II data.",
            "Alternatives: cisplatin–etoposide, ADOC.",
            "After induction, reassess for surgery; radiotherapy follows if resection is incomplete or not feasible.",
          ],
          trialSlugs: ["ecog-pac-thymoma", "ecog-carboplatin-paclitaxel-thymic"],
          evidenceType: "prospective",
        },
        {
          id: "recurrent-metastatic",
          title: "Recurrent & metastatic disease",
          summary:
            "Recurrent thymoma can often be treated with repeat resection or local therapy. Systemic options after platinum are limited and largely supported by single-arm phase II trials.",
          keyPoints: [
            "Re-resection of isolated recurrences (including pleural) is associated with favourable outcomes in selected patients.",
            "Rechallenge with the initial platinum regimen may be considered after a long treatment-free interval.",
            "Thymic carcinoma: multitargeted antiangiogenic TKIs (sunitinib, lenvatinib — the latter in the REMORA phase II trial) have activity independent of KIT status.",
            "KIT mutations are rare in thymic carcinoma; when a sensitising mutation is found, KIT inhibitors (e.g. imatinib) can be considered.",
            "Other options: everolimus, octreotide ± prednisone (for octreotide scan-positive thymoma), capecitabine–gemcitabine, pemetrexed.",
            "Immunotherapy: pembrolizumab is active in thymic carcinoma, but immune-related adverse events — notably myocarditis and myositis — are more frequent and severe than in other cancers, particularly in thymoma.",
            "Checkpoint inhibitors are generally avoided in thymoma outside trials, and require baseline cardiac and muscle work-up (troponin, CK) and close monitoring when used.",
          ],
          pearls: ["Myositis–myocarditis–myasthenia overlap is a lethal ICI toxicity triad — check troponin and CK early."],
          trialSlugs: ["sunitinib-thymic-carcinoma", "remora", "pembrolizumab-thymic-carcinoma"],
          evidenceType: "mixed",
        },
        {
          id: "surveillance",
          title: "Surveillance",
          summary:
            "Because thymoma can recur many years after resection, long-term imaging surveillance is recommended.",
          keyPoints: [
            "CT chest surveillance is more frequent in the first years, then annual for a prolonged period (consensus recommends long-term follow-up extending beyond a decade for thymoma).",
            "Thymic carcinoma and B3 thymoma warrant closer early follow-up.",
            "Monitor for new autoimmune disorders and second malignancies.",
            "MRI can reduce radiation exposure in younger patients.",
          ],
          evidenceType: "consensus",
        },
      ],
    },
  ],
};
