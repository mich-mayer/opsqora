# Product Decisions

This document captures the product choices that should stay stable while Opsqora remains a Phase 1 portfolio prototype.

## Positioning

Opsqora is a support feedback pattern validation tool for small B2B SaaS product teams. It sits next to a helpdesk and turns recurring support feedback into validated product evidence.

The product should be presented as a focused AI Product Manager prototype, not a support-agent workspace.

## Deliberate Narrowing

Concept A was a broad AI-assisted support operations workspace. It included ticket inbox, routing, duplicate clusters, notes, reply drafts, and support operations metrics.

Concept B deliberately removes that surface. The product no longer tries to run support. The unit of work is a recurring feedback pattern, and support items appear only as evidence.

This narrowing is a product decision:

- it avoids duplicating Zendesk, Intercom, Front, or Freshdesk;
- it avoids double work for support agents;
- it gives the portfolio demo a sharper AI PM point of view;
- it puts human evidence validation and eval discipline at the center.

## Human-In-The-Loop Boundary

AI can suggest patterns, select representative evidence, summarize the problem, estimate confidence, and draft a product brief template.

Humans keep control over product-impacting decisions:

- evidence snippets are marked by a reviewer;
- the reviewer chooses the pattern verdict;
- transparent readiness rules compute whether a pattern is ready;
- the PM makes the final backlog decision.

The AI never decides what enters the backlog and never self-approves.

## Synthetic Data Honesty

All data is deterministic and synthetic. The prototype may show rich workflows, charts, quality metrics, costs, and outcomes, but it must not imply that production systems, real customers, or a real model are connected.

Anything that would require a backend or live data must be visibly labeled as `Mocked / Illustrative` or `Mocked outcome — no live integration`.

## Eval And Cost Discipline

The AI Eval screen should answer two questions:

- Can we trust the model?
- What does validated product signal cost?

The key value-linked cost metric is cost per validated pattern, not raw model spend or cost per support item. Production eval rules should pair thresholds with actions, such as pausing auto-suggestion, inspecting failed product areas, or moving low-stakes tasks to a cheaper model.

## Portfolio Story

For interviews, Opsqora should emphasize three product bets:

- product focus: recurring feedback patterns are a stronger unit of work than tickets;
- operational trust: every pattern is backed by inspectable evidence and human verdicts;
- AI governance as product surface: quality, disagreement, and cost are visible in the workflow.

Future phases can add backend persistence, model providers, read-only support integrations, auth, audit logs, and evaluation pipelines, but those are intentionally out of scope for the current prototype.
