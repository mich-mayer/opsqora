import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Layers3,
  Search,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Badge, PageTitle, Panel, StatCard } from '../components/primitives'
import { MOCK_LABEL, getReadiness } from '../mock'
import type { EvidenceDecision, FeedbackPattern, PatternVerdict } from '../types'

const percent = (value: number) => `${Math.round(value * 100)}%`

function TrendLabel({ trend }: { trend: FeedbackPattern['trend'] }) {
  if (trend === 'up') return <span className="pattern-trend trend-up"><TrendingUp size={13} /> Up</span>
  if (trend === 'down') return <span className="pattern-trend trend-down"><TrendingDown size={13} /> Down</span>
  return <span className="pattern-trend">Flat</span>
}

export function PatternFeed({
  patterns,
  selectedPatternId,
  decisions,
  verdicts,
  search,
  onSearch,
  onOpenPattern,
  onOpenBrief,
}: {
  patterns: FeedbackPattern[]
  selectedPatternId: string
  decisions: Record<string, Record<string, EvidenceDecision>>
  verdicts: Record<string, PatternVerdict>
  search: string
  onSearch: (value: string) => void
  onOpenPattern: (id: string) => void
  onOpenBrief: (id: string) => void
}) {
  const filteredPatterns = patterns.filter(pattern => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return [
      pattern.short_name,
      pattern.summary,
      pattern.product_area,
      pattern.ai_summary,
    ].some(value => value.toLowerCase().includes(query))
  })
  const selectedPattern = patterns.find(pattern => pattern.id === selectedPatternId) ?? patterns[0]
  const readyCount = patterns.filter(pattern => getReadiness(pattern, decisions[pattern.id], verdicts[pattern.id]).ready).length
  const reviewedEvidence = patterns.reduce((sum, pattern) => sum + pattern.evidence.filter(evidence => decisions[pattern.id][evidence.id] !== 'Unsure').length, 0)
  const selectedReadiness = getReadiness(selectedPattern, decisions[selectedPattern.id], verdicts[selectedPattern.id])

  return <>
    <PageTitle
      eyebrow="Support feedback pattern validation"
      title="Pattern Feed"
      description="Find recurring complaints, verify the evidence, turn confirmed patterns into product decisions."
      action={<Badge tone="green" dot>{MOCK_LABEL}</Badge>}
    />
    <div className="positioning-banner">
      <Layers3 size={17} />
      <span>Opsqora complements the helpdesk; it does not process tickets, route agents, or draft customer replies. Support items appear only as evidence for recurring feedback patterns.</span>
    </div>

    <div className="stats-grid four pattern-stat-grid">
      <StatCard label="Suggested patterns" value={patterns.length} delta="AI-suggested" icon={Layers3} tone="purple" />
      <StatCard label="Ready for PM decision" value={readyCount} delta="Rules met" icon={CheckCircle2} tone="green" />
      <StatCard label="Evidence snippets reviewed" value={reviewedEvidence} delta="Human validation" icon={ClipboardList} tone="blue" />
      <StatCard label="Cost per validated pattern" value="$8.90" delta="Mocked value metric" icon={Gauge} tone="amber" />
    </div>

    <div className="pattern-feed-layout">
      <Panel
        title="AI-suggested recurring patterns"
        subtitle="Ranked by confidence, mention count, and reviewer readiness"
        action={<label className="pattern-search"><Search size={14} /><input value={search} onChange={event => onSearch(event.target.value)} placeholder="Search patterns" /></label>}
        className="pattern-feed-panel"
      >
        <div className="pattern-card-list">
          {filteredPatterns.map(pattern => {
            const readiness = getReadiness(pattern, decisions[pattern.id], verdicts[pattern.id])
            return <button
              key={pattern.id}
              className={`pattern-card ${pattern.id === selectedPatternId ? 'active' : ''}`}
              onClick={() => onOpenPattern(pattern.id)}
            >
              <span className="pattern-card-topline"><strong>{pattern.id}</strong><Badge tone={readiness.ready ? 'green' : 'amber'}>{readiness.ready ? 'Ready' : 'Needs validation'}</Badge></span>
              <h3>{pattern.short_name}</h3>
              <p>{pattern.summary}</p>
              <span className="pattern-meta-row">
                <span>{pattern.mention_count} mentions</span>
                <TrendLabel trend={pattern.trend} />
                <span>{pattern.product_area}</span>
                <span>{percent(pattern.confidence)} confidence</span>
              </span>
            </button>
          })}
        </div>
      </Panel>

      <Panel title="Featured pattern" subtitle="One complete validation story to follow end to end" className="featured-pattern-panel">
        <div className="featured-pattern">
          <div className="featured-pattern-heading">
            <Badge tone="purple">{selectedPattern.id}</Badge>
            <Badge tone={selectedReadiness.ready ? 'green' : 'amber'}>{selectedReadiness.ready ? 'Ready for PM decision' : 'Review required'}</Badge>
          </div>
          <h2>{selectedPattern.summary}</h2>
          <p>{selectedPattern.ai_summary}</p>
          <div className="featured-rules">
            <span><strong>{selectedPattern.mention_count}</strong> mentions</span>
            <span><strong>{selectedReadiness.belongsCount}/{selectedReadiness.totalEvidence}</strong> belongs</span>
            <span><strong>{percent(selectedPattern.confidence)}</strong> confidence</span>
            <span><strong>{verdicts[selectedPattern.id]}</strong> verdict</span>
          </div>
          <div className="why-suggested">
            <h3>Why the mock AI suggested it</h3>
            {selectedPattern.why_suggested.map(reason => <div key={reason}><CheckCircle2 size={14} />{reason}</div>)}
          </div>
          <div className="featured-actions">
            <button className="btn btn-primary" onClick={() => onOpenPattern(selectedPattern.id)}>Validate evidence <ArrowRight size={15} /></button>
            <button className="btn btn-secondary" onClick={() => onOpenBrief(selectedPattern.id)}>View product brief</button>
          </div>
        </div>
      </Panel>
    </div>
  </>
}
