# Opsqora Claude Context

Use this file as the entry point when working with Claude or Claude Code.

## Start Here

Read these files before making project changes:

- `README.md` for the product overview and local commands.
- `docs/project-brief.md` for the product intent and audience.
- `docs/product-scope.md` for current Phase 1 boundaries and non-goals.
- `docs/architecture.md` for the source layout and deployment model.
- `docs/agent-workflow.md` for collaboration rules shared by Claude and Codex.
- `docs/design-direction.md` for the visual direction, color tokens, typography, case study structure, and implementation tasks.

## Project Guardrails

- Opsqora is a polished frontend-only React/Vite prototype.
- Keep all data local, deterministic, and synthetic.
- Preserve both entry pages: `/` via `index.html` and `/case-study.html` via `case-study.html`.
- Do not add a backend, authentication, persistence, billing, real AI calls, or real customer data unless explicitly requested.
- Do not edit generated or dependency folders such as `dist/`, `node_modules/`, or `tmp/`.
- Before finishing code changes, run `npm run verify`.

## Working Style

- Make focused, reviewable changes.
- Prefer existing UI, data, and naming patterns over introducing new abstractions.
- Keep documentation in `docs/` as the shared source of truth instead of duplicating long context in this file.
- If another agent or user has uncommitted changes, work with them and do not overwrite them.
