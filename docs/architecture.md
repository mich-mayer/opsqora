# Architecture

## Runtime

Opsqora is a static React + TypeScript application built with Vite.

- `npm run dev` starts the local Vite server.
- `npm run build` type-checks and creates the production build.
- `npm run verify` is the standard project verification command.
- GitHub Pages deploys the contents of `dist/`.

The Vite base path is `/opsqora/`, which is required for the GitHub Pages deployment.

## Entry Points

Keep these root HTML files in place:

- `index.html` loads `/src/main.tsx` for the interactive prototype.
- `case-study.html` loads `/src/case-study.tsx` for the case study page.

`vite.config.ts` explicitly builds both HTML entries:

- `main`
- `caseStudy`

Do not move or rename these entry files without updating Vite config, internal links, README references, and GitHub Pages expectations.

## Source Layout

Current source files and folders:

- `src/main.tsx`: React bootstrap for the main prototype.
- `src/App.tsx`: main application shell, global state, navigation, search, pattern selection, evidence validation state, brief-generation state, and screen wiring.
- `src/screens/`: one file per prototype screen:
  - `PatternFeed.tsx`
  - `PatternReview.tsx`
  - `ProductBriefScreen.tsx`
  - `EvalDashboard.tsx`
  - `DesignNotes.tsx`
  - legacy Concept A screens remain in source for historical context and typecheck compatibility but are not mounted by the live app.
- `src/components/primitives.tsx`: shared UI primitives such as badges, panels, stat cards, page titles, empty states, table column help, and review field selects.
- `src/lib/index.ts`: pure helpers and constants such as date formatting, SLA calculation, human-review reasons, counts, colors, and the default review threshold.
- `src/case-study.tsx`: React bootstrap and content for the case study page.
- `src/mock/index.ts`: deterministic Concept B mock layer for recurring patterns, evidence snippets, product briefs, mocked outcomes, eval metrics, and costs.
- `src/data.ts`: legacy deterministic synthetic ticket generator from Concept A; not mounted by the active app.
- `src/types.ts`: domain types for legacy tickets and active Concept B pattern validation.
- `src/styles.css`: global styling for the app and case study.

The app has been split by screen while keeping Phase 1 behavior in local React state. If the app grows further, prefer gradual extraction by product capability:

- `src/app/` for app shell and shared layout;
- `src/features/patterns/` for pattern feed, evidence review, and readiness rules;
- `src/features/briefs/` for generated product brief workflows;
- `src/features/eval/` for AI quality and cost views;
- `src/data/` for synthetic data generation;
- `src/pages/` for standalone pages such as the case study.

## Assets

Static assets live in `public/` and are copied by Vite:

- favicon;
- Opsqora mark;
- logo text images.

Generated local experiment assets may exist under `tmp/`, but they should not be treated as project source.

## Deployment

GitHub Pages deployment is configured in `.github/workflows/deploy-pages.yml`.

The workflow:

1. checks out the repository;
2. installs dependencies with `npm ci`;
3. runs `npm run build`;
4. uploads `dist/` as the Pages artifact;
5. deploys to GitHub Pages.

## Important Constraints

- Do not commit secrets or local environment files.
- Do not manually edit `dist/`; it is generated.
- Do not reference assets with paths that break the `/opsqora/` base path.
- Keep case study links compatible with GitHub Pages.
