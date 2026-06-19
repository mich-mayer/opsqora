# Product Decisions

This document captures the product choices that should stay stable while Opsqora remains a Phase 1 portfolio prototype.

## Positioning

Opsqora is a support intelligence workspace for B2B SaaS operations. It sits between raw support demand and accountable human action:

- support teams get triage, prioritization, duplicate detection, and review workflows;
- product teams get structured evidence about repeated customer pain points;
- AI product managers get a visible quality and governance surface.

The product should be presented as decision support, not autonomous support automation.

## Human-In-The-Loop Boundary

AI can classify, recommend, group, draft, and explain. Humans keep control over customer-impacting decisions.

Current boundaries:

- no automatic ticket resolution;
- no automatic customer replies;
- no unreviewed escalations;
- no hidden routing changes;
- no backend, authentication, database, real AI call, or production integration.

Customer reply drafts are intentionally disabled for sending. They demonstrate the shape of an assistive workflow without implying production messaging.

## Synthetic Data Honesty

All data is deterministic and synthetic. The prototype may show rich workflows, charts, and review states, but it must not imply that production systems, real customers, or a real model are connected.

Product copy should distinguish between:

- live prototype values derived from the current synthetic tickets;
- illustrative evaluation snapshots that exist to demonstrate governance UI.

AI Quality currently derives human edit rate and low-confidence rate from the current ticket dataset and the shared confidence review threshold. Accuracy, recall, error categories, run trends, and deltas are illustrative synthetic evaluation metrics.

## Review Threshold

The confidence review threshold is a real prototype control. It changes which tickets enter human review, updates the Overview review count, and drives low-confidence filtering in AI Quality and Ticket Inbox.

This control is still local browser state only. It is not persisted to a backend or workspace configuration service.

## Portfolio Story

For interviews, Opsqora should emphasize three product bets:

- operational trust: every recommendation is inspectable, editable, and reversible;
- cross-functional leverage: support activity becomes product evidence without bypassing humans;
- AI governance as product surface: quality, confidence, and failure modes are visible in the workflow, not hidden in a dashboard for admins only.

Future phases can add backend persistence, model providers, integrations, auth, audit logs, and evaluation pipelines, but those are intentionally out of scope for the current prototype.
