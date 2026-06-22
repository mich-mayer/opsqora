import {
  Check,
  ExternalLink,
  Layers3,
  LockKeyhole,
  MessageSquareOff,
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
      title="Why this is narrower than a helpdesk"
      description="Opsqora is a thin AI-assisted layer for evidence validation and eval discipline, not a replacement for support tooling."
      action={<Badge tone="green" dot>{MOCK_LABEL}</Badge>}
    />

    <div className="notes-hero">
      <Sparkles size={22} />
      <div>
        <h2>Find recurring complaints, verify the evidence, turn confirmed patterns into product decisions.</h2>
        <p>The pivot deliberately kills the broad operations workspace because that version looked like a helpdesk clone. Concept B is narrower: recurring feedback patterns are the unit of work, and support items are only evidence.</p>
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
      <Panel title="What Opsqora is not" subtitle="Boundaries that keep the product honest">
        <div className="boundary-list bad-list">
          {[
            'Not a helpdesk, ticket inbox, or support-agent workspace',
            'No automatic replies, internal notes, routing, or escalation actions',
            'No backend, auth, persistence, real customer data, or live model call',
            'No claim that mocked outcomes are production evidence',
            'No AI self-approval for backlog candidates',
          ].map(item => <div key={item}><X size={15} />{item}</div>)}
        </div>
      </Panel>
    </div>

    <div className="notes-grid">
      <Panel title="The moat question" subtitle="Acknowledge it before the interview asks it">
        <div className="note-card-list">
          <article>
            <Layers3 size={17} />
            <h3>Vs. Productboard / Enterpret / unitQ / Dovetail</h3>
            <p>Those tools own broad feedback repositories and research workflows. Opsqora’s prototype is narrower: support-feedback patterns only, explicit evidence validation, readiness logic, and cost-aware AI eval.</p>
          </article>
          <article>
            <ShieldCheck size={17} />
            <h3>Vs. the model provider</h3>
            <p>The differentiation is not the model. It is the product workflow around the model: evidence states, human verdicts, PM decision boundary, eval thresholds, and cost per validated pattern.</p>
          </article>
        </div>
      </Panel>

      <Panel title="Human-in-the-loop boundary" subtitle="What the AI may and may not do">
        <div className="note-principles">
          <div><Sparkles size={16} /><span>AI suggests recurring patterns and drafts summaries.</span></div>
          <div><LockKeyhole size={16} /><span>Humans validate evidence and choose the pattern verdict.</span></div>
          <div><ShieldCheck size={16} /><span>Transparent rules compute readiness; PMs make the backlog decision.</span></div>
          <div><MessageSquareOff size={16} /><span>No customer-impacting message or support action exists in this prototype.</span></div>
        </div>
      </Panel>
    </div>

    <div className="notes-footer">
      <ExternalLink size={16} />
      <span>Review cadence is intentionally light: weekly, biweekly, pre-sprint, or ad hoc. The core value is the validation workflow, not the calendar.</span>
    </div>
  </>
}
