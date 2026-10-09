import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader } from "@/components/ui/primitives";
import { AtlasSection, InfoCard, OnThisPage } from "@/components/atlas/atlas-ui";
import { ClassTrials } from "@/components/atlas/class-trials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Radiation oncology",
  description: "Qualitative principles of radiotherapy across NSCLC, SCLC, breast, thymic tumours and mesothelioma, with curated radiotherapy trials.",
};

const TOC = [
  { id: "nsclc", label: "NSCLC" },
  { id: "sclc", label: "SCLC" },
  { id: "breast", label: "Breast" },
  { id: "thymic", label: "Thymic" },
  { id: "mesothelioma", label: "Mesothelioma" },
  { id: "cns", label: "Brain metastases" },
  { id: "trials", label: "Curated RT trials" },
];

function TrialLink({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <Link href={`/trials/${slug}`} className="font-medium text-accent hover:underline">{children}</Link>;
}

export default function RadiationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Local therapy"
        title="Radiation oncology"
        description="Principles of radiotherapy across the five ONCOATLAS diseases. This page is deliberately qualitative: no doses, fractionation schedules or outcome numbers are given here — consult the linked trial pages (source-quoted) and current guidelines."
      />
      <div className="mb-6">
        <Notice tone="warning" title="Educational synthesis">Not jurisdiction-specific and not a substitute for ESMO/NCCN/ASCO/ASTRO guidance or departmental protocols.</Notice>
      </div>
      <OnThisPage items={TOC} />

      <div className="space-y-12">
        <AtlasSection id="nsclc" eyebrow="Non-small cell lung cancer" title="NSCLC">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard title="SBRT for early-stage disease" tag="Curative">
              <p>Stereotactic body radiotherapy is a standard option for medically inoperable, node-negative peripheral early NSCLC. Central and ultracentral tumours require risk-adapted fractionation because of proximity to the airway, oesophagus and great vessels. Its role versus surgery in operable patients remains under study.</p>
            </InfoCard>
            <InfoCard title="Concurrent chemoradiotherapy" tag="Stage III">
              <p>Concurrent platinum-based chemoradiotherapy is the backbone for unresectable stage III disease in fit patients; escalating radiation dose beyond standard did not help (<TrialLink slug="rtog-0617">RTOG 0617</TrialLink>). Consolidation durvalumab (<TrialLink slug="pacific">PACIFIC</TrialLink>) or, for EGFR-mutant disease, osimertinib (<TrialLink slug="laura">LAURA</TrialLink>) follows.</p>
            </InfoCard>
            <InfoCard title="Postoperative RT (PORT) debate">
              <p>Older meta-analyses suggested harm in completely resected N0–N1 disease. For resected N2 disease, modern conformal-era randomised trials did not show routine PORT improves overall survival and raised cardiopulmonary toxicity concerns; PORT is now individualised (e.g., positive margins, extensive nodal disease).</p>
            </InfoCard>
            <InfoCard title="Palliative and oligometastatic">
              <p>Palliative RT relieves symptoms (haemoptysis, airway obstruction, bone pain, cord compression). Consolidative local therapy for oligometastatic or oligoprogressive disease is an evolving area informed by smaller randomised trials.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="sclc" eyebrow="Small cell lung cancer" title="SCLC">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard title="Limited stage: early concurrent chemoRT" tag="Curative" tone="lavender">
              <p>Thoracic RT given early and concurrently with platinum–etoposide. Twice-daily and higher-dose once-daily schedules have been compared (<TrialLink slug="int-0096">INT 0096</TrialLink>, <TrialLink slug="convert">CONVERT</TrialLink>, <TrialLink slug="calgb-30610">CALGB 30610</TrialLink>). Consolidation durvalumab after chemoRT (<TrialLink slug="adriatic">ADRIATIC</TrialLink>).</p>
            </InfoCard>
            <InfoCard title="PCI vs MRI surveillance" tone="lavender" tag="Brain">
              <p>Prophylactic cranial irradiation reduces brain metastases but carries neurocognitive cost. In extensive stage, trials differed on whether baseline brain MRI was required (<TrialLink slug="eortc-pci-es-sclc">EORTC</TrialLink> vs <TrialLink slug="japanese-pci-es-sclc">Japanese trial</TrialLink>); regular MRI surveillance is a widely used alternative. The same question is being studied in limited stage.</p>
            </InfoCard>
            <InfoCard title="Hippocampal avoidance concept" tone="lavender">
              <p>Hippocampal-avoidance techniques spare the neural stem-cell niche in the hippocampi when whole-brain RT or PCI is given, aiming to reduce memory decline while treating the rest of the brain.</p>
            </InfoCard>
            <InfoCard title="Thoracic consolidation in ES-SCLC" tone="lavender">
              <p>Consolidative thoracic RT for patients responding to chemotherapy with residual chest disease was studied before the immunotherapy era (<TrialLink slug="crest">CREST</TrialLink>). Its integration with chemo-immunotherapy is being evaluated.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="breast" eyebrow="Breast cancer" title="Breast">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard title="Whole-breast RT after BCS" tag="Standard" tone="rose">
              <p>Radiotherapy after breast-conserving surgery reduces local recurrence and is integral to breast conservation. A tumour-bed boost is considered for higher local-risk patients.</p>
            </InfoCard>
            <InfoCard title="Hypofractionation" tone="rose">
              <p>Moderate hypofractionation (fewer, larger fractions over a shorter course) has replaced conventional fractionation for most whole-breast RT, and ultra-hypofractionated courses are used in many centres, based on large randomised trials.</p>
            </InfoCard>
            <InfoCard title="Partial-breast RT and omission" tone="rose">
              <p>Partial-breast irradiation is an option for selected low-risk tumours. Omitting RT after BCS is considered for selected older patients with small, node-negative, HR-positive tumours who will take endocrine therapy — trading a modest local-recurrence increase for avoided treatment.</p>
            </InfoCard>
            <InfoCard title="Post-mastectomy and nodal RT" tone="rose">
              <p>Post-mastectomy RT and regional nodal irradiation are recommended for node-positive or locally advanced disease. After neoadjuvant therapy, decisions consider both pre-treatment stage and pathological response. Axillary RT is an alternative to completion dissection in selected node-positive patients.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="thymic" eyebrow="Thymic epithelial tumours" title="Thymic">
          <InfoCard title="Postoperative RT for thymic tumours" tone="sand" tag="PORT" className="max-w-3xl">
            <p>Not indicated after complete resection of encapsulated (Masaoka–Koga stage I) thymoma. Considered for incompletely resected disease, invasive (stage III) thymoma and thymic carcinoma; its value in stage II is debated and often depends on histology and margins. Definitive or palliative RT, often with chemotherapy, is used for unresectable disease.</p>
          </InfoCard>
        </AtlasSection>

        <AtlasSection id="mesothelioma" eyebrow="Pleural mesothelioma" title="Mesothelioma">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard title="Hemithoracic RT" tone="sage">
              <p>Historically delivered after extrapleural pneumonectomy as part of trimodality therapy (<TrialLink slug="mars">MARS</TrialLink> questioned the surgery itself). With intact lung after pleurectomy/decortication, hemithoracic IMRT is technically demanding because of lung toxicity and is confined to experienced centres or trials.</p>
            </InfoCard>
            <InfoCard title="Prophylactic tract irradiation" tone="sage">
              <p>RT to intervention sites (biopsy, drain, thoracoscopy tracts) to prevent tract metastases. Randomised trials did not show a routine benefit, so it is no longer standard.</p>
            </InfoCard>
            <InfoCard title="Palliative RT" tone="sage">
              <p>Effective for chest-wall pain and symptomatic masses; ongoing work defines the best schedules.</p>
            </InfoCard>
          </div>
        </AtlasSection>

        <AtlasSection id="cns" eyebrow="All diseases" title="Brain metastases">
          <InfoCard title="Stereotactic radiosurgery vs whole-brain RT" className="max-w-3xl">
            <p>Stereotactic radiosurgery is preferred for a limited number of brain metastases to spare cognition; whole-brain RT is reserved for more extensive disease, ideally with hippocampal avoidance and neuroprotective strategies. CNS-penetrant targeted therapy can defer RT in selected driver-positive patients. Post-SRS imaging changes (radionecrosis vs progression) need careful interpretation (see RANO-BM on the <Link href="/pathology#criteria" className="text-accent hover:underline">pathology & imaging atlas</Link>).</p>
          </InfoCard>
        </AtlasSection>

        <AtlasSection id="trials" eyebrow="Evidence" title="Curated radiotherapy trials" description="Live from the database: trials tagged with the radiotherapy treatment class.">
          <ClassTrials cls="radiotherapy" emptyLabel="No radiotherapy trials yet" />
        </AtlasSection>
      </div>
    </>
  );
}
