# Source Map

This directory contains the React/Vite source for Opsqora.

## Files

- `main.tsx`: mounts the main interactive prototype from `App.tsx`.
- `App.tsx`: contains the app shell, global state, navigation, search, notifications, reset modal, and screen wiring.
- `screens/`: one file per prototype screen (`Overview`, `TicketInbox`, `TicketReview`, `DuplicateClusters`, `ProductInsights`, `AIQuality`, `Dataset`, `Safety`, `SettingsPage`).
- `components/primitives.tsx`: shared badges, panels, stat cards, page title, empty state, column help, and review field controls.
- `lib/index.ts`: pure helpers and constants for formatting, dates, SLA state, review routing, counts, colors, and default thresholds.
- `case-study.tsx`: mounts and renders the public case study page.
- `data.ts`: creates deterministic synthetic tickets and exports taxonomy constants.
- `types.ts`: defines shared domain types.
- `styles.css`: global CSS for the prototype and case study.

## Notes For Agents

- Keep `main.tsx` and `case-study.tsx` as Vite entry modules unless the HTML files and Vite config are updated together.
- Keep synthetic data deterministic so screenshots, metrics, and review flows remain reproducible.
- Keep screen-level behavior in `screens/` and shared behavior in `lib/` or `components/primitives.tsx`.
