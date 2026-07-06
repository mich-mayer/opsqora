import { ArrowRight } from 'lucide-react'
import { Chip, ScreenHead } from '../components/primitives'
import { READINESS_RULE, getReadiness } from '../mock'
import type { EvidenceConfirmations, EvidenceDecision, FeedbackPattern, PatternVerdict } from '../types'

export function ProductBriefScreen({
  pattern,
  decisions,
  confirmations,
  verdict,
  generated,
  onGenerateBrief,
  onReviewPattern,
}: {
  pattern: FeedbackPattern
  decisions: Record<string, EvidenceDecision>
  confirmations: EvidenceConfirmations
  verdict: PatternVerdict
  generated: boolean
  onGenerateBrief: () => void
  onReviewPattern: () => void
}) {
  const readiness = getReadiness(pattern, decisions, verdict, confirmations)
  const blockedReasons = [
    !readiness.evidenceReady
      ? `${readiness.belongsCount}/${readiness.totalEvidence} confirmed snippets are marked Belongs; ${READINESS_RULE.belongsMinimum} are required`
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
      title="Brief"
      lede="A concise PM-owned backlog candidate generated from validated evidence."
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
            <div><dt>Suggested next step</dt><dd>{pattern.brief.suggested_next_step}</dd></div>
            <div><dt>Risk to watch</dt><dd>{pattern.brief.risk_to_watch}</dd></div>
            <div><dt>Owner</dt><dd>{pattern.brief.decision_owner}</dd></div>
          </dl>
        </article>
        : <div className="brief-blocked">
          <span className="mono-id mono-id--warn">Needs validation</span>
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
            <h2>Status</h2>
            <p>Computed from review decisions.</p>
          </header>
          <dl className="brief-readiness">
            <div><dt>Evidence belongs</dt><dd>{readiness.belongsCount}/{readiness.totalEvidence}</dd></div>
            <div><dt>Verdict</dt><dd>{verdict}</dd></div>
            <div><dt>Confidence</dt><dd>{Math.round(pattern.confidence * 100)}%</dd></div>
          </dl>
          <Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Needs validation'}</Chip>
          <button className="btn btn--ghost btn--block" onClick={onReviewPattern}>Back to review <ArrowRight size={14} /></button>
        </section>
      </aside>
    </div>
  </>
}
