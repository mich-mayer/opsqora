import {
  AlertTriangle, ArrowRight,
  Bot,
  Check, CheckCircle2,
  ChevronDown, ChevronLeft, ChevronRight,
  Clock3,
  Flag,
  Info,
  LockKeyhole,
  Plus,
  SlidersHorizontal, Sparkles,
  X, Zap
} from 'lucide-react'
import { useState } from 'react'
import {
  Badge,
  EmptyState, FieldSelect,
  Panel,
  PriorityBadge, RiskBadge,
  StatusBadge, TicketStatusBadge
} from '../components/primitives'
import {
  PRIMARY_TOPICS, PRODUCT_AREAS, SECONDARY_TAGS,
  SUPPORT_AGENTS, TEAMS
} from '../data'
import {
  humanReviewReasons, operationalNow,
  pretty,
  shortDate, slaInfo
} from '../lib'
import type { Priority, Risk, Ticket, TicketStatus } from '../types'

export function TicketReview({ ticket, update, goBack, openTicket, tickets, reviewThreshold }: { ticket: Ticket; update: (patch: Partial<Ticket>, aiPatch?: Partial<Ticket['ai']>) => void; goBack: () => void; openTicket: (id: string) => void; tickets: Ticket[]; reviewThreshold: number }) {
  const [newTag, setNewTag] = useState('')
  const [reason, setReason] = useState('wrong primary topic')
  const reviewReasons = humanReviewReasons(ticket, reviewThreshold)
  const reviewQueue = tickets.filter(item => humanReviewReasons(item, reviewThreshold).length > 0)
  const reviewIndex = reviewQueue.findIndex(item => item.ticket_id === ticket.ticket_id)
  const previousReview = reviewIndex > 0 ? reviewQueue[reviewIndex - 1] : null
  const nextReview = reviewIndex >= 0 && reviewIndex < reviewQueue.length - 1 ? reviewQueue[reviewIndex + 1] : null
  const related = tickets.filter(t => t.ticket_id !== ticket.ticket_id && t.ai.duplicate_cluster && t.ai.duplicate_cluster === ticket.ai.duplicate_cluster).slice(0, 4)
  const sla = slaInfo(ticket, operationalNow(tickets))
  const approve = () => update({ reviewed_at: new Date().toISOString(), human_review_requested: false }, { review_status: 'Approved' })
  const saveEdit = () => update({ reviewed_at: new Date().toISOString(), reviewer_note: ticket.reviewer_note || `Edit reason: ${reason}.` }, { review_status: 'Edited' })
  const addTag = () => { if (newTag && !ticket.ai.secondary_tags.includes(newTag)) update({}, { secondary_tags: [...ticket.ai.secondary_tags, newTag] }); setNewTag('') }
  return <>
    <div className="review-topline"><button className="back-link" onClick={goBack}><ChevronLeft size={16} /> Back to inbox</button><span>{reviewIndex >= 0 ? `Human review ${reviewIndex + 1} of ${reviewQueue.length}` : 'Not currently in the human review queue'}</span><div><button className="icon-btn" aria-label="Previous human review case" disabled={!previousReview} onClick={() => previousReview && openTicket(previousReview.ticket_id)}><ChevronLeft size={16} /></button><button className="icon-btn" aria-label="Next human review case" disabled={!nextReview} onClick={() => nextReview && openTicket(nextReview.ticket_id)}><ChevronRight size={16} /></button></div></div>
    <div className="review-heading"><div><div className="review-id-row"><span>{ticket.ticket_id}</span><TicketStatusBadge status={ticket.ticket_status} /><span className="review-label">AI review</span><StatusBadge status={ticket.ai.review_status} />{ticket.escalation_flag && <Badge tone="red"><Flag size={11} /> Escalation candidate</Badge>}</div><h1>{ticket.subject}</h1></div><div className="review-actions"><button className="btn btn-secondary" onClick={() => update({ human_review_requested: true }, { review_status: 'Needs review' })}><Info size={15} /> Keep in human review</button><button className="btn btn-outline-purple" onClick={saveEdit}><SlidersHorizontal size={15} /> Save corrections</button><button className="btn btn-success" onClick={approve}><CheckCircle2 size={16} /> Approve analysis</button></div></div>
    <div className={`review-reason-banner ${reviewReasons.length ? '' : 'resolved'}`} role="status"><span className="review-reason-icon"><AlertTriangle size={17} /></span><div><strong>{reviewReasons.length ? 'Why this ticket needs human review' : 'No active human-review triggers'}</strong><p>{reviewReasons.length ? reviewReasons.join(' · ') : 'The current AI analysis has no unresolved risk or confidence flags.'}</p></div>{reviewReasons.length > 0 && <Badge tone={reviewReasons.some(item => item.includes('SLA') || item.includes('impact')) ? 'red' : 'amber'}>{reviewReasons.length} {reviewReasons.length === 1 ? 'reason' : 'reasons'}</Badge>}</div>
    <div className="ticket-operations" aria-label="Ticket operations"><label><span>Ticket status</span><select value={ticket.ticket_status} onChange={event => update({ ticket_status: event.target.value as TicketStatus })}>{['New', 'Open', 'Pending', 'Solved'].map(status => <option key={status}>{status}</option>)}</select></label><label><span>Assignee</span><select value={ticket.assignee ?? ''} onChange={event => update({ assignee: event.target.value || null })}><option value="">Unassigned</option>{SUPPORT_AGENTS.map(agent => <option key={agent}>{agent}</option>)}</select></label><label><span>Support team</span><select value={ticket.support_team} onChange={event => update({ support_team: event.target.value })}>{TEAMS.map(team => <option key={team} value={team}>{pretty(team)}</option>)}</select></label><div className="operation-sla"><span>SLA commitment</span><strong className={`sla-pill sla-${sla.tone}`}><Clock3 size={13} />{sla.label}</strong><small>Due {shortDate(ticket.sla_due_at)}</small></div><div className="operation-source"><span>Source</span><strong>{ticket.source_system}</strong><small>{ticket.external_id} · {ticket.channel}</small></div></div>
    <div className="review-layout">
      <div className="review-left">
        <Panel title="Original ticket" subtitle={`${ticket.channel} · received ${shortDate(ticket.created_at)}`}>
          <div className="customer-message"><div className="avatar customer-avatar">AC</div><div><div className="message-meta"><strong>Alex Chen</strong><span>Operations Lead · Northstar Labs</span></div><p>{ticket.description}</p></div></div>
        </Panel>
        <Panel title="Customer context" subtitle="Account metadata"><div className="context-grid"><div><span>Customer plan</span><strong>{ticket.customer_plan}</strong></div><div><span>Workspace size</span><strong>{ticket.workspace_size.toLocaleString()} members</strong></div><div><span>Account health</span><strong className="health-good">Healthy · 82</strong></div><div><span>Open tickets</span><strong>{2 + ticket.workspace_size % 6} in 30 days</strong></div><div><span>Region</span><strong>North America</strong></div><div><span>Annual value</span><strong>${(ticket.workspace_size * 31).toLocaleString()}</strong></div></div></Panel>
        <Panel title="Related tickets" subtitle={ticket.ai.duplicate_cluster ? `Cluster ${ticket.ai.duplicate_cluster}` : 'No duplicate cluster detected'} action={ticket.ai.duplicate_cluster && <Badge tone="purple">{related.length + 1} similar</Badge>}>
          {related.length ? <div className="related-list">{related.map(item => <button key={item.ticket_id} onClick={() => openTicket(item.ticket_id)}><span><strong>{item.ticket_id}</strong><small>{item.subject}</small></span><PriorityBadge priority={item.ai.priority} /><span className="similarity">{88 + item.workspace_size % 10}% match</span><ArrowRight size={15} /></button>)}</div> : <EmptyState>No related tickets were found for this case.</EmptyState>}
          {ticket.ai.duplicate_cluster && <div className="incident-note"><AlertTriangle size={16} /><div><strong>Suggested incident note</strong><p>Multiple customers report similar behavior. Validate shared conditions before escalating as a potential incident.</p></div></div>}
        </Panel>
      </div>
      <div className="review-center">
        <Panel title="AI analysis" subtitle="Analysis Model v1 · generated in 1.4s" action={<div className={`confidence-pill ${ticket.ai.confidence < reviewThreshold ? 'low' : ''}`}><Sparkles size={14} />{Math.round(ticket.ai.confidence * 100)}% confidence</div>}>
          <div className="analysis-banner"><Bot size={18} /><span>AI recommendation — verify before operational use</span></div>
          <div className="analysis-grid"><div><span>Primary topic</span><strong>{pretty(ticket.ai.primary_topic)}</strong></div><div><span>Product area</span><strong>{pretty(ticket.ai.product_area)}</strong></div><div><span>Intent</span><strong>{pretty(ticket.ai.intent)}</strong></div><div><span>Sentiment</span><strong>{pretty(ticket.ai.sentiment)}</strong></div><div><span>Urgency</span><strong>{pretty(ticket.ai.urgency)}</strong></div><div><span>Impact</span><strong>{pretty(ticket.ai.impact)}</strong></div><div><span>Priority</span><PriorityBadge priority={ticket.ai.priority} /></div><div><span>SLA risk</span><RiskBadge risk={ticket.ai.sla_risk} /></div><div><span>Suggested team</span><strong>{pretty(ticket.ai.suggested_team)}</strong></div><div><span>Escalation team</span><strong>{pretty(ticket.ai.possible_escalation_team)}</strong></div></div>
          <div className="tag-section"><span>Secondary tags</span><div>{ticket.ai.secondary_tags.map(tag => <Badge key={tag} tone="purple">{pretty(tag)}</Badge>)}</div></div>
          {ticket.ai.related_product_areas.length > 0 && <div className="tag-section"><span>Related product areas</span><div>{ticket.ai.related_product_areas.map(area => <Badge key={area} tone="blue">{pretty(area)}</Badge>)}</div></div>}
          <div className="explanation"><h3><Sparkles size={16} /> Why AI classified it this way</h3><ul>{ticket.ai.explanation.map(point => <li key={point}>{point}</li>)}</ul></div>
        </Panel>
        <Panel title="Suggested next action" subtitle="Decision support only"><div className="next-action"><span><Zap size={17} /></span><p>{ticket.ai.suggested_next_action}</p></div></Panel>
        <Panel title="Suggested internal note" subtitle="Editable before adding to the case"><textarea aria-label="Suggested internal note" className="note-textarea" value={ticket.ai.suggested_internal_note} onChange={e => update({}, { suggested_internal_note: e.target.value })} /><div className="draft-footer"><Badge tone="blue">Internal only</Badge><button className="btn btn-small btn-secondary" onClick={() => update({ reviewer_note: ticket.ai.suggested_internal_note })}>Use as reviewer note</button></div></Panel>
        <Panel title="Suggested customer reply draft" subtitle="Generated from ticket context"><div className="draft-warning"><LockKeyhole size={15} /><strong>Draft only — never sent automatically</strong></div><textarea aria-label="Suggested customer reply draft" className="reply-textarea" value={ticket.ai.suggested_customer_reply_draft} onChange={e => update({}, { suggested_customer_reply_draft: e.target.value })} /><div className="draft-footer"><span className="muted">Sending requires a separate human-approved workflow.</span><button className="btn btn-small btn-secondary" disabled title="Customer messaging is outside this prototype">Sending unavailable</button></div></Panel>
      </div>
      <aside className="review-right">
        <Panel title="Human decision" subtitle="Review and correct the AI recommendation">
          <div className="review-status-card"><span>Current status</span><StatusBadge status={ticket.ai.review_status} />{ticket.reviewed_at && <small>Updated {shortDate(ticket.reviewed_at)}</small>}</div>
          <div className="review-form">
            <FieldSelect label="Primary topic" value={ticket.ai.primary_topic} values={PRIMARY_TOPICS} onChange={value => update({}, { primary_topic: value })} />
            <div className="review-field"><span>Secondary tags</span><div className="editable-tags">{ticket.ai.secondary_tags.map(tag => <span key={tag}>{pretty(tag)}<button aria-label={`Remove ${pretty(tag)} tag`} onClick={() => update({}, { secondary_tags: ticket.ai.secondary_tags.filter(x => x !== tag) })}><X size={11} /></button></span>)}</div><div className="add-tag"><select aria-label="Add secondary tag" value={newTag} onChange={e => setNewTag(e.target.value)}><option value="">Add a tag…</option>{SECONDARY_TAGS.filter(tag => !ticket.ai.secondary_tags.includes(tag)).map(tag => <option key={tag} value={tag}>{pretty(tag)}</option>)}</select><button aria-label="Add selected tag" onClick={addTag} disabled={!newTag}><Plus size={14} /></button></div></div>
            <FieldSelect label="Product area" value={ticket.ai.product_area} values={PRODUCT_AREAS} onChange={value => update({}, { product_area: value })} />
            <div className="field-pair"><FieldSelect label="Priority" value={ticket.ai.priority} values={['P1', 'P2', 'P3', 'P4']} onChange={value => update({}, { priority: value as Priority })} /><FieldSelect label="SLA risk" value={ticket.ai.sla_risk} values={['critical', 'high', 'medium', 'low']} onChange={value => update({}, { sla_risk: value as Risk })} /></div>
            <FieldSelect label="Suggested team" value={ticket.ai.suggested_team} values={TEAMS} onChange={value => update({}, { suggested_team: value })} />
            <label className="review-field"><span>Edit reason</span><div><select value={reason} onChange={e => setReason(e.target.value)}>{['wrong primary topic', 'missing tag', 'irrelevant tag', 'wrong priority', 'wrong routing', 'duplicate cluster not relevant', 'insufficient confidence', 'other'].map(x => <option key={x}>{pretty(x)}</option>)}</select><ChevronDown size={14} /></div></label>
            <label className="review-field"><span>Reviewer note</span><textarea placeholder="Add context for this decision…" value={ticket.reviewer_note ?? ''} onChange={e => update({ reviewer_note: e.target.value })} /></label>
            <div className="review-form-actions"><button className="btn btn-outline-purple" onClick={saveEdit}>Save changes</button><button className="btn btn-success" onClick={approve}><Check size={15} /> Approve</button></div>
          </div>
        </Panel>
        <Panel title="Activity log" subtitle="Review history"><div className="timeline"><div><i className="purple-dot" /><span><strong>AI analysis completed</strong><small>Analysis service · 8 minutes ago</small></span></div>{ticket.reviewed_at && <div><i className="green-dot" /><span><strong>Review {ticket.ai.review_status.toLowerCase()}</strong><small>Maya Rodriguez · {shortDate(ticket.reviewed_at)}</small></span></div>}<div><i /><span><strong>Ticket received</strong><small>{ticket.channel} · {shortDate(ticket.created_at)}</small></span></div></div></Panel>
      </aside>
    </div>
  </>
}
