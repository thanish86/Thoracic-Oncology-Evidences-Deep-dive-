import { EDITORIAL_STATUS, type DiseaseModuleContent } from "./types";

export const mesotheliomaModule: DiseaseModuleContent = {
  diseaseSlug: "mesothelioma",
  asOf: "2026-10-09",
  status:
    EDITORIAL_STATUS +
    " Peritoneal mesothelioma evidence is largely retrospective and frequently extrapolated from pleural trials; this is flagged in each section.",
  groups: [
    {
      id: "pleural",
      title: "Pleural mesothelioma",
      description: "The commonest presentation: asbestos-associated, staged by TNM, and treated with systemic therapy as the backbone in most patients.",
      submodule: true,
      sections: [
        {
          id: "pleural-exposures",
          title: "Exposures & epidemiology",
          summary:
            "Pleural mesothelioma is strongly linked to asbestos exposure, with a long latency between exposure and diagnosis. Incidence trends lag national asbestos-use histories by decades.",
          keyPoints: [
            "Asbestos (amphiboles such as crocidolite and amosite most potent; chrysotile also carcinogenic): occupational, para-occupational (household) and environmental exposure.",
            "Erionite, a fibrous zeolite mineral, causes endemic mesothelioma (classically in villages of Cappadocia, Turkey).",
            "Prior therapeutic radiation (e.g. mantle-field radiotherapy for lymphoma) is a recognised cause, often presenting at a younger age.",
            "Latency is typically several decades; there is no safe threshold of exposure.",
            "Occupational history is medico-legally important — document it and inform patients of compensation pathways.",
          ],
          pearls: ["Smoking is not an established risk factor for mesothelioma (unlike asbestos-related lung cancer)."],
          evidenceType: "mixed",
        },
        {
          id: "pleural-bap1",
          title: "BAP1 tumour predisposition syndrome",
          summary:
            "Germline BAP1 pathogenic variants cause an autosomal dominant cancer predisposition syndrome that includes mesothelioma, often with earlier onset and more indolent behaviour.",
          keyPoints: [
            "Associated tumours: mesothelioma (pleural and peritoneal), uveal melanoma, cutaneous melanoma, renal cell carcinoma, basal cell carcinoma and BAP1-inactivated melanocytic tumours.",
            "Clues: young age, minimal asbestos exposure, peritoneal primary, personal or family history of syndrome-associated cancers.",
            "Germline testing is recommended for patients with suggestive personal or family history; somatic BAP1 loss (by IHC) is common and does not by itself imply a germline variant.",
            "Carriers benefit from dermatological and ophthalmological surveillance.",
          ],
          evidenceType: "mixed",
        },
        {
          id: "pleural-histology",
          title: "Histology",
          summary:
            "The WHO classification (5th edition) recognises epithelioid, biphasic and sarcomatoid mesothelioma; histological subtype is the strongest pathological prognostic and predictive factor.",
          keyPoints: [
            "Epithelioid: most common and most favourable; architectural patterns and cytological features allow low- vs high-grade nuclear grading.",
            "Sarcomatoid: spindle-cell morphology, poorest prognosis; desmoplastic variant can mimic benign fibrosis.",
            "Biphasic: contains both epithelioid and sarcomatoid components; adequate tissue sampling is needed to recognise it.",
            "Mesothelioma in situ is a recognised diagnosis but requires loss of BAP1 and/or MTAP and careful clinico-radiological correlation.",
            "Thoracoscopic (VATS) pleural biopsy provides the best diagnostic and subtyping yield; pleural fluid cytology alone may be insufficient.",
          ],
          pearls: ["Non-epithelioid histology is where dual checkpoint blockade shows its largest relative advantage over chemotherapy."],
          evidenceType: "consensus",
        },
        {
          id: "pleural-ihc",
          title: "Immunohistochemistry & molecular markers",
          summary:
            "Diagnosis requires a panel approach: at least two mesothelial and two carcinoma markers, plus markers that separate malignant from reactive mesothelial proliferations.",
          keyPoints: [
            "Mesothelial markers: calretinin, WT1, D2-40 (podoplanin), CK5/6.",
            "Carcinoma markers (versus lung adenocarcinoma and others): claudin-4, TTF-1, napsin A, MOC-31, Ber-EP4, CEA; organ-specific markers depending on the differential.",
            "Malignant vs reactive: loss of nuclear BAP1 by IHC, loss of MTAP by IHC (surrogate of CDKN2A homozygous deletion) or CDKN2A deletion by FISH supports malignancy.",
            "Sarcomatoid mesothelioma may lose mesothelial markers; keratin positivity and clinico-radiological context are key.",
            "Invasion into fat or deeper tissues remains a cornerstone of the malignant diagnosis.",
          ],
          pearls: ["BAP1 loss and MTAP loss confirm malignancy when present, but their retention does not exclude it."],
          evidenceType: "consensus",
        },
        {
          id: "pleural-staging-imaging",
          title: "Staging & imaging",
          summary:
            "Pleural mesothelioma is staged with the IASLC/UICC TNM system. Radiological staging is challenging because of the rind-like growth pattern.",
          keyPoints: [
            "Contrast-enhanced CT chest–abdomen is the baseline; PET-CT helps detect extrathoracic disease and is used for surgical candidates.",
            "MRI clarifies chest-wall, diaphragmatic and mediastinal invasion when resection is considered.",
            "Invasive staging (EBUS, mediastinoscopy, laparoscopy) is used to exclude nodal or transdiaphragmatic disease before radical surgery.",
            "Response assessment uses modified RECIST for pleural mesothelioma (mRECIST 1.1), measuring tumour thickness perpendicular to the chest wall.",
            "The IASLC 9th edition revises T categories; confirm category definitions against the edition in use.",
          ],
          evidenceType: "consensus",
        },
        {
          id: "pleural-surgery",
          title: "Surgical selection: P/D vs EPP and the MARS debate",
          summary:
            "The role of radical surgery is contested. Randomised trials have not shown benefit from extrapleural pneumonectomy or extended pleurectomy/decortication over non-surgical management.",
          keyPoints: [
            "Extrapleural pneumonectomy (EPP) has been largely abandoned owing to morbidity; MARS did not support it.",
            "Extended pleurectomy/decortication (P/D) plus chemotherapy did not improve outcomes versus chemotherapy alone and was associated with more serious adverse events (MARS 2).",
            "Advocates argue for selection in specialist centres (epithelioid, limited-volume, node-negative disease); any radical surgery should be within trials or expert multidisciplinary programmes.",
            "Partial pleurectomy via VATS for symptom control has not shown advantages over talc pleurodesis.",
          ],
          pearls: ["MARS 2 was a randomised comparison of surgery plus chemotherapy vs chemotherapy alone — not of P/D vs EPP."],
          trialSlugs: ["mars", "mars-2"],
          evidenceType: "prospective",
        },
        {
          id: "pleural-chemotherapy",
          title: "Chemotherapy",
          summary:
            "Platinum plus pemetrexed has been the systemic backbone since EMPHACIS and remains part of first-line options, increasingly combined with immunotherapy.",
          keyPoints: [
            "Cisplatin plus pemetrexed improved survival over cisplatin alone (EMPHACIS); carboplatin substitution is common.",
            "Folic acid and vitamin B12 supplementation reduce pemetrexed toxicity.",
            "Chemo-immunotherapy: pembrolizumab with platinum–pemetrexed (IND.227); durvalumab with chemotherapy in a single-arm phase II (DREAM).",
            "Second line: gemcitabine or vinorelbine; ramucirumab with gemcitabine (RAMES, randomised phase II); nivolumab versus placebo in relapsed disease (CONFIRM).",
          ],
          trialSlugs: ["emphacis", "ind-227", "dream", "rames", "confirm"],
          evidenceType: "prospective",
        },
        {
          id: "pleural-dual-checkpoint",
          title: "Dual checkpoint inhibition",
          summary:
            "Nivolumab plus ipilimumab improved overall survival versus platinum–pemetrexed in unresectable pleural mesothelioma, with the largest relative benefit in non-epithelioid histology (CheckMate 743).",
          keyPoints: [
            "Preferred first-line option for non-epithelioid disease; for epithelioid disease, chemo-immunotherapy, dual ICI or chemotherapy ± bevacizumab are individualised.",
            "PD-L1 expression is not required for treatment selection.",
            "Immune-related adverse events of combined PD-1/CTLA-4 blockade require structured monitoring.",
            "Response patterns can be atypical; assess with mRECIST and clinical context.",
          ],
          trialSlugs: ["checkmate-743"],
          evidenceType: "prospective",
        },
        {
          id: "pleural-antiangiogenic",
          title: "Antiangiogenic therapy",
          summary:
            "Adding bevacizumab to cisplatin–pemetrexed improved survival in selected patients (MAPS), though use varies by region and eligibility.",
          keyPoints: [
            "MAPS excluded patients with significant cardiovascular comorbidity, bleeding or thrombosis risk.",
            "Bevacizumab-specific toxicities: hypertension, proteinuria, thromboembolism and bleeding.",
            "Ramucirumab with gemcitabine has randomised phase II support in the second line (RAMES).",
          ],
          trialSlugs: ["maps", "rames"],
          evidenceType: "prospective",
        },
        {
          id: "pleural-radiation",
          title: "Radiotherapy",
          summary:
            "Radiotherapy has limited, specific roles: palliation of pain and selected adjuvant use within expert programmes.",
          keyPoints: [
            "Palliative radiotherapy for chest-wall pain and localised symptomatic disease.",
            "Prophylactic irradiation of intervention tracts is not routinely recommended based on randomised trials.",
            "Hemithoracic IMRT after lung-sparing surgery has been explored prospectively but remains confined to specialist centres; radical hemithoracic RT after EPP did not show benefit.",
          ],
          evidenceType: "mixed",
        },
        {
          id: "pleural-recurrence",
          title: "Recurrence & later lines",
          summary:
            "After first-line therapy, options depend on the prior regimen; evidence for later lines is modest and trial enrolment is encouraged.",
          keyPoints: [
            "After first-line dual ICI: platinum–pemetrexed is a rational choice; rechallenge with pemetrexed is considered after prior durable benefit.",
            "After first-line chemotherapy: immunotherapy (CONFIRM) if not previously given; gemcitabine ± ramucirumab or vinorelbine.",
            "Emerging approaches include targeting MTAP/CDKN2A loss, mesothelin-directed therapies and cell therapies, all within trials.",
          ],
          trialSlugs: ["confirm", "rames"],
          evidenceType: "mixed",
        },
        {
          id: "pleural-palliative-procedures",
          title: "Palliative procedures: IPC & talc pleurodesis",
          summary:
            "Controlling breathlessness from recurrent pleural effusion is central to quality of life and is guided by lung re-expansion and patient preference.",
          keyPoints: [
            "Talc pleurodesis (via thoracoscopic poudrage or slurry) for patients with expandable lung.",
            "Indwelling pleural catheter (IPC) for non-expandable (trapped) lung, failed pleurodesis, or patient preference for ambulatory management; can be combined with talc instillation.",
            "Avoid repeated therapeutic aspirations without a definitive plan.",
            "Early specialist palliative care, pain management (including chest-wall pain) and breathlessness support improve symptom control.",
          ],
          pearls: ["Trapped lung means pleurodesis will fail — choose an IPC."],
          evidenceType: "prospective",
        },
      ],
    },
    {
      id: "peritoneal",
      title: "Peritoneal mesothelioma",
      description: "Rarer, less tightly linked to asbestos, and managed in specialist peritoneal-surface centres; systemic therapy evidence is mostly extrapolated from pleural trials.",
      submodule: true,
      sections: [
        {
          id: "peritoneal-exposures",
          title: "Exposures & epidemiology",
          summary:
            "Peritoneal mesothelioma accounts for a minority of mesotheliomas and has a weaker association with asbestos, especially in women.",
          keyPoints: [
            "Asbestos remains a risk factor, particularly in men with heavy exposure; therapeutic abdominal radiation is a recognised cause.",
            "Germline predisposition (notably BAP1) is relatively more common than in pleural disease.",
            "A rare subset, enriched in younger patients without asbestos exposure, harbours ALK rearrangements or other gene fusions.",
          ],
          evidenceType: "retrospective",
        },
        {
          id: "peritoneal-genetics",
          title: "BAP1 & genetic testing",
          summary: "Germline testing is especially relevant in peritoneal mesothelioma because of the higher prevalence of predisposition syndromes.",
          keyPoints: [
            "Offer germline testing (multigene panel including BAP1) to patients with peritoneal mesothelioma, particularly at younger ages.",
            "Somatic BAP1 loss is frequent and is used diagnostically.",
            "Tumour molecular profiling may identify rare fusions (e.g. ALK) relevant to trial eligibility.",
          ],
          evidenceType: "consensus",
        },
        {
          id: "peritoneal-histology-ihc",
          title: "Histology & IHC",
          summary:
            "The same mesothelial and carcinoma marker principles apply, but the differential diagnosis shifts toward serous carcinoma and other peritoneal surface malignancies.",
          keyPoints: [
            "Epithelioid histology predominates; biphasic and sarcomatoid tumours are less common and carry a poor prognosis.",
            "Calretinin, WT1, D2-40 and CK5/6 are positive, but WT1 and D2-40 are also expressed by serous carcinoma — add PAX8, oestrogen receptor, claudin-4 and MOC-31/Ber-EP4.",
            "BAP1 and MTAP loss help separate mesothelioma from reactive mesothelial hyperplasia.",
            "Well-differentiated papillary mesothelial tumour and multicystic mesothelial tumour are separate, indolent entities and must not be confused with mesothelioma.",
          ],
          pearls: ["WT1 positivity does not distinguish peritoneal mesothelioma from serous carcinoma — PAX8 does."],
          evidenceType: "consensus",
        },
        {
          id: "peritoneal-staging-imaging",
          title: "Staging & imaging",
          summary:
            "There is no universally adopted AJCC/UICC TNM stage for peritoneal mesothelioma; extent of disease is quantified with the peritoneal cancer index (PCI).",
          keyPoints: [
            "Contrast-enhanced CT is standard; MRI (with diffusion-weighted imaging) improves estimation of small-volume disease; PET-CT can detect extraperitoneal spread.",
            "Diagnostic laparoscopy provides histology and assesses resectability and PCI.",
            "A TNM-type staging proposal (incorporating PCI, nodal status and extraperitoneal metastases) exists for registry and research use.",
          ],
          evidenceType: "retrospective",
        },
        {
          id: "peritoneal-crs-hipec",
          title: "Cytoreductive surgery & HIPEC",
          summary:
            "In selected patients with epithelioid histology and resectable disease, cytoreductive surgery (CRS) with hyperthermic intraperitoneal chemotherapy (HIPEC) is the treatment associated with the longest survival, based on non-randomised series.",
          keyPoints: [
            "Selection: epithelioid histology, good performance status, absence of extra-abdominal disease, disease amenable to complete cytoreduction; nodal involvement and high proliferation are adverse.",
            "Completeness of cytoreduction (CC score) is the dominant prognostic factor.",
            "Performed in high-volume peritoneal-surface malignancy centres given substantial morbidity.",
            "Perioperative or neoadjuvant systemic therapy is used variably; prospective comparative data are lacking.",
            "No randomised trial has compared CRS/HIPEC with systemic therapy alone.",
          ],
          evidenceType: "retrospective",
        },
        {
          id: "peritoneal-systemic",
          title: "Systemic therapy",
          summary:
            "For unresectable or recurrent disease, systemic therapy is extrapolated from pleural mesothelioma, as peritoneal patients were largely excluded from pivotal trials.",
          keyPoints: [
            "Platinum–pemetrexed is the standard chemotherapy backbone; bevacizumab may be added in selected patients.",
            "Immune checkpoint inhibitors are used by extrapolation; CONFIRM included some patients with peritoneal disease.",
            "ALK-rearranged peritoneal mesothelioma may respond to ALK inhibitors (case-level evidence).",
          ],
          trialSlugs: ["confirm"],
          evidenceType: "mixed",
        },
        {
          id: "peritoneal-recurrence-palliation",
          title: "Recurrence & palliation",
          summary: "Recurrence is usually peritoneal. Management prioritises symptom control, bowel function and ascites.",
          keyPoints: [
            "Selected patients with limited recurrence after a long interval may be considered for repeat cytoreduction.",
            "Malignant ascites: paracentesis; indwelling peritoneal catheters for recurrent ascites.",
            "Malignant bowel obstruction requires multidisciplinary management (surgical, endoscopic, pharmacological and nutritional).",
            "Early palliative care involvement is recommended.",
          ],
          evidenceType: "retrospective",
        },
      ],
    },
  ],
};
