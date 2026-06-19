import {
  AlertTriangle, ArrowRight, BarChart3, Bell, Boxes, Check, CheckCircle2,
  CircleGauge, ClipboardCheck, Clock3, Database, ExternalLink, Gauge, Inbox,
  LayoutDashboard, MoreHorizontal, Plus, RotateCcw, Search, Settings, ShieldCheck, X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { generateTickets } from './data'
import { DEFAULT_REVIEW_THRESHOLD, dateKey, humanReviewReasons, parseDateKey, pretty, shortDate } from './lib'
import { AIQuality } from './screens/AIQuality'
import { Dataset } from './screens/Dataset'
import { DuplicateClusters } from './screens/DuplicateClusters'
import { Overview } from './screens/Overview'
import { ProductInsights } from './screens/ProductInsights'
import { Safety } from './screens/Safety'
import { SettingsPage } from './screens/SettingsPage'
import { TicketInbox } from './screens/TicketInbox'
import { TicketReview } from './screens/TicketReview'
import type { Page, QueueId, ReviewStatus, Ticket } from './types'

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inbox', label: 'Ticket Inbox', icon: Inbox },
  { id: 'review', label: 'Ticket Review', icon: ClipboardCheck },
  { id: 'clusters', label: 'Duplicate Clusters', icon: Boxes },
  { id: 'insights', label: 'Product Insights', icon: BarChart3 },
  { id: 'quality', label: 'AI Quality', icon: CircleGauge },
  { id: 'dataset', label: 'Dataset', icon: Database },
  { id: 'safety', label: 'Safety & About', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => generateTickets())
  const [page, setPage] = useState<Page>('overview')
  const [overviewPeriod, setOverviewPeriod] = useState<number | 'custom'>(30)
  const [inboxQueue, setInboxQueue] = useState<QueueId>('all')
  const [inboxConfidenceFilter, setInboxConfidenceFilter] = useState('')
  const [reviewThreshold, setReviewThreshold] = useState(DEFAULT_REVIEW_THRESHOLD)
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
  const lowConfidenceTicket = useMemo(() => tickets.find(ticket => ticket.ai.confidence < reviewThreshold), [reviewThreshold, tickets])
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
  const openReviewQueue = () => { const next = tickets.find(ticket => humanReviewReasons(ticket, reviewThreshold).length > 0); next ? openTicket(next.ticket_id) : navigate('review') }
  const openQueue = (queue: QueueId) => { setInboxQueue(queue); setInboxConfidenceFilter(''); navigate('inbox') }
  const openLowConfidenceCases = () => { setInboxQueue('all'); setInboxConfidenceFilter('low'); setGlobalSearch(''); navigate('inbox') }
  const updateTicket = (patch: Partial<Ticket>, aiPatch?: Partial<Ticket['ai']>) => setTickets(current => current.map(t => t.ticket_id === selectedId ? { ...t, ...patch, ai: { ...t.ai, ...aiPatch } } : t))
  const updateMany = (ids: string[], status: ReviewStatus) => { setTickets(current => current.map(t => ids.includes(t.ticket_id) ? { ...t, human_review_requested: status === 'Needs review' ? true : false, reviewed_at: status === 'Approved' ? new Date().toISOString() : t.reviewed_at, ai: { ...t.ai, review_status: status } } : t)); showToast(status === 'Needs review' ? `${ids.length} tickets sent for human review` : `${ids.length} tickets updated`) }
  const assignMany = (ids: string[]) => { setTickets(current => current.map(ticket => ids.includes(ticket.ticket_id) ? { ...ticket, assignee: 'Maya Rodriguez', ticket_status: ticket.ticket_status === 'New' ? 'Open' : ticket.ticket_status } : ticket)); showToast(`${ids.length} tickets assigned to Maya Rodriguez`) }
  const simulate = () => { const next = generateTickets(5, tickets.length); setTickets(current => [...next, ...current]); setNotificationsRead(false); showToast('5 tickets added to the inbox') }
  const reset = () => { setTickets(generateTickets()); setSelectedId('TCK-0001'); setNotificationsRead(false); setShowResetConfirm(false); showToast('Workspace data restored') }
  const searchSubmit = (e: React.FormEvent) => { e.preventDefault(); if (globalSearch.trim()) navigate('inbox') }
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand" aria-label="Opsqora"><img className="brand-mark brand-wordmark" src="logo_text.png" alt="Opsqora" /><img className="brand-mark brand-iconmark" src="opsqora-mark.png" alt="" aria-hidden="true" /></div><nav aria-label="Primary navigation">{navItems.map(item => <button key={item.id} aria-label={item.id === 'inbox' ? `${item.label}, ${tickets.length} tickets` : item.label} aria-current={page === item.id ? 'page' : undefined} className={`${page === item.id ? 'active ' : ''}nav-${item.id}`} onClick={() => item.id === 'inbox' ? openQueue('all') : item.id === 'review' ? openReviewQueue() : navigate(item.id)}><item.icon size={17} /><span>{item.label}</span>{item.id === 'inbox' && <em aria-hidden="true">{tickets.length}</em>}</button>)}<button className={`mobile-more ${showMobileNav ? 'active' : ''}`} aria-label="More navigation" aria-expanded={showMobileNav} onClick={() => setShowMobileNav(value => !value)}><MoreHorizontal size={18} /><span>More</span></button></nav>{showMobileNav && <><button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setShowMobileNav(false)} /><section className="mobile-nav-sheet" aria-label="More navigation options"><header><strong>More</strong><button aria-label="Close navigation menu" onClick={() => setShowMobileNav(false)}><X size={17} /></button></header>{navItems.slice(4).map(item => <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><item.icon size={18} /><span>{item.label}</span><ArrowRight size={15} /></button>)}</section></>}<a className="case-study-link" href="/opsqora/case-study.html"><ExternalLink size={13} /> Case study</a><div className="data-label"><Database size={13} /> Synthetic data</div><div className="sidebar-user"><div className="avatar user-avatar">MR</div><div><strong>Maya Rodriguez</strong><span>Admin</span></div></div></aside>
    <div className="main-shell"><header className="topbar"><form className="global-search" onSubmit={searchSubmit}><Search size={16} /><input ref={globalSearchRef} aria-label="Global search" aria-keyshortcuts="Meta+K Control+K" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} placeholder="Search tickets, clusters, or tags…" /><kbd>⌘ K</kbd></form>{page === 'overview' && <div className={`topbar-period ${overviewPeriod === 'custom' ? 'custom' : ''}`}><Clock3 size={15} /><span>Reporting period</span><select value={overviewPeriod} onChange={event => { const value = event.target.value; setOverviewPeriod(value === 'custom' ? 'custom' : Number(value)) }} aria-label="Overview reporting period"><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option><option value="custom">Custom range</option></select>{overviewPeriod === 'custom' && <div className="custom-date-range"><input type="date" aria-label="Reporting start date" min={datasetDates.min} max={activeCustomEnd} value={activeCustomStart} onInput={event => updateCustomStart(event.currentTarget.value)} /><span>to</span><input type="date" aria-label="Reporting end date" min={activeCustomStart} max={datasetDates.max} value={activeCustomEnd} onInput={event => updateCustomEnd(event.currentTarget.value)} /></div>}</div>}<div className="top-actions"><div className="demo-tools"><span>Demo tools</span><button className="demo-generate" onClick={simulate} title="Generates 5 synthetic tickets"><Plus size={15} /> Generate test tickets</button><button className="demo-reset" aria-label="Reset demo data" title="Reset demo data" onClick={() => setShowResetConfirm(true)}><RotateCcw size={16} /></button></div><div className="notification-shell"><button className={`icon-btn notification ${showNotifications ? 'active' : ''}`} aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications(value => !value)}><Bell size={17} />{unreadCount > 0 && <b>{unreadCount}</b>}</button>{showNotifications && <><button className="notification-backdrop" aria-label="Close notifications" onClick={() => setShowNotifications(false)} /><section className="notification-panel" aria-label="Notification center"><header><div><strong>Notifications</strong><span>Operational signals and recent arrivals</span></div><button aria-label="Close notification center" onClick={() => setShowNotifications(false)}><X size={16} /></button></header><div className="notification-toolbar"><span>{unreadCount ? `${unreadCount} unread` : 'All caught up'}</span><button onClick={() => setNotificationsRead(true)} disabled={!unreadCount}><Check size={13} /> Mark all read</button></div><div className="notification-section"><h3>Needs attention</h3>{urgentTicket && <button className="notification-item alert" onClick={() => openTicket(urgentTicket.ticket_id)}><span><AlertTriangle size={15} /></span><div><strong>High SLA risk · {urgentTicket.ticket_id}</strong><p>{urgentTicket.subject}</p><small>{shortDate(urgentTicket.created_at)}</small></div></button>}{lowConfidenceTicket && <button className="notification-item" onClick={() => openTicket(lowConfidenceTicket.ticket_id)}><span><Gauge size={15} /></span><div><strong>Low-confidence classification</strong><p>{lowConfidenceTicket.ticket_id} · {Math.round(lowConfidenceTicket.ai.confidence * 100)}% confidence</p><small>Review recommended</small></div></button>}<button className="notification-item" onClick={() => navigate('clusters')}><span><Boxes size={15} /></span><div><strong>Duplicate clusters updated</strong><p>Review emerging patterns across recent tickets</p><small>Open cluster analysis</small></div></button></div><div className="notification-section recent"><h3>Recent tickets</h3>{recentTickets.map(ticket => <button className="notification-item" key={ticket.ticket_id} onClick={() => openTicket(ticket.ticket_id)}><span><Inbox size={15} /></span><div><strong>{ticket.ticket_id} · {pretty(ticket.ai.primary_topic)}</strong><p>{ticket.subject}</p><small>{shortDate(ticket.created_at)} · {ticket.channel}</small></div></button>)}</div><button className="notification-footer" onClick={() => navigate('inbox')}>View all tickets <ArrowRight size={14} /></button></section></>}</div></div></header>
      <main className={page === 'review' ? 'content content-review' : 'content'}>
        {page === 'overview' && <Overview tickets={tickets} go={navigate} openQueue={openQueue} period={overviewPeriod} customStart={activeCustomStart} customEnd={activeCustomEnd} reviewThreshold={reviewThreshold} />}
        {page === 'inbox' && <TicketInbox tickets={tickets} openTicket={openTicket} updateMany={updateMany} assignMany={assignMany} queue={inboxQueue} onQueueChange={setInboxQueue} reviewThreshold={reviewThreshold} initialSearch={globalSearch} initialConfidence={inboxConfidenceFilter} />}
        {page === 'review' && selectedTicket && <TicketReview key={selectedTicket.ticket_id} ticket={selectedTicket} update={updateTicket} goBack={() => navigate('inbox')} openTicket={openTicket} tickets={tickets} reviewThreshold={reviewThreshold} />}
        {page === 'clusters' && <DuplicateClusters tickets={tickets} openTicket={openTicket} notify={showToast} />}
        {page === 'insights' && <ProductInsights tickets={tickets} goInbox={(query = '') => { setGlobalSearch(query); setInboxConfidenceFilter(''); setInboxQueue('all'); navigate('inbox') }} />}
        {page === 'quality' && <AIQuality tickets={tickets} openTicket={openTicket} openLowConfidenceCases={openLowConfidenceCases} reviewThreshold={reviewThreshold} />}
        {page === 'dataset' && <Dataset tickets={tickets} />}
        {page === 'safety' && <Safety />}
        {page === 'settings' && <SettingsPage reset={() => setShowResetConfirm(true)} reviewThreshold={reviewThreshold} onReviewThresholdChange={setReviewThreshold} />}
      </main>
    </div>
    {showResetConfirm && <div className="confirm-backdrop" role="presentation" onMouseDown={() => setShowResetConfirm(false)}><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title" onMouseDown={event => event.stopPropagation()}><span className="confirm-icon"><RotateCcw size={20} /></span><h2 id="reset-dialog-title">Reset demo data?</h2><p>This removes generated tickets, review changes, assignments, and notes from the current session.</p><div><button ref={resetCancelRef} className="btn btn-secondary" onClick={() => setShowResetConfirm(false)}>Cancel</button><button className="btn btn-danger" onClick={reset}>Reset demo data</button></div></section></div>}
    {toast && <div className="toast" role="status" aria-live="polite"><CheckCircle2 size={17} />{toast}</div>}
  </div>
}
