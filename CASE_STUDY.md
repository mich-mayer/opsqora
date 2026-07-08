# Opsqora Case Study

## 1. The Problem

Small product teams receive recurring support feedback in many different phrasings, and PMs need a reliable way to separate a genuine product pattern from noise before committing roadmap attention.

## 2. Why AI?

Semantic clustering is a real AI task because the same complaint appears in many phrasings: one customer says "timeline import shifted blockers," another says "dependency dates moved after migration," and a third says "milestones changed after CSV import." Keyword/rule-based grouping misses these fuzzy similarities, new issues emerge that no rule anticipates, and pure manual review does not scale. AI is assistive here: it suggests patterns, summarizes evidence, and estimates confidence, but it never decides what enters the backlog and never self-approves.

## 3. My Role

I framed the problem, scoped the pattern-validation workflow, designed the AI-assistive boundary, and shaped the eval strategy and cost model. Solo project: all product decisions, scope boundaries, and the readiness rule are mine. Implementation was built with AI coding agents (Claude Code and Codex) under a documented collaboration workflow in the repo — disclosed on the case study page and visible in the commit history.

## 4. The Approach

Opsqora centers the product workflow on recurring feedback patterns. Each pattern has a concise summary, mention count, trend, product area, model confidence, representative evidence snippets, and a human verdict.

The Phase 1 data strategy is synthetic and deterministic: the same patterns, evidence, and numbers on every visit, so every decision in the demo is reproducible. In production, the input would be privacy-safe feedback exports with reviewer-labeled ground truth.

The production model split is deliberate: a top-tier ("frontier") model for the hard semantic work — clustering, evidence selection, problem synthesis — and a cheaper model for low-stakes formatting, labels, and brief cleanup. Nothing in the workflow depends on which vendor supplies the model.

The eval strategy answers two product questions: can we trust the model, and what does one validated pattern cost? Precision, recall, evidence precision, and high-confidence disagreement measure trust; cost per validated pattern ties spend to value instead of raw model activity. Every metric is paired with a launch threshold and an action — pause suggestions, block readiness, or move low-stakes work to a cheaper model tier. Dashboards without actions are decoration.

## 5. What I Built

The live prototype includes:

- Pattern Feed: AI-suggested recurring feedback patterns with mention count, trend, product area, confidence, and readiness state.
- Pattern Review: representative evidence quotes marked as `Belongs`, `Does not belong`, `Different problem`, or `Unsure`, plus a human pattern verdict.
- Readiness Logic: visible rules requiring enough confirmed evidence, a `Valid` verdict, and sufficient confidence before a product brief can be generated.
- Product Brief: a mocked backlog candidate auto-filled from a validated pattern.
- AI Eval: quality metrics, cost metrics, and a prominent "Production evaluation plan" panel with thresholds and actions.
- Design Notes: positioning, product boundaries, and the moat question versus Productboard, Enterpret, unitQ, Dovetail, and model providers.

The case study page does not use screenshots: it embeds the live prototype twice
(`<App embedded />` under the hero and `<App embedded initialPage="eval" />` inside
the What I Built section) plus an interactive readiness playground in The Approach
that calls the real `getReadiness()` rule on the flagship pattern.

## 6. Results

No real model has run yet, so there are no measured model-quality numbers. The results split into what is measured in the prototype and the launch gates a real model must clear; illustrative current values appear only inside the eval dashboard, labeled as mocked.

Measured in this prototype:

- Interactive screens: 4 — Patterns, Review, Brief, and AI Eval, embedded live on the case study page.
- Validated demo paths: 1 — PAT-001 walks from AI suggestion to product brief with every gate visible.
- Readiness rule: live — the page playground calls the same `getReadiness()` function as the product.

Launch gates — designed, not yet measured:

- Pattern precision gate: >= 70% — share of suggested patterns describing one real recurring problem, measured on reviewer-labeled exports.
- Evidence precision gate: >= 80% — share of attached snippets reviewers mark as `Belongs`.
- Cost per validated pattern: <= $12 action threshold — modeled at approximately $8.90 per pattern under Phase-1 assumptions.

The one mocked product outcome — mentions falling from 42 to 18 after a shipped action — stays inside the demo, labeled `Mocked outcome — no live integration`.

## 7. What I Learned

The core lesson: AI product value comes from the workflow around the model — evidence states, human verdicts, readiness rules, eval thresholds, and cost per validated pattern. The model can be swapped; the decision discipline is the part a team would actually adopt.

What I would do differently: put one real model call behind a flag earlier — a single real eval run on a small model would turn the illustrative dashboard values into a measured baseline.

Next steps: test whether teams actually adopt a regular pattern-review ritual, collect real evaluation data from privacy-safe support exports, and track outcomes through read-only integrations before letting the product write anything back.
