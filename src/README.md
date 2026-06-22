# Source Map

This directory contains the React/Vite source for Opsqora.

## Files

- `main.tsx`: mounts the main interactive prototype from `App.tsx`.
- `App.tsx`: contains the app shell, global state, navigation, search, pattern selection, evidence validation, product brief generation, and screen wiring.
- `screens/PatternFeed.tsx`: pattern list, summary metrics, search, and featured pattern.
- `screens/PatternReview.tsx`: evidence decisions, pattern verdict, readiness logic, and brief preview.
- `screens/ProductBriefScreen.tsx`: generated product brief, readiness snapshot, and mocked outcome tracking.
- `screens/EvalDashboard.tsx`: AI quality and cost metrics with threshold/action rules.
- `screens/DesignNotes.tsx`: positioning, boundaries, differentiation, and review cadence.
- `components/primitives.tsx`: shared badges, panels, stat cards, page title, and empty state.
- `lib/index.ts`: small shared helpers and visual constants.
- `mock/index.ts`: deterministic patterns, evidence snippets, eval metrics, costs, product briefs, and mocked outcomes.
- `types.ts`: domain types for pattern validation.
- `case-study.tsx`: mounts and renders the public case study page.
- `styles.css`: global CSS for the prototype and case study.

## Notes For Agents

- Keep `main.tsx` and `case-study.tsx` as Vite entry modules unless the HTML files and Vite config are updated together.
- Keep synthetic data deterministic so screenshots, metrics, and review flows remain reproducible.
- Route new visible AI outputs through `src/mock/`; do not add live model calls or scatter mock outputs across screens.
- Keep screen-level behavior in `screens/` and shared behavior in `lib/` or `components/primitives.tsx`.
