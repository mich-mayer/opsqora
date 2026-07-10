# Product Scope

## Phase 1 Screens

Opsqora uses recurring feedback patterns as the unit of work. The main product workflow is intentionally minimal:

- Patterns: AI-suggested recurring feedback patterns with product area, signal strength, search, and readiness state.
- Review: representative support evidence quotes, four evidence decisions, five pattern verdicts, and visible readiness logic.
- Brief: concise mocked backlog candidate generated from a ready pattern.
- AI Eval: quality metrics, cost metrics, production thresholds/actions, trend charts, and cost by AI task.

- Case Study: public narrative page at `case-study.html`, embedding the live product including the Eval screen.

## Data Model

The active prototype uses `src/mock/` as the deterministic mock layer for all visible AI outputs.

The mock layer includes:

- recurring feedback patterns;
- representative support evidence snippets from fictional feedback exports;
- evidence validation defaults;
- pattern verdict defaults;
- product brief templates;
- mocked outcomes;
- quality metrics and definitions;
- cost metrics, cost by AI task, and production eval rules.

Support feedback items appear only as evidence snippets for recurring patterns.

## In Scope

- Polished frontend interactions and visual presentation.
- Static deployment through GitHub Pages.
- Deterministic local mock data.
- Human-in-the-loop pattern and evidence validation.
- Visible readiness rules before product brief generation.
- Mocked product brief generation from a validated pattern.
- Mocked outcome tracking in the case study, clearly labeled as not connected to live systems.
- AI quality and cost evaluation with plain-language definitions.
- Case study notes that explicitly address differentiation versus feedback repositories and model providers.

## Out Of Scope

- Real customer data.
- Real AI API calls.
- Backend services.
- Databases or persistent storage.
- Authentication and account management.
- Production integrations, workflow write-back, customer messaging, or autonomous backlog insertion.
- Automated backlog insertion.
- Billing or production SaaS infrastructure.

Any move into these areas should be treated as a new phase and documented before implementation.
