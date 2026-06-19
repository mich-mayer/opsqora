import {
  ArrowRight,
  Boxes,
  Info,
  RefreshCcw,
  Search,
  Sparkles,
  X
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Badge,
  EmptyState,
  PageTitle,
  PriorityBadge
} from '../components/primitives'
import {
  CLUSTER_SUMMARIES
} from '../data'
import {
  countBy,
  pretty, priorityOrder
} from '../lib'
import type { Ticket } from '../types'

export function DuplicateClusters({ tickets, openTicket, notify }: { tickets: Ticket[]; openTicket: (id: string) => void; notify: (message: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [clustersRefreshed, setClustersRefreshed] = useState(false)
  const [clusterSearch, setClusterSearch] = useState('')
  const [clusterArea, setClusterArea] = useState('')
  const [clusterSort, setClusterSort] = useState<'volume' | 'signal'>('volume')
  const clusters = useMemo(() => Array.from(new Set(tickets.map(t => t.ai.duplicate_cluster).filter(Boolean) as string[])).map((id, i) => {
    const members = tickets.filter(t => t.ai.duplicate_cluster === id)
    return { id, members, summary: CLUSTER_SUMMARIES[Number(id.slice(4)) - 1] ?? 'Related workflow issue', topic: countBy(members, t => t.ai.primary_topic)[0]?.[0] ?? 'tasks', area: members[0]?.ai.product_area ?? 'work_management', avgPriority: Math.round(members.reduce((sum, t) => sum + priorityOrder[t.ai.priority], 0) / members.length), risk: members.some(t => ['critical', 'high'].includes(t.ai.sla_risk)) ? 'high' : 'medium', signalScore: -8 + (i * 13) % 47 }
  }).sort((a, b) => b.members.length - a.members.length), [tickets])
  const clusterAreas = useMemo(() => Array.from(new Set(clusters.map(cluster => cluster.area))).sort(), [clusters])
  const visibleClusters = useMemo(() => {
    const query = clusterSearch.trim().replaceAll('_', ' ').toLowerCase()
    return clusters
      .filter(cluster => {
        const searchable = `${cluster.id} ${cluster.summary} ${cluster.topic} ${cluster.area} ${cluster.members.flatMap(ticket => ticket.ai.secondary_tags).join(' ')}`.replaceAll('_', ' ').toLowerCase()
        return (!query || searchable.includes(query)) && (!clusterArea || cluster.area === clusterArea)
      })
      .sort((a, b) => clusterSort === 'signal' ? b.signalScore - a.signalScore : b.members.length - a.members.length)
  }, [clusterArea, clusterSearch, clusterSort, clusters])
  const active = clusters.find(c => c.id === selected)
  const draftIncidentNote = () => {
    if (!active) return
    notify(`Incident note drafted for ${active.id}`)
    setSelected(null)
  }
  return <>
    <PageTitle eyebrow="Pattern detection" title="Duplicate Clusters" description="AI-grouped tickets that may share a root cause or customer pain point." action={<button className="btn btn-secondary" onClick={() => setClustersRefreshed(true)}><RefreshCcw size={15} /> {clustersRefreshed ? 'Clusters up to date' : 'Refresh clusters'}</button>} />
    <div className="notice-bar"><Info size={16} /><strong>Clusters are suggestions, not incidents.</strong><span>A human should validate shared conditions before escalation.</span></div>
    <div className="cluster-toolbar"><div className="search-field"><Search size={15} /><input aria-label="Search clusters" value={clusterSearch} onChange={event => setClusterSearch(event.target.value)} placeholder="Search clusters" /></div><select aria-label="Filter clusters by product area" className="compact-select" value={clusterArea} onChange={event => setClusterArea(event.target.value)}><option value="">All product areas</option>{clusterAreas.map(area => <option key={area} value={area}>{pretty(area)}</option>)}</select><select aria-label="Sort clusters" className="compact-select" value={clusterSort} onChange={event => setClusterSort(event.target.value as typeof clusterSort)}><option value="volume">Highest volume</option><option value="signal">Strongest signal</option></select><span>{visibleClusters.length} active clusters</span></div>
    <div className="cluster-grid">{visibleClusters.map((cluster, i) => <button key={cluster.id} className="cluster-card" onClick={() => setSelected(cluster.id)}><div className="cluster-card-top"><span className={`cluster-number cluster-color-${i % 4}`}><Boxes size={18} /></span><Badge tone={i < 3 ? 'red' : 'amber'}>{i < 3 ? 'Possible incident' : 'Monitor'}</Badge></div><span className="cluster-id">{cluster.id}</span><h3>{cluster.summary}</h3><p>{cluster.members.length} related tickets with common language and affected workflows.</p><div className="cluster-tags"><Badge>{pretty(cluster.topic)}</Badge>{cluster.members[0]?.ai.secondary_tags.slice(0, 2).map(tag => <Badge key={tag}>{pretty(tag)}</Badge>)}</div><div className="cluster-metrics"><div><span>Tickets</span><strong>{cluster.members.length}</strong></div><div><span>Avg priority</span><strong>P{cluster.avgPriority}</strong></div><div><span>SLA risk</span><strong className="risk-text">{pretty(cluster.risk)}</strong></div><div><span>Signal</span><strong className={cluster.signalScore > 0 ? 'trend-up' : 'trend-down'}>{cluster.signalScore > 30 ? 'High' : cluster.signalScore > 10 ? 'Medium' : 'Monitor'}</strong></div></div><div className="cluster-card-footer"><span>Seen May {2 + i} – Jun {3 + i % 8}</span><span>Open cluster <ArrowRight size={14} /></span></div></button>)}</div>
    {visibleClusters.length === 0 && <EmptyState>No clusters match the current search and product-area filter.</EmptyState>}
    {active && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><div className="cluster-drawer" onMouseDown={e => e.stopPropagation()}><header><div><span className="eyebrow">Cluster detail</span><h2>{active.id}</h2><p>{active.summary}</p></div><button className="icon-btn" onClick={() => setSelected(null)}><X size={18} /></button></header><div className="drawer-section"><div className="incident-note"><Sparkles size={17} /><div><strong>Why these tickets were grouped</strong><p>Shared product area, overlapping tags, similar failure language, and a concentrated time window produced a strong semantic match.</p></div></div></div><div className="drawer-stats"><div><span>Tickets</span><strong>{active.members.length}</strong></div><div><span>Dominant topic</span><strong>{pretty(active.topic)}</strong></div><div><span>Cluster purity</span><strong>92%</strong></div></div><div className="drawer-section"><h3>Common signals</h3><div className="tag-cloud">{active.members[0].ai.secondary_tags.map(tag => <Badge key={tag} tone="purple">{pretty(tag)}</Badge>)}<Badge tone="blue">{pretty(active.members[0].ai.product_area)}</Badge></div></div><div className="drawer-section"><h3>Related tickets</h3><div className="related-list">{active.members.slice(0, 8).map(ticket => <button key={ticket.ticket_id} onClick={() => openTicket(ticket.ticket_id)}><span><strong>{ticket.ticket_id}</strong><small>{ticket.subject}</small></span><PriorityBadge priority={ticket.ai.priority} /><ArrowRight size={15} /></button>)}</div></div><div className="drawer-section"><h3>Suggested escalation</h3><p className="drawer-copy">Share this cluster with {pretty(active.members[0].ai.possible_escalation_team)} and validate whether a single root cause explains the recent increase.</p></div><footer><button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button><button className="btn btn-primary" onClick={draftIncidentNote}>Create incident note</button></footer></div></div>}
  </>
}
