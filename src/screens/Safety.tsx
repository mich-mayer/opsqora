import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Bot,
  Check,
  Database,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Users, X
} from 'lucide-react'
import {
  Badge,
  PageTitle, Panel
} from '../components/primitives'

export function Safety() {
  const principles: [LucideIcon, string, string][] = [
    [ShieldCheck, 'Controlled environment', 'Opsqora keeps analysis and review workflows observable, bounded, and auditable.'],
    [Database, 'Data transparency', 'The active data source is identified consistently across the workspace.'],
    [Users, 'Human-in-the-loop review', 'AI recommendations remain editable and require a human decision before operational use.'],
    [LockKeyhole, 'No automatic messaging', 'Customer reply suggestions remain drafts until a reviewer explicitly approves them.'],
    [Bot, 'Decision support, not autonomy', 'AI helps organize evidence and recommend next steps; it does not resolve tickets.'],
    [Activity, 'Visible quality measurement', 'Accuracy, recall, human edits, confidence, and failure modes are surfaced for governance.'],
  ]
  return <>
    <PageTitle eyebrow="Responsible AI" title="Safety & About" description="Clear boundaries for a human-centered support decision tool." />
    <div className="notice-bar"><FileText size={16} /><strong>What's real vs mocked</strong><span>The workflow, filters, review controls, and charts run in the browser on deterministic synthetic data; AI analysis is mocked and no production model or customer system is connected.</span></div>
    <div className="safety-hero"><div><Badge tone="green"><ShieldCheck size={12} /> Human-controlled AI</Badge><h2>AI assistance with clear human control.</h2><p>Opsqora helps support and product teams classify demand, spot repeated pain points, and prioritize review while keeping customer-impacting decisions with people.</p></div><div className="safety-orbit"><ShieldCheck size={42} /><span /><span /><span /></div></div>
    <div className="principles-grid">{principles.map(([Icon, title, copy]) => <div key={String(title)}><span><Icon size={20} /></span><h3>{String(title)}</h3><p>{String(copy)}</p></div>)}</div>
    <div className="two-panels"><Panel title="Intended use" subtitle="Supported operational workflows"><div className="boundary-list good-list">{['Internal support decision support', 'AI-assisted multi-label ticket classification', 'Human review and correction workflows', 'Duplicate pattern discovery', 'Product insights from support demand', 'AI quality monitoring and evaluation'].map(x => <div key={x}><Check size={15} />{x}</div>)}</div></Panel><Panel title="Non-goals" subtitle="Explicit operational boundaries"><div className="boundary-list bad-list">{['No autonomous ticket resolution', 'No automatic customer replies', 'No unreviewed escalations', 'No hidden classification changes', 'No untracked routing decisions', 'No customer-impacting actions without approval'].map(x => <div key={x}><X size={15} />{x}</div>)}</div></Panel></div>
    <Panel title="Known limitations" subtitle="Current operational constraints"><div className="limitations"><div><strong>Model confidence varies</strong><p>Low-confidence cases require review before routing or prioritization decisions are accepted.</p></div><div><strong>Session-based state</strong><p>Review changes persist for the current browser session and can be restored from settings.</p></div><div><strong>Evaluation context</strong><p>Quality metrics should be interpreted alongside review volume, thresholds, and error categories.</p></div><div><strong>Integration coverage</strong><p>External ticketing, identity, messaging, and incident workflows require configured connectors.</p></div></div></Panel>
  </>
}
