import { ArrowRight } from 'lucide-react'
import { Chip, ScreenHead } from '../components/primitives'
import { MOCK_LABEL, MODEL_BOUNDARY, READINESS_RULE, getReadiness } from '../mock'
import type { EvidenceDecision, FeedbackPattern, PatternVerdict } from '../types'

function OutcomeBars({ before, after }: { before: number; after: number }) {
  const max = Math.max(before, after, 1)
  return <div className="outcome-bars" aria-label={`Mentions before: ${before}, after: ${after}`}>
    <div className="outcome-bar">
      <strong>{before}</strong>
      <i style={{ height: `${(before / max) * 100}%` }} />
      <span>Before</span>
    </div>
    <div className="outcome-bar outcome-bar--after">
      <strong>{after}</strong>
      <i style={{ height: `${(after / max) * 100}%` }} />
      <span>After</span>
    </div>
  </div>
}

export function ProductBriefScreen({
  pattern,
  decisions,
  verdict,
  generated,
  onGenerateBrief,
  onReviewPattern,
}: {
  pattern: FeedbackPattern
  decisions: Record<string, EvidenceDecision>
  verdict: PatternVerdict
  generated: boolean
  onGenerateBrief: () => void
  onReviewPattern: () => void
}) {
  const readiness = getReadiness(pattern, decisions, verdict)
  const blockedReasons = [
    !readiness.evidenceReady
      ? `${readiness.belongsCount}/${readiness.totalEvidence} snippets are marked Belongs; ${READINESS_RULE.belongsMinimum} are required`
      : null,
    !readiness.verdictReady ? `the human verdict is ${verdict}, not Valid` : null,
    !readiness.confidenceReady
      ? `confidence is ${Math.round(pattern.confidence * 100)}%, below the ${Math.round(READINESS_RULE.confidenceMinimum * 100)}% rule`
      : null,
  ].filter(Boolean)

  return <>
    <ScreenHead
      index="03"
      kicker="Backlog candidate"
      title="Product Brief"
      lede="A ready pattern becomes a PM-owned backlog candidate with evidence, scope, and mocked outcome tracking."
      aside={<Chip tone="line" square>{MOCK_LABEL}</Chip>}
    />

    <div className="brief-layout">
      {generated && readiness.ready
        ? <article className="brief-doc">
          <header className="brief-doc-head">
            <span>Product brief</span>
            <span>{pattern.id}</span>
            <span>{pattern.product_area}</span>
            <span>{pattern.brief.decision_owner}</span>
          </header>
          <h2>{pattern.short_name}</h2>
          <p className="brief-doc-problem">{pattern.brief.problem}</p>
          <dl className="brief-doc-sections">
            <div><dt>Evidence summary</dt><dd>{pattern.brief.evidence_summary}</dd></div>
            <div><dt>Affected area</dt><dd>{pattern.brief.affected_area}</dd></div>
            <div><dt>Suggested next step</dt><dd>{pattern.brief.suggested_next_step}</dd></div>
            <div><dt>PM owner</dt><dd>{pattern.brief.decision_owner}</dd></div>
            <div><dt>Risk to watch</dt><dd>{pattern.brief.risk_to_watch}</dd></div>
          </dl>
          <footer className="brief-doc-foot">
            <span>Model boundary</span>
            <p>{MODEL_BOUNDARY}</p>
          </footer>
        </article>
        : <div className="brief-blocked">
          <span className="mono-id">Blocked</span>
          <h2>Brief generation waits for the readiness rule.</h2>
          <p>
            Opsqora does not let the mock AI self-approve. This pattern stays blocked because
            {' '}{blockedReasons.join('; ')}.
          </p>
          <div className="brief-blocked-actions">
            <button className="btn btn--primary" onClick={onReviewPattern}>Review evidence <ArrowRight size={14} /></button>
            <button className="btn btn--ghost" disabled={!readiness.ready} onClick={onGenerateBrief}>Generate brief</button>
          </div>
        </div>}

      <aside className="brief-rail">
        <section className="rail-block">
          <header className="block-head">
            <h2>Readiness snapshot</h2>
            <p>Computed from visible rules.</p>
          </header>
          <dl className="brief-readiness">
            <div><dt>Evidence belongs</dt><dd>{readiness.belongsCount}/{readiness.totalEvidence}</dd></div>
            <div><dt>Verdict</dt><dd>{verdict}</dd></div>
            <div><dt>Confidence</dt><dd>{Math.round(pattern.confidence * 100)}%</dd></div>
          </dl>
          <Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Not ready'}</Chip>
        </section>

        <section className="rail-block">
          <header className="block-head">
            <h2>Mocked outcome</h2>
            <p>No live integration or causal claim.</p>
          </header>
          <Chip tone="warn" square>{pattern.outcome.label}</Chip>
          <h3 className="outcome-status">{pattern.outcome.status}</h3>
          <p className="outcome-note">{pattern.outcome.note}</p>
          <OutcomeBars before={pattern.outcome.before_mentions} after={pattern.outcome.after_mentions} />
          <p className="outcome-window">{pattern.outcome.measurement_window}</p>
        </section>

        <section className="rail-block">
          <header className="block-head">
            <h2>Decision posture</h2>
            <p>Portfolio signal.</p>
          </header>
          <ul className="posture-list">
            <li>Depth on one validated pattern makes the product decision easier to defend.</li>
            <li>Cost and quality are measured against validated outcomes, not model activity.</li>
          </ul>
        </section>
      </aside>
    </div>
  </>
}
