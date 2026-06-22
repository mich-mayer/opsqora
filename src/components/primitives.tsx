import { Activity, Search } from 'lucide-react'
import type React from 'react'

export function Badge({ children, tone = 'neutral', dot = false }: { children: React.ReactNode; tone?: string; dot?: boolean }) {
  return <span className={`badge badge-${tone}`}>{dot && <i />} {children}</span>
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
