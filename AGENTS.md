# Opsqora Agent Instructions

This file is the shared entry point for Codex and other coding agents.

## Required Context

Before changing code or docs, read:

- `README.md`
- `docs/project-brief.md`
- `docs/product-scope.md`
- `docs/product-decisions.md`
- `docs/architecture.md`
- `docs/agent-workflow.md`
- `docs/design-direction.md` — visual direction and design spec (color tokens, typography, case study structure, screenshot strategy, implementation tasks)

## Build And Verification

- Install dependencies with `npm install` or `npm ci`.
- Run the development server with `npm run dev`.
- Verify the project with `npm run verify`.
- The production build must keep both Vite HTML entries:
  - `index.html`
  - `case-study.html`

## Boundaries

- This is a Phase 1 frontend-only prototype.
- All tickets, labels, charts, quality metrics, and AI outputs are synthetic mock data.
- Do not introduce production integrations, external model calls, auth, databases, or real customer data without an explicit request.
- Do not edit `dist/`, `node_modules/`, or `tmp/`; they are generated or local-only.

## Collaboration Rules

- Treat GitHub as the source of truth and the local repository as the working copy.
- Check `git status --short` before significant edits.
- Keep changes scoped to the user's request.
- Do not revert or overwrite changes you did not make.
- Update the relevant file in `docs/` when behavior, scope, architecture, or agent expectations change.
