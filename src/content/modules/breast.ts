import { EDITORIAL_STATUS, type DiseaseModuleContent } from "./types";

export const breastModule: DiseaseModuleContent = {
  diseaseSlug: "breast",
  asOf: "2026-10-09",
  status: EDITORIAL_STATUS,
  groups: [
    {
      id: "foundations",
      title: "Foundations",
      description: "Epidemiology, inherited risk, pathology and the receptor-defined taxonomy that drives every downstream decision.",
      sections: [
        {
          id: "epidemiology-risk",
          title: "Epidemiology & risk factors",
          summary:
            "Breast cancer is the most commonly diagnosed cancer in women worldwide. Risk reflects cumulative oestrogen exposure, breast density, inherited susceptibility and prior chest irradiation, layered on age as the dominant factor.",
          keyPoints: [
            "Age is the strongest single risk factor; incidence rises steeply after the menopause.",
            "Hormonal and reproductive factors: early menarche, late menopause, nulliparity or late first pregnancy, and menopausal hormone therapy (particularly combined oestrogen–progestogen).",
            "Lifestyle factors: alcohol, postmenopausal obesity and physical inactivity; breastfeeding is protective.",
            "High mammographic density both increases risk and reduces mammographic sensitivity (masking).",
            "Proliferative lesions with atypia (ADH, ALH) and lobular carcinoma in situ are risk markers that justify enhanced surveillance and discussion of endocrine risk reduction.",
            "Mantle-field irradiation in childhood or young adulthood (e.g. for Hodgkin lymphoma) confers high risk and qualifies for MRI-based screening.",
            "Male breast cancer is rare, usually ER-positive, and more often associated with BRCA2 than BRCA1.",
          ],
          pearls: [
            "Risk models (e.g. Tyrer–Cuzick/IBIS, BOADICEA/CanRisk) integrate family history, density and polygenic scores — know which model includes which inputs.",
            "Classic LCIS is a risk marker; pleomorphic and florid LCIS are managed more like DCIS.",
          ],
          evidenceType: "mixed",
        },
        {
          id: "hereditary-genetics",
          title: "Hereditary breast cancer & genetics",
          summary:
            "A minority of breast cancers arise in carriers of pathogenic germline variants. Identifying carriers informs surgery, systemic therapy (PARP inhibition), cascade testing and risk management for relatives.",
          keyPoints: [
            "High-penetrance genes: BRCA1, BRCA2, PALB2, TP53 (Li–Fraumeni), PTEN (Cowden/PHTS), CDH1 (hereditary diffuse gastric and lobular breast cancer) and STK11 (Peutz–Jeghers).",
            "Moderate-penetrance genes: CHEK2, ATM, and to a lesser extent BARD1, RAD51C and RAD51D (the latter two especially relevant to triple-negative disease and ovarian risk).",
            "BRCA1-associated tumours are typically triple-negative and high grade; BRCA2-associated tumours are more often ER-positive.",
            "Germline testing criteria have broadened: age, triple-negative phenotype, male breast cancer, family history, ancestry and eligibility for PARP inhibition all trigger testing.",
            "Risk management for carriers includes MRI-based screening, consideration of risk-reducing mastectomy and risk-reducing salpingo-oophorectomy (gene-specific timing), and chemoprevention discussion.",
            "TP53 carriers: avoid unnecessary radiotherapy where alternatives exist because of radiation-induced malignancy risk; mastectomy is often preferred.",
          ],
          pearls: [
            "Germline BRCA status is a treatment biomarker, not just a risk biomarker — it opens adjuvant and metastatic PARP-inhibitor options.",
            "Variants of uncertain significance should not drive risk-reducing surgery.",
          ],
          trialSlugs: ["olympia", "olympiad", "embraca"],
          evidenceType: "mixed",
        },
        {
          id: "histopathology-who",
          title: "Histopathology & WHO classification",
          summary:
            "The WHO Classification of Breast Tumours (5th edition) separates invasive carcinoma of no special type from special types, with Nottingham grade and lymphovascular invasion as core prognostic descriptors.",
          keyPoints: [
            "Invasive carcinoma of no special type (NST, formerly ductal) is the most common histology.",
            "Invasive lobular carcinoma: discohesive single-file growth from loss of E-cadherin (CDH1); often multifocal, bilateral, mammographically subtle, with a predilection for serosal, gastrointestinal, peritoneal and bone-marrow spread.",
            "Special types with generally favourable biology when pure: tubular, cribriform, mucinous and some low-grade triple-negative types (adenoid cystic, secretory — the latter with ETV6::NTRK3 fusion).",
            "Metaplastic carcinoma is usually triple-negative and relatively chemoresistant.",
            "Nottingham (Elston–Ellis) grade combines tubule formation, nuclear pleomorphism and mitotic count.",
            "Tumour-infiltrating lymphocytes (TILs) are prognostic in triple-negative and HER2-positive disease and should be reported using standardised methodology.",
          ],
          pearls: [
            "Lobular histology is a classic trap: staging CT/PET may under-call peritoneal and gastrointestinal metastases.",
            "Secretory carcinoma is a tumour-agnostic NTRK-fusion entity — remember it when asked for a breast cancer with an NTRK fusion.",
          ],
          evidenceType: "consensus",
        },
        {
          id: "intrinsic-subtypes",
          title: "Intrinsic molecular subtypes",
          summary:
            "Gene-expression profiling defines intrinsic subtypes — luminal A, luminal B, HER2-enriched and basal-like — which overlap with, but are not identical to, IHC-defined clinical groups.",
          keyPoints: [
            "Luminal A: ER-high, low proliferation, endocrine-sensitive; luminal B: higher proliferation and/or lower ER expression with greater chemotherapy relevance.",
            "HER2-enriched: driven by ERBB2 amplicon expression; not every IHC/ISH HER2-positive tumour is HER2-enriched and vice versa.",
            "Basal-like: largely overlaps triple-negative disease but triple-negative breast cancer is itself heterogeneous (basal-like, mesenchymal, luminal androgen receptor, immunomodulatory).",
            "PAM50-based assays assign intrinsic subtype and a risk-of-recurrence score; IHC surrogates (ER, PR, HER2, Ki-67) are pragmatic but imperfect.",
            "Subtype predicts patterns of relapse: basal-like disease relapses early with visceral and CNS predilection; luminal disease can relapse late, often in bone.",
          ],
          pearls: ["“Triple-negative” is a clinical exclusion definition; “basal-like” is a transcriptomic definition. They are not synonyms."],
          evidenceType: "mixed",
        },
        {
          id: "imaging-biopsy",
          title: "Imaging & biopsy",
          summary:
            "Triple assessment — clinical examination, imaging and image-guided core biopsy — underpins diagnosis. Staging intensity is matched to clinical stage and subtype.",
          keyPoints: [
            "Mammography with tomosynthesis and targeted ultrasound are the diagnostic baseline; axillary ultrasound with biopsy of suspicious nodes is standard.",
            "Breast MRI is used for high-risk screening, occult primary with axillary nodal disease, discordant findings, lobular histology where extent is uncertain, and response assessment around neoadjuvant therapy.",
            "Image-guided core needle biopsy (not fine-needle aspiration of the primary) provides histology and receptor status; place a marker clip before neoadjuvant therapy, including in biopsy-proven positive nodes.",
            "Systemic staging (CT chest–abdomen–pelvis and bone imaging, or PET-CT) is reserved for clinically higher-stage disease or symptoms; routine staging of early, node-negative disease is not recommended.",
            "Re-biopsy of a first metastasis is encouraged to confirm the diagnosis and re-test ER, PR and HER2 because receptor discordance occurs.",
          ],
          pearls: ["Clip the positive node before neoadjuvant therapy — it enables targeted axillary dissection later."],
          evidenceType: "consensus",
        },
      ],
    },
    {
      id: "biomarkers-genomics",
      title: "Biomarkers & genomics",
      description: "Receptor definitions, actionable alterations, genomic risk assays and circulating tumour DNA.",
      sections: [
        {
          id: "biomarkers",
          title: "Core and actionable biomarkers",
          summary:
            "ER, PR and HER2 define treatment families; Ki-67 refines proliferation; germline BRCA and PALB2, and somatic PIK3CA, AKT1, PTEN and ESR1 alterations open targeted options. Testing follows ASCO/CAP definitions.",
          keyPoints: [
            "ER/PR: positive when ≥1% of tumour nuclei stain; ER-low positive (1–10%) behaves biologically closer to triple-negative disease and is reported as such.",
            "HER2-positive: IHC 3+, or IHC 2+ (equivocal) with ISH amplification per ASCO/CAP algorithm.",
            "HER2-low: IHC 1+, or IHC 2+ with negative ISH. HER2-ultralow: IHC 0 with faint, incomplete membrane staining in ≤10% of tumour cells. HER2-null: no staining.",
            "HER2-low is a therapeutic category for HER2-directed antibody–drug conjugates, not a distinct biological subtype; inter-observer variability at the 0/1+ boundary is substantial.",
            "Ki-67: prognostic, with poor inter-laboratory reproducibility at intermediate values; International Ki-67 Working Group methodology should be followed.",
            "Germline BRCA1/2 and germline PALB2 pathogenic variants predict sensitivity to PARP inhibition and platinum; somatic BRCA alterations are less established.",
            "PIK3CA activating mutations (tissue or ctDNA), AKT1 E17K and PTEN loss-of-function define the PI3K/AKT pathway–altered population for alpha-selective PI3K and AKT inhibitors in endocrine-pretreated HR+/HER2− disease.",
            "ESR1 ligand-binding-domain mutations are acquired under aromatase-inhibitor pressure; best detected in ctDNA at progression; predict benefit from oral SERDs.",
          ],
          pearls: [
            "ESR1 mutations are rarely present at diagnosis — test ctDNA at each progression on endocrine therapy, not only once.",
            "HER2 IHC 0 vs 1+ is now a decision threshold: request re-review of borderline zero cases in the metastatic setting.",
          ],
          trialSlugs: ["destiny-breast04", "destiny-breast06", "solar-1", "capitello-291", "inavo120", "emerald", "olympiad"],
          evidenceType: "mixed",
        },
        {
          id: "genomic-assays",
          title: "Genomic risk assays",
          summary:
            "Multigene expression assays refine prognosis and predict chemotherapy benefit in early HR+/HER2− disease, enabling de-escalation for many patients.",
          keyPoints: [
            "21-gene Recurrence Score (Oncotype DX): prospectively tested in node-negative (TAILORx) and 1–3 node-positive (RxPONDER) disease.",
            "70-gene signature (MammaPrint): MINDACT tested omission of chemotherapy in clinically high-risk but genomically low-risk patients.",
            "Other validated assays include PAM50/Prosigna, EndoPredict and the Breast Cancer Index (the latter also used for extended endocrine therapy decisions).",
            "Chemotherapy benefit in premenopausal women with intermediate genomic risk may partly reflect chemotherapy-induced ovarian suppression — a central interpretive debate.",
            "Assays are validated for HR+/HER2− disease; they are not used to guide therapy in HER2-positive or triple-negative disease.",
          ],
          pearls: ["Age/menopausal status modifies how genomic scores are acted on — do not apply postmenopausal cut-offs to premenopausal patients without nuance."],
          trialSlugs: ["tailorx", "rxponder", "mindact"],
          evidenceType: "prospective",
        },
        {
          id: "ctdna-mrd",
          title: "Circulating tumour DNA & MRD",
          summary:
            "Plasma ctDNA genotyping is established in metastatic disease for ESR1 and PIK3CA; molecular residual disease (MRD) detection after curative treatment is prognostic but not yet a validated basis for changing therapy outside trials.",
          keyPoints: [
            "Metastatic setting: ctDNA can identify ESR1 and PIK3CA/AKT pathway alterations; a negative plasma result does not exclude an alteration (low shedding) and should prompt tissue testing where relevant.",
            "Tumour-informed and tumour-agnostic MRD assays detect molecular relapse ahead of imaging in early breast cancer.",
            "Whether acting on molecular relapse improves outcomes is the subject of ongoing interventional trials.",
            "Clonal haematopoiesis can confound tumour-agnostic assays.",
          ],
          pearls: ["Prognostic ≠ predictive: an MRD-positive result is prognostic; therapy changes on that basis remain investigational."],
          trialSlugs: ["emerald", "solar-1"],
          evidenceType: "mixed",
        },
      ],
    },
    {
      id: "early-disease",
      title: "Early & locally advanced disease",
      sections: [
        {
          id: "dcis",
          title: "Ductal carcinoma in situ (DCIS)",
          summary:
            "DCIS is a non-obligate precursor of invasive cancer. Management balances local recurrence risk against overtreatment: excision, with radiotherapy and endocrine therapy tailored to risk.",
          keyPoints: [
            "Standard options: breast-conserving surgery with clear margins plus whole-breast radiotherapy, or mastectomy for extensive disease.",
            "Radiotherapy reduces ipsilateral recurrence (including invasive recurrence) after breast-conserving surgery; omission can be considered in carefully selected low-risk DCIS.",
            "Endocrine therapy after excision of ER-positive DCIS reduces ipsilateral and contralateral events (tamoxifen; anastrozole in postmenopausal women).",
            "Sentinel node biopsy is not routine for DCIS treated with breast conservation, but is considered at mastectomy because later mapping is not feasible.",
            "Active monitoring of low-risk DCIS is under prospective evaluation and is not yet standard outside trials.",
          ],
          pearls: ["SLNB at mastectomy for DCIS — because an occult invasive focus may be found and post-mastectomy mapping is impossible."],
          trialSlugs: ["nsabp-b-24", "ibis-ii-dcis"],
          evidenceType: "prospective",
        },
        {
          id: "early-hr-positive",
          title: "Early HR+/HER2− disease",
          summary:
            "Endocrine therapy is the backbone. Chemotherapy is selected on clinical and genomic risk; ovarian function suppression, CDK4/6 inhibition and olaparib intensify therapy for higher-risk subsets.",
          keyPoints: [
            "Postmenopausal: aromatase inhibitor-based therapy is preferred, with tamoxifen as an alternative; extended endocrine therapy is individualised for higher-risk disease.",
            "Premenopausal: tamoxifen for lower-risk; ovarian function suppression plus an aromatase inhibitor or tamoxifen for higher-risk disease (SOFT/TEXT).",
            "Adjuvant CDK4/6 inhibition adds benefit in high-risk node-positive disease (abemaciclib, monarchE) and in a broader stage II–III population (ribociclib, NATALEE); eligibility criteria differ between the trials.",
            "Adjuvant olaparib for germline BRCA carriers with high-risk HER2-negative disease (OlympiA).",
            "Bone-modifying agents (bisphosphonates) reduce bone recurrence in postmenopausal women and protect bone during aromatase inhibition or ovarian suppression.",
            "Adherence is a major determinant of real-world benefit; manage arthralgia, vasomotor and genitourinary symptoms proactively.",
          ],
          pearls: [
            "Tamoxifen is contraindicated in pregnancy; aromatase inhibitors alone are ineffective without ovarian suppression in premenopausal women.",
            "monarchE vs NATALEE: know the differing risk definitions and node requirements.",
          ],
          trialSlugs: ["big-1-98", "atlas", "soft-text", "monarche", "natalee", "olympia", "tailorx", "rxponder", "mindact"],
          evidenceType: "prospective",
        },
        {
          id: "early-her2-positive",
          title: "Early HER2+ disease",
          summary:
            "Trastuzumab-based therapy transformed HER2-positive early breast cancer. Neoadjuvant therapy is preferred for most stage II–III disease, allowing response-adapted escalation.",
          keyPoints: [
            "Adjuvant trastuzumab with chemotherapy is the foundation (HERA, NSABP B-31/NCCTG N9831).",
            "Dual HER2 blockade with pertuzumab adds benefit in higher-risk (especially node-positive) disease (APHINITY) and increases pathological complete response neoadjuvantly (NeoSphere).",
            "Residual invasive disease after neoadjuvant therapy: switch to trastuzumab emtansine (KATHERINE).",
            "Small node-negative tumours: de-escalated paclitaxel plus trastuzumab (APT).",
            "Extended adjuvant neratinib after trastuzumab is an option for selected, mainly HR-positive, higher-risk patients (ExteNET).",
            "Monitor cardiac function: trastuzumab cardiotoxicity is typically reversible and not dose-dependent, unlike anthracycline cardiotoxicity.",
          ],
          pearls: ["pCR after neoadjuvant therapy is prognostic at the patient level; residual disease is the trigger for T-DM1 escalation."],
          trialSlugs: ["hera", "nsabp-b31-n9831", "aphinity", "neosphere", "katherine", "apt", "extenet"],
          evidenceType: "prospective",
        },
        {
          id: "early-tnbc",
          title: "Early triple-negative disease",
          summary:
            "Neoadjuvant chemo-immunotherapy is standard for stage II–III triple-negative breast cancer, with response-adapted adjuvant therapy for residual disease.",
          keyPoints: [
            "Neoadjuvant pembrolizumab with carboplatin-containing chemotherapy followed by adjuvant pembrolizumab (KEYNOTE-522), irrespective of PD-L1 status.",
            "Residual disease after neoadjuvant chemotherapy: adjuvant capecitabine (CREATE-X) or, in germline BRCA carriers, olaparib (OlympiA).",
            "Small node-negative tumours are managed individually; the smallest may be treated with surgery first.",
            "Immune-related adverse events (including endocrinopathies such as adrenal insufficiency and hypophysitis) can be permanent and occur in a curative setting — counselling matters.",
          ],
          pearls: ["PD-L1 is not required for neoadjuvant pembrolizumab in early TNBC, but CPS is required in the metastatic setting — a frequent exam trap."],
          trialSlugs: ["keynote-522", "create-x", "olympia"],
          evidenceType: "prospective",
        },
        {
          id: "locally-advanced-inflammatory",
          title: "Locally advanced & inflammatory breast cancer",
          summary:
            "Locally advanced disease is treated with primary systemic therapy, surgery and radiotherapy. Inflammatory breast cancer (T4d) is a clinical diagnosis demanding trimodality therapy.",
          keyPoints: [
            "Inflammatory breast cancer: rapid-onset erythema and oedema (peau d'orange) involving a third or more of the breast; dermal lymphatic tumour emboli support but are not required for diagnosis.",
            "Trimodality approach: subtype-directed neoadjuvant systemic therapy, modified radical mastectomy, then comprehensive post-mastectomy radiotherapy.",
            "In inflammatory disease, breast conservation, skin-sparing mastectomy and sentinel node biopsy are not recommended.",
            "Full staging is indicated because of the higher likelihood of distant disease.",
          ],
          pearls: ["Neglected locally advanced cancer is not inflammatory breast cancer — the latter is defined by tempo and diffuse skin involvement."],
          trialSlugs: ["neosphere", "keynote-522"],
          evidenceType: "mixed",
        },
        {
          id: "surgery",
          title: "Breast & axillary surgery",
          summary:
            "Breast-conserving therapy and mastectomy offer equivalent survival when appropriately selected. Axillary surgery has been progressively de-escalated.",
          keyPoints: [
            "Breast-conserving surgery plus radiotherapy is equivalent in survival to mastectomy; the margin standard for invasive disease is “no ink on tumour”.",
            "Sentinel lymph node biopsy is standard for clinically node-negative disease; axillary dissection can be omitted for limited sentinel node disease in selected patients undergoing breast conservation and radiotherapy (ACOSOG Z0011, AMAROS).",
            "Omission of sentinel node biopsy in selected older or low-risk patients is supported by recent de-escalation trials.",
            "After neoadjuvant therapy in initially node-positive disease converting to clinically node-negative, sentinel node biopsy with dual tracer and/or targeted axillary dissection (clipped node retrieval) reduces false-negative rates.",
            "Oncoplastic techniques and immediate reconstruction should be discussed with radiotherapy planning in mind.",
          ],
          pearls: ["Z0011 criteria do not apply to mastectomy without radiotherapy or to patients after neoadjuvant therapy."],
          evidenceType: "prospective",
        },
        {
          id: "radiotherapy",
          title: "Radiotherapy",
          summary:
            "Radiotherapy reduces local recurrence and, in higher-risk disease, breast cancer mortality. Modern practice favours hypofractionation and risk-adapted target volumes.",
          keyPoints: [
            "Whole-breast radiotherapy after breast-conserving surgery; a tumour-bed boost is added for higher local-risk patients (e.g. younger age, high grade).",
            "Moderate hypofractionation is standard; ultra-hypofractionated whole-breast schedules are supported by randomised data.",
            "Partial-breast irradiation is an option for selected low-risk patients.",
            "Omission of radiotherapy can be considered in older patients with small, node-negative, HR-positive tumours committed to endocrine therapy.",
            "Post-mastectomy and regional nodal irradiation are indicated for node-positive disease and other high-risk features; response-adapted nodal RT after neoadjuvant therapy is an active question.",
            "Cardiac and lung dose minimisation (deep-inspiration breath hold for left-sided cancers) reduces late toxicity.",
          ],
          evidenceType: "prospective",
        },
      ],
    },
    {
      id: "metastatic-disease",
      title: "Metastatic disease",
      sections: [
        {
          id: "metastatic-hr-positive",
          title: "Metastatic HR+/HER2− disease",
          summary:
            "Endocrine therapy plus a CDK4/6 inhibitor is the preferred first-line strategy for most patients; subsequent lines are biomarker-directed before chemotherapy and antibody–drug conjugates.",
          keyPoints: [
            "First line: aromatase inhibitor or fulvestrant combined with a CDK4/6 inhibitor (palbociclib, ribociclib, abemaciclib); premenopausal women receive ovarian suppression (MONALEESA-7).",
            "Endocrine resistance categories (primary vs secondary) inform trial eligibility and the choice of second-line partner.",
            "PIK3CA-mutant disease: alpelisib plus fulvestrant (SOLAR-1); inavolisib with palbociclib and fulvestrant for early relapse during or after adjuvant endocrine therapy (INAVO120).",
            "PIK3CA/AKT1/PTEN-altered disease: capivasertib plus fulvestrant (CAPItello-291).",
            "ESR1-mutant disease: oral SERD monotherapy (elacestrant, EMERALD) — benefit most evident with prior longer endocrine sensitivity.",
            "Germline BRCA: PARP inhibitors (olaparib, talazoparib) are options versus physician's-choice chemotherapy.",
            "Visceral crisis is the indication for upfront chemotherapy rather than endocrine-based therapy.",
          ],
          pearls: [
            "Hyperglycaemia with alpelisib/inavolisib and rash/diarrhoea with capivasertib: screen glycaemic status before starting.",
            "Visceral metastases alone are not visceral crisis.",
          ],
          trialSlugs: ["paloma-2", "monaleesa-2", "monarch-3", "monaleesa-7", "paloma-3", "solar-1", "inavo120", "capitello-291", "emerald", "olympiad", "embraca", "tropics-02", "destiny-breast06"],
          evidenceType: "prospective",
        },
        {
          id: "metastatic-her2-positive",
          title: "Metastatic HER2+ disease",
          summary:
            "HER2-directed therapy continues throughout the disease course. Sequencing has been reshaped by trastuzumab deruxtecan and CNS-active tucatinib.",
          keyPoints: [
            "First line: taxane plus trastuzumab and pertuzumab (CLEOPATRA), followed by maintenance antibodies (with endocrine therapy if HR-positive).",
            "Second line: trastuzumab deruxtecan is preferred over trastuzumab emtansine (DESTINY-Breast03); T-DM1 established the ADC paradigm (EMILIA).",
            "Tucatinib with trastuzumab and capecitabine is active including in active or stable brain metastases (HER2CLIMB).",
            "Later lines: other HER2 TKIs (neratinib, lapatinib), alternative antibody–chemotherapy partners and trial enrolment.",
            "Interstitial lung disease/pneumonitis with trastuzumab deruxtecan requires baseline counselling, vigilance and prompt drug interruption.",
          ],
          pearls: ["ILD with T-DXd: grade 1 can sometimes be re-challenged after resolution; grade 2 or higher means permanent discontinuation."],
          trialSlugs: ["cleopatra", "emilia", "destiny-breast03", "her2climb"],
          evidenceType: "prospective",
        },
        {
          id: "her2-low",
          title: "HER2-low and HER2-ultralow disease",
          summary:
            "HER2-low and ultralow are therapeutic categories created by the activity of trastuzumab deruxtecan, whose bystander effect reaches tumours with heterogeneous or low HER2 expression.",
          keyPoints: [
            "HER2-low = IHC 1+ or IHC 2+/ISH-negative; HER2-ultralow = IHC 0 with faint, incomplete staining in ≤10% of cells.",
            "Trastuzumab deruxtecan improved outcomes over chemotherapy in chemotherapy-pretreated HER2-low disease (DESTINY-Breast04) and in endocrine-pretreated, chemotherapy-naive HER2-low/ultralow HR-positive disease (DESTINY-Breast06).",
            "HER2 status can vary between primary and metastasis and over time; re-testing archival or new samples can reclassify HER2-0 to HER2-low.",
            "HER2-low is not a prognostically distinct biological subtype; it applies across HR-positive and HR-negative disease.",
          ],
          pearls: ["HER2-low does not qualify for trastuzumab/pertuzumab — these remain reserved for HER2-positive (amplified/3+) disease."],
          trialSlugs: ["destiny-breast04", "destiny-breast06"],
          evidenceType: "prospective",
        },
        {
          id: "metastatic-tnbc",
          title: "Metastatic triple-negative disease",
          summary:
            "Treatment is selected by PD-L1 status, germline BRCA status and prior therapy, with antibody–drug conjugates now central in later lines.",
          keyPoints: [
            "PD-L1 CPS ≥10 (22C3 assay): pembrolizumab plus chemotherapy first line (KEYNOTE-355).",
            "PD-L1 assays are not interchangeable — trial-specific assays and scoring systems (CPS with 22C3; immune-cell score with SP142 in IMpassion130) must be matched to the drug.",
            "Sacituzumab govitecan (TROP2-directed ADC) after prior chemotherapy for metastatic disease (ASCENT).",
            "HER2-low TNBC can also be treated with trastuzumab deruxtecan.",
            "Germline BRCA: PARP inhibitor or platinum-based chemotherapy.",
          ],
          pearls: ["Atezolizumab with nab-paclitaxel and with paclitaxel produced discordant results across trials — partner chemotherapy matters."],
          trialSlugs: ["keynote-355", "impassion130", "ascent", "olympiad", "embraca"],
          evidenceType: "prospective",
        },
        {
          id: "cns-disease",
          title: "CNS disease",
          summary:
            "Brain metastases are most frequent in HER2-positive and triple-negative disease. Local therapy and CNS-active systemic therapy are increasingly combined.",
          keyPoints: [
            "Stereotactic radiosurgery is preferred for limited brain metastases; whole-brain radiotherapy (with hippocampal avoidance and memantine where appropriate) for more extensive disease.",
            "Systemic CNS activity: tucatinib-based therapy and trastuzumab deruxtecan in HER2-positive disease.",
            "Leptomeningeal disease carries a poor prognosis; management is individualised (intrathecal and systemic options, focal RT).",
            "Routine brain MRI screening in asymptomatic patients is not universally recommended but is increasingly considered in high-risk subtypes.",
          ],
          trialSlugs: ["her2climb", "destiny-breast03"],
          evidenceType: "mixed",
        },
        {
          id: "resistance-sequencing",
          title: "Resistance & sequencing",
          summary:
            "Sequencing decisions integrate endocrine sensitivity, acquired genomic alterations, prior ADC exposure and organ function. Many sequencing questions lack randomised data.",
          keyPoints: [
            "Mechanisms of endocrine resistance: ESR1 mutations, PI3K/AKT/mTOR activation, and CDK4/6-pathway changes (e.g. RB1 loss, cyclin E amplification).",
            "Repeat ctDNA (± tissue) testing at progression identifies newly actionable alterations.",
            "Antibody–drug conjugate sequencing: cross-resistance between ADCs sharing a topoisomerase-I payload is plausible; optimal ordering of HER2- and TROP2-directed ADCs is an open question.",
            "Continuing CDK4/6 inhibition beyond progression with a switched endocrine partner is supported by some but not all randomised data.",
            "Everolimus with exemestane remains an mTOR-pathway option.",
          ],
          pearls: ["When asked for the “next line”, first establish endocrine sensitivity, ESR1/PIK3CA/AKT/PTEN status, germline BRCA and HER2-low status."],
          trialSlugs: ["emerald", "capitello-291", "solar-1", "destiny-breast04", "tropics-02", "ascent"],
          evidenceType: "mixed",
        },
      ],
    },
  ],
};
