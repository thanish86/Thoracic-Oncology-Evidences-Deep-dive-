import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader } from "@/components/ui/primitives";
import { ConceptSection } from "@/components/statistics/concept";
import { AlphaSpendingTable, ImmortalTimeDiagram } from "@/components/statistics/diagrams";
import { KmSimulator } from "@/components/statistics/km-simulator";
import { PowerCalculator } from "@/components/statistics/power-calculator";
import { NiVisualiser } from "@/components/statistics/ni-visualiser";
import { SubgroupForest } from "@/components/statistics/subgroup-forest";
import { CompetingRisks } from "@/components/statistics/competing-risks";

export const metadata: Metadata = {
  title: "Statistics academy",
  description: "Interactive oncology statistics: Kaplan–Meier, hazard ratios, power, non-inferiority, multiplicity, subgroups, RMST and competing risks — on synthetic teaching data.",
};

const TOC = [
  { id: "kaplan-meier", label: "Kaplan–Meier & censoring" },
  { id: "hazard-ratios", label: "Hazard ratios" },
  { id: "confidence-intervals", label: "Confidence intervals" },
  { id: "p-values", label: "P values" },
  { id: "power", label: "Power & sample size" },
  { id: "log-rank", label: "Log-rank test" },
  { id: "cox", label: "Cox regression & PH" },
  { id: "itt", label: "ITT vs per-protocol" },
  { id: "non-inferiority", label: "Non-inferiority & equivalence" },
  { id: "multiplicity", label: "Multiplicity & α control" },
  { id: "interim", label: "Interim analyses" },
  { id: "subgroups", label: "Subgroups & forest plots" },
  { id: "rmst", label: "RMST" },
  { id: "immortal-time", label: "Immortal-time bias" },
  { id: "landmark", label: "Landmark analyses" },
  { id: "competing-risks", label: "Competing risks" },
];

export default function StatisticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning studio"
        title="Oncology Statistics Academy"
        description="The methods behind every trial dossier in ONCOATLAS — explained for clinicians, with interactive simulators you can break on purpose."
      >
        <Notice tone="warning" title="All charts on this page use synthetic data">
          Every curve, forest plot and number generated here comes from a seeded simulation for teaching. None of it represents a real trial. For actual trial results, use the{" "}
          <Link href="/trials" className="font-medium text-accent underline-offset-2 hover:underline">
            trial explorer
          </Link>
          , where each number is tied to a cited source.
        </Notice>
      </PageHeader>

      <nav aria-label="Statistics topics" className="mb-4 rounded-2xl border border-border bg-surface p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Topics</p>
        <ol className="grid gap-x-6 gap-y-1 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
          {TOC.map((t, i) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="text-ink-2 hover:text-accent hover:underline">
                <span className="tabular mr-1.5 text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                {t.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-12 pb-16">
        <ConceptSection
          id="kaplan-meier"
          eyebrow="01 · Survival estimation"
          title="Kaplan–Meier curves & censoring"
          points={[
            <>S(t) = ∏ (1 − d<sub>i</sub>/n<sub>i</sub>) over event times ≤ t, where n<sub>i</sub> is the number at risk just before t<sub>i</sub>.</>,
            <>Censored patients leave the risk set without dropping the curve; tick marks show when.</>,
            <>Median = first time S(t) ≤ 0.5. If the curve never crosses 50%, the median is “not reached”.</>,
            <>Assumes <strong>non-informative censoring</strong>: censored patients have the same prognosis as those still followed.</>,
            <>Tail estimates rest on few patients — always read the number-at-risk table.</>,
            <>Administrative censoring (end of follow-up) is benign; drop-out related to toxicity or progression is not.</>,
          ]}
          pearl="A late plateau with fewer than ~10% of patients still at risk is fragile — one event can drop the curve sharply."
          widget={<KmSimulator />}
        >
          <p>
            The Kaplan–Meier (product-limit) estimator turns follow-up times with incomplete observation into a survival curve. At each event time the curve drops by the proportion of at-risk patients who had the event; censored observations simply reduce the number at risk for subsequent steps.
          </p>
        </ConceptSection>

        <ConceptSection
          id="hazard-ratios"
          eyebrow="02 · Effect measures"
          title="Hazard ratios"
          points={[
            <>HR = ratio of instantaneous event rates (experimental ÷ control), summarised over follow-up.</>,
            <>HR 0.70 ≈ 30% lower hazard at any time <em>if</em> hazards are proportional — not “30% more survival” or “30% cured”.</>,
            <>Under exponential survival, median ratio = 1/HR; this does not hold in general.</>,
            <>Clinically, pair the HR with absolute measures: landmark differences, medians, RMST.</>,
          ]}
          pearl="A HR is relative. The same HR can mean a large absolute gain in a high-risk population and a trivial one in a low-risk population."
        >
          <p>
            The hazard ratio is the default effect size for time-to-event endpoints. It is usually estimated from a Cox model (or, as in the simulator above, from the log-rank O − E statistic, which gives nearly identical answers for HRs near 1).
          </p>
        </ConceptSection>

        <ConceptSection
          id="confidence-intervals"
          eyebrow="03 · Precision"
          title="Confidence intervals"
          points={[
            <>A 95% CI is a range produced by a procedure that captures the true value in 95% of repeated trials.</>,
            <>For ratios, CIs are symmetric on the log scale: ln HR ± 1.96·SE.</>,
            <>Width reflects precision, driven mostly by the number of events.</>,
            <>A CI excluding 1 corresponds to two-sided P &lt; 0.05 (for the same test).</>,
          ]}
          pearl="The upper limit of the HR CI tells you the least benefit compatible with the data — the key bound for non-inferiority and for clinical meaningfulness."
        >
          <p>Confidence intervals communicate both the size of an effect and the uncertainty around it; they are more informative than a P value alone.</p>
        </ConceptSection>

        <ConceptSection
          id="p-values"
          eyebrow="04 · Inference"
          title="P values"
          points={[
            <>P = probability of data at least as extreme as observed <em>if</em> the null hypothesis were true.</>,
            <>It is not the probability the null is true, nor the probability the result is due to chance.</>,
            <>Statistical significance ≠ clinical importance; large trials make small effects “significant”.</>,
            <>A non-significant P is not evidence of no effect — inspect the CI.</>,
          ]}
          pearl="When a trial uses alpha spending or hierarchical testing, P < 0.05 is not automatically ‘significant’ — compare it with the pre-specified boundary for that analysis."
        >
          <p>P values remain the currency of trial reports, but they must be read against the pre-specified testing plan.</p>
        </ConceptSection>

        <ConceptSection
          id="power"
          eyebrow="05 · Design"
          title="Statistical power & sample size"
          points={[
            <>Power = probability of rejecting H₀ when the assumed alternative is true (commonly 80–90%).</>,
            <>Time-to-event trials are <strong>events-driven</strong>: the analysis is triggered by an event count, not a date.</>,
            <>Over-optimistic target HRs give under-powered trials that miss smaller but real effects.</>,
            <>Patients needed = events ÷ expected proportion with an event, inflated for drop-out.</>,
          ]}
          pearl="Schoenfeld: HR 0.75, two-sided α 0.05, 80% power, 1:1 randomisation needs ≈380 events. Unequal allocation increases the events required."
          widget={<PowerCalculator />}
        >
          <p>
            The Schoenfeld formula gives the number of events required by a log-rank test to detect a target hazard ratio with given α and power. Allocation enters through p(1 − p), which is maximal at 1:1.
          </p>
        </ConceptSection>

        <ConceptSection
          id="log-rank"
          eyebrow="06 · Hypothesis testing"
          title="The log-rank test"
          points={[
            <>At each event time compares observed events in one arm with those expected if both arms shared the same hazard.</>,
            <>χ² = (O − E)² / V with 1 degree of freedom; V is the hypergeometric variance.</>,
            <>Most powerful under proportional hazards; loses power when curves cross.</>,
            <>Stratified log-rank tests sum O − E and V within randomisation strata.</>,
          ]}
          pearl="The log-rank test gives a P value but no effect size. The Peto estimate exp((O − E)/V) offers a quick HR approximation."
        >
          <p>The log-rank test is the standard primary analysis for survival endpoints. The simulator reports its χ², P value, and O/E-derived HR estimates.</p>
        </ConceptSection>

        <ConceptSection
          id="cox"
          eyebrow="07 · Modelling"
          title="Cox regression & proportional hazards"
          points={[
            <>h(t | x) = h₀(t)·exp(βx): the baseline hazard is unspecified (semi-parametric).</>,
            <>exp(β) is the HR for a one-unit change in x, adjusted for other covariates.</>,
            <>PH assumption: the HR is constant over time. Check with Schoenfeld residuals or log(−log S) plots.</>,
            <>Crossing or delayed-separation curves (common with immunotherapy) signal non-PH; consider RMST or milestone analyses.</>,
          ]}
          pearl="Under non-proportional hazards, a single HR is a weighted average that depends on follow-up and censoring pattern — it can hide early harm and late benefit."
        >
          <p>The Cox model generalises the log-rank test to estimate hazard ratios adjusted for covariates and stratification factors.</p>
        </ConceptSection>

        <ConceptSection
          id="itt"
          eyebrow="08 · Analysis populations"
          title="Intention-to-treat vs per-protocol"
          points={[
            <><strong>ITT</strong>: everyone analysed in the arm to which they were randomised, preserving randomisation.</>,
            <><strong>Per-protocol</strong>: only adherent patients — breaks randomisation, prone to selection bias.</>,
            <>Superiority: ITT is conservative (dilution biases towards no difference).</>,
            <>Non-inferiority: dilution is anti-conservative, so both ITT and per-protocol should support the conclusion.</>,
          ]}
          pearl="Crossover from control to experimental therapy dilutes OS differences in ITT; methods such as RPSFT or IPCW attempt adjustment but rest on strong assumptions."
        >
          <p>Which patients enter the analysis changes what question is answered: the effect of assigning a treatment (ITT) versus receiving it as planned (per-protocol).</p>
        </ConceptSection>

        <ConceptSection
          id="non-inferiority"
          eyebrow="09 · Design"
          title="Non-inferiority & equivalence"
          points={[
            <>The margin M is pre-specified: the largest loss of efficacy acceptable in exchange for other advantages.</>,
            <>Non-inferiority shown if the upper CI bound of the HR is below M.</>,
            <>Equivalence requires the whole CI within (1/M, M) — two one-sided tests.</>,
            <>Switching NI → superiority is acceptable after NI is shown; the reverse is not (without a pre-specified margin).</>,
          ]}
          pearl="Margins are often derived to preserve a fraction (e.g. 50%) of the control's established effect versus placebo — check constancy of that historical effect."
          widget={<NiVisualiser />}
        >
          <p>Non-inferiority trials ask whether a new treatment is “not unacceptably worse” — useful when it is less toxic, cheaper or more convenient.</p>
        </ConceptSection>

        <ConceptSection
          id="multiplicity"
          eyebrow="10 · Error control"
          title="Multiplicity, alpha spending & hierarchical testing"
          points={[
            <>Every extra test (endpoint, population, look) inflates the familywise type I error unless controlled.</>,
            <><strong>Hierarchical (fixed-sequence)</strong>: test endpoints in pre-specified order at full α; stop at the first failure.</>,
            <><strong>α splitting</strong> (e.g. Bonferroni/Holm) or graphical approaches recycle α between hypotheses.</>,
            <>Once the hierarchy breaks, later “P &lt; 0.05” results are descriptive only.</>,
          ]}
          pearl="If PFS is tested before OS in a hierarchy and PFS fails, an OS P of 0.03 cannot be claimed as statistically significant."
        >
          <p>Large phase III trials test several hypotheses; the statistical analysis plan defines how the overall α is shared.</p>
        </ConceptSection>

        <ConceptSection
          id="interim"
          eyebrow="11 · Group-sequential designs"
          title="Interim analyses & O’Brien–Fleming boundaries"
          points={[
            <>Interim looks let a data monitoring committee stop early for efficacy, futility or harm.</>,
            <>α-spending functions (Lan–DeMets) allow flexible timing of looks by information fraction (events observed / planned).</>,
            <>Trials stopped early for benefit tend to overestimate the effect size.</>,
            <>Futility boundaries are usually non-binding.</>,
          ]}
          pearl="With O’Brien–Fleming boundaries, early stopping requires overwhelming evidence; the final boundary is only slightly stricter than 1.96."
          widget={<AlphaSpendingTable />}
        >
          <p>Repeatedly testing accumulating data inflates type I error; group-sequential boundaries keep the overall α at its nominal level.</p>
        </ConceptSection>

        <ConceptSection
          id="subgroups"
          eyebrow="12 · Heterogeneity"
          title="Subgroups, forest plots & interaction P values"
          points={[
            <>Forest plots show subgroup HRs with CIs on a log scale; the overall estimate is usually the best guide for any subgroup.</>,
            <>Assess heterogeneity with a test for interaction, not by comparing subgroup P values.</>,
            <>Credible subgroup effects are pre-specified, few, biologically plausible, stratified, and replicated.</>,
            <>Small subgroups produce wide CIs that commonly cross 1 by chance.</>,
          ]}
          pearl="With 20 subgroups and no true heterogeneity, about one is expected to show an interaction P < 0.05 by chance."
          widget={<SubgroupForest />}
        >
          <p>Subgroup analyses ask whether the treatment effect varies by patient characteristics — a question that most trials are not powered to answer.</p>
        </ConceptSection>

        <ConceptSection
          id="rmst"
          eyebrow="13 · Alternative effect measures"
          title="Restricted mean survival time (RMST)"
          points={[
            <>RMST(τ) = area under the survival curve up to τ: mean event-free time within the window.</>,
            <>Difference in RMST is in months — directly interpretable and valid without PH.</>,
            <>τ must be pre-specified and supported by adequate follow-up.</>,
            <>Remains estimable when medians are “not reached”.</>,
          ]}
          pearl="Under crossing curves the HR may be near 1 while the RMST difference still describes how much time was gained or lost on average within τ. The simulator above reports RMST at your chosen τ."
        >
          <p>RMST is increasingly reported alongside HRs, especially for immunotherapy trials with delayed separation or crossing curves.</p>
        </ConceptSection>

        <ConceptSection
          id="immortal-time"
          eyebrow="14 · Bias"
          title="Immortal-time bias"
          points={[
            <>Arises when group membership is defined by something that happens after time zero (response, receiving a drug, toxicity).</>,
            <>Patients must survive long enough to be classified into the “exposed” group — that period is immortal.</>,
            <>Classic examples: “responders vs non-responders”, “patients who developed irAEs live longer”.</>,
            <>Fixes: landmark analysis or modelling exposure as a time-dependent covariate.</>,
          ]}
          pearl="Comparing OS of responders vs non-responders from randomisation is biased in favour of responders, even if response has no causal effect."
          widget={<ImmortalTimeDiagram />}
        >
          <p>Immortal-time bias is common in retrospective and post-hoc analyses and can create an apparent survival benefit from nothing.</p>
        </ConceptSection>

        <ConceptSection
          id="landmark"
          eyebrow="15 · Bias control"
          title="Landmark analyses"
          points={[
            <>Choose a landmark time; include only patients alive (and event-free) at that time.</>,
            <>Classify by status at the landmark; follow from the landmark onwards.</>,
            <>Landmark must be pre-specified and clinically motivated.</>,
            <>Results apply only to landmark survivors; later-changing exposures are ignored.</>,
          ]}
          pearl="A landmark analysis answers a conditional question: among patients alive at the landmark, does status at that time predict outcome?"
        >
          <p>The landmark method removes immortal time by starting the clock at a common time after which everyone’s exposure group is known.</p>
        </ConceptSection>

        <ConceptSection
          id="competing-risks"
          eyebrow="16 · Multiple event types"
          title="Competing risks: cumulative incidence vs 1 − KM"
          points={[
            <>A competing event precludes the event of interest (e.g. non-cancer death precludes cancer death).</>,
            <>Treating competing events as censored violates non-informative censoring; 1 − KM then overestimates incidence.</>,
            <>Use the cumulative incidence function (Aalen–Johansen); compare groups with Gray’s test.</>,
            <>Cause-specific Cox HR (aetiology) vs Fine–Gray subdistribution HR (prediction of incidence).</>,
          ]}
          pearl="The bias of 1 − KM grows with the competing-event rate — prominent in older populations and in endpoints like local recurrence or brain metastasis incidence."
          widget={<CompetingRisks />}
        >
          <p>When patients can experience different kinds of first event, the Kaplan–Meier method answers a hypothetical question (a world without the competing event) rather than the real-world probability.</p>
        </ConceptSection>
      </div>
    </>
  );
}
