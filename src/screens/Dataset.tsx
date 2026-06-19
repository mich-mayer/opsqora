import {
  Boxes,
  CheckCircle2,
  Download,
  Inbox,
  Layers3,
  Tag
} from 'lucide-react'
import { useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import {
  Badge,
  PageTitle, Panel,
  PriorityBadge, RiskBadge, StatCard
} from '../components/primitives'
import {
  PRIMARY_TOPICS, PRODUCT_AREAS, SECONDARY_TAGS
} from '../data'
import {
  COLORS, countBy,
  pretty
} from '../lib'
import type { Priority, Risk, Ticket } from '../types'

export function Dataset({ tickets }: { tickets: Ticket[] }) {
  const topicData = countBy(tickets, t => t.primary_topic).slice(0, 9).map(([name, value]) => ({ name: pretty(name), value }))
  const tagDistribution = [1, 2, 3, 4].map(n => ({ name: n === 4 ? '4+ tags' : `${n} tag${n > 1 ? 's' : ''}`, value: tickets.filter(t => n === 4 ? t.secondary_tags.length >= 4 : t.secondary_tags.length === n).length }))
  const priorities = countBy(tickets, t => t.expected_priority).map(([name, value]) => ({ name, value }))
  const [taxonomy, setTaxonomy] = useState('Primary topics')
  const exportSchema = () => {
    const schema = { ticket: ['ticket_id', 'subject', 'description', 'created_at', 'channel', 'ticket_status', 'assignee', 'support_team', 'source_system', 'sla_due_at', 'customer_plan', 'workspace_size'], groundTruth: ['primary_topic', 'secondary_tags', 'product_area', 'intent', 'sentiment', 'urgency', 'impact', 'expected_priority', 'expected_sla_risk', 'expected_team', 'duplicate_cluster_id'], aiAnalysis: ['primary_topic', 'secondary_tags', 'product_area', 'confidence', 'priority', 'sla_risk', 'suggested_team', 'duplicate_cluster', 'explanation', 'review_status'] }
    const url = URL.createObjectURL(new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'opsqora-ticket-schema.json'
    link.click()
    URL.revokeObjectURL(url)
  }
  return <>
    <PageTitle eyebrow="Data management" title="Dataset" description="A structured ticket dataset for multi-label analysis and evaluation." action={<button className="btn btn-secondary" onClick={exportSchema}><Download size={15} /> Export schema</button>} />
    <div className="stats-grid four"><StatCard label="Total tickets" value={tickets.length} icon={Inbox} /><StatCard label="Primary topics" value={PRIMARY_TOPICS.length} icon={Tag} tone="blue" /><StatCard label="Secondary tags" value={SECONDARY_TAGS.length} icon={Layers3} tone="green" /><StatCard label="Duplicate clusters" value={new Set(tickets.map(t => t.duplicate_cluster_id).filter(Boolean)).size} icon={Boxes} tone="amber" /></div>
    <div className="two-panels dataset-charts"><Panel title="Primary topic distribution" subtitle="Balanced coverage across the product taxonomy"><div className="chart-lg"><ResponsiveContainer width="100%" height="100%"><BarChart data={topicData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 6 }}><CartesianGrid horizontal={false} stroke="#ddd9d1" strokeDasharray="3 5" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={110} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#646965' }} /><Tooltip /><Bar dataKey="value" name="Tickets" radius={[0, 6, 6, 0]} fill="#476978" /></BarChart></ResponsiveContainer></div></Panel><Panel title="Multi-label distribution" subtitle="Exact target mix across 500 tickets"><div className="donut-wrap dataset-donut"><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={tagDistribution} dataKey="value" innerRadius={55} outerRadius={78} paddingAngle={3} stroke="#fffefa" strokeWidth={2}>{tagDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><span><strong>500</strong>tickets</span></div><div className="donut-legend">{tagDistribution.map((item, i) => <div key={item.name}><i style={{ background: COLORS[i] }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div><div className="distribution-note"><CheckCircle2 size={15} /><span>250 single-tag · 170 two-tag · 60 three-tag · 20 four-or-more</span></div></Panel></div>
    <div className="three-panels"><Panel title="Priority distribution"><div className="simple-distribution">{priorities.map((item, i) => <div key={item.name}><span><PriorityBadge priority={item.name as Priority} /><strong>{item.value}</strong></span><i><b style={{ width: `${item.value / priorities[0].value * 100}%`, background: COLORS[i] }} /></i></div>)}</div></Panel><Panel title="SLA risk distribution"><div className="simple-distribution">{countBy(tickets, t => t.expected_sla_risk).map(([name, value], i) => <div key={name}><span><RiskBadge risk={name as Risk} /><strong>{value}</strong></span><i><b style={{ width: `${value / 300 * 100}%`, background: COLORS[i] }} /></i></div>)}</div></Panel><Panel title="Suggested team distribution"><div className="simple-distribution">{countBy(tickets, t => t.expected_team).slice(0, 6).map(([name, value], i) => <div key={name}><span><em>{pretty(name)}</em><strong>{value}</strong></span><i><b style={{ width: `${value / 150 * 100}%`, background: COLORS[i] }} /></i></div>)}</div></Panel></div>
    <div className="two-panels"><Panel title="Taxonomy browser" subtitle="Explore the labeling system" action={<select className="compact-select" value={taxonomy} onChange={e => setTaxonomy(e.target.value)}><option>Primary topics</option><option>Secondary tags</option><option>Product areas</option></select>}><div className="taxonomy-grid">{(taxonomy === 'Primary topics' ? PRIMARY_TOPICS : taxonomy === 'Secondary tags' ? SECONDARY_TAGS : PRODUCT_AREAS).map((item, i) => <div key={item}><span>{pretty(item)}</span><strong>{taxonomy === 'Primary topics' ? tickets.filter(t => t.primary_topic === item).length : taxonomy === 'Secondary tags' ? tickets.filter(t => t.secondary_tags.includes(item)).length : tickets.filter(t => t.product_area === item).length}</strong></div>)}</div></Panel><Panel title="Dataset structure" subtitle="Fields included in every ticket"><div className="schema-list">{[['Ticket content', 'ticket_id, subject, description, created_at, channel'], ['Customer context', 'customer_plan, workspace_size'], ['Ground truth', 'primary_topic, secondary_tags, product_area, intent, sentiment'], ['Operations', 'urgency, impact, expected_priority, expected_sla_risk, expected_team'], ['Pattern signals', 'duplicate_cluster_id, feature_request_flag, escalation_flag'], ['AI output', 'classification, confidence, explanation, drafts, review_status']].map(([title, fields]) => <div key={title}><strong>{title}</strong><code>{fields}</code></div>)}</div></Panel></div>
    <Panel title="Sample tickets" subtitle="First five records in the current dataset"><div className="sample-table"><div><strong>Ticket ID</strong><strong>Subject</strong><strong>Primary topic</strong><strong>Tags</strong><strong>Priority</strong><strong>SLA risk</strong></div>{tickets.slice(0, 5).map(t => <div key={t.ticket_id}><span>{t.ticket_id}</span><span>{t.subject}</span><Badge>{pretty(t.primary_topic)}</Badge><span>{t.secondary_tags.map(pretty).join(', ')}</span><PriorityBadge priority={t.expected_priority} /><RiskBadge risk={t.expected_sla_risk} /></div>)}</div></Panel>
  </>
}
