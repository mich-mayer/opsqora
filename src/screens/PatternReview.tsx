import { ArrowRight } from 'lucide-react'
import { Chip, RuleCheck, ScreenHead } from '../components/primitives'
import {
  READINESS_RULE,
  evidenceDecisions,
  getReadiness,
  patternVerdicts,
} from '../mock'
import type { EvidenceDecision, FeedbackPattern, PatternVerdict } from '../types'

const percent = (value: number) => `${Math.round(value * 100)}%`
const shortDate = (value: string) =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))

function decisionTone(decision: EvidenceDecision) {
  if (decision === 'Belongs') return 'ok' as const
  if (decision === 'Unsure') return 'warn' as const
  if (decision === 'Does not belong') return 'bad' as const
  return 'line' as const
}

export function PatternReview({
  patterns,
  pattern,
  decisions,
  verdict,
  generated,
  onSelectPattern,
  onDecisionChange,
  onVerdictChange,
  onGenerateBrief,
  onOpenBrief,
}: {
  patterns: FeedbackPattern[]
  pattern: FeedbackPattern
  decisions: Record<string, EvidenceDecision>
  verdict: PatternVerdict
  generated: boolean
  onSelectPattern: (id: string) => void
  onDecisionChange: (evidenceId: string, decision: EvidenceDecision) => void
  onVerdictChange: (verdict: PatternVerdict) => void
  onGenerateBrief: () => void
  onOpenBrief: () => void
}) {
  const readiness = getReadiness(pattern, decisions, verdict)

  return <>
    <ScreenHead
      index="02"
      kicker="Evidence validation"
      title="Review"
      lede="Mark the snippets that actually belong to this pattern."
    />

    <div className="review-switch" role="tablist" aria-label="Pattern under review">
      {patterns.map(option => <button
        key={option.id}
        role="tab"
        aria-selected={option.id === pattern.id}
        className={option.id === pattern.id ? 'is-active' : ''}
        onClick={() => onSelectPattern(option.id)}
      >
        {option.id}
        <span>{option.product_area}</span>
      </button>)}
    </div>

    <div className="review-grid">
      <div className="review-main">
        <section className="review-summary" aria-label="Pattern summary">
          <div className="review-summary-head">
            <span className="mono-id">{pattern.id}</span>
            <Chip tone="line">{pattern.product_area}</Chip>
            <Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Not ready'}</Chip>
          </div>
          <h2>{pattern.summary}</h2>
          <p>{pattern.ai_summary}</p>
          <dl className="review-figures">
            <div><dt>Mentions</dt><dd>{pattern.mention_count}</dd></div>
            <div><dt>Evidence</dt><dd>{readiness.belongsCount}/{readiness.totalEvidence} belongs</dd></div>
            <div><dt>Confidence</dt><dd>{percent(pattern.confidence)}</dd></div>
          </dl>
        </section>

        <section className="evidence-block" aria-label="Representative evidence">
          <header className="block-head">
            <h2>Evidence</h2>
            <p>Decide whether each quote belongs to the pattern.</p>
          </header>
          <div className="evidence-list">
            {pattern.evidence.map(evidence => <article className="evidence-card" key={evidence.id}>
              <header>
                <span className="evidence-source">
                  <strong>{evidence.source_system}</strong> · {evidence.source_id}
                  <em>{evidence.account_segment} · {shortDate(evidence.created_at)}</em>
                </span>
                <Chip tone={decisionTone(decisions[evidence.id])} square>{decisions[evidence.id]}</Chip>
              </header>
              <blockquote>{evidence.quote}</blockquote>
              <div className="segmented" role="group" aria-label={`Evidence decision for ${evidence.id}`}>
                {evidenceDecisions.map(decision => <button
                  key={decision}
                  className={decisions[evidence.id] === decision ? 'is-active' : ''}
                  onClick={() => onDecisionChange(evidence.id, decision)}
                >
                  {decision}
                </button>)}
              </div>
            </article>)}
          </div>
        </section>
      </div>

      <aside className="review-rail">
        <section className="rail-block">
          <header className="block-head">
            <h2>Readiness</h2>
            <p>Visible gate before a brief can be opened.</p>
          </header>
          <RuleCheck ok={readiness.evidenceReady} label={`${READINESS_RULE.belongsMinimum}+ snippets belong`} detail={`${readiness.belongsCount}/${readiness.totalEvidence} confirmed`} />
          <RuleCheck ok={readiness.verdictReady} label="Verdict is Valid" detail={verdict} />
          <RuleCheck ok={readiness.confidenceReady} label={`${percent(READINESS_RULE.confidenceMinimum)}+ confidence`} detail={`${percent(pattern.confidence)} current`} />
          <div className="rail-verdict-line">
            <Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready for PM decision' : 'Not ready yet'}</Chip>
          </div>
        </section>

        <section className="rail-block">
          <header className="block-head">
            <h2>Verdict</h2>
            <p>Reviewer-owned, not model-owned.</p>
          </header>
          <div className="verdict-list" role="radiogroup" aria-label="Pattern verdict">
            {patternVerdicts.map(option => <button
              key={option}
              role="radio"
              aria-checked={verdict === option}
              className={verdict === option ? 'is-active' : ''}
              onClick={() => onVerdictChange(option)}
            >
              <i aria-hidden="true" />
              {option}
            </button>)}
          </div>
          <button className="btn btn--primary btn--block" disabled={!readiness.ready} onClick={generated ? onOpenBrief : onGenerateBrief}>
            {generated ? 'Open product brief' : 'Generate product brief'} <ArrowRight size={14} />
          </button>
          {!readiness.ready && <p className="rail-blocked-note">Blocked until the transparent readiness rule passes.</p>}
        </section>
      </aside>
    </div>
  </>
}
