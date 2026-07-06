# CONTENT_COPY_AUDIT.md

Product copy and case study content audit — Opsqora (Phase 1 frontend prototype).
Date: 2026-07-06. Scope: user-facing product UI copy, case study landing page, public repo texts (README.md, CASE_STUDY.md, HTML metadata). Benchmarks: GOV.UK/GDS content design, Microsoft Writing Style Guide (UI), AI PM portfolio rubric, PM portfolio standard.

This audit does not repeat the prior UX/UI audit or the layout/composition audit. It covers wording only. No code or copy was changed.

---

## 1. Executive Summary

**Overall assessment: the copy is unusually disciplined for a portfolio prototype.** There are **no P0 findings**. Honesty labeling ("Mocked / Illustrative", "not production outcomes", "no real AI calls") is consistent and rare in portfolio work — it is the strongest single hiring signal on the page and must be preserved.

**Main product copy problems**

- Portfolio voice leaks into product UI on the Eval screen ("How I'd evaluate this in production") — the one place where the two audiences blend (PC-01).
- Several small clarity defects: mixed pattern/snippet counts without units in the feed toolbar, a truncated status label ("Needs"), a status-chip mapping that mislabels neutral cost rows as "Watchlist", and a "Below rule" flag that doesn't name the rule.
- Minor label inconsistency: "Generate brief" vs "Generate product brief" for the same action.

**Main case study problems**

- **Candidate ownership is the weakest signal.** The only contribution statement on the page is `Role: AI PM framing + frontend` — five words a recruiter cannot parse. The page never says "I did X"; the public `CASE_STUDY.md` still contains the unresolved placeholder `[PM to confirm exact ownership]`. Whether AI coding agents built parts of the frontend is not disclosed anywhere reader-facing, although the repo (AGENTS.md, CLAUDE.md) makes agent collaboration part of the workflow (CS-02, CS-03, CS-05).
- The Results section heading — "A narrower demo with sharper AI PM judgment" — is self-evaluative, references an unexplained earlier pivot, and does not describe the section's content (CS-01).
- At skim level the Results table reads as achieved outcomes; the "estimated from the mocked prototype" qualifier lives only in a small table caption (CS-04).
- A handful of insider terms ("flagship validation path", "review-cadence adoption", "assistive, mocked, and visibly bounded") slow down a first-time reader.

**Cross-surface inconsistencies** are minor: three different qualifiers for the same threshold concept (launch / production / action), "Out" vs "Does not belong" in the playground, "Eval" vs "AI Eval" vs "AI eval".

**Overall levels**

| Dimension | Level |
|---|---|
| Clarity | High |
| Professionalism | High (two self-praise lapses: "sharper AI PM judgment", "transparent" as adjective in UI) |
| Scanability | Moderate–high (case study headings mostly carry meaning; Results and ownership are the gaps) |
| AI/buzzword inflation risk | Low — no "seamless/robust/leverage/AI-powered" anywhere; capability claims match implementation |

---

## 2. Content Inventory

### Surface: Product UI (`/`, audience A — reviewer / PM validating patterns)

| Category | Items | Source |
|---|---|---|
| Navigation | "Patterns", "Review", "Brief", contextual "Eval"; "Skip to content" | `src/App.tsx:19-23,120` |
| Topbar / footer | "Synthetic data"; "Frontend-only prototype — synthetic data, no real AI calls"; "Read the case study" / "Open the full app" | `src/App.tsx:134,176-179` |
| Toasts | "Readiness rule is not met yet" (warning); "Product brief generated from validated evidence" (success) | `src/App.tsx:111,116` |
| Patterns screen | Kicker "Support feedback validation"; lede "Pick a recurring complaint and validate the evidence behind it."; toolbar counts; search placeholder; empty state; table headers Pattern/Area/Mentions/Confidence/Trend/Status; chips "Ready"/"Needs validation"; trend "Up/Flat/Down"; meter flag "Below rule" | `src/screens/PatternFeed.tsx` |
| Review screen | Kicker "Evidence validation"; pattern switcher statuses "Ready"/"Needs"; mobile readiness bar; "Why suggested"; evidence block head "Evidence — Decide whether each quote belongs to the pattern."; chips "Demo confirmed"/"Confirmed"/"AI suggested"; decisions Belongs / Does not belong / Different problem / Unsure; rail "Readiness — Visible gate before a brief can be opened."; "Verdict — Reviewer-owned, not model-owned."; verdicts Valid / Too broad / Mixed issues / Not actionable / Not a product issue; buttons "Generate product brief"/"Open product brief"; note "Blocked until the transparent readiness rule passes." | `src/screens/PatternReview.tsx` |
| Brief screen | Kicker "Backlog candidate"; lede "A concise PM-owned backlog candidate…"; blocked state "Brief generation waits for the readiness rule."; brief doc labels (Evidence summary, Suggested next step, Risk to watch, Owner); rail "Status — Computed from review decisions."; buttons "Review evidence", "Generate brief", "Back to review" | `src/screens/ProductBriefScreen.tsx` |
| Eval screen | Kicker "Model quality and cost"; title "AI Eval"; lede "Two questions for the prototype…"; stat band; note "Mocked and illustrative values only…"; metric table headers incl. "Plain-language definition"; status chips Healthy/Watchlist/Needs review/Context; chart legends; "How I'd evaluate this in production"; eval-foot "Production model choice would split tasks…" | `src/screens/EvalDashboard.tsx` |
| Seed/demo content visible in UI | 4 patterns: names, summaries, AI summaries, "why suggested" bullets, 16 evidence quotes with "AI reason" lines, brief bodies, outcome labels ("Mocked outcome — no live integration"), metric definitions and statuses, eval rules, `MODEL_BOUNDARY` | `src/mock/index.ts` |
| Metadata | Title "Opsqora \| Support Feedback Pattern Validation"; meta description | `index.html:6,11` |

### Surface: Case study (`/case-study.html`, audience B — recruiter / hiring manager / product leader / AI PM)

| Category | Items | Source |
|---|---|---|
| Metadata | Title "Opsqora Case Study"; meta description | `case-study.html:6,11` |
| Header nav | Product / Problem / Loop / Eval / Results; "Open live demo" | `src/case-study.tsx:180-186` |
| Hero | Kicker "AI product management — case study · 2026"; H1; lede; buttons; meta list (Role / Type / Stack / Data / Year) | `src/case-study.tsx:190-205` |
| Demo frames | "Live · synthetic data" chip; captions under both embeds | `src/case-study.tsx:61-81,207-215,276-282` |
| Sections | 01 Problem, 02 How it works (loop steps + playground), 03 Human-in-the-loop boundary (blockquote), 04 AI eval, 05 Scope and honesty (real/mocked lists + stack chips), 06 Results (table + prose), CTA, footer | `src/case-study.tsx:217-345` |
| Scope figures | "4 mocked feedback patterns / 1 flagship validation path / 5 pattern verdicts / 13 quality + cost metrics" | `src/case-study.tsx:232-237` |
| Results table | 7 rows incl. caption "All values are estimated from the mocked prototype — not production outcomes." | `src/case-study.tsx:49-57,306-315` |

### Surface: Public repo texts

| Category | Items | Source |
|---|---|---|
| README | Positioning paragraph, honesty blockquote, "What This Prototype Demonstrates", scope, run instructions, key screens, dataset/mock-provider explanations, future plan | `README.md` |
| Case study source doc | Problem / Why AI / Your Role (with placeholder) / Approach / What You Built / Results / Learned | `CASE_STUDY.md` |

---

## 3. Product Copy Findings

**P0 — none.**

### P1

### [PC-01] Portfolio voice inside product UI: "How I'd evaluate this in production"

Priority: P1
Confidence: High
Surface: Product
Location: `src/screens/EvalDashboard.tsx:141`
Exact text: "How I'd evaluate this in production"

Problem: First-person candidate voice ("I") inside the product interface. Every other product screen speaks in product voice; here the author speaks to a hiring manager through the UI. The lede one screen up ("Two questions for the prototype…") has the same drift.

Why it matters: It breaks the product fiction for audience A and blurs the deliberately clean separation between product and portfolio surfaces — the same separation the case study's "Scope and honesty" section takes credit for. The README documents the Eval screen as "a lighter AI eval surface for the case study", so this is a known design choice, not an accident — but the choice can be kept while fixing the voice.

Audience affected: Product user (fiction break); case study reader (minor — inconsistent framing discipline).

Benchmark: Microsoft (task-focused UI voice); PM portfolio standard (surface separation).

Recommended action: Rename.

Suggested replacement: Heading — "Production evaluation plan". Keep the sub-line "Thresholds paired with product actions, not passive dashboard watching." unchanged.

Why replacement is stronger: Same content, product voice; the candidate framing already comes through the case study section that embeds this screen ("Trust and cost are product requirements").

### P2

### [PC-02] Feed toolbar mixes pattern counts and snippet counts without units

Priority: P2
Confidence: High
Surface: Product
Location: `src/screens/PatternFeed.tsx:83`
Exact text: "4 patterns · 1 ready · 7 confirmed · 9 AI-suggested"

Problem: The first two counts are patterns; the last two are evidence snippets. Nothing says the unit changes mid-line, so "7 confirmed" reads as 7 confirmed patterns out of 4.

Why it matters: The summary line contradicts itself at first read (7 > 4). GOV.UK: make the denominator and unit explicit.

Audience affected: Product user.

Benchmark: GOV.UK/GDS.

Recommended action: Clarify.

Suggested replacement: "4 patterns · 1 ready — evidence: 7 confirmed · 9 AI-suggested"

Why replacement is stronger: The unit switch is explicit; counts can no longer be misread against the pattern total.

### [PC-03] Truncated status "Needs" in the pattern switcher

Priority: P2
Confidence: High
Surface: Product
Location: `src/screens/PatternReview.tsx:89`
Exact text: "Needs" (vs "Ready")

Problem: "Needs" is not a state — it is half of "Needs validation", truncated. It reads as a rendering bug.

Why it matters: Status labels must be complete words describing a state (Microsoft). "Needs" alone fails the "understand without documentation" test and looks unpolished in a portfolio demo that hiring managers will click through.

Audience affected: Product user; case study reader (professionalism impression).

Benchmark: Microsoft.

Recommended action: Rename.

Suggested replacement: "Not ready"

Why replacement is stronger: A real state, the natural opposite of "Ready", and nearly as short.

### [PC-04] "Below rule" flag doesn't say which rule

Priority: P2
Confidence: Medium
Surface: Product
Location: `src/screens/PatternFeed.tsx:36`
Exact text: "Below rule"

Problem: The confidence meter flags values under 70%, but "rule" is unnamed; a first-time user doesn't yet know the readiness rule exists.

Why it matters: The flag's purpose is to explain why a pattern isn't ready. Naming the threshold makes it self-explanatory.

Audience affected: Product user.

Benchmark: Microsoft; GOV.UK/GDS.

Recommended action: Clarify.

Suggested replacement: "Below 70% rule"

Why replacement is stronger: States the threshold in place; consistent with "70%+ confidence" in the Review rail.

### [PC-05] Status chips mislabel neutral cost rows as "Watchlist"

Priority: P2
Confidence: High
Surface: Product
Location: `src/screens/EvalDashboard.tsx:52-65` (mapping) applied to `src/mock/index.ts:436-473`
Exact text: chip "Watchlist" on "Daily spend — Estimated from mocked volume"; chip "Healthy" on "Cost per validated pattern — Key value-linked metric"

Problem: The chip label is derived from substring matching on the status text: any status containing "estimated" becomes "Watchlist" (implying concern where there is none), and "key value" becomes "Healthy" (a health verdict derived from importance, not from the value). The words shown to the user don't mean what the underlying data says.

Why it matters: On the one screen dedicated to metric honesty, a "Watchlist" chip on a neutral row quietly misstates metric status. Cheap to fix, and exactly the kind of detail an AI PM reviewer checks.

Audience affected: Product user; case study reader (the screen is embedded in the case study).

Benchmark: Microsoft; AI PM portfolio rubric (metric honesty).

Recommended action: Clarify (label mapping, and/or explicit per-metric tone in mock data).

Suggested replacement: Neutral chip "Estimate" (line tone) for estimated cost rows; "Healthy" for cost-per-validated-pattern only if justified by being under the $12 threshold — and then the status text should say so ("Under $12 action threshold").

Why replacement is stronger: Chip words match the actual state of each metric; no implied concern or implied verdict.

### [PC-06] "Transparent" as self-descriptive adjective in a blocked-state note

Priority: P2
Confidence: High
Surface: Product
Location: `src/screens/PatternReview.tsx:200`
Exact text: "Blocked until the transparent readiness rule passes."

Problem: "Transparent" is the author praising the design, not information for the user. The rule's transparency is demonstrated by the three visible checks directly above.

Why it matters: Product copy should describe state and next action; adjectives of self-assessment belong (if anywhere) in the case study.

Audience affected: Product user.

Benchmark: Microsoft; GOV.UK/GDS (remove words that don't serve the user).

Recommended action: Shorten.

Suggested replacement: "Blocked until the readiness rule passes."

Why replacement is stronger: Same information, no self-praise; the visible checks already prove the transparency.

### [PC-07] Same action labeled "Generate brief" and "Generate product brief"

Priority: P2
Confidence: High
Surface: Product
Location: `src/screens/PatternReview.tsx:100` ("Generate brief"/"Open brief" mobile) vs `:198` ("Generate product brief"/"Open product brief" rail); `src/screens/ProductBriefScreen.tsx:69` ("Generate brief")
Exact text: as above

Problem: One action, three labels across surfaces.

Why it matters: Users should be able to recognize the same action by the same words (Microsoft). Minor, but it's the primary CTA of the workflow.

Audience affected: Product user.

Benchmark: Microsoft.

Recommended action: Merge.

Suggested replacement: "Generate brief" / "Open brief" everywhere (the screen context already says "product brief").

Why replacement is stronger: One recognizable label; the shorter form also fits the mobile bar.

### [PC-08] Eval lede: "what does validated product signal cost?"

Priority: P2
Confidence: Medium
Surface: Product (cross-surface echo)
Location: `src/screens/EvalDashboard.tsx:106`
Exact text: "Two questions for the prototype: can we trust the model, and what does validated product signal cost?"

Problem: "Validated product signal" is an abstraction stack. The case study's own phrasing of the same question is better: "what does one validated pattern cost?" (`src/case-study.tsx:266-267`).

Why it matters: The concrete unit ("one validated pattern") matches the key metric on the same screen; the abstract phrase does not.

Audience affected: Product user; case study reader.

Benchmark: GOV.UK/GDS (concrete over abstract).

Recommended action: Rewrite.

Suggested replacement: "Two questions: can we trust the model, and what does one validated pattern cost?"

Why replacement is stronger: Concrete unit, aligns with "Cost per validated pattern" directly below, drops the audience-mixing "for the prototype".

### [PC-09] "Demo confirmed" chip meaning is unclear

Priority: P2
Confidence: Medium
Surface: Product
Location: `src/screens/PatternReview.tsx:140`
Exact text: "Demo confirmed" (PAT-001 evidence only) vs "Confirmed" elsewhere

Problem: "Demo confirmed" tries to say "pre-confirmed so the demo starts in a ready state", but reads as a distinct, unexplained confirmation type.

Why it matters: Honest labeling is the right instinct; the label just doesn't parse. A tooltip-free chip must be self-explanatory.

Audience affected: Product user.

Benchmark: Microsoft.

Recommended action: Rename.

Suggested replacement: "Pre-confirmed (demo)"

Why replacement is stronger: Says what happened (confirmed before you arrived) and why (demo), in chip length.

### [PC-10] Brief lede opens with self-praise ("A concise…")

Priority: P2
Confidence: Medium
Surface: Product
Location: `src/screens/ProductBriefScreen.tsx:39`
Exact text: "A concise PM-owned backlog candidate generated from validated evidence."

Problem: "Concise" is a quality judgment about the product's own output. "PM-owned backlog candidate" is dense but defensible for the PM audience.

Why it matters: Small credibility leak; let the brief be concise rather than say it is.

Audience affected: Product user.

Benchmark: GOV.UK/GDS; Microsoft.

Recommended action: Shorten.

Suggested replacement: "A PM-owned backlog candidate generated from validated evidence."

Why replacement is stronger: Same meaning minus the self-assessment.

### [PC-11] "Frontier model" unexplained in eval footnote

Priority: P2
Confidence: Medium
Surface: Product
Location: `src/screens/EvalDashboard.tsx:153-154`; also `src/mock/index.ts:506`
Exact text: "a frontier model for clustering and final synthesis, a cheaper model for low-stakes labels and formatting"

Problem: "Frontier model" is AI-industry insider shorthand. The sentence's logic (expensive model for hard tasks, cheap model for easy ones) is excellent — the term is the only barrier.

Why it matters: The eval screen explicitly promises "plain-language definitions for non-technical review"; this footnote doesn't hold itself to that bar.

Audience affected: Product user (supervisor/ops); non-ML case study reader.

Benchmark: GOV.UK/GDS (precise term + short contextual explanation); AI PM rubric (model selection reasoning — keep the substance).

Recommended action: Explain.

Suggested replacement: "Production model choice would split tasks: a top-tier ('frontier') model for clustering and final synthesis, a cheaper model for low-stakes labels and formatting."

Why replacement is stronger: Keeps the professional term and the reasoning, adds a three-word gloss.

### [PC-12] F1 stat note "Precision + recall" is imprecise

Priority: P2
Confidence: Medium
Surface: Product
Location: `src/screens/EvalDashboard.tsx:112`
Exact text: Stat "Pattern F1 — 69% — Precision + recall"

Problem: F1 is not a sum. The metric table below defines it correctly ("harmonic mean"); the stat note contradicts the table's precision.

Why it matters: Small, but the eval screen is the surface where a technical reviewer probes for exactly this kind of looseness.

Audience affected: Case study reader (technical stakeholders); product user.

Benchmark: AI PM portfolio rubric (technical accuracy).

Recommended action: Clarify.

Suggested replacement: "Balance of precision + recall"

Why replacement is stronger: Plain-language and no longer arithmetically wrong.

---

## 4. Case Study Findings

**P0 — none.** The candidate for P0 was the Results table (fictional metrics under a "Results" heading), but the caption, the meta description, the scope section, and the footer all label the values as mocked/estimated — so the misreading risk is a scan-level frontloading problem (P1, CS-04), not material misrepresentation.

### P1

### [CS-01] Results heading is self-evaluative and doesn't describe the section

Priority: P1
Confidence: High
Surface: Case study
Location: `src/case-study.tsx:305`
Exact text: "A narrower demo with sharper AI PM judgment."

Problem: Three defects at once: (1) it grades the author's own judgment ("sharper AI PM judgment") — the one line on the page a hiring manager will read as self-congratulation; (2) "narrower" compares against an earlier, broader version of the project that the page never mentions, so the comparison is meaningless to a first-time reader; (3) it fails the GOV.UK heading test — a reader scanning headings learns nothing about what the Results section contains.

Why it matters: This is the heading over the most scrutinized section of any case study. Judgment must be demonstrated by the content (which it is — thresholds, actions, honest caveats), never claimed by the heading.

Audience affected: Case study reader.

Benchmark: GOV.UK/GDS (descriptive headings); PM portfolio standard (show, don't self-assess).

Recommended action: Rewrite.

Suggested replacement: "Estimated results from a mocked prototype — and what would come next."

Why replacement is stronger: Describes the actual content (an estimates table + next steps), frontloads the honesty qualifier at scan level (also resolving half of CS-04), and removes the self-grade.

### [CS-02] Role meta "AI PM framing + frontend" is too cryptic to carry candidate ownership

Priority: P1
Confidence: High
Surface: Case study
Location: `src/case-study.tsx:21`
Exact text: "Role — AI PM framing + frontend"

Problem: This five-word fragment is the only statement of the candidate's contribution on the entire page. "Framing" is PM-insider shorthand; "+ frontend" is ambiguous (designed it? built it?). A recruiter scanning the meta block cannot reconstruct what the candidate actually did.

Why it matters: Candidate ownership is the case study's core job. The repo's own `CASE_STUDY.md` contains a much stronger sentence ("I framed the problem, scoped the pattern-validation workflow, designed the AI assistive boundary, shaped the eval strategy and cost model, and built the Phase 1 frontend prototype") that never reaches the page.

Audience affected: Case study reader (recruiters especially).

Benchmark: PM portfolio standard (ownership clarity); GOV.UK/GDS (no unexplained shorthand).

Recommended action: Rewrite (meta value), and see CS-03 for the fuller statement.

Suggested replacement: "Role — Product framing, AI boundary + eval design, frontend build"

Why replacement is stronger: Each noun names a verifiable artifact on the page (problem section; boundary blockquote + eval screen; the live embedded app). Still meta-block short.

Evidence status: PARTIALLY SUPPORTED — the fuller role claim exists in `CASE_STUDY.md` but carries an unresolved placeholder (see CS-05); confirm ownership before strengthening the wording.

### [CS-03] No explicit "what I did" statement on the page; AI-agent collaboration undisclosed

Priority: P1
Confidence: High
Surface: Case study
Location: whole page (`src/case-study.tsx`); contrast `CASE_STUDY.md:13`
Exact text: (absence)

Problem: The page never uses a first-person contribution sentence. Combined with a repo that visibly encodes AI coding-agent collaboration (CLAUDE.md, AGENTS.md, docs/agent-workflow.md — public on GitHub, one click from the "View repository" button), a diligent hiring manager is left to guess the split between candidate work and agent-generated work. For an *AI PM* candidate, disclosed and well-managed agent collaboration is arguably a positive signal; undisclosed, it reads as ambiguity.

Why it matters: This is the highest-leverage credibility item on the page. The audit brief's ownership questions ("what was designed / decided / implemented / generated") currently have no reader-facing answers.

Audience affected: Case study reader.

Benchmark: PM portfolio standard; AI PM portfolio rubric (technical collaboration).

Recommended action: Rewrite (add a 2–3 sentence "My role" note near the hero meta or in the Problem section).

Suggested replacement (using only claims already in the repo — confirm before publishing): "I framed the problem, scoped the validation workflow, designed the AI-assistive boundary and eval strategy, and built the Phase 1 frontend. AI coding agents (Claude Code, Codex) worked under a documented collaboration workflow in the repo; all product decisions, scope boundaries, and the readiness rule are mine."

Why replacement is stronger: Answers designed/decided/built/generated explicitly; turns the visible agent workflow from an ambiguity into evidence of AI-native working practice.

Evidence status: AMBIGUOUS — the decision-ownership split is asserted in repo docs but flagged "[PM to confirm exact ownership]"; do not publish until confirmed. If confirmation isn't possible, state the ambiguity narrower ("built with AI coding agents under a documented workflow") rather than claiming sole ownership.

### [CS-04] "Mocked/estimated" qualifier for Results is invisible at scan level

Priority: P1
Confidence: High
Surface: Case study
Location: `src/case-study.tsx:305-315` (kicker "Results", heading, table caption)
Exact text: kicker "Results"; caption "All values are estimated from the mocked prototype — not production outcomes."

Problem: A 30-second scanner reads: "Results … Pattern precision 76% … Pattern recall 64% … Cost per validated pattern $8.90". The corrective caption is one small line above the table body and is the only qualifier at this level; the kicker and heading carry none. The row details do say "Target ≥ 70%" and "mocked timeline", but numbers dominate a scan.

Why it matters: This is the project's core integrity promise ("metric honesty") applied inconsistently to reading depth: fully honest at 2-minute depth, ambiguous at 30-second depth. A skimming hiring manager may either (a) credit fictional results, or (b) notice later that they're fictional and discount the honesty elsewhere. Both outcomes are bad; (b) is worse.

Audience affected: Case study reader.

Benchmark: GOV.UK/GDS (frontload); AI PM portfolio rubric (never let synthetic evaluation read as production evidence).

Recommended action: Frontload.

Suggested replacement: Kicker "Results (mocked)" or heading per CS-01 ("Estimated results from a mocked prototype — and what would come next."); keep the caption as is.

Why replacement is stronger: The qualifier now exists at every reading depth; no other change needed.

Evidence status: All seven table values PARTIALLY SUPPORTED (deliberate illustrative estimates, labeled at close-read level); see §10.

### [CS-05] Published placeholder "[PM to confirm exact ownership]" in CASE_STUDY.md

Priority: P1
Confidence: High
Surface: Case study (public repo file)
Location: `CASE_STUDY.md:13`
Exact text: "…and built the Phase 1 frontend prototype. [PM to confirm exact ownership]"

Problem: An unresolved editorial placeholder in a public file titled "Opsqora Case Study", inside the section "Your Role" — the exact section a hiring manager checks. It simultaneously undermines the role claim it follows and signals an unfinished artifact.

Why it matters: The repo is one click from the case study page ("View repository"). Reviewers who open it will see the strongest ownership sentence in the project immediately neutralized by its own placeholder.

Audience affected: Case study reader.

Benchmark: PM portfolio standard (professionalism, ownership).

Recommended action: Remove (resolve the confirmation, then delete the bracket; if unconfirmable, weaken the sentence to what is certain).

Suggested replacement: Delete "[PM to confirm exact ownership]" once the role sentence is confirmed accurate.

Why replacement is stronger: The role claim stands or is honestly narrowed; either is better than a visible TODO.

Evidence status: AMBIGUOUS until the author confirms.

### P2

### [CS-06] Hero lede's closing triple "assistive, mocked, and visibly bounded"

Priority: P2
Confidence: Medium
Surface: Case study
Location: `src/case-study.tsx:193-197`
Exact text: "— while keeping AI assistive, mocked, and visibly bounded."

Problem: Three adjectives from three different categories (design stance / implementation status / governance) compressed into one rhythm-driven list. "Mocked" in a hero lede is honest but jarring without context — a recruiter's first parse may be "the AI is being mocked?". "Visibly bounded" is abstract.

Why it matters: This is sentence two of the page; every word is at maximum scan exposure.

Audience affected: Case study reader.

Benchmark: GOV.UK/GDS (plain language, one idea per clause).

Recommended action: Rewrite.

Suggested replacement: "— with AI kept assistive: it suggests, humans decide. Phase 1 is a frontend prototype on synthetic data."

Why replacement is stronger: Unpacks the three compressed claims into their actual meanings, states the human-in-the-loop principle in six words, and moves the honesty disclosure into a clear factual sentence.

### [CS-07] Nav label "Loop" is cryptic out of context

Priority: P2
Confidence: Medium
Surface: Case study
Location: `src/case-study.tsx:182`
Exact text: "Loop"

Problem: Fails the GOV.UK "heading understandable out of context" test; "the loop" is the project's internal name for its workflow. "Eval" in the same nav is borderline but defensible for the AI PM audience.

Why it matters: Nav labels are read before the sections that would explain them.

Audience affected: Case study reader (non-AI recruiters especially).

Benchmark: GOV.UK/GDS.

Recommended action: Rename.

Suggested replacement: "How it works" (matches the section's own kicker).

Why replacement is stronger: Predicts the destination; already the section's kicker, so no new terminology.

### [CS-08] "Flagship" as internal jargon (three occurrences)

Priority: P2
Confidence: Medium
Surface: Case study
Location: `src/case-study.tsx:234` ("1 flagship validation path"), `:56` ("Flagship mocked outcome"), `CASE_STUDY.md:49`
Exact text: as above

Problem: "Flagship" is the team's internal name for the fully-built demo path (PAT-001). To a reader it's a marketing word attached to a mock, and "1 flagship validation path" as a highlighted scope figure is close to meaningless without that context.

Why it matters: Scope figures and result rows are peak-scan real estate.

Audience affected: Case study reader.

Benchmark: GOV.UK/GDS (user's words, not team's words).

Recommended action: Rename.

Suggested replacement: "1 fully validated demo path" (scope figure); "Example mocked outcome" (results row).

Why replacement is stronger: Says what "flagship" actually meant — one path is built end-to-end — without the internal codeword.

### [CS-09] "Validating review-cadence adoption" — jargon-dense next step

Priority: P2
Confidence: High
Surface: Case study
Location: `src/case-study.tsx:320-322`; echoed in `CASE_STUDY.md:53`
Exact text: "Next steps would be validating review-cadence adoption, collecting real eval data from privacy-safe feedback exports, and testing outcome tracking through read-only integrations before any write-back workflow."

Problem: Four compound-noun phrases in one sentence; "review-cadence adoption" in particular has no referent anywhere on the page (the cadence concept appears only as a field in mock data). The reader is asked to decode a roadmap in noun clusters.

Why it matters: Next steps are how a case study shows the author knows what they *haven't* proven — worth making effortless to read.

Audience affected: Case study reader.

Benchmark: GOV.UK/GDS (plain language); PM portfolio standard (validation status).

Recommended action: Rewrite.

Suggested replacement: "Next steps: test whether teams actually adopt a regular pattern-review ritual, collect real evaluation data from privacy-safe support exports, and track outcomes through read-only integrations before letting the product write anything back."

Why replacement is stronger: Each step is a verb phrase a non-specialist can act on; same substance, no invented facts.

### [CS-10] Three different qualifiers for the same threshold concept

Priority: P2
Confidence: Medium
Surface: Cross-surface
Location: chart legend "70% launch threshold" (`src/screens/EvalDashboard.tsx:36`); metric status "Above 70% launch threshold" (`src/mock/index.ts:381`); case study "production threshold" (`src/case-study.tsx:271`); results row "$12 action threshold" (`src/case-study.tsx:54`); section "How I'd evaluate this in production… thresholds paired with product actions"

Problem: launch / production / action are used interchangeably for the same rule set. Each word implies a different lifecycle stage.

Why it matters: Threshold discipline is one of the project's flagged competencies; inconsistent naming makes the reader wonder whether these are one rule set or three.

Audience affected: Case study reader; product user.

Benchmark: Cross-surface consistency; AI PM rubric.

Recommended action: Merge.

Suggested replacement: Standardize on "launch threshold" for the quality gates (70%/80%/60%) and "action threshold" for cost ($12), and use those two terms on both surfaces.

Why replacement is stronger: Two distinct concepts get two stable names instead of three floating ones.

### [CS-11] Playground shortens "Does not belong" to "Out"

Priority: P2
Confidence: Medium
Surface: Cross-surface
Location: `src/case-study.tsx:132`
Exact text: evidence toggle shows "Belongs" / "Out"

Problem: The product's four evidence decisions are a deliberate, named vocabulary; the case study widget that claims "this is the real logic" renders one of them as "Out", a term that exists nowhere in the product.

Why it matters: The playground's whole argument is fidelity to the product ("calls the same getReadiness() function"). Vocabulary drift undercuts it slightly.

Audience affected: Case study reader.

Benchmark: Cross-surface consistency.

Recommended action: Rename.

Suggested replacement: "Not belongs" is worse English; prefer "Belongs" / "Does not belong" if space allows, else "Belongs" / "Excluded".

Why replacement is stronger: "Excluded" is a real state word and visibly maps to the product's "Does not belong".

### [CS-12] Meta description ends in a jargon noun pile

Priority: P2
Confidence: Low
Surface: Case study
Location: `case-study.html:6`
Exact text: "…support feedback pattern validation, evidence review, product briefs, and AI eval discipline — with the live product embedded."

Problem: "AI eval discipline" is insider phrasing in the one string recruiters may see in a link preview before deciding to click.

Why it matters: Marginal, but the meta description is the true 2-second test.

Audience affected: Case study reader.

Benchmark: GOV.UK/GDS.

Recommended action: Clarify.

Suggested replacement: "…evidence review, product briefs, and AI quality/cost evaluation — with the live product embedded in the page."

Why replacement is stronger: Same claim, decoded.

### [CS-13] Scope figure "13 quality + cost metrics" highlights volume, not meaning

Priority: P2
Confidence: Low
Surface: Case study
Location: `src/case-study.tsx:236`
Exact text: "13 — quality + cost metrics"

Problem: Metric count is the least meaningful of the four scope figures; more metrics is not better, and the project's own philosophy says so ("Dashboards without actions are decoration").

Why it matters: Minor tension with the page's stated values; the figure spends prime real estate on volume.

Audience affected: Case study reader.

Benchmark: PM portfolio standard (evidence density).

Recommended action: Rename (reframe the same fact).

Suggested replacement: "4 — eval thresholds paired with actions" (verifiable: `evalRules` has exactly 4).

Why replacement is stronger: Points at the differentiating artifact (threshold→action pairs) instead of raw metric count.

### [CS-14] "Review time per pattern 6–9 min" has no stated basis

Priority: P2
Confidence: Medium
Surface: Case study
Location: `src/case-study.tsx:55`
Exact text: "Review time per pattern — 6–9 min — Estimated human effort to validate evidence and set a verdict"

Problem: Every other results row traces to a visible artifact (metric tables, outcome cards). This one is a bare estimate with no visible basis — nothing in the prototype measures or models review time.

Why it matters: One unanchored number in an otherwise disciplined table invites the question "where did this come from?" — the wrong question to trigger during a credibility scan.

Audience affected: Case study reader.

Benchmark: AI PM rubric (evaluation language: what is measured, by what, on what data).

Recommended action: Clarify or Remove.

Suggested replacement: If kept: "Review time per pattern — 6–9 min — Rough estimate from walking the demo review flow; not measured." If that basis is untrue, remove the row.

Why replacement is stronger: States the (thin) basis honestly or removes the only unanchored claim in the table.

Evidence status: AMBIGUOUS.

### [CS-15] "High-confidence disagreement" unexplained at first mention in prose

Priority: P2
Confidence: Low
Surface: Case study
Location: `src/case-study.tsx:266-268`
Exact text: "Precision, recall, F1, evidence precision, and high-confidence disagreement measure trust"

Problem: Four of the five terms are common; "high-confidence disagreement" is a project-specific metric whose definition lives only inside the embedded dashboard's table. In prose it reads as filler-jargon even though it's actually the most original metric in the project.

Why it matters: This metric is a differentiator (it operationalizes calibration checking); a five-word gloss converts it from noise to signal.

Audience affected: Case study reader.

Benchmark: GOV.UK/GDS (precise term + short contextual explanation); AI PM rubric (model behavior awareness — the substance is there, surface it).

Recommended action: Explain.

Suggested replacement: "…and high-confidence disagreement (reviewers rejecting evidence the model was sure about) measure trust;"

Why replacement is stronger: The parenthetical makes the calibration insight legible to a non-ML reader in one clause.

---

## 5. 10-Second Case Study Test

Basis: kicker + H1 + lede + hero meta + first demo frame (audit heuristic, not a literal reading model).

| Question | Verdict | Basis |
|---|---|---|
| What is this? | **CLEAR** | Kicker "AI product management — case study"; lede names the product and its job. |
| Who is it for? | **CLEAR** | "helps a small product team" — in the lede's first clause. |
| What problem does it solve? | **CLEAR** (borderline) | H1: recurring support feedback → defensible product decisions. The pain (can't trust the signal) needs the Problem section, but the value is stated. |
| What did the candidate actually do? | **PARTIAL → UNCLEAR** | Only "Role: AI PM framing + frontend" — cryptic (CS-02, CS-03). This is the failing answer of the five. |
| Why might this be relevant to an AI PM role? | **PARTIAL** | The kicker asserts the category; the substantive relevance (HITL boundary, eval, cost) is below the fold. Acceptable, since the assertion is at least explicit. |

---

## 6. 30-Second Scan Test

Basis: hero + section headings + kickers + scope figures + demo captions + results values.

| Signal | Scan-level verdict | Notes |
|---|---|---|
| Problem | **Clear** | Heading "Recurring complaints need proof before they become roadmap work." is a model GDS heading. |
| Product | **Clear** | Live embed with caption "This is the actual product embedded in the page, not a screenshot." — exceptional at scan level. |
| AI role | **Clear** | Loop step names + boundary blockquote is scannable and prominent. |
| Human role | **Clear** | Kicker "Human-in-the-loop boundary" + blockquote. |
| Candidate role | **Weak** | Meta line only; no scannable "my role" element (CS-02/03). |
| Evaluation approach | **Clear** | Heading "Trust and cost are product requirements." + eval demo caption. |
| Main trade-off | **Partial** | Assistive-vs-autonomous is scannable; other trade-offs (model-tier split, narrow scope vs breadth) only live inside prose/footnotes. |
| Current project status | **Clear** | "Phase 1 frontend prototype" meta, "Scope and honesty" heading, mocked labels, footer. |
| Results integrity | **At risk** | Numbers scan as outcomes; qualifier is caption-only (CS-04). |

---

## 7. Hiring Signal Assessment

| Capability | Rating | Evidence |
|---|---|---|
| Problem framing | **STRONG** | Concrete three-phrasings example; "why keyword rules miss it"; problem stated before solution. |
| Product judgment | **STRONG** | Narrow scope defended; "Dashboards without actions are decoration"; readiness gate as the central product mechanic. |
| AI appropriateness | **STRONG** | Explicit "why AI / why not rules / why only assistive"; deterministic logic vs model boundary stated. |
| Evaluation thinking | **STRONG** (design-level) | Precision/recall/F1 + calibration-style disagreement metric + threshold→action rules. Note: thinking is evidenced; *execution* of evaluation is not (all values mocked) — the page mostly says so. |
| Trade-offs | **MODERATE** | Real ones exist (assistive vs autonomous; frontier vs cheaper model tier; cost-per-validated-pattern vs raw spend) but few are framed as "chose X over Y because Z". |
| Human-in-the-loop | **STRONG** | The boundary is a named, quoted, and mechanically enforced artifact, not a paragraph. |
| Technical understanding | **MODERATE** | Stack, deterministic mock layer, `getReadiness()` reference, model-tier split. No deeper system design shown (consistent with Phase 1 scope). |
| Shipping ability | **MODERATE–STRONG** | A deployed, interactive, embedded prototype is strong for a prototype; no production shipping evidence (none claimed). |
| Evidence discipline | **STRONG** | Real/mocked split section; per-value labels; "no real AI calls" in the product footer itself. Weakened only by CS-04 (scan-level) and CS-14 (one unanchored number). |
| Candidate ownership | **NOT EVIDENCED (on page)** | Exists only as a cryptic meta line; the fuller claim sits in a repo file with an unresolved placeholder. |

---

## 8. Jargon and Buzzword Report

**Unsupported buzzwords:** effectively none. The classic list (leverage, seamless, robust, scalable, innovative, cutting-edge, AI-powered, data-driven, end-to-end, production-ready…) does not appear on any surface. This is a genuine differentiator — protect it.

**Self-praise adjectives (buzzword-adjacent, remove/replace):**
- "sharper AI PM judgment" — Results heading (CS-01)
- "transparent readiness rule" as UI adjective (PC-06; fine as a case-study *claim* because the rule is literally shown)
- "concise" in the Brief lede (PC-10)
- "Honest positioning" as a README feature bullet — borderline; the honesty is real, but naming it as a feature grades itself. Low priority.

**Justified professional terminology (keep):**
- precision / recall / F1 — defined in plain language in the metric table; correct usage
- human-in-the-loop — the project's core concept; used precisely
- confidence / confidence threshold — always shown with the numeric rule
- eval (as "AI eval") — acceptable for the AI PM audience; the term is the industry's own
- synthetic / deterministic / mocked — load-bearing honesty vocabulary
- backlog candidate, product brief — PM audience terms, used consistently

**Unnecessary jargon (replace):**
- "flagship" (CS-08)
- "review-cadence adoption" (CS-09)
- "validated product signal" (PC-08)
- "AI eval discipline" in meta description (CS-12)
- "Loop" as a nav label (CS-07)
- "visibly bounded" (CS-06)

**Terms requiring a first-use gloss (keep + explain):**
- "frontier model" (PC-11)
- "high-confidence disagreement" (CS-15)
- "F1" — glossed adequately in the table; fix only the stat note (PC-12)

---

## 9. Candidate Ownership Ambiguities

1. **`Role: AI PM framing + frontend`** (`src/case-study.tsx:21`) — cannot be decoded into designed/decided/built (CS-02).
2. **No first-person contribution statement anywhere on the rendered page** — the reader cannot attribute the problem framing, the boundary design, the eval design, or the frontend build to the candidate specifically (CS-03).
3. **AI coding-agent involvement is visible in the repo (CLAUDE.md, AGENTS.md, docs/agent-workflow.md) but never disclosed to the case study reader** — the built/generated split is unknowable from the page (CS-03).
4. **`[PM to confirm exact ownership]`** (`CASE_STUDY.md:13`) — the strongest ownership sentence in the project is self-flagged as unconfirmed (CS-05).
5. **"How I'd evaluate this in production"** (`src/screens/EvalDashboard.tsx:141`) — the only "I" in the product, with no antecedent: the product UI never establishes who "I" is (related: PC-01).

---

## 10. Claim Integrity Report

| Claim | Location | Status | Note |
|---|---|---|---|
| "This is the actual product embedded in the page, not a screenshot." | case-study.tsx:211 | **VERIFIED** | `<App embedded />` renders the real app. |
| "This widget calls the same getReadiness() function as the product above." | case-study.tsx:167 | **VERIFIED** | Playground imports and calls `getReadiness` from `src/mock`. |
| "Deterministic synthetic dataset, reproducible on every visit" | case-study.tsx:38 | **VERIFIED** | All data is hardcoded in `src/mock/index.ts`; no randomness. |
| "No backend, auth, persistence, or real customer data anywhere" / "no real AI calls" | case-study.tsx:46; App.tsx:176 | **VERIFIED** | No network/AI client code in `src/`. |
| "Hand-rolled SVG charts and a single design system across both pages" | case-study.tsx:39 | **VERIFIED** | Inline SVG in EvalDashboard; both entries share `styles.css`. |
| Stack: React 18 · TypeScript · Vite | case-study.tsx:23,59 | **VERIFIED** | package.json: react ^18.3.1, typescript ^5.7.2, vite ^6.0.5. |
| Scope figures: 4 patterns / 5 verdicts / 13 metrics | case-study.tsx:232-237 | **VERIFIED** | Matches mock data (4 patterns, 5 verdicts, 8+5 metrics). |
| Repository link | case-study.tsx:18 | **VERIFIED** | Matches `git remote origin` (mich-mayer/opsqora). |
| Pattern precision 76%, recall 64%, F1 69%, evidence precision 81% | results table; eval screen | **PARTIALLY SUPPORTED** | Hardcoded illustrative values; labeled "estimated from the mocked prototype" at close-read level; not derived from any evaluation run. Frontload the qualifier (CS-04). |
| Cost figures ($38/day, $0.018, $2.40, $8.90, $1.1k) | eval screen; results table | **PARTIALLY SUPPORTED** | Same: labeled estimates, no cost model shown behind them. |
| "Flagship mocked outcome 42 → 18" | results table; PAT-001 outcome | **PARTIALLY SUPPORTED** | Explicitly labeled "Mocked outcome — no live integration". |
| Review time per pattern 6–9 min | case-study.tsx:55 | **AMBIGUOUS** | Labeled "estimated" but no basis exists or is stated anywhere (CS-14). |
| Role: "AI PM framing + frontend" / CASE_STUDY.md role sentence | case-study.tsx:21; CASE_STUDY.md:13 | **AMBIGUOUS** | Self-reported and self-flagged as unconfirmed (CS-02/03/05). |
| "Every screen is interactive" | case-study.tsx:36 | **VERIFIED** | All four product screens have working interactions. |
| "Mentions increased in enterprise workspaces during the last mocked review window" (and similar in-demo AI rationale) | mock data | **VERIFIED as fiction** | In-universe synthetic content, consistently framed as mocked; no action needed. |

No claim was found that presents a target as an achieved result, or synthetic evaluation as production evidence, at close-read level. The residual risk is scan-level only (CS-04).

---

## 11. Cross-Surface Terminology Map

| Concept | Product term | Case study term | Status | Recommendation |
|---|---|---|---|---|
| Unit of work | pattern / recurring complaint | recurring pattern / recurring complaints | Consistent | Keep. |
| Evidence item | evidence · snippet · quote (contextual) | snippet · evidence | Justified adaptation | Keep current split: "quote" for the text, "snippet" for counts, "evidence" for the concept. |
| Negative evidence decision | "Does not belong" | "Out" (playground toggle) | **Inconsistency** | Align playground to product vocabulary (CS-11). |
| Readiness state | "Ready" / "Needs validation" / "Needs" | "Ready — brief can be generated" / "Blocked — brief stays locked" | Mostly justified; "Needs" is a defect | Fix "Needs" → "Not ready" (PC-03); playground long-forms are fine. |
| Threshold concept | "launch threshold", "Below rule" | "production threshold", "action threshold" | **Inconsistency** | Two stable terms: "launch threshold" (quality), "action threshold" (cost) (CS-10, PC-04). |
| AI confidence | Confidence (+% and rule) | confidence / "mock confidence" | Consistent | Keep. |
| Eval surface | nav "Eval", title "AI Eval" | nav "Eval", kicker "AI eval" | Minor | Standardize display form "AI eval" where space allows; nav "Eval" acceptable. |
| Human decision on pattern | Verdict (Valid / Too broad / …) | "Human verdict" / "pattern verdict" | Consistent | Keep. |
| Output document | (product) brief / backlog candidate | product brief | Consistent enough | Unify button labels only (PC-07). |
| Honesty labels | "Synthetic data", "Mocked / Illustrative", "Mocked outcome — no live integration" | "mocked", "illustrative", "synthetic", "Live · synthetic data" | Consistent | Keep — this vocabulary is a project asset. |
| HITL boundary | "Reviewer-owned, not model-owned", MODEL_BOUNDARY | Same MODEL_BOUNDARY blockquote | Consistent | Keep — single source of truth (`src/mock/index.ts:19`) is exemplary. |

---

## 12. Top 15 Highest-Impact Copy Changes

Ranked by effect on comprehension, hiring signal, credibility, and scanability.

1. **Add a 2–3 sentence "My role" statement to the case study page** (CS-03) — converts the weakest hiring signal (ownership: NOT EVIDENCED) into an explicit one; disclose agent collaboration. Blocked on confirming ownership facts.
2. **Resolve and delete `[PM to confirm exact ownership]` in CASE_STUDY.md** (CS-05).
3. **Rewrite Results heading** "A narrower demo with sharper AI PM judgment." → "Estimated results from a mocked prototype — and what would come next." (CS-01 + half of CS-04).
4. **Rewrite Role meta** → "Product framing, AI boundary + eval design, frontend build" (CS-02).
5. **Frontload the mocked qualifier at Results scan level** (kicker "Results (mocked)") (CS-04).
6. **Rename product heading** "How I'd evaluate this in production" → "Production evaluation plan" (PC-01).
7. **Rewrite hero lede ending** "assistive, mocked, and visibly bounded" → "AI kept assistive: it suggests, humans decide…" (CS-06).
8. **Fix "Needs" → "Not ready"** in the pattern switcher (PC-03).
9. **Fix eval status-chip mislabels** ("Watchlist" on neutral estimates, "Healthy" from importance) (PC-05).
10. **Rewrite next-steps sentence** ("review-cadence adoption" → plain verb phrases) (CS-09).
11. **Clarify feed toolbar units** ("evidence: 7 confirmed · 9 AI-suggested") (PC-02).
12. **Remove "flagship"** from scope figure and results row (CS-08).
13. **Rename case study nav "Loop" → "How it works"** (CS-07).
14. **Standardize threshold naming** (launch vs action) across both surfaces (CS-10).
15. **Gloss "high-confidence disagreement" and "frontier model" at first prose use** (CS-15, PC-11).

---

## 13. Before / After Table

| Location | Current | Recommended | Reason |
|---|---|---|---|
| case-study.tsx:305 | "A narrower demo with sharper AI PM judgment." | "Estimated results from a mocked prototype — and what would come next." | Removes self-grade + unexplained pivot reference; frontloads honesty; describes content. |
| case-study.tsx:21 | "Role — AI PM framing + frontend" | "Role — Product framing, AI boundary + eval design, frontend build" | Decodable contribution; each noun maps to a page artifact. |
| case-study.tsx (new, near hero meta) | — | "I framed the problem, designed the AI-assistive boundary and eval strategy, and built the Phase 1 frontend; AI coding agents worked under a documented repo workflow." *(publish only after ownership confirmed)* | Ownership: the page's biggest gap. |
| case-study.tsx:196 | "…while keeping AI assistive, mocked, and visibly bounded." | "…with AI kept assistive: it suggests, humans decide. Phase 1 is a frontend prototype on synthetic data." | Unpacks three compressed claims at maximum-exposure position. |
| case-study.tsx:182 | "Loop" | "How it works" | Nav must predict destination out of context. |
| case-study.tsx:234 | "1 — flagship validation path" | "1 — fully validated demo path" | Internal codeword → plain meaning. |
| case-study.tsx:56 | "Flagship mocked outcome" | "Example mocked outcome" | Same. |
| case-study.tsx:320-322 | "Next steps would be validating review-cadence adoption, collecting real eval data…" | "Next steps: test whether teams adopt a regular pattern-review ritual, collect real evaluation data from privacy-safe support exports, and track outcomes through read-only integrations before any write-back." | Noun clusters → verb phrases. |
| EvalDashboard.tsx:141 | "How I'd evaluate this in production" | "Production evaluation plan" | Product voice in product UI. |
| EvalDashboard.tsx:106 | "…what does validated product signal cost?" | "…what does one validated pattern cost?" | Concrete unit; matches the key metric and the case study's own phrasing. |
| PatternReview.tsx:89 | "Needs" | "Not ready" | Complete state word; opposite of "Ready". |
| PatternReview.tsx:200 | "Blocked until the transparent readiness rule passes." | "Blocked until the readiness rule passes." | Self-praise out of UI. |
| PatternFeed.tsx:83 | "4 patterns · 1 ready · 7 confirmed · 9 AI-suggested" | "4 patterns · 1 ready — evidence: 7 confirmed · 9 AI-suggested" | Explicit unit switch. |
| PatternFeed.tsx:36 | "Below rule" | "Below 70% rule" | Names the threshold. |
| PatternReview.tsx:140 | "Demo confirmed" | "Pre-confirmed (demo)" | Says what happened and why. |
| EvalDashboard.tsx:112 | "Precision + recall" (F1 note) | "Balance of precision + recall" | F1 is not a sum. |
| case-study.tsx:55 | "Estimated human effort to validate evidence and set a verdict" | "Rough estimate from walking the demo review flow; not measured" *(or remove row)* | Only unanchored number in the table. |

---

## 14. Texts That Should Not Change

These are strong as written; changing them risks losing the project's best signals.

- **MODEL_BOUNDARY** (`src/mock/index.ts:19`): "AI suggests patterns; the human validates evidence; transparent rules compute readiness; the PM decides. The AI never decides what enters the backlog and never self-approves." — the single best sentence in the project, reused as a single source of truth across surfaces.
- **Problem section prose** (`src/case-study.tsx:219-230`) — the three-phrasings example is exactly how to justify AI over keyword rules; "Semantic clustering is a genuine AI task, but only an assistive one" is a model AI-appropriateness sentence.
- **"Dashboards without actions are decoration."** (`src/case-study.tsx:273`) — earned, memorable judgment; keep verbatim.
- **Scope section** heading and both lists ("What is real, and what is deliberately mocked.") — the strongest evidence-discipline artifact on the page.
- **Demo frame caption**: "This is the actual product embedded in the page, not a screenshot. Click through the patterns, flip evidence decisions, and open the brief." — verified, differentiating, actionable.
- **Playground footnote**: "This widget calls the same getReadiness() function as the product above. The AI never gets to skip this gate." — verified technical credibility with voice.
- **Results table caption**: "All values are estimated from the mocked prototype — not production outcomes." — keep; just add scan-level reinforcement (CS-04).
- **Evidence decision vocabulary** (Belongs / Does not belong / Different problem / Unsure) and **verdict vocabulary** (Valid / Too broad / Mixed issues / Not actionable / Not a product issue) — precise, user-worded, mutually exclusive; a quiet ontology-design signal.
- **Honesty labels everywhere**: "Synthetic data" topbar chip; "Frontend-only prototype — synthetic data, no real AI calls" footer; "Mocked outcome — no live integration"; "Live · synthetic data".
- **Problem heading**: "Recurring complaints need proof before they become roadmap work."
- **Rail micro-copy**: "Verdict — Reviewer-owned, not model-owned." and "Readiness — Visible gate before a brief can be opened."
- **Metric table plain-language definitions** (`src/mock/index.ts:376-473`) — genuinely plain-language; the "Plain-language definition" column header is itself a good decision.
- **README honesty blockquote** and Phase 1 scope paragraph.

---

## 15. Evidence Gaps

Problems that copy cannot fix — do not paper over these with better wording.

1. **Ownership confirmation** — the split between the candidate's work and AI coding agents' work is not established anywhere authoritative. A rewrite (CS-03) requires the facts first. Copy can only be as strong as this confirmation.
2. **No real users, research, or adoption evidence** — the page handles this honestly ("Next steps would be validating…"). The gap is real: problem framing rests on plausibility, not discovery evidence. Do not add implied research.
3. **No executed evaluation** — evaluation *design* is evidenced (metrics, thresholds, actions); evaluation *execution* is not (all values hardcoded). Even a small labeled synthetic eval set with genuinely computed precision/recall would convert "evaluation thinking: design-level" into demonstrated capability. Until then, keep every number labeled as estimate.
4. **Trade-offs are under-articulated as decisions** — the raw material exists (assistive-only boundary, model-tier split, narrow Phase 1 scope, cost-per-validated-pattern over raw spend) but is mostly presented as features/facts, not as "chose X over Y because Z". This is a framing gap at the boundary of copy and evidence: reframe only where the reasoning genuinely existed; do not retrofit reasoning.
5. **Review time 6–9 min** — either establish a basis (even "timed myself walking the flow") or drop it (CS-14).

---

## 16. Recommended Rewrite Sequence

**Phase 1 — Misleading / ambiguous / unsupported**
- CS-05: resolve and remove the ownership placeholder in CASE_STUDY.md (prerequisite for everything ownership-related).
- CS-04: frontload the mocked qualifier at Results scan level.
- PC-05: fix eval status-chip mislabels.
- CS-14: anchor or remove the review-time row.

**Phase 2 — High-impact clarity and scanability**
- CS-03 + CS-02: add the "My role" statement; rewrite the Role meta (after Phase 1 confirmation).
- CS-01: rewrite the Results heading.
- CS-06: rewrite the hero lede ending.
- PC-01: rename "How I'd evaluate this in production".
- CS-09: rewrite the next-steps sentence.
- PC-02, PC-03: feed toolbar units; "Needs" → "Not ready".

**Phase 3 — Terminology consistency**
- CS-10 / PC-04: standardize threshold naming ("launch threshold" / "action threshold"); "Below 70% rule".
- CS-11: playground "Out" → product vocabulary.
- PC-07: unify brief button labels.
- CS-07: nav "Loop" → "How it works"; "AI eval" casing.

**Phase 4 — Polish**
- PC-06, PC-08, PC-09, PC-10, PC-11, PC-12: adjective trims, glosses, stat-note fix.
- CS-08, CS-12, CS-13, CS-15: "flagship" removals, meta description, scope figure reframe, disagreement gloss.
- README: reconsider "Honest positioning" as a feature bullet.

---

*End of audit. No code or copy was modified. Implementation not started, per instructions.*
