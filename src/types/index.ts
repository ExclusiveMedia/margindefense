// Core domain types for MarginDefense.ai

export type WorkCategory = 'billable' | 'margin_burn' | 'scope_risk' | 'unclassified';

export type BurnReason = 
  | 'scope_creep'
  | 'internal_meeting'
  | 'rework'
  | 'admin'
  | 'communication'
  | 'planning'
  | 'research'
  | 'setup'
  | 'other';

export type MarginHealth = 'healthy' | 'warning' | 'critical' | 'underwater';

export interface Organization {
  id: string;
  name: string;
  currency_symbol: string;
  global_hourly_cost: number; // Default $50
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  organization_id: string;
  name: string;
  retainer_value: number | null;
  accumulated_burn_total: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  organization_id: string;
  client_id: string;
  name: string;
  description: string | null;
  total_budget: number;
  current_spend: number;
  margin_health: MarginHealth;
  status: 'active' | 'completed' | 'on_hold';
  created_at: string;
  updated_at: string;
  // Computed/joined fields
  client?: Client;
}

export interface WorkLog {
  id: string;
  organization_id: string;
  project_id: string | null;
  client_id: string | null;
  user_id: string | null;
  description: string;
  duration_minutes: number;
  hourly_rate: number;
  cost_impact: number; // duration * hourly_rate / 60
  category: WorkCategory;
  burn_reason: BurnReason | null;
  source: 'manual' | 'slack' | 'jira' | 'email' | 'csv' | 'webhook';
  source_id: string | null; // External ID from integration
  metadata: Record<string, unknown> | null;
  created_at: string;
  classified_at: string | null;
  // Joined fields
  project?: Project;
  client?: Client;
}

export interface ScopeRequest {
  id: string;
  organization_id: string;
  client_id: string | null;
  project_id: string | null;
  title: string;
  description: string;
  estimated_hours: number | null;
  estimated_cost: number | null;
  status: 'pending' | 'accepted_burn' | 'converted_revenue' | 'rejected';
  source: 'manual' | 'slack' | 'email' | 'webhook';
  source_id: string | null;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  // Joined
  client?: Client;
  project?: Project;
}

// Dashboard aggregate types
export interface BurnMetrics {
  total_revenue_secure: number;
  total_margin_burn: number;
  burn_ratio: number; // burn / (revenue + burn)
  period_start: string;
  period_end: string;
}

export interface BurnByCategory {
  category: BurnReason;
  total_cost: number;
  count: number;
  percentage: number;
}

export interface BurnByClient {
  client_id: string;
  client_name: string;
  total_burn: number;
  total_billable: number;
  burn_ratio: number;
}

export interface LeaderboardEntry {
  id: string;
  description: string;
  cost_impact: number;
  category: WorkCategory;
  burn_reason: BurnReason | null;
  created_at: string;
  client_name: string | null;
  project_name: string | null;
}

// Integration webhook payload types
export interface WebhookPayload {
  source: 'slack' | 'jira' | 'linear' | 'asana' | 'harvest' | 'toggl';
  event_type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

// Classification result from the engine
export interface ClassificationResult {
  category: WorkCategory;
  burn_reason: BurnReason | null;
  confidence: number; // 0-1
  reasoning: string;
}

// UI State types
export interface DashboardFilters {
  period: 'today' | 'week' | 'month' | 'quarter' | 'custom';
  client_id?: string;
  project_id?: string;
  category?: WorkCategory;
  start_date?: string;
  end_date?: string;
}

// ============================================
// V2 ENHANCED TYPES - Command Center & Agents
// ============================================

// Client Health & Sentiment (Client Pulse)
export type ClientSentiment = 'happy' | 'neutral' | 'concerned' | 'at_risk';
export type ClientHealth = 'excellent' | 'good' | 'warning' | 'critical';

export interface ClientHealthMetrics {
  client_id: string;
  client_name: string;
  health: ClientHealth;
  sentiment: ClientSentiment;
  // Financial
  total_revenue: number;
  total_burn: number;
  margin_percentage: number;
  retainer_utilization: number | null; // % of retainer used
  // Engagement
  last_deliverable_date: string | null;
  pending_scope_requests: number;
  overdue_deliverables: number;
  // Computed risk score (0-100, higher = riskier)
  risk_score: number;
  // Recent trend
  margin_trend: 'improving' | 'stable' | 'declining';
}

// Margin Agent System
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';
export type AlertType = 
  | 'margin_threshold'      // Margin dropped below threshold
  | 'burn_spike'            // Sudden increase in burn
  | 'scope_creep_pattern'   // Multiple scope requests detected
  | 'project_overrun'       // Project exceeding budget
  | 'client_churn_risk'     // Client showing churn indicators
  | 'efficiency_drop'       // Billable ratio declining
  | 'deadline_risk'         // Margin at risk due to timeline
  | 'optimization_found';   // Agent found improvement opportunity

export interface MarginAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  impact_amount: number; // Potential $ impact
  client_id?: string;
  project_id?: string;
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  suggested_action?: string;
  // Link to related entity
  entity_type?: 'client' | 'project' | 'work_log' | 'scope_request';
  entity_id?: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  type: 'margin_defender' | 'intake_classifier' | 'scope_sentinel' | 'efficiency_optimizer';
  status: 'active' | 'paused' | 'error';
  last_run: string;
  alerts_generated: number;
  actions_taken: number;
  efficiency_score: number; // 0-100
}

// Command Center Metrics
export interface CommandCenterMetrics {
  // Core KPIs
  billable_ratio: number; // % of billable vs total
  billable_ratio_trend: 'up' | 'down' | 'stable';
  at_risk_revenue: number; // $ at risk from scope/burn
  ai_hours_saved: number; // Hours saved by automation
  efficiency_score: number; // Overall 0-100 score
  
  // Period comparison
  revenue_secure_delta: number; // vs last period
  margin_burn_delta: number;
  
  // Alerts summary
  active_alerts: number;
  critical_alerts: number;
  
  // Client overview
  healthy_clients: number;
  at_risk_clients: number;
  total_clients: number;
}

// Project Board (Kanban) Types
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'completed';

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  is_billable: boolean;
  estimated_hours: number;
  actual_hours: number;
  cost_impact: number;
  assignee?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Benchmark & Analytics
export interface IndustryBenchmark {
  industry: string;
  avg_billable_ratio: number;
  avg_margin: number;
  top_decile_margin: number;
  avg_burn_categories: Record<BurnReason, number>;
}

export interface TrendDataPoint {
  date: string;
  revenue_secure: number;
  margin_burn: number;
  billable_ratio: number;
  efficiency_score: number;
}

// Integration Status
export interface IntegrationStatus {
  id: string;
  type: 'slack' | 'jira' | 'linear' | 'asana' | 'harvest' | 'toggl' | 'quickbooks';
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  last_sync?: string;
  records_synced?: number;
}
