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
