import type {
  CostTask,
  EvalMetric,
  EvidenceDecision,
  FeedbackPattern,
  PatternVerdict,
  ProductionEvalRule,
} from '../types'

export const MOCK_LABEL = 'Mocked / Illustrative'

export const READINESS_RULE = {
  belongsMinimum: 5,
  confidenceMinimum: 0.7,
  verdict: 'Valid' as PatternVerdict,
}

export const MODEL_BOUNDARY =
  'AI suggests patterns; the human validates evidence; transparent rules compute readiness; the PM decides. The AI never decides what enters the backlog and never self-approves.'

export const evidenceDecisions: EvidenceDecision[] = [
  'Belongs',
  'Does not belong',
  'Different problem',
  'Unsure',
]

export const patternVerdicts: PatternVerdict[] = [
  'Valid',
  'Too broad',
  'Mixed issues',
  'Not actionable',
  'Not a product issue',
]

export const feedbackPatterns: FeedbackPattern[] = [
  {
    id: 'PAT-001',
    short_name: 'Timeline import shifts dates',
    summary: 'Imported timeline dependencies shift milestone dates after teams migrate project plans.',
    product_area: 'Planning',
    mention_count: 42,
    trend: 'up',
    confidence: 0.86,
    detected_at: '2026-06-12T09:30:00.000Z',
    cadence_hint: 'Pre-sprint review',
    ai_summary:
      'Several customers describe the same underlying planning issue: dependency dates change after importing timeline data, forcing manual cleanup before roadmap reviews.',
    why_suggested: [
      'Semantically similar complaints across import, dependency, and milestone wording.',
      'Mentions increased in enterprise workspaces during the last mocked review window.',
      'The quotes point to one workflow break rather than generic timeline confusion.',
    ],
    default_verdict: 'Valid',
    evidence: [
      {
        id: 'EV-001',
        source_system: 'Zendesk',
        source_id: 'ZD-18421',
        quote:
          'After importing our Asana plan, every dependency moved the launch milestone by one day. We fixed it manually before the exec review.',
        account_segment: 'Enterprise · 820 seats',
        created_at: '2026-06-08T10:20:00.000Z',
        product_area: 'Planning',
        ai_reason: 'Mentions import, dependencies, and shifted milestone dates.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-002',
        source_system: 'Intercom',
        source_id: 'IC-77102',
        quote:
          'Timeline import looked successful, but dependent tasks started a day later than the source file. We cannot trust the migration preview.',
        account_segment: 'Business · 210 seats',
        created_at: '2026-06-09T14:05:00.000Z',
        product_area: 'Planning',
        ai_reason: 'Same dependency-date shift described with migration-preview language.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-003',
        source_system: 'Email',
        source_id: 'EML-13044',
        quote:
          'Our portfolio dates changed after import only for tasks with blockers. Tasks without dependencies stayed correct.',
        account_segment: 'Enterprise · 1,440 seats',
        created_at: '2026-06-10T08:55:00.000Z',
        product_area: 'Planning',
        ai_reason: 'Narrows the issue to imported tasks with dependency blockers.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-004',
        source_system: 'Zendesk',
        source_id: 'ZD-18486',
        quote:
          'Dates are off after CSV import when a task depends on another task in a different project. This broke our migration checklist.',
        account_segment: 'Business · 340 seats',
        created_at: '2026-06-10T16:40:00.000Z',
        product_area: 'Planning',
        ai_reason: 'Matches import plus cross-project dependency date movement.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-005',
        source_system: 'Jira Service Management',
        source_id: 'JSM-22817',
        quote:
          'We imported timeline data twice and the same dependency chain moved milestones forward. The preview did not warn us.',
        account_segment: 'Enterprise · 970 seats',
        created_at: '2026-06-11T11:10:00.000Z',
        product_area: 'Planning',
        ai_reason: 'Repeats the same dependency chain behavior and missing warning.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-006',
        source_system: 'Intercom',
        source_id: 'IC-77154',
        quote:
          'Imported milestones kept their labels, but all dependent delivery dates shifted. We had to rebuild the timeline by hand.',
        account_segment: 'Enterprise · 620 seats',
        created_at: '2026-06-11T13:35:00.000Z',
        product_area: 'Planning',
        ai_reason: 'Describes dependent delivery dates shifting after import.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-007',
        source_system: 'Zendesk',
        source_id: 'ZD-18501',
        quote:
          'Timeline zoom is slow on a large portfolio. It is painful, but our imported dates did not change.',
        account_segment: 'Enterprise · 1,880 seats',
        created_at: '2026-06-12T09:12:00.000Z',
        product_area: 'Planning',
        ai_reason: 'Mentions timeline friction but not the same import-date problem.',
        default_decision: 'Different problem',
      },
    ],
    brief: {
      problem:
        'Teams importing project timelines cannot trust dependency dates because dependent milestones may shift without a clear warning.',
      evidence_summary:
        '6 of 7 reviewed evidence snippets belong to the same pattern across Zendesk, Intercom, email, and Jira Service Management exports.',
      affected_area: 'Planning · Timeline import · Dependency engine',
      suggested_next_step:
        'Run an import-preview design spike that flags dependency date changes before customers commit the migration.',
      decision_owner: 'Planning PM',
      risk_to_watch:
        'The pattern is strongest in enterprise workspaces; validate whether smaller workspaces see the same dependency behavior before sizing.',
    },
    outcome: {
      label: 'Mocked outcome — no live integration',
      status: 'Product action shipped in mocked timeline',
      before_mentions: 42,
      after_mentions: 18,
      measurement_window: 'Estimated 30 days after release',
      note:
        'Illustrative tracking shows mentions decreasing after adding import-preview warnings. This is not connected to a real helpdesk.',
    },
  },
  {
    id: 'PAT-002',
    short_name: 'Guest file previews blocked',
    summary: 'Guests cannot preview files shared from restricted projects even when the link is explicitly shared.',
    product_area: 'Files',
    mention_count: 27,
    trend: 'flat',
    confidence: 0.78,
    detected_at: '2026-06-11T12:00:00.000Z',
    cadence_hint: 'Ad hoc',
    ai_summary:
      'Customers describe a permissions edge case where guests can open a shared project link but cannot preview attached files.',
    why_suggested: [
      'Quotes align around guest access and file preview behavior.',
      'The pattern appears in both support tickets and product feedback exports.',
      'Affected users describe workflow blocking rather than preference confusion.',
    ],
    default_verdict: 'Mixed issues',
    evidence: [
      {
        id: 'EV-101',
        source_system: 'Zendesk',
        source_id: 'ZD-18310',
        quote: 'A guest can see the project but the shared PDF preview says they need permission.',
        account_segment: 'Business · 140 seats',
        created_at: '2026-06-05T09:14:00.000Z',
        product_area: 'Files',
        ai_reason: 'Directly connects guest access and file preview denial.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-102',
        source_system: 'Intercom',
        source_id: 'IC-76988',
        quote: 'External reviewers can comment on tasks, but image previews fail inside the same shared workspace.',
        account_segment: 'Pro · 56 seats',
        created_at: '2026-06-06T15:23:00.000Z',
        product_area: 'Files',
        ai_reason: 'Likely same guest/file-preview edge case.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-103',
        source_system: 'Email',
        source_id: 'EML-12880',
        quote: 'Our guest user cannot upload files at all. Preview is not the issue.',
        account_segment: 'Starter · 18 seats',
        created_at: '2026-06-09T12:41:00.000Z',
        product_area: 'Files',
        ai_reason: 'Related file access topic but a different problem.',
        default_decision: 'Different problem',
      },
    ],
    brief: {
      problem: 'Guest collaborators hit inconsistent file-preview permissions inside shared project contexts.',
      evidence_summary: '2 of 3 reviewed snippets belong; the remaining snippet is a related upload issue.',
      affected_area: 'Files · Guest permissions',
      suggested_next_step: 'Split preview permission checks from upload permission checks and test restricted-project links.',
      decision_owner: 'Collaboration PM',
      risk_to_watch: 'The current pattern may combine preview and upload complaints; needs sharper segmentation.',
    },
    outcome: {
      label: 'Mocked outcome — no live integration',
      status: 'No product action tracked',
      before_mentions: 27,
      after_mentions: 25,
      measurement_window: 'Estimated 30 days',
      note: 'Illustrative outcome remains flat because this pattern has not reached decision readiness.',
    },
  },
  {
    id: 'PAT-003',
    short_name: 'CSV export omits custom fields',
    summary: 'Analytics exports omit custom fields when archived projects are included in the report.',
    product_area: 'Analytics',
    mention_count: 19,
    trend: 'up',
    confidence: 0.73,
    detected_at: '2026-06-10T10:10:00.000Z',
    cadence_hint: 'Biweekly',
    ai_summary:
      'Customers mention missing custom fields only when reports include archived projects, suggesting a data-export edge case.',
    why_suggested: [
      'Repeated phrasing around CSV export, custom fields, and archived projects.',
      'The issue appears in finance and operations reporting workflows.',
      'Confidence is above threshold but evidence still needs reviewer confirmation.',
    ],
    default_verdict: 'Too broad',
    evidence: [
      {
        id: 'EV-201',
        source_system: 'Zendesk',
        source_id: 'ZD-18240',
        quote: 'CSV export includes custom fields until we include archived projects, then the fields disappear.',
        account_segment: 'Enterprise · 760 seats',
        created_at: '2026-06-03T14:00:00.000Z',
        product_area: 'Analytics',
        ai_reason: 'Exact export and archived-project condition.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-202',
        source_system: 'Email',
        source_id: 'EML-12788',
        quote: 'Our report export is missing owner and region fields for older projects.',
        account_segment: 'Business · 230 seats',
        created_at: '2026-06-04T11:48:00.000Z',
        product_area: 'Analytics',
        ai_reason: 'May belong, but archived-project condition is implied rather than explicit.',
        default_decision: 'Unsure',
      },
      {
        id: 'EV-203',
        source_system: 'Intercom',
        source_id: 'IC-76822',
        quote: 'The dashboard is stale today. I am not exporting anything.',
        account_segment: 'Enterprise · 1,100 seats',
        created_at: '2026-06-07T17:32:00.000Z',
        product_area: 'Analytics',
        ai_reason: 'Analytics complaint but not an export/custom-field issue.',
        default_decision: 'Does not belong',
      },
    ],
    brief: {
      problem: 'CSV exports may drop custom fields when archived projects are included.',
      evidence_summary: 'Evidence points to a likely export edge case but needs more confirmed snippets.',
      affected_area: 'Analytics · CSV export',
      suggested_next_step: 'Add targeted eval cases for archived-project exports before committing backlog scope.',
      decision_owner: 'Analytics PM',
      risk_to_watch: 'May be several report-export issues grouped too broadly.',
    },
    outcome: {
      label: 'Mocked outcome — no live integration',
      status: 'Not ready for outcome tracking',
      before_mentions: 19,
      after_mentions: 19,
      measurement_window: 'No action window',
      note: 'No outcome is inferred until a product action exists.',
    },
  },
  {
    id: 'PAT-004',
    short_name: 'Webhook automations run twice',
    summary: 'Webhook-triggered automations sometimes create duplicate tasks after retries.',
    product_area: 'Automation',
    mention_count: 31,
    trend: 'down',
    confidence: 0.69,
    detected_at: '2026-06-09T16:25:00.000Z',
    cadence_hint: 'Weekly',
    ai_summary:
      'Several accounts report duplicate automation output after webhook retries, but confidence is just below the readiness threshold.',
    why_suggested: [
      'Mentions cluster around webhooks, retries, and duplicate created tasks.',
      'Trend is improving, so this may already be mitigated.',
      'Confidence is below the configured readiness rule and requires deeper review.',
    ],
    default_verdict: 'Valid',
    evidence: [
      {
        id: 'EV-301',
        source_system: 'Jira Service Management',
        source_id: 'JSM-22661',
        quote: 'Our webhook retried once and Opsqora created two identical follow-up tasks.',
        account_segment: 'Business · 184 seats',
        created_at: '2026-06-01T09:40:00.000Z',
        product_area: 'Automation',
        ai_reason: 'Direct retry plus duplicate-task behavior.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-302',
        source_system: 'Zendesk',
        source_id: 'ZD-18170',
        quote: 'Automation ran twice overnight and assigned the same onboarding task to two owners.',
        account_segment: 'Enterprise · 540 seats',
        created_at: '2026-06-02T08:17:00.000Z',
        product_area: 'Automation',
        ai_reason: 'Likely duplicate automation output.',
        default_decision: 'Belongs',
      },
      {
        id: 'EV-303',
        source_system: 'Email',
        source_id: 'EML-12672',
        quote: 'We need a webhook audit log. We cannot tell whether a retry happened.',
        account_segment: 'Pro · 72 seats',
        created_at: '2026-06-04T13:20:00.000Z',
        product_area: 'Automation',
        ai_reason: 'Related diagnostic need, not duplicate-task evidence.',
        default_decision: 'Different problem',
      },
    ],
    brief: {
      problem: 'Webhook retry behavior may create duplicate automation outputs.',
      evidence_summary: '2 of 3 snippets directly belong; confidence is below readiness threshold.',
      affected_area: 'Automation · Webhook retries',
      suggested_next_step: 'Inspect retry idempotency and add a targeted evidence review pass.',
      decision_owner: 'Automation PM',
      risk_to_watch: 'Trend is down; validate current severity before prioritizing.',
    },
    outcome: {
      label: 'Mocked outcome — no live integration',
      status: 'Monitoring only',
      before_mentions: 31,
      after_mentions: 22,
      measurement_window: 'Estimated 30 days',
      note: 'Illustrative mentions declined, but no validated product decision is attached.',
    },
  },
]

export const qualityMetrics: EvalMetric[] = [
  {
    label: 'Pattern precision',
    value: '76%',
    definition: 'Of the AI-suggested patterns reviewers inspected, the share judged to describe one real recurring problem.',
    status: 'Above 70% launch threshold',
    kind: 'quality',
    emphasis: true,
  },
  {
    label: 'Evidence precision',
    value: '81%',
    definition: 'Of evidence snippets attached to a pattern, the share reviewers marked as Belongs.',
    status: 'Healthy, with analytics exports weaker',
    kind: 'quality',
  },
  {
    label: 'Summary acceptance',
    value: '68%',
    definition: 'How often PMs accepted the AI pattern summary without rewriting the core problem statement.',
    status: 'Needs prompt tightening',
    kind: 'quality',
  },
  {
    label: 'Human correction rate',
    value: '24%',
    definition: 'How often reviewers changed evidence grouping or verdict before a pattern could move forward.',
    status: 'Expected for assistive AI',
    kind: 'quality',
  },
  {
    label: 'High-confidence disagreement',
    value: '9%',
    definition: 'How often reviewers rejected evidence even though the model was highly confident.',
    status: 'Watchlist',
    kind: 'quality',
  },
  {
    label: 'False positive rate',
    value: '14%',
    definition: 'Suggested patterns that looked recurring but did not survive evidence validation.',
    status: 'Below stop threshold',
    kind: 'quality',
  },
]

export const costMetrics: EvalMetric[] = [
  {
    label: 'Daily spend',
    value: '$38',
    definition: 'Estimated model cost for clustering, evidence selection, summarization, and brief generation in one day.',
    status: 'Estimated from mocked volume',
    kind: 'cost',
  },
  {
    label: 'Cost per ticket processed',
    value: '$0.018',
    definition: 'Estimated model cost to embed/classify one imported helpdesk item before pattern grouping.',
    status: 'Low-level unit cost',
    kind: 'cost',
  },
  {
    label: 'Cost per suggested pattern',
    value: '$2.40',
    definition: 'Estimated cost to turn raw feedback into one AI-suggested recurring pattern.',
    status: 'Useful, but not value-linked',
    kind: 'cost',
  },
  {
    label: 'Cost per validated pattern',
    value: '$8.90',
    definition: 'Estimated model cost for one pattern that survives human evidence validation.',
    status: 'Key value-linked metric',
    kind: 'cost',
    emphasis: true,
  },
  {
    label: 'Projected monthly cost',
    value: '$1.1k',
    definition: 'Estimated monthly model spend at current mocked support volume.',
    status: 'Planning number only',
    kind: 'cost',
  },
]

export const costByTask: CostTask[] = [
  { task: 'Semantic clustering', spend: 15.2, share: 40 },
  { task: 'Evidence selection', spend: 9.1, share: 24 },
  { task: 'Pattern summaries', spend: 7.4, share: 19 },
  { task: 'Brief generation', spend: 4.6, share: 12 },
  { task: 'Low-stakes labels', spend: 1.9, share: 5 },
]

export const evalRules: ProductionEvalRule[] = [
  {
    metric: 'Pattern precision',
    threshold: '< 70%',
    action:
      'Pause auto-suggestion, re-tune the clustering prompt, and inspect failing product areas before resuming.',
  },
  {
    metric: 'High-confidence disagreement',
    threshold: '> 12%',
    action:
      'Block high-confidence patterns from readiness, sample rejected evidence, and lower the confidence calibration.',
  },
  {
    metric: 'Cost per validated pattern',
    threshold: '> $12',
    action:
      'Move low-stakes summaries to a cheaper model tier and keep the frontier model for clustering and final brief synthesis.',
  },
]

export const evalTrend = [
  { week: 'W1', precision: 69, evidence: 74, cost: 11.8 },
  { week: 'W2', precision: 72, evidence: 77, cost: 10.6 },
  { week: 'W3', precision: 74, evidence: 79, cost: 9.7 },
  { week: 'W4', precision: 76, evidence: 81, cost: 8.9 },
]

export function getInitialEvidenceDecisions() {
  return feedbackPatterns.reduce<Record<string, Record<string, EvidenceDecision>>>((acc, pattern) => {
    acc[pattern.id] = pattern.evidence.reduce<Record<string, EvidenceDecision>>((evidenceAcc, evidence) => {
      evidenceAcc[evidence.id] = evidence.default_decision
      return evidenceAcc
    }, {})
    return acc
  }, {})
}

export function getInitialPatternVerdicts() {
  return feedbackPatterns.reduce<Record<string, PatternVerdict>>((acc, pattern) => {
    acc[pattern.id] = pattern.default_verdict
    return acc
  }, {})
}

export function getReadiness(
  pattern: FeedbackPattern,
  decisions: Record<string, EvidenceDecision>,
  verdict: PatternVerdict,
) {
  const belongsCount = pattern.evidence.filter(evidence => decisions[evidence.id] === 'Belongs').length
  const confidenceReady = pattern.confidence >= READINESS_RULE.confidenceMinimum
  const verdictReady = verdict === READINESS_RULE.verdict
  const evidenceReady = belongsCount >= READINESS_RULE.belongsMinimum
  const ready = evidenceReady && verdictReady && confidenceReady

  return {
    ready,
    belongsCount,
    evidenceReady,
    verdictReady,
    confidenceReady,
    totalEvidence: pattern.evidence.length,
  }
}
