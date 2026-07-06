import {
  ArrowRight,
  Search,
} from 'lucide-react'
import { Chip, EmptyState, ScreenHead } from '../components/primitives'
import { getReadiness } from '../mock'
import type { EvidenceDecision, FeedbackPattern, PatternVerdict } from '../types'

const percent = (value: number) => `${Math.round(value * 100)}%`

export function PatternFeed({
  patterns,
  selectedPatternId,
  decisions,
  verdicts,
  search,
  onSearch,
  onOpenPattern,
}: {
  patterns: FeedbackPattern[]
  selectedPatternId: string
  decisions: Record<string, Record<string, EvidenceDecision>>
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
  const readyCount = patterns.filter(pattern => getReadiness(pattern, decisions[pattern.id], verdicts[pattern.id]).ready).length
  const reviewedEvidence = patterns.reduce(
    (sum, pattern) => sum + pattern.evidence.filter(evidence => decisions[pattern.id][evidence.id] !== 'Unsure').length,
    0,
  )

  return <>
    <ScreenHead
      index="01"
      kicker="Support feedback validation"
      title="Patterns"
      lede="Pick a recurring complaint and validate the evidence behind it."
    />

    <div className="feed-toolbar">
      <p><strong>{patterns.length} patterns</strong> · {readyCount} ready · {reviewedEvidence} snippets reviewed</p>
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
            <th scope="col" className="col-signal">Signal</th>
            <th scope="col">Status</th>
            <th scope="col" aria-label="Open" />
          </tr>
        </thead>
        <tbody>
          {filteredPatterns.map(pattern => {
            const readiness = getReadiness(pattern, decisions[pattern.id], verdicts[pattern.id])
            return <tr
              key={pattern.id}
              className={pattern.id === selectedPatternId ? 'is-selected' : ''}
              tabIndex={0}
              onClick={() => onOpenPattern(pattern.id)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenPattern(pattern.id)
                }
              }}
            >
              <td className="cell-name"><strong>{pattern.short_name}</strong><span>{pattern.summary}</span></td>
              <td className="col-area">{pattern.product_area}</td>
              <td className="col-signal cell-signal">{pattern.mention_count} mentions · {percent(pattern.confidence)}</td>
              <td><Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Needs validation'}</Chip></td>
              <td className="cell-arrow"><ArrowRight size={15} aria-hidden="true" /></td>
            </tr>
          })}
        </tbody>
      </table>}
  </>
}
