# Product Decisions

This document captures the product choices that should stay stable while Opsqora remains a Phase 1 frontend prototype.

## Positioning

Opsqora is a support feedback pattern validation tool for product teams handling fragmented customer feedback.

The product turns recurring support feedback into validated product evidence. It should be presented as a focused AI Product Manager prototype with evidence review, readiness logic, product brief generation, and AI eval discipline.

## Unit Of Work

The recurring feedback pattern is the primary unit of work.

Each pattern includes:

- a short summary;
- mention count;
- trend;
- product area;
- confidence;
- representative evidence snippets;
- a human pattern verdict;
- readiness status;
- a product brief template;
- mocked outcome tracking.

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

The key value-linked cost metric is cost per validated pattern, not raw model spend. Production eval rules should pair thresholds with actions, such as pausing auto-suggestion, inspecting failed product areas, or moving low-stakes tasks to a cheaper model.

## Portfolio Story

For interviews, Opsqora should emphasize three product bets:

- product focus: recurring feedback patterns are the core unit of work;
- operational trust: every pattern is backed by inspectable evidence and human verdicts;
- AI governance as product surface: quality, disagreement, and cost are visible in the workflow.

Future phases can add backend persistence, model providers, read-only feedback integrations, auth, audit logs, and evaluation pipelines, but those are intentionally out of scope for the current prototype.
