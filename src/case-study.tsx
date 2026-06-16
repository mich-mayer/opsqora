import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Gauge,
  GitBranch,
  Inbox,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import './styles.css'

const baseUrl = '/opsqora/'

const metrics = [
  ['500', 'synthetic tickets modeled'],
  ['14', 'product areas tracked'],
  ['18', 'duplicate patterns surfaced'],
  ['6', 'AI quality signals monitored'],
]

const workflow = [
  ['Ingest', 'Support tickets arrive with customer, SLA, channel, and workspace context.', Inbox],
  ['Analyze', 'AI predicts topic, tags, priority, SLA risk, team, confidence, and next action.', Bot],
  ['Review', 'Low-confidence or high-impact cases move into human decision workflows.', ClipboardCheck],
  ['Learn', 'Clusters and product insights turn repeated support demand into roadmap evidence.', BarChart3],
]

const highlights = [
  ['Human control by design', 'AI recommendations are visible and editable. Customer-facing replies remain drafts, and escalation stays under reviewer control.', ShieldCheck],
  ['Operationally dense UI', 'The interface favors sortable queues, compact evidence, filters, and review states over a decorative dashboard.', Gauge],
  ['Synthetic but realistic data', 'The dataset creates reproducible ticket volume, confidence, labels, SLA risk, duplicate clusters, and model error cases.', Database],
  ['Decision support loop', 'Classification, cluster detection, product insights, and quality monitoring share the same ticket evidence model.', Layers3],
]

function CaseStudy() {
  return (
    <main className="case-study-page">
      <header className="case-nav">
        <a className="case-logo" href={`${baseUrl}`} aria-label="Opsqora home">
          <img src={`${baseUrl}logo_text_transparent.png`} alt="Opsqora" />
        </a>
        <nav aria-label="Case study sections">
          <a href="#solution">Solution</a>
          <a href="#architecture">Architecture</a>
          <a href="#results">Results</a>
        </nav>
      </header>

      <section className="case-hero">
        <div className="case-hero-copy">
          <h1>AI-assisted support operations with human review at the center.</h1>
          <p>
            Opsqora turns support tickets into reliable operational signals: classification, SLA risk,
            duplicate clusters, product insights, and quality monitoring in one focused workspace.
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
        <div className="case-product-shot" aria-label="Opsqora product overview">
          <div className="case-shot-top">
            <span />
            <strong>Support Intelligence</strong>
            <em>Live demo</em>
          </div>
          <div className="case-shot-body">
            <div className="case-mini-sidebar">
              {['Overview', 'Inbox', 'Review', 'Clusters', 'Insights'].map((item, index) => (
                <i key={item} className={index === 1 ? 'active' : ''}>{item}</i>
              ))}
            </div>
            <div className="case-mini-main">
              <div className="case-mini-stats">
                <span><strong>500</strong><small>Tickets</small></span>
                <span><strong>91</strong><small>Review</small></span>
                <span><strong>18</strong><small>Clusters</small></span>
              </div>
              <div className="case-mini-chart">
                {[36, 54, 42, 68, 59, 78, 63, 84].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
              </div>
              <div className="case-mini-table">
                {['API task creation failures', 'Timeline latency in large workspaces', 'Billing access after role changes'].map((row, index) => (
                  <span key={row}><b>{row}</b><em>{index === 0 ? 'High risk' : index === 1 ? 'Clustered' : 'Review'}</em></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="case-metrics" aria-label="Project metrics">
        {metrics.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="case-section case-two-column">
        <div>
          <span className="case-kicker">Problem</span>
          <h2>Support teams have signal, but it is scattered across queues.</h2>
        </div>
        <div className="case-copy">
          <p>
            A support ticket contains more than a customer request. It can expose SLA risk, product
            friction, repeated incidents, routing decisions, documentation gaps, and feature demand.
            The hard part is turning that raw volume into trusted action without hiding judgment inside automation.
          </p>
          <p>
            Opsqora explores a safer pattern: AI can organize evidence and recommend decisions, while humans
            keep control over review, edits, escalation, and customer-impacting actions.
          </p>
        </div>
      </section>

      <section className="case-section" id="solution">
        <span className="case-kicker">Solution</span>
        <h2>A compact workspace for ticket intelligence.</h2>
        <div className="case-workflow">
          {workflow.map(([title, copy, Icon]) => (
            <article key={String(title)}>
              <span><Icon size={21} /></span>
              <h3>{String(title)}</h3>
              <p>{String(copy)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="case-section case-two-column" id="architecture">
        <div>
          <span className="case-kicker">Architecture</span>
          <h2>Built as a fast, static GitHub Pages application.</h2>
        </div>
        <div className="case-architecture">
          <div><strong>React + TypeScript</strong><span>Typed UI state, reusable components, and deterministic ticket generation.</span></div>
          <div><strong>Vite on GitHub Pages</strong><span>Static build served from the `/opsqora/` base path.</span></div>
          <div><strong>Recharts + Lucide</strong><span>Operational charts and crisp tool icons without heavy application chrome.</span></div>
          <div><strong>Session-state prototype</strong><span>Review edits, generated tickets, and settings stay local to the browser session.</span></div>
        </div>
      </section>

      <section className="case-section">
        <span className="case-kicker">Implementation Highlights</span>
        <h2>Design choices that make the prototype feel operational.</h2>
        <div className="case-highlight-grid">
          {highlights.map(([title, copy, Icon]) => (
            <article key={String(title)}>
              <Icon size={22} />
              <h3>{String(title)}</h3>
              <p>{String(copy)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="case-section case-results" id="results">
        <div>
          <span className="case-kicker">Results</span>
          <h2>From demo data to an end-to-end support intelligence flow.</h2>
          <p>
            The project now demonstrates the full loop: queue triage, AI classification, human review,
            duplicate detection, product signal analysis, quality evaluation, and safety boundaries.
          </p>
        </div>
        <div className="case-result-list">
          {[
            ['AI Quality', 'Confidence, edit rate, precision, recall, and failure modes are surfaced for review.', Sparkles],
            ['Safe Boundaries', 'No automatic replies, no hidden escalations, and no unreviewed customer-impacting actions.', LockKeyhole],
            ['Product Feedback', 'Repeated pain points are grouped into evidence-backed product actions.', Boxes],
            ['Team Workflow', 'Support, product, and operations can inspect the same structured ticket evidence.', Users],
          ].map(([title, copy, Icon]) => (
            <div key={String(title)}>
              <Icon size={19} />
              <span><strong>{String(title)}</strong><small>{String(copy)}</small></span>
              <CheckCircle2 size={18} />
            </div>
          ))}
        </div>
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
