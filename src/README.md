# Source Map

This directory contains the React/Vite source for Opsqora.

## Files

- `main.tsx`: mounts the main interactive prototype from `App.tsx`.
- `App.tsx`: contains the app shell, global state, navigation, search, pattern selection, evidence validation, product brief generation, and screen wiring.
- `screens/`: active Concept B screens are `PatternFeed`, `PatternReview`, `ProductBriefScreen`, `EvalDashboard`, and `DesignNotes`. Legacy Concept A screens remain in source for historical context and typecheck compatibility but are not mounted by the live app.
- `components/primitives.tsx`: shared badges, panels, stat cards, page title, empty state, column help, and review field controls.
- `lib/index.ts`: pure helpers and constants for formatting, dates, SLA state, review routing, counts, colors, and default thresholds.
- `case-study.tsx`: mounts and renders the public case study page.
- `mock/index.ts`: creates deterministic Concept B patterns, evidence snippets, eval metrics, costs, product briefs, and mocked outcomes.
- `data.ts`: legacy deterministic synthetic tickets and taxonomy constants from Concept A.
- `types.ts`: defines shared domain types for both legacy tickets and active Concept B pattern validation.
- `styles.css`: global CSS for the prototype and case study.

## Notes For Agents

- Keep `main.tsx` and `case-study.tsx` as Vite entry modules unless the HTML files and Vite config are updated together.
- Keep synthetic data deterministic so screenshots, metrics, and review flows remain reproducible.
- Route new visible AI outputs through `src/mock/`; do not add live model calls or scatter mock outputs across screens.
- Keep screen-level behavior in `screens/` and shared behavior in `lib/` or `components/primitives.tsx`.
