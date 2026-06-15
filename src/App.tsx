import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Bell, Bot, Boxes, Check,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleGauge, ClipboardCheck,
  Clock3, Database, Download, ExternalLink, FileText, Filter, Flag, Gauge,
  Inbox, Info, Layers3, LayoutDashboard, LifeBuoy, ListFilter, LockKeyhole,
  MessageSquareText, MoreHorizontal, Plus, RefreshCcw, RotateCcw, Search, Settings,
  ShieldCheck, SlidersHorizontal, Sparkles, Tag, TrendingDown, TrendingUp, Users,
  X, Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { CLUSTER_SUMMARIES, generateTickets, PRIMARY_TOPICS, PRODUCT_AREAS, SECONDARY_TAGS, SUPPORT_AGENTS, TEAMS } from './data'
import type { Page, Priority, ReviewStatus, Risk, Ticket, TicketStatus } from './types'

const COLORS = ['#476978', '#668878', '#a9784f', '#a95f5f', '#67839a', '#7f718c']
const priorityOrder: Record<Priority, number> = { P1: 1, P2: 2, P3: 3, P4: 4 }

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inbox', label: 'Ticket Inbox', icon: Inbox },
  { id: 'review', label: 'Ticket Review', icon: ClipboardCheck },
  { id: 'clusters', label: 'Duplicate Clusters', icon: Boxes },
  { id: 'insights', label: 'Product Insights', icon: BarChart3 },
  { id: 'quality', label: 'AI Quality', icon: CircleGauge },
  { id: 'dataset', label: 'Dataset', icon: Database },
  { id: 'safety', label: 'Safety / About', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const pretty = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
const shortDate = (value: string) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const parseDateKey = (value: string) => { const [year, month, day] = value.split('-').map(Number); return new Date(year, month - 1, day) }
const operationalNow = (tickets: Ticket[]) => Math.max(...tickets.map(ticket => +new Date(ticket.created_at))) + 12 * 3600000
const slaInfo = (ticket: Ticket, now: number) => {
  if (ticket.ticket_status === 'Solved') return { label: 'SLA met', tone: 'green', sort: Number.POSITIVE_INFINITY }
  const minutes = Math.round((+new Date(ticket.sla_due_at) - now) / 60000)
  const absolute = Math.abs(minutes)
  const duration = absolute >= 1440 ? `${Math.floor(absolute / 1440)}d ${Math.floor(absolute % 1440 / 60)}h` : absolute >= 60 ? `${Math.floor(absolute / 60)}h ${absolute % 60}m` : `${absolute}m`
  return minutes < 0 ? { label: `${duration} overdue`, tone: 'red', sort: minutes } : minutes <= 480 ? { label: `${duration} left`, tone: 'amber', sort: minutes } : { label: `${duration} left`, tone: 'green', sort: minutes }
}
const humanReviewReasons = (ticket: Ticket) => {
  if (['Approved', 'Edited'].includes(ticket.ai.review_status)) return []
  const reasons: string[] = []
  if (ticket.human_review_requested) reasons.push('Manual request')
  if (ticket.ai.confidence < .7) reasons.push('Low confidence')
  if (['critical', 'high'].includes(ticket.ai.sla_risk)) reasons.push('High SLA risk')
  if (['workspace blocked', 'critical workflow degraded'].includes(ticket.ai.impact)) reasons.push('High customer impact')
  if (ticket.escalation_flag) reasons.push('Escalation candidate')
  return reasons
}
const countBy = <T,>(items: T[], getter: (item: T) => string) => Object.entries(items.reduce<Record<string, number>>((acc, item) => {
  const key = getter(item)
  acc[key] = (acc[key] ?? 0) + 1
  return acc
}, {})).sort((a, b) => b[1] - a[1])

function Badge({ children, tone = 'neutral', dot = false }: { children: React.ReactNode; tone?: string; dot?: boolean }) {
  return <span className={`badge badge-${tone}`}>{dot && <i />} {children}</span>
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const tones: Record<ReviewStatus, string> = {
    'Not analyzed': 'neutral', Analyzed: 'blue', 'Needs review': 'amber', Approved: 'green', Edited: 'purple', Escalated: 'red',
  }
  return <Badge tone={tones[status]} dot>{status}</Badge>
}

function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const tones: Record<TicketStatus, string> = { New: 'blue', Open: 'purple', Pending: 'amber', Solved: 'green' }
  return <Badge tone={tones[status]} dot>{status}</Badge>
}

function RiskBadge({ risk }: { risk: Risk }) {
  const tone = risk === 'critical' ? 'red' : risk === 'high' ? 'amber' : risk === 'medium' ? 'blue' : 'green'
  return <Badge tone={tone}>{pretty(risk)}</Badge>
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const tone = priority === 'P1' ? 'red' : priority === 'P2' ? 'amber' : priority === 'P3' ? 'blue' : 'neutral'
  return <Badge tone={tone}>{priority}</Badge>
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-title">
    <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div>
    {action && <div className="page-actions">{action}</div>}
  </div>
}

function StatCard({ label, value, delta, icon: Icon, tone = 'purple', onClick }: { label: string; value: string | number; delta?: string; icon: typeof Activity; tone?: string; onClick?: () => void }) {
  const content = <>
    <div className={`stat-icon icon-${tone}`}><Icon size={18} /></div>
    <div className="stat-meta"><span>{label}</span><strong>{value}</strong></div>
    {delta && <span className={`stat-delta ${delta.startsWith('+') ? 'up' : ''}`}>{delta}</span>}
  </>
  return onClick
    ? <button className="stat-card" onClick={onClick} type="button" aria-label={`${label}: ${value}${delta ? `. ${delta}` : ''}`}>{content}</button>
    : <div className="stat-card stat-card-static">{content}</div>
}

function Panel({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>
    <header className="panel-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</header>
    {children}
  </section>
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="empty-state" role="status"><Search size={24} /><div><strong>No results found</strong><p>{children}</p></div></div>
}

const columnHelp = {
  ticket: ['Ticket', 'The original support request and customer context.', 'ID · subject · channel · plan'],
  ticketStatus: ['Ticket status', 'Operational lifecycle of the customer request.', 'New · Open · Pending · Solved'],
  assignee: ['Assignee', 'Agent and team currently responsible for the ticket.', 'Agent · support team'],
  sla: ['SLA', 'Time remaining before the response commitment is breached.', 'On track · due soon · overdue · met'],
  classification: ['AI classification', 'AI-predicted primary topic and supporting secondary tags.', 'Primary topic · secondary tags'],
  priority: ['Priority', 'Recommended order for handling the ticket.', 'P1 critical · P2 high · P3 normal · P4 low'],
  risk: ['SLA risk', 'Likelihood that the response target may be missed.', 'Critical · High · Medium · Low'],
  area: ['Product area', 'Part of the product most likely affected.', 'Billing · Mobile · Planning · Automation · more'],
  team: ['Suggested team', 'Team recommended to own the next step.', 'Support · Billing Ops · Identity · Engineering · more'],
  confidence: ['Confidence', 'How certain the AI is about its analysis.', 'High 85%+ · Medium 70–84% · Low under 70%'],
  status: ['Review status', 'Current stage of human review.', 'Not analyzed · Analyzed · Needs review · Approved · Edited · Escalated'],
  cluster: ['Cluster', 'Group of tickets that may describe the same underlying issue.', 'Cluster ID or no match'],
  created: ['Created', 'When the support ticket was received.', 'Date and local time'],
} as const

function ColumnHeader({ helpKey }: { helpKey: keyof typeof columnHelp }) {
  const [label, description, values] = columnHelp[helpKey]
  return <span className="column-header-help" tabIndex={0} aria-label={`${label}. ${description} Possible values: ${values}`}>
    {label}<Info size={10}/>
    <span className="column-tooltip" role="tooltip"><strong>{label}</strong><span>{description}</span><small>{values}</small></span>
  </span>
}

type QueueId = 'all' | 'mine' | 'unassigned' | 'sla' | 'human-review' | 'escalated'

function Overview({ tickets, go, openQueue, period, customStart, customEnd }: { tickets: Ticket[]; go: (page: Page) => void; openQueue: (queue: QueueId) => void; period: number | 'custom'; customStart: string; customEnd: string }) {
  const latestDate = useMemo(() => {
    const date = new Date(Math.max(...tickets.map(ticket => +new Date(ticket.created_at))))
    date.setHours(0, 0, 0, 0)
    return date
  }, [tickets])
  const periodStart = useMemo(() => period === 'custom' ? parseDateKey(customStart) : new Date(latestDate.getTime() - (period - 1) * 86400000), [customStart, latestDate, period])
  const periodEnd = useMemo(() => period === 'custom' ? parseDateKey(customEnd) : latestDate, [customEnd, latestDate, period])
  const periodDays = Math.max(1, Math.round((periodEnd.getTime() - periodStart.getTime()) / 86400000) + 1)
  const periodTickets = useMemo(() => { const end = new Date(periodEnd); end.setHours(23, 59, 59, 999); return tickets.filter(ticket => { const created = new Date(ticket.created_at); return created >= periodStart && created <= end }) }, [periodEnd, periodStart, tickets])
  const needsReview = periodTickets.filter(ticket => humanReviewReasons(ticket).length > 0).length
  const now = operationalNow(tickets)
  const highRisk = periodTickets.filter(ticket => ['red', 'amber'].includes(slaInfo(ticket, now).tone)).length
  const clusters = new Set(periodTickets.map(t => t.ai.duplicate_cluster).filter(Boolean)).size
  const edited = periodTickets.filter(t => t.ai.review_status === 'Edited').length
  const lowConfidence = periodTickets.filter(t => t.ai.confidence < .7).length
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
  const clusterRows = CLUSTER_SUMMARIES.slice(0, 5).map((name, i) => ({ name, count: Math.max(2, Math.round((18 - i * 2) * periodRatio)), trend: [18, 32, -8, 21, 12][i] }))
  const dateRange = `${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(periodStart)} – ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(periodEnd)}`
  const periodLabel = period === 'custom' ? dateRange : `last ${period} days`
  return <>
    <div className="stats-grid six">
      <StatCard label="Tickets in period" value={periodTickets.length} delta="+8.4%" icon={Inbox} tone="purple" onClick={() => openQueue('all')} />
      <StatCard label="Needs human review" value={needsReview} delta="Action required" icon={ClipboardCheck} tone="amber" onClick={() => openQueue('human-review')} />
      <StatCard label="SLA at risk" value={highRisk} delta="Prioritized" icon={AlertTriangle} tone="red" onClick={() => openQueue('sla')} />
      <StatCard label="Duplicate clusters" value={clusters} delta="2 emerging" icon={Boxes} tone="blue" onClick={() => go('clusters')} />
      <StatCard label="AI edit rate" value={`${Math.round(edited / Math.max(1, periodTickets.length) * 100)}%`} delta="-1.8%" icon={SlidersHorizontal} tone="green" onClick={() => go('quality')} />
      <StatCard label="Low-confidence cases" value={lowConfidence} delta="12 urgent" icon={Gauge} tone="purple" onClick={() => go('quality')} />
    </div>
    <div className="grid-main-side">
      <Panel title="Ticket volume" subtitle={`New and reviewed tickets · ${dateRange}`}>
        <div className="chart-lg"><ResponsiveContainer width="100%" height="100%"><AreaChart data={volume} margin={{ top: 20, right: 12, left: -18, bottom: 4 }}><defs><linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#476978" stopOpacity={.2}/><stop offset="100%" stopColor="#476978" stopOpacity={.02}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#ddd9d1" strokeDasharray="3 5"/><XAxis dataKey="day" axisLine={{ stroke: '#d8d4cc' }} tickLine={false} minTickGap={22} tick={{ fill: '#737873', fontSize: 10 }}/><YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: '#737873', fontSize: 10 }}/><Tooltip cursor={{ stroke: '#9aa7a4', strokeDasharray: '3 4' }} contentStyle={{ border: '1px solid #d9d5cd', borderRadius: 9, background: '#fffefa', boxShadow: '0 8px 24px rgba(46,48,46,.1)' }}/><Area type="monotone" dataKey="tickets" name="New tickets" stroke="#476978" strokeWidth={3} fill="url(#volumeFill)" dot={{ r: 2, fill: '#476978', strokeWidth: 0 }} activeDot={{ r: 4, fill: '#476978', stroke: '#fffefa', strokeWidth: 2 }}/><Area type="monotone" dataKey="reviewed" name="Reviewed" stroke="#668878" strokeWidth={2.5} fill="transparent" strokeDasharray="7 5" dot={{ r: 1.8, fill: '#668878', strokeWidth: 0 }} activeDot={{ r: 4, fill: '#668878', stroke: '#fffefa', strokeWidth: 2 }}/></AreaChart></ResponsiveContainer></div>
        <div className="chart-legend"><span><i className="legend-purple"/>New tickets</span><span><i className="legend-green legend-dashed"/>Reviewed</span></div>
      </Panel>
      <Panel title="Recent AI activity" subtitle="Live analysis stream" action={<Badge tone="green" dot>Analysis service online</Badge>}>
        <div className="activity-list">
          {tickets.slice(11, 16).map((ticket, i) => <button key={ticket.ticket_id} className="activity-row" onClick={() => go('inbox')}><div className={`activity-icon activity-${i % 3}`}><Bot size={15}/></div><div><strong>{ticket.ticket_id} classified</strong><span>{pretty(ticket.ai.primary_topic)} · {ticket.ai.secondary_tags.length} tags</span></div><time>{2 + i * 3}m</time></button>)}
        </div>
        <button className="text-link wide" onClick={() => go('inbox')}>View analysis queue <ArrowRight size={14}/></button>
      </Panel>
    </div>
    <div className="three-panels">
      <Panel title="Top product areas" subtitle={`By ticket volume · ${periodLabel}`}><div className="rank-list">{areas.map(([area, count], i) => <button key={area} onClick={() => go('insights')}><span className="rank">{i + 1}</span><span className="rank-label">{pretty(area)}<i><b style={{ width: `${count / maxArea * 100}%` }}/></i></span><strong>{count}</strong></button>)}</div></Panel>
      <Panel title="Top issue clusters" subtitle={`Repeated customer pain points · ${periodLabel}`}><div className="cluster-mini-list">{clusterRows.map((row, i) => <button key={row.name} onClick={() => go('clusters')}><span className={`cluster-signal signal-${i % 3}`}><Layers3 size={15}/></span><div><strong>{row.name}</strong><span>{row.count} tickets</span></div><em className={row.trend > 0 ? 'trend-up' : 'trend-down'}>{row.trend > 0 ? <TrendingUp size={13}/> : <TrendingDown size={13}/>} {Math.abs(row.trend)}%</em></button>)}</div></Panel>
      <Panel title="Quick actions" subtitle="Move from signal to decision"><div className="quick-actions"><button onClick={() => openQueue('human-review')}><span><Inbox size={18}/></span><div><strong>Review flagged tickets</strong><small>{needsReview} require a human decision</small></div><ArrowRight size={16}/></button><button onClick={() => go('insights')}><span><BarChart3 size={18}/></span><div><strong>Explore product insights</strong><small>5 suggested actions</small></div><ArrowRight size={16}/></button><button onClick={() => go('quality')}><span><CircleGauge size={18}/></span><div><strong>Inspect AI quality</strong><small>{lowConfidence} low-confidence cases</small></div><ArrowRight size={16}/></button></div></Panel>
    </div>
  </>
}

type InboxFilters = { channel: string; plan: string; priority: string; risk: string; topic: string; area: string; team: string; ticketStatus: string; reviewStatus: string; assignee: string; confidence: string; feature: boolean }
const emptyFilters: InboxFilters = { channel: '', plan: '', priority: '', risk: '', topic: '', area: '', team: '', ticketStatus: '', reviewStatus: '', assignee: '', confidence: '', feature: false }

function TicketInbox({ tickets, openTicket, updateMany, assignMany, queue, onQueueChange, initialSearch = '' }: { tickets: Ticket[]; openTicket: (id: string) => void; updateMany: (ids: string[], status: ReviewStatus) => void; assignMany: (ids: string[]) => void; queue: QueueId; onQueueChange: (queue: QueueId) => void; initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch)
  const [filters, setFilters] = useState(emptyFilters)
  const [selected, setSelected] = useState<string[]>([])
  const [sort, setSort] = useState<'newest' | 'priority' | 'confidence'>('newest')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const now = useMemo(() => operationalNow(tickets), [tickets])
  const queueMatches = (ticket: Ticket, queueId: QueueId) => {
    if (queueId === 'mine') return ticket.assignee === 'Maya Rodriguez' && ticket.ticket_status !== 'Solved'
    if (queueId === 'unassigned') return !ticket.assignee && ticket.ticket_status !== 'Solved'
    if (queueId === 'sla') return ticket.ticket_status !== 'Solved' && slaInfo(ticket, now).tone !== 'green'
    if (queueId === 'human-review') return humanReviewReasons(ticket).length > 0
    if (queueId === 'escalated') return ticket.escalation_flag && ticket.ticket_status !== 'Solved'
    return true
  }
  const queueOptions: { id: QueueId; label: string }[] = [
    { id: 'all', label: 'All tickets' }, { id: 'mine', label: 'My tickets' }, { id: 'unassigned', label: 'Unassigned' },
    { id: 'sla', label: 'SLA at risk' }, { id: 'human-review', label: 'Needs human review' }, { id: 'escalated', label: 'Escalated' },
  ]
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tickets.filter(t => {
      const searchable = `${t.ticket_id} ${t.external_id} ${t.subject} ${t.description} ${t.assignee ?? ''} ${t.source_system} ${t.ai.primary_topic} ${t.ai.secondary_tags.join(' ')} ${t.ai.product_area} ${t.support_team}`.replaceAll('_', ' ').toLowerCase()
      return queueMatches(t, queue) && (!q || searchable.includes(q)) && (!filters.channel || t.channel === filters.channel) &&
      (!filters.plan || t.customer_plan === filters.plan) &&
      (!filters.priority || t.ai.priority === filters.priority) && (!filters.risk || t.ai.sla_risk === filters.risk) &&
      (!filters.topic || t.ai.primary_topic === filters.topic) && (!filters.area || t.ai.product_area === filters.area) &&
      (!filters.team || t.support_team === filters.team) && (!filters.ticketStatus || t.ticket_status === filters.ticketStatus) &&
      (!filters.reviewStatus || t.ai.review_status === filters.reviewStatus) && (!filters.assignee || (filters.assignee === 'unassigned' ? !t.assignee : t.assignee === filters.assignee)) &&
      (!filters.confidence || (filters.confidence === 'low' ? t.ai.confidence < .7 : filters.confidence === 'medium' ? t.ai.confidence >= .7 && t.ai.confidence < .85 : t.ai.confidence >= .85)) &&
      (!filters.feature || t.feature_request_flag)
    })
      .sort((a, b) => queue === 'sla' ? slaInfo(a, now).sort - slaInfo(b, now).sort : sort === 'priority' ? priorityOrder[a.ai.priority] - priorityOrder[b.ai.priority] : sort === 'confidence' ? a.ai.confidence - b.ai.confidence : +new Date(b.created_at) - +new Date(a.created_at))
  }, [tickets, search, filters, sort, queue, now])
  const perPage = 12
  const visible = filtered.slice((page - 1) * perPage, page * perPage)
  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const activeFilters = Object.values(filters).filter(Boolean).length
  const secondaryFilters = [filters.plan, filters.topic, filters.area, filters.team, filters.assignee, filters.confidence, filters.feature].filter(Boolean).length
  const filterChips: { key: keyof InboxFilters; label: string }[] = [
    filters.channel && { key: 'channel', label: `Channel: ${filters.channel}` },
    filters.plan && { key: 'plan', label: `Plan: ${filters.plan}` },
    filters.priority && { key: 'priority', label: `Priority: ${filters.priority}` },
    filters.risk && { key: 'risk', label: `SLA risk: ${pretty(filters.risk)}` },
    filters.topic && { key: 'topic', label: `Topic: ${pretty(filters.topic)}` },
    filters.area && { key: 'area', label: `Area: ${pretty(filters.area)}` },
    filters.team && { key: 'team', label: `Team: ${pretty(filters.team)}` },
    filters.ticketStatus && { key: 'ticketStatus', label: `Ticket status: ${filters.ticketStatus}` },
    filters.reviewStatus && { key: 'reviewStatus', label: `AI review: ${filters.reviewStatus}` },
    filters.assignee && { key: 'assignee', label: `Assignee: ${filters.assignee === 'unassigned' ? 'Unassigned' : filters.assignee}` },
    filters.confidence && { key: 'confidence', label: `Confidence: ${pretty(filters.confidence)}` },
    filters.feature && { key: 'feature', label: 'Feature requests' },
  ].filter((chip): chip is { key: keyof InboxFilters; label: string } => Boolean(chip))
  const toggleAll = () => setSelected(visible.every(t => selected.includes(t.ticket_id)) ? selected.filter(id => !visible.some(t => t.ticket_id === id)) : [...new Set([...selected, ...visible.map(t => t.ticket_id)])])
  const setFilter = (key: keyof InboxFilters, value: string | boolean) => { setFilters(current => ({ ...current, [key]: value })); setPage(1) }
  const resetView = () => { setFilters(emptyFilters); setSearch(''); onQueueChange('all'); setPage(1) }
  return <>
    <PageTitle eyebrow="Operations" title="Ticket Inbox" description={`${filtered.length} tickets in ${queueOptions.find(item => item.id === queue)?.label.toLowerCase()} · operational status and AI review are tracked separately`} action={<button className="btn btn-secondary" onClick={resetView}><RotateCcw size={15}/> Reset view</button>} />
    <div className="notice-bar"><ShieldCheck size={16}/><strong>AI recommendations are advisory</strong><span>Only flagged cases enter Human Review; Opsqora never resolves tickets or contacts customers automatically.</span></div>
    <Panel title="Support queue" subtitle="Saved operational views across all support channels" className="table-panel" action={<div className="table-tools"><div className="search-field table-search"><Search size={15}/><input aria-label="Search tickets" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search ID, subject, or tag"/>{search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={14}/></button>}</div><button className={`btn btn-small ${showFilters ? 'btn-tinted' : 'btn-secondary'}`} onClick={() => setShowFilters(v => !v)} aria-expanded={showFilters}><ListFilter size={15}/> More filters {secondaryFilters > 0 && <b>{secondaryFilters}</b>}</button><button className={`btn btn-small ${showGuide ? 'btn-tinted' : 'btn-secondary'}`} onClick={() => setShowGuide(v => !v)} aria-expanded={showGuide}><Info size={14}/> Column guide</button><select aria-label="Sort tickets" className="compact-select" value={sort} onChange={e => setSort(e.target.value as typeof sort)} disabled={queue === 'sla'}><option value="newest">Newest first</option><option value="priority">Priority</option><option value="confidence">Lowest confidence</option></select></div>}>
      <div className="saved-queues" aria-label="Saved ticket queues">
        <label className="mobile-queue-picker"><span>Support queue</span><select aria-label="Support queue" value={queue} onChange={event => { onQueueChange(event.target.value as QueueId); setPage(1); setSelected([]) }}>{queueOptions.map(item => <option key={item.id} value={item.id}>{item.label} · {tickets.filter(ticket => queueMatches(ticket, item.id)).length}</option>)}</select></label>
        {queueOptions.map(item => <button key={item.id} className={queue === item.id ? 'active' : ''} aria-pressed={queue === item.id} onClick={() => { onQueueChange(item.id); setPage(1); setSelected([]) }}><span>{item.label}</span><b>{tickets.filter(ticket => queueMatches(ticket, item.id)).length}</b></button>)}
      </div>
      {showGuide && <div className="column-guide"><div className="column-guide-intro"><Info size={17}/><span><strong>How to read this table</strong><small>Hover or focus any column title for a quick explanation.</small></span></div>{(['classification','priority','risk','confidence','status','cluster'] as const).map(key => { const [label, description, values] = columnHelp[key]; return <div key={key}><strong>{label}</strong><span>{description}</span><small>{values}</small></div> })}</div>}
      <div className="filter-bar filter-bar-primary">
        <select aria-label="Channel" value={filters.channel} onChange={e => setFilter('channel', e.target.value)}><option value="">All channels</option>{['Email','Web form','In-app','API support'].map(x => <option key={x} value={x}>{x}</option>)}</select>
        <select aria-label="Ticket status" value={filters.ticketStatus} onChange={e => setFilter('ticketStatus', e.target.value)}><option value="">All ticket statuses</option>{['New','Open','Pending','Solved'].map(x => <option key={x}>{x}</option>)}</select>
        <select aria-label="Priority" value={filters.priority} onChange={e => setFilter('priority', e.target.value)}><option value="">All priorities</option>{['P1','P2','P3','P4'].map(x => <option key={x}>{x}</option>)}</select>
        <select aria-label="SLA risk" value={filters.risk} onChange={e => setFilter('risk', e.target.value)}><option value="">All SLA risk</option>{['critical','high','medium','low'].map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select>
        <select aria-label="AI review status" value={filters.reviewStatus} onChange={e => setFilter('reviewStatus', e.target.value)}><option value="">All AI review statuses</option>{['Not analyzed','Analyzed','Needs review','Approved','Edited','Escalated'].map(x => <option key={x}>{x}</option>)}</select>
      </div>
      {showFilters && <div className="filter-bar filter-bar-secondary">
        <select aria-label="Customer plan" value={filters.plan} onChange={e => setFilter('plan', e.target.value)}><option value="">All plans</option>{['Starter','Pro','Business','Enterprise'].map(x => <option key={x} value={x}>{x}</option>)}</select>
        <select value={filters.topic} onChange={e => setFilter('topic', e.target.value)}><option value="">All topics</option>{PRIMARY_TOPICS.map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select>
        <select value={filters.area} onChange={e => setFilter('area', e.target.value)}><option value="">All product areas</option>{PRODUCT_AREAS.map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select>
        <select value={filters.team} onChange={e => setFilter('team', e.target.value)}><option value="">All teams</option>{TEAMS.map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select>
        <select aria-label="Assignee" value={filters.assignee} onChange={e => setFilter('assignee', e.target.value)}><option value="">All assignees</option><option value="unassigned">Unassigned</option>{SUPPORT_AGENTS.map(agent => <option key={agent}>{agent}</option>)}</select>
        <select value={filters.confidence} onChange={e => setFilter('confidence', e.target.value)}><option value="">Any confidence</option><option value="low">Low · under 70%</option><option value="medium">Medium · 70–84%</option><option value="high">High · 85%+</option></select>
        <label className="check-filter"><input type="checkbox" checked={filters.feature} onChange={e => setFilter('feature', e.target.checked)}/> Feature requests</label>
      </div>}
      {activeFilters > 0 && <div className="active-filters" aria-label="Active filters"><span>Active filters</span>{filterChips.map(chip => <button key={chip.key} onClick={() => setFilter(chip.key, chip.key === 'feature' ? false : '')}>{chip.label}<X size={12}/></button>)}<button className="clear-filters" onClick={resetView}>Clear all</button></div>}
      {selected.length > 0 && <div className="selection-bar"><strong>{selected.length} selected</strong><button onClick={() => assignMany(selected)}><Users size={14}/> Assign to me</button><button onClick={() => updateMany(selected, 'Needs review')}><Sparkles size={14}/> Request human review</button><button onClick={() => updateMany(selected, 'Approved')}><Check size={14}/> Mark reviewed</button><button onClick={() => setSelected([])}><X size={14}/> Clear</button></div>}
      <div className="table-scroll" tabIndex={0} aria-label="Scrollable support ticket table"><table className="ticket-table operational-table"><caption className="sr-only">Support tickets matching the current search and filters</caption><thead><tr><th><input type="checkbox" aria-label="Select all visible tickets" checked={visible.length > 0 && visible.every(t => selected.includes(t.ticket_id))} onChange={toggleAll}/></th><th><ColumnHeader helpKey="ticket"/></th><th><ColumnHeader helpKey="ticketStatus"/></th><th><ColumnHeader helpKey="assignee"/></th><th><ColumnHeader helpKey="sla"/></th><th><ColumnHeader helpKey="classification"/></th><th><ColumnHeader helpKey="priority"/></th><th><ColumnHeader helpKey="confidence"/></th><th><ColumnHeader helpKey="status"/></th><th><ColumnHeader helpKey="cluster"/></th><th><ColumnHeader helpKey="created"/></th></tr></thead><tbody>
        {visible.map(ticket => { const sla = slaInfo(ticket, now); const reviewReasons = humanReviewReasons(ticket); return <tr key={ticket.ticket_id} tabIndex={0} aria-label={`Open ${ticket.ticket_id}: ${ticket.subject}`} onKeyDown={e => { if (e.key === 'Enter') openTicket(ticket.ticket_id) }} onClick={() => openTicket(ticket.ticket_id)} className={selected.includes(ticket.ticket_id) ? 'selected-row' : ''}><td onClick={e => e.stopPropagation()}><input aria-label={`Select ${ticket.ticket_id}`} type="checkbox" checked={selected.includes(ticket.ticket_id)} onChange={() => setSelected(s => s.includes(ticket.ticket_id) ? s.filter(id => id !== ticket.ticket_id) : [...s, ticket.ticket_id])}/></td><td><span className="ticket-id">{ticket.ticket_id} · {ticket.external_id}</span><strong className="ticket-subject">{ticket.subject}</strong><small>{ticket.source_system} · {ticket.customer_plan}</small></td><td><TicketStatusBadge status={ticket.ticket_status}/></td><td><strong className={ticket.assignee ? '' : 'muted'}>{ticket.assignee ?? 'Unassigned'}</strong><small>{pretty(ticket.support_team)}</small></td><td><span className={`sla-pill sla-${sla.tone}`}><Clock3 size={12}/>{sla.label}</span></td><td><strong>{pretty(ticket.ai.primary_topic)}</strong><div className="tag-stack">{ticket.ai.secondary_tags.slice(0, 2).map(tag => <Badge key={tag}>{pretty(tag)}</Badge>)}{ticket.ai.secondary_tags.length > 2 && <Badge>+{ticket.ai.secondary_tags.length - 2}</Badge>}</div></td><td><PriorityBadge priority={ticket.ai.priority}/></td><td><div className={`confidence ${ticket.ai.confidence < .7 ? 'confidence-low' : ''}`}><span>{Math.round(ticket.ai.confidence * 100)}%</span><i><b style={{ width: `${ticket.ai.confidence * 100}%` }}/></i></div></td><td><StatusBadge status={ticket.ai.review_status}/>{queue === 'human-review' && reviewReasons.length > 0 && <small className="review-reason">{reviewReasons.slice(0, 2).join(' · ')}</small>}</td><td>{ticket.ai.duplicate_cluster ? <Badge tone="purple">{ticket.ai.duplicate_cluster}</Badge> : <span className="muted">—</span>}</td><td><span className="date-cell">{shortDate(ticket.created_at)}</span></td></tr> })}
      </tbody></table>{visible.length === 0 && <EmptyState>No tickets match these filters.</EmptyState>}</div>
      <footer className="table-footer"><span>Showing {visible.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span><span className="scroll-hint">Scroll horizontally for more columns <ArrowRight size={13}/></span><div className="pagination"><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={15}/></button><span>Page {page} of {pages}</span><button aria-label="Next page" disabled={page === pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={15}/></button></div></footer>
    </Panel>
  </>
}

function FieldSelect({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return <label className="review-field"><span>{label}</span><div><select value={value} onChange={e => onChange(e.target.value)}>{values.map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select><ChevronDown size={14}/></div></label>
}

function TicketReview({ ticket, update, goBack, openTicket, tickets }: { ticket: Ticket; update: (patch: Partial<Ticket>, aiPatch?: Partial<Ticket['ai']>) => void; goBack: () => void; openTicket: (id: string) => void; tickets: Ticket[] }) {
  const [newTag, setNewTag] = useState('')
  const [reason, setReason] = useState('wrong primary topic')
  const reviewReasons = humanReviewReasons(ticket)
  const reviewQueue = tickets.filter(item => humanReviewReasons(item).length > 0)
  const reviewIndex = reviewQueue.findIndex(item => item.ticket_id === ticket.ticket_id)
  const previousReview = reviewIndex > 0 ? reviewQueue[reviewIndex - 1] : null
  const nextReview = reviewIndex >= 0 && reviewIndex < reviewQueue.length - 1 ? reviewQueue[reviewIndex + 1] : null
  const related = tickets.filter(t => t.ticket_id !== ticket.ticket_id && t.ai.duplicate_cluster && t.ai.duplicate_cluster === ticket.ai.duplicate_cluster).slice(0, 4)
  const sla = slaInfo(ticket, operationalNow(tickets))
  const approve = () => update({ reviewed_at: new Date().toISOString(), human_review_requested: false }, { review_status: 'Approved' })
  const saveEdit = () => update({ reviewed_at: new Date().toISOString(), reviewer_note: ticket.reviewer_note || `Edit reason: ${reason}.` }, { review_status: 'Edited' })
  const addTag = () => { if (newTag && !ticket.ai.secondary_tags.includes(newTag)) update({}, { secondary_tags: [...ticket.ai.secondary_tags, newTag] }); setNewTag('') }
  return <>
    <div className="review-topline"><button className="back-link" onClick={goBack}><ChevronLeft size={16}/> Back to inbox</button><span>{reviewIndex >= 0 ? `Human review ${reviewIndex + 1} of ${reviewQueue.length}` : 'Not currently in the human review queue'}</span><div><button className="icon-btn" aria-label="Previous human review case" disabled={!previousReview} onClick={() => previousReview && openTicket(previousReview.ticket_id)}><ChevronLeft size={16}/></button><button className="icon-btn" aria-label="Next human review case" disabled={!nextReview} onClick={() => nextReview && openTicket(nextReview.ticket_id)}><ChevronRight size={16}/></button></div></div>
    <div className="review-heading"><div><div className="review-id-row"><span>{ticket.ticket_id}</span><TicketStatusBadge status={ticket.ticket_status}/><span className="review-label">AI review</span><StatusBadge status={ticket.ai.review_status}/>{ticket.escalation_flag && <Badge tone="red"><Flag size={11}/> Escalation candidate</Badge>}</div><h1>{ticket.subject}</h1></div><div className="review-actions"><button className="btn btn-secondary" onClick={() => update({ human_review_requested: true }, { review_status: 'Needs review' })}><Info size={15}/> Keep in human review</button><button className="btn btn-outline-purple" onClick={saveEdit}><SlidersHorizontal size={15}/> Save corrections</button><button className="btn btn-success" onClick={approve}><CheckCircle2 size={16}/> Approve analysis</button></div></div>
    <div className={`review-reason-banner ${reviewReasons.length ? '' : 'resolved'}`} role="status"><span className="review-reason-icon"><AlertTriangle size={17}/></span><div><strong>{reviewReasons.length ? 'Why this ticket needs human review' : 'No active human-review triggers'}</strong><p>{reviewReasons.length ? reviewReasons.join(' · ') : 'The current AI analysis has no unresolved risk or confidence flags.'}</p></div>{reviewReasons.length > 0 && <Badge tone={reviewReasons.some(item => item.includes('SLA') || item.includes('impact')) ? 'red' : 'amber'}>{reviewReasons.length} {reviewReasons.length === 1 ? 'reason' : 'reasons'}</Badge>}</div>
    <div className="ticket-operations" aria-label="Ticket operations"><label><span>Ticket status</span><select value={ticket.ticket_status} onChange={event => update({ ticket_status: event.target.value as TicketStatus })}>{['New','Open','Pending','Solved'].map(status => <option key={status}>{status}</option>)}</select></label><label><span>Assignee</span><select value={ticket.assignee ?? ''} onChange={event => update({ assignee: event.target.value || null })}><option value="">Unassigned</option>{SUPPORT_AGENTS.map(agent => <option key={agent}>{agent}</option>)}</select></label><label><span>Support team</span><select value={ticket.support_team} onChange={event => update({ support_team: event.target.value })}>{TEAMS.map(team => <option key={team} value={team}>{pretty(team)}</option>)}</select></label><div className="operation-sla"><span>SLA commitment</span><strong className={`sla-pill sla-${sla.tone}`}><Clock3 size={13}/>{sla.label}</strong><small>Due {shortDate(ticket.sla_due_at)}</small></div><div className="operation-source"><span>Source</span><strong>{ticket.source_system}</strong><small>{ticket.external_id} · {ticket.channel}</small></div></div>
    <div className="review-layout">
      <div className="review-left">
        <Panel title="Original ticket" subtitle={`${ticket.channel} · received ${shortDate(ticket.created_at)}`}>
          <div className="customer-message"><div className="avatar customer-avatar">AC</div><div><div className="message-meta"><strong>Alex Chen</strong><span>Operations Lead · Northstar Labs</span></div><p>{ticket.description}</p></div></div>
        </Panel>
        <Panel title="Customer context" subtitle="Account metadata"><div className="context-grid"><div><span>Customer plan</span><strong>{ticket.customer_plan}</strong></div><div><span>Workspace size</span><strong>{ticket.workspace_size.toLocaleString()} members</strong></div><div><span>Account health</span><strong className="health-good">Healthy · 82</strong></div><div><span>Open tickets</span><strong>{2 + ticket.workspace_size % 6} in 30 days</strong></div><div><span>Region</span><strong>North America</strong></div><div><span>Annual value</span><strong>${(ticket.workspace_size * 31).toLocaleString()}</strong></div></div></Panel>
        <Panel title="Related tickets" subtitle={ticket.ai.duplicate_cluster ? `Cluster ${ticket.ai.duplicate_cluster}` : 'No duplicate cluster detected'} action={ticket.ai.duplicate_cluster && <Badge tone="purple">{related.length + 1} similar</Badge>}>
          {related.length ? <div className="related-list">{related.map(item => <button key={item.ticket_id} onClick={() => openTicket(item.ticket_id)}><span><strong>{item.ticket_id}</strong><small>{item.subject}</small></span><PriorityBadge priority={item.ai.priority}/><span className="similarity">{88 + item.workspace_size % 10}% match</span><ArrowRight size={15}/></button>)}</div> : <EmptyState>No related tickets were found for this case.</EmptyState>}
          {ticket.ai.duplicate_cluster && <div className="incident-note"><AlertTriangle size={16}/><div><strong>Suggested incident note</strong><p>Multiple customers report similar behavior. Validate shared conditions before escalating as a potential incident.</p></div></div>}
        </Panel>
      </div>
      <div className="review-center">
        <Panel title="AI analysis" subtitle="Analysis Model v1 · generated in 1.4s" action={<div className={`confidence-pill ${ticket.ai.confidence < .7 ? 'low' : ''}`}><Sparkles size={14}/>{Math.round(ticket.ai.confidence * 100)}% confidence</div>}>
          <div className="analysis-banner"><Bot size={18}/><span>AI recommendation — verify before operational use</span></div>
          <div className="analysis-grid"><div><span>Primary topic</span><strong>{pretty(ticket.ai.primary_topic)}</strong></div><div><span>Product area</span><strong>{pretty(ticket.ai.product_area)}</strong></div><div><span>Intent</span><strong>{pretty(ticket.ai.intent)}</strong></div><div><span>Sentiment</span><strong>{pretty(ticket.ai.sentiment)}</strong></div><div><span>Urgency</span><strong>{pretty(ticket.ai.urgency)}</strong></div><div><span>Impact</span><strong>{pretty(ticket.ai.impact)}</strong></div><div><span>Priority</span><PriorityBadge priority={ticket.ai.priority}/></div><div><span>SLA risk</span><RiskBadge risk={ticket.ai.sla_risk}/></div><div><span>Suggested team</span><strong>{pretty(ticket.ai.suggested_team)}</strong></div><div><span>Escalation team</span><strong>{pretty(ticket.ai.possible_escalation_team)}</strong></div></div>
          <div className="tag-section"><span>Secondary tags</span><div>{ticket.ai.secondary_tags.map(tag => <Badge key={tag} tone="purple">{pretty(tag)}</Badge>)}</div></div>
          {ticket.ai.related_product_areas.length > 0 && <div className="tag-section"><span>Related product areas</span><div>{ticket.ai.related_product_areas.map(area => <Badge key={area} tone="blue">{pretty(area)}</Badge>)}</div></div>}
          <div className="explanation"><h3><Sparkles size={16}/> Why AI classified it this way</h3><ul>{ticket.ai.explanation.map(point => <li key={point}>{point}</li>)}</ul></div>
        </Panel>
        <Panel title="Suggested next action" subtitle="Decision support only"><div className="next-action"><span><Zap size={17}/></span><p>{ticket.ai.suggested_next_action}</p></div></Panel>
        <Panel title="Suggested internal note" subtitle="Editable before adding to the case"><textarea aria-label="Suggested internal note" className="note-textarea" value={ticket.ai.suggested_internal_note} onChange={e => update({}, { suggested_internal_note: e.target.value })}/><div className="draft-footer"><Badge tone="blue">Internal only</Badge><button className="btn btn-small btn-secondary" onClick={() => update({ reviewer_note: ticket.ai.suggested_internal_note })}>Use as reviewer note</button></div></Panel>
        <Panel title="Suggested customer reply draft" subtitle="Generated from ticket context"><div className="draft-warning"><LockKeyhole size={15}/><strong>Draft only — never sent automatically</strong></div><textarea aria-label="Suggested customer reply draft" className="reply-textarea" value={ticket.ai.suggested_customer_reply_draft} onChange={e => update({}, { suggested_customer_reply_draft: e.target.value })}/><div className="draft-footer"><span className="muted">Sending requires a separate human-approved workflow.</span><button className="btn btn-small btn-secondary" disabled title="Customer messaging is outside this prototype">Sending unavailable</button></div></Panel>
      </div>
      <aside className="review-right">
        <Panel title="Human decision" subtitle="Review and correct the AI recommendation">
          <div className="review-status-card"><span>Current status</span><StatusBadge status={ticket.ai.review_status}/>{ticket.reviewed_at && <small>Updated {shortDate(ticket.reviewed_at)}</small>}</div>
          <div className="review-form">
            <FieldSelect label="Primary topic" value={ticket.ai.primary_topic} values={PRIMARY_TOPICS} onChange={value => update({}, { primary_topic: value })}/>
            <div className="review-field"><span>Secondary tags</span><div className="editable-tags">{ticket.ai.secondary_tags.map(tag => <span key={tag}>{pretty(tag)}<button aria-label={`Remove ${pretty(tag)} tag`} onClick={() => update({}, { secondary_tags: ticket.ai.secondary_tags.filter(x => x !== tag) })}><X size={11}/></button></span>)}</div><div className="add-tag"><select aria-label="Add secondary tag" value={newTag} onChange={e => setNewTag(e.target.value)}><option value="">Add a tag…</option>{SECONDARY_TAGS.filter(tag => !ticket.ai.secondary_tags.includes(tag)).map(tag => <option key={tag} value={tag}>{pretty(tag)}</option>)}</select><button aria-label="Add selected tag" onClick={addTag} disabled={!newTag}><Plus size={14}/></button></div></div>
            <FieldSelect label="Product area" value={ticket.ai.product_area} values={PRODUCT_AREAS} onChange={value => update({}, { product_area: value })}/>
            <div className="field-pair"><FieldSelect label="Priority" value={ticket.ai.priority} values={['P1','P2','P3','P4']} onChange={value => update({}, { priority: value as Priority })}/><FieldSelect label="SLA risk" value={ticket.ai.sla_risk} values={['critical','high','medium','low']} onChange={value => update({}, { sla_risk: value as Risk })}/></div>
            <FieldSelect label="Suggested team" value={ticket.ai.suggested_team} values={TEAMS} onChange={value => update({}, { suggested_team: value })}/>
            <label className="review-field"><span>Edit reason</span><div><select value={reason} onChange={e => setReason(e.target.value)}>{['wrong primary topic','missing tag','irrelevant tag','wrong priority','wrong routing','duplicate cluster not relevant','insufficient confidence','other'].map(x => <option key={x}>{pretty(x)}</option>)}</select><ChevronDown size={14}/></div></label>
            <label className="review-field"><span>Reviewer note</span><textarea placeholder="Add context for this decision…" value={ticket.reviewer_note ?? ''} onChange={e => update({ reviewer_note: e.target.value })}/></label>
            <div className="review-form-actions"><button className="btn btn-outline-purple" onClick={saveEdit}>Save changes</button><button className="btn btn-success" onClick={approve}><Check size={15}/> Approve</button></div>
          </div>
        </Panel>
        <Panel title="Activity log" subtitle="Review history"><div className="timeline"><div><i className="purple-dot"/><span><strong>AI analysis completed</strong><small>Analysis service · 8 minutes ago</small></span></div>{ticket.reviewed_at && <div><i className="green-dot"/><span><strong>Review {ticket.ai.review_status.toLowerCase()}</strong><small>Maya Rodriguez · {shortDate(ticket.reviewed_at)}</small></span></div>}<div><i/><span><strong>Ticket received</strong><small>{ticket.channel} · {shortDate(ticket.created_at)}</small></span></div></div></Panel>
      </aside>
    </div>
  </>
}

function DuplicateClusters({ tickets, openTicket }: { tickets: Ticket[]; openTicket: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [clustersRefreshed, setClustersRefreshed] = useState(false)
  const clusters = useMemo(() => Array.from(new Set(tickets.map(t => t.ai.duplicate_cluster).filter(Boolean) as string[])).map((id, i) => {
    const members = tickets.filter(t => t.ai.duplicate_cluster === id)
    return { id, members, summary: CLUSTER_SUMMARIES[Number(id.slice(4)) - 1] ?? 'Related workflow issue', topic: countBy(members, t => t.ai.primary_topic)[0]?.[0] ?? 'tasks', avgPriority: Math.round(members.reduce((sum, t) => sum + priorityOrder[t.ai.priority], 0) / members.length), risk: members.some(t => ['critical','high'].includes(t.ai.sla_risk)) ? 'high' : 'medium', trend: -8 + (i * 13) % 47 }
  }).sort((a, b) => b.members.length - a.members.length), [tickets])
  const active = clusters.find(c => c.id === selected)
  return <>
    <PageTitle eyebrow="Pattern detection" title="Duplicate Clusters" description="AI-grouped tickets that may share a root cause or customer pain point." action={<button className="btn btn-secondary" onClick={() => setClustersRefreshed(true)}><RefreshCcw size={15}/> {clustersRefreshed ? 'Clusters up to date' : 'Refresh clusters'}</button>}/>
    <div className="notice-bar"><Info size={16}/><strong>Clusters are suggestions, not incidents.</strong><span>A human should validate shared conditions before escalation.</span></div>
    <div className="cluster-toolbar"><div className="search-field"><Search size={15}/><input placeholder="Search clusters"/></div><select className="compact-select"><option>All product areas</option></select><select className="compact-select"><option>Highest volume</option><option>Fastest growing</option></select><span>{clusters.length} active clusters</span></div>
    <div className="cluster-grid">{clusters.map((cluster, i) => <button key={cluster.id} className="cluster-card" onClick={() => setSelected(cluster.id)}><div className="cluster-card-top"><span className={`cluster-number cluster-color-${i % 4}`}><Boxes size={18}/></span><Badge tone={i < 3 ? 'red' : 'amber'}>{i < 3 ? 'Possible incident' : 'Monitor'}</Badge></div><span className="cluster-id">{cluster.id}</span><h3>{cluster.summary}</h3><p>{cluster.members.length} related tickets with common language and affected workflows.</p><div className="cluster-tags"><Badge>{pretty(cluster.topic)}</Badge>{cluster.members[0]?.ai.secondary_tags.slice(0, 2).map(tag => <Badge key={tag}>{pretty(tag)}</Badge>)}</div><div className="cluster-metrics"><div><span>Tickets</span><strong>{cluster.members.length}</strong></div><div><span>Avg priority</span><strong>P{cluster.avgPriority}</strong></div><div><span>SLA risk</span><strong className="risk-text">{pretty(cluster.risk)}</strong></div><div><span>Trend</span><strong className={cluster.trend > 0 ? 'trend-up' : 'trend-down'}>{cluster.trend > 0 ? '+' : ''}{cluster.trend}%</strong></div></div><div className="cluster-card-footer"><span>Seen May {2 + i} – Jun {3 + i % 8}</span><span>Open cluster <ArrowRight size={14}/></span></div></button>)}</div>
    {active && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><div className="cluster-drawer" onMouseDown={e => e.stopPropagation()}><header><div><span className="eyebrow">Cluster detail</span><h2>{active.id}</h2><p>{active.summary}</p></div><button className="icon-btn" onClick={() => setSelected(null)}><X size={18}/></button></header><div className="drawer-section"><div className="incident-note"><Sparkles size={17}/><div><strong>Why these tickets were grouped</strong><p>Shared product area, overlapping tags, similar failure language, and a concentrated time window produced a strong semantic match.</p></div></div></div><div className="drawer-stats"><div><span>Tickets</span><strong>{active.members.length}</strong></div><div><span>Dominant topic</span><strong>{pretty(active.topic)}</strong></div><div><span>Cluster purity</span><strong>92%</strong></div></div><div className="drawer-section"><h3>Common signals</h3><div className="tag-cloud">{active.members[0].ai.secondary_tags.map(tag => <Badge key={tag} tone="purple">{pretty(tag)}</Badge>)}<Badge tone="blue">{pretty(active.members[0].ai.product_area)}</Badge></div></div><div className="drawer-section"><h3>Related tickets</h3><div className="related-list">{active.members.slice(0, 8).map(ticket => <button key={ticket.ticket_id} onClick={() => openTicket(ticket.ticket_id)}><span><strong>{ticket.ticket_id}</strong><small>{ticket.subject}</small></span><PriorityBadge priority={ticket.ai.priority}/><ArrowRight size={15}/></button>)}</div></div><div className="drawer-section"><h3>Suggested escalation</h3><p className="drawer-copy">Share this cluster with {pretty(active.members[0].ai.possible_escalation_team)} and validate whether a single root cause explains the recent increase.</p></div><footer><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button><button className="btn btn-primary">Create incident note</button></footer></div></div>}
  </>
}

function ProductInsights({ tickets, goInbox }: { tickets: Ticket[]; goInbox: (search?: string) => void }) {
  const [range, setRange] = useState('30 days')
  const [showBrief, setShowBrief] = useState(false)
  const areaData = countBy(tickets, t => t.ai.product_area).slice(0, 8).map(([name, value]) => ({ name: pretty(name), value }))
  const tags = countBy(tickets.flatMap(t => t.ai.secondary_tags), x => x).slice(0, 10)
  const trend = Array.from({ length: 10 }, (_, i) => ({ week: `W${i + 1}`, tickets: 55 + ((i * 23) % 48), risk: 9 + ((i * 11) % 18) }))
  const coTags = [['Permissions', 'Billing', 84], ['API', 'Automation', 76], ['Integrations', 'Notifications', 68], ['Timeline', 'Performance', 61], ['Import', 'Timeline', 49]]
  const actions = [
    ['Investigate repeated API task creation failures.', '18 related tickets · +32% this month', 'High'],
    ['Review timeline performance for large workspaces.', '14 Enterprise workspaces affected', 'High'],
    ['Clarify billing access permissions after role changes.', '11 tickets · high resolution time', 'Medium'],
    ['Improve Slack notification reliability.', '9 tickets across 6 accounts', 'Medium'],
    ['Consider roadmap item for recurring task dependencies.', '22 feature requests · strong co-tag signal', 'Opportunity'],
  ]
  return <>
    <PageTitle eyebrow="Voice of customer" title="Product Insights" description="Turn support demand into evidence for product and engineering decisions." action={<select className="compact-select range-select" value={range} onChange={e => setRange(e.target.value)}><option>7 days</option><option>30 days</option><option>90 days</option></select>}/>
    <div className="insight-summary"><div><Sparkles size={20}/><span><strong>AI insight brief</strong>Support volume is up 8.4% in the selected {range}. API reliability and timeline performance account for the largest increase in high-impact tickets.</span></div><button aria-expanded={showBrief} onClick={() => setShowBrief(value => !value)}>{showBrief ? 'Hide brief' : 'Read full brief'} <ArrowRight size={14}/></button></div>
    {showBrief && <div className="insight-brief-detail" role="status"><strong>What changed</strong><span>API creation failures, large-workspace timeline performance, and billing permission issues are the strongest repeated signals. Validate the linked ticket groups before converting any suggestion into roadmap or incident work.</span><button onClick={() => goInbox()}>Inspect supporting tickets <ArrowRight size={14}/></button></div>}
    <div className="stats-grid four"><StatCard label="Product areas tracked" value={14} delta="All active" icon={Layers3}/><StatCard label="Repeated pain points" value={18} delta="+4 new" icon={AlertTriangle} tone="amber"/><StatCard label="Feature requests" value={tickets.filter(t => t.feature_request_flag).length} delta="+12.6%" icon={MessageSquareText} tone="blue"/><StatCard label="Emerging issues" value={5} delta="2 high impact" icon={TrendingUp} tone="red"/></div>
    <div className="grid-main-side insights-grid"><Panel title="Ticket trend over time" subtitle={`Volume and high SLA risk · last ${range}`}><div className="chart-lg"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 16, right: 12, left: -16, bottom: 4 }}><defs><linearGradient id="insightFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#476978" stopOpacity={.2}/><stop offset="1" stopColor="#476978" stopOpacity={.02}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#ddd9d1" strokeDasharray="3 5"/><XAxis dataKey="week" axisLine={{ stroke: '#d8d4cc' }} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Area dataKey="tickets" name="Tickets" type="monotone" stroke="#476978" strokeWidth={3} fill="url(#insightFill)"/><Area dataKey="risk" name="High SLA risk" type="monotone" stroke="#a95f5f" strokeWidth={2.5} strokeDasharray="7 5" fill="transparent"/></AreaChart></ResponsiveContainer></div></Panel><Panel title="Top product areas" subtitle="Click an area to inspect tickets"><div className="horizontal-bars">{areaData.slice(0, 6).map((item, i) => <button key={item.name} onClick={() => goInbox(item.name)}><span>{item.name}</span><i><b style={{ width: `${item.value / areaData[0].value * 100}%`, background: COLORS[i % COLORS.length] }}/></i><strong>{item.value}</strong></button>)}</div></Panel></div>
    <div className="two-panels"><Panel title="Topic co-occurrence" subtitle="Themes that appear together in the same customer problem"><div className="cooccurrence">{coTags.map(([a,b,value], i) => <button key={a} onClick={() => goInbox(String(a))}><span className="co-node">{a}</span><i><b style={{ width: `${value}%` }}/><em>{value} shared signals</em></i><span className="co-node secondary">{b}</span><strong style={{ opacity: .45 + i * -.06 }}>{Number(value) > 70 ? 'Strong' : Number(value) > 55 ? 'Medium' : 'Growing'}</strong></button>)}</div></Panel><Panel title="Top secondary tags" subtitle="Cross-cutting workflow signals"><div className="tag-ranking">{tags.map(([tag, count], i) => <button key={tag} onClick={() => goInbox(tag)}><span>{i + 1}</span><strong>{pretty(tag)}</strong><i><b style={{ width: `${count / tags[0][1] * 100}%` }}/></i><em>{count}</em></button>)}</div></Panel></div>
    <Panel title="Suggested Product Actions" subtitle="Evidence-backed opportunities generated from support patterns"><div className="action-table"><div className="action-head"><span>Suggested action</span><span>Supporting evidence</span><span>Signal</span><span>Owner</span><span/></div>{actions.map(([action,evidence,signal], i) => <div className="action-row" key={action}><span className="action-title"><i>{i + 1}</i><strong>{action}</strong></span><span>{evidence}</span><Badge tone={signal === 'High' ? 'red' : signal === 'Medium' ? 'amber' : 'purple'}>{signal}</Badge><span className="owner"><i className="avatar mini">{['PL','AM','SC','JK','MR'][i]}</i>{['Platform','Core Experience','Workspace Admin','Integrations','Work Management'][i]}</span><button className="icon-btn"><ArrowRight size={15}/></button></div>)}</div></Panel>
  </>
}

function AIQuality({ tickets, openTicket }: { tickets: Ticket[]; openTicket: (id: string) => void }) {
  const [evaluationRun, setEvaluationRun] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  const metrics = [
    ['Primary topic accuracy','91.8%','+1.4'], ['Tag precision','89.6%','+0.8'], ['Tag recall','86.4%','+2.1'], ['Tag F1 score','88.0%','+1.5'],
    ['Priority accuracy','93.2%','+0.4'], ['SLA risk recall','94.1%','+1.1'], ['Product area accuracy','92.6%','+0.7'], ['Cluster purity','90.3%','-0.5'],
    ['Human edit rate','7.4%','-1.8'], ['Low-confidence rate','10.8%','-2.2'], ['Missing critical tag','2.6%','-0.9'], ['Over-tagging rate','4.1%','-0.4'],
    ['Hallucination rate','0.8%','-0.2'], ['JSON validity rate','99.8%','+0.1'], ['Regression pass rate','97.2%','+0.6'],
  ]
  const trend = Array.from({ length: 8 }, (_, i) => ({ run: `R${i + 1}`, accuracy: 87 + i * .7 + (i % 2), f1: 83 + i * .8, recall: 88 + i * .65 }))
  const lowCases = tickets.filter(t => t.ai.confidence < .68).slice(0, 7)
  const errorData = [{ name: 'Wrong topic', value: 34 }, { name: 'Missing tag', value: 28 }, { name: 'Wrong routing', value: 17 }, { name: 'Priority', value: 12 }, { name: 'Cluster', value: 9 }]
  return <>
    <PageTitle eyebrow="Evaluation & governance" title="AI Quality" description="Measured performance of the analysis model across reviewed evaluation cases." action={<><Badge tone="green" dot>Regression suite passed</Badge><button className="btn btn-secondary" onClick={() => setEvaluationRun(true)}><RefreshCcw size={15}/> {evaluationRun ? 'Evaluation complete' : 'Run evaluation'}</button></>}/>
    <div className="quality-note"><ShieldCheck size={18}/><div><strong>{evaluationRun ? 'Evaluation completed just now' : 'Evaluation snapshot · June 12, 2026'}</strong><span>500 evaluation cases · reviewed labels · repeatable test runs</span></div><button aria-expanded={showMethodology} onClick={() => setShowMethodology(value => !value)}>{showMethodology ? 'Hide methodology' : 'View methodology'} <ExternalLink size={13}/></button></div>
    {showMethodology && <div className="methodology-detail" role="status"><strong>Evaluation methodology</strong><span>Deterministic predictions are compared with reviewed labels for topic, tags, priority, SLA risk, routing, and duplicate-cluster quality. Metrics represent this synthetic evaluation set, not production performance.</span></div>}
    <div className="quality-metrics">{metrics.map(([label,value,delta], i) => <div key={label}><span>{label}</span><strong>{value}</strong><small className={(label.includes('rate') || label.includes('Missing') || label.includes('Over')) ? (delta.startsWith('-') ? 'good' : 'bad') : (delta.startsWith('+') ? 'good' : 'bad')}>{delta.startsWith('+') ? '↑' : '↓'} {delta.replace('-','')} pts</small><i><b style={{ width: value, background: i > 7 && i < 13 ? '#b08a62' : '#607d8b' }}/></i></div>)}</div>
    <div className="grid-main-side"><Panel title="Metric trends" subtitle="Performance across the last eight evaluation runs"><div className="chart-lg"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 16, right: 12, left: -15, bottom: 4 }}><CartesianGrid vertical={false} stroke="#ddd9d1" strokeDasharray="3 5"/><XAxis dataKey="run" axisLine={{ stroke: '#d8d4cc' }} tickLine={false}/><YAxis domain={[75,100]} axisLine={false} tickLine={false}/><Tooltip/><Area dataKey="accuracy" name="Topic accuracy" type="monotone" stroke="#476978" fill="transparent" strokeWidth={3}/><Area dataKey="f1" name="Tag F1" type="monotone" stroke="#668878" fill="transparent" strokeWidth={2.5} strokeDasharray="7 5"/><Area dataKey="recall" name="SLA recall" type="monotone" stroke="#a9784f" fill="transparent" strokeWidth={2.5} strokeDasharray="2 4"/></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-purple"/>Topic accuracy</span><span><i className="legend-green legend-dashed"/>Tag F1</span><span><i className="legend-amber legend-dotted"/>SLA recall</span></div></Panel><Panel title="Error breakdown" subtitle="61 reviewed model errors"><div className="donut-wrap"><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={errorData} dataKey="value" innerRadius={52} outerRadius={76} paddingAngle={3} stroke="#fffefa" strokeWidth={2}>{errorData.map((_, i) => <Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><span><strong>61</strong>errors</span></div><div className="donut-legend">{errorData.map((item, i) => <div key={item.name}><i style={{ background: COLORS[i] }}/><span>{item.name}</span><strong>{item.value}%</strong></div>)}</div></div></Panel></div>
    <div className="two-panels"><Panel title="Most edited topics" subtitle="Where human reviewers correct the primary label"><div className="horizontal-bars compact">{[['Permissions',24],['Integrations',18],['Automation',15],['Workspace Access',11],['Billing',9]].map(([name,value],i) => <div key={name}><span>{name}</span><i><b style={{ width: `${Number(value) / 24 * 100}%`, background: COLORS[i] }}/></i><strong>{value}</strong></div>)}</div></Panel><Panel title="Recent review corrections" subtitle="Feedback captured for future model improvement"><div className="correction-list">{tickets.filter(t => t.ai.review_status === 'Edited').slice(0,5).map(t => <button key={t.ticket_id} onClick={() => openTicket(t.ticket_id)}><span>{t.ticket_id}</span><div><strong>{pretty(t.primary_topic)} → {pretty(t.ai.primary_topic)}</strong><small>{t.reviewer_note}</small></div><ArrowRight size={14}/></button>)}</div></Panel></div>
    <Panel title="Low-confidence evaluation cases" subtitle="Cases below the 68% review threshold" action={<button className="text-link">View all cases <ArrowRight size={14}/></button>}><div className="evaluation-table"><div className="evaluation-head"><span>Case</span><span>Ticket</span><span>Expected / predicted topic</span><span>Expected / predicted tags</span><span>Priority</span><span>SLA risk</span><span>Confidence</span><span>Review</span></div>{lowCases.map((t,i) => <button key={t.ticket_id} onClick={() => openTicket(t.ticket_id)}><span>EV-{String(201+i).padStart(3,'0')}</span><strong>{t.ticket_id}</strong><span><b>{pretty(t.primary_topic)}</b><small>{pretty(t.ai.primary_topic)}</small></span><span><b>{t.secondary_tags.length} expected</b><small>{t.ai.secondary_tags.length} predicted</small></span><span>{t.expected_priority === t.ai.priority ? <Badge tone="green">Correct</Badge> : <Badge tone="red">Mismatch</Badge>}</span><span>{t.expected_sla_risk === t.ai.sla_risk ? <Badge tone="green">Correct</Badge> : <Badge tone="red">Mismatch</Badge>}</span><strong className="confidence-text-low">{Math.round(t.ai.confidence*100)}%</strong><StatusBadge status={t.ai.review_status}/></button>)}</div></Panel>
    <div className="method-cards"><div><Bot size={20}/><span><strong>Analysis service</strong><p>Structured outputs support consistent classification, routing, prioritization, and review.</p></span></div><div><FileText size={20}/><span><strong>Evaluation methodology</strong><p>Predictions are compared with reviewed labels across classification, tagging, risk, and clustering.</p></span></div><div><ShieldCheck size={20}/><span><strong>Human oversight</strong><p>Every recommendation remains reviewable, editable, and auditable before any operational use.</p></span></div></div>
  </>
}

function Dataset({ tickets }: { tickets: Ticket[] }) {
  const topicData = countBy(tickets, t => t.primary_topic).slice(0, 9).map(([name,value]) => ({ name: pretty(name), value }))
  const tagDistribution = [1,2,3,4].map(n => ({ name: n === 4 ? '4+ tags' : `${n} tag${n > 1 ? 's' : ''}`, value: tickets.filter(t => n === 4 ? t.secondary_tags.length >= 4 : t.secondary_tags.length === n).length }))
  const priorities = countBy(tickets, t => t.expected_priority).map(([name,value]) => ({ name,value }))
  const [taxonomy, setTaxonomy] = useState('Primary topics')
  const exportSchema = () => {
    const schema = { ticket: ['ticket_id','subject','description','created_at','channel','ticket_status','assignee','support_team','source_system','sla_due_at','customer_plan','workspace_size'], groundTruth: ['primary_topic','secondary_tags','product_area','intent','sentiment','urgency','impact','expected_priority','expected_sla_risk','expected_team','duplicate_cluster_id'], aiAnalysis: ['primary_topic','secondary_tags','product_area','confidence','priority','sla_risk','suggested_team','duplicate_cluster','explanation','review_status'] }
    const url = URL.createObjectURL(new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'opsqora-ticket-schema.json'
    link.click()
    URL.revokeObjectURL(url)
  }
  return <>
    <PageTitle eyebrow="Data management" title="Dataset" description="A structured ticket dataset for multi-label analysis and evaluation." action={<button className="btn btn-secondary" onClick={exportSchema}><Download size={15}/> Export schema</button>}/>
    <div className="stats-grid four"><StatCard label="Total tickets" value={tickets.length} icon={Inbox}/><StatCard label="Primary topics" value={PRIMARY_TOPICS.length} icon={Tag} tone="blue"/><StatCard label="Secondary tags" value={SECONDARY_TAGS.length} icon={Layers3} tone="green"/><StatCard label="Duplicate clusters" value={new Set(tickets.map(t => t.duplicate_cluster_id).filter(Boolean)).size} icon={Boxes} tone="amber"/></div>
    <div className="two-panels dataset-charts"><Panel title="Primary topic distribution" subtitle="Balanced coverage across the product taxonomy"><div className="chart-lg"><ResponsiveContainer width="100%" height="100%"><BarChart data={topicData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 6 }}><CartesianGrid horizontal={false} stroke="#ddd9d1" strokeDasharray="3 5"/><XAxis type="number" hide/><YAxis type="category" dataKey="name" width={110} axisLine={false} tickLine={false} tick={{fontSize:11, fill:'#646965'}}/><Tooltip/><Bar dataKey="value" name="Tickets" radius={[0,6,6,0]} fill="#476978"/></BarChart></ResponsiveContainer></div></Panel><Panel title="Multi-label distribution" subtitle="Exact target mix across 500 tickets"><div className="donut-wrap dataset-donut"><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={tagDistribution} dataKey="value" innerRadius={55} outerRadius={78} paddingAngle={3} stroke="#fffefa" strokeWidth={2}>{tagDistribution.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><span><strong>500</strong>tickets</span></div><div className="donut-legend">{tagDistribution.map((item,i)=><div key={item.name}><i style={{background:COLORS[i]}}/><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div><div className="distribution-note"><CheckCircle2 size={15}/><span>250 single-tag · 170 two-tag · 60 three-tag · 20 four-or-more</span></div></Panel></div>
    <div className="three-panels"><Panel title="Priority distribution"><div className="simple-distribution">{priorities.map((item,i)=><div key={item.name}><span><PriorityBadge priority={item.name as Priority}/><strong>{item.value}</strong></span><i><b style={{width:`${item.value/priorities[0].value*100}%`,background:COLORS[i]}}/></i></div>)}</div></Panel><Panel title="SLA risk distribution"><div className="simple-distribution">{countBy(tickets,t=>t.expected_sla_risk).map(([name,value],i)=><div key={name}><span><RiskBadge risk={name as Risk}/><strong>{value}</strong></span><i><b style={{width:`${value/300*100}%`,background:COLORS[i]}}/></i></div>)}</div></Panel><Panel title="Suggested team distribution"><div className="simple-distribution">{countBy(tickets,t=>t.expected_team).slice(0,6).map(([name,value],i)=><div key={name}><span><em>{pretty(name)}</em><strong>{value}</strong></span><i><b style={{width:`${value/150*100}%`,background:COLORS[i]}}/></i></div>)}</div></Panel></div>
    <div className="two-panels"><Panel title="Taxonomy browser" subtitle="Explore the labeling system" action={<select className="compact-select" value={taxonomy} onChange={e=>setTaxonomy(e.target.value)}><option>Primary topics</option><option>Secondary tags</option><option>Product areas</option></select>}><div className="taxonomy-grid">{(taxonomy==='Primary topics'?PRIMARY_TOPICS:taxonomy==='Secondary tags'?SECONDARY_TAGS:PRODUCT_AREAS).map((item,i)=><div key={item}><span>{pretty(item)}</span><strong>{taxonomy==='Primary topics'?tickets.filter(t=>t.primary_topic===item).length:taxonomy==='Secondary tags'?tickets.filter(t=>t.secondary_tags.includes(item)).length:tickets.filter(t=>t.product_area===item).length}</strong></div>)}</div></Panel><Panel title="Dataset structure" subtitle="Fields included in every ticket"><div className="schema-list">{[['Ticket content','ticket_id, subject, description, created_at, channel'],['Customer context','customer_plan, workspace_size'],['Ground truth','primary_topic, secondary_tags, product_area, intent, sentiment'],['Operations','urgency, impact, expected_priority, expected_sla_risk, expected_team'],['Pattern signals','duplicate_cluster_id, feature_request_flag, escalation_flag'],['AI output','classification, confidence, explanation, drafts, review_status']].map(([title,fields])=><div key={title}><strong>{title}</strong><code>{fields}</code></div>)}</div></Panel></div>
    <Panel title="Sample tickets" subtitle="First five records in the current dataset"><div className="sample-table"><div><strong>Ticket ID</strong><strong>Subject</strong><strong>Primary topic</strong><strong>Tags</strong><strong>Priority</strong><strong>SLA risk</strong></div>{tickets.slice(0,5).map(t=><div key={t.ticket_id}><span>{t.ticket_id}</span><span>{t.subject}</span><Badge>{pretty(t.primary_topic)}</Badge><span>{t.secondary_tags.map(pretty).join(', ')}</span><PriorityBadge priority={t.expected_priority}/><RiskBadge risk={t.expected_sla_risk}/></div>)}</div></Panel>
  </>
}

function Safety() {
  const principles: [LucideIcon, string, string][] = [
    [ShieldCheck,'Controlled environment','Opsqora keeps analysis and review workflows observable, bounded, and auditable.'],
    [Database,'Data transparency','The active data source is identified consistently across the workspace.'],
    [Users,'Human-in-the-loop review','AI recommendations remain editable and require a human decision before operational use.'],
    [LockKeyhole,'No automatic messaging','Customer reply suggestions remain drafts until a reviewer explicitly approves them.'],
    [Bot,'Decision support, not autonomy','AI helps organize evidence and recommend next steps; it does not resolve tickets.'],
    [Activity,'Visible quality measurement','Accuracy, recall, human edits, confidence, and failure modes are surfaced for governance.'],
  ]
  return <>
    <PageTitle eyebrow="Responsible AI" title="Safety & About" description="Clear boundaries for a human-centered support decision tool."/>
    <div className="safety-hero"><div><Badge tone="green"><ShieldCheck size={12}/> Human-controlled AI</Badge><h2>AI assistance with clear human control.</h2><p>Opsqora helps support and product teams classify demand, spot repeated pain points, and prioritize review while keeping customer-impacting decisions with people.</p></div><div className="safety-orbit"><ShieldCheck size={42}/><span/><span/><span/></div></div>
    <div className="principles-grid">{principles.map(([Icon,title,copy])=><div key={String(title)}><span><Icon size={20}/></span><h3>{String(title)}</h3><p>{String(copy)}</p></div>)}</div>
    <div className="two-panels"><Panel title="Intended use" subtitle="Supported operational workflows"><div className="boundary-list good-list">{['Internal support decision support','AI-assisted multi-label ticket classification','Human review and correction workflows','Duplicate pattern discovery','Product insights from support demand','AI quality monitoring and evaluation'].map(x=><div key={x}><Check size={15}/>{x}</div>)}</div></Panel><Panel title="Non-goals" subtitle="Explicit operational boundaries"><div className="boundary-list bad-list">{['No autonomous ticket resolution','No automatic customer replies','No unreviewed escalations','No hidden classification changes','No untracked routing decisions','No customer-impacting actions without approval'].map(x=><div key={x}><X size={15}/>{x}</div>)}</div></Panel></div>
    <Panel title="Known limitations" subtitle="Current operational constraints"><div className="limitations"><div><strong>Model confidence varies</strong><p>Low-confidence cases require review before routing or prioritization decisions are accepted.</p></div><div><strong>Session-based state</strong><p>Review changes persist for the current browser session and can be restored from settings.</p></div><div><strong>Evaluation context</strong><p>Quality metrics should be interpreted alongside review volume, thresholds, and error categories.</p></div><div><strong>Integration coverage</strong><p>External ticketing, identity, messaging, and incident workflows require configured connectors.</p></div></div></Panel>
  </>
}

function SettingsPage({ reset }: { reset: () => void }) {
  const [threshold,setThreshold]=useState(70)
  return <>
    <PageTitle eyebrow="Workspace configuration" title="Settings" description="Manage analysis behavior, review thresholds, and workspace data."/>
    <div className="settings-layout"><div><Panel title="AI configuration" subtitle="Analysis service settings"><div className="settings-list"><div><span><Bot size={18}/><span><strong>AI provider</strong><small>Analysis engine used for ticket classification</small></span></span><Badge tone="purple">Opsqora AI</Badge></div><div><span><Sparkles size={18}/><span><strong>Model</strong><small>Active model for ticket analysis</small></span></span><strong>Analysis Model v1</strong></div><div><span><Activity size={18}/><span><strong>Operating mode</strong><small>Every ticket is analyzed; flagged outcomes require a person</small></span></span><Badge tone="green">Automatic analysis</Badge></div></div></Panel><Panel title="Analysis preferences" subtitle="Controls for human-review routing"><div className="settings-control"><label htmlFor="confidence-threshold"><span><strong>Confidence review threshold</strong><small>Cases below this score enter Human Review</small></span><b>{threshold}%</b></label><input id="confidence-threshold" aria-label="Confidence review threshold" type="range" min="50" max="90" value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/><div><span>50%</span><span>90%</span></div></div><div className="toggle-setting disabled"><span><strong>Automatic ticket analysis</strong><small>Always on: every incoming ticket receives an AI recommendation</small></span><label aria-label="Automatic ticket analysis is enabled"><input type="checkbox" checked disabled readOnly/><i/></label></div><div className="toggle-setting"><span><strong>Show low-confidence warnings</strong><small>Highlight cases below the review threshold</small></span><label aria-label="Show low-confidence warnings"><input type="checkbox" defaultChecked/><i/></label></div></Panel></div><aside><Panel title="Data source" subtitle="Current workspace dataset"><div className="source-card"><Database size={24}/><strong>Local ticket dataset</strong><span>500 support tickets</span><span>Structured analysis fields</span><span>Available in this workspace</span></div></Panel><Panel title="Reset workspace data" subtitle="Restore the original workspace state"><p className="settings-copy">This clears review changes, added tickets, notes, and local status updates.</p><button className="btn btn-danger wide-btn" onClick={reset}><RotateCcw size={15}/> Reset workspace data</button></Panel><div className="demo-safety"><ShieldCheck size={18}/><div><strong>Human control is enforced</strong><span>AI analyzes every ticket, while customer-impacting actions require explicit approval.</span></div></div></aside></div>
  </>
}

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => generateTickets())
  const [page, setPage] = useState<Page>('overview')
  const [overviewPeriod, setOverviewPeriod] = useState<number | 'custom'>(30)
  const [inboxQueue, setInboxQueue] = useState<QueueId>('all')
  const [selectedId, setSelectedId] = useState('TCK-0001')
  const [globalSearch, setGlobalSearch] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const globalSearchRef = useRef<HTMLInputElement>(null)
  const resetCancelRef = useRef<HTMLButtonElement>(null)
  const datasetDates = useMemo(() => { const values = tickets.map(ticket => ticket.created_at.slice(0, 10)).sort(); const max = values[values.length - 1]; const latest = parseDateKey(max); const defaultStart = new Date(latest.getTime() - 29 * 86400000); return { min: values[0], max, defaultStart: dateKey(defaultStart) } }, [tickets])
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const activeCustomStart = customStart || datasetDates.defaultStart
  const activeCustomEnd = customEnd || datasetDates.max
  const updateCustomStart = (next: string) => { setCustomStart(next); if (next > activeCustomEnd) setCustomEnd(next) }
  const updateCustomEnd = (next: string) => { setCustomEnd(next); if (next < activeCustomStart) setCustomStart(next) }
  const selectedTicket = tickets.find(t => t.ticket_id === selectedId) ?? tickets[0]
  const recentTickets = useMemo(() => [...tickets].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 5), [tickets])
  const urgentTicket = useMemo(() => tickets.find(ticket => ['critical', 'high'].includes(ticket.ai.sla_risk)), [tickets])
  const lowConfidenceTicket = useMemo(() => tickets.find(ticket => ticket.ai.confidence < .7), [tickets])
  const unreadCount = notificationsRead ? 0 : Math.min(9, recentTickets.length + Number(Boolean(urgentTicket)) + Number(Boolean(lowConfidenceTicket)))
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); globalSearchRef.current?.focus() }
      if (event.key === 'Escape') { setShowNotifications(false); setShowResetConfirm(false) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  useEffect(() => { if (showResetConfirm) resetCancelRef.current?.focus() }, [showResetConfirm])
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2600) }
  const navigate = (target: Page) => { setShowNotifications(false); setShowMobileNav(false); setPage(target); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openTicket = (id: string) => { setShowNotifications(false); setNotificationsRead(true); setSelectedId(id); navigate('review') }
  const openReviewQueue = () => { const next = tickets.find(ticket => humanReviewReasons(ticket).length > 0); next ? openTicket(next.ticket_id) : navigate('review') }
  const openQueue = (queue: QueueId) => { setInboxQueue(queue); navigate('inbox') }
  const updateTicket = (patch: Partial<Ticket>, aiPatch?: Partial<Ticket['ai']>) => setTickets(current => current.map(t => t.ticket_id === selectedId ? { ...t, ...patch, ai: { ...t.ai, ...aiPatch } } : t))
  const updateMany = (ids: string[], status: ReviewStatus) => { setTickets(current => current.map(t => ids.includes(t.ticket_id) ? { ...t, human_review_requested: status === 'Needs review' ? true : false, reviewed_at: status === 'Approved' ? new Date().toISOString() : t.reviewed_at, ai: { ...t.ai, review_status: status } } : t)); showToast(status === 'Needs review' ? `${ids.length} tickets sent for human review` : `${ids.length} tickets updated`) }
  const assignMany = (ids: string[]) => { setTickets(current => current.map(ticket => ids.includes(ticket.ticket_id) ? { ...ticket, assignee: 'Maya Rodriguez', ticket_status: ticket.ticket_status === 'New' ? 'Open' : ticket.ticket_status } : ticket)); showToast(`${ids.length} tickets assigned to Maya Rodriguez`) }
  const simulate = () => { const next = generateTickets(5, tickets.length); setTickets(current => [...next, ...current]); setNotificationsRead(false); showToast('5 tickets added to the inbox') }
  const reset = () => { setTickets(generateTickets()); setSelectedId('TCK-0001'); setNotificationsRead(false); setShowResetConfirm(false); showToast('Workspace data restored') }
  const searchSubmit = (e: React.FormEvent) => { e.preventDefault(); if (globalSearch.trim()) navigate('inbox') }
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand" aria-label="Opsqora"><span className="brand-mark" aria-hidden="true"/><div><strong>Opsqora</strong></div></div><nav aria-label="Primary navigation">{navItems.map(item => <button key={item.id} aria-label={item.id === 'inbox' ? `${item.label}, ${tickets.length} tickets` : item.label} aria-current={page === item.id ? 'page' : undefined} className={`${page === item.id ? 'active ' : ''}nav-${item.id}`} onClick={() => item.id === 'inbox' ? openQueue('all') : item.id === 'review' ? openReviewQueue() : navigate(item.id)}><item.icon size={17}/><span>{item.label}</span>{item.id === 'inbox' && <em aria-hidden="true">{tickets.length}</em>}</button>)}<button className={`mobile-more ${showMobileNav ? 'active' : ''}`} aria-label="More navigation" aria-expanded={showMobileNav} onClick={() => setShowMobileNav(value => !value)}><MoreHorizontal size={18}/><span>More</span></button></nav>{showMobileNav && <><button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setShowMobileNav(false)}/><section className="mobile-nav-sheet" aria-label="More navigation options"><header><strong>More</strong><button aria-label="Close navigation menu" onClick={() => setShowMobileNav(false)}><X size={17}/></button></header>{navItems.slice(4).map(item => <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><item.icon size={18}/><span>{item.label}</span><ArrowRight size={15}/></button>)}</section></>}<div className="data-label"><Database size={13}/> Synthetic data</div><div className="sidebar-user"><div className="avatar user-avatar">MR</div><div><strong>Maya Rodriguez</strong><span>Admin</span></div><button aria-label="Open user menu"><MoreHorizontal size={16}/></button></div></aside>
    <div className="main-shell"><header className="topbar"><form className="global-search" onSubmit={searchSubmit}><Search size={16}/><input ref={globalSearchRef} aria-label="Global search" aria-keyshortcuts="Meta+K Control+K" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} placeholder="Search tickets, clusters, or tags…"/><kbd>⌘ K</kbd></form>{page === 'overview' && <div className={`topbar-period ${overviewPeriod === 'custom' ? 'custom' : ''}`}><Clock3 size={15}/><span>Reporting period</span><select value={overviewPeriod} onChange={event => { const value = event.target.value; setOverviewPeriod(value === 'custom' ? 'custom' : Number(value)) }} aria-label="Overview reporting period"><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value="custom">Custom range</option></select>{overviewPeriod === 'custom' && <div className="custom-date-range"><input type="date" aria-label="Reporting start date" min={datasetDates.min} max={activeCustomEnd} value={activeCustomStart} onInput={event => updateCustomStart(event.currentTarget.value)}/><span>to</span><input type="date" aria-label="Reporting end date" min={activeCustomStart} max={datasetDates.max} value={activeCustomEnd} onInput={event => updateCustomEnd(event.currentTarget.value)}/></div>}</div>}<div className="top-actions"><div className="demo-tools"><span>Demo tools</span><button className="demo-generate" onClick={simulate} title="Generates 5 synthetic tickets"><Plus size={15}/> Generate test tickets</button><button className="demo-reset" aria-label="Reset demo data" title="Reset demo data" onClick={() => setShowResetConfirm(true)}><RotateCcw size={16}/></button></div><div className="notification-shell"><button className={`icon-btn notification ${showNotifications ? 'active' : ''}`} aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications(value => !value)}><Bell size={17}/>{unreadCount > 0 && <b>{unreadCount}</b>}</button>{showNotifications && <><button className="notification-backdrop" aria-label="Close notifications" onClick={() => setShowNotifications(false)}/><section className="notification-panel" aria-label="Notification center"><header><div><strong>Notifications</strong><span>Operational signals and recent arrivals</span></div><button aria-label="Close notification center" onClick={() => setShowNotifications(false)}><X size={16}/></button></header><div className="notification-toolbar"><span>{unreadCount ? `${unreadCount} unread` : 'All caught up'}</span><button onClick={() => setNotificationsRead(true)} disabled={!unreadCount}><Check size={13}/> Mark all read</button></div><div className="notification-section"><h3>Needs attention</h3>{urgentTicket && <button className="notification-item alert" onClick={() => openTicket(urgentTicket.ticket_id)}><span><AlertTriangle size={15}/></span><div><strong>High SLA risk · {urgentTicket.ticket_id}</strong><p>{urgentTicket.subject}</p><small>{shortDate(urgentTicket.created_at)}</small></div></button>}{lowConfidenceTicket && <button className="notification-item" onClick={() => openTicket(lowConfidenceTicket.ticket_id)}><span><Gauge size={15}/></span><div><strong>Low-confidence classification</strong><p>{lowConfidenceTicket.ticket_id} · {Math.round(lowConfidenceTicket.ai.confidence * 100)}% confidence</p><small>Review recommended</small></div></button>}<button className="notification-item" onClick={() => navigate('clusters')}><span><Boxes size={15}/></span><div><strong>Duplicate clusters updated</strong><p>Review emerging patterns across recent tickets</p><small>Open cluster analysis</small></div></button></div><div className="notification-section recent"><h3>Recent tickets</h3>{recentTickets.map(ticket => <button className="notification-item" key={ticket.ticket_id} onClick={() => openTicket(ticket.ticket_id)}><span><Inbox size={15}/></span><div><strong>{ticket.ticket_id} · {pretty(ticket.ai.primary_topic)}</strong><p>{ticket.subject}</p><small>{shortDate(ticket.created_at)} · {ticket.channel}</small></div></button>)}</div><button className="notification-footer" onClick={() => navigate('inbox')}>View all tickets <ArrowRight size={14}/></button></section></>}</div></div></header>
      <main className={page === 'review' ? 'content content-review' : 'content'}>
        {page === 'overview' && <Overview tickets={tickets} go={navigate} openQueue={openQueue} period={overviewPeriod} customStart={activeCustomStart} customEnd={activeCustomEnd}/>} 
        {page === 'inbox' && <TicketInbox tickets={tickets} openTicket={openTicket} updateMany={updateMany} assignMany={assignMany} queue={inboxQueue} onQueueChange={setInboxQueue} initialSearch={globalSearch}/>} 
        {page === 'review' && selectedTicket && <TicketReview key={selectedTicket.ticket_id} ticket={selectedTicket} update={updateTicket} goBack={() => navigate('inbox')} openTicket={openTicket} tickets={tickets}/>} 
        {page === 'clusters' && <DuplicateClusters tickets={tickets} openTicket={openTicket}/>} 
        {page === 'insights' && <ProductInsights tickets={tickets} goInbox={(query='') => { setGlobalSearch(query); navigate('inbox') }}/>} 
        {page === 'quality' && <AIQuality tickets={tickets} openTicket={openTicket}/>} 
        {page === 'dataset' && <Dataset tickets={tickets}/>} 
        {page === 'safety' && <Safety/>} 
        {page === 'settings' && <SettingsPage reset={() => setShowResetConfirm(true)}/>} 
      </main>
    </div>
    {showResetConfirm && <div className="confirm-backdrop" role="presentation" onMouseDown={() => setShowResetConfirm(false)}><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title" onMouseDown={event => event.stopPropagation()}><span className="confirm-icon"><RotateCcw size={20}/></span><h2 id="reset-dialog-title">Reset demo data?</h2><p>This removes generated tickets, review changes, assignments, and notes from the current session.</p><div><button ref={resetCancelRef} className="btn btn-secondary" onClick={() => setShowResetConfirm(false)}>Cancel</button><button className="btn btn-danger" onClick={reset}>Reset demo data</button></div></section></div>}
    {toast && <div className="toast" role="status" aria-live="polite"><CheckCircle2 size={17}/>{toast}</div>}
  </div>
}
