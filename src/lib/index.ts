import type { Priority, Ticket } from '../types'

export const COLORS = ['#476978', '#668878', '#a9784f', '#a95f5f', '#67839a', '#7f718c']
export const priorityOrder: Record<Priority, number> = { P1: 1, P2: 2, P3: 3, P4: 4 }
export const DEFAULT_REVIEW_THRESHOLD = 0.7

export const pretty = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())

export const shortDate = (value: string) => new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(value))

export const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const parseDateKey = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const operationalNow = (tickets: Ticket[]) => Math.max(...tickets.map(ticket => +new Date(ticket.created_at))) + 12 * 3600000

export const slaInfo = (ticket: Ticket, now: number) => {
  if (ticket.ticket_status === 'Solved') return { label: 'SLA met', tone: 'green', sort: Number.POSITIVE_INFINITY }
  const minutes = Math.round((+new Date(ticket.sla_due_at) - now) / 60000)
  const absolute = Math.abs(minutes)
  const duration = absolute >= 1440
    ? `${Math.floor(absolute / 1440)}d ${Math.floor(absolute % 1440 / 60)}h`
    : absolute >= 60
      ? `${Math.floor(absolute / 60)}h ${absolute % 60}m`
      : `${absolute}m`
  return minutes < 0
    ? { label: `${duration} overdue`, tone: 'red', sort: minutes }
    : minutes <= 480
      ? { label: `${duration} left`, tone: 'amber', sort: minutes }
      : { label: `${duration} left`, tone: 'green', sort: minutes }
}

export const humanReviewReasons = (ticket: Ticket, threshold = DEFAULT_REVIEW_THRESHOLD) => {
  if (['Approved', 'Edited'].includes(ticket.ai.review_status)) return []
  const reasons: string[] = []
  if (ticket.human_review_requested) reasons.push('Manual request')
  if (ticket.ai.confidence < threshold) reasons.push('Low confidence')
  if (['critical', 'high'].includes(ticket.ai.sla_risk)) reasons.push('High SLA risk')
  if (['workspace blocked', 'critical workflow degraded'].includes(ticket.ai.impact)) reasons.push('High customer impact')
  if (ticket.escalation_flag) reasons.push('Escalation candidate')
  return reasons
}

export const countBy = <T,>(items: T[], getter: (item: T) => string) => Object.entries(items.reduce<Record<string, number>>((acc, item) => {
  const key = getter(item)
  acc[key] = (acc[key] ?? 0) + 1
  return acc
}, {})).sort((a, b) => b[1] - a[1])
