import {
  Activity,
  Bot,
  Database,
  RotateCcw,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import {
  Badge,
  PageTitle, Panel
} from '../components/primitives'

export function SettingsPage({ reset, reviewThreshold, onReviewThresholdChange }: { reset: () => void; reviewThreshold: number; onReviewThresholdChange: (value: number) => void }) {
  const threshold = Math.round(reviewThreshold * 100)
  return <>
    <PageTitle eyebrow="Workspace configuration" title="Settings" description="Manage analysis behavior, review thresholds, and workspace data." />
    <div className="settings-layout"><div><Panel title="AI configuration" subtitle="Analysis service settings"><div className="settings-list"><div><span><Bot size={18} /><span><strong>AI provider</strong><small>Analysis engine used for ticket classification</small></span></span><Badge tone="purple">Opsqora AI</Badge></div><div><span><Sparkles size={18} /><span><strong>Model</strong><small>Active model for ticket analysis</small></span></span><strong>Analysis Model v1</strong></div><div><span><Activity size={18} /><span><strong>Operating mode</strong><small>Every ticket is analyzed; flagged outcomes require a person</small></span></span><Badge tone="green">Automatic analysis</Badge></div></div></Panel><Panel title="Analysis preferences" subtitle="Controls for human-review routing"><div className="settings-control"><label htmlFor="confidence-threshold"><span><strong>Confidence review threshold</strong><small>Cases below this score enter Human Review</small></span><b>{threshold}%</b></label><input id="confidence-threshold" aria-label="Confidence review threshold" type="range" min="50" max="90" value={threshold} onChange={e => onReviewThresholdChange(Number(e.target.value) / 100)} /><div><span>50%</span><span>90%</span></div></div><div className="toggle-setting disabled"><span><strong>Automatic ticket analysis</strong><small>Always on: every incoming ticket receives an AI recommendation</small></span><label aria-label="Automatic ticket analysis is enabled"><input type="checkbox" checked disabled readOnly /><i /></label></div><div className="toggle-setting disabled"><span><strong>Show low-confidence warnings</strong><small>Always on: warnings follow the shared review threshold</small></span><label aria-label="Show low-confidence warnings is enabled"><input type="checkbox" checked disabled readOnly /><i /></label></div></Panel></div><aside><Panel title="Data source" subtitle="Current workspace dataset"><div className="source-card"><Database size={24} /><strong>Local ticket dataset</strong><span>500 support tickets</span><span>Structured analysis fields</span><span>Available in this workspace</span></div></Panel><Panel title="Reset workspace data" subtitle="Restore the original workspace state"><p className="settings-copy">This clears review changes, added tickets, notes, and local status updates.</p><button className="btn btn-danger wide-btn" onClick={reset}><RotateCcw size={15} /> Reset workspace data</button></Panel><div className="demo-safety"><ShieldCheck size={18} /><div><strong>Human control is enforced</strong><span>AI analyzes every ticket, while customer-impacting actions require explicit approval.</span></div></div></aside></div>
  </>
}
