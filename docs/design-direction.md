# Design Direction — Swiss International

Visual direction and implementation spec for the current Opsqora prototype.

## Status

- Phase 1, frontend-only.
- Active product: support feedback pattern validation.
- Active app screens: Pattern Feed, Pattern Review, Product Brief, AI Eval, and Design Notes.
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
--ink-3:       #8a8a93;   /* muted text, mono labels */

--line:        #e5e5e1;   /* hairlines */
--rule:        #121216;   /* 2px Swiss section rules */

--accent:      #2236e8;   /* single ultramarine accent */
--accent-deep: #1626b4;   /* accent text on white */
--accent-wash: #edeffd;

--ok:   #0e7a4e;  --ok-wash:   #e9f4ee;
--warn: #a2600c;  --warn-wash: #f9f1e3;
--bad:  #c03540;  --bad-wash:  #fbedee;
```

Rules:

- One ultramarine accent across app and case study; `--accent-deep` for accent-colored text.
- Status colors appear only as small squares, chips, and rule checks.
- Trend semantics: rising complaints = `--bad`, falling = `--ok`.

## Typography

- Display: Inter Tight (500–700) for headlines, big numerals, and pull quotes.
- UI/body: Inter (400–700).
- Data/labels: IBM Plex Mono (400–600) for kickers, table headers, IDs, chips, axis labels.
- Fonts load from Google Fonts in both HTML heads; no CSS `@import`.

| Role | Family | Size | Notes |
|---|---|---|---|
| Case hero h1 | Inter Tight 600 | `clamp(40px, 6.8vw, 84px)` | lh 1.0, tracking -0.035em |
| Case section h2 | Inter Tight 600 | `clamp(28px, 3.8vw, 48px)` | tracking -0.03em |
| Boundary pull quote | Inter Tight 500 | `clamp(24px, 3.6vw, 42px)` | the MODEL_BOUNDARY statement |
| App screen h1 | Inter Tight 600 | `clamp(28px, 3.4vw, 40px)` | under a 2px rule |
| Stat value | Inter Tight 600 | 30px | tabular numerals |
| Body | Inter 400 | 13–16px | app dense, case editorial |
| Kicker / labels | IBM Plex Mono 500 | 10.5–11px | uppercase, tracking 0.07–0.08em |

## Recurring Motifs

- 2px `--rule` lines open every major section; 1px `--line` hairlines divide everything else.
- Mono index numbers (`01`–`06`) in accent before kickers, in nav, and on case sections.
- Square markers everywhere: chips, bullets, legends, rule checks, evidence toggles.
- Confidence meters carry an accent tick at the 70% readiness threshold.
- The final case-study CTA is an ink-black band with an accent button.

## App Shell

- Top bar (58px): typographic wordmark (accent square with white "O" + "Opsqora"), horizontal nav with mono
  indices and an underline active state, case-study link, mock reviewer block.
- The shell fills the viewport; `.shell-main` is the internal scroll container.
- `App` accepts `embedded` (renders inside case-study demo frames, height 100%) and
  `initialPage` (which screen opens first).

## Active App Screens

1. Pattern Feed: stat band, positioning line + underline search, patterns as a full table
   (ID, pattern, area, mentions, trend, confidence meter, status), featured pattern band.
2. Pattern Review: pattern switcher tabs, summary with figures strip and model boundary,
   evidence cards with segmented decisions, sticky rail (readiness logic, verdict radio list,
   brief preview).
3. Product Brief: the brief as a printed document (ink border, mono header row, dt/dd
   sections), rail with readiness snapshot, mocked outcome bars, decision posture.
4. AI Eval: disclaimer note, headline stat band, quality/cost definition tables, IF/THEN
   production rules, hand-rolled SVG trend chart + cost bars.
5. Design Notes: display-size positioning statement, is/is-not lists, HITL boundary steps,
   moat and cadence columns.

## Case Study Structure

1. Sticky top bar: wordmark, anchor nav, "Open live demo".
2. Hero: mono kicker, display headline, lede, CTAs, spec-sheet meta table (role/type/stack/data/year).
3. Live product demo: `<App embedded />` in a framed window ("Live · synthetic data").
4. 01 Problem: prose + scope figures strip.
5. 02 Validation loop: four numbered steps + interactive readiness playground (real
   `getReadiness()` on real PAT-001 data).
6. 03 Human-in-the-loop boundary: MODEL_BOUNDARY as a display pull quote.
7. 04 AI eval: prose + `<App embedded initialPage="eval" />`.
8. 05 Scope and honesty: real vs deliberately mocked columns + stack chips.
9. 06 Results: spec table of estimated metrics + core lesson.
10. Black CTA band + footer.

## Assets

- `public/favicon.svg`: accent square with a white circle "O". The only brand asset;
  the wordmark is set in type, not an image.
