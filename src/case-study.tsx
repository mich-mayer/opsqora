import { ArrowRight, ArrowUpRight, GitBranch } from 'lucide-react'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Chip, Kicker, RuleCheck, Wordmark } from './components/primitives'
import {
  MODEL_BOUNDARY,
  READINESS_RULE,
  feedbackPatterns,
  getInitialEvidenceDecisions,
  getReadiness,
  patternVerdicts,
} from './mock'
import type { EvidenceDecision, PatternVerdict } from './types'
import './styles.css'

const BASE = import.meta.env.BASE_URL
const REPO_URL = 'https://github.com/mich-mayer/opsqora'

const projectMeta = [
  ['Role', 'AI PM framing + frontend'],
  ['Type', 'Phase 1 frontend prototype'],
  ['Stack', 'React · TypeScript · Vite'],
  ['Data', 'Synthetic, deterministic'],
  ['Year', '2026'],
]

const loopSteps = [
  ['Suggest', 'Mock AI groups recurring feedback patterns from synthetic support exports and attaches representative evidence.'],
  ['Validate', 'A human reviewer marks each snippet as Belongs, Does not belong, Different problem, or Unsure — then sets the pattern verdict.'],
  ['Compute', 'Transparent rules decide readiness: enough confirmed evidence, a Valid verdict, and sufficient confidence. The model never self-approves.'],
  ['Decide', 'A PM turns a ready pattern into a product brief and tracks mocked outcomes against the original mention volume.'],
]

const realList = [
  'The full validation workflow — every screen is interactive',
  'Readiness logic computed live from evidence states and verdicts',
  'Deterministic synthetic dataset, reproducible on every visit',
  'Hand-rolled SVG charts and a single design system across both pages',
]

const mockedList = [
  'The AI layer — pattern grouping and summaries are precomputed',
  'Eval metrics, costs, and outcome tracking — labeled illustrative',
  'Integrations — Zendesk, Intercom, Jira names are fictional exports',
  'No backend, auth, persistence, or real customer data anywhere',
]

const results = [
  ['Pattern precision', '76%', 'Target ≥ 70% — share of suggested patterns describing one real recurring problem'],
  ['Pattern recall', '64%', 'Share of reviewer-confirmed recurring problems the AI suggested as patterns'],
  ['Pattern F1', '69%', 'Combined precision + recall signal for suggested recurring problems'],
  ['Evidence precision', '81%', 'Target ≥ 80% — share of attached snippets reviewers marked as Belongs'],
  ['Cost per validated pattern', '$8.90', 'The key value-linked cost metric, paired with a $12 action threshold'],
  ['Review time per pattern', '6–9 min', 'Estimated human effort to validate evidence and set a verdict'],
  ['Flagship mocked outcome', '42 → 18', 'Mentions after a product action shipped in the mocked timeline'],
]

const stack = ['React 18', 'TypeScript', 'Vite', 'Lucide', 'GitHub Pages']

function DemoFrame({
  url,
  note,
  height,
  children,
}: {
  url: string
  note?: string
  height: number
  children: React.ReactNode
}) {
  return <figure className="demo-frame" style={{ '--frame-h': `${height}px` } as React.CSSProperties}>
    <div className="demo-frame-chrome">
      <span className="demo-frame-dots" aria-hidden="true"><i /><i /><i /></span>
      <em>{url}</em>
      <span className="demo-frame-live"><i aria-hidden="true" />Live · synthetic data</span>
    </div>
    <div className="demo-frame-body">{children}</div>
    {note && <figcaption>{note}</figcaption>}
  </figure>
}

function CaseSection({
  id,
  index,
  kicker,
  title,
  children,
}: {
  id: string
  index: string
  kicker: string
  title: string
  children: React.ReactNode
}) {
  return <section className="case-section" id={id}>
    <header className="case-section-head">
      <Kicker index={index}>{kicker}</Kicker>
      <h2>{title}</h2>
    </header>
    {children}
  </section>
}

function ReadinessPlayground() {
  const pattern = feedbackPatterns[0]
  const [decisions, setDecisions] = useState<Record<string, EvidenceDecision>>(
    () => getInitialEvidenceDecisions()[pattern.id],
  )
  const [verdict, setVerdict] = useState<PatternVerdict>(pattern.default_verdict)
  const readiness = getReadiness(pattern, decisions, verdict)

  const toggleEvidence = (evidenceId: string) => {
    setDecisions(current => ({
      ...current,
      [evidenceId]: current[evidenceId] === 'Belongs' ? 'Does not belong' : 'Belongs',
    }))
  }

  return <div className="playground" aria-label="Interactive readiness rule">
    <div className="playground-inputs">
      <p className="playground-label">Evidence decisions — click to flip</p>
      <div className="playground-evidence">
        {pattern.evidence.map(evidence => <button
          key={evidence.id}
          className={decisions[evidence.id] === 'Belongs' ? 'is-belongs' : ''}
          onClick={() => toggleEvidence(evidence.id)}
          aria-pressed={decisions[evidence.id] === 'Belongs'}
        >
          <i aria-hidden="true" />
          {evidence.id}
          <span>{decisions[evidence.id] === 'Belongs' ? 'Belongs' : 'Out'}</span>
        </button>)}
      </div>
      <p className="playground-label">Human verdict</p>
      <div className="playground-verdicts" role="radiogroup" aria-label="Pattern verdict">
        {patternVerdicts.map(option => <button
          key={option}
          role="radio"
          aria-checked={verdict === option}
          className={verdict === option ? 'is-active' : ''}
          onClick={() => setVerdict(option)}
        >
          {option}
        </button>)}
      </div>
    </div>
    <div className="playground-output">
      <p className="playground-label">Readiness rule — computed live</p>
      <RuleCheck
        ok={readiness.evidenceReady}
        label={`Evidence ≥ ${READINESS_RULE.belongsMinimum} belongs`}
        detail={`${readiness.belongsCount}/${readiness.totalEvidence} snippets confirmed`}
      />
      <RuleCheck ok={readiness.verdictReady} label="Verdict is Valid" detail={`Current verdict: ${verdict}`} />
      <RuleCheck
        ok={readiness.confidenceReady}
        label={`Confidence ≥ ${Math.round(READINESS_RULE.confidenceMinimum * 100)}%`}
        detail={`${Math.round(pattern.confidence * 100)}% mock confidence — fixed for this pattern`}
      />
      <div className="playground-result">
        <Chip tone={readiness.ready ? 'ok' : 'bad'} square>
          {readiness.ready ? 'Ready — brief can be generated' : 'Blocked — brief stays locked'}
        </Chip>
      </div>
      <p className="playground-foot">
        This widget calls the same <code>getReadiness()</code> function as the product above.
        The AI never gets to skip this gate.
      </p>
    </div>
  </div>
}

function CaseStudy() {
  return <div className="case">
    <a className="skip-link" href="#case-main">Skip to content</a>
    <header className="case-top">
      <Wordmark href={`${BASE}case-study.html`} sub="Case study" />
      <nav aria-label="Case study sections">
        <a href="#product">Product</a>
        <a href="#problem">Problem</a>
        <a href="#loop">Loop</a>
        <a href="#eval">Eval</a>
        <a href="#results">Results</a>
      </nav>
      <a className="btn btn--primary" href={BASE}>Open live demo <ArrowUpRight size={14} /></a>
    </header>

    <main id="case-main">
      <section className="case-hero">
        <Kicker>AI product management — case study · 2026</Kicker>
        <h1>Recurring support feedback, turned into product decisions you can defend.</h1>
        <p className="case-lede">
          Opsqora helps a small product team find recurring complaints, verify the supporting
          evidence, and turn confirmed patterns into product briefs — while keeping AI assistive,
          mocked, and visibly bounded.
        </p>
        <div className="case-actions">
          <a className="btn btn--primary" href={BASE}>Open live demo <ArrowRight size={14} /></a>
          <a className="btn btn--ghost" href={REPO_URL}>View repository <GitBranch size={14} /></a>
        </div>
        <dl className="case-meta">
          {projectMeta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </section>

      <section className="case-demo" id="product" aria-label="Live product demo">
        <DemoFrame
          url="opsqora.app"
          height={680}
          note="This is the actual product embedded in the page, not a screenshot. Click through the patterns, flip evidence decisions, and open the brief."
        >
          <App embedded />
        </DemoFrame>
      </section>

      <CaseSection id="problem" index="01" kicker="The problem" title="Recurring complaints need proof before they become roadmap work.">
        <div className="case-prose">
          <p>
            Product teams can see repeated complaints in exports, calls, and notes, but the signal
            is hard to trust until the evidence is grouped, reviewed, and tied to a clear decision
            rule. The same issue arrives as “timeline import shifted blockers,” “dependency dates
            moved after migration,” and “milestones changed after CSV import” — keyword rules miss
            the overlap, and manual review does not scale.
          </p>
          <p>
            Semantic clustering is a genuine AI task, but only an assistive one. Opsqora narrows
            the job to a single loop: suggest a recurring pattern, validate the supporting
            snippets, compute readiness, and turn the confirmed pattern into a product brief.
          </p>
        </div>
        <ul className="case-figures" aria-label="Prototype scope figures">
          <li><strong>4</strong><span>mocked feedback patterns</span></li>
          <li><strong>1</strong><span>flagship validation path</span></li>
          <li><strong>5</strong><span>pattern verdicts</span></li>
          <li><strong>13</strong><span>quality + cost metrics</span></li>
        </ul>
      </CaseSection>

      <CaseSection id="loop" index="02" kicker="How it works" title="One validation loop: suggest, validate, compute, decide.">
        <ol className="case-steps">
          {loopSteps.map(([title, copy], index) => <li key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </li>)}
        </ol>
        <div className="case-playground">
          <p className="case-playground-intro">
            The gate between “AI suggestion” and “PM decision” is a visible rule. Try it — this is
            the real logic, not an illustration:
          </p>
          <ReadinessPlayground />
        </div>
      </CaseSection>

      <section className="case-boundary" id="boundary">
        <Kicker index="03">Human-in-the-loop boundary</Kicker>
        <blockquote>{MODEL_BOUNDARY}</blockquote>
      </section>

      <CaseSection id="eval" index="04" kicker="AI eval" title="Trust and cost are product requirements.">
        <div className="case-prose">
          <p>
            The eval dashboard answers two product questions: can we trust the model, and what does
            one validated pattern cost? Precision, recall, F1, evidence precision, and
            high-confidence disagreement measure trust; cost per validated pattern ties spend to
            value instead of raw model activity.
          </p>
          <p>
            Every metric is paired with a production threshold and an action — pause suggestions,
            block readiness, or move low-stakes work to a cheaper model tier. Dashboards without
            actions are decoration.
          </p>
        </div>
        <DemoFrame
          url="opsqora.app — AI eval"
          height={800}
          note="The live eval screen: quality and cost tables with plain-language definitions, threshold/action rules, and hand-rolled SVG charts."
        >
          <App embedded initialPage="eval" />
        </DemoFrame>
      </CaseSection>

      <CaseSection id="scope" index="05" kicker="Scope and honesty" title="What is real, and what is deliberately mocked.">
        <div className="case-scope-columns">
          <div>
            <h3>Real in this prototype</h3>
            <ul className="case-scope-list case-scope-list--real">
              {realList.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3>Mocked on purpose</h3>
            <ul className="case-scope-list case-scope-list--mocked">
              {mockedList.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
        <div className="case-stack" aria-label="Technology stack">
          {stack.map(item => <span key={item}>{item}</span>)}
        </div>
      </CaseSection>

      <CaseSection id="results" index="06" kicker="Results" title="A narrower demo with sharper AI PM judgment.">
        <table className="case-results">
          <caption>All values are estimated from the mocked prototype — not production outcomes.</caption>
          <tbody>
            {results.map(([label, value, detail]) => <tr key={label}>
              <th scope="row">{label}</th>
              <td className="case-results-value">{value}</td>
              <td className="case-results-detail">{detail}</td>
            </tr>)}
          </tbody>
        </table>
        <div className="case-prose">
          <p>
            The core lesson: AI product value comes from the workflow around the model — evidence
            states, human verdicts, readiness rules, eval thresholds, and cost per validated
            pattern. Next steps would be validating review-cadence adoption, collecting real eval
            data from privacy-safe feedback exports, and testing outcome tracking through
            read-only integrations before any write-back workflow.
          </p>
        </div>
      </CaseSection>

      <section className="case-cta">
        <h2>Explore the validation loop.</h2>
        <p>Everything is frontend-only, deterministic, synthetic, and visibly labeled as mocked or illustrative.</p>
        <div className="case-actions">
          <a className="btn btn--accent" href={BASE}>Open live demo <ArrowRight size={14} /></a>
          <a className="btn btn--inverse" href={REPO_URL}>View repository <GitBranch size={14} /></a>
        </div>
      </section>
    </main>

    <footer className="case-foot">
      <Wordmark href={BASE} />
      <span>© 2026 — Phase 1 prototype · synthetic data · no real AI calls</span>
      <nav aria-label="Footer links">
        <a href={BASE}>Live demo</a>
        <a href={REPO_URL}>Repository</a>
      </nav>
    </footer>
  </div>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CaseStudy />
  </React.StrictMode>,
)
