import {
  AlertTriangle,
  ArrowRight,
  CircleDollarSign,
  Info,
  LineChart,
  ShieldCheck,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge, PageTitle, Panel } from '../components/primitives'
import { MOCK_LABEL, costByTask, costMetrics, evalRules, evalTrend, qualityMetrics } from '../mock'

export function EvalDashboard() {
  return <>
    <PageTitle
      eyebrow="Model quality and cost"
      title="AI Eval"
      description="Two questions for the prototype: can we trust the model, and what does validated product signal cost?"
      action={<Badge tone="green" dot>{MOCK_LABEL}</Badge>}
    />

    <div className="eval-hero">
      <ShieldCheck size={18} />
      <span>All values are mocked/illustrative. The eval surface shows the production discipline Opsqora would need before real model suggestions reached PM workflows.</span>
    </div>

    <div className="eval-grid">
      <Panel title="Quality metrics" subtitle="Plain-language definitions for non-technical review" className="metric-panel">
        <div className="metric-card-grid">
          {qualityMetrics.map(metric => (
            <article className={metric.emphasis ? 'eval-metric-card emphasis' : 'eval-metric-card'} key={metric.label}>
              <header><span>{metric.label}</span><Info size={13} aria-hidden="true" /></header>
              <strong>{metric.value}</strong>
              <p>{metric.definition}</p>
              <small>{metric.status}</small>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="Cost metrics" subtitle="Cost tied to validated pattern value" className="metric-panel">
        <div className="metric-card-grid cost-grid">
          {costMetrics.map(metric => (
            <article className={metric.emphasis ? 'eval-metric-card emphasis' : 'eval-metric-card'} key={metric.label}>
              <header><span>{metric.label}</span><CircleDollarSign size={13} aria-hidden="true" /></header>
              <strong>{metric.value}</strong>
              <p>{metric.definition}</p>
              <small>{metric.status}</small>
            </article>
          ))}
        </div>
      </Panel>
    </div>

    <Panel title="How I’d evaluate this in production" subtitle="Thresholds paired with product actions, not passive dashboard watching" className="production-eval-panel">
      <div className="production-rule-grid">
        {evalRules.map(rule => (
          <article key={rule.metric}>
            <span><AlertTriangle size={16} /> If {rule.metric} {rule.threshold}</span>
            <p>{rule.action}</p>
          </article>
        ))}
      </div>
    </Panel>

    <div className="eval-chart-grid">
      <Panel title="Quality trend" subtitle="Mocked weekly eval snapshots">
        <div className="chart-lg eval-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evalTrend} margin={{ top: 16, right: 12, left: -15, bottom: 4 }}>
              <defs>
                <linearGradient id="evalPrecision" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3f6b75" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="#3f6b75" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#ddd9d1" strokeDasharray="3 5" />
              <XAxis dataKey="week" axisLine={{ stroke: '#d8d4cc' }} tickLine={false} tick={{ fill: '#737873', fontSize: 11 }} />
              <YAxis domain={[60, 90]} axisLine={false} tickLine={false} tick={{ fill: '#737873', fontSize: 11 }} />
              <Tooltip />
              <Area dataKey="precision" name="Pattern precision" type="monotone" stroke="#3f6b75" fill="url(#evalPrecision)" strokeWidth={3} />
              <Area dataKey="evidence" name="Evidence precision" type="monotone" stroke="#6f8f6a" fill="transparent" strokeWidth={2.5} strokeDasharray="7 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Cost by AI task" subtitle="Mocked daily spend split">
        <div className="chart-lg eval-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costByTask} layout="vertical" margin={{ top: 8, right: 18, left: 50, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#ddd9d1" strokeDasharray="3 5" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#737873', fontSize: 11 }} />
              <YAxis type="category" dataKey="task" width={118} axisLine={false} tickLine={false} tick={{ fill: '#52616a', fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Daily spend']} />
              <Bar dataKey="spend" fill="#3f6b75" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>

    <div className="eval-footer-note">
      <LineChart size={17} />
      <span>Production model choice would split tasks: frontier model for clustering and final synthesis, cheaper model for low-stakes labels and formatting.</span>
      <a href="/opsqora/case-study.html">Case study <ArrowRight size={14} /></a>
    </div>
  </>
}
