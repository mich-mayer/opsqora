import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Wordmark } from './components/primitives'
import {
  feedbackPatterns,
  getInitialEvidenceDecisions,
  getInitialPatternVerdicts,
  getReadiness,
} from './mock'
import { DesignNotes } from './screens/DesignNotes'
import { EvalDashboard } from './screens/EvalDashboard'
import { PatternFeed } from './screens/PatternFeed'
import { PatternReview } from './screens/PatternReview'
import { ProductBriefScreen } from './screens/ProductBriefScreen'
import type { ConceptBPage, EvidenceDecision, PatternVerdict } from './types'

const BASE = import.meta.env.BASE_URL

const navItems: { id: ConceptBPage; label: string }[] = [
  { id: 'patterns', label: 'Pattern Feed' },
  { id: 'review-pattern', label: 'Pattern Review' },
  { id: 'brief', label: 'Product Brief' },
  { id: 'eval', label: 'AI Eval' },
  { id: 'notes', label: 'Design Notes' },
]

export default function App({
  embedded = false,
  initialPage = 'patterns',
}: {
  embedded?: boolean
  initialPage?: ConceptBPage
} = {}) {
  const patterns = useMemo(() => feedbackPatterns, [])
  const [page, setPage] = useState<ConceptBPage>(initialPage)
  const [selectedPatternId, setSelectedPatternId] = useState('PAT-001')
  const [decisions, setDecisions] = useState<Record<string, Record<string, EvidenceDecision>>>(() => getInitialEvidenceDecisions())
  const [verdicts, setVerdicts] = useState<Record<string, PatternVerdict>>(() => getInitialPatternVerdicts())
  const [generatedBriefs, setGeneratedBriefs] = useState<Record<string, boolean>>({ 'PAT-001': true })
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const selectedPattern = patterns.find(pattern => pattern.id === selectedPatternId) ?? patterns[0]
  const selectedDecisions = decisions[selectedPattern.id]
  const selectedVerdict = verdicts[selectedPattern.id]

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const navigate = (target: ConceptBPage) => {
    setPage(target)
    mainRef.current?.scrollTo({ top: 0, behavior: embedded ? 'auto' : 'smooth' })
  }

  const openPattern = (id: string) => {
    setSelectedPatternId(id)
    navigate('review-pattern')
  }

  const openBrief = (id = selectedPattern.id) => {
    setSelectedPatternId(id)
    navigate('brief')
  }

  const updateEvidenceDecision = (evidenceId: string, decision: EvidenceDecision) => {
    setDecisions(current => ({
      ...current,
      [selectedPattern.id]: {
        ...current[selectedPattern.id],
        [evidenceId]: decision,
      },
    }))
  }

  const updateVerdict = (nextVerdict: PatternVerdict) => {
    setVerdicts(current => ({ ...current, [selectedPattern.id]: nextVerdict }))
  }

  const generateBrief = () => {
    const latestReadiness = getReadiness(selectedPattern, decisions[selectedPattern.id], verdicts[selectedPattern.id])
    if (!latestReadiness.ready) {
      showToast('Readiness rule is not met yet')
      return
    }
    setGeneratedBriefs(current => ({ ...current, [selectedPattern.id]: true }))
    navigate('brief')
    showToast('Product brief generated from validated evidence')
  }

  return <div className={embedded ? 'shell shell--embedded' : 'shell'}>
    <header className="topbar">
      <Wordmark href={embedded ? undefined : BASE} />
      <nav className="topnav" aria-label="Primary navigation">
        {navItems.map((item, index) => <button
          key={item.id}
          aria-current={page === item.id ? 'page' : undefined}
          className={page === item.id ? 'is-active' : ''}
          onClick={() => navigate(item.id)}
        >
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          {item.label}
          {item.id === 'patterns' && <em aria-hidden="true">{patterns.length}</em>}
        </button>)}
      </nav>
      <div className="topbar-side">
        {embedded
          ? <a className="topbar-link" href={BASE} target="_blank" rel="noreferrer">Full app <ArrowUpRight size={13} /></a>
          : <a className="topbar-link" href={`${BASE}case-study.html`}>Case study <ArrowUpRight size={13} /></a>}
        <div className="topbar-user" aria-label="Mock reviewer">
          <span className="topbar-avatar" aria-hidden="true">MR</span>
          <span className="topbar-user-meta"><strong>Maya Rodriguez</strong><em>Product lead</em></span>
        </div>
      </div>
    </header>

    <div className="shell-main" ref={mainRef}>
      <main className="screen">
        {page === 'patterns' && <PatternFeed
          patterns={patterns}
          selectedPatternId={selectedPattern.id}
          decisions={decisions}
          verdicts={verdicts}
          search={search}
          onSearch={setSearch}
          onOpenPattern={openPattern}
          onOpenBrief={openBrief}
        />}
        {page === 'review-pattern' && <PatternReview
          patterns={patterns}
          pattern={selectedPattern}
          decisions={selectedDecisions}
          verdict={selectedVerdict}
          generated={Boolean(generatedBriefs[selectedPattern.id])}
          onSelectPattern={setSelectedPatternId}
          onDecisionChange={updateEvidenceDecision}
          onVerdictChange={updateVerdict}
          onGenerateBrief={generateBrief}
          onOpenBrief={() => openBrief()}
        />}
        {page === 'brief' && <ProductBriefScreen
          pattern={selectedPattern}
          decisions={selectedDecisions}
          verdict={selectedVerdict}
          generated={Boolean(generatedBriefs[selectedPattern.id])}
          onGenerateBrief={generateBrief}
          onReviewPattern={() => navigate('review-pattern')}
        />}
        {page === 'eval' && <EvalDashboard />}
        {page === 'notes' && <DesignNotes />}
      </main>
      <footer className="shell-foot">
        <span>Frontend-only prototype — synthetic data, no real AI calls</span>
        <a href={embedded ? BASE : `${BASE}case-study.html`} target={embedded ? '_blank' : undefined} rel={embedded ? 'noreferrer' : undefined}>
          {embedded ? 'Open the full app' : 'Read the case study'} <ArrowUpRight size={12} />
        </a>
      </footer>
    </div>

    {toast && <div className="toast" role="status" aria-live="polite"><CheckCircle2 size={16} />{toast}</div>}
  </div>
}
