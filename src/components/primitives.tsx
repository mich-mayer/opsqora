import { Check, Minus, Search } from 'lucide-react'
import type React from 'react'

export function Wordmark({ href, sub }: { href?: string; sub?: string }) {
  const inner = (
    <>
      <i className="brand-square" aria-hidden="true" />
      <strong>Opsqora</strong>
      {sub && <span className="brand-sub">{sub}</span>}
    </>
  )
  return href
    ? <a className="brand" href={href} aria-label="Opsqora">{inner}</a>
    : <span className="brand">{inner}</span>
}

export function Kicker({ index, children }: { index?: string; children: React.ReactNode }) {
  return <p className="kicker">{index && <span>{index}</span>}{children}</p>
}

export function ScreenHead({
  index,
  kicker,
  title,
  lede,
  aside,
}: {
  index: string
  kicker: string
  title: string
  lede?: string
  aside?: React.ReactNode
}) {
  return <header className="screen-head">
    <div className="screen-head-copy">
      <Kicker index={index}>{kicker}</Kicker>
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </div>
    {aside && <div className="screen-head-aside">{aside}</div>}
  </header>
}

export type ChipTone = 'line' | 'ink' | 'accent' | 'ok' | 'warn' | 'bad'

export function Chip({ tone = 'line', square = false, children }: { tone?: ChipTone; square?: boolean; children: React.ReactNode }) {
  return <span className={`chip chip--${tone}`}>{square && <i aria-hidden="true" />}{children}</span>
}

export function Stat({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return <div className="stat">
    <span className="stat-label">{label}</span>
    <strong className="stat-value">{value}</strong>
    {note && <span className="stat-note">{note}</span>}
  </div>
}

export function RuleCheck({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return <div className={ok ? 'rulecheck is-ok' : 'rulecheck'}>
    <i aria-hidden="true">{ok ? <Check size={12} strokeWidth={3} /> : <Minus size={12} strokeWidth={3} />}</i>
    <div><strong>{label}</strong><span>{detail}</span></div>
  </div>
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="empty" role="status">
    <Search size={20} />
    <div><strong>No matching patterns</strong><p>{children}</p></div>
  </div>
}
