export type Priority = 'P1' | 'P2' | 'P3' | 'P4'
export type Risk = 'critical' | 'high' | 'medium' | 'low'
export type ReviewStatus = 'Not analyzed' | 'Analyzed' | 'Needs review' | 'Approved' | 'Edited' | 'Escalated'
export type TicketStatus = 'New' | 'Open' | 'Pending' | 'Solved'
export type SourceSystem = 'Zendesk' | 'Intercom' | 'Jira Service Management' | 'Email'

export interface AIAnalysis {
  primary_topic: string
  secondary_tags: string[]
  product_area: string
  related_product_areas: string[]
  intent: string
  sentiment: string
  urgency: string
  impact: string
  priority: Priority
  sla_risk: Risk
  suggested_team: string
  possible_escalation_team: string
  duplicate_cluster: string | null
  confidence: number
  explanation: string[]
  suggested_next_action: string
  suggested_internal_note: string
  suggested_customer_reply_draft: string
  review_status: ReviewStatus
}

export interface Ticket {
  ticket_id: string
  subject: string
  description: string
  created_at: string
  channel: string
  ticket_status: TicketStatus
  assignee: string | null
  support_team: string
  source_system: SourceSystem
  external_id: string
  sla_due_at: string
  customer_plan: string
  workspace_size: number
  primary_topic: string
  secondary_tags: string[]
  product_area: string
  related_product_areas: string[]
  intent: string
  sentiment: string
  urgency: string
  impact: string
  expected_priority: Priority
  expected_sla_risk: Risk
  expected_team: string
  duplicate_cluster_id: string | null
  feature_request_flag: boolean
  escalation_flag: boolean
  synthetic_ground_truth_explanation: string
  ai: AIAnalysis
  reviewer_note?: string
  reviewed_at?: string
  human_review_requested?: boolean
}

export type Page = 'overview' | 'inbox' | 'review' | 'clusters' | 'insights' | 'quality' | 'dataset' | 'safety' | 'settings'
