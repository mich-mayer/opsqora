# Design Direction — Pattern Validation Workspace

Visual direction and implementation spec for the current Opsqora prototype.

## Status

- Phase 1, frontend-only.
- Active product: support feedback pattern validation.
- Active app screens: Pattern Feed, Pattern Review, Product Brief, AI Eval, and Design Notes.
- Case study is screenshot-led and uses current product screenshots only.

## Scope & Guardrails

Do:

- Keep the live prototype as a quiet enterprise SaaS / dense B2B product validation workspace.
- Use recurring feedback patterns as the unit of work.
- Use support evidence snippets only as evidence for patterns.
- Make mocked/illustrative status visible wherever AI outputs, costs, or outcomes appear.
- Keep the case study as a warm editorial product case study using real current screenshots.
- Use one token set, one accent, and one UI font across both surfaces.

Do not:

- Add backend, auth, persistence, production integrations, real AI calls, or real customer data.
- Add customer messaging, workflow write-back, autonomous approvals, or production claims.
- Add decorative visual noise, neon dashboards, or marketing-only surfaces.
- Reintroduce unmounted files, screenshots, or documentation.

## Direction Summary

Two surfaces, one DNA. The app is a dense slate-teal validation workspace. The case study is a warm "paper" editorial layout where current product screenshots are the hero and copy frames the AI PM story.

The product value is explicit: find recurring complaints, verify the evidence, turn confirmed patterns into product decisions. The model is assistive, the evidence is human-reviewed, readiness logic is visible, and the PM remains accountable for the final decision.

## Color Tokens

```css
--ink:           #1b2529;
--ink-soft:      #51616a;
--ink-mute:      #82909a;

--accent:        #3f6b75;
--accent-strong: #2c545d;
--accent-soft:   #e7f0f1;
--cta:           #20272a;

--sage:          #6f8f6a;
--data-grad:     linear-gradient(180deg, #3c6f74, #96b284);

--paper:         #f6f6f1;
--app-bg:        #f3f6f8;
--surface:       #ffffff;
--border:        #e3e3dc;
--border-cool:   #dce3e7;

--green: #2f7a62;
--amber: #9a652f;
--red: #aa5156;
--blue: #416f98;
```

Rules:

- One slate-teal accent across app and case study.
- `--cta` is reserved for case-study primary actions.
- `--data-grad` is a subtle connective motif, not a glow.

## Typography

- Display: Fraunces for case-study hero and section headings.
- UI/body: DM Sans everywhere else.
- App text should stay compact but readable; small labels must remain at or above 11px.

Case study scale:

| Role | Family | Size | LH | Notes |
|---|---|---|---|---|
| Hero h1 | Fraunces 500 | `clamp(44px, 6vw, 74px)` | 1.02 | tracking -0.015em |
| Section h2 | Fraunces 500 | `clamp(30px, 4vw, 48px)` | 1.08 | |
| Section number | DM Sans 700 | 13px | — | accent, tabular |
| Kicker | DM Sans 700 | 12px | — | uppercase, tracking 0.12em |
| Lead | DM Sans 400 | `clamp(18px,1.7vw,22px)` | 1.55 | `--ink-soft` |
| Body | DM Sans 400 | 16-17px | 1.7 | `--ink-soft` |
| Caption | DM Sans 500 | 13px | 1.45 | `--ink-mute` + accent chip |

## Active App Screens

1. Pattern Feed: recurring patterns, summary metrics, search, featured validated pattern.
2. Pattern Review: evidence snippets, four evidence decisions, pattern verdict, readiness logic, brief preview.
3. Product Brief: generated backlog candidate, readiness snapshot, mocked outcome tracking.
4. AI Eval: quality metrics, cost metrics, production thresholds/actions, charts.
5. Design Notes: positioning, product boundaries, differentiation, review cadence.

## Case Study Structure

1. Hero: current value proposition, CTAs, Pattern Feed screenshot.
2. Problem: why recurring feedback patterns need structured validation.
3. Workflow: suggest, validate, compute, decide.
4. AI Eval: trust and cost as product requirements.
5. Results: current outcomes, stack chips, CTA.

## Screenshot Inventory

Current screenshots live in `public/shots/`:

- `patterns@2x`
- `pattern-review@2x`
- `product-brief@2x`
- `ai-eval@2x`

Each screenshot has PNG and WebP variants exported at 2880x1800.
