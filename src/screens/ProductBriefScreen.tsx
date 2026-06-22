import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Lightbulb,
  LockKeyhole,
  TrendingDown,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge, PageTitle, Panel } from '../components/primitives'
import { MOCK_LABEL, MODEL_BOUNDARY, getReadiness } from '../mock'
import type { EvidenceDecision, FeedbackPattern, PatternVerdict } from '../types'

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
  const outcomeData = [
    { label: 'Before', mentions: pattern.outcome.before_mentions },
    { label: 'After', mentions: pattern.outcome.after_mentions },
  ]

  return <>
    <PageTitle
      eyebrow="Backlog candidate"
      title="Product Brief"
      description="A ready pattern can become a PM-owned backlog candidate with evidence, scope, and mocked outcome tracking."
      action={<Badge tone="green" dot>{MOCK_LABEL}</Badge>}
    />

    <div className="brief-screen-grid">
      <Panel title="Generated product brief" subtitle="Auto-filled from the validated pattern, then owned by a PM" className="product-brief-panel">
        {generated && readiness.ready ? (
          <article className="product-brief-doc">
            <header>
              <Badge tone="green"><CheckCircle2 size={12} /> Ready pattern</Badge>
              <Badge tone="purple">{pattern.product_area}</Badge>
              <h2>{pattern.short_name}</h2>
              <p>{pattern.brief.problem}</p>
            </header>
            <div className="brief-doc-grid">
              <section>
                <h3>Evidence summary</h3>
                <p>{pattern.brief.evidence_summary}</p>
              </section>
              <section>
                <h3>Affected area</h3>
                <p>{pattern.brief.affected_area}</p>
              </section>
              <section>
                <h3>Suggested next step</h3>
                <p>{pattern.brief.suggested_next_step}</p>
              </section>
              <section>
                <h3>PM owner</h3>
                <p>{pattern.brief.decision_owner}</p>
              </section>
              <section className="wide-section">
                <h3>Risk to watch</h3>
                <p>{pattern.brief.risk_to_watch}</p>
              </section>
            </div>
            <div className="brief-boundary"><LockKeyhole size={16} />{MODEL_BOUNDARY}</div>
          </article>
        ) : (
          <div className="brief-blocked">
            <FileText size={34} />
            <h2>Brief generation is blocked until the pattern is ready.</h2>
            <p>Opsqora does not let the mock AI self-approve. Confirm at least five evidence snippets as Belongs, set verdict to Valid, and meet the confidence rule first.</p>
            <div>
              <button className="btn btn-primary" onClick={onReviewPattern}>Review evidence <ArrowRight size={15} /></button>
              <button className="btn btn-secondary" disabled={!readiness.ready} onClick={onGenerateBrief}>Generate brief</button>
            </div>
          </div>
        )}
      </Panel>

      <aside className="brief-side-rail">
        <Panel title="Readiness snapshot" subtitle="Computed from visible rules">
          <div className="brief-readiness">
            <span><strong>{readiness.belongsCount}/{readiness.totalEvidence}</strong> evidence belongs</span>
            <span><strong>{verdict}</strong> verdict</span>
            <span><strong>{Math.round(pattern.confidence * 100)}%</strong> confidence</span>
            <Badge tone={readiness.ready ? 'green' : 'amber'}>{readiness.ready ? 'Ready' : 'Not ready'}</Badge>
          </div>
        </Panel>

        <Panel title="Mocked outcome" subtitle="No live integration or causal claim">
          <div className="outcome-card">
            <Badge tone="amber">{pattern.outcome.label}</Badge>
            <h3>{pattern.outcome.status}</h3>
            <p>{pattern.outcome.note}</p>
            <div className="outcome-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={outcomeData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#e2ded5" strokeDasharray="3 5" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#67747b' }} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#67747b' }} />
                  <Tooltip />
                  <Bar dataKey="mentions" fill="#3f6b75" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <small><TrendingDown size={13} /> {pattern.outcome.measurement_window}</small>
          </div>
        </Panel>

        <Panel title="Decision posture" subtitle="Portfolio signal">
          <div className="decision-posture">
            <div><Lightbulb size={16} /><span>Depth on one validated pattern beats a broad ticket workspace.</span></div>
            <div><BarChart3 size={16} /><span>Cost and quality are measured against validated outcomes, not model activity.</span></div>
          </div>
        </Panel>
      </aside>
    </div>
  </>
}
