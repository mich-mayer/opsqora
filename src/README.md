# Source Map

This directory contains the React/Vite source for Opsqora.

## Files

- `main.tsx`: mounts the main interactive prototype from `App.tsx`.
- `App.tsx`: app shell, global state, minimal product navigation, pattern selection, evidence validation, and product brief generation. Accepts `embedded` and `initialPage` props so the case study can render the live product inside demo frames; `.shell-main` is the internal scroll container in both contexts.
- `screens/PatternFeed.tsx`: concise pattern table with search, area, signal strength, and readiness state.
- `screens/PatternReview.tsx`: pattern switcher, evidence decisions, pattern verdict, readiness logic, and brief action.
- `screens/ProductBriefScreen.tsx`: generated brief document and readiness snapshot.
- `screens/EvalDashboard.tsx`: secondary case-study/demo surface with quality/cost metric tables, threshold/action rules, and hand-rolled SVG charts (no charting library).
- `components/primitives.tsx`: shared wordmark, kicker, screen header, chip, stat, rule check, and empty state.
- `mock/index.ts`: deterministic patterns, evidence snippets, eval metrics, costs, product briefs, and mocked outcomes.
- `types.ts`: domain types for pattern validation.
- `case-study.tsx`: mounts the public case study page; embeds `<App embedded />`, `<App embedded initialPage="eval" />`, and a readiness playground that calls the real `getReadiness()`.
- `styles.css`: the shared Swiss International design system (tokens, app shell, screens, case study, responsive).
- `vite-env.d.ts`: Vite client type reference for `import.meta.env`.

## Notes For Agents

- Keep `main.tsx` and `case-study.tsx` as Vite entry modules unless the HTML files and Vite config are updated together.
- Keep synthetic data deterministic so metrics and review flows remain reproducible.
- Route new visible AI outputs through `src/mock/`; do not add live model calls or scatter mock outputs across screens.
- Keep screen-level behavior in `screens/` and shared behavior in `components/primitives.tsx`.
- Follow `docs/design-direction.md`: one ultramarine accent, hairline rules, square markers, no border radius, no charting libraries.
