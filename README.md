# Opsqora

Opsqora is a portfolio-grade visual prototype for an AI-assisted B2B SaaS support operations workspace. It shows how support and product teams can classify tickets, review AI recommendations, identify duplicate patterns, measure AI quality, and turn support demand into product insight.

> This is a Phase 1 visual prototype using synthetic support tickets and mocked AI analysis. No real customer data or real AI API is used.

## What this prototype demonstrates

- A support operations overview and searchable ticket inbox
- Multi-label classification with one primary topic and multiple secondary tags
- Human-in-the-loop approval, editing, and reviewer notes
- Duplicate cluster discovery and cluster inspection
- Product insights including topic co-occurrence and suggested product actions
- AI quality measurement, evaluation cases, errors, and review corrections
- Transparent synthetic data and responsible AI positioning

## Phase 1 scope

The prototype is frontend-only. All tickets, AI outputs, quality metrics, clusters, and charts are local deterministic mock data. There is no authentication, backend, database, production integration, customer messaging, or external model call.

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

- **Overview**: support KPIs, ticket volume, issue clusters, and recent AI activity
- **Ticket Inbox**: 500 searchable and filterable synthetic tickets
- **Ticket Review**: original ticket, structured AI analysis, drafts, editable labels, and review controls
- **Duplicate Clusters**: repeated issue patterns and related ticket drill-down
- **Product Insights**: product area demand, co-tagging, emerging issues, and suggested actions
- **AI Quality**: model metrics, trends, error analysis, low-confidence cases, and evaluation methodology
- **Dataset**: distributions, taxonomy, schema, and sample records
- **Safety & About**: intended use, limitations, and explicit non-goals

## Synthetic dataset explanation

The local generator creates 500 English-language support tickets for a fictional project management and team collaboration company. The dataset contains 250 one-tag tickets, 170 two-tag tickets, 60 three-tag tickets, and 20 tickets with four or more tags. Every ticket includes expected labels, operational attributes, duplicate cluster metadata, and a synthetic ground-truth explanation.

## Mock AI provider explanation

The simulated triage provider is deterministic and runs entirely in the browser. It produces structured classifications, confidence, rationale, routing suggestions, internal notes, and customer reply drafts. Intentional classification errors and low-confidence cases make the review and evaluation workflows demonstrable.

## Main product idea

Opsqora treats AI as a decision-support layer between raw support demand and accountable human action. The product helps support teams move faster while giving product teams structured evidence about repeated pain points and giving AI product managers a measurable quality and governance surface.

## Future implementation plan

1. Add a typed backend API and persistent database.
2. Introduce authenticated roles and workspace-level access controls.
3. Connect a production model behind a schema-validated provider interface.
4. Add offline evaluation pipelines and versioned ground-truth datasets.
5. Integrate a support platform in read-only mode before enabling controlled write actions.
6. Add audit logs, reviewer assignment, incident workflows, and privacy controls.
