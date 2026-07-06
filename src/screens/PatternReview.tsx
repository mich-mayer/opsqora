import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from 'lucide-react'
import { Chip, RuleCheck, ScreenHead } from '../components/primitives'
import {
  READINESS_RULE,
  evidenceDecisions,
  getReadiness,
  patternVerdicts,
} from '../mock'
import type { EvidenceConfirmations, EvidenceDecision, FeedbackPattern, PatternTrend, PatternVerdict } from '../types'

const percent = (value: number) => `${Math.round(value * 100)}%`
const shortDate = (value: string) =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
const trendLabel: Record<PatternTrend, string> = {
  up: 'Up',
  flat: 'Flat',
  down: 'Down',
}

function decisionTone(decision: EvidenceDecision) {
  if (decision === 'Belongs') return 'ok' as const
  if (decision === 'Unsure') return 'warn' as const
  if (decision === 'Does not belong') return 'bad' as const
  return 'line' as const
}

function TrendIndicator({ trend }: { trend: PatternTrend }) {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus
  return <span className={`trend trend--${trend}`}>
    <Icon size={13} aria-hidden="true" />
    {trendLabel[trend]}
  </span>
}

function evidenceRuleDetail(belongsCount: number, totalEvidence: number) {
  if (totalEvidence < READINESS_RULE.belongsMinimum) {
    return `${belongsCount}/${totalEvidence} marked · ${READINESS_RULE.belongsMinimum} required, need more evidence`
  }

  return `${belongsCount} confirmed · ${READINESS_RULE.belongsMinimum} required`
}

export function PatternReview({
  patterns,
  pattern,
  decisions,
  confirmations,
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
  confirmations: EvidenceConfirmations
  verdict: PatternVerdict
  generated: boolean
  onSelectPattern: (id: string) => void
  onDecisionChange: (evidenceId: string, decision: EvidenceDecision) => void
  onVerdictChange: (verdict: PatternVerdict) => void
  onGenerateBrief: () => void
  onOpenBrief: () => void
}) {
  const readiness = getReadiness(pattern, decisions, verdict, confirmations)

  return <>
    <ScreenHead
      index="02"
      kicker="Evidence validation"
      title="Review"
      lede="Mark the snippets that actually belong to this pattern."
    />

    <div className="review-switch" role="group" aria-label="Pattern under review">
      {patterns.map(option => <button
        key={option.id}
        aria-current={option.id === pattern.id ? 'true' : undefined}
        className={option.id === pattern.id ? 'is-active' : ''}
        onClick={() => onSelectPattern(option.id)}
      >
        {option.short_name}
        <span>{option.id} · {option.product_area}</span>
      </button>)}
    </div>

    <div className="mobile-readiness-bar" aria-label="Readiness summary">
      <div>
        <Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Needs validation'}</Chip>
        <span>{readiness.belongsCount} confirmed · {READINESS_RULE.belongsMinimum} needed · {verdict} · {percent(pattern.confidence)}</span>
      </div>
      <button className="btn btn--primary" disabled={!readiness.ready} onClick={generated ? onOpenBrief : onGenerateBrief}>
        {generated ? 'Open brief' : 'Generate brief'} <ArrowRight size={14} />
      </button>
    </div>

    <div className="review-grid">
      <div className="review-main">
        <section className="review-summary" aria-label="Pattern summary">
          <div className="review-summary-head">
            <span className="mono-id">{pattern.id}</span>
            <Chip tone="line">{pattern.product_area}</Chip>
            <Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Needs validation'}</Chip>
          </div>
          <h2>{pattern.summary}</h2>
          <p>{pattern.ai_summary}</p>
          <div className="why-suggested" aria-label="Why AI suggested this pattern">
            <h3>Why suggested</h3>
            <ul>
              {pattern.why_suggested.map(reason => <li key={reason}>{reason}</li>)}
            </ul>
          </div>
          <dl className="review-figures">
            <div><dt>Mentions</dt><dd>{pattern.mention_count}</dd></div>
            <div><dt>Evidence</dt><dd>{readiness.belongsCount}/{READINESS_RULE.belongsMinimum} confirmed</dd></div>
            <div><dt>Confidence</dt><dd>{percent(pattern.confidence)}</dd></div>
            <div><dt>Trend</dt><dd><TrendIndicator trend={pattern.trend} /></dd></div>
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
                <span className="evidence-status-group">
                  <Chip tone={confirmations[evidence.id] ? 'ok' : 'accent'} square>
                    {confirmations[evidence.id] ? (pattern.id === 'PAT-001' ? 'Demo confirmed' : 'Confirmed') : 'AI suggested'}
                  </Chip>
                  <Chip tone={decisionTone(decisions[evidence.id])} square>{decisions[evidence.id]}</Chip>
                </span>
              </header>
              <blockquote>{evidence.quote}</blockquote>
              <p className="evidence-reason"><span>AI reason</span>{evidence.ai_reason}</p>
              <div className="segmented" role="group" aria-label={`Evidence decision for ${evidence.id}`}>
                {evidenceDecisions.map(decision => <button
                  key={decision}
                  aria-pressed={decisions[evidence.id] === decision}
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
          <RuleCheck ok={readiness.evidenceReady} label={`${READINESS_RULE.belongsMinimum}+ snippets belong`} detail={evidenceRuleDetail(readiness.belongsCount, readiness.totalEvidence)} />
          <RuleCheck ok={readiness.verdictReady} label="Verdict is Valid" detail={verdict} />
          <RuleCheck ok={readiness.confidenceReady} label={`${percent(READINESS_RULE.confidenceMinimum)}+ confidence`} detail={`${percent(pattern.confidence)} current`} />
          <div className="rail-verdict-line">
            <Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Needs validation'}</Chip>
          </div>
        </section>

        <section className="rail-block">
          <header className="block-head">
            <h2>Verdict</h2>
            <p>Reviewer-owned, not model-owned.</p>
          </header>
          <div className="verdict-list" role="radiogroup" aria-label="Pattern verdict">
            {patternVerdicts.map(option => <label
              key={option}
              className={verdict === option ? 'verdict-option is-active' : 'verdict-option'}
            >
              <input
                type="radio"
                name={`pattern-verdict-${pattern.id}`}
                value={option}
                checked={verdict === option}
                onChange={() => onVerdictChange(option)}
              />
              <i aria-hidden="true" />
              {option}
            </label>)}
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
