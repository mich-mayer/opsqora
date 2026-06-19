import { Activity, ChevronDown, Info, Search } from 'lucide-react'
import type React from 'react'
import { pretty } from '../lib'
import type { Priority, ReviewStatus, Risk, TicketStatus } from '../types'

export function Badge({ children, tone = 'neutral', dot = false }: { children: React.ReactNode; tone?: string; dot?: boolean }) {
  return <span className={`badge badge-${tone}`}>{dot && <i />} {children}</span>
}

export function StatusBadge({ status }: { status: ReviewStatus }) {
  const tones: Record<ReviewStatus, string> = {
    'Not analyzed': 'neutral',
    Analyzed: 'blue',
    'Needs review': 'amber',
    Approved: 'green',
    Edited: 'purple',
    Escalated: 'red',
  }
  return <Badge tone={tones[status]} dot>{status}</Badge>
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const tones: Record<TicketStatus, string> = { New: 'blue', Open: 'purple', Pending: 'amber', Solved: 'green' }
  return <Badge tone={tones[status]} dot>{status}</Badge>
}

export function RiskBadge({ risk }: { risk: Risk }) {
  const tone = risk === 'critical' ? 'red' : risk === 'high' ? 'amber' : risk === 'medium' ? 'blue' : 'green'
  return <Badge tone={tone}>{pretty(risk)}</Badge>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const tone = priority === 'P1' ? 'red' : priority === 'P2' ? 'amber' : priority === 'P3' ? 'blue' : 'neutral'
  return <Badge tone={tone}>{priority}</Badge>
}

export function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-title">
    <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div>
    {action && <div className="page-actions">{action}</div>}
  </div>
}

export function StatCard({ label, value, delta, icon: Icon, tone = 'purple', onClick }: { label: string; value: string | number; delta?: string; icon: typeof Activity; tone?: string; onClick?: () => void }) {
  const content = <>
    <div className={`stat-icon icon-${tone}`}><Icon size={18} /></div>
    <div className="stat-meta"><span>{label}</span><strong>{value}</strong></div>
    {delta && <span className={`stat-delta ${delta.startsWith('+') ? 'up' : ''}`}>{delta}</span>}
  </>
  return onClick
    ? <button className="stat-card" onClick={onClick} type="button" aria-label={`${label}: ${value}${delta ? `. ${delta}` : ''}`}>{content}</button>
    : <div className="stat-card stat-card-static">{content}</div>
}

export function Panel({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>
    <header className="panel-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</header>
    {children}
  </section>
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="empty-state" role="status"><Search size={24} /><div><strong>No results found</strong><p>{children}</p></div></div>
}

export const columnHelp = {
  ticket: ['Ticket', 'The original support request and customer context.', 'ID · subject · channel · plan'],
  ticketStatus: ['Ticket status', 'Operational lifecycle of the customer request.', 'New · Open · Pending · Solved'],
  assignee: ['Assignee', 'Agent and team currently responsible for the ticket.', 'Agent · support team'],
  sla: ['SLA', 'Time remaining before the response commitment is breached.', 'On track · due soon · overdue · met'],
  classification: ['AI classification', 'AI-predicted primary topic and supporting secondary tags.', 'Primary topic · secondary tags'],
  priority: ['Priority', 'Recommended order for handling the ticket.', 'P1 critical · P2 high · P3 normal · P4 low'],
  risk: ['SLA risk', 'Likelihood that the response target may be missed.', 'Critical · High · Medium · Low'],
  area: ['Product area', 'Part of the product most likely affected.', 'Billing · Mobile · Planning · Automation · more'],
  team: ['Suggested team', 'Team recommended to own the next step.', 'Support · Billing Ops · Identity · Engineering · more'],
  confidence: ['Confidence', 'How certain the AI is about its analysis.', 'High 85%+ · Medium above threshold · Low below review threshold'],
  status: ['Review status', 'Current stage of human review.', 'Not analyzed · Analyzed · Needs review · Approved · Edited · Escalated'],
  cluster: ['Cluster', 'Group of tickets that may describe the same underlying issue.', 'Cluster ID or no match'],
  created: ['Created', 'When the support ticket was received.', 'Date and local time'],
} as const

export function ColumnHeader({ helpKey }: { helpKey: keyof typeof columnHelp }) {
  const [label, description, values] = columnHelp[helpKey]
  return <span className="column-header-help" tabIndex={0} aria-label={`${label}. ${description} Possible values: ${values}`}>
    {label}<Info size={10} />
    <span className="column-tooltip" role="tooltip"><strong>{label}</strong><span>{description}</span><small>{values}</small></span>
  </span>
}

export function FieldSelect({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return <label className="review-field"><span>{label}</span><div><select value={value} onChange={e => onChange(e.target.value)}>{values.map(x => <option key={x} value={x}>{pretty(x)}</option>)}</select><ChevronDown size={14} /></div></label>
}
