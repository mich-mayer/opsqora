import { ArrowRight } from 'lucide-react'
import { Chip, RuleCheck, ScreenHead } from '../components/primitives'
import {
  MOCK_LABEL,
  MODEL_BOUNDARY,
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
      title="Pattern Review"
      lede="Review representative evidence before a recurring feedback pattern can become a product decision."
      aside={<>
        <Chip tone="line" square>{MOCK_LABEL}</Chip>
        <Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Not ready'}</Chip>
      </>}
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
        <section className="review-summary">
          <div className="review-summary-head">
            <span className="mono-id">{pattern.id}</span>
            <Chip tone="line">{pattern.product_area}</Chip>
          </div>
          <h2>{pattern.summary}</h2>
          <p>{pattern.ai_summary}</p>
          <dl className="review-figures">
            <div><dt>Mentions</dt><dd>{pattern.mention_count}</dd></div>
            <div><dt>Confidence</dt><dd>{percent(pattern.confidence)}</dd></div>
            <div><dt>Cadence hint</dt><dd>{pattern.cadence_hint}</dd></div>
            <div><dt>Evidence</dt><dd>{readiness.belongsCount}/{readiness.totalEvidence} belongs</dd></div>
          </dl>
          <p className="boundary-note"><span>Model boundary</span>{MODEL_BOUNDARY}</p>
        </section>

        <section className="evidence-block" aria-label="Representative evidence">
          <header className="block-head">
            <h2>Representative evidence</h2>
            <p>Feedback items are evidence only; readiness comes from human validation.</p>
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
              <p className="evidence-reason"><span>AI reason</span>{evidence.ai_reason}</p>
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
            <h2>Readiness logic</h2>
            <p>Explicit rule, not a hidden model decision.</p>
          </header>
          <p className="rail-rule-copy">
            Ready when at least {READINESS_RULE.belongsMinimum} snippets are confirmed as Belongs,
            the verdict is Valid, and confidence is at least {percent(READINESS_RULE.confidenceMinimum)}.
          </p>
          <RuleCheck ok={readiness.evidenceReady} label="Evidence threshold" detail={`${readiness.belongsCount}/${readiness.totalEvidence} snippets marked Belongs`} />
          <RuleCheck ok={readiness.verdictReady} label="Human verdict" detail={`Current verdict: ${verdict}`} />
          <RuleCheck ok={readiness.confidenceReady} label="Pattern confidence" detail={`${percent(pattern.confidence)} mock confidence`} />
          <div className="rail-verdict-line">
            <Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready for PM decision' : 'Not ready yet'}</Chip>
          </div>
        </section>

        <section className="rail-block">
          <header className="block-head">
            <h2>Pattern verdict</h2>
            <p>The human reviewer decides what the pattern is.</p>
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
        </section>

        <section className="rail-block">
          <header className="block-head">
            <h2>Product brief</h2>
            <p>Generated only after the readiness rule passes.</p>
          </header>
          <p className="rail-brief-problem">{pattern.brief.problem}</p>
          <p className="rail-brief-evidence">{pattern.brief.evidence_summary}</p>
          <button className="btn btn--primary btn--block" disabled={!readiness.ready} onClick={generated ? onOpenBrief : onGenerateBrief}>
            {generated ? 'Open product brief' : 'Generate product brief'} <ArrowRight size={14} />
          </button>
          {!readiness.ready && <p className="rail-blocked-note">Blocked until the transparent readiness rule passes.</p>}
        </section>
      </aside>
    </div>
  </>
}
