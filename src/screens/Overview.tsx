import {
  AlertTriangle, ArrowRight, BarChart3, Bot, Boxes,
  CircleGauge,
  ClipboardCheck,
  Gauge, Inbox,
  Layers3,
  SlidersHorizontal, Sparkles,
  TrendingDown, TrendingUp
} from 'lucide-react'
import { useMemo } from 'react'
import {
  Area, AreaChart,
  CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import {
  Badge,
  Panel,
  StatCard
} from '../components/primitives'
import {
  CLUSTER_SUMMARIES
} from '../data'
import {
  countBy, humanReviewReasons, operationalNow, parseDateKey,
  pretty,
  slaInfo
} from '../lib'
import type { Page, QueueId, Ticket } from '../types'

export function Overview({ tickets, go, openQueue, period, customStart, customEnd, reviewThreshold }: { tickets: Ticket[]; go: (page: Page) => void; openQueue: (queue: QueueId) => void; period: number | 'custom'; customStart: string; customEnd: string; reviewThreshold: number }) {
  const latestDate = useMemo(() => {
    const date = new Date(Math.max(...tickets.map(ticket => +new Date(ticket.created_at))))
    date.setHours(0, 0, 0, 0)
    return date
  }, [tickets])
  const periodStart = useMemo(() => period === 'custom' ? parseDateKey(customStart) : new Date(latestDate.getTime() - (period - 1) * 86400000), [customStart, latestDate, period])
  const periodEnd = useMemo(() => period === 'custom' ? parseDateKey(customEnd) : latestDate, [customEnd, latestDate, period])
  const periodDays = Math.max(1, Math.round((periodEnd.getTime() - periodStart.getTime()) / 86400000) + 1)
  const periodTickets = useMemo(() => { const end = new Date(periodEnd); end.setHours(23, 59, 59, 999); return tickets.filter(ticket => { const created = new Date(ticket.created_at); return created >= periodStart && created <= end }) }, [periodEnd, periodStart, tickets])
  const needsReview = periodTickets.filter(ticket => humanReviewReasons(ticket, reviewThreshold).length > 0).length
  const now = operationalNow(tickets)
  const highRisk = periodTickets.filter(ticket => ['red', 'amber'].includes(slaInfo(ticket, now).tone)).length
  const clusters = new Set(periodTickets.map(t => t.ai.duplicate_cluster).filter(Boolean)).size
  const edited = periodTickets.filter(t => t.ai.review_status === 'Edited').length
  const lowConfidence = periodTickets.filter(t => t.ai.confidence < reviewThreshold).length
  const volume = useMemo(() => {
    const counts = tickets.reduce<Record<string, { tickets: number; reviewed: number }>>((acc, ticket) => {
      const key = ticket.created_at.slice(0, 10)
      acc[key] ??= { tickets: 0, reviewed: 0 }
      acc[key].tickets += 1
      if (['Approved', 'Edited'].includes(ticket.ai.review_status)) acc[key].reviewed += 1
      return acc
    }, {})
    return Array.from({ length: periodDays }, (_, dayIndex) => {
      const date = new Date(periodStart.getTime() + dayIndex * 86400000)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      return {
        day: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date),
        tickets: counts[key]?.tickets ?? 0,
        reviewed: counts[key]?.reviewed ?? 0,
      }
    })
  }, [periodDays, periodStart, tickets])
  const areas = countBy(periodTickets, t => t.ai.product_area).slice(0, 6)
  const maxArea = areas[0]?.[1] ?? 1
  const periodRatio = Math.max(.2, periodTickets.length / tickets.length)
  const clusterRows = CLUSTER_SUMMARIES.slice(0, 5).map((name, i) => ({ name, count: Math.max(2, Math.round((18 - i * 2) * periodRatio)), signal: i < 2 ? 'High signal' : i === 2 ? 'Stabilizing' : 'Monitor' }))
  const dateRange = `${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(periodStart)} – ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(periodEnd)}`
  const periodLabel = period === 'custom' ? dateRange : `last ${period} days`
  return <>
    <div className="overview-descriptor">
      <Sparkles size={16} />
      <span>Phase 1 visual prototype for AI-assisted support operations: AI organizes ticket evidence while humans keep control of customer-impacting decisions.</span>
    </div>
    <div className="stats-grid six">
      <StatCard label="Tickets in period" value={periodTickets.length} delta="Selected range" icon={Inbox} tone="purple" onClick={() => openQueue('all')} />
      <StatCard label="Needs human review" value={needsReview} delta="Action required" icon={ClipboardCheck} tone="amber" onClick={() => openQueue('human-review')} />
      <StatCard label="SLA at risk" value={highRisk} delta="Prioritized" icon={AlertTriangle} tone="red" onClick={() => openQueue('sla')} />
      <StatCard label="Duplicate clusters" value={clusters} delta="Selected range" icon={Boxes} tone="blue" onClick={() => go('clusters')} />
      <StatCard label="AI edit rate" value={`${Math.round(edited / Math.max(1, periodTickets.length) * 100)}%`} delta="Live rate" icon={SlidersHorizontal} tone="green" onClick={() => go('quality')} />
      <StatCard label="Low-confidence cases" value={lowConfidence} delta={`${Math.round(reviewThreshold * 100)}% threshold`} icon={Gauge} tone="purple" onClick={() => go('quality')} />
    </div>
    <div className="grid-main-side">
      <Panel title="Ticket volume" subtitle={`New and reviewed tickets · ${dateRange}`}>
        <div className="chart-lg"><ResponsiveContainer width="100%" height="100%"><AreaChart data={volume} margin={{ top: 20, right: 12, left: -18, bottom: 4 }}><defs><linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#476978" stopOpacity={.2} /><stop offset="100%" stopColor="#476978" stopOpacity={.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#ddd9d1" strokeDasharray="3 5" /><XAxis dataKey="day" axisLine={{ stroke: '#d8d4cc' }} tickLine={false} minTickGap={22} tick={{ fill: '#737873', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: '#737873', fontSize: 11 }} /><Tooltip cursor={{ stroke: '#9aa7a4', strokeDasharray: '3 4' }} contentStyle={{ border: '1px solid #d9d5cd', borderRadius: 9, background: '#fffefa', boxShadow: '0 8px 24px rgba(46,48,46,.1)' }} /><Area type="monotone" dataKey="tickets" name="New tickets" stroke="#476978" strokeWidth={3} fill="url(#volumeFill)" dot={{ r: 2, fill: '#476978', strokeWidth: 0 }} activeDot={{ r: 4, fill: '#476978', stroke: '#fffefa', strokeWidth: 2 }} /><Area type="monotone" dataKey="reviewed" name="Reviewed" stroke="#668878" strokeWidth={2.5} fill="transparent" strokeDasharray="7 5" dot={{ r: 1.8, fill: '#668878', strokeWidth: 0 }} activeDot={{ r: 4, fill: '#668878', stroke: '#fffefa', strokeWidth: 2 }} /></AreaChart></ResponsiveContainer></div>
        <div className="chart-legend"><span><i className="legend-purple" />New tickets</span><span><i className="legend-green legend-dashed" />Reviewed</span></div>
      </Panel>
      <Panel title="Recent AI activity" subtitle="Live analysis stream" action={<Badge tone="green" dot>Analysis service online</Badge>}>
        <div className="activity-list">
          {tickets.slice(11, 16).map((ticket, i) => <button key={ticket.ticket_id} className="activity-row" onClick={() => go('inbox')}><div className={`activity-icon activity-${i % 3}`}><Bot size={15} /></div><div><strong>{ticket.ticket_id} classified</strong><span>{pretty(ticket.ai.primary_topic)} · {ticket.ai.secondary_tags.length} tags</span></div><time>{2 + i * 3}m</time></button>)}
        </div>
        <button className="text-link wide" onClick={() => go('inbox')}>View analysis queue <ArrowRight size={14} /></button>
      </Panel>
    </div>
    <div className="three-panels">
      <Panel title="Top product areas" subtitle={`By ticket volume · ${periodLabel}`}><div className="rank-list">{areas.map(([area, count], i) => <button key={area} onClick={() => go('insights')}><span className="rank">{i + 1}</span><span className="rank-label">{pretty(area)}<i><b style={{ width: `${count / maxArea * 100}%` }} /></i></span><strong>{count}</strong></button>)}</div></Panel>
      <Panel title="Top issue clusters" subtitle={`Repeated customer pain points · ${periodLabel}`}><div className="cluster-mini-list">{clusterRows.map((row, i) => <button key={row.name} onClick={() => go('clusters')}><span className={`cluster-signal signal-${i % 3}`}><Layers3 size={15} /></span><div><strong>{row.name}</strong><span>{row.count} tickets</span></div><em className={i < 2 ? 'trend-up' : 'trend-down'}>{i < 2 ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {row.signal}</em></button>)}</div></Panel>
      <Panel title="Quick actions" subtitle="Move from signal to decision"><div className="quick-actions"><button onClick={() => openQueue('human-review')}><span><Inbox size={18} /></span><div><strong>Review flagged tickets</strong><small>{needsReview} require a human decision</small></div><ArrowRight size={16} /></button><button onClick={() => go('insights')}><span><BarChart3 size={18} /></span><div><strong>Explore product insights</strong><small>5 suggested actions</small></div><ArrowRight size={16} /></button><button onClick={() => go('quality')}><span><CircleGauge size={18} /></span><div><strong>Inspect AI quality</strong><small>{lowConfidence} low-confidence cases</small></div><ArrowRight size={16} /></button></div></Panel>
    </div>
  </>
}
