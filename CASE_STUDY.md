# Opsqora Case Study

## 1. The Problem

Small product teams drown in support feedback; real, recurring product problems are buried under ticket volume, and PMs struggle to tell a genuine pattern from noise.

## 2. Why AI?

Semantic clustering is a real AI task because the same complaint appears in many phrasings: one customer says "timeline import shifted blockers," another says "dependency dates moved after migration," and a third says "milestones changed after CSV import." Keyword/rule-based grouping misses these fuzzy similarities, new issues emerge that no rule anticipates, and pure manual review does not scale. AI is assistive here: it suggests patterns, summarizes evidence, and estimates confidence, but it does not decide what enters the backlog.

## 3. Your Role

I framed the problem, narrowed the scope from a broad support operations workspace to a feedback pattern validation tool, designed the AI workflow, defined the human-in-the-loop boundary, shaped the eval strategy and cost model, and built the frontend prototype. [PM to confirm exact ownership]

## 4. The Approach

The key product move was narrowing Concept A into Concept B. Concept A tried to classify and route tickets, surface duplicate clusters, and draft support responses. That made Opsqora look like a helpdesk clone and implied double work for support agents. Concept B sits next to the helpdesk instead: the unit of work is a recurring feedback pattern, and tickets appear only as evidence.

For production model selection, the prototype assumes a frontier model would handle clustering, evidence selection, and final problem synthesis, while a cheaper model could handle low-stakes formatting, labels, and brief cleanup. The Phase 1 data strategy is synthetic and deterministic; in production, the input would be privacy-safe support exports with reviewer-labeled ground truth. The major trade-off was cutting broad support-ops features so the demo could focus on evidence validation, readiness rules, and AI eval discipline.

## 5. What You Built

The live prototype includes:

- Pattern Feed: AI-suggested recurring feedback patterns with mention count, trend, product area, confidence, and readiness state.
- Pattern Review: representative evidence quotes marked as `Belongs`, `Does not belong`, `Different problem`, or `Unsure`, plus a human pattern verdict.
- Readiness Logic: visible rules requiring enough confirmed evidence, a `Valid` verdict, and sufficient confidence before a product brief can be generated.
- Product Brief: a mocked backlog candidate auto-filled from a validated pattern.
- AI Eval: quality metrics, cost metrics, and a prominent "How I’d evaluate this in production" panel with thresholds and actions.
- Design Notes: positioning, helpdesk boundary, and the moat question versus Productboard, Enterpret, unitQ, Dovetail, and model providers.

Screenshot placeholders:

- [Insert Pattern Feed screenshot]
- [Insert Pattern Review screenshot]
- [Insert Product Brief screenshot]
- [Insert AI Eval screenshot]

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

The biggest lesson was that the broad workspace was weaker than the narrow loop. Concept A looked like a helpdesk clone with unclear differentiation and support-agent double work. Concept B is sharper because it makes the AI PM judgment visible: AI finds possible patterns, humans validate evidence, transparent rules compute readiness, and PMs decide what moves forward.

The wrapper/moat realization is also explicit: the model is not the moat. The product value is the workflow around the model: evidence states, human verdicts, readiness rules, eval thresholds, and cost per validated pattern. Next, I would validate whether teams adopt the review cadence, collect real eval data from support exports, and test outcome tracking through read-only integrations before adding any write-back workflow.
