# Design Direction — Swiss International

Visual direction and implementation spec for the current Opsqora prototype.

## Status

- Phase 1, frontend-only.
- Active product: support feedback pattern validation.
- Active app workflow: Patterns, Review, Brief, and Eval.
- AI Eval is a permanent product nav tab; the case study demo and the live product stay in sync.
- Case study embeds the live product (the real `App` component), not screenshots.

## Scope & Guardrails

Do:

- Keep both surfaces in one light Swiss/International-Style system: white ground, near-black ink, hairline grid rules, one ultramarine accent.
- Use recurring feedback patterns as the unit of work; feedback items appear only as evidence.
- Make mocked/illustrative status visible wherever AI outputs, costs, or outcomes appear.
- Keep charts hand-rolled (inline SVG / CSS bars) in the same instrument-panel style; no charting library.
- Use square markers for status and bullets — no rounded pills, no border radius anywhere.
- Keep the case study demo frames live: they render `<App embedded />` and the readiness playground calls the real `getReadiness()`.

Do not:

- Add backend, auth, persistence, production integrations, real AI calls, or real customer data.
- Add decorative gradients, glows, drop shadows on cards, rounded corners, or icon-heavy navigation.
- Reintroduce screenshots of the product into the case study; the embeds replace them.
- Add a second accent color; status colors (ok/warn/bad) are functional, not decorative.

## Direction Summary

One typographic system, two temperatures. The app is a dense validation instrument: tables,
hairlines, mono labels, big tabular numerals. The case study is the same system at editorial
scale: oversized Inter Tight headlines, numbered sections opened by 2px rules, spec-sheet meta
tables, and the live product embedded in framed windows. The single ultramarine accent carries
selection, key metrics, links, and primary emphasis; everything else is ink on paper.

## Color Tokens

```css
--bg:          #fbfbfa;   /* page ground */
--surface:     #ffffff;   /* panels, tables, cards */
--wash:        #f4f4f1;   /* soft panel wash */

--ink:         #121216;   /* primary text, strong rules, black bands */
--ink-2:       #52525c;   /* secondary text */
--ink-3:       #6e6e78;   /* muted text, mono labels; AA contrast on white */

--line:        #e5e5e1;   /* hairlines */
--rule:        #121216;   /* 2px Swiss section rules */

--accent:      #2236e8;   /* single ultramarine accent */
--accent-deep: #1626b4;   /* accent text on white */
--accent-wash: #edeffd;

--ok:   #0e7a4e;  --ok-wash:   #e9f4ee;
--warn: #8a520a;  --warn-wash: #f9f1e3;
--bad:  #c03540;  --bad-wash:  #fbedee;
```

Rules:

- One ultramarine accent across app and case study; `--accent-deep` for accent-colored text.
- Status colors appear only as small squares, chips, and rule checks.
- Trend semantics: rising complaints = `--bad`, falling = `--ok`.

## Typography

**Fluid rem scale (Option D).** The whole system is authored in `rem` on one fluid root — `html { font-size: clamp(1rem, 0.925rem + 0.2vw, 1.125rem) }` — which scales 16px (viewport ≤600px) → 18px (≥1600px). Type, spacing, boxes, and the container grow together on large screens (the comfort of a 125% zoom, by default) and stay dense on small ones. The clamp is rem-relative, so browser zoom and OS/browser font-size preferences keep working; hairlines/borders under 4px, SVG axis text, and shadow/blur stay in px. Authoring convention: **1rem == 16px** — the px sizes in the table below are the reference render at the 16px root. Normative rules live in `DESIGN_CONTENT_SYSTEM.md` §5.2/§5.3.

- Display: Inter Tight (500–700) for headlines, big numerals, and pull quotes.
- UI/body: Inter (400–700).
- Data/labels: IBM Plex Mono (400–600) for kickers, table headers, IDs, chips, axis labels.
- Fonts load from Google Fonts in both HTML heads; no CSS `@import`.

| Role | Family | Size | Notes |
|---|---|---|---|
| Case hero h1 | Inter Tight 600 | `clamp(36px, 4.6vw, 64px)` | lh 1.0, tracking -0.035em |
| Case section h2 | Inter Tight 600 | `clamp(28px, 3.8vw, 48px)` | tracking -0.03em |
| Boundary pull quote | Inter Tight 500 | `clamp(24px, 3.6vw, 42px)` | the MODEL_BOUNDARY statement |
| App screen h1 | Inter Tight 600 | `clamp(28px, 3.4vw, 40px)` | under a 2px rule |
| Stat value | Inter Tight 600 | 30px | tabular numerals |
| Body | Inter 400 | 13–16px | app dense, case editorial |
| Kicker / labels | IBM Plex Mono 500 | 11–11.5px | uppercase, tracking 0.07–0.08em; load-bearing labels use 11.5px |

## Recurring Motifs

- 2px `--rule` lines open every major section; 1px `--line` hairlines divide everything else.
- Mono index numbers (`01`–`06`) in accent before kickers, in nav, and on case sections.
- Square markers everywhere: chips, bullets, legends, rule checks, evidence toggles.
- Confidence meters carry an accent tick at the 70% readiness threshold.
- The final case-study CTA is an ink-black band with an accent button.

## App Shell

- Top bar (56px): typographic wordmark (accent square with white "O" + "Opsqora"), three-item
  workflow nav, and a synthetic-data note.
- The shell fills the viewport; `.shell-main` is the internal scroll container.
- Keyboard users get a focus-visible skip link before the app shell and case study shell.
- `App` accepts `embedded` (renders inside case-study demo frames, height 100%) and
  `initialPage` (which screen opens first).
- The main app keeps page/pattern navigation in hash URLs such as `#review/PAT-002`;
  embedded case-study frames keep their navigation local to the frame.
- Smooth scrolling, toast motion, and the live-frame blinker respect `prefers-reduced-motion`.

## Active App Screens

1. Patterns: concise searchable pattern list with area, signal strength, and readiness state.
2. Review: pattern switcher, compact summary, evidence cards with segmented decisions, and
   a sticky rail for readiness, verdict, and brief action. On mobile, a compact sticky readiness
   summary keeps the gate and brief action visible while evidence cards scroll.
3. Brief: concise PM-owned document plus a small readiness status rail.
4. AI Eval: permanent nav tab in the product, same screen the case study embeds.

## Case Study Structure

The page follows the canonical 7-part AI PM case framework, shared with the sibling
FlatFeed landing (same section names, same order, same 7-item nav):

1. Sticky top bar: wordmark, 7-item anchor nav (Problem · Why AI · Role · Approach ·
   Built · Results · Learned), "Open live demo".
2. Hero: mono kicker, first-person display headline ("I built Opsqora to…"), lede ending
   in phase honesty, CTAs, spec-sheet meta table (role/domain/type/data/year).
3. Live product demo: `<App embedded />` in a framed window ("Live · synthetic data");
   the chrome shows the real published URL, never an unowned domain.
4. 01 The problem: prose + scope figures strip.
5. 02 Why AI?: semantic clustering rationale + the assistive stance (suggests, never
   decides, never self-approves).
6. 03 My role: candidate judgment verbs + disclosed agent-assisted implementation.
7. 04 The approach: data strategy → model strategy (production tier split) → eval
   strategy (thresholds paired with actions) → four loop steps + interactive readiness
   playground (real `getReadiness()` on real PAT-001 data).
8. 05 What I built: four-screens prose + `<App embedded initialPage="eval" />` + real vs
   deliberately mocked columns + stack chips.
9. Unnumbered: Human-in-the-loop boundary — MODEL_BOUNDARY as a display pull quote,
   deliberately outside the 7-part numbering.
10. 06 Results: two-group spec table — "Measured in this prototype" (FACT rows) and
    "Launch gates — designed, not yet measured" (TARGET rows); illustrative values live
    only inside the eval dashboard embed.
11. 07 What I learned: core lesson, what-I'd-do-differently, next steps + 3-up points.
12. Black CTA band → sibling case-study cross-link (FlatFeed) → footer.

## Assets

- `public/favicon.svg`: accent square with a white circle "O". The only brand asset;
  the wordmark is set in type, not an image.
