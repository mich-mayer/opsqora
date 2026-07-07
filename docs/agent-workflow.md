# Agent Workflow

This document is the single source of truth for how Claude, Codex, and humans work on Opsqora without stepping on each other. `CLAUDE.md` and `AGENTS.md` are thin entry points that link here; the actual rules live below.

## Source Of Truth

GitHub is the source of truth. The local folder is a working copy.

Project context lives in repository files, not in chat threads or local notes:

- `README.md` for human onboarding;
- `DESIGN_CONTENT_SYSTEM.md` for UI, component, copy, terminology, accessibility, and case-study rules;
- `docs/` for durable project knowledge (brief, scope, decisions, architecture, design direction, this workflow);
- `CLAUDE.md` for Claude entry context;
- `AGENTS.md` for Codex and other coding agents.

## Project Guardrails

- Opsqora is a polished, frontend-only React/Vite prototype for validating recurring support feedback patterns. Preserve this Phase 1 scope unless the user explicitly asks for a new phase.
- Keep all data local, deterministic, and synthetic. Every pattern, evidence snippet, chart, quality metric, cost, outcome, and AI output is mock data routed through `src/mock/`.
- Preserve both public surfaces: the prototype at `/` via `index.html`, and the case study at `/case-study.html` via `case-study.html`.
- Do not add a backend, authentication, persistence, billing, external model calls, or real customer data unless explicitly requested. Treat any such move as a new phase and document it first.
- Do not edit generated or dependency folders: `dist/`, `node_modules/`, or `tmp/`.

## Build And Verification

- Install dependencies with `npm install` or `npm ci`.
- Run the development server with `npm run dev`.
- Before finishing code changes, run `npm run verify`.
- The production build must keep both Vite HTML entries (`index.html` and `case-study.html`).

## Working Style

- Make focused, reviewable changes; avoid broad refactors when a focused change solves the task.
- Prefer existing UI, data, and naming patterns over introducing new abstractions or tooling.
- Follow existing React, TypeScript, and CSS patterns, and the rules in `DESIGN_CONTENT_SYSTEM.md`.
- Keep durable context in `docs/` (or `DESIGN_CONTENT_SYSTEM.md`) instead of duplicating long context in `CLAUDE.md`/`AGENTS.md`.
- Update the relevant file in `docs/` when behavior, scope, architecture, or agent expectations change.

## Avoiding Agent Conflicts

- Prefer one active agent per branch; give Claude and Codex separate branches or clearly separate tasks.
- Pull or sync before starting a new work session.
- Check `git status --short` before significant edits.
- Do not revert or overwrite uncommitted changes from another agent or the user.

## Done Definition

A change is done when:

- the requested behavior or documentation exists;
- `npm run verify` passes;
- the prototype route and case study route are both still accounted for;
- any changed scope, architecture, or workflow expectation is documented in `docs/`.
