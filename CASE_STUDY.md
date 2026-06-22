# Opsqora Case Study

## 1. The Problem

Small product teams receive recurring support feedback in many different phrasings, and PMs need a reliable way to separate a genuine product pattern from noise before committing roadmap attention.

## 2. Why AI?

Semantic clustering is a real AI task because the same complaint appears in many phrasings: one customer says "timeline import shifted blockers," another says "dependency dates moved after migration," and a third says "milestones changed after CSV import." Keyword/rule-based grouping misses these fuzzy similarities, new issues emerge that no rule anticipates, and pure manual review does not scale. AI is assistive here: it suggests patterns, summarizes evidence, and estimates confidence, but it does not decide what enters the backlog.

## 3. Your Role

I framed the problem, scoped the pattern-validation workflow, designed the AI assistive boundary, shaped the eval strategy and cost model, and built the frontend prototype. [PM to confirm exact ownership]

## 4. The Approach

Opsqora centers the product workflow on recurring feedback patterns. Each pattern has a concise summary, mention count, trend, product area, model confidence, representative evidence snippets, and a human verdict.

For production model selection, the prototype assumes a frontier model would handle clustering, evidence selection, and final problem synthesis, while a cheaper model could handle low-stakes formatting, labels, and brief cleanup. The Phase 1 data strategy is synthetic and deterministic; in production, the input would be privacy-safe feedback exports with reviewer-labeled ground truth.

## 5. What You Built

The live prototype includes:

- Pattern Feed: AI-suggested recurring feedback patterns with mention count, trend, product area, confidence, and readiness state.
- Pattern Review: representative evidence quotes marked as `Belongs`, `Does not belong`, `Different problem`, or `Unsure`, plus a human pattern verdict.
- Readiness Logic: visible rules requiring enough confirmed evidence, a `Valid` verdict, and sufficient confidence before a product brief can be generated.
- Product Brief: a mocked backlog candidate auto-filled from a validated pattern.
- AI Eval: quality metrics, cost metrics, and a prominent "How I’d evaluate this in production" panel with thresholds and actions.
- Design Notes: positioning, product boundaries, and the moat question versus Productboard, Enterpret, unitQ, Dovetail, and model providers.

Current screenshots:

- Pattern Feed: `public/shots/patterns@2x`
- Pattern Review: `public/shots/pattern-review@2x`
- Product Brief: `public/shots/product-brief@2x`
- AI Eval: `public/shots/ai-eval@2x`

## 6. Results

All numbers below are estimates from the mocked prototype, not production outcomes.

- Target pattern precision: >= 70% `(estimated, mocked prototype)`
- Mocked current pattern precision: 76% `(estimated, mocked prototype)`
- Target evidence precision: >= 80% `(estimated, mocked prototype)`
- Mocked current evidence precision: 81% `(estimated, mocked prototype)`
- Cost per validated pattern: approximately $8.90 `(estimated, mocked prototype)`
- Review time per pattern: approximately 6-9 minutes `(estimated, mocked prototype)`
- Flagship mocked outcome: mentions decreased from 42 to 18 after a product action `(estimated, mocked prototype; no live integration)`

## 7. What You Learned

The core product lesson is that AI product value comes from the workflow around the model: evidence states, human verdicts, readiness rules, eval thresholds, and cost per validated pattern. Next, I would validate review-cadence adoption, collect real eval data from feedback exports, and test outcome tracking through read-only integrations before adding any write-back workflow.
