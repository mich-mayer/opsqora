# Design Direction — "Operations Paper"

Visual direction and implementation spec for the portfolio-grade version of Opsqora.
This file is the source of truth for the visual layer. Read it before any styling or
case-study work, alongside `AGENTS.md` and the other files in `docs/`.

## Status

- Phase 1, frontend-only. Design spec only — no product/behavior changes implied.
- Session 1 is implemented: one theme token set, Fraunces + DM Sans, a reusable `Shot`
  figure, and the five-section case study structure are in place.
- Session 2 is implemented: real screenshots, annotated callouts, app polish, and the
  wider media-band layout are in place. `public/shots/placeholder.svg` has been removed.

## Scope & guardrails

Do:
- Keep the **live prototype as a quiet enterprise SaaS / dense B2B operations workspace**.
- Make the **case study a screenshot-led editorial product case study**.
- Use **real product screenshots** as the primary visual asset.
- Unify both surfaces on **one token set, one accent, one UI font**.

Do NOT:
- No backend, auth, persistence, or real AI (Phase 1 boundary stands).
- No dark "sci-fi" dashboard, no neon glows.
- No rebuild of the app navigation, screen set, table density, or behavior logic.
- No new abstractions where existing patterns work. Keep changes reviewable.

## Direction summary

Two surfaces, one DNA. The app stays the dense slate-teal workspace it already is
(effective theme currently lives in the lower `:root` block of `src/styles.css`). The
case study becomes a warm "paper" editorial layout where real screenshots are the hero
and copy frames them: serif display headings, generous whitespace, numbered sections,
alternating text/media rhythm.

The link between them is systemic, not accidental: the same `--accent`, `--ink`, and UI
font, a shared browser-frame for screenshots (same border/shadow language as app panels),
and two-way links. Clicking "Open live demo" from the case study should land in a UI that
visually rhymes with the screenshots.

Current state, in one line: the strongest asset — the real, well-built dashboard — is
shown nowhere. The case study sells an abstraction (a fake CSS mock) instead of the
product. Fixing that is the whole point of this direction.

---

# Implementation tasks for Codex

Each task is scoped for one focused change. Run `npm run verify` and check BOTH entry
pages (`/` and `/case-study.html`) when done.

## Session 1 — Tokens + case-study restructure (placeholders)

### T1 — Consolidate to a single theme token set
- Files: `src/styles.css`
- `src/styles.css` currently has four standalone `:root` blocks that redefine the same
  tokens (search for `:root {`). The lowest one ("Refined neutral B2B palette") wins and
  is the effective theme. Result: `--purple` actually holds a teal value, and large parts
  of the upper blocks are dead CSS.
- Steps:
  1. Keep the richest token block (the "Refined neutral B2B palette" one) as the single
     `:root`. Delete the token redefinitions and orphaned re-skins from the two earlier
     full-theme `:root` blocks (the indigo/purple one at the top, and the warm teal one
     after it). Keep the layout-token `:root` (`--page-gutter`, etc.) and media-query
     `:root` overrides.
  2. Add the tokens from the **Color tokens** reference below.
  3. Rename `--purple` → `--accent`, `--purple-2` → `--accent-strong`,
     `--purple-soft` → `--accent-soft` across the file (semantic names; the value is teal,
     not purple).
- Done when: editing `--accent` in one place visibly changes the app accent; no duplicate
  full-theme `:root` blocks remain; both pages render unchanged in layout.

### T2 — Two-font system
- Files: `src/styles.css` (the `@import` on line 1)
- Replace the font `@import` with **Fraunces** (display) + **DM Sans** (UI/body).
- Case study `h1`/`h2` → Fraunces; app headings (`h1, h2, h3`) → DM Sans.
- Remove Manrope and Nunito Sans.
- Done when: only two families load; case-study headings are serif; app headings are
  DM Sans; nothing falls back to Times/system serif.

### T3 — Reusable `<Shot>` figure; remove the fake mock
- Files: `src/case-study.tsx`, `src/styles.css`
- Build a `Shot` component: browser-frame wrapper (rounded 10px, `1px solid var(--border)`,
  shadow `0 30px 60px -22px rgba(28,37,41,.28)`), a slim top bar with three dots + a fake
  URL chip (e.g. `opsqora.app/overview`), `<img loading="lazy">`, and a `<figcaption>`
  with an accent label chip + one caption line.
- Remove the fake product mock entirely: the `case-product-shot` JSX in `src/case-study.tsx`
  and its CSS (`.case-product-shot`, `.case-shot-top`, `.case-mini-sidebar`,
  `.case-mini-main`, `.case-mini-stats`, `.case-mini-chart`, `.case-mini-table`).
- Use placeholder images for now (e.g. `public/shots/placeholder.png`); real captures land
  in T6.
- Done when: no `.case-mini-*` CSS or markup remains; all product visuals route through `Shot`.

### T4 — Restructure case study into 5 sections
- Files: `src/case-study.tsx`
- Rebuild the page into the five sections in the **Case study structure** reference below.
- Add: a `Live demo ↗` link in `case-nav`; a thin **case-meta bar** under the nav
  (Role / Type / Stack / Year); numbered section headers (`01`–`04`).
- Done when: page reads as hero → problem → how-it-works → human-in-the-loop → results+CTA,
  each non-hero content section carrying a `Shot`.

### T5 — Collapse the generic blocks
- Files: `src/case-study.tsx`, `src/styles.css`
- Fold the `case-architecture` row-list into a compact **stack-chip strip** inside Results.
- Fold `case-highlight-grid` ("Implementation Highlights") into the How-it-works narrative
  (text + screenshot), not a standalone 4-up card grid.
- Restyle `case-metrics` from KPI tiles into an editorial **stat line** (smaller, less
  "card", placed under a screenshot).
- Done when: no standalone architecture row-list or highlights card grid; metrics read as
  an editorial stat line.

## Session 2 — Screenshots + app polish + media layout

Implementation status: T6-T10 are implemented. The required checklist screenshots
(`overview@2x`, `review@2x`, `clusters@2x`, `quality@2x`, `dataset@2x`) plus the case-study
Problem-section `inbox@2x` shot are real captures from the running prototype in WebP with
PNG fallbacks. Final exported assets are 2880x1800. The available Browser capability
supports viewport overrides but does not expose a true deviceScaleFactor control; captures
were taken from the correct 1440x900 layout and normalized to 2x export dimensions.

### T6 — Capture and wire 5 real screenshots
- Files: `public/shots/`, `src/case-study.tsx`
- Apply T8 (11px floor) FIRST so text is legible inside figures.
- Capture at **1440×900, deviceScaleFactor 2**, light theme, real synthetic data, no open
  tooltips/cursor. Export WebP (+ PNG fallback) to `public/shots/`:
  `overview@2x`, `review@2x`, `clusters@2x`, `quality@2x`, `dataset@2x`.
- Wire into `Shot` with the captions from the **Copy** reference.
- Done when: all five screens render as real screenshots with captions; images lazy-load.

### T7 — Annotated callouts + one zoom crop
- Files: `src/case-study.tsx`, `src/styles.css`
- CSS overlay (leader lines + label chips) on the Ticket Review and AI Quality shots.
  Review labels: `AI confidence`, `Why AI classified it`, `Human decision`.
  Quality labels: `Edit rate`, `Failure modes`.
- One zoom-crop inset (e.g. confidence bar + review reasons).
- Done when: two shots carry readable callouts; layout holds at the responsive breakpoints.

### T8 — Light app strengthening (no redesign)
- Files: `src/App.tsx`, `src/styles.css`
- Raise the smallest type to an **11px floor** (badges, `.stat-delta`, `.ticket-id`,
  sidebar meta — anything at 9–10px). Critical for screenshot legibility.
- Ensure the app uses the single `--accent` token (from T1).
- Add a discreet `Case study ↗` link in the sidebar footer or topbar, and a one-line
  product descriptor on the Overview screen. (The case study already links to the demo —
  close the loop.)
- Done when: no UI text below 11px; accent is token-driven; both surfaces link to each other.

### T9 — Media-band layout + rhythm
- Files: `src/styles.css`
- Text rhythm stays `max-width: 1180px`; introduce a wider **media band** (~1320px or
  full-bleed with inner padding) for screenshots. Alternate text-left/media-right between
  sections. Hero shot bleeds slightly past the right edge.
- Verify the existing `max-width: 1100px` and `max-width: 700px` case-study breakpoints.
- Done when: screenshots are visibly wider than text; sections alternate; mobile holds.

### T10 — Verify
- `npm run verify`; manually open `/` and `/case-study.html`. Confirm both build and render.

---

# Reference

## Color tokens (single `:root`)

```css
/* text */
--ink:           #1b2529;   /* headings, primary text */
--ink-soft:      #51616a;   /* body, lead */
--ink-mute:      #82909a;   /* meta, captions, labels */

/* accent (slate-teal) — one accent for both surfaces */
--accent:        #3f6b75;   /* links, active states, icons (was --purple) */
--accent-strong: #2c545d;   /* hover / emphasis */
--accent-soft:   #e7f0f1;   /* tinted backgrounds */
--cta:           #20272a;   /* ink button (case study hero/CTA) */

/* secondary / data */
--sage:          #6f8f6a;
--data-grad:     linear-gradient(180deg, #3c6f74, #96b284); /* signature motif */

/* surfaces */
--paper:         #f6f6f1;   /* case study canvas (warm) */
--app-bg:        #f3f6f8;   /* app canvas (cooler, denser) */
--surface:       #ffffff;
--border:        #e3e3dc;   /* warm border (case study) */
--border-cool:   #dce3e7;   /* app border */

/* states (reuse existing values) */
--green: #2f7a62;  --amber: #9a652f;  --red: #aa5156;  --blue: #416f98;
```

Rules:
- One accent across both products. No second brand color.
- `--cta` (ink) only for the case study's primary buttons and hero. In the app, primary
  stays `--accent`.
- `--data-grad` is the visual "glue": a thin bar under section numbers / hero eyebrow, and
  it already lives inside the real charts on the screenshots. No glows.

## Typography

- **Display — Fraunces** (variable serif). Case study hero `h1` and section `h2` only.
  Weight 400–500, `letter-spacing: -0.015em`, optical sizing on large sizes.
- **UI / body — DM Sans** (already loaded). Everything else in the app and case-study body.
- Drop Manrope and Nunito Sans.

Case study scale:

| Role | Family | Size | LH | Notes |
|---|---|---|---|---|
| Hero h1 | Fraunces 500 | `clamp(44px, 6vw, 74px)` | 1.02 | tracking -0.015em |
| Section h2 | Fraunces 500 | `clamp(30px, 4vw, 48px)` | 1.08 | |
| Section number "01" | DM Sans 700 | 13px | — | accent, tabular |
| Kicker / eyebrow | DM Sans 700 | 12px | — | uppercase, tracking 0.12em, accent |
| Lead | DM Sans 400 | `clamp(18px,1.7vw,22px)` | 1.55 | `--ink-soft` |
| Body | DM Sans 400 | 16–17px | 1.7 | `--ink-soft` |
| Caption | DM Sans 500 | 13px | 1.45 | `--ink-mute` + accent chip |

App: floor of **11px** for the smallest UI text (see T8).

## Case study structure (5 sections)

1. **Hero** — kicker + serif h1 + lead + two CTAs (`Open live demo` ink, `View repository`
   outline) + an editorial stat line + the **Overview screenshot** (browser frame, slight
   right-bleed, ≤2° tilt or straight). Plus the case-meta bar under the nav.
2. **01 / The problem** — two short paragraphs + a cropped Inbox screenshot ("signal
   scattered across queues").
3. **02 / How it works** — the screenshot spine: four steps Ingest → Analyze → Review →
   Learn, each = short heading + one line + a real screenshot (Inbox → Review → Clusters →
   Insights), alternating sides. Absorbs the old "Solution/workflow" + "Highlights".
4. **03 / Human in the loop & AI quality** — the differentiator: Review money-shot with
   callouts + AI Quality shot. Copy on governance/safety (no auto-replies, editable,
   measurable).
5. **04 / Results + CTA** — outcomes as an editorial stat line, compact stack chips (old
   "Architecture"), `Live demo` / `Repository` links, final ink-CTA block.

Layout: alternate text/media sides; numbered headers with a hairline divider; generous
section spacing; sticky anchor mini-nav restyled as a thin progress nav.

## Copy

Hero:
- Kicker: `AI SUPPORT OPERATIONS · CASE STUDY`
- H1: `Support tickets, turned into decisions you can trust.`
  (alt: `AI reads the queue. People make the call.`)
- Lead: `Opsqora turns B2B support demand — classification, SLA risk, duplicate clusters
  and product signal — into reliable operational evidence, while keeping every
  customer-impacting decision with a human.`
- Stat line: `500 synthetic tickets · 14 product areas · 18 duplicate patterns · 6 AI
  quality signals`
- Meta bar: `Role — Product design + Frontend · Type — Phase 1 prototype · Stack — React ·
  Vite · Year — 2026`
- CTAs: `Open live demo →` / `View repository`

Section headers:
- `01 / The problem` — `A ticket holds more signal than a single request.`
- `02 / How it works` — `One evidence model, four moves: ingest, analyze, review, learn.`
- `03 / Human in the loop` — `AI organizes the evidence. People stay accountable.`
- `04 / Results` — `An end-to-end support intelligence loop — as a demo.`

Screenshot captions (label chip + one line):
- Overview: `OVERVIEW — Operational state at a glance: volume, SLA risk, review load and
  emerging clusters.`
- Inbox: `INBOX — 500 searchable tickets with separate operational and AI-review state.`
- Review: `TICKET REVIEW — AI analysis on the left, the human decision on the right.
  Replies stay drafts.`
- Clusters: `DUPLICATE CLUSTERS — Repeated pain points grouped as suggestions, not
  auto-incidents.`
- Quality: `AI QUALITY — Accuracy, edit rate, confidence and failure modes, made
  measurable.`
- Review callout chips: `AI confidence` · `Why AI classified it` · `Human decision`
- Quality callout chips: `Edit rate` · `Failure modes`

## Screenshot capture checklist

- `npm run dev`, viewport 1440×900, deviceScaleFactor 2, light theme.
- Apply the 11px floor (T8) before capturing.
- Real synthetic data; no open tooltips, no visible cursor.
- Screens: Overview, Ticket Review (open a ticket with AI analysis + human decision),
  Duplicate Clusters (drawer open), AI Quality, Dataset.
- Export WebP (+ PNG fallback) to `public/shots/`, named `*@2x`.
- Keep file sizes reasonable; lazy-load everything below the fold.
