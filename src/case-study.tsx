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
const FLATFEED_CASE_URL = 'https://mich-mayer.github.io/flatfeed/case-study.html'
// Real published URL (verified in README) shown in the demo-frame chrome —
// never a domain the project does not own.
const LIVE_URL_LABEL = 'mich-mayer.github.io/opsqora'

const projectMeta = [
  ['Role', 'Product framing, AI boundary + eval design, frontend build'],
  ['Domain', 'B2B SaaS support feedback'],
  ['Type', 'Phase 1 frontend prototype'],
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

const measuredResults = [
  ['Interactive screens', '4', 'Patterns, Review, Brief, and AI Eval — the embeds on this page run the real build, not recordings'],
  ['Validated demo paths', '1', 'PAT-001 walks from AI suggestion to product brief with every gate visible'],
  ['Readiness rule', 'Live', 'The playground above calls the same getReadiness() function as the product'],
]

const gateResults = [
  ['Pattern precision', '≥ 70%', 'Share of suggested patterns describing one real recurring problem, measured on reviewer-labeled exports'],
  ['Evidence precision', '≥ 80%', 'Share of attached snippets reviewers mark as Belongs'],
  ['Cost per validated pattern', '≤ $12', 'The value-linked cost metric; modeled ≈ $8.90 per pattern under Phase-1 assumptions'],
]

const learnedPoints = [
  ['Suggest, don’t decide', 'The model proposes patterns; reviewers and PMs own every product-impacting call.'],
  ['Gates before spend', 'Thresholds and actions were defined before any real inference cost exists.'],
  ['Label every number', 'Measured, target, and mocked values are marked at the same depth as the number.'],
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
  // rem so the demo frame scales with the fluid type root (1rem == 16px reference)
  return <figure className="demo-frame" style={{ '--frame-h': `${height / 16}rem` } as React.CSSProperties}>
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
          <span>{decisions[evidence.id] === 'Belongs' ? 'Belongs' : 'Excluded'}</span>
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
        <a href="#problem">Problem</a>
        <a href="#why-ai">Why AI</a>
        <a href="#role">Role</a>
        <a href="#approach">Approach</a>
        <a href="#built">Built</a>
        <a href="#results">Results</a>
        <a href="#learned">Learned</a>
      </nav>
      <a className="btn btn--primary" href={BASE}>Open live demo <ArrowUpRight size={14} /></a>
    </header>

    <main id="case-main">
      <section className="case-hero">
        <Kicker>AI product management — case study · 2026</Kicker>
        <h1>I built Opsqora to turn recurring support complaints into product decisions a PM can defend.</h1>
        <p className="case-lede">
          Opsqora helps a small product team find recurring complaints, verify the supporting
          evidence, and turn confirmed patterns into product briefs — with AI kept assistive: it
          suggests, humans decide. Phase 1 is a frontend prototype on synthetic data.
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
          url={LIVE_URL_LABEL}
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
            is hard to trust until it is grouped, reviewed, and tied to a clear decision rule.
            Until then a genuine recurring problem and a handful of loud one-offs look the same —
            and roadmap attention follows whoever complained most recently, not what actually
            recurs.
          </p>
        </div>
        <ul className="case-figures" aria-label="Prototype scope figures">
          <li><strong>4</strong><span>mocked feedback patterns</span></li>
          <li><strong>1</strong><span>fully validated demo path</span></li>
          <li><strong>5</strong><span>pattern verdicts</span></li>
          <li><strong>4</strong><span>eval thresholds paired with actions</span></li>
        </ul>
      </CaseSection>

      <CaseSection id="why-ai" index="02" kicker="Why AI?" title="Grouping the same complaint across many phrasings is a genuine AI task — and it stays assistive.">
        <div className="case-prose">
          <p>
            The same issue arrives as “timeline import shifted blockers,” “dependency dates moved
            after migration,” and “milestones changed after CSV import.” Keyword and rule-based
            grouping miss that overlap, new phrasings appear that no rule anticipated, and manual
            review does not scale. Clustering fuzzy, ever-shifting language into one recurring
            problem — semantic clustering — is where AI genuinely earns its place, not a keyword
            list dressed up.
          </p>
          <p>
            But it stays assistive: the model suggests patterns, summarizes evidence, and estimates
            confidence — the human validates the evidence and owns the decision. The AI never
            decides what enters the backlog and never self-approves.
          </p>
        </div>
      </CaseSection>

      <CaseSection id="role" index="03" kicker="My role" title="The decisions are mine; the implementation is agent-assisted and disclosed.">
        <div className="case-prose">
          <p>
            I framed the problem, scoped the pattern-validation workflow, designed the AI-assistive
            boundary, and shaped the eval strategy and cost model. Solo project: all product
            decisions, scope boundaries, and the readiness rule are mine. Implementation was built
            with AI coding agents (Claude Code and Codex) under a documented collaboration workflow
            in the repo — disclosed here and visible in the commit history.
          </p>
        </div>
      </CaseSection>

      <CaseSection id="approach" index="04" kicker="The approach" title="Data, models, and evaluation were decided before a single real model call.">
        <div className="case-prose">
          <p>
            Phase 1 runs on synthetic, deterministic data: the same patterns, evidence, and numbers
            on every visit, so every decision in the demo is reproducible. In production, the input
            would be privacy-safe support exports with reviewer-labeled ground truth.
          </p>
          <p>
            The production model split is deliberate: a top-tier (“frontier”) model for the hard
            semantic work — clustering, evidence selection, problem synthesis — and a cheaper model
            for low-stakes formatting, labels, and brief cleanup. Nothing in the workflow depends
            on which vendor supplies the model.
          </p>
          <p>
            The eval strategy answers two product questions: can we trust the model, and what does
            one validated pattern cost? Precision, recall, evidence precision, and high-confidence
            disagreement (reviewers rejecting evidence the model was sure about) measure trust;
            cost per validated pattern ties spend to value instead of raw model activity. Every
            metric is paired with a launch threshold and an action — pause suggestions, block
            readiness, or move low-stakes work to a cheaper model tier. Dashboards without actions
            are decoration.
          </p>
        </div>
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

      <CaseSection id="built" index="05" kicker="What I built" title="A working validation loop with the eval instrument built in.">
        <div className="case-prose">
          <p>
            Four screens exist and are fully interactive: Patterns (AI-suggested recurring patterns
            with mentions, trend, area, confidence, and readiness state), Review (evidence marked
            Belongs, Does not belong, Different problem, or Unsure, plus the human verdict), Brief
            (a PM-owned document generated from a validated pattern), and AI Eval (quality and cost
            metrics with the production evaluation plan). The product embedded at the top of this
            page is this same build, not a recording.
          </p>
        </div>
        <div id="eval">
          <DemoFrame
            url={LIVE_URL_LABEL}
            height={800}
            note="The live eval screen: quality and cost tables with plain-language definitions, threshold/action rules, and hand-rolled SVG charts."
          >
            <App embedded initialPage="eval" />
          </DemoFrame>
        </div>
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

      <section className="case-boundary" id="boundary">
        <Kicker>Human-in-the-loop boundary</Kicker>
        <blockquote>{MODEL_BOUNDARY}</blockquote>
      </section>

      <CaseSection id="results" index="06" kicker="Results" title="Measured where it exists, gated where it doesn’t — no real model calls yet.">
        <table className="case-results">
          <caption>
            No real model has run yet, so model-quality rows are launch gates, not achievements.
            Illustrative current values appear only inside the eval dashboard, labeled as mocked.
          </caption>
          <tbody>
            <tr className="case-results-group"><th colSpan={3} scope="colgroup">Measured in this prototype</th></tr>
            {measuredResults.map(([label, value, detail]) => <tr key={label}>
              <th scope="row">{label}</th>
              <td className="case-results-value">{value}</td>
              <td className="case-results-detail">{detail}</td>
            </tr>)}
          </tbody>
          <tbody>
            <tr className="case-results-group"><th colSpan={3} scope="colgroup">Launch gates — designed, not yet measured</th></tr>
            {gateResults.map(([label, value, detail]) => <tr key={label}>
              <th scope="row">{label}</th>
              <td className="case-results-value">{value}</td>
              <td className="case-results-detail">{detail}</td>
            </tr>)}
          </tbody>
        </table>
        <div className="case-prose">
          <p>
            The one mocked product outcome — mentions falling 42 → 18 after a shipped action —
            stays inside the demo, labeled “Mocked outcome — no live integration.” What this page
            publishes as results is only what exists today and the gates a real model must clear.
          </p>
        </div>
      </CaseSection>

      <CaseSection id="learned" index="07" kicker="What I learned" title="The workflow around the model is the product.">
        <div className="case-prose">
          <p>
            AI product value comes from the workflow around the model — evidence states, human
            verdicts, readiness rules, eval thresholds, and cost per validated pattern. The model
            can be swapped; the decision discipline is the part a team would actually adopt.
          </p>
          <p>
            What I would do differently: put one real model call behind a flag earlier — a single
            real eval run on a small model would turn the illustrative dashboard values into a
            measured baseline. Next steps: test whether teams adopt a regular pattern-review
            ritual, collect real evaluation data from privacy-safe support exports, and track
            outcomes through read-only integrations before the product writes anything back.
          </p>
        </div>
        <div className="case-points">
          {learnedPoints.map(([title, copy]) => <div key={title}>
            <strong>{title}</strong>
            <span>{copy}</span>
          </div>)}
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

      <section className="case-sibling" aria-label="Second case study">
        <Kicker>More from this portfolio</Kicker>
        <p>
          <strong>FlatFeed</strong> — the same design system, the opposite AI boundary:
          deterministic rules own user-facing eligibility, and AI only reviews parser quality.{' '}
          <a href={FLATFEED_CASE_URL}>Read the FlatFeed case study <ArrowUpRight size={14} /></a>
        </p>
      </section>
    </main>

    <footer className="case-foot">
      <Wordmark href={BASE} />
      <div className="case-foot-meta">
        <span className="case-foot-line">AI suggests patterns. The PM decides — it never self-approves.</span>
        <span>© 2026 — Phase 1 prototype · synthetic data · no real AI calls</span>
      </div>
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
