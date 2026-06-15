import type { Priority, Risk, SourceSystem, Ticket, TicketStatus } from './types'

export const PRIMARY_TOPICS = [
  'billing', 'permissions', 'workspace_access', 'api', 'integrations', 'notifications',
  'mobile_app', 'performance', 'import_export', 'timeline', 'tasks', 'comments', 'files',
  'reporting', 'automation', 'feature_request', 'account_management',
]

export const SECONDARY_TAGS = [
  'invoice', 'duplicate_charge', 'subscription_upgrade', 'role_management', 'guest_access',
  'admin_access', 'password_reset', 'mfa', 'slack', 'google_calendar', 'jira', 'github',
  'email_notifications', 'push_notifications', 'csv_export', 'asana_import', 'bulk_import',
  'task_creation', 'task_dependencies', 'timeline_view', 'dashboard_loading', 'api_500_error',
  'rate_limit', 'webhook_failure', 'mobile_crash', 'ios_app', 'android_app', 'slow_loading',
  'large_workspace', 'audit_log', 'search', 'comments_mentions', 'file_upload',
  'roadmap_request', 'usability_confusion',
]

export const PRODUCT_AREAS = ['workspace_admin', 'billing', 'developer_platform', 'integrations', 'engagement', 'mobile', 'core_experience', 'data_portability', 'planning', 'work_management', 'collaboration', 'files', 'analytics', 'automation']
export const TEAMS = ['support_l1', 'support_l2', 'billing_ops', 'identity_team', 'platform_engineering', 'integrations_team', 'mobile_team', 'product_operations']
export const SUPPORT_AGENTS = ['Maya Rodriguez', 'Alex Morgan', 'Sam Chen', 'Jordan Kim']

const topicConfig: Record<string, { area: string; tags: string[]; subjects: string[]; issue: string }> = {
  billing: { area: 'billing', tags: ['invoice', 'duplicate_charge', 'subscription_upgrade', 'admin_access'], subjects: ['Unexpected charge on our annual invoice', 'Invoice total does not match our plan', 'Upgrade charged twice for the same workspace'], issue: 'billing access and invoice accuracy' },
  permissions: { area: 'workspace_admin', tags: ['role_management', 'guest_access', 'admin_access', 'audit_log'], subjects: ['Project admin cannot edit workspace settings', 'Guest can see a restricted project', 'Role change removed access to billing'], issue: 'role and permission behavior' },
  workspace_access: { area: 'workspace_admin', tags: ['password_reset', 'mfa', 'admin_access', 'guest_access'], subjects: ['Team member is locked out after MFA reset', 'Cannot join the workspace from invite link', 'SSO users are being asked for a password'], issue: 'workspace sign-in and access' },
  api: { area: 'developer_platform', tags: ['api_500_error', 'rate_limit', 'task_creation', 'webhook_failure'], subjects: ['API returns 500 when creating tasks', 'Rate limit reached far below documented quota', 'Task endpoint intermittently times out'], issue: 'API reliability and task creation' },
  integrations: { area: 'integrations', tags: ['slack', 'google_calendar', 'jira', 'github'], subjects: ['Slack integration stopped syncing updates', 'Google Calendar events are duplicated', 'Jira sync misses status changes'], issue: 'third-party integration sync' },
  notifications: { area: 'engagement', tags: ['email_notifications', 'push_notifications', 'comments_mentions', 'slack'], subjects: ['Mention notifications arrive several hours late', 'Users receive duplicate email notifications', 'Push notifications stopped after mobile update'], issue: 'notification delivery and preferences' },
  mobile_app: { area: 'mobile', tags: ['mobile_crash', 'ios_app', 'android_app', 'file_upload'], subjects: ['iOS app crashes when opening a task', 'Android app freezes during file upload', 'Mobile comments do not refresh'], issue: 'mobile stability' },
  performance: { area: 'core_experience', tags: ['slow_loading', 'large_workspace', 'dashboard_loading', 'search'], subjects: ['Dashboard takes 30 seconds to load', 'Large workspace becomes unusable at peak hours', 'Global search stalls on older projects'], issue: 'performance in large workspaces' },
  import_export: { area: 'data_portability', tags: ['csv_export', 'asana_import', 'bulk_import', 'timeline_view'], subjects: ['CSV export is missing custom fields', 'Asana import breaks task dependencies', 'Bulk import remains stuck at 90 percent'], issue: 'data import and export fidelity' },
  timeline: { area: 'planning', tags: ['timeline_view', 'task_dependencies', 'slow_loading', 'large_workspace'], subjects: ['Timeline shifts dates after dependency update', 'Timeline view is slow for portfolio projects', 'Milestones disappear when zooming out'], issue: 'timeline planning behavior' },
  tasks: { area: 'work_management', tags: ['task_creation', 'task_dependencies', 'bulk_import', 'usability_confusion'], subjects: ['Recurring tasks lose their dependencies', 'New task form does not save assignee', 'Bulk task creation generates duplicates'], issue: 'task creation and dependencies' },
  comments: { area: 'collaboration', tags: ['comments_mentions', 'email_notifications', 'search', 'usability_confusion'], subjects: ['Mentions in comments do not notify users', 'Comment thread shows the wrong author', 'Cannot find comments through search'], issue: 'comments and mentions' },
  files: { area: 'files', tags: ['file_upload', 'large_workspace', 'mobile_crash', 'guest_access'], subjects: ['Large file upload fails without an error', 'Guests cannot preview shared files', 'File version history is incomplete'], issue: 'file upload and access' },
  reporting: { area: 'analytics', tags: ['dashboard_loading', 'csv_export', 'audit_log', 'large_workspace'], subjects: ['Executive dashboard shows stale numbers', 'Report export excludes archived projects', 'Audit log report cannot be filtered'], issue: 'reporting accuracy and speed' },
  automation: { area: 'automation', tags: ['webhook_failure', 'task_creation', 'rate_limit', 'task_dependencies'], subjects: ['Automation rule stopped creating tasks', 'Webhook automation runs twice', 'Rule conditions ignore project status'], issue: 'automation reliability' },
  feature_request: { area: 'work_management', tags: ['roadmap_request', 'task_dependencies', 'timeline_view', 'usability_confusion'], subjects: ['Request for recurring dependency templates', 'Please add portfolio-level workload planning', 'Need conditional fields on task forms'], issue: 'requested workflow capability' },
  account_management: { area: 'workspace_admin', tags: ['subscription_upgrade', 'admin_access', 'mfa', 'role_management'], subjects: ['Cannot transfer workspace ownership', 'Need to merge two company workspaces', 'Deactivated owner blocks plan changes'], issue: 'account ownership and administration' },
}

const relatedArea: Record<string, string[]> = {
  billing: ['workspace_admin'], permissions: ['billing'], workspace_access: ['workspace_admin'], api: ['automation'],
  integrations: ['engagement'], notifications: ['integrations'], mobile_app: ['files'], performance: ['planning'],
  import_export: ['planning'], timeline: ['core_experience'], tasks: ['automation'], comments: ['engagement'],
  files: ['collaboration'], reporting: ['data_portability'], automation: ['developer_platform'],
  feature_request: ['planning'], account_management: ['billing'],
}

const clusterSummaries = [
  'Duplicate annual invoice charges', 'Billing access after role changes', 'MFA reset access loops',
  'API task creation failures', 'Integration sync gaps', 'Delayed notification delivery',
  'Mobile crashes during file upload', 'Timeline latency in large workspaces', 'Asana import dependency errors',
  'Timeline dependency shifts', 'Recurring task dependency loss', 'Delayed comment mention alerts',
  'Guest file preview failures', 'Dashboard reporting data lag', 'Webhook automations firing twice',
  'Requested workflow enhancements', 'Workspace ownership transfer blocks', 'Global search indexing delays',
]

function mulberry32(seed: number) {
  return () => {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

const pick = <T,>(arr: T[], n: number) => arr[n % arr.length]
const title = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())

const ticketDateStart = Date.UTC(2026, 4, 1)
const ticketDateDays = 42
const ticketDateWeights = Array.from({ length: ticketDateDays }, (_, dayIndex) => {
  const date = new Date(ticketDateStart + dayIndex * 86400000)
  const weekday = date.getUTCDay()
  const weekdayWeight = weekday === 0 ? .34 : weekday === 6 ? .48 : weekday === 1 ? 1.18 : 1
  const trendWeight = .82 + dayIndex * .011
  const incidentWeight = [10, 11, 23, 24, 25, 34].includes(dayIndex) ? 1.65 : 1
  const quietWeight = [6, 19, 31].includes(dayIndex) ? .58 : 1
  return weekdayWeight * trendWeight * incidentWeight * quietWeight
})

function weightedTicketDay(rand: () => number) {
  const total = ticketDateWeights.reduce((sum, weight) => sum + weight, 0)
  let cursor = rand() * total
  for (let dayIndex = 0; dayIndex < ticketDateWeights.length; dayIndex += 1) {
    cursor -= ticketDateWeights[dayIndex]
    if (cursor <= 0) return dayIndex
  }
  return ticketDateDays - 1
}

export function generateTickets(count = 500, offset = 0): Ticket[] {
  const rand = mulberry32(2048 + offset)
  const dateRand = mulberry32(9187 + offset)
  return Array.from({ length: count }, (_, localIndex) => {
    const i = localIndex + offset
    const topic = pick(PRIMARY_TOPICS, i * 7 + Math.floor(rand() * 5))
    const config = topicConfig[topic]
    const secondaryCount = localIndex < 250 ? 1 : localIndex < 420 ? 2 : localIndex < 480 ? 3 : 4 + (i % 2)
    const tags = Array.from(new Set(Array.from({ length: secondaryCount }, (__, tagIndex) => pick(config.tags, i + tagIndex))));
    while (tags.length < secondaryCount) tags.push(pick(SECONDARY_TAGS.filter(tag => !tags.includes(tag)), i + tags.length * 3))
    const priority: Priority = i % 23 === 0 ? 'P1' : i % 7 === 0 ? 'P2' : i % 3 === 0 ? 'P3' : 'P4'
    const risk: Risk = priority === 'P1' ? 'critical' : priority === 'P2' ? (i % 2 ? 'high' : 'medium') : priority === 'P3' ? 'medium' : 'low'
    const topicIndex = PRIMARY_TOPICS.indexOf(topic)
    const clusterIndex = i % 5 === 0 || i % 7 === 0
      ? (topic === 'performance' && i % 2 === 0 ? 17 : topicIndex)
      : -1
    const cluster = clusterIndex >= 0 ? `CLU-${String(clusterIndex + 1).padStart(3, '0')}` : null
    const plan = pick(['Enterprise', 'Business', 'Pro', 'Starter'], i * 3)
    const workspace = 8 + ((i * 47) % 2400)
    const dayIndex = offset > 0 ? ticketDateDays - 1 : localIndex === 0 ? ticketDateDays - 1 : weightedTicketDay(dateRand)
    const hour = 7 + Math.floor(dateRand() * 13)
    const minute = Math.floor(dateRand() * 60)
    const created = new Date(ticketDateStart + dayIndex * 86400000 + hour * 3600000 + minute * 60000)
    const team = topic === 'billing' ? 'billing_ops' : ['permissions', 'workspace_access', 'account_management'].includes(topic) ? 'identity_team' : topic === 'api' ? 'platform_engineering' : topic === 'integrations' ? 'integrations_team' : topic === 'mobile_app' ? 'mobile_team' : priority === 'P1' ? 'support_l2' : 'support_l1'
    const sentiment = priority === 'P1' ? 'frustrated' : i % 5 === 0 ? 'negative' : i % 4 === 0 ? 'concerned' : 'neutral'
    const intent = topic === 'feature_request' ? 'request capability' : i % 4 === 0 ? 'report incident' : i % 3 === 0 ? 'seek explanation' : 'request resolution'
    const wrongTopic = i % 19 === 0
    const aiTopic = wrongTopic ? pick(PRIMARY_TOPICS, PRIMARY_TOPICS.indexOf(topic) + 3) : topic
    const missingTag = i % 9 === 0
    const predictedTags = missingTag ? tags.slice(0, Math.max(1, tags.length - 1)) : i % 17 === 0 ? [...tags, 'usability_confusion'] : [...tags]
    const confidence = Number((0.61 + ((i * 17) % 36) / 100).toFixed(2))
    const status = i % 19 === 0 ? 'Edited' : i % 8 === 0 ? 'Approved' : i % 6 === 0 ? 'Analyzed' : 'Needs review'
    const ageHours = (Date.UTC(2026, 5, 12, 9) - created.getTime()) / 3600000
    const ticketStatus: TicketStatus = ageHours > 168
      ? (i % 6 === 0 ? 'Open' : 'Solved')
      : ageHours > 72
        ? (i % 4 === 0 ? 'Solved' : i % 5 === 0 ? 'Pending' : 'Open')
        : i % 7 === 0 ? 'Pending' : i % 5 === 0 ? 'New' : 'Open'
    const assignee = i % 6 === 0 ? null : pick(SUPPORT_AGENTS, i * 5)
    const sourceSystem: SourceSystem = pick(['Zendesk', 'Intercom', 'Jira Service Management', 'Email'], i)
    const sourcePrefix = sourceSystem === 'Zendesk' ? 'ZD' : sourceSystem === 'Intercom' ? 'IC' : sourceSystem === 'Jira Service Management' ? 'JSM' : 'EML'
    const slaHours = priority === 'P1' ? 4 : priority === 'P2' ? 8 : priority === 'P3' ? 24 : 72
    const slaDue = new Date(created.getTime() + slaHours * 3600000)
    const subject = pick(config.subjects, i)
    const description = `${subject}. Our ${plan.toLowerCase()} workspace has ${workspace} active members. This started ${i % 2 ? 'after a recent configuration change' : 'without any changes from our team'} and is affecting ${priority === 'P1' ? 'most users across active projects' : priority === 'P2' ? 'a key customer workflow' : 'a smaller group of collaborators'}. We reproduced it ${1 + (i % 4)} times. Please help us understand the next step.`

    return {
      ticket_id: `TCK-${String(i + 1).padStart(4, '0')}`,
      subject,
      description,
      created_at: created.toISOString(),
      channel: pick(['Email', 'Web form', 'In-app', 'API support'], i),
      ticket_status: ticketStatus,
      assignee,
      support_team: team,
      source_system: sourceSystem,
      external_id: `${sourcePrefix}-${String(10420 + i).padStart(5, '0')}`,
      sla_due_at: slaDue.toISOString(),
      customer_plan: plan,
      workspace_size: workspace,
      primary_topic: topic,
      secondary_tags: tags,
      product_area: config.area,
      related_product_areas: i % 3 === 0 ? relatedArea[topic] ?? [] : [],
      intent,
      sentiment,
      urgency: priority === 'P1' ? 'immediate' : priority === 'P2' ? 'today' : priority === 'P3' ? 'this week' : 'standard',
      impact: priority === 'P1' ? 'workspace blocked' : priority === 'P2' ? 'critical workflow degraded' : priority === 'P3' ? 'limited workflow friction' : 'minor inconvenience',
      expected_priority: priority,
      expected_sla_risk: risk,
      expected_team: team,
      duplicate_cluster_id: cluster,
      feature_request_flag: topic === 'feature_request' || tags.includes('roadmap_request'),
      escalation_flag: priority === 'P1' || (priority === 'P2' && plan === 'Enterprise'),
      synthetic_ground_truth_explanation: `The ticket explicitly describes ${config.issue}; the expected labels reflect the affected workflow, customer impact, and account context.`,
      ai: {
        primary_topic: aiTopic,
        secondary_tags: predictedTags,
        product_area: topicConfig[aiTopic].area,
        related_product_areas: i % 3 === 0 ? relatedArea[aiTopic] ?? [] : [],
        intent,
        sentiment,
        urgency: priority === 'P1' ? 'immediate' : priority === 'P2' ? 'today' : 'standard',
        impact: priority === 'P1' ? 'workspace blocked' : priority === 'P2' ? 'critical workflow degraded' : 'workflow friction',
        priority: i % 21 === 0 && priority !== 'P1' ? 'P2' : priority,
        sla_risk: i % 22 === 0 ? 'medium' : risk,
        suggested_team: i % 16 === 0 ? 'support_l2' : team,
        possible_escalation_team: priority === 'P1' ? 'incident_response' : `${config.area}_product_team`,
        duplicate_cluster: cluster,
        confidence,
        explanation: [
          `The description contains explicit signals related to ${title(aiTopic)}.`,
          `${title(predictedTags[0])} is the strongest supporting workflow signal.`,
          `${plan} plan and a ${workspace}-member workspace increase the operational impact.`,
          cluster ? `The wording is similar to tickets in ${cluster}.` : 'No strong duplicate pattern was detected.',
        ],
        suggested_next_action: priority === 'P1' ? 'Validate the incident scope and escalate to the owning engineering team.' : `Confirm the reported ${config.issue}, then route to ${title(team)}.`,
        suggested_internal_note: `AI triage: ${title(aiTopic)} with ${title(risk)} SLA risk. Review tags and routing before taking action.`,
        suggested_customer_reply_draft: `Thanks for reporting this. We have captured the affected workflow and workspace context. Our team is reviewing the issue and will follow up with the next diagnostic step.`,
        review_status: status,
      },
      reviewer_note: status === 'Edited' ? 'Adjusted classification after reviewing the full customer context.' : undefined,
      reviewed_at: ['Approved', 'Edited'].includes(status) ? new Date(created.getTime() + 3600000).toISOString() : undefined,
    } as Ticket
  })
}

export const CLUSTER_SUMMARIES = clusterSummaries
