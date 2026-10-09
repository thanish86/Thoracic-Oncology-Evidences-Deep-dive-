import { describe, expect, it } from "vitest";
import { assessComparability, type ComparableTrial } from "@/lib/compare";
import { toBibtex, toRis, toVancouver } from "@/lib/citations";
import { formatEstimate, registryUrl } from "@/lib/utils";
import { analysisKey } from "@/lib/content/keys";

const a: ComparableTrial = {
  acronym: "A", disease: "NSCLC", setting: "First-line metastatic", lineOfTherapy: "1L", stages: ["metastatic"], biomarkers: ["pd-l1"],
  comparator: "Platinum chemotherapy", phase: "III", randomised: true, primaryEndpoints: ["PFS"], year: 2016,
};

describe("assessComparability", () => {
  it("returns nothing for a single trial", () => {
    expect(assessComparability([a])).toEqual([]);
  });
  it("always flags cross-trial comparison as indirect", () => {
    const w = assessComparability([a, { ...a, acronym: "B" }]);
    expect(w).toHaveLength(1);
    expect(w[0].message).toMatch(/indirect/);
  });
  it("flags different diseases as critical", () => {
    const w = assessComparability([a, { ...a, acronym: "B", disease: "Breast" }]);
    expect(w.some((x) => x.level === "critical" && /diseases/.test(x.message))).toBe(true);
  });
  it("flags different comparators, endpoints, biomarker selection, non-randomised and era", () => {
    const w = assessComparability([a, { ...a, acronym: "B", comparator: "Docetaxel", primaryEndpoints: ["OS"], biomarkers: [], randomised: false, year: 2025 }]);
    const text = w.map((x) => x.message).join(" ");
    expect(text).toMatch(/Control arms differ/);
    expect(text).toMatch(/Primary endpoints differ/);
    expect(text).toMatch(/biomarker selection/);
    expect(text).toMatch(/non-randomised/);
    expect(text).toMatch(/2016–2025/);
  });
});

const cite = { key: "KN024 2016", title: "Pembrolizumab versus Chemotherapy.", journal: "N Engl J Med", year: 2016, firstAuthor: "Reck M", pmid: "27718847", doi: "10.1056/NEJMoa1606774" };

describe("citations", () => {
  it("formats RIS", () => {
    const ris = toRis([cite]);
    expect(ris).toContain("TY  - JOUR");
    expect(ris).toContain("DO  - 10.1056/NEJMoa1606774");
    expect(ris.trim().endsWith("ER  -")).toBe(true);
  });
  it("formats BibTeX with a safe key", () => {
    expect(toBibtex([cite])).toMatch(/^@article\{KN0242016,/);
  });
  it("formats Vancouver", () => {
    expect(toVancouver(cite)).toBe("Reck M, et al. Pembrolizumab versus Chemotherapy. N Engl J Med. 2016. doi:10.1056/NEJMoa1606774 PMID: 27718847.");
  });
});

describe("utils", () => {
  it("formats estimates without inventing precision", () => {
    expect(formatEstimate("HR", 0.5, 0.37, 0.68)).toBe("HR 0.5 (95% CI 0.37–0.68)");
    expect(formatEstimate("HR", 0.66, 0.53, 0.82, 99.06)).toBe("HR 0.66 (99.06% CI 0.53–0.82)");
    expect(formatEstimate("HR", null)).toBeNull();
  });
  it("builds registry URLs only for known registries", () => {
    expect(registryUrl("ClinicalTrials.gov", "NCT02142738")).toBe("https://clinicaltrials.gov/study/NCT02142738");
    expect(registryUrl("UMIN", "UMIN000001755")).toBeNull();
  });
  it("produces stable analysis keys", () => {
    expect(analysisKey({ trialSlug: "x", endpoint: "OS", analysisLabel: "Final" })).toBe("x|OS|OS|ITT|Final");
  });
});
