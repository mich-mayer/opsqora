import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Info,
  ShieldCheck,
} from 'lucide-react'
import { Badge, PageTitle, Panel } from '../components/primitives'
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

function RuleRow({ label, ready, detail }: { label: string; ready: boolean; detail: string }) {
  return <div className={ready ? 'rule-row ready' : 'rule-row'}>
    <span>{ready ? <CheckCircle2 size={15} /> : <Info size={15} />}</span>
    <div><strong>{label}</strong><small>{detail}</small></div>
  </div>
}

export function PatternReview({
  pattern,
  decisions,
  verdict,
  generated,
  onDecisionChange,
  onVerdictChange,
  onGenerateBrief,
  onOpenBrief,
}: {
  pattern: FeedbackPattern
  decisions: Record<string, EvidenceDecision>
  verdict: PatternVerdict
  generated: boolean
  onDecisionChange: (evidenceId: string, decision: EvidenceDecision) => void
  onVerdictChange: (verdict: PatternVerdict) => void
  onGenerateBrief: () => void
  onOpenBrief: () => void
}) {
  const readiness = getReadiness(pattern, decisions, verdict)

  return <>
    <PageTitle
      eyebrow="Evidence validation"
      title="Pattern Review"
      description="Review representative evidence before a recurring feedback pattern can become a product decision."
      action={<><Badge tone="green" dot>{MOCK_LABEL}</Badge><Badge tone={readiness.ready ? 'green' : 'amber'}>{readiness.ready ? 'Ready' : 'Not ready'}</Badge></>}
    />

    <div className="pattern-review-shell">
      <Panel title="Pattern summary" subtitle="Mock AI suggestion, held for human validation" className="pattern-summary-panel">
        <div className="review-pattern-summary">
          <span className="pattern-id">{pattern.id}</span>
          <h2>{pattern.summary}</h2>
          <p>{pattern.ai_summary}</p>
          <div className="summary-metrics">
            <span><strong>{pattern.mention_count}</strong> mentions</span>
            <span><strong>{percent(pattern.confidence)}</strong> confidence</span>
            <span><strong>{pattern.product_area}</strong> area</span>
            <span><strong>{pattern.cadence_hint}</strong> cadence hint</span>
          </div>
          <div className="model-boundary"><ShieldCheck size={16} />{MODEL_BOUNDARY}</div>
        </div>
      </Panel>

      <Panel title="Representative evidence" subtitle="Feedback items are evidence only; product readiness comes from human validation." className="evidence-panel">
        <div className="evidence-list">
          {pattern.evidence.map(evidence => (
            <article className="evidence-card" key={evidence.id}>
              <header>
                <div>
                  <strong>{evidence.source_system} · {evidence.source_id}</strong>
                  <span>{evidence.account_segment} · {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(evidence.created_at))}</span>
                </div>
                <Badge tone={decisions[evidence.id] === 'Belongs' ? 'green' : decisions[evidence.id] === 'Unsure' ? 'amber' : 'neutral'}>{decisions[evidence.id]}</Badge>
              </header>
              <blockquote>{evidence.quote}</blockquote>
              <p><Bot size={13} /> Mock AI reason: {evidence.ai_reason}</p>
              <div className="evidence-controls" role="group" aria-label={`Evidence decision for ${evidence.id}`}>
                {evidenceDecisions.map(decision => (
                  <button
                    key={decision}
                    className={decisions[evidence.id] === decision ? 'selected' : ''}
                    onClick={() => onDecisionChange(evidence.id, decision)}
                  >
                    {decision}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <aside className="readiness-rail">
        <Panel title="Readiness logic" subtitle="Explicit rule, not a hidden model decision">
          <div className="readiness-rule">
            <p>Ready when at least {READINESS_RULE.belongsMinimum} evidence snippets are confirmed as Belongs, verdict = Valid, and pattern confidence is at least {percent(READINESS_RULE.confidenceMinimum)}.</p>
            <RuleRow label="Evidence threshold" ready={readiness.evidenceReady} detail={`${readiness.belongsCount}/${readiness.totalEvidence} snippets marked Belongs`} />
            <RuleRow label="Human verdict" ready={readiness.verdictReady} detail={`Current verdict: ${verdict}`} />
            <RuleRow label="Pattern confidence" ready={readiness.confidenceReady} detail={`${percent(pattern.confidence)} mock confidence`} />
          </div>
        </Panel>

        <Panel title="Pattern verdict" subtitle="Human reviewer decides what the pattern is">
          <div className="verdict-list">
            {patternVerdicts.map(option => (
              <button key={option} className={verdict === option ? 'selected' : ''} onClick={() => onVerdictChange(option)}>
                <span>{option}</span>
                {verdict === option && <CheckCircle2 size={15} />}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Product brief preview" subtitle="Generated only after readiness rules are met">
          <div className="brief-preview">
            <FileText size={20} />
            <h3>{pattern.brief.problem}</h3>
            <p>{pattern.brief.evidence_summary}</p>
            <button className="btn btn-primary" disabled={!readiness.ready} onClick={generated ? onOpenBrief : onGenerateBrief}>
              {generated ? 'Open product brief' : 'Generate product brief'} <ArrowRight size={15} />
            </button>
            {!readiness.ready && <small>Blocked until the transparent readiness rule passes.</small>}
          </div>
        </Panel>
      </aside>
    </div>
  </>
}
