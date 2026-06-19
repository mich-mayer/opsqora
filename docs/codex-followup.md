# Follow-up for Codex — pre-ship verification gaps

Context: Session 1 + Session 2 of `docs/design-direction.md` are implemented (tokens
consolidated, Fraunces+DM Sans, `Shot` component, 5-section case study, real 2880x1800
screenshots, CSS de-duplication, placeholder removed). A pre-ship review confirmed the
content/structural fixes are correct. Two items remain that need a real toolchain/browser
to close out — do these next.

## 1. Run the build gate (blocking)

`npm run verify` (`tsc --noEmit && vite build`) has not been run since the latest changes
landed. Run it now:

```
npm install   # if needed
npm run verify
```

Then manually open both entry points (`npm run preview` or serve `dist/`) and confirm:
- `/` (index.html) renders the app unchanged — same 9 screens, same behavior.
- `/case-study.html` builds and renders without console errors.

If `tsc` or the build fails, fix only what's needed to make it pass — do not refactor
beyond the error.

## 2. Visually verify the callout positions in `src/case-study.tsx`

File: `src/case-study.tsx`, lines ~46–67 (the `shots.review.callouts` and
`shots.quality.callouts` arrays).

Current values:

```ts
// review
{ label: 'AI confidence', x: '70%', y: '47%', side: 'right' },
{ label: 'Why AI classified it', x: '57%', y: '88%', side: 'left' },
{ label: 'Human decision', x: '82%', y: '50%', side: 'right' },

// quality
{ label: 'Edit rate', x: '75%', y: '44%', side: 'right' },
{ label: 'Failure modes', x: '84%', y: '82%', side: 'right' },
```

These x/y percentages are positioned over `public/shots/review@2x.png` and
`public/shots/quality@2x.png` (2880x1800 real captures) via `.case-callout` absolute
positioning in `src/styles.css` (search `.case-callout`).

Task: open the case study in a browser (or render the two screenshots and overlay the
percentages) and confirm each label's leader-line/dot actually points at the UI element it
names:
- Review screen: confidence indicator, the "why AI classified it" reasoning text, and the
  human approve/edit decision control.
- Quality screen: the edit-rate stat and the failure-modes breakdown.

If a callout is off-target, adjust only that callout's `x`/`y` values — don't change the
copy, the screenshots, or unrelated layout. Re-check at the 1100px and 700px breakpoints
(callouts are hidden below 700px by design — confirm that's still true and intentional,
not a leftover bug).

## Out of scope for this follow-up

Do not touch: token names, font stack, case-study section structure, screenshot capture
content, or app navigation/behavior. Those are already verified correct. This pass is
strictly: build gate + callout-position accuracy.
