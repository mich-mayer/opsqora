import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  MoveRight,
  Search,
} from 'lucide-react'
import { Chip, EmptyState, ScreenHead, Stat } from '../components/primitives'
import { MOCK_LABEL, getReadiness } from '../mock'
import type { EvidenceDecision, FeedbackPattern, PatternVerdict } from '../types'

const percent = (value: number) => `${Math.round(value * 100)}%`

function TrendMark({ trend }: { trend: FeedbackPattern['trend'] }) {
  if (trend === 'up') return <span className="trend trend--up"><ArrowUpRight size={13} strokeWidth={2.5} /> Up</span>
  if (trend === 'down') return <span className="trend trend--down"><ArrowDownRight size={13} strokeWidth={2.5} /> Down</span>
  return <span className="trend"><MoveRight size={13} strokeWidth={2.5} /> Flat</span>
}

function ConfidenceMeter({ value }: { value: number }) {
  return <span className="meter-cell">
    <span className="meter" aria-hidden="true">
      <i style={{ width: percent(value) }} />
      <b className="meter-tick" />
    </span>
    {percent(value)}
  </span>
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
    return [pattern.short_name, pattern.summary, pattern.product_area, pattern.ai_summary]
      .some(value => value.toLowerCase().includes(query))
  })
  const selectedPattern = patterns.find(pattern => pattern.id === selectedPatternId) ?? patterns[0]
  const selectedReadiness = getReadiness(selectedPattern, decisions[selectedPattern.id], verdicts[selectedPattern.id])
  const readyCount = patterns.filter(pattern => getReadiness(pattern, decisions[pattern.id], verdicts[pattern.id]).ready).length
  const reviewedEvidence = patterns.reduce(
    (sum, pattern) => sum + pattern.evidence.filter(evidence => decisions[pattern.id][evidence.id] !== 'Unsure').length,
    0,
  )

  return <>
    <ScreenHead
      index="01"
      kicker="Support feedback pattern validation"
      title="Pattern Feed"
      lede="Find recurring complaints, verify the evidence, turn confirmed patterns into product decisions."
      aside={<Chip tone="line" square>{MOCK_LABEL}</Chip>}
    />

    <div className="stat-band">
      <Stat label="Suggested patterns" value={patterns.length} note="AI-suggested" />
      <Stat label="Ready for PM decision" value={readyCount} note="Rules met" />
      <Stat label="Evidence reviewed" value={reviewedEvidence} note="Human validation" />
      <Stat label="Cost per validated pattern" value="$8.90" note="Mocked value metric" />
    </div>

    <div className="feed-toolbar">
      <p>Feedback items appear only as evidence for recurring patterns — never as a raw inbox.</p>
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
            <th scope="col">ID</th>
            <th scope="col">Recurring pattern</th>
            <th scope="col" className="col-area">Area</th>
            <th scope="col" className="col-num">Mentions</th>
            <th scope="col" className="col-trend">Trend</th>
            <th scope="col" className="col-conf">Confidence</th>
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
              <td className="cell-id">{pattern.id}</td>
              <td className="cell-name"><strong>{pattern.short_name}</strong><span>{pattern.summary}</span></td>
              <td className="col-area">{pattern.product_area}</td>
              <td className="col-num cell-num">{pattern.mention_count}</td>
              <td className="col-trend"><TrendMark trend={pattern.trend} /></td>
              <td className="col-conf"><ConfidenceMeter value={pattern.confidence} /></td>
              <td><Chip tone={readiness.ready ? 'ok' : 'warn'} square>{readiness.ready ? 'Ready' : 'Needs validation'}</Chip></td>
              <td className="cell-arrow"><ArrowRight size={15} aria-hidden="true" /></td>
            </tr>
          })}
        </tbody>
      </table>}

    <section className="feed-featured" aria-label="Featured pattern">
      <div className="feed-featured-copy">
        <p className="kicker"><span>Featured</span>One validation path, end to end</p>
        <h2>{selectedPattern.summary}</h2>
        <p className="feed-featured-summary">{selectedPattern.ai_summary}</p>
        <div className="feed-featured-why">
          <h3>Why the mock AI suggested it</h3>
          <ul>
            {selectedPattern.why_suggested.map(reason => <li key={reason}>{reason}</li>)}
          </ul>
        </div>
      </div>
      <div className="feed-featured-facts">
        <dl>
          <div><dt>Pattern</dt><dd>{selectedPattern.id}</dd></div>
          <div><dt>Mentions</dt><dd>{selectedPattern.mention_count}</dd></div>
          <div><dt>Evidence belongs</dt><dd>{selectedReadiness.belongsCount}/{selectedReadiness.totalEvidence}</dd></div>
          <div><dt>Confidence</dt><dd>{percent(selectedPattern.confidence)}</dd></div>
          <div><dt>Verdict</dt><dd>{verdicts[selectedPattern.id]}</dd></div>
          <div><dt>Status</dt><dd><Chip tone={selectedReadiness.ready ? 'ok' : 'warn'} square>{selectedReadiness.ready ? 'Ready for PM decision' : 'Review required'}</Chip></dd></div>
        </dl>
        <div className="feed-featured-actions">
          <button className="btn btn--primary" onClick={() => onOpenPattern(selectedPattern.id)}>
            Validate evidence <ArrowRight size={14} />
          </button>
          <button className="btn btn--ghost" onClick={() => onOpenBrief(selectedPattern.id)}>
            {selectedReadiness.ready ? 'View product brief' : 'Check brief readiness'}
          </button>
        </div>
      </div>
    </section>
  </>
}
