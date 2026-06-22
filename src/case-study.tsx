import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ArrowRight,
  GitBranch,
} from 'lucide-react'
import './styles.css'

const baseUrl = '/opsqora/'

const metrics = [
  '4 mocked feedback patterns',
  '1 flagship validation path',
  '5 evidence verdicts',
  '11 quality + cost metrics',
]

const processSteps = [
  ['Suggest', 'Mock AI groups recurring feedback patterns from synthetic support exports.'],
  ['Validate', 'A human reviewer marks evidence as Belongs, Does not belong, Different problem, or Unsure.'],
  ['Compute', 'Transparent rules decide readiness; the model never self-approves.'],
  ['Decide', 'A PM turns a ready pattern into a product brief and tracks mocked outcomes.'],
]

const stack = ['React', 'TypeScript', 'Vite', 'Recharts', 'Lucide', 'GitHub Pages']

const shots = {
  patterns: {
    url: 'opsqora.app/patterns',
    label: 'Pattern feed',
    file: 'patterns@2x',
    caption: 'Recurring feedback patterns replace the old ticket inbox as the unit of work.',
  },
  review: {
    url: 'opsqora.app/review',
    label: 'Pattern review',
    file: 'pattern-review@2x',
    caption: 'Representative support quotes become evidence, and every snippet gets a human validation state.',
    callouts: [
      { label: 'Evidence states', x: '49%', y: '59%', side: 'left' },
      { label: 'Readiness logic', x: '82%', y: '34%', side: 'right' },
      { label: 'Human verdict', x: '83%', y: '61%', side: 'right' },
    ] as const,
  },
  brief: {
    url: 'opsqora.app/brief',
    label: 'Product brief',
    file: 'product-brief@2x',
    caption: 'A ready pattern becomes a mocked backlog candidate with evidence, owner and next step.',
  },
  eval: {
    url: 'opsqora.app/eval',
    label: 'AI eval',
    file: 'ai-eval@2x',
    caption: 'Quality, disagreement and cost are framed as product gates, not vanity metrics.',
    callouts: [
      { label: 'Trust metrics', x: '31%', y: '42%', side: 'left' },
      { label: 'Cost per validated pattern', x: '70%', y: '42%', side: 'right' },
      { label: 'Threshold + action', x: '56%', y: '69%', side: 'right' },
    ] as const,
  },
}

type Callout = {
  label: string
  x: string
  y: string
  side: 'left' | 'right'
}

function Shot({ url, label, file, caption, callouts = [] }: { url: string; label: string; file: string; caption: string; callouts?: readonly Callout[] }) {
  return (
    <figure className="case-shot">
      <div className="case-shot-chrome" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>{url}</em>
      </div>
      <div className="case-shot-media">
        <picture>
          <source srcSet={`${baseUrl}shots/${file}.webp`} type="image/webp" />
          <img src={`${baseUrl}shots/${file}.png`} alt={`${label} screen from the working Opsqora prototype`} loading="lazy" />
        </picture>
        {callouts.map(callout => (
          <span
            className={`case-callout case-callout-${callout.side}`}
            key={callout.label}
            style={{ left: callout.x, top: callout.y }}
          >
            {callout.label}
          </span>
        ))}
      </div>
      <figcaption>
        <strong>{label}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  )
}

function SectionHeader({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return (
    <header className="case-section-header">
      <span>{number}</span>
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </header>
  )
}

function StatLine({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'case-stat-line compact' : 'case-stat-line'} aria-label="Project metrics">
      {metrics.map(metric => <span key={metric}>{metric}</span>)}
    </div>
  )
}

function StackChips() {
  return (
    <div className="case-stack-chips" aria-label="Technology stack">
      {stack.map(item => <span key={item}>{item}</span>)}
    </div>
  )
}

function CaseStudy() {
  return (
    <main className="case-study-page">
      <header className="case-nav">
        <a className="case-logo" href={`${baseUrl}`} aria-label="Opsqora home">
          <img src={`${baseUrl}logo_text_transparent.png`} alt="Opsqora" />
        </a>
        <nav aria-label="Case study sections">
          <a href={`${baseUrl}`}>Live demo ↗</a>
          <a href="#problem">Problem</a>
          <a href="#workflow">Workflow</a>
          <a href="#eval">Eval</a>
          <a href="#results">Results</a>
        </nav>
      </header>

      <div className="case-meta" aria-label="Case study metadata">
        <span><strong>Role</strong> AI PM framing + Frontend</span>
        <span><strong>Type</strong> Phase 1 mocked prototype</span>
        <span><strong>Stack</strong> React · Vite</span>
        <span><strong>Year</strong> 2026</span>
      </div>

      <section className="case-hero">
        <div className="case-hero-copy">
          <span className="case-kicker">AI Product Management · Case Study</span>
          <h1>Recurring support feedback, turned into product decisions you can defend.</h1>
          <p>
            Opsqora helps a small product team find recurring complaints, verify the supporting
            evidence, and turn confirmed patterns into product briefs while keeping AI assistive,
            mocked, and visibly bounded.
          </p>
          <div className="case-actions">
            <a className="case-primary-action" href={`${baseUrl}`}>
              Open live demo <ArrowRight size={17} />
            </a>
            <a className="case-secondary-action" href="https://github.com/mich-mayer/opsqora">
              View repository <GitBranch size={17} />
            </a>
          </div>
        </div>
        <div className="case-hero-media">
          <Shot {...shots.patterns} />
          <StatLine />
        </div>
      </section>

      <section className="case-section case-split" id="problem">
        <div className="case-copy">
          <SectionHeader number="01" eyebrow="The problem" title="A ticket queue is the wrong product surface." />
          <p>
            The first version of Opsqora tried to run support operations. That made the demo
            look like a helpdesk clone and created double work for support agents.
          </p>
          <p>
            The pivot narrows the job: Opsqora sits next to Zendesk, Intercom or Front and
            turns support exports into validated recurring feedback patterns. Support items
            appear only as evidence.
          </p>
        </div>
        <Shot {...shots.patterns} />
      </section>

      <section className="case-section" id="workflow">
        <SectionHeader number="02" eyebrow="How it works" title="One validation loop: suggest, validate, compute, decide." />
        <div className="case-workflow-spine">
          <div className="case-step-list">
            {processSteps.map(([title, copy], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="case-shot-stack">
            <Shot {...shots.review} />
            <Shot {...shots.brief} />
          </div>
        </div>
      </section>

      <section className="case-section case-split reverse" id="eval">
        <div className="case-copy">
          <SectionHeader number="03" eyebrow="AI eval" title="Trust and cost are product requirements." />
          <p>
            The eval dashboard answers two portfolio-grade questions: can we trust the model,
            and what does one validated pattern cost?
          </p>
          <p>
            The most important metrics include pattern precision, evidence precision, high-confidence
            disagreement and cost per validated pattern, each paired with a production action.
          </p>
        </div>
        <Shot {...shots.eval} />
      </section>

      <section className="case-section case-results" id="results">
        <SectionHeader number="04" eyebrow="Results" title="A narrower demo with sharper AI PM judgment." />
        <div className="case-results-grid">
          <div>
            <p>
              The finished prototype shows one fully worked happy path: AI suggests a pattern,
              a human validates evidence, readiness rules pass, a product brief is generated,
              and mocked outcome tracking makes the next PM question visible.
            </p>
            <StatLine compact />
            <StackChips />
          </div>
          <div className="case-final-cta">
            <h3>Explore the validation loop.</h3>
            <p>Everything is frontend-only, deterministic, synthetic and visibly labeled as mocked or illustrative.</p>
            <a className="case-primary-action" href={`${baseUrl}`}>
              Open live demo <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CaseStudy />
  </React.StrictMode>,
)
