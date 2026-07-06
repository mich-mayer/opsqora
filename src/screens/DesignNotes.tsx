import { Check, X } from 'lucide-react'
import { Chip, ScreenHead } from '../components/primitives'
import { MOCK_LABEL, MODEL_BOUNDARY } from '../mock'

const isList = [
  'A thin layer over foundation-model clustering and summarization',
  'A human evidence-validation workflow for recurring support patterns',
  'A visible readiness rule before a pattern becomes a PM decision',
  'An eval dashboard that connects quality and cost to validated value',
  'A frontend-only Phase 1 prototype with deterministic synthetic data',
]

const isNotList = [
  'No backend, auth, persistence, real customer data, or live model call',
  'No autonomous product decisions',
  'No production write-back workflow',
  'No claim that mocked outcomes are production evidence',
  'No AI self-approval for backlog candidates',
]

const boundarySteps = [
  ['AI suggests', 'Recurring patterns, evidence grouping, summaries, and confidence — nothing more.'],
  ['Humans validate', 'Reviewers mark evidence states and choose the pattern verdict.'],
  ['Rules compute, PMs decide', 'Transparent readiness logic gates the brief; the PM owns the backlog decision.'],
]

export function DesignNotes() {
  return <>
    <ScreenHead
      index="05"
      kicker="About / Design notes"
      title="Current product boundaries"
      lede="Opsqora is an AI-assisted validation layer for recurring support feedback patterns."
      aside={<Chip tone="line" square>{MOCK_LABEL}</Chip>}
    />

    <p className="notes-statement">
      Find recurring complaints, verify the evidence, turn confirmed patterns into
      product decisions — with the PM owning the final call.
    </p>

    <div className="notes-columns">
      <section>
        <header className="block-head">
          <h2>What Opsqora is</h2>
          <p>A focused product-feedback validation layer.</p>
        </header>
        <ul className="boundary-list">
          {isList.map(item => <li key={item}><i className="mark mark--ok" aria-hidden="true"><Check size={11} strokeWidth={3} /></i>{item}</li>)}
        </ul>
      </section>
      <section>
        <header className="block-head">
          <h2>What Opsqora is not</h2>
          <p>Phase 1 boundaries.</p>
        </header>
        <ul className="boundary-list">
          {isNotList.map(item => <li key={item}><i className="mark mark--bad" aria-hidden="true"><X size={11} strokeWidth={3} /></i>{item}</li>)}
        </ul>
      </section>
    </div>

    <section className="notes-boundary">
      <header className="block-head">
        <h2>Human-in-the-loop boundary</h2>
        <p>What the AI may and may not do.</p>
      </header>
      <div className="notes-boundary-steps">
        {boundarySteps.map(([title, copy], index) => <article key={title}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>)}
      </div>
      <p className="boundary-note"><span>Model boundary</span>{MODEL_BOUNDARY}</p>
    </section>

    <div className="notes-columns">
      <section>
        <header className="block-head">
          <h2>The moat question</h2>
          <p>The product value lives around the model.</p>
        </header>
        <p className="notes-copy">
          The differentiation is not the model alone. It is the workflow around the model:
          evidence states, human verdicts, the PM decision boundary, eval thresholds, and
          cost per validated pattern. Opsqora stays intentionally narrow — recurring
          support-feedback patterns, validated into product briefs.
        </p>
      </section>
      <section>
        <header className="block-head">
          <h2>Review cadence</h2>
          <p>Intentionally light.</p>
        </header>
        <p className="notes-copy">
          Weekly, biweekly, pre-sprint, or ad hoc — the core value is the validation
          workflow, not the calendar. Each pattern carries a cadence hint instead of
          forcing a schedule on the team.
        </p>
      </section>
    </div>
  </>
}
