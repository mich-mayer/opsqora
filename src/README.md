# Source Map

This directory contains the React/Vite source for Opsqora.

## Files

- `main.tsx`: mounts the main interactive prototype from `App.tsx`.
- `App.tsx`: contains the current Phase 1 product UI, navigation, screens, charts, filters, and review interactions.
- `case-study.tsx`: mounts and renders the public case study page.
- `data.ts`: creates deterministic synthetic tickets and exports taxonomy constants.
- `types.ts`: defines shared domain types.
- `styles.css`: global CSS for the prototype and case study.

## Notes For Agents

- Keep `main.tsx` and `case-study.tsx` as Vite entry modules unless the HTML files and Vite config are updated together.
- Keep synthetic data deterministic so screenshots, metrics, and review flows remain reproducible.
- If extracting components later, do it incrementally and verify both entry pages after each move.
