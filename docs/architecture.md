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
- `src/App.tsx`: app shell, minimal product navigation, pattern selection, evidence validation state, brief-generation state, and screen wiring. Accepts `embedded` and `initialPage` props so the case study can render the live product and secondary eval demo inside frames.
- `src/screens/PatternFeed.tsx`: concise pattern table and search.
- `src/screens/PatternReview.tsx`: pattern switcher, evidence decisions, pattern verdict, readiness logic, and brief action.
- `src/screens/ProductBriefScreen.tsx`: generated brief document and readiness snapshot.
- `src/screens/EvalDashboard.tsx`: secondary case-study/demo surface with quality/cost metric tables, production eval rules, and hand-rolled SVG charts.
- `src/components/primitives.tsx`: shared wordmark, kicker, screen header, chips, stats, rule checks, and empty states.
- `src/mock/index.ts`: deterministic mock layer for patterns, evidence, briefs, outcomes, eval metrics, and costs.
- `src/types.ts`: domain types for pattern validation.
- `src/case-study.tsx`: the public case study page with live `App` embeds and the readiness playground.
- `src/styles.css`: the shared Swiss design system for the app and case study.
- `src/vite-env.d.ts`: Vite client type reference (`import.meta.env`).

If the app grows further, prefer gradual extraction by product capability:

- `src/app/` for app shell and shared layout;
- `src/features/patterns/` for pattern feed, evidence review, and readiness rules;
- `src/features/briefs/` for generated product brief workflows;
- `src/features/eval/` for AI quality and cost views;
- `src/pages/` for standalone pages such as the case study.

## Assets

Static assets live in `public/` and are copied by Vite:

- `favicon.svg` — the only brand asset; the wordmark is set in type, and the case study
  embeds the live app instead of screenshots.

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
