/* =====================================================================
   Thoracic Evidence Atlas — app.js
   This file draws every page. It reads window.ATLAS_DATA (from data.js)
   and writes HTML into <main id="app">.

   Pages are chosen by the part of the address after "#":
     #             → Home
     #nsclc        → a disease page (also #sclc, #thymic, #mesothelioma)
     #t-flaura     → one trial (t- + the trial's short name)
     #biomarkers   → all biomarkers;  #b-egfr → one biomarker
     #timeline, #flashcards, #saved
   ===================================================================== */
(function () {
  "use strict";

  const DATA = window.ATLAS_DATA || { trials: [], biomarkers: [], drugs: [] };
  const app = document.getElementById("app");

  /* ---------- Fixed labels ---------- */
  const DISEASES = {
    nsclc: { name: "Non-small-cell lung cancer", short: "NSCLC", blurb: "Screening, surgery, perioperative immunotherapy, stage III consolidation and the driver-oncogene era." },
    sclc: { name: "Small-cell lung cancer", short: "SCLC", blurb: "Chemoradiation, cranial strategy, chemo-immunotherapy and DLL3-directed T-cell engagers." },
    thymic: { name: "Thymoma & thymic carcinoma", short: "Thymic", blurb: "Rare tumours with scarce prospective data: chemotherapy, targeted agents and immunotherapy." },
    mesothelioma: { name: "Mesothelioma", short: "Mesothelioma", blurb: "Histology-led systemic therapy, dual checkpoint blockade and the debate over radical surgery." },
  };
  const RESULT = {
    POSITIVE: ["Met primary endpoint", "pill-good"],
    NEGATIVE: ["Did not meet primary endpoint", "pill-bad"],
    NON_INFERIOR: ["Non-inferior", "pill-good"],
    MIXED: ["Mixed result", "pill-amber"],
    PENDING: ["Pending", "pill-neutral"],
    DESCRIPTIVE: ["Single-arm study", "pill-neutral"],
  };
  const ENDPOINT = {
    OS: "Overall survival", PFS: "Progression-free survival", EFS: "Event-free survival", DFS: "Disease-free survival",
    RFS: "Recurrence-free survival", ORR: "Objective response rate", CR: "Complete response", pCR: "Pathological complete response",
    MPR: "Major pathological response", DoR: "Duration of response", DCR: "Disease control rate", CNS_ORR: "CNS response rate",
    CNS_PFS: "CNS progression-free survival", LC: "Local control", QOL: "Quality of life", TTP: "Time to progression", OTHER: "Other outcome",
  };
  const STAGE = {
    early: "Early stage", "locally-advanced": "Locally advanced", metastatic: "Metastatic", "limited-stage": "Limited stage",
    "extensive-stage": "Extensive stage", resectable: "Resectable", unresectable: "Unresectable", recurrent: "Recurrent",
    screening: "Screening", any: "Any stage",
  };

  /* ---------- Small helpers ---------- */
  // Make any text safe to place inside HTML (stops stray "<" from breaking the page).
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function resultPill(result) {
    const [text, cls] = RESULT[result] || ["—", "pill-neutral"];
    return `<span class="pill ${cls}">${text}</span>`;
  }
  const statusPill = `<span class="pill pill-amber" title="Copied from the PubMed abstract; not yet checked by a clinician against the full paper">Awaiting verification</span>`;
  function phaseLabel(p) {
    return p === "META" ? "Meta-analysis" : p === "OBS" ? "Observational" : `Phase ${p}`;
  }
  function trialsFor(disease) {
    return DATA.trials.filter((t) => t.disease === disease);
  }
  function pubmed(pmid) {
    return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  }
  function effectText(o) {
    if (o.effectEstimate == null) return "—";
    const ci = o.ciLower != null ? ` (${o.ciLevel ?? 95}% CI ${o.ciLower}–${o.ciUpper})` : "";
    return `${o.effectMeasure} ${o.effectEstimate}${ci}`;
  }

  // Saved trials are kept in this browser only (localStorage). Wrapped in try/catch
  // because some private windows block storage.
  const SAVED_KEY = "atlas-saved-trials";
  function getSaved() {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY)) || []; } catch { return []; }
  }
  function setSaved(list) {
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
  }

  // A small picture of a hazard ratio and its confidence interval on a log scale.
  // The dashed line is HR = 1 (no difference). Left of it favours the experimental arm.
  function hrBar(o) {
    if (!["HR", "OR", "RR"].includes(o.effectMeasure) || o.effectEstimate == null || o.ciLower == null) return "";
    const min = Math.log(0.1), max = Math.log(2.5), W = 160;
    const x = (v) => Math.max(0, Math.min(W, ((Math.log(v) - min) / (max - min)) * W));
    return `<svg class="hr-bar" width="${W + 8}" height="22" viewBox="-4 0 ${W + 8} 22" role="img" aria-label="${esc(effectText(o))}">
      <line x1="${x(1)}" x2="${x(1)}" y1="2" y2="20" stroke="var(--ink-3)" stroke-dasharray="3 3"/>
      <line x1="${x(o.ciLower)}" x2="${x(o.ciUpper)}" y1="11" y2="11" stroke="var(--ink-2)" stroke-width="2" stroke-linecap="round"/>
      <circle cx="${x(o.effectEstimate)}" cy="11" r="5" fill="var(--accent)"/>
    </svg>`;
  }

  // A trial card used on several pages.
  function trialCard(t) {
    return `<a class="card" href="#t-${t.slug}">
      <div class="card-top"><span class="pill bg-${t.disease} ink-${t.disease}">${DISEASES[t.disease].short}</span>${t.landmark ? '<span class="star" title="Landmark trial">★</span>' : ""}</div>
      <h3>${esc(t.acronym)}</h3>
      <p class="sub">${esc(t.setting)}</p>
      <div>${resultPill(t.result)}</div>
      <p class="meta tabular">${t.year} · ${phaseLabel(t.phase)}</p>
    </a>`;
  }

  /* =================================================================
     PAGES
     ================================================================= */

  function renderHome() {
    const outcomes = DATA.trials.reduce((n, t) => n + t.outcomes.length, 0);
    const landmarks = DATA.trials.filter((t) => t.landmark).slice(-8).reverse();
    app.innerHTML = `<div class="wrap">
      <section class="hero">
        <p class="eyebrow">Thoracic oncology · 1990s to 2026</p>
        <h1>The trials behind<br><span class="soft">every decision.</span></h1>
        <p class="lead">Learn the landmark studies in lung cancer, thymic tumours and mesothelioma. Every number links to its PubMed source.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#nsclc">Start with NSCLC</a>
          <button class="btn btn-link" type="button" data-action="search">Search a trial ›</button>
        </div>
        <div class="stats tabular">
          <div><b>${DATA.trials.length}</b>trials</div>
          <div><b>${outcomes}</b>sourced results</div>
          <div><b>${DATA.biomarkers.length}</b>biomarkers</div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>Choose a disease.</h2><p>Each one opens its trials, sorted from the earliest evidence to the newest.</p></div></div>
        <div class="tiles">
          ${Object.entries(DISEASES).map(([slug, d]) => `
            <a class="tile bg-${slug}" href="#${slug}">
              <div><h3>${d.short === "Thymic" ? "Thymic tumours" : d.short}</h3><p>${d.blurb}</p></div>
              <span class="count ink-${slug}">${trialsFor(slug).length} trials ›</span>
            </a>`).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>Landmark trials.</h2><p>Studies that changed how thoracic cancers are treated.</p></div><a href="#timeline">See the timeline ›</a></div>
        <div class="cards">${landmarks.map(trialCard).join("")}</div>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>Learn by recall.</h2><p>Flashcards built from the trials: see the name, remember the question and the result.</p></div></div>
        <a class="tile bg-sclc" href="#flashcards" style="min-height:160px"><div><h3>Open flashcards</h3><p>One card per trial, with the primary result taken from its abstract.</p></div><span class="count ink-sclc">Start ›</span></a>
      </section>
    </div>`;
  }

  function renderDisease(slug, filter) {
    const d = DISEASES[slug];
    const all = trialsFor(slug);
    const stages = [...new Set(all.flatMap((t) => t.stages))];
    const shown = filter ? all.filter((t) => t.stages.includes(filter)) : all;
    app.innerHTML = `<div class="wrap">
      <section class="disease-hero bg-${slug}">
        <p class="eyebrow ink-${slug}">${all.length} trials</p>
        <h1>${d.name}</h1>
        <p>${d.blurb}</p>
      </section>
      <div class="chips" role="group" aria-label="Filter by stage">
        <button class="chip" type="button" data-filter="" aria-pressed="${!filter}">All</button>
        ${stages.map((s) => `<button class="chip" type="button" data-filter="${s}" aria-pressed="${filter === s}">${STAGE[s] || s}</button>`).join("")}
      </div>
      ${shown.length ? `<div class="cards">${shown.map(trialCard).join("")}</div>` : `<div class="empty-state"><h3>No trials here yet</h3><p>Try another stage.</p></div>`}
    </div>`;
    app.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => renderDisease(slug, b.dataset.filter)));
  }

  function renderTrial(slug, tab) {
    const t = DATA.trials.find((x) => x.slug === slug);
    if (!t) return renderNotFound();
    tab = tab || "overview";
    const saved = getSaved().includes(slug);
    const TABS = [["overview", "Overview"], ["results", "Results"], ["safety", "Safety"], ["appraisal", "Appraisal"], ["references", "References"]];

    app.innerHTML = `<div class="wrap">
      <a class="back" href="#${t.disease}">‹ ${DISEASES[t.disease].short}</a>
      <section class="trial-head">
        <div class="pills">
          <span class="pill bg-${t.disease} ink-${t.disease}">${DISEASES[t.disease].short}</span>
          <span class="pill pill-neutral">${phaseLabel(t.phase)}</span>
          ${resultPill(t.result)} ${statusPill}
        </div>
        <h1>${esc(t.acronym)}</h1>
        <p class="title">${esc(t.title)}</p>
        <div class="trial-actions">
          <button class="btn ${saved ? "btn-primary" : "btn-link"}" type="button" id="save-btn" aria-pressed="${saved}">${saved ? "✓ Saved" : "＋ Save to my list"}</button>
        </div>
      </section>
      <div class="segmented" role="tablist" aria-label="Trial sections">
        ${TABS.map(([id, label]) => `<button role="tab" type="button" data-tab="${id}" aria-selected="${tab === id}">${label}</button>`).join("")}
      </div>
      <section class="panel" role="tabpanel">${trialPanel(t, tab)}</section>
    </div>`;

    app.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => renderTrial(slug, b.dataset.tab)));
    document.getElementById("save-btn").addEventListener("click", () => {
      const list = getSaved();
      setSaved(list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]);
      renderTrial(slug, tab);
    });
  }

  function trialPanel(t, tab) {
    if (tab === "overview") {
      const arms = t.arms.map((a) => `<div class="arm"><b>${esc(a.label)}</b><small>${esc(a.dosing || a.regimen)}</small></div>`).join("");
      const randomised = t.design?.randomised;
      return `
        <p class="label">The question</p>
        <p class="question">${esc(t.question)}</p>

        <div class="block"><p class="label">PICO</p>
          <div class="pico">
            <div class="bg-nsclc"><b class="ink-nsclc">P</b><span class="ink-nsclc">Population</span><p>${esc(t.pico.population)}</p></div>
            <div class="bg-mesothelioma"><b class="ink-mesothelioma">I</b><span class="ink-mesothelioma">Intervention</span><p>${esc(t.pico.intervention)}</p></div>
            <div class="bg-sclc"><b class="ink-sclc">C</b><span class="ink-sclc">Comparator</span><p>${esc(t.pico.comparator)}</p></div>
            <div class="bg-thymic"><b class="ink-thymic">O</b><span class="ink-thymic">Outcomes</span><p>${esc(t.pico.outcomes)}</p></div>
          </div>
        </div>

        <div class="block"><p class="label">Trial design</p>
          <div class="schema">
            <div class="pop">${esc(t.pico.population)}</div>
            ${randomised ? '<div class="r" title="Randomised">R</div>' : '<div aria-hidden="true">→</div>'}
            <div class="arms">${arms}</div>
          </div>
        </div>

        <div class="block"><div class="facts">
          <div class="fact"><small>Setting</small><div>${esc(t.setting)}</div></div>
          <div class="fact"><small>Design</small><div>${phaseLabel(t.phase)}${randomised ? ", randomised" : ""}</div></div>
          <div class="fact"><small>Patients</small><div class="tabular">${t.design?.sampleSize ?? "Not stated in abstract"}</div></div>
          <div class="fact"><small>Blinding</small><div>${esc(t.design?.blinding || "Not stated")}</div></div>
          <div class="fact"><small>Primary endpoint</small><div>${esc((t.design?.primaryEndpoints || []).join(", "))}</div></div>
          <div class="fact"><small>Published</small><div class="tabular">${t.year}</div></div>
        </div></div>
        ${t.pearl ? `<div class="block"><p class="label">Teaching pearl</p><div class="pearl bg-thymic">${esc(t.pearl)}</div></div>` : ""}`;
    }

    if (tab === "results") {
      if (!t.outcomes.length) return `<div class="empty-state"><h3>No results extracted yet</h3><p>Results appear only after they are copied from the abstract with a quote.</p></div>`;
      // Group the results by endpoint (OS, PFS, ...), keeping original and updated analyses side by side.
      const groups = {};
      t.outcomes.forEach((o) => (groups[o.endpointLabel || ENDPOINT[o.endpoint] || o.endpoint] ||= []).push(o));
      const controlled = t.arms.some((a) => a.role === "CONTROL");
      const [h1, h2] = controlled ? ["Experimental", "Control"] : [t.arms[0]?.label || "Group 1", t.arms[1]?.label || "Group 2"];
      return Object.entries(groups).map(([name, rows]) => `
        <h3 class="endpoint-title">${esc(name)} ${rows.some((r) => r.isPrimaryEndpoint) ? '<span class="pill pill-good">Primary endpoint</span>' : ""}</h3>
        <div class="table-wrap"><table>
          <thead><tr><th>Analysis</th><th>${esc(h1)}</th><th>${esc(h2)}</th><th>Effect</th><th>P</th><th>Source</th></tr></thead>
          <tbody>${rows.map((o) => `<tr>
            <td><b>${esc(o.analysisLabel)}</b><small>${esc(o.population || "ITT")}</small></td>
            <td class="tabular">${esc(o.experimentalValue || "—")}</td>
            <td class="tabular">${esc(o.controlValue || "—")}</td>
            <td class="tabular">${esc(effectText(o))}${hrBar(o)}</td>
            <td class="tabular">${esc(o.pValue || "—")}</td>
            <td>${o.source.pmid ? `<a href="${pubmed(o.source.pmid)}" target="_blank" rel="noopener">PubMed ${o.source.pmid} ↗</a>` : esc(o.source.doi)}
              <details class="quote"><summary>Show exact quote</summary><blockquote>“${esc(o.sourceQuote)}”</blockquote></details></td>
          </tr>`).join("")}</tbody>
        </table></div>`).join("") +
        `<p class="note">How to read the bar: the dot is the hazard ratio, the line is its confidence interval, and the dashed line is 1 (no difference). A line entirely left of the dashed line means a statistically significant benefit for the experimental arm.</p>`;
    }

    if (tab === "safety") {
      if (!t.safety.length) return `<div class="empty-state"><h3>No safety data extracted yet</h3></div>`;
      return `<div class="table-wrap"><table>
        <thead><tr><th>Adverse events</th><th>Experimental / group 1</th><th>Control / group 2</th><th>Source</th></tr></thead>
        <tbody>${t.safety.map((s) => `<tr>
          <td>${esc(s.description)}</td>
          <td class="tabular">${esc(s.experimentalValue || "—")}</td>
          <td class="tabular">${esc(s.controlValue || "—")}</td>
          <td>${s.source.pmid ? `<a href="${pubmed(s.source.pmid)}" target="_blank" rel="noopener">PubMed ${s.source.pmid} ↗</a>` : ""}
            <details class="quote"><summary>Show exact quote</summary><blockquote>“${esc(s.sourceQuote)}”</blockquote></details></td>
        </tr>`).join("")}</tbody></table></div>`;
    }

    if (tab === "appraisal") {
      const list = (items) => (items.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "<p>Not yet written.</p>");
      return `<div class="two-col">
          <div class="list-card"><h3>Strengths</h3>${list(t.strengths)}</div>
          <div class="list-card"><h3>Limitations</h3>${list(t.limitations)}</div>
        </div>
        ${t.implications ? `<div class="block"><p class="label">What it changed</p><p class="question" style="font-size:20px;font-weight:500">${esc(t.implications)}</p></div>` : ""}
        <p class="note">Appraisal text is a teaching summary and is awaiting expert review.</p>`;
    }

    // References
    return `<ol class="refs">${t.publications.map((p) => `<li>
        <b>${esc(p.label || (p.type === "PRIMARY" ? "Primary publication" : "Follow-up publication"))}</b><br>
        ${esc(p.author ? p.author + " et al. " : "")}${esc(p.title)} <i>${esc(p.journal)}</i> ${p.year}.
        <div class="links">
          ${p.pmid ? `<a href="${pubmed(p.pmid)}" target="_blank" rel="noopener">PubMed ${p.pmid} ↗</a>` : ""}
          ${p.doi ? `<a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">DOI ↗</a>` : ""}
        </div></li>`).join("")}</ol>
      ${t.registry.length ? `<p class="note">Registered as ${t.registry.map((r) => r.registry === "ClinicalTrials.gov" ? `<a href="https://clinicaltrials.gov/study/${esc(r.id)}" target="_blank" rel="noopener">${esc(r.id)} ↗</a>` : esc(r.id)).join(", ")}</p>` : ""}`;
  }

  function renderBiomarkers() {
    app.innerHTML = `<div class="wrap">
      <section class="hero" style="padding-bottom:24px"><p class="eyebrow">Molecular atlas</p><h1>Biomarkers.</h1>
        <p class="lead">The biology, testing and resistance story behind each target.</p></section>
      <div class="bm-grid">${DATA.biomarkers.map((b) => `
        <a class="bm" href="#b-${b.slug}"><h3>${esc(b.gene || b.name)}</h3><p>${esc(b.summary)}</p>
          <span class="pill pill-neutral" style="align-self:start">${DATA.trials.filter((t) => t.biomarkers.includes(b.slug)).length} trials</span></a>`).join("")}
      </div></div>`;
  }

  function renderBiomarker(slug) {
    const b = DATA.biomarkers.find((x) => x.slug === slug);
    if (!b) return renderNotFound();
    const trials = DATA.trials.filter((t) => t.biomarkers.includes(slug));
    const drugs = (b.drugs || []).map((s) => DATA.drugs.find((d) => d.slug === s)).filter(Boolean);
    const bullets = (items) => `<ul class="bullets">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    app.innerHTML = `<div class="wrap">
      <a class="back" href="#biomarkers">‹ Biomarkers</a>
      <section class="disease-hero bg-sclc"><p class="eyebrow ink-sclc">Biomarker</p><h1>${esc(b.name)}</h1><p>${esc(b.summary)}</p></section>
      <div class="block"><p class="label">Biology</p><p class="prose">${esc(b.biology)}</p></div>
      ${b.alterations?.length ? `<div class="block"><p class="label">Alteration types</p>${bullets(b.alterations)}</div>` : ""}
      <div class="block"><p class="label">How to test</p><div class="tags">${b.testing.methods.map((m) => `<span class="pill pill-neutral">${esc(m)}</span>`).join("")}</div>
        ${b.testing.notes ? `<p class="prose" style="margin-top:12px">${esc(b.testing.notes)}</p>` : ""}</div>
      <div class="block"><p class="label">Why it matters for treatment</p><p class="prose">${esc(b.predictive)}</p></div>
      ${b.resistance?.length ? `<div class="block"><p class="label">Resistance</p>${bullets(b.resistance)}</div>` : ""}
      ${b.cns ? `<div class="block"><p class="label">Brain metastases</p><p class="prose">${esc(b.cns)}</p></div>` : ""}
      ${drugs.length ? `<div class="block"><p class="label">Drugs</p><div class="two-col">${drugs.map((d) => `<div class="list-card"><h3>${esc(d.name)}</h3><p class="prose" style="font-size:15px">${esc(d.mechanism)}</p></div>`).join("")}</div></div>` : ""}
      <div class="block"><p class="label">Trials</p>${trials.length ? `<div class="cards">${trials.map(trialCard).join("")}</div>` : "<p>No trials linked yet.</p>"}</div>
      <p class="note">Teaching summary awaiting expert review. Doses are not shown; always check the current drug label.</p>
    </div>`;
  }

  function renderTimeline(disease) {
    const list = disease ? trialsFor(disease) : DATA.trials;
    const years = {};
    list.forEach((t) => (years[t.year] ||= []).push(t));
    app.innerHTML = `<div class="wrap">
      <section class="hero" style="padding-bottom:16px"><p class="eyebrow">Timeline</p><h1>How the evidence grew.</h1>
        <p class="lead">Each trial placed in the year its main results were published.</p></section>
      <div class="chips" role="group" aria-label="Filter by disease">
        <button class="chip" type="button" data-d="" aria-pressed="${!disease}">All</button>
        ${Object.entries(DISEASES).map(([s, d]) => `<button class="chip" type="button" data-d="${s}" aria-pressed="${disease === s}">${d.short}</button>`).join("")}
      </div>
      <div class="timeline">${Object.keys(years).sort().map((y) => `
        <div class="year"><h3 class="tabular">${y}</h3><div class="cards">${years[y].map(trialCard).join("")}</div></div>`).join("")}
      </div></div>`;
    app.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => renderTimeline(b.dataset.d)));
  }

  // Flashcards: front = acronym; back = clinical question + the primary result (copied from data).
  let cardIndex = 0;
  let cardFlipped = false;
  let cardDeck = null;
  function renderFlashcards() {
    if (!cardDeck) cardDeck = DATA.trials.filter((t) => t.outcomes.length).map((t) => t.slug);
    const t = DATA.trials.find((x) => x.slug === cardDeck[cardIndex]);
    const primary = t.outcomes.find((o) => o.isPrimaryEndpoint) || t.outcomes[0];
    const result = [primary.experimentalValue && `${primary.experimentalValue} vs ${primary.controlValue || "—"}`, primary.effectEstimate != null && effectText(primary)].filter(Boolean).join(" · ");
    app.innerHTML = `<div class="wrap">
      <section class="hero" style="padding-bottom:0"><p class="eyebrow">Flashcards</p><h1>Recall the trial.</h1>
        <p class="lead">Read the name, say the question and the result aloud, then tap the card.</p></section>
      <div class="flash-wrap">
        <button class="flash bg-${t.disease}" type="button" id="flash" aria-label="Flip card">
          <span class="pill pill-neutral" style="align-self:start">${DISEASES[t.disease].short} · ${t.year}</span>
          <h2>${esc(t.acronym)}</h2>
          ${cardFlipped
            ? `<p class="answer"><b>Question:</b> ${esc(t.question)}</p>
               <p class="answer"><b>${esc(ENDPOINT[primary.endpoint] || primary.endpoint)}${primary.isPrimaryEndpoint ? " (primary)" : ""}:</b> ${esc(result || "see Results")}</p>
               <p class="hint">${RESULT[t.result][0]} · source PubMed ${esc(primary.source.pmid || "")}</p>`
            : `<p class="hint">Tap to reveal the question and result</p>`}
        </button>
        <div class="flash-controls">
          <button class="btn btn-link" type="button" id="prev">‹ Previous</button>
          <span class="counter tabular">${cardIndex + 1} / ${cardDeck.length}</span>
          <button class="btn btn-link" type="button" id="next">Next ›</button>
          <button class="btn btn-link" type="button" id="shuffle">Shuffle</button>
          <a class="btn btn-link" href="#t-${t.slug}">Open trial</a>
        </div>
      </div></div>`;
    document.getElementById("flash").onclick = () => { cardFlipped = !cardFlipped; renderFlashcards(); };
    document.getElementById("next").onclick = () => { cardIndex = (cardIndex + 1) % cardDeck.length; cardFlipped = false; renderFlashcards(); };
    document.getElementById("prev").onclick = () => { cardIndex = (cardIndex - 1 + cardDeck.length) % cardDeck.length; cardFlipped = false; renderFlashcards(); };
    document.getElementById("shuffle").onclick = () => { cardDeck.sort(() => Math.random() - 0.5); cardIndex = 0; cardFlipped = false; renderFlashcards(); };
  }

  function renderSaved() {
    const saved = getSaved().map((s) => DATA.trials.find((t) => t.slug === s)).filter(Boolean);
    app.innerHTML = `<div class="wrap">
      <section class="hero" style="padding-bottom:24px"><p class="eyebrow">My list</p><h1>Saved trials.</h1>
        <p class="lead">Trials you saved stay in this browser on this device.</p></section>
      ${saved.length ? `<div class="cards">${saved.map(trialCard).join("")}</div>`
        : `<div class="empty-state"><h3>Nothing saved yet</h3><p>Open any trial and press “Save to my list”.</p><p style="margin-top:14px"><a href="#nsclc">Browse NSCLC trials ›</a></p></div>`}
    </div>`;
  }

  function renderNotFound() {
    app.innerHTML = `<div class="wrap"><div class="empty-state" style="margin-top:40px"><h3>Page not found</h3><p><a href="#">Go to the home page</a></p></div></div>`;
  }

  /* =================================================================
     SEARCH
     ================================================================= */
  const overlay = document.getElementById("search-overlay");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");

  function openSearch() { overlay.hidden = false; input.value = ""; runSearch(""); input.focus(); }
  function closeSearch() { overlay.hidden = true; }
  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) { results.innerHTML = `<li class="empty">Type at least two letters.</li>`; return; }
    const hits = [
      ...DATA.trials.filter((t) => `${t.acronym} ${t.title} ${t.pico.intervention}`.toLowerCase().includes(q))
        .map((t) => ({ href: `#t-${t.slug}`, name: t.acronym, kind: `${DISEASES[t.disease].short} trial · ${t.year}` })),
      ...DATA.biomarkers.filter((b) => `${b.name} ${b.gene}`.toLowerCase().includes(q))
        .map((b) => ({ href: `#b-${b.slug}`, name: b.gene || b.name, kind: "Biomarker" })),
      ...DATA.drugs.filter((d) => `${d.name} ${d.brands.join(" ")}`.toLowerCase().includes(q)).flatMap((d) => {
        // A drug opens the first biomarker that lists it, otherwise the first trial that uses it.
        const bm = DATA.biomarkers.find((b) => (b.drugs || []).includes(d.slug));
        const tr = DATA.trials.find((t) => t.pico.intervention.toLowerCase().includes(d.name.toLowerCase()));
        return bm || tr ? [{ href: bm ? `#b-${bm.slug}` : `#t-${tr.slug}`, name: d.name, kind: d.cls }] : [];
      }),
    ].slice(0, 12);
    results.innerHTML = hits.length
      ? hits.map((h) => `<li><a href="${h.href}"><span>${esc(h.name)}</span><small>${esc(h.kind)}</small></a></li>`).join("")
      : `<li class="empty">No match. Try a trial name like FLAURA, or a gene like EGFR.</li>`;
  }
  document.getElementById("open-search").addEventListener("click", openSearch);
  input.addEventListener("input", () => runSearch(input.value));
  overlay.addEventListener("click", (e) => { if (e.target === overlay || e.target.closest("a")) closeSearch(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
    if (e.key === "/" && overlay.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });
  app.addEventListener("click", (e) => { if (e.target.closest("[data-action='search']")) openSearch(); });

  /* =================================================================
     ROUTER — decides which page to draw from the "#..." in the address
     ================================================================= */
  function route() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (!hash) renderHome();
    else if (DISEASES[hash]) renderDisease(hash);
    else if (hash.startsWith("t-")) renderTrial(hash.slice(2));
    else if (hash === "biomarkers") renderBiomarkers();
    else if (hash.startsWith("b-")) renderBiomarker(hash.slice(2));
    else if (hash === "timeline") renderTimeline();
    else if (hash === "flashcards") renderFlashcards();
    else if (hash === "saved") renderSaved();
    else renderNotFound();

    // Highlight the current section in the top bar
    const section = hash.startsWith("t-") ? DATA.trials.find((t) => t.slug === hash.slice(2))?.disease : hash.startsWith("b-") ? "biomarkers" : hash;
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === section));
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
