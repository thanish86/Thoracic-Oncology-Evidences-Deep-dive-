import type { Metadata } from "next";
import { Notice, PageHeader } from "@/components/ui/primitives";
import { AtlasSection, AtlasTable, InfoCard, OnThisPage } from "@/components/atlas/atlas-ui";
import { AlkBreakApartDiagram, Her2IshDiagram, MesoMrecistDiagram, RecistDiagram } from "@/components/atlas/diagrams";

export const metadata: Metadata = {
  title: "Pathology & imaging atlas",
  description: "Histopathology, immunohistochemistry, FISH, NGS, imaging principles and response criteria for thoracic and breast oncology.",
};

const TOC = [
  { id: "histopathology", label: "Histopathology" },
  { id: "ihc", label: "IHC panels" },
  { id: "fish", label: "FISH / ISH" },
  { id: "ngs", label: "NGS testing" },
  { id: "flow", label: "Flow cytometry" },
  { id: "imaging", label: "Imaging principles" },
  { id: "criteria", label: "Response & staging criteria" },
  { id: "licensing", label: "Image licensing" },
];

export default function PathologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Diagnostics"
        title="Pathology & imaging atlas"
        description="A conceptual reference for how tumours are classified, tested and measured. Content is qualitative and educational; only standard definitional thresholds are stated. Always defer to the current WHO classification, CAP/IASLC/ASCO testing guidance and the original criteria publications."
      />
      <OnThisPage items={TOC} />

      <div className="space-y-12">
        <AtlasSection id="histopathology" eyebrow="Foundations" title="Histopathology overview" description="Morphology on H&E remains the starting point; immunohistochemistry and molecular testing refine lineage, subtype and therapy eligibility.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard title="Specimen stewardship" tag="All tumours">
              <p>Small biopsies and cytology must serve diagnosis, PD-L1 and molecular testing. Use a minimal, targeted IHC panel and reserve tissue for NGS.</p>
              <p>Cell blocks from effusions or EBUS aspirates can often support IHC and sequencing.</p>
            </InfoCard>
            <InfoCard title="Lung carcinoma" tag="NSCLC / SCLC" tone="blue">
              <p>Major groups: adenocarcinoma (with architectural patterns and invasive vs in-situ/minimally invasive categories), squamous cell carcinoma, large cell carcinoma (a diagnosis of exclusion on resection) and neuroendocrine tumours including small cell carcinoma.</p>
              <p>On small biopsies without clear morphology, &ldquo;NSCLC, favour adenocarcinoma/squamous&rdquo; based on IHC is accepted terminology.</p>
            </InfoCard>
            <InfoCard title="Thymic epithelial tumours" tag="Thymic" tone="sand">
              <p>WHO types A, AB, B1, B2, B3 thymoma reflect the proportion of epithelial cells and the lymphocyte-rich background; thymic carcinomas (most often squamous) show overt cytological atypia and lack the immature T-cell background.</p>
            </InfoCard>
            <InfoCard title="Mesothelioma" tag="Mesothelioma" tone="sage">
              <p>Epithelioid, biphasic and sarcomatoid subtypes; subtype carries prognostic and therapeutic weight. Mesothelioma in situ is now a recognised entity requiring loss of BAP1 or MTAP/CDKN2A evidence.</p>
            </InfoCard>
            <InfoCard title="Breast carcinoma" tag="Breast" tone="rose">
              <p>Invasive carcinoma of no special type is most common, followed by lobular carcinoma (characteristically E-cadherin loss). Grade (Nottingham), receptor status and HER2 define treatment-relevant subtypes.</p>
            </InfoCard>
            <InfoCard title="Small cell lung carcinoma" tag="SCLC" tone="lavender">
              <p>Small cells with scant cytoplasm, finely granular chromatin, nuclear moulding, high mitotic activity and necrosis. Crush artefact is common in biopsies. Transcription-factor subtypes (ASCL1, NEUROD1, POU2F3, YAP1) are investigational.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="ihc" eyebrow="Immunohistochemistry" title="IHC panels by disease" description="Typical expression patterns. No marker is perfectly sensitive or specific; panels are interpreted together with morphology and clinical context.">
          <div className="grid gap-5">
            <AtlasTable
              caption="Lung carcinoma — lineage markers"
              columns={["Entity", "Typically positive", "Typically negative / notes"]}
              rows={[
                ["Adenocarcinoma", "TTF-1, Napsin A", "p40 negative (scattered p63 possible). Mucinous adenocarcinoma is frequently TTF-1 negative."],
                ["Squamous cell carcinoma", "p40, CK5/6 (p63 less specific)", "TTF-1 usually negative"],
                ["Small cell carcinoma", "INSM1, synaptophysin, chromogranin A, CD56; TTF-1 often positive; very high Ki-67", "Neuroendocrine markers can be weak or focal; keratin often dot-like"],
                ["Metastasis vs primary", "Organ-specific markers (e.g., GATA3 for breast, CDX2 for intestinal)", "Context-dependent panel"],
              ]}
            />
            <AtlasTable
              caption="Thymic epithelial tumours"
              columns={["Feature", "Thymoma", "Thymic carcinoma"]}
              rows={[
                ["Epithelial CD5 / CD117 (KIT)", "Usually negative", "Frequently positive (especially squamous type)"],
                ["Background lymphocytes", "Abundant immature T cells: TdT+, CD1a+, CD99+ (type-dependent)", "Few or absent immature T cells; mature lymphocytes if present"],
                ["Epithelial keratin, p63/p40", "Positive in epithelial cells", "Positive"],
              ]}
            />
            <AtlasTable
              caption="Pleural mesothelioma vs metastatic carcinoma"
              columns={["Marker set", "Mesothelioma", "Carcinoma (e.g., lung adenocarcinoma)"]}
              rows={[
                ["Mesothelial markers", "Calretinin, WT1, D2-40 (podoplanin), CK5/6", "Usually negative (squamous carcinoma can express CK5/6 and D2-40)"],
                ["Epithelial (carcinoma) markers", "Usually negative", "Claudin-4, MOC-31, BerEP4; plus site-specific markers (TTF-1, Napsin A)"],
                ["Malignancy support", "BAP1 loss (IHC), MTAP loss (IHC) or CDKN2A homozygous deletion (FISH)", "—"],
                ["Sarcomatoid subtype", "Keratin often retained; mesothelial markers may be lost", "Distinguish from sarcomatoid carcinoma and sarcoma"],
              ]}
            />
            <AtlasTable
              caption="Breast carcinoma — predictive and lineage markers"
              columns={["Marker", "Role", "Reporting concept"]}
              rows={[
                ["ER / PR", "Endocrine responsiveness", "Positive if ≥1% of tumour nuclei stain; 1–10% is reported as ER-low positive"],
                ["HER2 (IHC)", "HER2-directed therapy", "Scores 0, 1+, 2+ (equivocal — reflex ISH), 3+ (positive). IHC 1+ or 2+/ISH-negative is termed HER2-low"],
                ["GATA3", "Breast/urothelial lineage", "Supports breast origin in metastatic workups; TRPS1 is a newer lineage marker"],
                ["Ki-67", "Proliferation", "Interobserver variability; standardised scoring recommended"],
                ["E-cadherin", "Lobular vs ductal", "Loss supports lobular carcinoma"],
              ]}
            />
            <AtlasTable
              caption="Predictive IHC in thoracic oncology"
              columns={["Assay", "Use", "Notes"]}
              rows={[
                ["PD-L1 (tumour proportion score)", "Immunotherapy selection in NSCLC", "Assay- and scoring-system-specific; validated clone matters"],
                ["ALK (D5F3) / ROS1 IHC", "Screening for rearrangements", "ALK D5F3 IHC is accepted as a standalone test on validated platforms; ROS1 IHC positivity needs molecular confirmation"],
                ["HER2 in NSCLC", "HER2-overexpressing NSCLC", "Distinct from HER2 (ERBB2) mutation, detected by NGS"],
                ["DLL3", "SCLC biomarker research", "Expression is common in SCLC; its predictive role for DLL3-directed therapy is still being defined"],
              ]}
            />
          </div>
        </AtlasSection>

        <AtlasSection id="fish" eyebrow="In-situ hybridisation" title="FISH / ISH interpretation">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <Her2IshDiagram />
              <InfoCard title="HER2 dual-probe ISH (ASCO/CAP groups)" tag="Breast" tone="rose">
                <p>Results are assigned to one of five groups using the HER2/CEP17 ratio and the average HER2 copy number per cell.</p>
                <ul>
                  <li><strong className="text-ink">Group 1</strong> (ratio ≥2.0 and mean HER2 ≥4.0 signals/cell): positive.</li>
                  <li><strong className="text-ink">Group 5</strong> (ratio &lt;2.0 and mean HER2 &lt;4.0 signals/cell): negative.</li>
                  <li><strong className="text-ink">Groups 2–4</strong> (discordant ratio and copy number): final call requires concurrent review of the IHC result and recount in the same areas.</li>
                </ul>
              </InfoCard>
            </div>
            <div className="space-y-4">
              <AlkBreakApartDiagram />
              <InfoCard title="ALK break-apart FISH" tag="NSCLC" tone="blue">
                <p>Positive when a defined proportion of evaluated tumour cells (conventionally ≥15%) shows split signals or an isolated 3′ signal.</p>
                <p>Borderline counts warrant a second reader. FISH identifies a rearrangement but not the fusion partner; RNA-based NGS identifies both. ROS1 and RET break-apart probes follow the same principle.</p>
              </InfoCard>
            </div>
          </div>
        </AtlasSection>

        <AtlasSection id="ngs" eyebrow="Molecular" title="Next-generation sequencing" description="Broad panels replace sequential single-gene tests and conserve tissue.">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard title="DNA vs RNA sequencing" tag="Fusions">
              <ul>
                <li>DNA-based hybrid-capture panels detect SNVs, indels, copy-number changes and many fusions, but large or repetitive introns can hide breakpoints.</li>
                <li>RNA-based (e.g., anchored multiplex) assays read the expressed fusion transcript directly and improve detection of fusions (ALK, ROS1, RET, NTRK, NRG1) and MET exon 14 skipping.</li>
                <li>A driver-negative DNA result in a never-smoker with adenocarcinoma is a reason to consider RNA testing.</li>
              </ul>
            </InfoCard>
            <InfoCard title="Tissue vs plasma (ctDNA)" tag="Liquid biopsy">
              <ul>
                <li>Plasma ctDNA is less invasive and faster; a positive actionable result is generally sufficient to act on.</li>
                <li>A negative plasma result does not exclude a driver (low tumour shedding) — reflex to tissue testing.</li>
                <li>Clonal haematopoiesis can produce variants (e.g., in TP53, DNMT3A, TET2, sometimes KRAS) unrelated to the tumour.</li>
                <li>Plasma is valuable at progression to characterise resistance mechanisms.</li>
              </ul>
            </InfoCard>
            <InfoCard title="Germline vs somatic">
              <p>Tumour-only sequencing can reveal possible germline variants (e.g., BRCA1/2). Confirm with dedicated germline testing and genetic counselling.</p>
            </InfoCard>
            <InfoCard title="Reporting">
              <p>Reports should state variant classification, actionability tier, tumour content, assay limits of detection, and genes with insufficient coverage.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="flow" eyebrow="Haematopathology overlap" title="Flow cytometry — a limited but specific role">
          <InfoCard title="Where flow cytometry helps in thoracic oncology" className="max-w-3xl">
            <p>Flow cytometry has little role in carcinoma diagnosis. Its main relevance in the mediastinum is the anterior mediastinal mass, where lymphoma is in the differential.</p>
            <p>Thymomas (especially lymphocyte-rich types) contain immature T cells that are TdT-positive and often CD4/CD8 double-positive. On flow cytometry this can mimic T-lymphoblastic lymphoma; correlation with morphology and keratin-positive epithelial cells on histology is essential.</p>
          </InfoCard>
        </AtlasSection>

        <AtlasSection id="imaging" eyebrow="Radiology" title="CT, MRI and PET-CT principles">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard title="CT" tag="Workhorse">
              <p>Contrast-enhanced chest/abdomen CT for staging and response. Thin-section reconstruction for nodule characterisation; consistent technique across timepoints for measurement.</p>
            </InfoCard>
            <InfoCard title="MRI" tag="Problem solving">
              <p>Contrast-enhanced brain MRI is the most sensitive test for brain metastases. Breast MRI helps assess extent and neoadjuvant response. Chest MRI can clarify chest-wall, diaphragm or vascular invasion (e.g., mesothelioma, superior sulcus tumours).</p>
            </InfoCard>
            <InfoCard title="FDG PET-CT" tag="Metabolic">
              <p>Improves detection of nodal and distant disease before radical treatment. False positives: infection, inflammation, granulomatous disease, post-treatment change. False negatives: small lesions, low-grade or lepidic adenocarcinoma, carcinoid, mucinous tumours. Positive mediastinal nodes usually need tissue confirmation.</p>
            </InfoCard>
            <InfoCard title="Breast imaging" tag="Breast" tone="rose">
              <p>Mammography and ultrasound for diagnosis and image-guided biopsy; clip placement before neoadjuvant therapy allows localisation of the tumour bed and biopsied node.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="criteria" eyebrow="Measurement" title="Response and staging criteria" description="Concept cards. Exact rules live in the original publications; consult them when adjudicating a scan.">
          <div className="mb-5 grid gap-5 lg:grid-cols-2">
            <RecistDiagram />
            <MesoMrecistDiagram />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard title="RECIST 1.1" tag="Solid tumours" tone="blue">
              <ul>
                <li>Measurable lesion: longest diameter ≥10 mm on CT; lymph node target requires short axis ≥15 mm (10 to &lt;15 mm: pathological, non-target; &lt;10 mm: normal).</li>
                <li>Up to 5 target lesions in total, maximum 2 per organ.</li>
                <li>CR: disappearance of all target lesions; nodes &lt;10 mm short axis.</li>
                <li>PR: ≥30% decrease in sum of diameters from baseline.</li>
                <li>PD: ≥20% increase from nadir with absolute increase ≥5 mm, or new lesions, or unequivocal non-target progression.</li>
              </ul>
            </InfoCard>
            <InfoCard title="iRECIST" tag="Immunotherapy" tone="lavender">
              <p>Adapts RECIST 1.1 to immunotherapy trials, allowing for pseudoprogression. First progression is <em>unconfirmed</em> (iUPD) and is confirmed (iCPD) only if a subsequent scan shows further growth or new lesions. New lesions are measured and tracked separately. Clinical stability is required to continue treatment beyond iUPD.</p>
            </InfoCard>
            <InfoCard title="RANO-BM" tag="Brain metastases" tone="lavender">
              <p>Response Assessment in Neuro-Oncology criteria for brain metastases: unidimensional MRI measurements, assessed with corticosteroid dose and neurological status. Treatment-related change (e.g., radionecrosis after radiosurgery) can mimic progression.</p>
            </InfoCard>
            <InfoCard title="Modified RECIST (mesothelioma)" tag="Mesothelioma" tone="sage">
              <p>Pleural rind grows as a sheet, not a sphere. Thickness is measured perpendicular to the chest wall or mediastinum at two positions on three separate axial levels, and summed. Updated mRECIST 1.1 harmonises with RECIST for non-pleural lesions.</p>
            </InfoCard>
            <InfoCard title="PERCIST" tag="FDG PET">
              <p>Metabolic response using lean-body-mass–normalised uptake (SUL peak) with standardised acquisition. Categories: complete, partial and stable metabolic disease, and progressive metabolic disease. Mainly a research and trial tool in solid tumours.</p>
            </InfoCard>
            <InfoCard title="Masaoka–Koga stage" tag="Thymic" tone="sand">
              <ul>
                <li>I: completely encapsulated.</li>
                <li>IIa: microscopic transcapsular invasion. IIb: macroscopic invasion into thymic or surrounding fat, or adherent to but not through pleura/pericardium.</li>
                <li>III: macroscopic invasion into neighbouring organs (pericardium, great vessels, lung).</li>
                <li>IVa: pleural or pericardial dissemination. IVb: lymphatic or haematogenous metastasis.</li>
              </ul>
              <p>TNM staging for thymic tumours is now used alongside Masaoka–Koga.</p>
            </InfoCard>
            <InfoCard title="TNM" tag="AJCC / UICC">
              <p>Anatomical extent: primary tumour (T), regional nodes (N), distant metastasis (M), grouped into stages. Lung cancer uses IASLC-derived editions; the latest edition subdivides N2 (single vs multiple station) and M1c (single vs multiple organ systems). Breast staging adds a prognostic stage that integrates grade, ER, PR and HER2. Always record the edition used.</p>
            </InfoCard>
            <InfoCard title="CTCAE" tag="Toxicity">
              <p>NCI Common Terminology Criteria for Adverse Events grade toxicity from 1 to 5: mild, moderate, severe or medically significant, life-threatening, and death related to the adverse event. Version matters when comparing trials.</p>
            </InfoCard>
            <InfoCard title="Pathological response" tag="Neoadjuvant">
              <p>pCR definitions differ by disease (e.g., breast: no invasive residual in breast and nodes, in most definitions). Major pathological response in NSCLC is defined by residual viable tumour. Residual Cancer Burden (breast) grades residual disease continuously.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="licensing" eyebrow="Rights" title="Image licensing notice">
          <Notice title="No clinical images are reproduced on this page">
            All figures are original schematic drawings created for ONCOATLAS and are not derived from patient images or published figures. Any future histology, cytology or radiology images will only be added if they are de-identified, carry an explicit open licence (e.g., CC BY) or documented permission, and are shown with full attribution. Report a concern via the project issue tracker.
          </Notice>
        </AtlasSection>
      </div>
    </>
  );
}
