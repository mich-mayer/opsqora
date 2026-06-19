# Agent Workflow

This document explains how Claude, Codex, and humans should share the project without stepping on each other.

## Source Of Truth

GitHub is the source of truth. The local folder is a working copy.

Project context should live in repository files:

- `README.md` for human onboarding;
- `docs/` for durable project knowledge;
- `CLAUDE.md` for Claude entry context;
- `AGENTS.md` for Codex and other coding agents.

Do not keep important project instructions only inside a chat thread or a local Claude Desktop note.

## Recommended Claude Setup

For Claude Desktop or Claude Code:

1. Open or attach the local repository folder.
2. Start from `CLAUDE.md`.
3. Let Claude read the linked files in `docs/`.
4. Keep durable updates in `docs/` and commit them to GitHub.

## Recommended Codex Setup

For Codex:

1. Work inside the same local repository folder.
2. Start from `AGENTS.md`.
3. Inspect source files before edits.
4. Verify changes with `npm run verify`.

## Avoiding Agent Conflicts

- Prefer one active agent per branch.
- If Claude and Codex both need to work, give them separate branches or clearly separate tasks.
- Pull or sync before starting a new work session.
- Check `git status --short` before significant edits.
- Do not overwrite uncommitted changes from another agent or the user.
- Keep changes small enough to review.

## Editing Rules

- Preserve the Phase 1 scope unless the user explicitly asks for a new phase.
- Keep both public surfaces working: the prototype and the case study.
- Follow existing React, TypeScript, and CSS patterns.
- Prefer improving local structure and documentation over adding tooling.
- Avoid broad refactors when a focused change solves the task.

## Done Definition

A change is done when:

- the requested behavior or documentation exists;
- `npm run verify` passes;
- the prototype route and case study route are still accounted for;
- any changed scope, architecture, or workflow expectation is documented.
