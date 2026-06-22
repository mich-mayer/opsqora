import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileText,
  Layers3,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useMemo, useRef, useState, type FormEvent } from 'react'
import { DesignNotes } from './screens/DesignNotes'
import { EvalDashboard } from './screens/EvalDashboard'
import { PatternFeed } from './screens/PatternFeed'
import { PatternReview } from './screens/PatternReview'
import { ProductBriefScreen } from './screens/ProductBriefScreen'
import {
  MOCK_LABEL,
  feedbackPatterns,
  getInitialEvidenceDecisions,
  getInitialPatternVerdicts,
  getReadiness,
} from './mock'
import type { ConceptBPage, EvidenceDecision, PatternVerdict } from './types'

const navItems: { id: ConceptBPage; label: string; icon: LucideIcon }[] = [
  { id: 'patterns', label: 'Pattern Feed', icon: Layers3 },
  { id: 'review-pattern', label: 'Pattern Review', icon: ClipboardCheck },
  { id: 'brief', label: 'Product Brief', icon: FileText },
  { id: 'eval', label: 'AI Eval', icon: ShieldCheck },
  { id: 'notes', label: 'Design Notes', icon: Settings2 },
]

export default function App() {
  const patterns = useMemo(() => feedbackPatterns, [])
  const [page, setPage] = useState<ConceptBPage>('patterns')
  const [selectedPatternId, setSelectedPatternId] = useState('PAT-001')
  const [decisions, setDecisions] = useState<Record<string, Record<string, EvidenceDecision>>>(() => getInitialEvidenceDecisions())
  const [verdicts, setVerdicts] = useState<Record<string, PatternVerdict>>(() => getInitialPatternVerdicts())
  const [generatedBriefs, setGeneratedBriefs] = useState<Record<string, boolean>>({ 'PAT-001': true })
  const [globalSearch, setGlobalSearch] = useState('')
  const [reviewCadence, setReviewCadence] = useState('Pre-sprint')
  const [toast, setToast] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const selectedPattern = patterns.find(pattern => pattern.id === selectedPatternId) ?? patterns[0]
  const selectedDecisions = decisions[selectedPattern.id]
  const selectedVerdict = verdicts[selectedPattern.id]
  const readiness = getReadiness(selectedPattern, selectedDecisions, selectedVerdict)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const navigate = (target: ConceptBPage) => {
    setPage(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const searchSubmit = (event: FormEvent) => {
    event.preventDefault()
    navigate('patterns')
    searchRef.current?.blur()
  }

  return <div className="app-shell concept-app">
    <aside className="sidebar concept-sidebar">
      <div className="brand" aria-label="Opsqora">
        <img className="brand-mark brand-wordmark" src="logo_text.png" alt="Opsqora" />
        <img className="brand-mark brand-iconmark" src="opsqora-mark.png" alt="" aria-hidden="true" />
      </div>
      <nav aria-label="Primary navigation">
        {navItems.map(item => <button
          key={item.id}
          aria-current={page === item.id ? 'page' : undefined}
          className={page === item.id ? 'active' : ''}
          onClick={() => navigate(item.id)}
        >
          <item.icon size={17} />
          <span>{item.label}</span>
          {item.id === 'patterns' && <em aria-hidden="true">{patterns.length}</em>}
        </button>)}
      </nav>
      <div className="sidebar-context">
        <Sparkles size={15} />
        <span>Recurring feedback patterns, not ticket operations.</span>
      </div>
      <a className="case-study-link" href="/opsqora/case-study.html"><ExternalLink size={13} /> Case study</a>
      <div className="data-label"><Database size={13} /> Synthetic pattern data</div>
      <div className="sidebar-user"><div className="avatar user-avatar">PM</div><div><strong>Maya Rodriguez</strong><span>Product lead</span></div></div>
    </aside>

    <div className="main-shell">
      <header className="topbar concept-topbar">
        <form className="global-search" onSubmit={searchSubmit}>
          <Search size={16} />
          <input
            ref={searchRef}
            aria-label="Search patterns"
            value={globalSearch}
            onChange={event => setGlobalSearch(event.target.value)}
            placeholder="Search recurring patterns…"
          />
          <kbd>⌘ K</kbd>
        </form>
        <div className="cadence-control">
          <span>Review cadence</span>
          <select value={reviewCadence} onChange={event => setReviewCadence(event.target.value)} aria-label="Optional review cadence">
            <option>Weekly</option>
            <option>Biweekly</option>
            <option>Pre-sprint</option>
            <option>Ad hoc</option>
          </select>
        </div>
        <div className="top-actions">
          <div className="mock-status"><ShieldCheck size={15} />{MOCK_LABEL}</div>
          <button className="icon-btn" aria-label="Mock notifications" title="Mock notifications"><Bell size={17} /></button>
        </div>
      </header>

      <main className="content concept-content">
        {page === 'patterns' && <PatternFeed
          patterns={patterns}
          selectedPatternId={selectedPattern.id}
          decisions={decisions}
          verdicts={verdicts}
          search={globalSearch}
          onSearch={setGlobalSearch}
          onOpenPattern={openPattern}
          onOpenBrief={openBrief}
        />}
        {page === 'review-pattern' && <PatternReview
          pattern={selectedPattern}
          decisions={selectedDecisions}
          verdict={selectedVerdict}
          generated={Boolean(generatedBriefs[selectedPattern.id])}
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
    </div>

    {toast && <div className="toast" role="status" aria-live="polite"><CheckCircle2 size={17} />{toast}</div>}
  </div>
}
