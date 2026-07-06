export type ConceptBPage = 'patterns' | 'review-pattern' | 'brief' | 'eval'
export type PatternTrend = 'up' | 'down' | 'flat'
export type EvidenceDecision = 'Belongs' | 'Does not belong' | 'Different problem' | 'Unsure'
export type EvidenceConfirmations = Record<string, boolean>
export type PatternVerdict = 'Valid' | 'Too broad' | 'Mixed issues' | 'Not actionable' | 'Not a product issue'
export type FeedbackSource = 'Zendesk' | 'Intercom' | 'Jira Service Management' | 'Email'

export interface EvidenceSnippet {
  id: string
  source_system: FeedbackSource
  source_id: string
  quote: string
  account_segment: string
  created_at: string
  product_area: string
  ai_reason: string
  default_decision: EvidenceDecision
}

export interface ProductBrief {
  problem: string
  evidence_summary: string
  affected_area: string
  suggested_next_step: string
  decision_owner: string
  risk_to_watch: string
}

export interface MockOutcome {
  label: string
  status: string
  before_mentions: number
  after_mentions: number
  measurement_window: string
  note: string
}

export interface FeedbackPattern {
  id: string
  short_name: string
  summary: string
  product_area: string
  mention_count: number
  trend: PatternTrend
  confidence: number
  detected_at: string
  cadence_hint: string
  ai_summary: string
  why_suggested: string[]
  evidence: EvidenceSnippet[]
  default_verdict: PatternVerdict
  brief: ProductBrief
  outcome: MockOutcome
}

export interface EvalMetric {
  label: string
  value: string
  definition: string
  status: string
  kind: 'quality' | 'cost'
  emphasis?: boolean
}

export interface ProductionEvalRule {
  metric: string
  threshold: string
  action: string
}

export interface CostTask {
  task: string
  spend: number
  share: number
}
