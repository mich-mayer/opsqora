import {
  ArrowRight,
  Check,
  ChevronLeft, ChevronRight,
  Clock3,
  Info,
  ListFilter,
  RotateCcw, Search,
  ShieldCheck,
  Sparkles,
  Users, X
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Badge, ColumnHeader, EmptyState,
  PageTitle, Panel,
  PriorityBadge,
  StatusBadge, TicketStatusBadge, columnHelp
} from '../components/primitives'
import {
  PRIMARY_TOPICS, PRODUCT_AREAS,
  SUPPORT_AGENTS, TEAMS
} from '../data'
import {
  humanReviewReasons, operationalNow,
  pretty, priorityOrder, shortDate, slaInfo
} from '../lib'
import type { QueueId, ReviewStatus, Ticket } from '../types'

type InboxFilters = { channel: string; plan: string; priority: string; risk: string; topic: string; area: string; team: string; ticketStatus: string; reviewStatus: string; assignee: string; confidence: string; feature: boolean }
const emptyFilters: InboxFilters = { channel: '', plan: '', priority: '', risk: '', topic: '', area: '', team: '', ticketStatus: '', reviewStatus: '', assignee: '', confidence: '', feature: false }

export function TicketInbox({ tickets, openTicket, updateMany, assignMany, queue, onQueueChange, reviewThreshold, initialSearch = '', initialConfidence = '' }: { tickets: Ticket[]; openTicket: (id: string) => void; updateMany: (ids: string[], status: ReviewStatus) => void; assignMany: (ids: string[]) => void; queue: QueueId; onQueueChange: (queue: QueueId) => void; reviewThreshold: number; initialSearch?: string; initialConfidence?: string }) {
  const [search, setSearch] = useState(initialSearch)
  const [filters, setFilters] = useState(emptyFilters)
  const [selected, setSelected] = useState<string[]>([])
  const [sort, setSort] = useState<'newest' | 'priority' | 'confidence'>('newest')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const now = useMemo(() => operationalNow(tickets), [tickets])
  useEffect(() => { setSearch(initialSearch); setPage(1) }, [initialSearch])
  useEffect(() => { setFilters(current => ({ ...current, confidence: initialConfidence })); setPage(1) }, [initialConfidence])
  const queueMatches = (ticket: Ticket, queueId: QueueId) => {
    if (queueId === 'mine') return ticket.assignee === 'Maya Rodriguez' && ticket.ticket_status !== 'Solved'
    if (queueId === 'unassigned') return !ticket.assignee && ticket.ticket_status !== 'Solved'
    if (queueId === 'sla') return ticket.ticket_status !== 'Solved' && slaInfo(ticket, now).tone !== 'green'
    if (queueId === 'human-review') return humanReviewReasons(ticket, reviewThreshold).length > 0
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
        (!filters.confidence || (filters.confidence === 'low' ? t.ai.confidence < reviewThreshold : filters.confidence === 'medium' ? t.ai.confidence >= reviewThreshold : t.ai.confidence >= .85)) &&
        (!filters.feature || t.feature_request_flag)
    })
      .sort((a, b) => queue === 'sla' ? slaInfo(a, now).sort - slaInfo(b, now).sort : sort === 'priority' ? priorityOrder[a.ai.priority] - priorityOrder[b.ai.priority] : sort === 'confidence' ? a.ai.confidence - b.ai.confidence : +new Date(b.created_at) - +new Date(a.created_at))
  }, [tickets, search, filters, sort, queue, now, reviewThreshold])
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
    filters.confidence && { key: 'confidence', label: `Confidence: ${filters.confidence === 'low' ? `Under ${Math.round(reviewThreshold * 100)}%` : filters.confidence === 'medium' ? `${Math.round(reviewThreshold * 100)}%+` : '85%+'}` },
    filters.feature && { key: 'feature', label: 'Feature requests' },
  ].filter((chip): chip is { key: keyof InboxFilters; label: string } => Boolean(chip))
  const toggleAll = () => setSelected(visible.every(t => selected.includes(t.ticket_id)) ? selected.filter(id => !visible.some(t => t.ticket_id === id)) : [...new Set([...selected, ...visible.map(t => t.ticket_id)])])
  const setFilter = (key: keyof InboxFilters, value: string | boolean) => { setFilters(current => ({ ...current, [key]: value })); setPage(1) }
  const resetView = () => { setFilters(emptyFilters); setSearch(''); onQueueChange('all'); setPage(1) }
  return <>
    <PageTitle eyebrow="Operations" title="Ticket Inbox" description={`${filtered.length} tickets in ${queueOptions.find(item => item.id === queue)?.label.toLowerCase()} · operational status and AI review are tracked separately`} action={<button className="btn btn-secondary" onClick={resetView}><RotateCcw size={15} /> Reset view</button>} />
    <div className="notice-bar"><ShieldCheck size={16} /><strong>AI recommendations are advisory</strong><span>Only flagged cases enter Human Review; Opsqora never resolves tickets or contacts customers automatically.</span></div>
    <Panel title="Support queue" subtitle="Saved operational views across all support channels" className="table-panel" action={<div className="table-tools"><div className="search-field table-search"><Search size={15} /><input aria-label="Search tickets" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search ID, subject, or tag" />{search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={14} /></button>}</div><button className={`btn btn-small ${showFilters ? 'btn-tinted' : 'btn-secondary'}`} onClick={() => setShowFilters(v => !v)} aria-expanded={showFilters}><ListFilter size={15} /> More filters {secondaryFilters > 0 && <b>{secondaryFilters}</b>}</button><button className={`btn btn-small ${showGuide ? 'btn-tinted' : 'btn-secondary'}`} onClick={() => setShowGuide(v => !v)} aria-expanded={showGuide}><Info size={14} /> Column guide</button><select aria-label="Sort tickets" className="compact-select" value={sort} onChange={e => setSort(e.target.value as typeof sort)} disabled={queue === 'sla'}><option value="newest">Newest first</option><option value="priority">Priority</option><option value="confidence">Lowest confidence</option></select></div>}>
      <div className="saved-queues" aria-label="Saved ticket queues">
        <label className="mobile-queue-picker"><span>Support queue</span><select aria-label="Support queue" value={queue} onChange={event => { onQueueChange(event.target.value as QueueId); setPage(1); setSelected([]) }}>{queueOptions.map(item => <option key={item.id} value={item.id}>{item.label} · {tickets.filter(ticket => queueMatches(ticket, item.id)).length}</option>)}</select></label>
        {queueOptions.map(item => <button key={item.id} className={queue === item.id ? 'active' : ''} aria-pressed={queue === item.id} onClick={() => { onQueueChange(item.id); setPage(1); setSelected([]) }}><span>{item.label}</span><b>{tickets.filter(ticket => queueMatches(ticket, item.id)).length}</b></button>)}
      </div>
      {showGuide && <div className="column-guide"><div className="column-guide-intro"><Info size={17} /><span><strong>How to read this table</strong><small>Hover or focus any column title for a quick explanation.</small></span></div>{(['classification', 'priority', 'risk', 'confidence', 'status', 'cluster'] as const).map(key => { const [label, description, values] = columnHelp[key]; return <div key={key}><strong>{label}</strong><span>{description}</span><small>{values}</small></div> })}</div>}
      <div className="filter-bar filter-bar-primary">
        <select aria-label="Channel" value={filters.channel} onChange={e => setFilter('channel', e.target.value)}><option value="">All channels</option>{['Email', 'Web form', 'In-app', 'API support'].map(x => <option key={x} value={x}>{x}</option>)}</select>
        <select aria-label="Ticket status" value={filters.ticketStatus} onChange={e => setFilter('ticketStatus', e.target.value)}><option value="">All ticket statuses</option>{['New', 'Open', 'Pending', 'Solved'].map(x => <option key={x}>{x}</option>)}</select>
        <select aria-label="Priority" value={filters.priority} onChange={e => setFilter('priority', e.target.value)}><option value="">All priorities</option>{['P1', 'P2', 'P3', 'P4'].map(x => <option key={x}>{x}</option>)}</select>
        <select aria-label="SLA risk" value={filters.risk} onChange={e => setFilter('risk', e.target.value)}><option value="">All SLA risk</option>{['critical', 'high', 'medium', 'low'].map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select>
        <select aria-label="AI review status" value={filters.reviewStatus} onChange={e => setFilter('reviewStatus', e.target.value)}><option value="">All AI review statuses</option>{['Not analyzed', 'Analyzed', 'Needs review', 'Approved', 'Edited', 'Escalated'].map(x => <option key={x}>{x}</option>)}</select>
      </div>
      {showFilters && <div className="filter-bar filter-bar-secondary">
        <select aria-label="Customer plan" value={filters.plan} onChange={e => setFilter('plan', e.target.value)}><option value="">All plans</option>{['Starter', 'Pro', 'Business', 'Enterprise'].map(x => <option key={x} value={x}>{x}</option>)}</select>
        <select value={filters.topic} onChange={e => setFilter('topic', e.target.value)}><option value="">All topics</option>{PRIMARY_TOPICS.map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select>
        <select value={filters.area} onChange={e => setFilter('area', e.target.value)}><option value="">All product areas</option>{PRODUCT_AREAS.map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select>
        <select value={filters.team} onChange={e => setFilter('team', e.target.value)}><option value="">All teams</option>{TEAMS.map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select>
        <select aria-label="Assignee" value={filters.assignee} onChange={e => setFilter('assignee', e.target.value)}><option value="">All assignees</option><option value="unassigned">Unassigned</option>{SUPPORT_AGENTS.map(agent => <option key={agent}>{agent}</option>)}</select>
        <select value={filters.confidence} onChange={e => setFilter('confidence', e.target.value)}><option value="">Any confidence</option><option value="low">Below review threshold · under {Math.round(reviewThreshold * 100)}%</option><option value="medium">At or above threshold · {Math.round(reviewThreshold * 100)}%+</option><option value="high">High confidence · 85%+</option></select>
        <label className="check-filter"><input type="checkbox" checked={filters.feature} onChange={e => setFilter('feature', e.target.checked)} /> Feature requests</label>
      </div>}
      {activeFilters > 0 && <div className="active-filters" aria-label="Active filters"><span>Active filters</span>{filterChips.map(chip => <button key={chip.key} onClick={() => setFilter(chip.key, chip.key === 'feature' ? false : '')}>{chip.label}<X size={12} /></button>)}<button className="clear-filters" onClick={resetView}>Clear all</button></div>}
      {selected.length > 0 && <div className="selection-bar"><strong>{selected.length} selected</strong><button onClick={() => assignMany(selected)}><Users size={14} /> Assign to me</button><button onClick={() => updateMany(selected, 'Needs review')}><Sparkles size={14} /> Request human review</button><button onClick={() => updateMany(selected, 'Approved')}><Check size={14} /> Mark reviewed</button><button onClick={() => setSelected([])}><X size={14} /> Clear</button></div>}
      <div className="table-scroll" tabIndex={0} aria-label="Scrollable support ticket table"><table className="ticket-table operational-table"><caption className="sr-only">Support tickets matching the current search and filters</caption><thead><tr><th><input type="checkbox" aria-label="Select all visible tickets" checked={visible.length > 0 && visible.every(t => selected.includes(t.ticket_id))} onChange={toggleAll} /></th><th><ColumnHeader helpKey="ticket" /></th><th><ColumnHeader helpKey="ticketStatus" /></th><th><ColumnHeader helpKey="assignee" /></th><th><ColumnHeader helpKey="sla" /></th><th><ColumnHeader helpKey="classification" /></th><th><ColumnHeader helpKey="priority" /></th><th><ColumnHeader helpKey="confidence" /></th><th><ColumnHeader helpKey="status" /></th><th><ColumnHeader helpKey="cluster" /></th><th><ColumnHeader helpKey="created" /></th></tr></thead><tbody>
        {visible.map(ticket => { const sla = slaInfo(ticket, now); const reviewReasons = humanReviewReasons(ticket, reviewThreshold); return <tr key={ticket.ticket_id} tabIndex={0} aria-label={`Open ${ticket.ticket_id}: ${ticket.subject}`} onKeyDown={e => { if (e.key === 'Enter') openTicket(ticket.ticket_id) }} onClick={() => openTicket(ticket.ticket_id)} className={selected.includes(ticket.ticket_id) ? 'selected-row' : ''}><td onClick={e => e.stopPropagation()}><input aria-label={`Select ${ticket.ticket_id}`} type="checkbox" checked={selected.includes(ticket.ticket_id)} onChange={() => setSelected(s => s.includes(ticket.ticket_id) ? s.filter(id => id !== ticket.ticket_id) : [...s, ticket.ticket_id])} /></td><td><span className="ticket-id">{ticket.ticket_id} · {ticket.external_id}</span><strong className="ticket-subject">{ticket.subject}</strong><small>{ticket.source_system} · {ticket.customer_plan}</small></td><td><TicketStatusBadge status={ticket.ticket_status} /></td><td><strong className={ticket.assignee ? '' : 'muted'}>{ticket.assignee ?? 'Unassigned'}</strong><small>{pretty(ticket.support_team)}</small></td><td><span className={`sla-pill sla-${sla.tone}`}><Clock3 size={12} />{sla.label}</span></td><td><strong>{pretty(ticket.ai.primary_topic)}</strong><div className="tag-stack">{ticket.ai.secondary_tags.slice(0, 2).map(tag => <Badge key={tag}>{pretty(tag)}</Badge>)}{ticket.ai.secondary_tags.length > 2 && <Badge>+{ticket.ai.secondary_tags.length - 2}</Badge>}</div></td><td><PriorityBadge priority={ticket.ai.priority} /></td><td><div className={`confidence ${ticket.ai.confidence < reviewThreshold ? 'confidence-low' : ''}`}><span>{Math.round(ticket.ai.confidence * 100)}%</span><i><b style={{ width: `${ticket.ai.confidence * 100}%` }} /></i></div></td><td><StatusBadge status={ticket.ai.review_status} />{queue === 'human-review' && reviewReasons.length > 0 && <small className="review-reason">{reviewReasons.slice(0, 2).join(' · ')}</small>}</td><td>{ticket.ai.duplicate_cluster ? <Badge tone="purple">{ticket.ai.duplicate_cluster}</Badge> : <span className="muted">—</span>}</td><td><span className="date-cell">{shortDate(ticket.created_at)}</span></td></tr> })}
      </tbody></table>{visible.length === 0 && <EmptyState>No tickets match these filters.</EmptyState>}</div>
      <footer className="table-footer"><span>Showing {visible.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span><span className="scroll-hint">Scroll horizontally for more columns <ArrowRight size={13} /></span><div className="pagination"><button aria-label="Previous page" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={15} /></button><span>Page {page} of {pages}</span><button aria-label="Next page" disabled={page === pages} onClick={() => setPage(p => p + 1)}><ChevronRight size={15} /></button></div></footer>
    </Panel>
  </>
}
