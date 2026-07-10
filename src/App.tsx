import { AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Wordmark } from './components/primitives'
import {
  feedbackPatterns,
  getInitialEvidenceConfirmations,
  getInitialEvidenceDecisions,
  getInitialPatternVerdicts,
  getReadiness,
} from './mock'
import { EvalDashboard } from './screens/EvalDashboard'
import { PatternFeed } from './screens/PatternFeed'
import { PatternReview } from './screens/PatternReview'
import { ProductBriefScreen } from './screens/ProductBriefScreen'
import type { ConceptBPage, EvidenceConfirmations, EvidenceDecision, PatternVerdict } from './types'

const BASE = import.meta.env.BASE_URL

const navItems: { id: ConceptBPage; label: string }[] = [
  { id: 'patterns', label: 'Patterns' },
  { id: 'review-pattern', label: 'Review' },
  { id: 'brief', label: 'Brief' },
  { id: 'eval', label: 'Eval' },
]

type HashState = {
  page: ConceptBPage
  patternId: string
}

type ToastState = {
  message: string
  tone: 'success' | 'warning'
}

function shouldReduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function parseHashState(patternIds: Set<string>): HashState | null {
  if (typeof window === 'undefined') return null

  const rawHash = window.location.hash.replace(/^#/, '')
  if (!rawHash) return null

  const [rawPage, rawPatternId] = rawHash.split('/')
  const patternId = rawPatternId && patternIds.has(rawPatternId) ? rawPatternId : 'PAT-001'

  if (rawPage === 'patterns') return { page: 'patterns', patternId }
  if (rawPage === 'review' || rawPage === 'review-pattern') return { page: 'review-pattern', patternId }
  if (rawPage === 'brief') return { page: 'brief', patternId }
  if (rawPage === 'eval') return { page: 'eval', patternId }

  return null
}

function hashForState(page: ConceptBPage, patternId: string) {
  if (page === 'patterns') return '#patterns'
  if (page === 'eval') return '#eval'
  if (page === 'review-pattern') return `#review/${patternId}`
  return `#brief/${patternId}`
}

function pushHashState(page: ConceptBPage, patternId: string) {
  if (typeof window === 'undefined') return

  const nextHash = hashForState(page, patternId)
  if (window.location.hash !== nextHash) window.history.pushState(null, '', nextHash)
}

export default function App({
  embedded = false,
  initialPage = 'patterns',
}: {
  embedded?: boolean
  initialPage?: ConceptBPage
} = {}) {
  const patterns = useMemo(() => feedbackPatterns, [])
  const patternIds = useMemo(() => new Set(patterns.map(pattern => pattern.id)), [patterns])
  const [initialHashState] = useState<HashState | null>(() => !embedded ? parseHashState(patternIds) : null)
  const [page, setPage] = useState<ConceptBPage>(initialHashState?.page ?? initialPage)
  const [selectedPatternId, setSelectedPatternId] = useState(initialHashState?.patternId ?? 'PAT-001')
  const [decisions, setDecisions] = useState<Record<string, Record<string, EvidenceDecision>>>(() => getInitialEvidenceDecisions())
  const [confirmations, setConfirmations] = useState<Record<string, EvidenceConfirmations>>(() => getInitialEvidenceConfirmations())
  const [verdicts, setVerdicts] = useState<Record<string, PatternVerdict>>(() => getInitialPatternVerdicts())
  const [generatedBriefs, setGeneratedBriefs] = useState<Record<string, boolean>>({ 'PAT-001': true })
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<ToastState | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const mainId = useId()
  const selectedPattern = patterns.find(pattern => pattern.id === selectedPatternId) ?? patterns[0]
  const selectedDecisions = decisions[selectedPattern.id]
  const selectedConfirmations = confirmations[selectedPattern.id]
  const selectedVerdict = verdicts[selectedPattern.id]
  const patternReadiness = useMemo(() => Object.fromEntries(
    patterns.map(pattern => [
      pattern.id,
      getReadiness(pattern, decisions[pattern.id], verdicts[pattern.id], confirmations[pattern.id]).ready,
    ]),
  ), [confirmations, decisions, patterns, verdicts])

  useEffect(() => {
    if (embedded) return undefined

    const applyHashState = () => {
      const nextHashState = parseHashState(patternIds)
      if (!nextHashState) return

      setPage(nextHashState.page)
      setSelectedPatternId(nextHashState.patternId)
      mainRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    }

    window.addEventListener('hashchange', applyHashState)
    window.addEventListener('popstate', applyHashState)
    return () => {
      window.removeEventListener('hashchange', applyHashState)
      window.removeEventListener('popstate', applyHashState)
    }
  }, [embedded, patternIds])

  useEffect(() => {
    const activeButton = navRef.current?.querySelector('.is-active')
    activeButton?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: shouldReduceMotion() ? 'auto' : 'smooth' })
  }, [page])

  const showToast = (message: string, tone: ToastState['tone'] = 'success') => {
    setToast({ message, tone })
    window.setTimeout(() => setToast(null), tone === 'warning' ? 4000 : 2600)
  }

  const navigate = (target: ConceptBPage, patternId = selectedPattern.id) => {
    setPage(target)
    if (!embedded) pushHashState(target, patternId)
    mainRef.current?.scrollTo({ top: 0, behavior: embedded || shouldReduceMotion() ? 'auto' : 'smooth' })
  }

  const openPattern = (id: string) => {
    setSelectedPatternId(id)
    navigate('review-pattern', id)
  }

  const openBrief = (id = selectedPattern.id) => {
    setSelectedPatternId(id)
    navigate('brief', id)
  }

  const selectPatternForReview = (id: string) => {
    setSelectedPatternId(id)
    if (!embedded && page === 'review-pattern') pushHashState('review-pattern', id)
  }

  const updateEvidenceDecision = (evidenceId: string, decision: EvidenceDecision) => {
    setDecisions(current => ({
      ...current,
      [selectedPattern.id]: {
        ...current[selectedPattern.id],
        [evidenceId]: decision,
      },
    }))
    setConfirmations(current => ({
      ...current,
      [selectedPattern.id]: {
        ...current[selectedPattern.id],
        [evidenceId]: true,
      },
    }))
  }

  const updateVerdict = (nextVerdict: PatternVerdict) => {
    setVerdicts(current => ({ ...current, [selectedPattern.id]: nextVerdict }))
  }

  const generateBrief = () => {
    const latestReadiness = getReadiness(
      selectedPattern,
      decisions[selectedPattern.id],
      verdicts[selectedPattern.id],
      confirmations[selectedPattern.id],
    )
    if (!latestReadiness.ready) {
      showToast('Readiness rule is not met yet', 'warning')
      return
    }
    setGeneratedBriefs(current => ({ ...current, [selectedPattern.id]: true }))
    navigate('brief')
    showToast('Product brief generated from validated evidence')
  }

  return <div className={embedded ? 'shell shell--embedded' : 'shell'}>
    <a className="skip-link" href={`#${mainId}`}>Skip to content</a>
    <header className="topbar">
      <Wordmark href={embedded ? undefined : BASE} />
      <nav className="topnav" ref={navRef} aria-label="Primary navigation">
        {navItems.map((item) => <button
          key={item.id}
          aria-current={page === item.id ? 'page' : undefined}
          className={page === item.id ? 'is-active' : ''}
          onClick={() => navigate(item.id)}
        >
          {item.label}
        </button>)}
      </nav>
      <div className="topbar-side">
        <span className="topbar-note">Synthetic data</span>
      </div>
    </header>

    <div className="shell-main" ref={mainRef}>
      <main className="screen" id={mainId}>
        {page === 'patterns' && <PatternFeed
          patterns={patterns}
          selectedPatternId={selectedPattern.id}
          decisions={decisions}
          confirmations={confirmations}
          verdicts={verdicts}
          search={search}
          onSearch={setSearch}
          onOpenPattern={openPattern}
        />}
        {page === 'review-pattern' && <PatternReview
          patterns={patterns}
          pattern={selectedPattern}
          patternReadiness={patternReadiness}
          decisions={selectedDecisions}
          confirmations={selectedConfirmations}
          verdict={selectedVerdict}
          generated={Boolean(generatedBriefs[selectedPattern.id])}
          onSelectPattern={selectPatternForReview}
          onDecisionChange={updateEvidenceDecision}
          onVerdictChange={updateVerdict}
          onGenerateBrief={generateBrief}
          onOpenBrief={() => openBrief()}
        />}
        {page === 'brief' && <ProductBriefScreen
          pattern={selectedPattern}
          decisions={selectedDecisions}
          confirmations={selectedConfirmations}
          verdict={selectedVerdict}
          generated={Boolean(generatedBriefs[selectedPattern.id])}
          onGenerateBrief={generateBrief}
          onReviewPattern={() => navigate('review-pattern')}
        />}
        {page === 'eval' && <EvalDashboard />}
      </main>
      <footer className="shell-foot">
        <span>Frontend-only prototype — synthetic data, no real AI calls</span>
        <a href={embedded ? BASE : `${BASE}case-study.html`} target={embedded ? '_blank' : undefined} rel={embedded ? 'noreferrer' : undefined}>
          {embedded ? 'Open the full app' : 'Read the case study'} <ArrowUpRight size={12} />
        </a>
      </footer>
    </div>

    {toast && <div className={`toast toast--${toast.tone}`} role={toast.tone === 'warning' ? 'alert' : 'status'} aria-live={toast.tone === 'warning' ? 'assertive' : 'polite'}>
      {toast.tone === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
      {toast.message}
    </div>}
  </div>
}
