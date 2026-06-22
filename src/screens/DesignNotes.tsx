import {
  Check,
  ExternalLink,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { Badge, PageTitle, Panel } from '../components/primitives'
import { MOCK_LABEL } from '../mock'

export function DesignNotes() {
  return <>
    <PageTitle
      eyebrow="About / Design notes"
      title="Current product boundaries"
      description="Opsqora is an AI-assisted validation layer for recurring support feedback patterns."
      action={<Badge tone="green" dot>{MOCK_LABEL}</Badge>}
    />

    <div className="notes-hero">
      <Sparkles size={22} />
      <div>
        <h2>Find recurring complaints, verify the evidence, turn confirmed patterns into product decisions.</h2>
        <p>Opsqora centers the workflow on recurring feedback patterns. Evidence snippets support the pattern, transparent rules compute readiness, and the PM owns the final product decision.</p>
      </div>
    </div>

    <div className="two-panels notes-panels">
      <Panel title="What Opsqora is" subtitle="A focused product-feedback validation layer">
        <div className="boundary-list good-list">
          {[
            'A thin layer over foundation-model clustering and summarization',
            'A human evidence-validation workflow for recurring support patterns',
            'A visible readiness rule before a pattern becomes a PM decision',
            'An eval dashboard that connects quality and cost to validated value',
            'A frontend-only portfolio prototype with deterministic synthetic data',
          ].map(item => <div key={item}><Check size={15} />{item}</div>)}
        </div>
      </Panel>
      <Panel title="What Opsqora is not" subtitle="Phase 1 boundaries">
        <div className="boundary-list bad-list">
          {[
            'No backend, auth, persistence, real customer data, or live model call',
            'No autonomous product decisions',
            'No production write-back workflow',
            'No claim that mocked outcomes are production evidence',
            'No AI self-approval for backlog candidates',
          ].map(item => <div key={item}><X size={15} />{item}</div>)}
        </div>
      </Panel>
    </div>

    <div className="notes-grid">
      <Panel title="The moat question" subtitle="The product value lives around the model">
        <div className="note-card-list">
          <article>
            <Layers3 size={17} />
            <h3>Focused workflow</h3>
            <p>Opsqora is intentionally centered on recurring support-feedback patterns, evidence validation, readiness logic, and product brief generation.</p>
          </article>
          <article>
            <ShieldCheck size={17} />
            <h3>Model plus workflow</h3>
            <p>The differentiation is not the model alone. It is the product workflow around the model: evidence states, human verdicts, PM decision boundary, eval thresholds, and cost per validated pattern.</p>
          </article>
        </div>
      </Panel>

      <Panel title="Human-in-the-loop boundary" subtitle="What the AI may and may not do">
        <div className="note-principles">
          <div><Sparkles size={16} /><span>AI suggests recurring patterns and summaries.</span></div>
          <div><LockKeyhole size={16} /><span>Humans validate evidence and choose the pattern verdict.</span></div>
          <div><ShieldCheck size={16} /><span>Transparent rules compute readiness; PMs make the backlog decision.</span></div>
        </div>
      </Panel>
    </div>

    <div className="notes-footer">
      <ExternalLink size={16} />
      <span>Review cadence is intentionally light: weekly, biweekly, pre-sprint, or ad hoc. The core value is the validation workflow, not the calendar.</span>
    </div>
  </>
}
