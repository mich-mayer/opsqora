# Product Scope

## Phase 1 Screens

Opsqora currently includes these user-facing surfaces:

- Overview: support KPIs, ticket volume, issue clusters, and recent AI activity.
- Ticket Inbox: searchable and filterable synthetic support tickets.
- Ticket Review: original ticket, structured AI analysis, drafts, editable labels, and review controls.
- Duplicate Clusters: repeated issue patterns and related ticket drill-down.
- Product Insights: product area demand, co-tagging, emerging issues, and suggested actions.
- AI Quality: model metrics, trends, error analysis, low-confidence cases, and evaluation methodology.
- Dataset: distributions, taxonomy, schema, and sample records.
- Safety / About: intended use, limitations, and explicit non-goals.
- Case Study: public narrative page at `case-study.html`.

## Data Model

The local generator creates 500 English-language support tickets for a fictional project management and team collaboration company.

Each ticket includes:

- operational metadata such as channel, plan, assignee, ticket status, SLA due date, and support team;
- expected labels and ground-truth explanation;
- mocked AI analysis with confidence, rationale, routing, duplicate cluster, internal note, and customer reply draft;
- review state, reviewer note, and synthetic quality signals.

## In Scope

- Polished frontend interactions and visual presentation.
- Static deployment through GitHub Pages.
- Deterministic local mock data.
- Human-in-the-loop AI review patterns.
- Case study narrative for the project.
- Documentation that helps humans, Claude, and Codex work consistently.

## Out Of Scope

- Real customer data.
- Real AI API calls.
- Backend services.
- Databases or persistent storage.
- Authentication and account management.
- Support platform integrations.
- Automated customer messaging.
- Billing or production SaaS infrastructure.

Any move into these areas should be treated as a new phase and documented before implementation.
