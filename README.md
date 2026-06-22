# Opsqora

Opsqora is a portfolio-grade visual prototype for an AI-assisted support feedback pattern validation tool. It shows how a small product team can find recurring complaints, verify representative evidence, and turn confirmed support patterns into product decisions.

> This is a Phase 1 frontend-only prototype using synthetic support evidence and mocked/illustrative AI outputs. No real customer data, backend, authentication, persistence, or real AI API is used.

## What this prototype demonstrates

- A pattern feed of AI-suggested recurring support feedback patterns
- Evidence validation where support snippets are marked `Belongs`, `Does not belong`, `Different problem`, or `Unsure`
- Pattern verdicts: `Valid`, `Too broad`, `Mixed issues`, `Not actionable`, and `Not a product issue`
- Visible readiness rules: evidence threshold + human verdict + model confidence
- Mocked product brief generation for a validated pattern
- Mocked outcome tracking, clearly labeled as not connected to live systems
- AI eval with quality metrics, cost metrics, and production thresholds/actions
- Honest positioning: Opsqora complements the helpdesk; it does not process tickets or draft replies

## Phase 1 scope

The prototype is frontend-only. All patterns, evidence snippets, AI outputs, eval metrics, costs, outcomes, and charts are local deterministic mock data. There is no authentication, backend, database, production integration, customer messaging, or external model call.

## How to run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To create a production build:

```bash
npm run build
```

To run the standard project verification used by agents:

```bash
npm run verify
```

The case study page is available at `/case-study.html` after the GitHub Pages build, for example:
`https://mich-mayer.github.io/opsqora/case-study.html`.

## Project documentation

Durable project context lives in the repository so humans, Claude, and Codex use the same source of truth:

- `CLAUDE.md`: entry context for Claude and Claude Code
- `AGENTS.md`: entry context for Codex and other coding agents
- `docs/project-brief.md`: product intent, audience, and positioning
- `docs/product-scope.md`: Phase 1 scope, screens, data model, and non-goals
- `docs/product-decisions.md`: positioning, human-in-the-loop boundaries, metric honesty, and product bets
- `docs/architecture.md`: source layout, build entries, assets, and deployment
- `docs/agent-workflow.md`: collaboration rules for humans and AI agents
- `src/README.md`: source-file map for implementation work

## Key screens

- **Pattern Feed**: AI-suggested recurring feedback patterns with mention count, trend, product area, and confidence
- **Pattern Review**: representative evidence quotes, four evidence decisions, five pattern verdicts, and explicit readiness logic
- **Product Brief**: mocked backlog candidate generated from a ready pattern, plus mocked outcome tracking
- **AI Eval**: quality and cost metrics with plain-language definitions and production threshold/action rules
- **Design Notes**: positioning, helpdesk boundary, wrapper/moat discussion, and Phase 1 limitations
- **Case Study**: public narrative page at `case-study.html`

## Synthetic dataset explanation

The active prototype uses a deterministic mock layer in `src/mock/`. It creates fictional recurring feedback patterns, representative support evidence quotes, product brief content, mocked outcomes, AI quality metrics, and cost metrics. The legacy ticket generator remains in source for historical context, but the live Concept B app routes all visible AI outputs through `src/mock/`.

## Mock AI provider explanation

The simulated AI layer is deterministic and runs entirely in the browser. It suggests patterns, attaches evidence, provides confidence/rationale, generates a product brief template, and exposes illustrative eval and cost metrics. It does not route tickets, draft customer replies, or call a real model.

## Main product idea

Opsqora treats AI as a pattern-suggestion layer, not an autonomous decision maker. The AI suggests recurring feedback patterns; humans validate evidence; transparent rules compute readiness; PMs make the final product decision.

## Future implementation plan

1. Validate the pattern-review workflow with real support exports in a privacy-safe research setting.
2. Add a typed backend API, persistent database, and authenticated roles.
3. Connect a production model behind a schema-validated provider interface.
4. Add offline evaluation pipelines, reviewer-labeled ground truth, and cost monitoring.
5. Integrate helpdesk systems in read-only mode before considering any write-back workflow.
6. Add audit logs, reviewer assignment, outcome tracking, and privacy controls.
