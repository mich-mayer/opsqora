# Opsqora — Design & Content System

**Status:** Normative. Single source of truth for UI, layout, components, copy, terminology, and case-study content.
**Date:** 2026-07-06.
**Basis:** rendered UI inspection (desktop 1280×800 and narrow widths), source code (`src/`), and `docs/design-direction.md`. Consolidates the P0/P1 recommendations from the earlier UX/UI, layout, and content audits, all of which are already implemented in the current codebase.

**Rule keywords.** MUST = mandatory project rule. SHOULD = default; deviate only for a stated reason. MAY = permitted option. MUST NOT = prohibited. Rules without a keyword are descriptive context.

**Decision statuses.** Where a rule required judgment, it is tagged:
- **CURRENT** — how the implementation behaves today (not automatically the standard).
- **ADOPT** — current behavior confirmed as the standard.
- **MODIFY** — standard differs from current behavior; migrate when touching the area.
- **DEPRECATE** — exists today, do not reuse; see §29.
- **UNRESOLVED** — no rule yet; see §30 for the temporary default.

---

## 1. System Purpose

This document answers: *exactly how should interface elements and texts in this project look, be positioned, be named, and behave?*

**Who uses it:** AI coding agents (Claude/Fable, Codex), human developers, and anyone doing design, code, or content review on Opsqora.

**Surfaces covered:**
1. **Product application** — `/` (`index.html` → `src/App.tsx`): Patterns, Review, Brief screens, plus the secondary AI Eval screen.
2. **Case study landing page** — `/case-study.html` (`src/case-study.tsx`), including its two live `<App embedded />` frames and the readiness playground.

**Not covered:** repo-internal docs (`docs/`, `AGENTS.md`, `CLAUDE.md`) except where they are reader-facing evidence (README, CASE_STUDY.md are public and follow the content rules in §§16–26); build tooling; future backend surfaces (out of Phase 1 scope).

**Source-of-truth order:** this file → `docs/design-direction.md` (visual direction detail) → the three audit files (rationale and history). If this file and an audit disagree, this file wins; if this file is silent, follow the closest approved pattern in §28.

---

## 2. Product Context

Confirmed by `docs/project-brief.md`, `docs/product-scope.md`, `docs/product-decisions.md`:

- **Category:** support feedback pattern validation tool for small B2B SaaS product teams. Phase 1 is a frontend-only React/Vite prototype on deterministic synthetic data; no backend, auth, persistence, or real AI calls.
- **Primary users:** (a) a reviewer/PM validating patterns in the product; (b) case-study readers — recruiters, hiring managers, Heads of Product, AI PMs.
- **Unit of work:** the *recurring feedback pattern*. Support feedback items appear only as evidence snippets attached to patterns.
- **Core workflow:** Patterns (queue) → Review (evidence decisions + verdict) → readiness rule → Brief (backlog candidate). AI Eval is a secondary, case-study-facing surface, deliberately outside primary navigation.
- **Role of AI:** assistive suggestion layer only — suggests patterns, attaches evidence, estimates confidence, drafts a brief template. Canonical boundary (`MODEL_BOUNDARY`, `src/mock/index.ts:19`): *"AI suggests patterns; the human validates evidence; transparent rules compute readiness; the PM decides. The AI never decides what enters the backlog and never self-approves."*
- **Role of human review:** the reviewer marks each evidence snippet, chooses the pattern verdict; a transparent rule (≥5 snippets marked Belongs, verdict = Valid, confidence ≥ 70%) computes readiness; the PM makes the backlog decision.
- **Honesty constraint (product-level):** anything that would require a backend or live data MUST be visibly labeled mocked/illustrative/synthetic.

---

## 3. System Principles

Derived from the product's actual behavior and the audits' confirmed findings — not imported from external systems.

**P1 — The queue and the evidence are the interface.**
*Why:* the reviewer's whole job is scanning patterns and judging snippets.
*Implications:* primary work content (table rows, evidence cards) gets viewport priority; context blocks stay compact; the first evidence card SHOULD be visible above the fold at 1280×800 (achieved by LC-01/03/04/11 fixes).
*Anti-pattern:* editorial headers, disclaimers, or summaries pushing operational content below the fold.

**P2 — Every AI output carries its reasoning and its status.**
*Why:* the product's thesis is calibrated trust in AI suggestions.
*Implications:* `ai_reason` sits inside each evidence card; `why_suggested` is adjacent (collapsed) to the pattern summary; confidence is always shown against the 70% rule; AI defaults are visually distinct from human confirmations.
*Anti-pattern:* a bare AI number or label with no rationale, threshold, or confirmation state.

**P3 — Gates are visible, adjacent to the work, and human-owned.**
*Why:* the readiness rule is the product's central mechanic.
*Implications:* the sticky Review rail (Readiness → Verdict → CTA) is the canonical gate location; blocked states explain themselves with the specific failing facts; the CTA lives next to the gate it depends on.
*Anti-pattern:* a disabled button with no visible reason; gate status duplicated in multiple zones of one viewport.

**P4 — Synthetic honesty is a feature, not a footnote.**
*Why:* the project's credibility (product and hiring signal alike) rests on never implying live systems.
*Implications:* "Synthetic data" topbar chip, "Mocked / Illustrative" labels, footer disclaimers, "Live · synthetic data" frame chips are load-bearing and MUST be preserved; new mocked surfaces get the same treatment.
*Anti-pattern:* removing a mock label to make a screen look more impressive.

**P5 — One accent, functional color only.**
*Why:* the Swiss/International system reads as an instrument, and status must never compete with decoration.
*Implications:* ultramarine `--accent` carries selection, links, key emphasis, and the AI-suggested state; `--ok/--warn/--bad` appear only as small squares, chips, meters, and rule checks; everything else is ink on paper.
*Anti-pattern:* a second accent color; accent used for status; status color as decoration.

**P6 — Status is text plus a square marker, never color alone.**
*Why:* WCAG 1.4.1 and fast scanning under bad conditions.
*Implications:* every chip/trend/rule-check pairs its color with a text label and a square/icon; the confidence meter below threshold adds the text "Below 70% rule".
*Anti-pattern:* encoding meaning in bar color or chip color only.

**P7 — Product voice and portfolio voice never mix on one surface.**
*Why:* the audiences differ, and the case study takes credit for the clean separation.
*Implications:* the product UI speaks in product voice (no "I", no self-praise adjectives); candidate framing lives only on the case study; the same fact may be phrased for each audience (§27).
*Anti-pattern:* "How I'd evaluate…" headings in product UI (fixed → "Production evaluation plan"); "transparent"/"concise" as self-descriptions in UI copy.

**P8 — Show it, don't grade it.**
*Why:* the strongest hiring signal is verifiable evidence — live embeds, a real `getReadiness()` playground, labeled estimates.
*Implications:* claims trace to visible artifacts; targets, estimates, and mocks are labeled at every reading depth; the case study never self-assesses ("sharper judgment") in headings.
*Anti-pattern:* an unanchored number, an unlabeled estimate, a self-grading adjective.

---

## 4. Benchmark Map

References inform rules; they are never templates. Deviation from a reference is not itself a defect.

| Area | Primary reference | Secondary reference | Project-specific rule |
|---|---|---|---|
| App layout | Atlassian Design System | — | Top bar + single scroll container + centered 1080px content (§6.1) |
| Navigation | Atlassian | — | Three-item workflow nav; Eval appears in nav only while open (§6.2) |
| Grid | IBM Carbon | — | One 1080px container; two-column main/rail grids (§5.4) |
| Spacing | Carbon | — | Fluid rem scale on one root clamp; relationship-based values (§5.3) |
| Data tables | Carbon | Atlassian | Full container width, one data point per column, shared column rhythm (§10) |
| Toolbars | Atlassian | — | Dataset-scope toolbar directly above its table (§6.4) |
| Actions | Atlassian | Microsoft (labels) | One ink primary per region; ghost secondary (§9) |
| Forms/controls | WCAG 2.2 AA | Carbon | Native inputs or full ARIA pattern; `aria-pressed` on segmented (§8, §15) |
| Dashboards | Carbon | Atlassian | KPI band → table → its chart → next table → its chart → rules (§6.6) |
| Typography | Project (`design-direction.md`) | Carbon (minimum sizes) | Inter/Inter Tight/IBM Plex Mono roles; fluid rem scale (§5.2) |
| Accessibility | WCAG 2.2 AA (hard constraint) | — | §15 |
| Product copy | GOV.UK/GDS principles | Microsoft Writing Style Guide | §§16–19 |
| Case study copy | GOV.UK/GDS + PM portfolio evidence standards | Institute of AI PM (domain-specific only) | §§22–26 |
| AI terminology | Project (`MODEL_BOUNDARY`) | Microsoft (AI wording) | §21 |
| Hiring signal | AI PM portfolio rubric | — | Evidence before persuasion; never invent evidence (§23) |

**Conflict resolution order.**
*Product:* real user task → safety/correctness → accessibility → existing validated behavior → project consistency → Atlassian → Carbon → visual preference.
*Product copy:* correct meaning → clear action → comprehension → project terminology → GDS → Microsoft → style preference.
*Case study:* factual integrity → ownership clarity → fast comprehension → evidence → product judgment → AI PM relevance → professional tone → persuasiveness.
Never choose "more impressive" over "more accurate".

---

## 5. Design Foundations

### 5.1 Color — ADOPT (post-contrast-fix token set)

All colors come from `:root` in `src/styles.css`. New UI MUST use these tokens; new hex literals MUST NOT be introduced without updating this section and `docs/design-direction.md`.

| Token | Value | Role | Allowed usage | Prohibited usage |
|---|---|---|---|---|
| `--bg` | `#fbfbfa` | Page ground | Body background | Surfaces, chips |
| `--surface` | `#ffffff` | Panels, tables, cards | Any raised content plane | — |
| `--wash` | `#f4f4f1` | Soft panel wash | Meter/bar tracks, quiet fills | Text backgrounds needing contrast |
| `--ink` | `#121216` | Primary text, black bands, primary buttons, 2px rules | Text, `btn--primary`, CTA band | Status meaning |
| `--ink-2` | `#52525c` | Secondary text | Body-secondary, definitions | — |
| `--ink-3` | `#6e6e78` | Muted text, mono labels (≈4.9:1 on white) | Kickers, table headers, metadata | Anything lighter — this is the muted floor (Source: UX audit OPS-001, WCAG AA) |
| `--line` | `#e5e5e1` | 1px hairlines | Dividers, borders, chip outlines | Text |
| `--rule` | `#121216` | 2px Swiss section rules | Section openers under heads | Generic borders |
| `--accent` | `#2236e8` | Single ultramarine accent | Selection, links, focus outline, key emphasis, AI-suggested chip, index numbers, primary series in charts | Status (ok/warn/bad meanings); decoration |
| `--accent-deep` | `#1626b4` | Accent-colored text on white | Accent text needing AA | — |
| `--accent-wash` | `#edeffd` | Accent background wash | `chip--accent` background | Large fills |
| `--ok` / `--ok-wash` | `#0e7a4e` / `#e9f4ee` | Positive status | Ready chips, Belongs, ok rule checks, falling-complaint trend | Decoration; success celebration |
| `--warn` / `--warn-wash` | `#8a520a` / `#f9f1e3` | Caution status | Needs validation, Unsure, Watchlist, warning toast, below-threshold meter | Anything lighter than `#8a520a` for warn text (contrast floor) |
| `--bad` / `--bad-wash` | `#c03540` / `#fbedee` | Negative status | Does not belong, Needs review, rising-complaint trend, Blocked (playground) | Generic emphasis |

Rules:
- Status colors appear only as small squares, chips, rule checks, meters, and trend indicators — never as large fills or section theming.
- Trend semantics: rising complaints = `--bad`, falling = `--ok`, flat = neutral. (Rising demand for attention is bad news, unlike generic "up = green" dashboards.)
- Color MUST NOT be the only carrier of meaning anywhere; see §11 for the per-concept fallback.
- A second accent color MUST NOT be added (Source: `design-direction.md`, project decision).
- Chart series colors: `--accent` for the primary series, `--ink` for the secondary; the 70% threshold gridline uses the rule style. `.costbar:first-child` accent is DEPRECATED (§29).

### 5.2 Typography — ADOPT (fluid rem system; resolves OPS-022 type scale)

**Scale engine (Option D, 2026-07-07).** Type, spacing, box sizes, and container widths are authored in `rem` on a single fluid root: `html { font-size: clamp(1rem, 0.925rem + 0.2vw, 1.125rem) }` in `src/styles.css`. The root scales 16px (viewport ≤600px) → 18px (≥1600px), so the whole system grows together on large displays and stays dense on small ones — the comfort of a 125% zoom, made the default without shrinking the working viewport. Authoring convention: **1rem == 16px**, so every px value listed in this doc renders identically at the 16px root (zero regression at the reference size). The clamp is rem-relative (not raw `vw`), so browser zoom and OS/browser font-size preferences keep working (WCAG 1.4.4 / 1.4.10). Hairlines, borders, ticks, and other strokes < 4px, plus SVG coordinate-space text (`.trendchart .axis`) and shadow/blur effects, stay in **px** for crispness.

- New type/spacing MUST be authored in rem; px is reserved for the sub-4px strokes and effects above.
- MUST NOT reintroduce fixed-px font sizes for document-flow text.
- Change the *whole* scale from the root clamp; change *one* role at its own declaration.

*Governance record (§34): Problem — fixed px didn't scale with viewport or user font settings; small mono labels strained readers and left wide screens as empty margin. Rationale — fluid rem on one root gives comfort at every width and honors user preferences, over global `zoom` (shrinks the viewport) or a flat +15% (breaks dense containers). Affected — `src/styles.css`, `src/case-study.tsx` (frame height → rem); both surfaces. Compatibility — pixel-identical at a 16px root; no screen violates the new rule. Migration — done in one pass (this change); px literals for document flow are now deprecated (§29).*

Families (tokens in `:root`): `--font-display` Inter Tight (500–700) for headlines, big numerals, pull quotes; `--font-ui` Inter (400–700) for body and controls; `--font-mono` IBM Plex Mono (400–600) for kickers, table headers, IDs, chips, axis labels. Fonts load from Google Fonts in both HTML heads — no CSS `@import`. Fallback stacks as defined in `styles.css`.

Normative roles below list the **reference px at a 16px root**; each is authored in `styles.css` as its rem equivalent (px ÷ 16) and scales with the fluid root:

| Role | Family/weight | Size | Notes |
|---|---|---|---|
| Case hero h1 | Inter Tight 600 | `clamp(40px, 6.8vw, 84px)` | lh 1.0, tracking −0.035em |
| Case section h2 | Inter Tight 600 | `clamp(28px, 3.8vw, 48px)` | tracking −0.03em |
| Boundary pull quote | Inter Tight 500 | `clamp(24px, 3.6vw, 42px)` | the `MODEL_BOUNDARY` statement |
| App screen h1 | Inter Tight 600 | 24px | compact head: kicker + h1 on one line (post-LC-04) |
| Block h2 (in-screen sections) | Inter Tight 600 | ~15–16px | "Evidence", "Readiness", "Quality metrics" |
| Stat value (KPI) | Inter Tight 600 | 30px | `tabular-nums` |
| Body | Inter 400 | 15px/1.5 base; 13–14px dense contexts | app dense, case editorial |
| Small body / definitions | Inter 400 | 12.5–13px | table definitions, helper text |
| Kicker / mono labels | IBM Plex Mono 500 | 11px, uppercase, tracking 0.08em | kickers, dt labels |
| Table headers | IBM Plex Mono 500 | 10.5–11px uppercase | see DEPRECATE note below |
| Chips | IBM Plex Mono 500 | 10.5px uppercase | see DEPRECATE note below |
| Buttons | Inter 600 | 13px | |

Rules:
- Numeric table cells and stats MUST use `font-variant-numeric: tabular-nums`.
- New text styles SHOULD reuse an existing role above rather than introduce a new size. Half-pixel sizes (12.5, 13.5, 14.5) MUST NOT be added beyond those already present.
- The 10.5px floor for load-bearing labels (table headers, statuses) is DEPRECATED direction: when reworking a component, raise its labels to ≥11.5px; 10.5px remains acceptable only for decorative kickers/chips (Source: UX audit OPS-021, Carbon 12px label minimum). Contrast at these sizes is already AA-fixed via `--ink-3`.

### 5.3 Spacing — ADOPT (fluid rem; relationship-based)

Spacing is authored in `rem` and scales with the fluid type root (§5.2), so padding and gaps grow with the system on large displays and stay dense on small ones. There is no *named* step scale (e.g. `--space-3`); values are chosen by relationship, not from a token table.

- **Main principle: spacing expresses relationship, not decoration.** Tighter = more related.
- Reference relationships (px at the 16px root; authored as rem ÷ 16): component-internal padding 10–16px; gaps between related elements 8–16px; block-to-block gaps 24–32px; screen sections 32–48px; case-study sections much larger (editorial scale).
- New UI MUST reuse a spacing value already used for the same *relationship* nearby, not invent a new one-off value, and MUST author it in rem (px only for the <4px hairline offsets in §5.2).
- A named 4/8 step scale (`--space-*`) is now an *optional* future tidy-up, not a blocker — fluid scaling and accessibility are already solved (OPS-022 resolved, §29/§30). Do not undertake it as a side effect of an unrelated change.

### 5.4 Grid and Width — ADOPT

- **App container:** one centered column, `max-width: 67.5rem` (= 1080px at the 16px root; grows to ~1215px at the 18px root on wide displays, so large screens are used rather than left as margin — the rem cap still bounds line length). Confirmed adequate for the current data density (Layout audit "Do Not Move"); revisit column count only if the dataset grows.
- **Tables (Patterns, metric tables):** full container width. Tables MUST NOT be constrained narrower than the container.
- **Two-column layouts:** Review `1fr / 300px` sticky rail; Brief `1fr / 280px` rail. Use main/rail only when the rail holds *status + decision + action* for the main content; a rail MUST NOT hold primary work content.
- **Case study:** wider hero/demo zones (up to 71.25rem ≈ 1140px at the 16px root for frames), prose measures ~560–860px. Long-form prose SHOULD stay ≤ ~720px measure. Demo-frame heights are set in rem in `case-study.tsx` (`height/16`) so frames scale with the root.
- **When to use what:** full width — data tables, KPI bands, charts; constrained — prose, briefs (brief doc ~712px); two columns — work + sticky gate/status; stacked — everything ≤920px.
- **Ticket-queue width rule (Patterns table):** full 1080px container; Pattern name column wide enough for two-line content (~365px); numeric columns right-aligned; the queue is never placed beside a sidebar or split with secondary panels.

### 5.5 Borders, Radius, Elevation — ADOPT

- 1px `--line` hairlines divide; 2px `--rule` (ink) opens every major section. This pair is the entire structural vocabulary.
- **No border radius anywhere.** Square corners on chips, buttons, cards, inputs, markers. Single sanctioned exception: the circular "O" inside `.brand-square` (favicon-matching wordmark).
- **No card shadows, gradients, or glows.** Single sanctioned elevation: the case-study demo frame (`0 36px 72px -48px rgba(...)`) — it depicts a window, which is a hierarchy reason. Inset 3px accent bar marks the selected table row.
- MUST NOT: nested cards (card inside card inside panel); decorative elevation; adding a border because grouping is unclear — fix grouping with spacing/rules instead.

### 5.6 Icons — ADOPT

- **Library:** `lucide-react` only. Sizes in use: 12–20px; match the adjacent text size.
- Icons are functional, not decorative: arrows for navigation/direction (`ArrowRight`, `ArrowUpRight`, `ArrowDownRight`), `Check`/`Minus` for rule checks, `Search` for search, `AlertTriangle`/`CheckCircle2` for toast severity, `GitBranch` for the repo link.
- Purely visual icons MUST have `aria-hidden="true"`; an icon-only control MUST have an accessible name (`aria-label`). Currently no icon-only buttons exist — prefer keeping it that way; icons accompany text.
- Square markers (7px `<i>` squares) — not icons — carry status in chips, bullets, legends, switches. Do not replace them with round dots or icon glyphs.
- MUST NOT: icon-heavy navigation; a second icon library; emoji as UI.

---

## 6. Layout System

### 6.1 App shell — ADOPT
**Purpose:** hold the workflow and keep honesty labeling always visible.
**Anatomy:** skip link (focus-visible) → topbar (56px: wordmark, primary nav, "Synthetic data" note) → `.shell-main` (the internal scroll container) → footer ("Frontend-only prototype — synthetic data, no real AI calls" + cross-link).
**Variations:** `shell--embedded` (inside case-study frames): 100% height, wordmark unlinked, footer links open the full app in a new tab, no smooth scroll.
**When not to use:** the case study has its own shell (§6.7); don't nest app shells.

### 6.2 Navigation — ADOPT
Three workflow items: **Patterns · Review · Brief** — in workflow order. Active item gets `aria-current="page"` and the active underline. **Eval** appears as a fourth item only while the Eval screen is open (it has no entry point in primary nav — a documented product decision, not a bug). MUST NOT add nav items for surfaces outside the primary workflow; MUST NOT reorder against the workflow.

### 6.3 Screen header (compact operational head) — ADOPT (post-LC-04)
**Anatomy:** mono index (`01`–`04`, accent) + uppercase kicker + h1 on one line; optional one-line lede; optional right-side aside (e.g., the `Mocked / Illustrative` chip on Eval); 2px rule below.
**Rules:** operational screens keep the compact single-line form; the lede is one sentence max and MUST NOT contain instructions that belong at the point of action (Source: LC-09 — instruction lives at the evidence block, not the lede). The full editorial head (stacked kicker/h1/lede at display size) is reserved for the case study.

### 6.4 Toolbars — ADOPT
Dataset-scope toolbar sits directly above its table: summary counts left ("**4 patterns** · 1 ready — evidence: 7 confirmed · 9 AI-suggested"), search right. Filters/search MUST sit at the dataset level, adjacent to the data they affect — never in the page header or a distant panel.

### 6.5 Main + sticky rail (Review, Brief) — ADOPT
The rail order mirrors the decision sequence: **Readiness (status) → Verdict (decision) → CTA (action)**, with the blocked note directly under the CTA. This is the product's strongest composition (Layout audit) — MUST NOT be broken up or reordered. Facts shown in the rail MUST NOT be duplicated in the adjacent main column (LC-03); the main column keeps only pattern-level facts the rail lacks (mentions, trend).
≤920px: the rail stacks below content and a **sticky mobile readiness bar** (status + counts + CTA) keeps the gate visible while evidence scrolls.

### 6.6 Dashboard composition (Eval) — ADOPT (post-LC-02/05)
Order: compact head + mock chip → KPI stat band → one-line mock disclaimer → Quality table → Quality trend chart → Cost table → Cost-by-task chart → "Production evaluation plan" (threshold→action rules) → footnote. Each chart sits immediately after its own table; interpretation/rules come after all data. Meta-text about data provenance MUST NOT sit above primary content (KPI band).

### 6.7 Case-study shell — ADOPT
Sticky top bar (wordmark + "Case study" sub, anchor nav, "Open live demo") → hero (kicker, display h1, lede, CTAs, spec-sheet meta `dl`) → live product frame → numbered sections 01–07 opened by 2px rules → black CTA band → footer. ≤920px the anchor nav becomes a horizontal scroll row (never `display:none` without replacement).

### 6.8 Panels / dialogs
No modals or dialogs exist and none are needed for current flows (UX audit). Feedback uses toasts (§8); blocking uses in-place blocked states. If a future flow truly needs a dialog, it must justify itself against the in-place-state pattern first (§30 governance).

---

## 7. Page Composition Rules

1. Order on operational screens MUST be: identity (compact head) → dataset tools → primary work content → secondary context. Core operational content MUST NOT sit below secondary analytics or meta-text.
2. Contextual actions MUST sit adjacent to their context: decision controls inside the evidence card; the brief CTA under the readiness gate; blocked-state actions inside the blocked explanation.
3. Filters and search MUST sit at the dataset they affect (§6.4).
4. Above the fold at 1280×800: Patterns shows the toolbar and multiple rows; Review shows the switcher, summary, and at least the first evidence card; Brief shows most of the document; Eval (embedded 800px frame) shows KPI band and the start of the first table. Changes that push these below the fold need a stated reason.
5. One instruction, one place: put task instructions at the point of action, not in the header lede (LC-09).
6. One fact, one zone per viewport: don't render the same status/count in two adjacent zones (LC-03, LC-07). Duplication is acceptable only across a scroll distance (e.g., mobile sticky bar repeating the rail).
7. First-visit context (e.g., "Why suggested") that occupies permanent space on a high-revisit screen SHOULD be a collapsed `<details>` disclosure in place.
8. Whitespace groups; borders separate; 2px rules open sections. Prefer spacing before adding a border.
9. Summary-before-detail: KPI bands and count summaries precede their tables; interpretation (rules, lessons) follows the data it interprets.

---

## 8. Component System

Canonical components (all in `src/components/primitives.tsx` unless noted). Search here before creating anything new.

**Wordmark** — accent square (white circle "O") + "Opsqora" in type; optional mono `sub`. The only brand asset; never an image logo.

**Kicker** — mono uppercase label, optional accent index number. Used in screen heads and case sections.

**ScreenHead** — §6.3. Props: `index`, `kicker`, `title`, optional `lede`, optional `aside`.

**Chip** — the universal status/label atom. Tones: `line` (neutral), `ink` (inverse), `accent` (AI-suggested state), `ok`, `warn`, `bad`. `square` adds the 7px status marker. Content: uppercase mono, ≤3 words. Use for statuses, areas, mock labels. MUST NOT: use tone for meanings other than §11's mapping; put sentences in chips.

**Stat** — KPI tile: mono label, 30px tabular value, optional note. Notes SHOULD state the target ("Target ≥ 70%") — mixed-genre notes are DEPRECATED (§29, OPS-028).

**RuleCheck** — readiness check row: check/minus icon square + bold condition + factual detail ("6 confirmed · 5 required"). When a threshold is unreachable with current data, the detail MUST say so ("0/3 marked · 5 required, need more evidence") — a count must never read as satisfied next to a failing marker (OPS-008).

**EmptyState** — `role="status"`, icon + bold headline + guidance including a concrete next query ("Try a product area such as Planning or Automation").

**Buttons** (`.btn`) — variants: `btn--primary` (ink fill — the region's single primary action), `btn--ghost` (outline secondary), `btn--accent` and `btn--inverse` (case-study CTA band only), `btn--block` (full-width in rails). Disabled buttons MUST be paired with a visible reason nearby (rail blocked note, blocked reasons list).

**Segmented control** (`.segmented`, in evidence cards) — one button per evidence decision, `aria-pressed` on each, active = ink fill. ≤620px: 2-column grid. This is a choice-commit control, not tabs.

**Verdict list** (`.verdict-list`) — native radio inputs styled as rows with square markers; `role="radiogroup"` labeled. Native inputs are the standard for single-choice (OPS-002); custom ARIA radios only with the full keyboard pattern.

**Review switcher** (`.review-switch`) — single-line record selector: pattern `short_name` + status marker ("Ready"/"Not ready"); `role="group"` + `aria-current`, NOT a tablist. Human-readable name is the primary label, never a bare ID (OPS-009).

**Feed table** (§10), **Metric table** (§10), **TrendIndicator** (icon + "Up/Flat/Down" text), **ConfidenceMeter** (bar + 70% tick + % text + "Below 70% rule" flag when applicable) — screen-local components in `src/screens/`.

**Toast** — two severities only: `success` (`CheckCircle2`, `role="status"`, 2.6s) and `warning` (`AlertTriangle`, `role="alert"`, 4s, warn styling). A refusal MUST NOT render with success iconography (OPS-004). No toast for information already visible in place.

**Evidence card** — anatomy in fixed order: source header (system · ID, segment · date) + state chips → quote (`blockquote`) → "AI reason" line → segmented decision control. Source → AI explanation → human action, in one frame; MUST NOT be reordered.

**DemoFrame** (case study) — window chrome (dots, URL, "Live · synthetic data" blinker) around a live `<App embedded />`; caption below. Heights sized so the frame's first screen shows real content (680px product / 800px eval). Screenshots of the product MUST NOT replace live embeds.

**ReadinessPlayground** (case study) — evidence toggles + verdict radios + live RuleChecks calling the real `getReadiness()`. Its vocabulary MUST match the product's (§20); "Excluded" is the sanctioned short form of "Does not belong" where space forbids the full label.

**Charts** — hand-rolled inline SVG only (no charting library): TrendChart (line + square markers, labeled axes, `role="img"` with a descriptive `aria-label`), CostBars (label + track + value). See §13.

Do not create: modals, dropdown menus, tooltips-as-required-info, pagination, tags-vs-badges distinctions, avatars — the product doesn't need them in Phase 1.

---

## 9. Action Hierarchy

| Level | Treatment | Placement | Per region | Wording |
|---|---|---|---|---|
| Primary | `btn--primary` (ink fill, arrow icon optional) | Next to the gate/context it completes | Exactly one | Verb + object: "Generate brief" |
| Secondary | `btn--ghost` | Beside or below primary | Few | Verb + object: "View repository" |
| Tertiary / navigational | Text link with `ArrowUpRight` | Footers, notes | — | "Read the case study" |
| Contextual (in-content) | Segmented buttons, radio rows, row-open button | Inside the card/row it affects | One control per decision | The decision values themselves |
| Destructive | — none exist. Do not invent one. | | | |
| Bulk | — none exist (no bulk selection in Phase 1). | | | |

Canonical actions and rules:
- **Generate brief / Open brief** — the workflow's primary CTA. Exactly these labels everywhere (rail, mobile bar, blocked state); disabled until the readiness rule passes, always with the visible reason. (PC-07: "Generate product brief" long form is retired.)
- **Review evidence** — primary action of the blocked Brief state (points back at the fix).
- **Back to review** — ghost, Brief rail, *generated state only*; MUST NOT appear in the blocked state where "Review evidence" already exists (LC-07).
- **Open row/pattern** — the pattern name is a real `<button>`; the row's hit-area extends to the chevron via CSS overlay; the `→` chevron is the affordance, not the control (OPS-003, LC-08).
- **Open live demo / View repository** — case-study CTAs, exactly these labels in hero, top bar, and CTA band.
- Approve/override/escalate/assign/export/refresh do not exist in this product; MUST NOT appear in UI or copy as if they did.

---

## 10. Data Table System

**Patterns queue** (`.feed-table`) — the product's core table:
- Full container width; row is one pattern; row click opens Review via the name button + stretched hit-area.
- Column order fixed: **Pattern (identity, 2-line: name + summary) → Area → Mentions → Confidence → Trend → Status → open-chevron**. Identity → context → numbers → urgency → state → affordance. Do not reorder.
- Numbers right-aligned, tabular; one data point per column — composite cells like "42 mentions · 86%" MUST NOT return (OPS-012).
- **Confidence** renders the meter with the 70% tick; below-threshold values add warn tone + "Below 70% rule" text (OPS-006, PC-04).
- **Trend** renders icon + text (Up/Flat/Down); up = `--bad` (rising complaints), down = `--ok` (OPS-014).
- **Status** renders the readiness chip: `Ready` (ok) / `Needs validation` (warn) — the only two queue states.
- Selected row: inset 3px accent bar.
- ≤620px: Area/Mentions/Confidence/Trend columns hide and a compact meta-line renders under the name ("42 mentions · 86% confidence · Planning"); chevron stays. Data needed for prioritization MUST NOT disappear entirely on mobile (OPS-016).
- Field priority: primary = name, status; secondary = mentions, confidence, trend; tertiary = area, summary line.
- No sorting, pagination, or bulk selection in Phase 1 (4 rows); do not add chrome for them.

**Metric tables** (Eval): columns Metric → Value → Plain-language definition → Status. Status cell = severity chip (§11) + the explanatory sentence as secondary text (OPS-011). Stacked tables of the same shape MUST share column widths so vertical scanning works across them (LC-06). Every metric MUST keep its plain-language definition — this column is a named feature.

**Case results table**: row-header label → big value → detail sentence; `<caption>` carries the estimate disclaimer; the section kicker also carries "(mocked)" so the qualifier exists at scan level (CS-04).

There are no assignee or timestamp columns in current tables; evidence metadata (segment · date) renders inside evidence cards in `Mon D` short-date form.

---

## 11. Status and Semantic System

One concept = one canonical vocabulary = one visual mapping. Do not merge concepts because their chips look similar.

| Concept | Canonical values | Visual encoding | Color role | Accessibility fallback |
|---|---|---|---|---|
| **Readiness** (pattern gate) | `Ready` / `Needs validation` (short form in tight switcher: `Not ready`) | Chip with square | ok / warn | Text label always present |
| **Evidence decision** (human) | `Belongs` / `Does not belong` / `Different problem` / `Unsure` | Segmented control; decision chip | ok / bad / line / warn | Full words, `aria-pressed` |
| **Confirmation state** (who decided) | `AI suggested` / `Confirmed` / `Pre-confirmed (demo)` (PAT-001 only) | Chip | accent / ok / ok | Text label; counters count only confirmed |
| **Pattern verdict** (human) | `Valid` / `Too broad` / `Mixed issues` / `Not actionable` / `Not a product issue` | Radio list | selection only (accent) | Native radios |
| **Trend** (complaint dynamics) | `Up` / `Flat` / `Down` | Arrow icon + text | bad / neutral / ok | Icon + text, never color alone |
| **Confidence** (AI, 0–100%) | % value vs 70% rule | Meter + tick + number; `Below 70% rule` flag | accent fill; warn below rule | Number + text flag |
| **Eval metric status** | `Healthy` / `Watchlist` / `Needs review` / `Context` | Chip + explanatory sentence | ok / warn / bad / line | Sentence restates the state |
| **Data provenance** | `Synthetic data` / `Mocked / Illustrative` / `Mocked outcome — no live integration` / `Live · synthetic data` | Chip / note / caption | line (neutral) | Always text |
| **Playground gate** | `Ready — brief can be generated` / `Blocked — brief stays locked` | Chip | ok / bad | Long-form labels are sanctioned here (explanatory surface) |

Rules:
- "Blocked" is legal only in the playground long-form and in prose about the gate; the product's queue/rail state vocabulary is exactly `Ready` / `Needs validation` (OPS-010). Accent MUST NOT encode a status.
- Qualifiers ("for PM decision") go in secondary text, never into the status label itself.
- Escalation and processing states do not exist in Phase 1; do not add vocabulary for them.

---

## 12. AI Interface Rules

The enforcement of `MODEL_BOUNDARY` in pixels:

1. **AI output is always attributed and bounded.** Every AI artifact (pattern suggestion, evidence attachment, confidence, brief draft) is visibly AI-originated until a human confirms it: `AI suggested` chip (accent) → `Confirmed` (ok) after a human decision. Counters ("7 confirmed") MUST count only human-confirmed items (OPS-007/030).
2. **Reasoning adjacent to output.** The user MUST see, in order: the suggestion → why (`AI reason` in each card; `Why suggested` disclosure on the pattern) → their own decision control. Rationale MUST NOT be hidden in another screen; a collapsed disclosure *in place* is acceptable for pattern-level rationale.
3. **Confidence is probabilistic and thresholded.** Confidence always renders with the 70% rule visible (meter tick, "Below 70% rule", rail check). MUST NOT present confidence as a verdict or hide values below the rule.
4. **The gate is inspectable.** Readiness is computed by visible rules with visible facts; the AI never satisfies its own gate — pre-confirmed demo data MUST be labeled (`Pre-confirmed (demo)`).
5. **Human responsibility is named.** "Verdict — Reviewer-owned, not model-owned." and "A PM decides" style attributions stay; overriding an AI default is just… making a decision — no special ceremony, no guilt copy.
6. **Source data vs AI output separated.** Customer quotes render as `blockquote` (source); AI text (`ai_summary`, `AI reason`) renders as labeled prose. Never blend them into one paragraph.
7. **Mock honesty.** Every AI-driven value carries provenance labeling (§11). MUST NOT imply a live model.
8. Hard prohibitions: anthropomorphizing ("the AI thinks/wants") without purpose; presenting probabilistic output as certainty; "AI" as a decorative prefix; hiding the human decision-maker; claiming capabilities the implementation lacks.

---

## 13. Data Visualization System

- Charts exist to *confirm the adjacent table* (trend of the same metrics), never to decorate. If a table row or stat answers the question, don't add a chart.
- **Allowed types:** line trend with square point markers (quality over time); horizontal bars (cost by task). New types need a §34 justification.
- Hand-rolled inline SVG or CSS bars only; no charting library (project decision, `design-direction.md`).
- Titles are block heads naming the content ("Quality trend", "Cost by AI task") plus a one-line provenance note ("Mocked weekly eval snapshots.").
- Legends: text + square swatch, mono style; thresholds drawn as a distinct rule line and named in the legend ("70% launch threshold").
- Color: series = accent + ink (§5.1); color encodes series identity, never position in a list.
- Axes MUST show units ("%" on the quality axis is currently missing — open item OPS-029, §29).
- Every SVG chart MUST have `role="img"` and an `aria-label` that states the actual data story.
- KPI (Stat) rules: value + target note; emphasis only via the existing `is-emphasis`/emphasis row mechanics aligned with severity.

---

## 14. Responsive System

Breakpoints are authored in `em` so reflow is zoom-aware (identical to px at the default font size, and unaffected by the fluid root, which media queries ignore): **1120px = 70em** (case-study adjustments), **1080px = 67.5em** (container edge), **920px = 57.5em** (rails stack; mobile readiness bar appears; case nav → scroll row), **760px = 47.5em** (case-study density), **620px = 38.75em** (feed table → meta-line rows; segmented → 2-col grid).

- **Desktop (>920)** is the primary surface for both pages. Two-column grids, sticky rail.
- **≤920:** single column; Review gains the sticky readiness bar (gate + CTA always visible); case-study anchor nav becomes a horizontally scrollable row.
- **≤620:** feed rows compress to name + meta-line + status + chevron; segmented decisions grid to 2×2; nothing needed for prioritization or decision-making may disappear.
- Mobile is a supported *viewing* mode, not a separately designed product; do not add mobile-only features or claim mobile-first anywhere.
- Embedded frames are their own mini-viewport: content must be usable at frame height without relying on nested scrolling to reach the point of the frame (LC-10).

---

## 15. Accessibility Baseline — WCAG 2.2 AA (hard constraint)

Project-specific application (not a WCAG rewrite):

- **Contrast:** text ≥4.5:1. Floors: muted text = `--ink-3` #6e6e78 (≈4.9:1); warn text = `--warn` #8a520a. Never lighten these tokens; verify any new pair instrumentally (OPS-001).
- **Keyboard:** everything operable; `:focus-visible` 2px accent outline is global — don't suppress it. Skip link before both shells.
- **Name/Role/Value:** segmented buttons carry `aria-pressed`; verdicts are native radios; the switcher is a `group` with `aria-current` (not tabs); table rows are not focusable — the inner button is (OPS-002/003).
- **Status announcements:** empty state `role="status"`; success toast `role="status"`/polite; warning toast `role="alert"`/assertive.
- **Color independence:** §11 fallback column is mandatory for any new state.
- **Labels:** search input has `aria-label`; each segmented group names its evidence ("Evidence decision for EV-00x"); SVG charts have descriptive `aria-label`s; decorative icons `aria-hidden`.
- **Target sizes:** controls ≥24×24 CSS px (WCAG 2.5.8); the stretched row hit-area pattern is the model.
- **Motion:** `prefers-reduced-motion` is currently NOT respected (smooth scroll, toast animation, "Live" blinker) — known gap, migration item (§29, OPS-024). New animation MUST be gated on it.
- **Errors/blocks:** a blocked action states the specific failing facts in text (blocked reasons list, rail note).

---

## 16. Content Principles

1. **Frontload the point.** The first clause carries the message ("Recurring complaints need proof before they become roadmap work."). *Bad:* burying the qualifier at the end. (Source: GDS; content audit.)
2. **Concrete over abstract.** "what does one validated pattern cost?" not "validated product signal cost" (PC-08). Numbers get units and denominators ("evidence: 7 confirmed" — PC-02).
3. **State facts, not self-praise.** The UI never grades itself: no "transparent", "concise", "powerful" (PC-06/PC-10). Quality is demonstrated by the visible artifact.
4. **Precision is credibility.** Technical statements must be exactly right — F1 is a "balance of precision + recall", not a sum (PC-12). One imprecise claim taxes every accurate one.
5. **Explain insider terms at first use, keep the term.** "a top-tier ('frontier') model", "high-confidence disagreement (reviewers rejecting evidence the model was sure about)" (PC-11, CS-15). Don't dumb down; gloss.
6. **Every claim carries its evidence status.** Mocked/estimated/synthetic labels are part of the sentence, not an afterthought (§23).
7. **Write for the working reader.** Task-oriented, scannable, no filler. Remove any word that serves the author instead of the reader.

Each principle above cites a real project example; when adding copy, imitate the cited good examples rather than inventing new styles.

---

## 17. Voice and Tone

**Product voice (ADOPT):** calm, direct, precise, operational, non-promotional. The product describes states and next actions; it never markets itself, never says "I", never celebrates. Example of the register: "Blocked until the readiness rule passes."

**Case study voice (ADOPT):** professional, concise, evidence-led, technically credible, first-person where ownership is claimed ("My role: I framed the problem…"), never salesy. Judgment is shown ("Dashboards without actions are decoration."), not claimed ("sharper judgment" is retired — CS-01).

Voice is stable; tone flexes by context:

| Context | Tone | Example / rule |
|---|---|---|
| Normal state | Neutral, factual | "4 patterns · 1 ready" |
| Success | Plain confirmation, no exclamation | "Product brief generated from validated evidence" |
| Warning / gate not met | Direct cause, no blame | "Readiness rule is not met yet" |
| Error | (No error states exist in the deterministic prototype — do not invent them) | |
| Blocked / rising trend (closest to SLA risk) | Specific failing facts | "…because confidence is 69%, below the 70% rule" |
| AI uncertainty | Numeric + rule reference | "69% · Below 70% rule" |
| Empty state | Helpful, concrete retry | "Try a product area such as Planning or Automation." |
| Case-study explanation | Confident, plain, evidence-linked | "This is the actual product embedded in the page, not a screenshot." |
| Limitation disclosure | Matter-of-fact, unhedged | "All values are estimated from the mocked prototype — not production outcomes." |

---

## 18. Product Copy System

| Category | Pattern | Case | Length | Examples (current, approved) | Anti-pattern |
|---|---|---|---|---|---|
| Navigation | One noun, workflow-named | Title case single word | 1 word | Patterns · Review · Brief · Eval | Clever names; icons-only |
| Page titles (h1) | The surface's noun | Title case | 1–2 words | "Patterns", "AI Eval" | Sentences as titles |
| Kickers | Domain descriptor | Uppercase mono | 2–4 words | "Evidence validation", "Model quality and cost" | Marketing taglines |
| Ledes | One task-framing sentence | Sentence case | ≤1 line | "Pick a recurring complaint and validate the evidence behind it." | Instructions that belong at the control (LC-09) |
| Section headings (h2) | Content noun | Sentence case | 1–3 words | "Evidence", "Readiness", "Quality trend" | Vague ("Overview") |
| Buttons | Verb + object | Sentence case | 2–3 words | "Generate brief", "Review evidence" | "Submit", "OK", "Click here" |
| Block helper text | One clarifying sentence under the h2 | Sentence case | ≤1 line | "Reviewer-owned, not model-owned." | Paragraphs of helper text |
| Statuses | Complete state words | See §11 | 1–3 words | "Needs validation", "Not ready" | Truncations ("Needs" — PC-03) |
| Warnings/toasts | State the cause | Sentence case, no period needed | 1 clause | "Readiness rule is not met yet" | Apologies, exclamation marks |
| Confirmations | What happened + provenance | Sentence case | 1 clause | "Product brief generated from validated evidence" | "Success!" |
| Empty states | What happened + concrete retry | Sentence case | 2 short sentences | "No pattern matches "X". Try a product area such as Planning or Automation." | Dead ends |
| Tooltips | Not used; information must be visible in place | — | — | — | Required info in tooltips |
| Table headers | One noun per data point | Uppercase mono | 1 word | Pattern · Area · Mentions · Confidence · Trend · Status | Composite headers ("Signal") |
| Filter/search | "Search patterns" placeholder + aria-label | Sentence case | 2 words | — | "Type here…" |
| Chart titles | Data noun + provenance note | Sentence case | 2–4 words | "Cost by AI task" / "Mocked daily spend split — $38 total." | Editorializing titles |
| Metadata | Labeled pairs (`dt/dd`) | — | — | Brief rail readiness `dl` | Unlabeled value strings (open item OPS-020, §29) |

Capitalization: sentence case everywhere except uppercase-mono kickers/chips/table headers (a typographic treatment, not a capitalization rule) and proper nouns. Terminal periods on sentences, none on labels/chips.

---

## 19. Action Language

| Action | Canonical wording | Prohibited alternatives | Scope |
|---|---|---|---|
| Generate the brief | **Generate brief** | "Generate product brief", "Create brief", "Make brief" | Rail, mobile bar, blocked state (PC-07) |
| Open the existing brief | **Open brief** | "View brief", "See brief" | Same locations, post-generation |
| Return to evidence work | **Review evidence** (blocked-state primary) / **Back to review** (generated-state rail ghost) | Mixing the two across states | Brief screen |
| Open a pattern | Pattern name as the button (row hit-area) | "Click here", "Details" | Patterns table |
| Decide on evidence | The four decision values verbatim | Abbreviations in the product ("Out") | Evidence cards |
| Set the verdict | The five verdict values verbatim | — | Review rail |
| Search | **Search patterns** | "Find", "Filter" (no filter control exists) | Feed toolbar |
| Open the demo | **Open live demo** | "Try it", "Launch" | Case study |
| Open the repo | **View repository** | "GitHub", "Source" | Case study |
| Cross-navigate | **Read the case study** / **Open the full app** | — | App footer (normal/embedded) |
| Skip navigation | **Skip to content** | — | Both shells |

Create/save/approve/override/escalate/assign/export/retry/cancel/delete have no product function in Phase 1 — MUST NOT appear as UI actions. If a phase adds one, define its canonical verb here first.

---

## 20. Terminology System

| Concept | Canonical term | Definition | Product UI term | Case study term | Avoid | Notes |
|---|---|---|---|---|---|---|
| Unit of work | pattern | A recurring support feedback theme suggested by AI | pattern / recurring complaint | recurring pattern | "ticket", "issue", "cluster" as synonyms | Feedback items exist only as evidence |
| Evidence item | evidence snippet | A support quote attached to a pattern | evidence (concept) · snippet (counts) · quote (the text) | snippet · evidence | "ticket" | The three-word contextual split is deliberate — keep it |
| Human evidence decision | evidence decision | One of the four values | Belongs / Does not belong / Different problem / Unsure | same; "Excluded" allowed as the playground's tight-space form of "Does not belong" | "Out" | Vocabulary is a designed ontology — do not extend casually |
| Human pattern decision | verdict | One of the five values | Valid / Too broad / Mixed issues / Not actionable / Not a product issue | human verdict / pattern verdict | "rating", "score" | |
| Gate | readiness rule | ≥5 Belongs + Valid verdict + ≥70% confidence | readiness / readiness rule | readiness rule / the gate | "workflow", "approval" | `READINESS_RULE` in code is the single source |
| Gate state | readiness state | Ready or not | Ready / Needs validation (/ Not ready short form) | Ready — brief can be generated / Blocked — brief stays locked | new synonyms | §11 |
| AI trust number | confidence | Model's 0–100% estimate a pattern is real | Confidence (+ % + rule) | confidence / mock confidence | "certainty", "accuracy" | Always shown against the 70% rule |
| Quality gate values | launch threshold | Quality metric minimums (70%/80%/60%) | launch threshold | launch threshold | "production threshold" | CS-10: two stable names… |
| Cost gate value | action threshold | The $12 cost trigger | action threshold | action threshold | "budget", "cap" | …this is the second |
| Output document | brief (product brief) | PM-owned backlog candidate | Brief / product brief (prose) | product brief / backlog candidate | "spec", "PRD" | Button label is "Generate brief" |
| Urgency signal | trend | Direction of mention volume | Up / Flat / Down | mention trend | "SLA risk" (no SLA exists) | Rising = bad |
| Volume | mentions | Count of feedback occurrences | mentions | mention volume / mentions | "tickets" | |
| Eval surface | AI Eval | Quality + cost governance screen | AI Eval (title) / Eval (nav) | AI eval | "analytics", "reports" | |
| Quality metrics | precision / recall / F1 / evidence precision | Standard IR metrics | with plain-language definitions | same, glossed in prose | undefined jargon | Definitions column is mandatory (§10) |
| Calibration metric | high-confidence disagreement | Reviewers rejecting evidence the model was sure about | metric row + definition | term + parenthetical gloss | dropping the gloss | The project's most original metric |
| Provenance | mocked / synthetic / illustrative / estimated | Not from live systems | Synthetic data · Mocked / Illustrative · Mocked outcome — no live integration | mocked · estimated · synthetic · Live · synthetic data | "demo data" (vague), unlabeled values | Load-bearing honesty vocabulary |
| AI boundary | human-in-the-loop | The MODEL_BOUNDARY sentence | Reviewer-owned, not model-owned | Human-in-the-loop boundary (+ blockquote) | "human oversight" (vaguer) | Quote MODEL_BOUNDARY verbatim, from `src/mock/index.ts` |
| Model tiers | frontier model (glossed) | Top-tier general model | "a top-tier ('frontier') model" | same gloss at first use | bare "frontier model" first use | PC-11 |
| Drift | — | Not measured or claimed anywhere | — | — | introducing it without implementation | Add only with real monitoring |

Audience adaptation is allowed (explanation depth, gloss expansion, sentence length) — mechanical word-for-word identity between surfaces is not required. Meaning identity is (§27).

---

## 21. AI Language System

- **"AI" is useful** when attributing origin or boundary: "AI suggested", "AI reason", "the AI never self-approves", "AI Eval". **"AI" is redundant** as a quality adjective or prefix on features that aren't model-driven. "AI-powered" MUST NOT appear (currently appears nowhere — protect this).
- **Suggestion, not prediction/decision:** the model *suggests* patterns and *attaches* evidence; humans *decide*, *confirm*, *validate*. Verbs that give the model agency over outcomes ("AI approved", "AI decided") MUST NOT appear.
- **Confidence** is always a number with a rule ("86%", "Below 70% rule") — never "the AI is confident that…".
- **Uncertainty** is stated numerically or by the named metric (high-confidence disagreement); no vague hedges ("may", "might" chains) and no false certainty.
- **Explanation** uses the labeled forms: "AI reason:", "Why suggested". These labels are the canonical explainability surface.
- **Automation:** Phase 1 automates nothing autonomously; wording MUST NOT imply automated actions ("automatically escalates…").
- **Human review** language names the owner: reviewer (evidence, verdict), PM (backlog decision).
- **Model:** "the model" / "mock AI" in product prose; "a top-tier ('frontier') model" / "a cheaper model" for the tier split.
- Prohibited: unsupported capability claims; "intelligent/smart" as adjectives; anthropomorphism ("the AI believes/wants/knows"); presenting the deterministic mock as a live model; any claim not traceable to `src/` behavior.

---

## 22. Case Study Content System

The page serves three reading depths; every depth must independently answer its questions.

**10-second scan** (kicker + H1 + lede + hero meta + first frame) must answer: What is this? Who is it for? What problem? What did the candidate do? Why AI-PM-relevant?
Mechanics: kicker names the genre ("AI product management — case study · 2026"); H1 states the outcome ("Recurring support feedback, turned into product decisions you can defend."); lede names user + workflow + AI stance + phase status; the Role meta line is decodable ("Product framing, AI boundary + eval design, frontend build"); the first frame proves the product exists.

**30-second scan** (+ section headings, kickers, scope figures, captions, results values) must answer: why AI, human role, evaluation approach, project status, results integrity.
Mechanics: headings are GDS-style full statements ("Recurring complaints need proof before they become roadmap work."); the boundary is a blockquote, not a paragraph; the Results kicker itself carries "(mocked)".

**Deep read** must answer: decisions, trade-offs, ownership split, limitations, next steps.

Element rules:
- **Hero:** kicker → display H1 (outcome, not product name) → lede (≤3 sentences, ends with phase honesty) → two CTAs (demo primary, repo ghost) → spec-sheet meta `dl` (Role / Type / Stack / Data / Year). Every meta value must be decodable without insider context.
- **Section heads:** accent index + kicker (topic) + h2 (a statement the section proves). A heading MUST inform a scanner who reads nothing else.
- **Summary blocks / scope figures:** each figure must be verifiable in the repo ("4 eval thresholds paired with actions" ↔ `evalRules.length === 4`) and meaningful (volume counts alone are weak — CS-13).
- **Metrics:** never render a number without its evidence status at the same visual level (§23).
- **Captions:** demo-frame captions state what's real and what to try ("…not a screenshot. Click through the patterns…").
- **Architecture/AI explanations:** name the genuine AI task and its limit in one breath ("Semantic clustering is a genuine AI task, but only an assistive one.").
- **Decision sections:** prefer "chose X over Y because Z" framing where the reasoning genuinely existed; do not retrofit reasoning.
- **Evaluation section:** metrics + thresholds + actions together; "Dashboards without actions are decoration." stays verbatim.
- **Limitations:** stated plainly in Scope & honesty (real vs deliberately mocked columns) and in next steps; never hedged away.
- **CTA band:** ink-black band, accent button, honest subline ("Everything is frontend-only, deterministic, synthetic, and visibly labeled…").

---

## 23. Case Study Evidence Rules

Every claim on the case study (and README/CASE_STUDY.md) carries one of these statuses, labeled as shown:

| Status | Definition | Required labeling |
|---|---|---|
| FACT | Verifiable in the repo/rendered app | None beyond the claim ("calls the same `getReadiness()` function") |
| MEASURED RESULT | Computed from an actual run | Name what was measured, by what, on what data. *None exist in Phase 1 — do not fabricate.* |
| TARGET | A goal, not an achievement | "Target ≥ 70%" phrasing; never bare |
| HYPOTHESIS | Believed, untested | "would", "next steps: test whether…" |
| SYNTHETIC DATA | Fictional deterministic dataset | "synthetic", "deterministic" |
| SIMULATED / ESTIMATED RESULT | Illustrative number | "estimated from the mocked prototype" at the same reading depth as the number |
| MOCK | Behavior imitating an unbuilt system | "Mocked / Illustrative", "Mocked outcome — no live integration" |
| PROTOTYPE / IMPLEMENTED | Actually built and interactive | "Real in this prototype" list |
| PLANNED | Future phase | "Future implementation plan", "would" |
| LIMITATION | Known gap | Stated in scope/next-steps, unhedged |

Hard constraints (non-negotiable):
- A TARGET MUST NOT read as an achieved result at any reading depth — the qualifier must exist at scan level (kicker/heading), not only in a caption (CS-04).
- SYNTHETIC/estimated evaluation MUST NOT read as production evidence.
- MOCK behavior MUST NOT read as live AI capability.
- A number with no visible basis MUST NOT appear (the unanchored "6–9 min" row was removed — precedent).
- Hiring signal MUST NOT be improved by inventing evidence. Ever.

---

## 24. Candidate Ownership Language

- The canonical ownership statement lives in the Problem section ("My role: I framed the problem, scoped the validation workflow, designed the AI-assistive boundary and eval strategy, and built the Phase 1 frontend with AI coding agents (Claude Code and Codex) under a documented collaboration workflow in the repo. All product decisions, scope boundaries, and the readiness rule are mine.") and in compressed form in the hero meta. Keep both in sync in *meaning*.
- Verb discipline: **decided/framed/scoped/designed** = candidate judgment; **built … with AI coding agents** = implementation with disclosed agent assistance; **the product/the rule does X** = system behavior; **mocked outcome** = illustrative product outcome. Do not swap categories.
- Agent collaboration MUST stay disclosed (it is visible in the public repo anyway; disclosure converts ambiguity into an AI-native-workflow signal).
- MUST NOT: claim sole implementation; attribute product decisions to agents; blur "designed" and "built"; add ownership claims not confirmed by the author.
- First person ("I", "my") is correct on the case study and in CASE_STUDY.md; it MUST NOT appear in product UI (§17, PC-01).

---

## 25. Professional Language Rules

**Prefer:** concrete nouns and verbs tied to artifacts — "evidence states, human verdicts, readiness rules, eval thresholds, cost per validated pattern"; named thresholds; verifiable statements ("frontend-only", "deterministic", "no real AI calls"); earned judgments ("Dashboards without actions are decoration.").

**Buzzword register.** Current status: none of *leverage, seamless, robust, cutting-edge, intelligent, actionable insights, AI-powered, end-to-end, scalable, production-ready, enterprise-grade* appear on any surface. This zero-count is a measured differentiator (content audit §8) — protect it. Rules rather than blanket bans:
- *scalable / does not scale*: justified only about a specific mechanism ("manual review does not scale" — kept, it's an argument, not a boast).
- *production-ready / enterprise-grade*: MUST NOT appear — Phase 1 explicitly is neither.
- *robust / seamless / cutting-edge / intelligent / leverage / actionable insights / AI-powered / end-to-end*: unsupported by any Phase 1 evidence; adding one requires the evidence first, and even then prefer the concrete fact over the adjective.
- Self-praise adjectives about our own output ("transparent", "concise", "honest" as feature labels) MUST NOT appear in product UI; on the case study they are acceptable only where the artifact proving them is shown at the same spot.

---

## 26. Scannability Rules

- Headings state the takeaway; a heading-only read of either surface must be coherent.
- Paragraphs: case study ≤4 sentences, one idea each; product UI avoids paragraphs except explanatory notes.
- Lists for parallel items (loop steps, real/mocked columns); tables only for enumerable label–value–detail facts.
- Callouts: the blockquote boundary and the black CTA band are the only two "shout" elements; don't add more per page.
- Key metrics render as Stat tiles or results-table values with their qualifier at the same level.
- Technical explanations follow "term (plain gloss)" on first use.
- **Heuristics** (working heuristics, not measured facts): the 10-second and 30-second scan tests in §22 are the review gates for any case-study change; for the product, the equivalent is "can a returning reviewer reach their first evidence decision without scrolling at 1280×800?".
- Key meaning MUST NOT depend on fully linear reading.

---

## 27. Cross-Surface Consistency

**MUST remain consistent (meaning-identical) between product and case study:**
- The meaning of pattern, evidence, decision, verdict, readiness, confidence, thresholds (§20).
- Factual claims (scope figures, stack, what is real vs mocked).
- The readiness rule itself — the playground calls the product's `getReadiness()`; any rule change updates both automatically via `src/mock/index.ts`. Keep it that way: shared logic and shared strings (like `MODEL_BOUNDARY`, `READINESS_RULE`) MUST stay single-sourced in `src/mock/`.
- Status vocabulary and its color mapping (§11).
- The AI boundary and honesty labels.

**MAY adapt by audience:**
- Explanation depth (case study glosses terms the product user knows).
- Long-form status phrasing in the playground ("Ready — brief can be generated").
- Sentence length and register (product terse, case study editorial).
- Space-constrained short forms explicitly sanctioned in §20 ("Not ready", "Excluded").

---

## 28. Approved Patterns

Working well; reuse as-is; do not "improve" for uniformity's sake.

| Pattern | Location | Why approved | Reuse guidance |
|---|---|---|---|
| Swiss token system (one accent, hairlines, square markers, no radius) | Both surfaces | Coherent, documented, audit-confirmed | Extend with tokens only |
| Sticky review rail: Readiness → Verdict → CTA | Review | Mirrors the decision sequence; strongest composition in the product | Model for any future gate+action surface |
| Evidence card anatomy (source → quote → AI reason → decision) | Review | Zero eye-travel from evidence to explanation to action | Template for any AI-suggestion review unit |
| RuleCheck transparency (condition + fact) | Review rail, playground | Makes the gate inspectable | Any future rule surface |
| Blocked Brief state (specific reasons + Review evidence primary + disabled ghost) | Brief | Explains itself, correct action pair | Template for gated outputs |
| Honesty labeling set | All surfaces | The project's core credibility feature | Mandatory on new mocked surfaces |
| Compact operational screen head | App screens | Returns viewport to the work | Any new operational screen |
| Dataset toolbar (counts + search at the table) | Patterns | Correct tool placement | Any new queue |
| Chart-after-its-table dashboard order | Eval | Adjacency of data and confirmation | Any new dashboard |
| Threshold→action rule blocks | Eval | "Metric + consequence" is the eval discipline story | Extend for new metrics |
| Plain-language definition column | Metric tables | Named accessibility-of-meaning feature | Any new metric table |
| Live embeds + readiness playground | Case study | Verifiable evidence beats screenshots | Never regress to screenshots |
| MODEL_BOUNDARY as single-sourced pull quote | `src/mock/index.ts` → both surfaces | One sentence, one source, quoted everywhere | Single-source any future canonical statement |
| Evidence-decision and verdict vocabularies | Product + playground | Precise, mutually exclusive, user-worded ontology | Extend only with the same discipline |
| GDS-style statement headings | Case study | Headings carry the argument | All new case sections |
| Skip link + focus-visible + native radios | Both surfaces | Accessibility baseline in practice | Default for new controls |

---

## 29. Deprecated Patterns

Exist in the codebase today; MUST NOT be reused in new work; migrate when touching the area. Documented, not auto-removed.

| Pattern | Current location | Reason | Replacement | Priority |
|---|---|---|---|---|
| Decision chip duplicating the segmented control's state | Evidence card header (`PatternReview.tsx:142`) | Two indicators of one state 60px apart (OPS-019 remnant) | Keep the confirmation chip; drop the decision chip or fold decision into it | Low |
| Unlabeled meta string in brief doc head + Owner duplicated in body | `ProductBriefScreen.tsx:45-49,57` | Unlabeled values; duplicate owner (OPS-020) | `dt/dd`-labeled meta; single owner mention | Low |
| 10.5px mono as load-bearing label size | chips, table headers (`styles.css`) | Below the 11.5–12px readable floor for essential labels (OPS-021) | ≥11.5px for headers/statuses; 10.5px decorative only | Medium |
| Fixed-px font-size/spacing literals for document flow | (migrated 2026-07-07) | Didn't scale with viewport or respect user font settings (OPS-022) | Fluid rem system on one root clamp (§5.2/§5.3) | Done — don't reintroduce fixed px for flow text |
| No URL state (screen/pattern only in React state) | `App.tsx` | Refresh resets; nothing is linkable (OPS-023) | Hash params (`#review/PAT-002`), no router library | Medium |
| Animations not gated on `prefers-reduced-motion` | smooth scroll, toast, Live blinker | WCAG motion guidance (OPS-024) | Add the media query; disable smooth-scroll and blink | Medium |
| Nested scroll inside demo frames | case-study frames | Scroll-trap trade-off (OPS-025) — mitigated by taller frames; accepted for live embeds | Keep frames tall enough to show content; add scrollability affordance if reworked | Low |
| Search without clear button / live result count announcement | Feed toolbar (OPS-026) | Minor usability + AT gap | Clear "×" + visually-hidden `aria-live` count | Low |
| First cost bar accent-colored by position | `.costbar:first-child` (`styles.css:1816`) | Color encodes list position, not meaning (OPS-027) | One ink color for all bars | Low |
| Mixed-genre Stat notes ("Key value metric" vs "Target ≥ 70%") | Eval stat band (OPS-028) | Target, definition, and label mixed in one slot | Uniform "Target ≥ X" + status square format | Low |
| Chart axis without units | TrendChart ticks (OPS-029) | 60–90 without "%" | Add "%" to ticks or axis label | Low |
| Editorial screen-head at display scale on operational screens | (removed; pattern retired) | Viewport tax (LC-04) | Compact head §6.3 | Done — don't reintroduce |
| Composite data columns ("42 mentions · 86%") | (removed) | One data point per column (OPS-012) | Separate columns | Done — don't reintroduce |
| Status vocabulary drift (Blocked-in-accent, "Needs") | (removed) | One state, one term, one color (OPS-010, PC-03) | §11 | Done — don't reintroduce |

---

## 30. Unresolved Decisions

Insufficient evidence for a rule — do not invent one; use the temporary default.

| Decision | Why unresolved | Evidence needed | Temporary default |
|---|---|---|---|
| ~~Final type/spacing token scale values~~ | RESOLVED 2026-07-07 — adopted the fluid rem system (Option D): one root clamp drives the scale, everything authored in rem (1rem=16px), hairlines stay px, breakpoints in em (§5.2/§5.3/§14); verified before/after at 375–1600px | — | A *named* 4/8 step scale stays optional (§5.3), no longer blocking |
| Readiness rule vs small evidence sets (PAT-002/003/004 can never reach 5 Belongs) | Product decision: parameterize the threshold, add mock evidence, or keep "insufficient evidence" as a designed state | Author's product intent for the demo narrative | Keep current honest copy ("…5 required, need more evidence"); don't silently change the rule or the data |
| URL/hash routing shape | Whether Eval should be linkable affects nav rules (§6.2) | Decision on deep-linking needs for the demo | No routing (current); if added, hash-based, no library |
| Eval "Watchlist"/status source of truth | Chip severity is derived from status-text substrings — fragile if mock data wording changes | Decision: move severity to an explicit field in `src/mock` | Keep wording of `status` strings stable when editing mock data |
| Case-study section numbering vs content growth | RESOLVED 2026-07-07 — the concrete proposal arrived: "Why AI" (§02) surfaces the AI-fluency beat §22's 30-second scan requires but no heading delivered | — | Sections are now 01–07. Further additions still must clear the bar of being a distinct scan-level beat, not content that fits an existing section |
| Mobile as a first-class surface | Currently a supported viewing mode only (§14) | Any real mobile-usage requirement | Don't design mobile-only features; keep the ≤920/≤620 behaviors working |

---

## 31. Agent Instructions

For Claude/Fable, Codex, and other coding agents. Also read `CLAUDE.md` / `AGENTS.md`; run `npm run verify` before finishing any code change.

**Before changing UI, an agent MUST:**
1. Read this file and identify the applicable section.
2. Inspect the existing canonical component (§8) and the closest approved pattern (§28).
3. Use tokens (§5.1) and existing type roles (§5.2); introduce no new hex values, font sizes, or one-off spacing.
4. Check §29 — do not copy a deprecated pattern even though it's in the codebase.

**Before adding or changing copy, an agent MUST:**
1. Check the terminology table (§20) and action language (§19).
2. Identify the audience: product user (§18) or case-study reader (§22).
3. Check the claim's evidence status (§23) and label it accordingly.
4. Keep product voice free of first person and self-praise (§17, §25).

**Before creating a new component, an agent MUST:**
1. Search `src/components/primitives.tsx` and `src/screens/` for an existing fit.
2. Justify why no existing component or variant works.
3. Follow tokens, states (§11), and accessibility baseline (§15); square corners, no shadows (§5.5).

**Before changing the case study, an agent MUST:**
1. Preserve factual integrity and evidence labels (§23) — including at scan level.
2. Preserve candidate ownership clarity (§24); never alter ownership claims without the author.
3. Keep shared logic/strings single-sourced from `src/mock/` (§27).
4. Run the 10s/30s scan tests (§22) on the changed section.

**Always:** keep data local, deterministic, synthetic; no backend/auth/persistence/real AI; preserve both entry pages; don't overwrite others' uncommitted work.

---

## 32. Design Review Checklist

- [ ] Layout: content order = head → tools → work → context (§7); nothing operational below secondary content.
- [ ] Hierarchy: one `btn--primary` per region; disabled actions have visible reasons (§9).
- [ ] Spacing: values reused from equivalent relationships; grouping by whitespace before borders (§5.3, §5.5).
- [ ] Density: first work item above the fold at 1280×800; embedded frames show content, not chrome (§7, §14).
- [ ] Action placement: contextual actions inside their context; filters at the dataset (§7).
- [ ] Tables: full width, one data point per column, right-aligned tabular numbers, shared column rhythm across stacked tables (§10).
- [ ] Statuses: canonical term + tone + square/icon + text; no color-only meaning; no vocabulary drift (§11).
- [ ] AI output: attribution chip, adjacent reasoning, confidence vs rule, mock labeling (§12).
- [ ] Accessibility: contrast ≥4.5:1 with the token floors; keyboard + focus-visible; correct roles/states; announcements (§15).
- [ ] Responsive: ≤920 rail stacking + sticky readiness bar intact; ≤620 no loss of prioritization data (§14).
- [ ] Foundations: tokens only, no radius, no new shadows, lucide only (§5).

## 33. Content Review Checklist

- [ ] Audience identified: product user vs case-study reader; no voice mixing (§17).
- [ ] Frontloaded: first clause carries the message; qualifiers at scan level (§16, §23).
- [ ] Actions: verb + object, canonical labels (§19); same action = same words.
- [ ] Terminology: matches §20; sanctioned short forms only.
- [ ] Jargon: insider terms glossed at first use; no internal codenames ("flagship") (§25).
- [ ] AI claims: suggestion verbs, numeric confidence, no anthropomorphism, no unsupported capabilities (§21).
- [ ] Evidence: every number labeled with its status; targets never read as results; mocks never read as live (§23).
- [ ] Ownership: candidate verbs accurate; agent collaboration disclosed; no invented ownership (§24).
- [ ] Self-praise: none in UI; case-study adjectives backed by a visible artifact (§25).
- [ ] Scannability: headings carry meaning alone; 10s/30s tests pass for case-study changes (§22, §26).

---

## 34. Change Governance

Any change to this system (new rule, changed rule, new component class, new terminology) MUST record:
1. **Problem** — the real user/reader need or defect (not "benchmark X does it differently").
2. **Rationale** — why this rule over alternatives, using the conflict hierarchy (§4).
3. **Affected surfaces** — product, case study, or both; list the files.
4. **Compatibility impact** — which existing screens/copy now violate the new rule.
5. **Migration consideration** — fix now, fix-when-touched (add to §29), or explicitly grandfather.

Update this file and, for visual-direction changes, `docs/design-direction.md` in the same change. Do not change the system merely to match Atlassian, Carbon, GDS, or any external benchmark — external systems inform, project needs decide. Keep both entry pages and `npm run verify` green.

---

## 35. Open Issues

Questions needing a human decision before rules can be written (distinct from §30's rule-level gaps):

| Issue | Decision type | Owner |
|---|---|---|
| Should PAT-002/003/004 get enough mock evidence to make the readiness rule reachable, or is "insufficient evidence" part of the demo story? | Product | Author |
| Should the Eval screen be deep-linkable (routing), given it's deliberately outside primary nav? | Product/design | Author |
| ~~Adopt the OPS-022 token scale migration as a dedicated pass (when)?~~ RESOLVED 2026-07-07 — done as the fluid rem system (Option D); see §5.2/§30 | Implementation | Author |
| Should metric severity move from status-text substring matching to an explicit data field? | Implementation | Author |
| README "Honest positioning" feature bullet — keep or reword (borderline self-grading)? | Content | Author |
| Any Phase 2 scope (backend, routing, persistence) — requires a documented new phase per `docs/product-scope.md` before any rule here extends to it. | Product | Author |

---

*This document defines standards; it changes no code. Sources: rendered UI + `src/` (current state), `docs/design-direction.md` (visual direction), the consolidated rationale from the earlier UX/UI, layout, and content audits, WCAG 2.2 AA (hard constraint), Atlassian / Carbon / GDS / Microsoft / AI PM portfolio rubric (references only).*
