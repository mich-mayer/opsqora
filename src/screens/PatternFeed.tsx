import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Minus,
  Search,
} from 'lucide-react'
import { Chip, EmptyState, ScreenHead } from '../components/primitives'
import { READINESS_RULE, getReadiness } from '../mock'
import type { EvidenceConfirmations, EvidenceDecision, FeedbackPattern, PatternTrend, PatternVerdict } from '../types'

const percent = (value: number) => `${Math.round(value * 100)}%`

const trendLabel: Record<PatternTrend, string> = {
  up: 'Up',
  flat: 'Flat',
  down: 'Down',
}

function TrendIndicator({ trend }: { trend: PatternTrend }) {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus
  return <span className={`trend trend--${trend}`}>
    <Icon size={13} aria-hidden="true" />
    {trendLabel[trend]}
  </span>
}

function ConfidenceMeter({ value }: { value: number }) {
  const belowThreshold = value < READINESS_RULE.confidenceMinimum
  return <span className={belowThreshold ? 'meter-cell meter-cell--warn' : 'meter-cell'}>
    <span className="meter" aria-hidden="true">
      <i style={{ width: percent(value) }} />
      <span className="meter-tick" />
    </span>
    <span>{percent(value)}</span>
    {belowThreshold && <em>Below 70% rule</em>}
  </span>
}

export function PatternFeed({
  patterns,
  selectedPatternId,
  decisions,
  confirmations,
  verdicts,
  search,
  onSearch,
  onOpenPattern,
}: {
  patterns: FeedbackPattern[]
  selectedPatternId: string
  decisions: Record<string, Record<string, EvidenceDecision>>
  confirmations: Record<string, EvidenceConfirmations>
  verdicts: Record<string, PatternVerdict>
  search: string
  onSearch: (value: string) => void
  onOpenPattern: (id: string) => void
}) {
  const filteredPatterns = patterns.filter(pattern => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return [pattern.short_name, pattern.summary, pattern.product_area, pattern.ai_summary]
      .some(value => value.toLowerCase().includes(query))
  })
  const readyCount = patterns.filter(
    pattern => getReadiness(pattern, decisions[pattern.id], verdicts[pattern.id], confirmations[pattern.id]).ready,
  ).length
  const confirmedEvidence = patterns.reduce(
    (sum, pattern) => sum + pattern.evidence.filter(evidence => confirmations[pattern.id][evidence.id]).length,
    0,
  )
  const totalEvidence = patterns.reduce((sum, pattern) => sum + pattern.evidence.length, 0)

  return <>
    <ScreenHead
      index="01"
      kicker="Support feedback validation"
      title="Patterns"
      lede="Pick a recurring complaint and validate the evidence behind it."
    />

    <div className="feed-toolbar">
      <p><strong>{patterns.length} patterns</strong> · {readyCount} ready — evidence: {confirmedEvidence} confirmed · {totalEvidence - confirmedEvidence} AI-suggested</p>
      <label className="search-field">
        <Search size={14} />
        <input
          value={search}
          onChange={event => onSearch(event.target.value)}
          placeholder="Search patterns"
          aria-label="Search patterns"
        />
      </label>
    </div>

    {filteredPatterns.length === 0
      ? <EmptyState>No pattern matches “{search}”. Try a product area such as Planning or Automation.</EmptyState>
      : <table className="feed-table">
        <thead>
          <tr>
            <th scope="col">Pattern</th>
            <th scope="col" className="col-area">Area</th>
            <th scope="col" className="col-mentions">Mentions</th>
            <th scope="col" className="col-confidence">Confidence</th>
            <th scope="col" className="col-trend">Trend</th>
            <th scope="col">Status</th>
            <th scope="col" aria-label="Open" />
          </tr>
        </thead>
        <tbody>
          {filteredPatterns.map(pattern => {
            const readiness = getReadiness(pattern, decisions[pattern.id], verdicts[pattern.id], confirmations[pattern.id])
            return <tr
              key={pattern.id}
              className={pattern.id === selectedPatternId ? 'is-selected' : ''}
            >
              <td className="cell-name">
                <button className="pattern-open" onClick={() => onOpenPattern(pattern.id)}>
                  <strong>{pattern.short_name}</strong>
                  <span>{pattern.summary}</span>
                  <small>{pattern.mention_count} mentions · {percent(pattern.confidence)} confidence · {pattern.product_area}</small>
                </button>
              </td>
              <td className="col-area">{pattern.product_area}</td>
              <td className="col-mentions cell-num">{pattern.mention_count}</td>
              <td className="col-confidence"><ConfidenceMeter value={pattern.confidence} /></td>
              <td className="col-trend"><TrendIndicator trend={pattern.trend} /></td>
              <td><Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Needs validation'}</Chip></td>
              <td className="cell-arrow"><ArrowRight size={15} aria-hidden="true" /></td>
            </tr>
          })}
        </tbody>
      </table>}
  </>
}
