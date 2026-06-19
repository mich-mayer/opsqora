import {
  ArrowRight,
  Bot,
  ExternalLink, FileText,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react'
import { useState } from 'react'
import {
  Area, AreaChart,
  CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import {
  Badge,
  PageTitle, Panel,
  StatusBadge
} from '../components/primitives'
import {
  COLORS,
  pretty
} from '../lib'
import type { Ticket } from '../types'

export function AIQuality({ tickets, openTicket, openLowConfidenceCases, reviewThreshold }: { tickets: Ticket[]; openTicket: (id: string) => void; openLowConfidenceCases: () => void; reviewThreshold: number }) {
  const [evaluationRun, setEvaluationRun] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  const editedCount = tickets.filter(ticket => ticket.ai.review_status === 'Edited').length
  const lowConfidenceCount = tickets.filter(ticket => ticket.ai.confidence < reviewThreshold).length
  const formatRate = (count: number) => `${(count / Math.max(1, tickets.length) * 100).toFixed(1)}%`
  const metrics = [
    { label: 'Primary topic accuracy', value: '91.8%', delta: '+1.4', source: 'snapshot' },
    { label: 'Tag precision', value: '89.6%', delta: '+0.8', source: 'snapshot' },
    { label: 'Tag recall', value: '86.4%', delta: '+2.1', source: 'snapshot' },
    { label: 'Tag F1 score', value: '88.0%', delta: '+1.5', source: 'snapshot' },
    { label: 'Priority accuracy', value: '93.2%', delta: '+0.4', source: 'snapshot' },
    { label: 'SLA risk recall', value: '94.1%', delta: '+1.1', source: 'snapshot' },
    { label: 'Product area accuracy', value: '92.6%', delta: '+0.7', source: 'snapshot' },
    { label: 'Cluster purity', value: '90.3%', delta: '-0.5', source: 'snapshot' },
    { label: 'Human edit rate', value: formatRate(editedCount), delta: 'Live tickets', source: 'live' },
    { label: 'Low-confidence rate', value: formatRate(lowConfidenceCount), delta: `${Math.round(reviewThreshold * 100)}% threshold`, source: 'live' },
    { label: 'Missing critical tag', value: '2.6%', delta: '-0.9', source: 'snapshot' },
    { label: 'Over-tagging rate', value: '4.1%', delta: '-0.4', source: 'snapshot' },
    { label: 'Hallucination rate', value: '0.8%', delta: '-0.2', source: 'snapshot' },
    { label: 'JSON validity rate', value: '99.8%', delta: '+0.1', source: 'snapshot' },
    { label: 'Regression pass rate', value: '97.2%', delta: '+0.6', source: 'snapshot' },
  ]
  const trend = Array.from({ length: 8 }, (_, i) => ({ run: `R${i + 1}`, accuracy: 87 + i * .7 + (i % 2), f1: 83 + i * .8, recall: 88 + i * .65 }))
  const lowCases = tickets.filter(t => t.ai.confidence < reviewThreshold).slice(0, 7)
  const errorData = [{ name: 'Wrong topic', value: 34 }, { name: 'Missing tag', value: 28 }, { name: 'Wrong routing', value: 17 }, { name: 'Priority', value: 12 }, { name: 'Cluster', value: 9 }]
  return <>
    <PageTitle eyebrow="Evaluation & governance" title="AI Quality" description="Live operational review rates plus an illustrative evaluation snapshot for model governance." action={<><Badge tone="green" dot>Regression suite passed</Badge><button className="btn btn-secondary" onClick={() => setEvaluationRun(true)}><RefreshCcw size={15} /> {evaluationRun ? 'Evaluation complete' : 'Run evaluation'}</button></>} />
    <div className="quality-note"><ShieldCheck size={18} /><div><strong>{evaluationRun ? 'Evaluation completed just now' : 'Evaluation snapshot · June 12, 2026'}</strong><span>Live edit/confidence rates from current tickets · other quality metrics are illustrative synthetic evaluation data</span></div><button aria-expanded={showMethodology} onClick={() => setShowMethodology(value => !value)}>{showMethodology ? 'Hide methodology' : 'View methodology'} <ExternalLink size={13} /></button></div>
    {showMethodology && <div className="methodology-detail" role="status"><strong>Evaluation methodology</strong><span>Human edit rate and low-confidence rate are derived from the current synthetic tickets and the shared review threshold. Accuracy, recall, error categories, deltas, and run trends are an illustrative evaluation snapshot, not production performance.</span></div>}
    <div className="quality-metrics">{metrics.map(({ label, value, delta, source }, i) => {
      const lowerIsBetter = label.includes('rate') || label.includes('Missing') || label.includes('Over')
      const deltaClass = source === 'live' ? 'good' : lowerIsBetter ? (delta.startsWith('-') ? 'good' : 'bad') : (delta.startsWith('+') ? 'good' : 'bad')
      const deltaText = source === 'live' ? delta : `${delta.startsWith('+') ? '↑' : '↓'} ${delta.replace('-', '')} pts`
      return <div key={label}><span>{label}</span><strong>{value}</strong><small className={deltaClass}>{deltaText}</small><i><b style={{ width: value, background: i > 7 && i < 13 ? '#b08a62' : '#607d8b' }} /></i></div>
    })}</div>
    <div className="grid-main-side"><Panel title="Metric trends" subtitle="Performance across the last eight evaluation runs"><div className="chart-lg"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 16, right: 12, left: -15, bottom: 4 }}><CartesianGrid vertical={false} stroke="#ddd9d1" strokeDasharray="3 5" /><XAxis dataKey="run" axisLine={{ stroke: '#d8d4cc' }} tickLine={false} /><YAxis domain={[75, 100]} axisLine={false} tickLine={false} /><Tooltip /><Area dataKey="accuracy" name="Topic accuracy" type="monotone" stroke="#476978" fill="transparent" strokeWidth={3} /><Area dataKey="f1" name="Tag F1" type="monotone" stroke="#668878" fill="transparent" strokeWidth={2.5} strokeDasharray="7 5" /><Area dataKey="recall" name="SLA recall" type="monotone" stroke="#a9784f" fill="transparent" strokeWidth={2.5} strokeDasharray="2 4" /></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-purple" />Topic accuracy</span><span><i className="legend-green legend-dashed" />Tag F1</span><span><i className="legend-amber legend-dotted" />SLA recall</span></div></Panel><Panel title="Error breakdown" subtitle="61 reviewed model errors"><div className="donut-wrap"><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={errorData} dataKey="value" innerRadius={52} outerRadius={76} paddingAngle={3} stroke="#fffefa" strokeWidth={2}>{errorData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><span><strong>61</strong>errors</span></div><div className="donut-legend">{errorData.map((item, i) => <div key={item.name}><i style={{ background: COLORS[i] }} /><span>{item.name}</span><strong>{item.value}%</strong></div>)}</div></div></Panel></div>
    <div className="two-panels"><Panel title="Most edited topics" subtitle="Where human reviewers correct the primary label"><div className="horizontal-bars compact">{[['Permissions', 24], ['Integrations', 18], ['Automation', 15], ['Workspace Access', 11], ['Billing', 9]].map(([name, value], i) => <div key={name}><span>{name}</span><i><b style={{ width: `${Number(value) / 24 * 100}%`, background: COLORS[i] }} /></i><strong>{value}</strong></div>)}</div></Panel><Panel title="Recent review corrections" subtitle="Feedback captured for future model improvement"><div className="correction-list">{tickets.filter(t => t.ai.review_status === 'Edited').slice(0, 5).map(t => <button key={t.ticket_id} onClick={() => openTicket(t.ticket_id)}><span>{t.ticket_id}</span><div><strong>{pretty(t.primary_topic)} → {pretty(t.ai.primary_topic)}</strong><small>{t.reviewer_note}</small></div><ArrowRight size={14} /></button>)}</div></Panel></div>
    <Panel title="Low-confidence evaluation cases" subtitle={`Cases below the ${Math.round(reviewThreshold * 100)}% review threshold`} action={<button className="text-link" onClick={openLowConfidenceCases}>View all cases <ArrowRight size={14} /></button>}><div className="evaluation-table"><div className="evaluation-head"><span>Case</span><span>Ticket</span><span>Expected / predicted topic</span><span>Expected / predicted tags</span><span>Priority</span><span>SLA risk</span><span>Confidence</span><span>Review</span></div>{lowCases.map((t, i) => <button key={t.ticket_id} onClick={() => openTicket(t.ticket_id)}><span>EV-{String(201 + i).padStart(3, '0')}</span><strong>{t.ticket_id}</strong><span><b>{pretty(t.primary_topic)}</b><small>{pretty(t.ai.primary_topic)}</small></span><span><b>{t.secondary_tags.length} expected</b><small>{t.ai.secondary_tags.length} predicted</small></span><span>{t.expected_priority === t.ai.priority ? <Badge tone="green">Correct</Badge> : <Badge tone="red">Mismatch</Badge>}</span><span>{t.expected_sla_risk === t.ai.sla_risk ? <Badge tone="green">Correct</Badge> : <Badge tone="red">Mismatch</Badge>}</span><strong className="confidence-text-low">{Math.round(t.ai.confidence * 100)}%</strong><StatusBadge status={t.ai.review_status} /></button>)}</div></Panel>
    <div className="method-cards"><div><Bot size={20} /><span><strong>Analysis service</strong><p>Structured outputs support consistent classification, routing, prioritization, and review.</p></span></div><div><FileText size={20} /><span><strong>Evaluation methodology</strong><p>Predictions are compared with reviewed labels across classification, tagging, risk, and clustering.</p></span></div><div><ShieldCheck size={20} /><span><strong>Human oversight</strong><p>Every recommendation remains reviewable, editable, and auditable before any operational use.</p></span></div></div>
  </>
}
