import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader } from "@/components/ui/primitives";
import { AtlasSection, InfoCard, OnThisPage } from "@/components/atlas/atlas-ui";
import { ClassTrials } from "@/components/atlas/class-trials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Surgical oncology",
  description: "Qualitative principles of surgery across NSCLC, SCLC, breast, thymic tumours and mesothelioma, with curated surgical trials.",
};

const TOC = [
  { id: "nsclc", label: "NSCLC" },
  { id: "sclc", label: "SCLC" },
  { id: "breast", label: "Breast" },
  { id: "thymic", label: "Thymic" },
  { id: "mesothelioma", label: "Mesothelioma" },
  { id: "trials", label: "Curated surgical trials" },
];

function TrialLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <Link href={`/trials/${slug}`} className="font-medium text-accent hover:underline">{children}</Link>;
}

export default function SurgeryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Local therapy"
        title="Surgical oncology"
        description="Principles of oncological surgery across the five ONCOATLAS diseases. Qualitative by design — outcomes and numbers are on the source-linked trial pages."
      />
      <div className="mb-6">
        <Notice tone="warning" title="Educational synthesis">Not jurisdiction-specific and not a substitute for ESMO/NCCN/ASCO guidance or multidisciplinary tumour board review.</Notice>
      </div>
      <OnThisPage items={TOC} />

      <div className="space-y-12">
        <AtlasSection id="nsclc" eyebrow="Non-small cell lung cancer" title="NSCLC">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard title="Lobectomy vs sublobar resection" tag="Extent" tone="blue">
              <p>Anatomical lobectomy has long been the standard. For small, peripheral, node-negative tumours, randomised trials support sublobar resection — segmentectomy (<TrialLink slug="jcog0802">JCOG0802</TrialLink>) or sublobar resection including wedge (<TrialLink slug="calgb-140503">CALGB 140503</TrialLink>) — when margins and intraoperative nodal assessment are adequate.</p>
            </InfoCard>
            <InfoCard title="Mediastinal nodal staging" tone="blue">
              <p>Invasive staging (EBUS/EUS-guided needle aspiration, with mediastinoscopy if needed) is indicated when imaging suggests nodal disease, for central or larger tumours, or PET-avid hilar nodes. Intraoperatively, systematic nodal dissection or sampling ensures accurate pathological N staging.</p>
            </InfoCard>
            <InfoCard title="Approach" tone="blue">
              <p>Minimally invasive (video-assisted or robotic) resection is preferred where feasible for its recovery benefits. Pneumonectomy is avoided when a sleeve or parenchyma-sparing resection achieves clearance.</p>
            </InfoCard>
            <InfoCard title="Multimodality context" tone="blue">
              <p>For stage II–III disease, surgery sits within neoadjuvant, perioperative or adjuvant systemic strategies (see the <Link href="/algorithms/nsclc-resectable-stage-ii-iiia" className="text-accent hover:underline">resectable NSCLC pathway</Link>). Multistation or bulky N2 disease generally favours definitive chemoradiotherapy or a multidisciplinary multimodality plan.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="sclc" eyebrow="Small cell lung cancer" title="SCLC">
          <InfoCard title="Surgery in very limited disease" tone="lavender" className="max-w-3xl">
            <p>Resection (usually lobectomy with nodal dissection) is considered for carefully staged, node-negative peripheral SCLC, followed by adjuvant chemotherapy and individualised RT. Invasive mediastinal staging is required beforehand.</p>
          </InfoCard>
        </AtlasSection>

        <AtlasSection id="breast" eyebrow="Breast cancer" title="Breast">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard title="Breast-conserving surgery vs mastectomy" tone="rose">
              <p>Breast-conserving surgery followed by radiotherapy offers survival equivalent to mastectomy in suitable patients. For invasive cancer, a negative margin is generally defined as no ink on tumour; wider margins have not been shown to add benefit. Oncoplastic techniques extend the scope of conservation.</p>
            </InfoCard>
            <InfoCard title="Mastectomy and reconstruction" tone="rose">
              <p>Indicated by tumour-to-breast ratio, multicentricity, contraindication to RT or patient choice. Skin- and nipple-sparing techniques with immediate or delayed reconstruction. Risk-reducing surgery is discussed with germline BRCA1/2 carriers.</p>
            </InfoCard>
            <InfoCard title="SLNB and axillary de-escalation" tone="rose">
              <p>Sentinel lymph node biopsy replaced routine axillary dissection for clinically node-negative disease. Completion dissection can be omitted in selected patients with limited sentinel-node involvement undergoing breast conservation with RT, and axillary RT is an alternative to dissection. Omitting SLNB entirely is being studied and adopted for selected low-risk patients.</p>
            </InfoCard>
            <InfoCard title="Axilla after neoadjuvant therapy" tone="rose">
              <p>For node-positive disease converted to clinically node-negative, sentinel biopsy with retrieval of the clipped node (targeted axillary dissection) improves accuracy. Residual nodal disease informs adjuvant systemic therapy and RT (see <Link href="/algorithms/breast-her2-positive-early" className="text-accent hover:underline">HER2+</Link> and <Link href="/algorithms/breast-tnbc-early" className="text-accent hover:underline">TNBC</Link> pathways).</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="thymic" eyebrow="Thymic epithelial tumours" title="Thymic">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard title="Thymectomy principles" tone="sand">
              <p>Complete (R0) resection is the most important modifiable prognostic factor. Total thymectomy includes the tumour, residual thymus and perithymic fat, especially in patients with myasthenia gravis. Biopsy is often unnecessary for a resectable, radiologically typical thymoma, and transpleural biopsy routes are avoided.</p>
            </InfoCard>
            <InfoCard title="Approaches" tone="sand">
              <p>Median sternotomy is the traditional approach for larger or invasive tumours. Minimally invasive (video-assisted or robotic) thymectomy is used for early-stage encapsulated tumours in experienced centres, with an oncological standard equivalent to open surgery. Locally advanced tumours may undergo induction therapy before attempted resection.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="mesothelioma" eyebrow="Mesothelioma" title="Mesothelioma">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard title="P/D vs EPP" tone="sage">
              <p>Extrapleural pneumonectomy (removal of pleura, lung, diaphragm and pericardium) has largely been abandoned after feasibility data questioned its benefit (<TrialLink slug="mars">MARS</TrialLink>). Lung-sparing extended pleurectomy/decortication added to chemotherapy did not improve outcomes in a randomised trial (<TrialLink slug="mars-2">MARS 2</TrialLink>); radical surgery is now confined to selected patients in expert centres or trials.</p>
            </InfoCard>
            <InfoCard title="Diagnostic and palliative surgery" tone="sage">
              <p>Thoracoscopic biopsy provides adequate tissue for subtype and IHC. Pleural fluid control by talc pleurodesis or an indwelling pleural catheter is central to symptom management.</p>
            </InfoCard>
            <InfoCard title="CRS / HIPEC (peritoneal)" tone="sage">
              <p>Cytoreductive surgery with hyperthermic intraperitoneal chemotherapy is used for selected patients with peritoneal (not pleural) mesothelioma, especially epithelioid subtype, in specialised centres.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="trials" eyebrow="Evidence" title="Curated surgical trials" description="Live from the database: trials tagged with the surgery treatment class.">
          <ClassTrials cls="surgery" emptyLabel="No surgical trials yet" />
        </AtlasSection>
      </div>
    </>
  );
}
