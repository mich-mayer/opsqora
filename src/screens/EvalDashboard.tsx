import { ArrowUpRight } from 'lucide-react'
import { Chip, ScreenHead, Stat } from '../components/primitives'
import { MOCK_LABEL, costByTask, costMetrics, evalRules, evalTrend, qualityMetrics } from '../mock'
import type { EvalMetric } from '../types'

const BASE = import.meta.env.BASE_URL

function TrendChart() {
  const width = 560
  const height = 236
  const pad = { top: 16, right: 14, bottom: 30, left: 36 }
  const plotW = width - pad.left - pad.right
  const plotH = height - pad.top - pad.bottom
  const min = 60
  const max = 90
  const x = (index: number) => pad.left + (plotW / (evalTrend.length - 1)) * index
  const y = (value: number) => pad.top + ((max - value) / (max - min)) * plotH
  const line = (key: 'precision' | 'evidence') =>
    evalTrend.map((point, index) => `${x(index)},${y(point[key])}`).join(' ')

  return <figure className="trendchart">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Mocked weekly eval trend: pattern precision rises from 69% to 76%, evidence precision from 74% to 81%.">
      {[60, 70, 80, 90].map(tick => <g key={tick}>
        <line x1={pad.left} y1={y(tick)} x2={width - pad.right} y2={y(tick)} className={tick === 70 ? 'grid grid--rule' : 'grid'} />
        <text x={pad.left - 8} y={y(tick) + 3} className="axis" textAnchor="end">{tick}</text>
      </g>)}
      {evalTrend.map((point, index) => <text key={point.week} x={x(index)} y={height - 8} className="axis" textAnchor="middle">{point.week}</text>)}
      <polyline points={line('evidence')} className="series series--evidence" />
      <polyline points={line('precision')} className="series series--precision" />
      {evalTrend.map((point, index) => <rect key={`e-${point.week}`} x={x(index) - 3} y={y(point.evidence) - 3} width="6" height="6" className="marker marker--evidence" />)}
      {evalTrend.map((point, index) => <rect key={`p-${point.week}`} x={x(index) - 3} y={y(point.precision) - 3} width="6" height="6" className="marker marker--precision" />)}
    </svg>
    <figcaption>
      <span className="legend legend--precision">Pattern precision</span>
      <span className="legend legend--evidence">Evidence precision</span>
      <span className="legend legend--rule">70% launch threshold</span>
    </figcaption>
  </figure>
}

function CostBars() {
  const maxShare = Math.max(...costByTask.map(task => task.share))
  return <div className="costbars">
    {costByTask.map(task => <div className="costbar" key={task.task}>
      <span className="costbar-label">{task.task}</span>
      <span className="costbar-track"><i style={{ width: `${(task.share / maxShare) * 100}%` }} /></span>
      <span className="costbar-value">${task.spend.toFixed(2)} · {task.share}%</span>
    </div>)}
  </div>
}

function metricStatus(metric: EvalMetric) {
  const status = metric.status.toLowerCase()
  if (status.includes('below target') || status.includes('needs prompt')) {
    return { tone: 'bad' as const, label: 'Needs review' }
  }
  if (status.includes('watchlist') || status.includes('estimated')) {
    return { tone: 'warn' as const, label: 'Watchlist' }
  }
  if (status.includes('above') || status.includes('healthy') || status.includes('key value')) {
    return { tone: 'ok' as const, label: 'Healthy' }
  }

  return { tone: 'line' as const, label: 'Context' }
}

function MetricTable({ title, note, metrics }: { title: string; note: string; metrics: EvalMetric[] }) {
  return <section className="metric-block">
    <header className="block-head">
      <h2>{title}</h2>
      <p>{note}</p>
    </header>
    <table className="metric-table">
      <thead>
        <tr>
          <th scope="col">Metric</th>
          <th scope="col" className="col-value">Value</th>
          <th scope="col">Plain-language definition</th>
          <th scope="col" className="col-status">Status</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map(metric => {
          const status = metricStatus(metric)
          return <tr key={metric.label} className={metric.emphasis ? 'is-emphasis' : ''}>
            <td className="cell-metric">{metric.label}</td>
            <td className="col-value cell-value">{metric.value}</td>
            <td className="cell-definition">{metric.definition}</td>
            <td className="col-status cell-status">
              <Chip tone={status.tone} square>{status.label}</Chip>
              <span>{metric.status}</span>
            </td>
          </tr>
        })}
      </tbody>
    </table>
  </section>
}

export function EvalDashboard() {
  return <>
    <ScreenHead
      index="04"
      kicker="Model quality and cost"
      title="AI Eval"
      lede="Two questions for the prototype: can we trust the model, and what does validated product signal cost?"
      aside={<Chip tone="line" square>{MOCK_LABEL}</Chip>}
    />

    <p className="eval-note">
      All values are mocked and illustrative. This surface shows the production discipline Opsqora
      would need before real model suggestions reached PM workflows.
    </p>

    <div className="stat-band">
      <Stat label="Pattern precision" value="76%" note="Target ≥ 70%" />
      <Stat label="Pattern F1" value="69%" note="Precision + recall" />
      <Stat label="Evidence precision" value="81%" note="Target ≥ 80%" />
      <Stat label="Cost per validated pattern" value="$8.90" note="Key value metric" />
    </div>

    <MetricTable title="Quality metrics" note="Plain-language definitions for non-technical review." metrics={qualityMetrics} />
    <section className="chart-block">
      <header className="block-head">
        <h2>Quality trend</h2>
        <p>Mocked weekly eval snapshots.</p>
      </header>
      <TrendChart />
    </section>

    <MetricTable title="Cost metrics" note="Cost tied to validated pattern value, not raw model activity." metrics={costMetrics} />
    <section className="chart-block">
      <header className="block-head">
        <h2>Cost by AI task</h2>
        <p>Mocked daily spend split — $38 total.</p>
      </header>
      <CostBars />
    </section>

    <section className="eval-rules">
      <header className="block-head">
        <h2>How I’d evaluate this in production</h2>
        <p>Thresholds paired with product actions, not passive dashboard watching.</p>
      </header>
      <div className="eval-rules-grid">
        {evalRules.map(rule => <article key={rule.metric}>
          <span className="eval-rule-if">If {rule.metric} {rule.threshold}</span>
          <p>{rule.action}</p>
        </article>)}
      </div>
    </section>

    <p className="eval-foot">
      Production model choice would split tasks: a frontier model for clustering and final synthesis,
      a cheaper model for low-stakes labels and formatting.
      <a href={`${BASE}case-study.html`}>Case study <ArrowUpRight size={13} /></a>
    </p>
  </>
}
