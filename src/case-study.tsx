import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ArrowRight,
  GitBranch,
  Zap,
} from 'lucide-react'
import './styles.css'

const baseUrl = '/opsqora/'

const metrics = [
  '500 synthetic tickets',
  '14 product areas',
  '18 duplicate patterns',
  '6 AI quality signals',
]

const processSteps = [
  ['Ingest', 'Support tickets arrive with customer, SLA, channel, and workspace context.'],
  ['Analyze', 'AI predicts topic, tags, priority, SLA risk, team, confidence, and next action.'],
  ['Review', 'Low-confidence or high-impact cases move into human decision workflows.'],
  ['Learn', 'Clusters and product insights turn repeated support demand into roadmap evidence.'],
]

const stack = ['React', 'TypeScript', 'Vite', 'Recharts', 'Lucide', 'GitHub Pages']

const shots = {
  overview: {
    url: 'opsqora.app/overview',
    label: 'Overview',
    file: 'overview@2x',
    caption: 'Operational state at a glance: volume, SLA risk, review load and emerging clusters.',
  },
  inbox: {
    url: 'opsqora.app/inbox',
    label: 'Inbox',
    file: 'inbox@2x',
    caption: '500 searchable tickets with separate operational and AI-review state.',
  },
  review: {
    url: 'opsqora.app/review',
    label: 'Ticket review',
    file: 'review@2x',
    caption: 'AI analysis on the left, the human decision on the right. Replies stay drafts.',
    callouts: [
      { label: 'AI confidence', x: '70%', y: '47%', side: 'right' },
      { label: 'Why AI classified it', x: '57%', y: '88%', side: 'left' },
      { label: 'Human decision', x: '82%', y: '50%', side: 'right' },
    ] as const,
    zoom: 'Confidence + review reasons stay visible before approval.',
  },
  clusters: {
    url: 'opsqora.app/clusters',
    label: 'Duplicate clusters',
    file: 'clusters@2x',
    caption: 'A validated drawer shows why related tickets were grouped before escalation.',
  },
  quality: {
    url: 'opsqora.app/quality',
    label: 'AI quality',
    file: 'quality@2x',
    caption: 'Accuracy, edit rate, confidence and failure modes, made measurable.',
    callouts: [
      { label: 'Edit rate', x: '75%', y: '44%', side: 'right' },
      { label: 'Failure modes', x: '84%', y: '82%', side: 'right' },
    ] as const,
  },
  dataset: {
    url: 'opsqora.app/dataset',
    label: 'Dataset',
    file: 'dataset@2x',
    caption: 'Synthetic support data stays transparent, deterministic and reviewable.',
  },
}

type Callout = {
  label: string
  x: string
  y: string
  side: 'left' | 'right'
}

function Shot({ url, label, file, caption, callouts = [], zoom }: { url: string; label: string; file: string; caption: string; callouts?: readonly Callout[]; zoom?: string }) {
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
        {zoom && <span className="case-zoom-crop">{zoom}</span>}
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

const ctaLinks = [
  ['Open live demo', baseUrl],
  ['View repository', 'https://github.com/mich-mayer/opsqora'],
]

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
          <a href="#results">Results</a>
        </nav>
      </header>

      <div className="case-meta" aria-label="Case study metadata">
        <span><strong>Role</strong> Product design + Frontend</span>
        <span><strong>Type</strong> Phase 1 prototype</span>
        <span><strong>Stack</strong> React · Vite</span>
        <span><strong>Year</strong> 2026</span>
      </div>

      <section className="case-hero">
        <div className="case-hero-copy">
          <span className="case-kicker">AI Support Operations · Case Study</span>
          <h1>Support tickets, turned into decisions you can trust.</h1>
          <p>
            Opsqora turns B2B support demand — classification, SLA risk, duplicate clusters and
            product signal — into reliable operational evidence, while keeping every customer-impacting
            decision with a human.
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
          <Shot {...shots.overview} />
          <StatLine />
        </div>
      </section>

      <section className="case-section case-split" id="problem">
        <div className="case-copy">
          <SectionHeader number="01" eyebrow="The problem" title="A ticket holds more signal than a single request." />
          <p>
            A support ticket can expose SLA risk, product friction, repeated incidents,
            routing decisions, documentation gaps and feature demand. The hard part is
            turning that raw volume into trusted action.
          </p>
          <p>
            Opsqora explores a safer pattern: AI can organize evidence and recommend decisions,
            while humans keep control over review, edits, escalation and customer-impacting actions.
          </p>
        </div>
        <Shot {...shots.inbox} />
      </section>

      <section className="case-section" id="workflow">
        <SectionHeader number="02" eyebrow="How it works" title="One evidence model, four moves: ingest, analyze, review, learn." />
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
          <Shot {...shots.clusters} />
        </div>
      </section>

      <section className="case-section case-split reverse">
        <div className="case-copy">
          <SectionHeader number="03" eyebrow="Human in the loop" title="AI organizes the evidence. People stay accountable." />
          <p>
            AI recommendations are visible and editable. Customer-facing replies remain drafts,
            and escalation stays under reviewer control.
          </p>
          <p>
            The interface favors sortable queues, compact evidence, filters and review states
            over decorative dashboard chrome.
          </p>
        </div>
        <div className="case-shot-stack">
          <Shot {...shots.review} />
          <Shot {...shots.quality} />
        </div>
      </section>

      <section className="case-section case-results" id="results">
        <div className="case-copy">
          <SectionHeader number="04" eyebrow="Results" title="An end-to-end support intelligence loop — as a demo." />
          <p>
            The project demonstrates queue triage, AI classification, human review, duplicate
            detection, product signal analysis, quality evaluation and safety boundaries.
          </p>
          <StatLine compact />
          <StackChips />
          <div className="case-result-links">
            {ctaLinks.map(([label, href]) => (
              <a key={label} href={href}>
                {label} <ArrowRight size={15} />
              </a>
            ))}
          </div>
        </div>
        <Shot {...shots.dataset} />
      </section>

      <section className="case-cta">
        <Zap size={22} />
        <h2>Explore the working prototype.</h2>
        <p>The case study is paired with the interactive dashboard, so the project can be reviewed as both narrative and product.</p>
        <a className="case-primary-action" href={`${baseUrl}`}>Open Opsqora <ArrowRight size={17} /></a>
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CaseStudy />
  </React.StrictMode>,
)
