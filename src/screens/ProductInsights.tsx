import {
  AlertTriangle, ArrowRight,
  Layers3,
  MessageSquareText,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Area, AreaChart,
  CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import {
  Badge,
  PageTitle, Panel,
  StatCard
} from '../components/primitives'
import {
  COLORS, countBy,
  pretty
} from '../lib'
import type { Ticket } from '../types'

export function ProductInsights({ tickets, goInbox }: { tickets: Ticket[]; goInbox: (search?: string) => void }) {
  const [range, setRange] = useState('30 days')
  const [showBrief, setShowBrief] = useState(false)
  const rangeDays = Number(range.split(' ')[0])
  const rangeTickets = useMemo(() => {
    const latest = new Date(Math.max(...tickets.map(ticket => +new Date(ticket.created_at))))
    latest.setHours(23, 59, 59, 999)
    const start = new Date(latest.getTime() - (rangeDays - 1) * 86400000)
    start.setHours(0, 0, 0, 0)
    return tickets.filter(ticket => { const created = new Date(ticket.created_at); return created >= start && created <= latest })
  }, [rangeDays, tickets])
  const areaData = countBy(rangeTickets, t => t.ai.product_area).slice(0, 8).map(([name, value]) => ({ name: pretty(name), value }))
  const maxAreaValue = areaData[0]?.value ?? 1
  const tags = countBy(rangeTickets.flatMap(t => t.ai.secondary_tags), x => x).slice(0, 10)
  const maxTagValue = tags[0]?.[1] ?? 1
  const trend = useMemo(() => {
    if (rangeTickets.length === 0) return []
    const bucketCount = rangeDays === 7 ? 7 : 10
    const latest = new Date(Math.max(...rangeTickets.map(ticket => +new Date(ticket.created_at))))
    latest.setHours(23, 59, 59, 999)
    const start = new Date(latest.getTime() - (rangeDays - 1) * 86400000)
    start.setHours(0, 0, 0, 0)
    const bucketMs = Math.ceil(rangeDays / bucketCount) * 86400000
    return Array.from({ length: bucketCount }, (_, i) => {
      const bucketStart = new Date(start.getTime() + i * bucketMs)
      const bucketEnd = new Date(Math.min(latest.getTime(), bucketStart.getTime() + bucketMs - 1))
      const bucketTickets = rangeTickets.filter(ticket => { const created = new Date(ticket.created_at); return created >= bucketStart && created <= bucketEnd })
      return { week: rangeDays === 7 ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(bucketStart) : `P${i + 1}`, tickets: bucketTickets.length, risk: bucketTickets.filter(ticket => ['critical', 'high'].includes(ticket.ai.sla_risk)).length }
    })
  }, [rangeDays, rangeTickets])
  const coTags = [['Permissions', 'Billing', 84], ['API', 'Automation', 76], ['Integrations', 'Notifications', 68], ['Timeline', 'Performance', 61], ['Import', 'Timeline', 49]]
  const actions = [
    ['Investigate repeated API task creation failures.', '18 related tickets · strongest selected-range signal', 'High', 'api'],
    ['Review timeline performance for large workspaces.', '14 Enterprise workspaces affected', 'High', 'timeline'],
    ['Clarify billing access permissions after role changes.', '11 tickets · high resolution time', 'Medium', 'billing'],
    ['Improve Slack notification reliability.', '9 tickets across 6 accounts', 'Medium', 'slack'],
    ['Consider roadmap item for recurring task dependencies.', '22 feature requests · strong co-tag signal', 'Opportunity', 'task_dependencies'],
  ]
  return <>
    <PageTitle eyebrow="Voice of customer" title="Product Insights" description="Turn support demand into evidence for product and engineering decisions." action={<select className="compact-select range-select" value={range} onChange={e => setRange(e.target.value)}><option>7 days</option><option>30 days</option><option>90 days</option></select>} />
    <div className="insight-summary"><div><Sparkles size={20} /><span><strong>AI insight brief</strong>The selected {range} highlights API reliability and timeline performance as the largest high-impact support signals.</span></div><button aria-expanded={showBrief} onClick={() => setShowBrief(value => !value)}>{showBrief ? 'Hide brief' : 'Read full brief'} <ArrowRight size={14} /></button></div>
    {showBrief && <div className="insight-brief-detail" role="status"><strong>What changed</strong><span>API creation failures, large-workspace timeline performance, and billing permission issues are the strongest repeated signals. Validate the linked ticket groups before converting any suggestion into roadmap or incident work.</span><button onClick={() => goInbox()}>Inspect supporting tickets <ArrowRight size={14} /></button></div>}
    <div className="stats-grid four"><StatCard label="Product areas tracked" value={areaData.length} delta={`${rangeTickets.length} tickets`} icon={Layers3} /><StatCard label="Repeated pain points" value={new Set(rangeTickets.map(t => t.ai.duplicate_cluster).filter(Boolean)).size} delta="Filtered range" icon={AlertTriangle} tone="amber" /><StatCard label="Feature requests" value={rangeTickets.filter(t => t.feature_request_flag).length} delta="Selected range" icon={MessageSquareText} tone="blue" /><StatCard label="Emerging issues" value={rangeTickets.filter(t => ['critical', 'high'].includes(t.ai.sla_risk)).length} delta="High SLA risk" icon={TrendingUp} tone="red" /></div>
    <div className="grid-main-side insights-grid"><Panel title="Ticket trend over time" subtitle={`Volume and high SLA risk · last ${range}`}><div className="chart-lg"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 16, right: 12, left: -16, bottom: 4 }}><defs><linearGradient id="insightFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#476978" stopOpacity={.2} /><stop offset="1" stopColor="#476978" stopOpacity={.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#ddd9d1" strokeDasharray="3 5" /><XAxis dataKey="week" axisLine={{ stroke: '#d8d4cc' }} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Area dataKey="tickets" name="Tickets" type="monotone" stroke="#476978" strokeWidth={3} fill="url(#insightFill)" /><Area dataKey="risk" name="High SLA risk" type="monotone" stroke="#a95f5f" strokeWidth={2.5} strokeDasharray="7 5" fill="transparent" /></AreaChart></ResponsiveContainer></div></Panel><Panel title="Top product areas" subtitle="Click an area to inspect tickets"><div className="horizontal-bars">{areaData.slice(0, 6).map((item, i) => <button key={item.name} onClick={() => goInbox(item.name)}><span>{item.name}</span><i><b style={{ width: `${item.value / maxAreaValue * 100}%`, background: COLORS[i % COLORS.length] }} /></i><strong>{item.value}</strong></button>)}</div></Panel></div>
    <div className="two-panels"><Panel title="Topic co-occurrence" subtitle="Themes that appear together in the same customer problem"><div className="cooccurrence">{coTags.map(([a, b, value], i) => <button key={a} onClick={() => goInbox(String(a))}><span className="co-node">{a}</span><i><b style={{ width: `${value}%` }} /><em>{value} shared signals</em></i><span className="co-node secondary">{b}</span><strong style={{ opacity: .45 + i * -.06 }}>{Number(value) > 70 ? 'Strong' : Number(value) > 55 ? 'Medium' : 'Growing'}</strong></button>)}</div></Panel><Panel title="Top secondary tags" subtitle="Cross-cutting workflow signals"><div className="tag-ranking">{tags.map(([tag, count], i) => <button key={tag} onClick={() => goInbox(tag)}><span>{i + 1}</span><strong>{pretty(tag)}</strong><i><b style={{ width: `${count / maxTagValue * 100}%` }} /></i><em>{count}</em></button>)}</div></Panel></div>
    <Panel title="Suggested Product Actions" subtitle="Evidence-backed opportunities generated from support patterns"><div className="action-table"><div className="action-head"><span>Suggested action</span><span>Supporting evidence</span><span>Signal</span><span>Owner</span><span /></div>{actions.map(([action, evidence, signal, query], i) => <div className="action-row" key={action}><span className="action-title"><i>{i + 1}</i><strong>{action}</strong></span><span>{evidence}</span><Badge tone={signal === 'High' ? 'red' : signal === 'Medium' ? 'amber' : 'purple'}>{signal}</Badge><span className="owner"><i className="avatar mini">{['PL', 'AM', 'SC', 'JK', 'MR'][i]}</i>{['Platform', 'Core Experience', 'Workspace Admin', 'Integrations', 'Work Management'][i]}</span><button className="icon-btn" aria-label={`Open supporting tickets for ${action}`} onClick={() => goInbox(query)}><ArrowRight size={15} /></button></div>)}</div></Panel>
  </>
}
