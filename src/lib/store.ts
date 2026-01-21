/**
 * Mock Data Store for MarginDefense MVP
 * 
 * This simulates the Supabase backend for demo purposes.
 * Replace with real Supabase client for production.
 */

import type {
  Organization,
  Client,
  Project,
  WorkLog,
  ScopeRequest,
  WorkCategory,
  BurnReason,
  MarginHealth,
} from '@/types';
import { generateId } from '@/lib/utils';
import { classifyWork, calculateCostImpact } from '@/lib/classifier';

// ============================================
// SEED DATA - "Make It Hurt" Demo Data
// ============================================

const DEMO_ORG: Organization = {
  id: 'org-demo-001',
  name: 'Acme Digital Agency',
  currency_symbol: '$',
  global_hourly_cost: 75, // $75/hour average
  created_at: '2024-01-01T00:00:00Z',
  updated_at: new Date().toISOString(),
};

const DEMO_CLIENTS: Client[] = [
  {
    id: 'client-001',
    organization_id: DEMO_ORG.id,
    name: 'TechCorp Industries',
    retainer_value: 15000,
    accumulated_burn_total: 4200,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'client-002',
    organization_id: DEMO_ORG.id,
    name: 'StartupXYZ',
    retainer_value: 8000,
    accumulated_burn_total: 2800,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'client-003',
    organization_id: DEMO_ORG.id,
    name: 'Enterprise Solutions Ltd',
    retainer_value: 25000,
    accumulated_burn_total: 6100,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
];

const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    organization_id: DEMO_ORG.id,
    client_id: 'client-001',
    name: 'Website Redesign',
    description: 'Complete website overhaul with new branding',
    total_budget: 45000,
    current_spend: 38000,
    margin_health: 'warning',
    status: 'active',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-002',
    organization_id: DEMO_ORG.id,
    client_id: 'client-002',
    name: 'Mobile App MVP',
    description: 'iOS and Android app development',
    total_budget: 60000,
    current_spend: 72000, // OVER BUDGET
    margin_health: 'underwater',
    status: 'active',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj-003',
    organization_id: DEMO_ORG.id,
    client_id: 'client-003',
    name: 'CRM Integration',
    description: 'Salesforce integration with custom workflows',
    total_budget: 30000,
    current_spend: 18000,
    margin_health: 'healthy',
    status: 'active',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
];

// Generate dates for the past week
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function hoursAgo(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

const DEMO_WORK_LOGS: WorkLog[] = [
  // TODAY - Mix of billable and burn
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-001',
    client_id: 'client-001',
    user_id: null,
    description: 'Weekly team sync meeting - all hands on deck',
    duration_minutes: 60,
    hourly_rate: 75,
    cost_impact: 375, // 5 people × 1 hour × $75
    category: 'margin_burn',
    burn_reason: 'internal_meeting',
    source: 'manual',
    source_id: null,
    metadata: { attendees: 5 },
    created_at: hoursAgo(2),
    classified_at: hoursAgo(2),
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-001',
    client_id: 'client-001',
    user_id: null,
    description: 'Designed and delivered homepage mockups to client',
    duration_minutes: 180,
    hourly_rate: 75,
    cost_impact: 225,
    category: 'billable',
    burn_reason: null,
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: hoursAgo(4),
    classified_at: hoursAgo(4),
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-002',
    client_id: 'client-002',
    user_id: null,
    description: 'Debugging login authentication issue - client reported bug',
    duration_minutes: 120,
    hourly_rate: 75,
    cost_impact: 150,
    category: 'margin_burn',
    burn_reason: 'rework',
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: hoursAgo(5),
    classified_at: hoursAgo(5),
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: null,
    client_id: null,
    user_id: null,
    description: 'Responding to Slack messages and email backlog',
    duration_minutes: 90,
    hourly_rate: 75,
    cost_impact: 112.5,
    category: 'margin_burn',
    burn_reason: 'communication',
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: hoursAgo(6),
    classified_at: hoursAgo(6),
  },
  // YESTERDAY
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-003',
    client_id: 'client-003',
    user_id: null,
    description: 'Client strategy call to discuss Q2 roadmap',
    duration_minutes: 60,
    hourly_rate: 75,
    cost_impact: 75,
    category: 'billable',
    burn_reason: null,
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: daysAgo(1),
    classified_at: daysAgo(1),
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-001',
    client_id: 'client-001',
    user_id: null,
    description: 'Internal brainstorming session for new feature ideas',
    duration_minutes: 90,
    hourly_rate: 75,
    cost_impact: 337.5, // 3 people
    category: 'margin_burn',
    burn_reason: 'planning',
    source: 'manual',
    source_id: null,
    metadata: { attendees: 3 },
    created_at: daysAgo(1),
    classified_at: daysAgo(1),
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-002',
    client_id: 'client-002',
    user_id: null,
    description: 'Built and tested user profile API endpoints',
    duration_minutes: 240,
    hourly_rate: 75,
    cost_impact: 300,
    category: 'billable',
    burn_reason: null,
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: daysAgo(1),
    classified_at: daysAgo(1),
  },
  // 2 DAYS AGO
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-001',
    client_id: 'client-001',
    user_id: null,
    description: 'Updating Jira tickets and writing status reports',
    duration_minutes: 60,
    hourly_rate: 75,
    cost_impact: 75,
    category: 'margin_burn',
    burn_reason: 'admin',
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: daysAgo(2),
    classified_at: daysAgo(2),
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-003',
    client_id: 'client-003',
    user_id: null,
    description: 'Implemented Salesforce webhook integration',
    duration_minutes: 300,
    hourly_rate: 75,
    cost_impact: 375,
    category: 'billable',
    burn_reason: null,
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: daysAgo(2),
    classified_at: daysAgo(2),
  },
  // 3 DAYS AGO - Big burn day
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-002',
    client_id: 'client-002',
    user_id: null,
    description: 'Emergency all-hands to discuss project delays',
    duration_minutes: 120,
    hourly_rate: 75,
    cost_impact: 600, // 4 people × 2 hours
    category: 'margin_burn',
    burn_reason: 'internal_meeting',
    source: 'manual',
    source_id: null,
    metadata: { attendees: 4 },
    created_at: daysAgo(3),
    classified_at: daysAgo(3),
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-002',
    client_id: 'client-002',
    user_id: null,
    description: 'Reworking payment flow due to changed requirements',
    duration_minutes: 240,
    hourly_rate: 75,
    cost_impact: 300,
    category: 'margin_burn',
    burn_reason: 'rework',
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: daysAgo(3),
    classified_at: daysAgo(3),
  },
  // 4-7 DAYS AGO - More variety
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-001',
    client_id: 'client-001',
    user_id: null,
    description: 'Delivered final brand guidelines document',
    duration_minutes: 180,
    hourly_rate: 75,
    cost_impact: 225,
    category: 'billable',
    burn_reason: null,
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: daysAgo(4),
    classified_at: daysAgo(4),
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-003',
    client_id: 'client-003',
    user_id: null,
    description: 'Research and learning new Salesforce API features',
    duration_minutes: 120,
    hourly_rate: 75,
    cost_impact: 150,
    category: 'margin_burn',
    burn_reason: 'research',
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: daysAgo(5),
    classified_at: daysAgo(5),
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    project_id: 'proj-001',
    client_id: 'client-001',
    user_id: null,
    description: 'Setup dev environment for new team member',
    duration_minutes: 180,
    hourly_rate: 75,
    cost_impact: 225,
    category: 'margin_burn',
    burn_reason: 'setup',
    source: 'manual',
    source_id: null,
    metadata: null,
    created_at: daysAgo(6),
    classified_at: daysAgo(6),
  },
];

const DEMO_SCOPE_REQUESTS: ScopeRequest[] = [
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    client_id: 'client-001',
    project_id: 'proj-001',
    title: 'Can you also add a blog section?',
    description: 'Client asked if we could "quickly add" a blog to the website. Not in original scope.',
    estimated_hours: 40,
    estimated_cost: 3000,
    status: 'pending',
    source: 'email',
    source_id: null,
    created_at: hoursAgo(3),
    resolved_at: null,
    resolved_by: null,
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    client_id: 'client-002',
    project_id: 'proj-002',
    title: 'Add dark mode to the app',
    description: 'StartupXYZ wants dark mode. "Should be easy right?" - definitely not in contract.',
    estimated_hours: 24,
    estimated_cost: 1800,
    status: 'pending',
    source: 'slack',
    source_id: null,
    created_at: daysAgo(1),
    resolved_at: null,
    resolved_by: null,
  },
  {
    id: generateId(),
    organization_id: DEMO_ORG.id,
    client_id: 'client-003',
    project_id: 'proj-003',
    title: 'Extra reporting dashboard',
    description: 'Enterprise wants custom analytics dashboard. "While you\'re in there anyway..."',
    estimated_hours: 60,
    estimated_cost: 4500,
    status: 'pending',
    source: 'manual',
    source_id: null,
    created_at: daysAgo(2),
    resolved_at: null,
    resolved_by: null,
  },
];

// ============================================
// IN-MEMORY STORE
// ============================================

class MockDataStore {
  private organization: Organization = DEMO_ORG;
  private clients: Client[] = [...DEMO_CLIENTS];
  private projects: Project[] = [...DEMO_PROJECTS];
  private workLogs: WorkLog[] = [...DEMO_WORK_LOGS];
  private scopeRequests: ScopeRequest[] = [...DEMO_SCOPE_REQUESTS];

  // Organization
  getOrganization(): Organization {
    return this.organization;
  }

  updateOrganization(updates: Partial<Organization>): Organization {
    this.organization = { ...this.organization, ...updates, updated_at: new Date().toISOString() };
    return this.organization;
  }

  // Clients
  getClients(): Client[] {
    return this.clients;
  }

  getClient(id: string): Client | undefined {
    return this.clients.find((c) => c.id === id);
  }

  createClient(data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'accumulated_burn_total'>): Client {
    const client: Client = {
      ...data,
      id: generateId(),
      accumulated_burn_total: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.clients.push(client);
    return client;
  }

  // Projects
  getProjects(): Project[] {
    return this.projects.map((p) => ({
      ...p,
      client: this.getClient(p.client_id),
    }));
  }

  getProject(id: string): Project | undefined {
    const project = this.projects.find((p) => p.id === id);
    if (project) {
      return { ...project, client: this.getClient(project.client_id) };
    }
    return undefined;
  }

  // Work Logs
  getWorkLogs(filters?: {
    category?: WorkCategory;
    client_id?: string;
    project_id?: string;
    start_date?: string;
    end_date?: string;
  }): WorkLog[] {
    let logs = [...this.workLogs];

    if (filters?.category) {
      logs = logs.filter((l) => l.category === filters.category);
    }
    if (filters?.client_id) {
      logs = logs.filter((l) => l.client_id === filters.client_id);
    }
    if (filters?.project_id) {
      logs = logs.filter((l) => l.project_id === filters.project_id);
    }
    if (filters?.start_date) {
      logs = logs.filter((l) => new Date(l.created_at) >= new Date(filters.start_date!));
    }
    if (filters?.end_date) {
      logs = logs.filter((l) => new Date(l.created_at) <= new Date(filters.end_date!));
    }

    // Sort by created_at descending
    logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Add joined data
    return logs.map((l) => ({
      ...l,
      client: l.client_id ? this.getClient(l.client_id) : undefined,
      project: l.project_id ? this.projects.find((p) => p.id === l.project_id) : undefined,
    }));
  }

  createWorkLog(data: {
    description: string;
    duration_minutes: number;
    project_id?: string;
    client_id?: string;
    source?: WorkLog['source'];
  }): WorkLog {
    const classification = classifyWork(data.description);
    const hourlyRate = this.organization.global_hourly_cost;
    const costImpact = calculateCostImpact(data.duration_minutes, hourlyRate);

    const workLog: WorkLog = {
      id: generateId(),
      organization_id: this.organization.id,
      project_id: data.project_id || null,
      client_id: data.client_id || null,
      user_id: null,
      description: data.description,
      duration_minutes: data.duration_minutes,
      hourly_rate: hourlyRate,
      cost_impact: costImpact,
      category: classification.category,
      burn_reason: classification.burn_reason,
      source: data.source || 'manual',
      source_id: null,
      metadata: { confidence: classification.confidence, reasoning: classification.reasoning },
      created_at: new Date().toISOString(),
      classified_at: new Date().toISOString(),
    };

    this.workLogs.unshift(workLog);

    // Update accumulated burn if it's margin burn
    if (workLog.category === 'margin_burn' && workLog.client_id) {
      const client = this.clients.find((c) => c.id === workLog.client_id);
      if (client) {
        client.accumulated_burn_total += costImpact;
      }
    }

    return {
      ...workLog,
      client: workLog.client_id ? this.getClient(workLog.client_id) : undefined,
      project: workLog.project_id ? this.projects.find((p) => p.id === workLog.project_id) : undefined,
    };
  }

  reclassifyWorkLog(id: string, category: WorkCategory, burn_reason?: BurnReason): WorkLog | undefined {
    const log = this.workLogs.find((l) => l.id === id);
    if (log) {
      log.category = category;
      log.burn_reason = burn_reason || null;
      log.classified_at = new Date().toISOString();
    }
    return log;
  }

  // Scope Requests
  getScopeRequests(status?: ScopeRequest['status']): ScopeRequest[] {
    let requests = [...this.scopeRequests];
    if (status) {
      requests = requests.filter((r) => r.status === status);
    }
    return requests.map((r) => ({
      ...r,
      client: r.client_id ? this.getClient(r.client_id) : undefined,
      project: r.project_id ? this.projects.find((p) => p.id === r.project_id) : undefined,
    }));
  }

  resolveScopeRequest(id: string, resolution: 'accepted_burn' | 'converted_revenue' | 'rejected'): ScopeRequest | undefined {
    const request = this.scopeRequests.find((r) => r.id === id);
    if (request) {
      request.status = resolution;
      request.resolved_at = new Date().toISOString();

      // If accepted as burn, create a work log
      if (resolution === 'accepted_burn' && request.estimated_hours) {
        this.createWorkLog({
          description: `[SCOPE CREEP] ${request.title}`,
          duration_minutes: request.estimated_hours * 60,
          project_id: request.project_id || undefined,
          client_id: request.client_id || undefined,
        });
      }
    }
    return request;
  }

  createScopeRequest(data: {
    title: string;
    description: string;
    client_id?: string;
    project_id?: string;
    estimated_hours?: number;
  }): ScopeRequest {
    const request: ScopeRequest = {
      id: generateId(),
      organization_id: this.organization.id,
      client_id: data.client_id || null,
      project_id: data.project_id || null,
      title: data.title,
      description: data.description,
      estimated_hours: data.estimated_hours || null,
      estimated_cost: data.estimated_hours ? data.estimated_hours * this.organization.global_hourly_cost : null,
      status: 'pending',
      source: 'manual',
      source_id: null,
      created_at: new Date().toISOString(),
      resolved_at: null,
      resolved_by: null,
    };
    this.scopeRequests.unshift(request);
    return request;
  }

  // Metrics
  getMetrics(periodDays = 7): {
    total_revenue_secure: number;
    total_margin_burn: number;
    burn_ratio: number;
    scope_requests_pending: number;
    scope_requests_value: number;
  } {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);

    const periodLogs = this.workLogs.filter((l) => new Date(l.created_at) >= cutoff);

    const billable = periodLogs.filter((l) => l.category === 'billable');
    const burn = periodLogs.filter((l) => l.category === 'margin_burn' || l.category === 'scope_risk');

    const total_revenue_secure = billable.reduce((sum, l) => sum + l.cost_impact, 0);
    const total_margin_burn = burn.reduce((sum, l) => sum + l.cost_impact, 0);
    const total = total_revenue_secure + total_margin_burn;

    const pendingRequests = this.scopeRequests.filter((r) => r.status === 'pending');

    return {
      total_revenue_secure,
      total_margin_burn,
      burn_ratio: total > 0 ? (total_margin_burn / total) * 100 : 0,
      scope_requests_pending: pendingRequests.length,
      scope_requests_value: pendingRequests.reduce((sum, r) => sum + (r.estimated_cost || 0), 0),
    };
  }

  getBurnByCategory(periodDays = 7): { category: BurnReason; total: number; count: number }[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);

    const burnLogs = this.workLogs.filter(
      (l) =>
        (l.category === 'margin_burn' || l.category === 'scope_risk') &&
        new Date(l.created_at) >= cutoff &&
        l.burn_reason
    );

    const grouped = new Map<BurnReason, { total: number; count: number }>();

    for (const log of burnLogs) {
      const reason = log.burn_reason!;
      const current = grouped.get(reason) || { total: 0, count: 0 };
      current.total += log.cost_impact;
      current.count += 1;
      grouped.set(reason, current);
    }

    return Array.from(grouped.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.total - a.total);
  }

  getBurnByClient(periodDays = 7): { client_id: string; client_name: string; total_burn: number; total_billable: number }[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);

    const periodLogs = this.workLogs.filter((l) => new Date(l.created_at) >= cutoff && l.client_id);

    const grouped = new Map<string, { burn: number; billable: number }>();

    for (const log of periodLogs) {
      const clientId = log.client_id!;
      const current = grouped.get(clientId) || { burn: 0, billable: 0 };
      if (log.category === 'margin_burn' || log.category === 'scope_risk') {
        current.burn += log.cost_impact;
      } else if (log.category === 'billable') {
        current.billable += log.cost_impact;
      }
      grouped.set(clientId, current);
    }

    return Array.from(grouped.entries())
      .map(([client_id, data]) => ({
        client_id,
        client_name: this.getClient(client_id)?.name || 'Unknown',
        total_burn: data.burn,
        total_billable: data.billable,
      }))
      .sort((a, b) => b.total_burn - a.total_burn);
  }

  getHallOfShame(limit = 5): WorkLog[] {
    return this.workLogs
      .filter((l) => l.category === 'margin_burn' || l.category === 'scope_risk')
      .sort((a, b) => b.cost_impact - a.cost_impact)
      .slice(0, limit)
      .map((l) => ({
        ...l,
        client: l.client_id ? this.getClient(l.client_id) : undefined,
        project: l.project_id ? this.projects.find((p) => p.id === l.project_id) : undefined,
      }));
  }

  // ============================================
  // V2 FEATURES - Command Center & Agents
  // ============================================

  getCommandCenterMetrics(periodDays = 7): {
    billable_ratio: number;
    billable_ratio_trend: 'up' | 'down' | 'stable';
    at_risk_revenue: number;
    ai_hours_saved: number;
    efficiency_score: number;
    revenue_secure_delta: number;
    margin_burn_delta: number;
    active_alerts: number;
    critical_alerts: number;
    healthy_clients: number;
    at_risk_clients: number;
    total_clients: number;
  } {
    const metrics = this.getMetrics(periodDays);
    const prevMetrics = this.getMetrics(periodDays * 2);
    
    const billable_ratio = metrics.total_revenue_secure / 
      (metrics.total_revenue_secure + metrics.total_margin_burn) * 100 || 0;
    
    const prevBillableRatio = prevMetrics.total_revenue_secure / 
      (prevMetrics.total_revenue_secure + prevMetrics.total_margin_burn) * 100 || 0;
    
    // Calculate at-risk revenue from underwater projects + pending scope
    const underwaterProjects = this.projects.filter(p => p.margin_health === 'underwater' || p.margin_health === 'critical');
    const projectAtRisk = underwaterProjects.reduce((sum, p) => sum + Math.max(0, p.current_spend - p.total_budget), 0);
    const at_risk_revenue = projectAtRisk + metrics.scope_requests_value;
    
    // Simulated AI hours saved (in real app, track from classification automation)
    const ai_hours_saved = Math.round(this.workLogs.length * 0.15 * 10) / 10; // ~0.15 hours per log
    
    // Efficiency score (billable ratio weighted heavily)
    const efficiency_score = Math.min(100, Math.round(billable_ratio * 1.2));
    
    // Client health analysis
    const clientHealth = this.getClientHealthMetrics();
    const healthy_clients = clientHealth.filter(c => c.health === 'excellent' || c.health === 'good').length;
    const at_risk_clients = clientHealth.filter(c => c.health === 'warning' || c.health === 'critical').length;
    
    // Alerts
    const alerts = this.getMarginAlerts();
    
    return {
      billable_ratio,
      billable_ratio_trend: billable_ratio > prevBillableRatio + 2 ? 'up' : 
                           billable_ratio < prevBillableRatio - 2 ? 'down' : 'stable',
      at_risk_revenue,
      ai_hours_saved,
      efficiency_score,
      revenue_secure_delta: metrics.total_revenue_secure - (prevMetrics.total_revenue_secure / 2),
      margin_burn_delta: metrics.total_margin_burn - (prevMetrics.total_margin_burn / 2),
      active_alerts: alerts.filter(a => !a.resolved_at).length,
      critical_alerts: alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length,
      healthy_clients,
      at_risk_clients,
      total_clients: this.clients.length,
    };
  }

  getClientHealthMetrics(): Array<{
    client_id: string;
    client_name: string;
    health: 'excellent' | 'good' | 'warning' | 'critical';
    sentiment: 'happy' | 'neutral' | 'concerned' | 'at_risk';
    total_revenue: number;
    total_burn: number;
    margin_percentage: number;
    retainer_utilization: number | null;
    pending_scope_requests: number;
    risk_score: number;
    margin_trend: 'improving' | 'stable' | 'declining';
  }> {
    return this.clients.map(client => {
      const clientLogs = this.workLogs.filter(l => l.client_id === client.id);
      const billableLogs = clientLogs.filter(l => l.category === 'billable');
      const burnLogs = clientLogs.filter(l => l.category === 'margin_burn' || l.category === 'scope_risk');
      
      const total_revenue = billableLogs.reduce((sum, l) => sum + l.cost_impact, 0);
      const total_burn = burnLogs.reduce((sum, l) => sum + l.cost_impact, 0);
      const total = total_revenue + total_burn;
      const margin_percentage = total > 0 ? (total_revenue / total) * 100 : 100;
      
      const retainer_utilization = client.retainer_value 
        ? Math.min(100, (total / client.retainer_value) * 100) 
        : null;
      
      const pending_scope_requests = this.scopeRequests.filter(
        r => r.client_id === client.id && r.status === 'pending'
      ).length;
      
      // Risk score calculation
      let risk_score = 0;
      if (margin_percentage < 60) risk_score += 30;
      else if (margin_percentage < 75) risk_score += 15;
      if (pending_scope_requests > 2) risk_score += 25;
      else if (pending_scope_requests > 0) risk_score += 10;
      if (total_burn > total_revenue) risk_score += 30;
      if (retainer_utilization && retainer_utilization > 90) risk_score += 15;
      
      // Health determination
      let health: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent';
      if (risk_score >= 50) health = 'critical';
      else if (risk_score >= 30) health = 'warning';
      else if (risk_score >= 15) health = 'good';
      
      // Sentiment (simulated - would come from communication analysis)
      let sentiment: 'happy' | 'neutral' | 'concerned' | 'at_risk' = 'neutral';
      if (health === 'excellent' && pending_scope_requests === 0) sentiment = 'happy';
      else if (health === 'critical') sentiment = 'at_risk';
      else if (pending_scope_requests > 1) sentiment = 'concerned';
      
      return {
        client_id: client.id,
        client_name: client.name,
        health,
        sentiment,
        total_revenue,
        total_burn,
        margin_percentage,
        retainer_utilization,
        pending_scope_requests,
        risk_score,
        margin_trend: margin_percentage > 70 ? 'improving' : margin_percentage > 50 ? 'stable' : 'declining',
      };
    });
  }

  getMarginAlerts(): Array<{
    id: string;
    type: string;
    severity: 'info' | 'warning' | 'critical' | 'emergency';
    title: string;
    description: string;
    impact_amount: number;
    client_id?: string;
    project_id?: string;
    created_at: string;
    resolved_at?: string;
    suggested_action?: string;
  }> {
    const alerts: Array<{
      id: string;
      type: string;
      severity: 'info' | 'warning' | 'critical' | 'emergency';
      title: string;
      description: string;
      impact_amount: number;
      client_id?: string;
      project_id?: string;
      created_at: string;
      resolved_at?: string;
      suggested_action?: string;
    }> = [];
    
    // Check for underwater projects
    for (const project of this.projects) {
      if (project.margin_health === 'underwater') {
        const overrun = project.current_spend - project.total_budget;
        alerts.push({
          id: `alert-project-${project.id}`,
          type: 'project_overrun',
          severity: 'critical',
          title: `${project.name} is ${Math.round((project.current_spend / project.total_budget) * 100)}% of budget`,
          description: `Project has exceeded budget by $${overrun.toLocaleString()}`,
          impact_amount: overrun,
          project_id: project.id,
          client_id: project.client_id,
          created_at: new Date().toISOString(),
          suggested_action: 'Review scope and renegotiate with client',
        });
      } else if (project.margin_health === 'warning') {
        alerts.push({
          id: `alert-warning-${project.id}`,
          type: 'margin_threshold',
          severity: 'warning',
          title: `${project.name} approaching budget limit`,
          description: `Project is at ${Math.round((project.current_spend / project.total_budget) * 100)}% of budget`,
          impact_amount: project.total_budget - project.current_spend,
          project_id: project.id,
          client_id: project.client_id,
          created_at: new Date().toISOString(),
          suggested_action: 'Monitor closely and plan remaining work',
        });
      }
    }
    
    // Check for clients with multiple scope requests
    const scopeByClient = new Map<string, number>();
    for (const req of this.scopeRequests.filter(r => r.status === 'pending')) {
      if (req.client_id) {
        scopeByClient.set(req.client_id, (scopeByClient.get(req.client_id) || 0) + 1);
      }
    }
    
    for (const [clientId, count] of scopeByClient.entries()) {
      if (count >= 2) {
        const client = this.getClient(clientId);
        const totalValue = this.scopeRequests
          .filter(r => r.client_id === clientId && r.status === 'pending')
          .reduce((sum, r) => sum + (r.estimated_cost || 0), 0);
        
        alerts.push({
          id: `alert-scope-${clientId}`,
          type: 'scope_creep_pattern',
          severity: count >= 3 ? 'critical' : 'warning',
          title: `${client?.name}: ${count} pending scope requests`,
          description: `Total at-risk value: $${totalValue.toLocaleString()}`,
          impact_amount: totalValue,
          client_id: clientId,
          created_at: new Date().toISOString(),
          suggested_action: 'Schedule scope review meeting with client',
        });
      }
    }
    
    // Check billable ratio
    const metrics = this.getMetrics(7);
    if (metrics.burn_ratio > 40) {
      alerts.push({
        id: 'alert-efficiency',
        type: 'efficiency_drop',
        severity: metrics.burn_ratio > 50 ? 'critical' : 'warning',
        title: `Billable ratio dropped to ${Math.round(100 - metrics.burn_ratio)}%`,
        description: 'Non-billable work is consuming too much capacity',
        impact_amount: metrics.total_margin_burn,
        created_at: new Date().toISOString(),
        suggested_action: 'Audit recent work logs and reduce overhead',
      });
    }
    
    return alerts.sort((a, b) => {
      const severityOrder = { emergency: 0, critical: 1, warning: 2, info: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  getAgentStatuses(): Array<{
    id: string;
    name: string;
    type: string;
    status: 'active' | 'paused' | 'error';
    last_run: string;
    alerts_generated: number;
    actions_taken: number;
    efficiency_score: number;
  }> {
    // Simulated agent statuses for demo
    return [
      {
        id: 'agent-margin',
        name: 'Margin Defender',
        type: 'margin_defender',
        status: 'active',
        last_run: new Date().toISOString(),
        alerts_generated: this.getMarginAlerts().length,
        actions_taken: 12,
        efficiency_score: 87,
      },
      {
        id: 'agent-intake',
        name: 'Intake Classifier',
        type: 'intake_classifier',
        status: 'active',
        last_run: new Date().toISOString(),
        alerts_generated: 0,
        actions_taken: this.workLogs.length,
        efficiency_score: 94,
      },
      {
        id: 'agent-scope',
        name: 'Scope Sentinel',
        type: 'scope_sentinel',
        status: 'active',
        last_run: new Date().toISOString(),
        alerts_generated: this.scopeRequests.filter(r => r.status === 'pending').length,
        actions_taken: 8,
        efficiency_score: 91,
      },
    ];
  }

  getTrendData(days = 7): Array<{
    date: string;
    revenue_secure: number;
    margin_burn: number;
    billable_ratio: number;
  }> {
    const data: Array<{
      date: string;
      revenue_secure: number;
      margin_burn: number;
      billable_ratio: number;
    }> = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = this.workLogs.filter(l => 
        l.created_at.startsWith(dateStr)
      );
      
      const revenue_secure = dayLogs
        .filter(l => l.category === 'billable')
        .reduce((sum, l) => sum + l.cost_impact, 0);
      
      const margin_burn = dayLogs
        .filter(l => l.category === 'margin_burn' || l.category === 'scope_risk')
        .reduce((sum, l) => sum + l.cost_impact, 0);
      
      const total = revenue_secure + margin_burn;
      
      data.push({
        date: dateStr,
        revenue_secure,
        margin_burn,
        billable_ratio: total > 0 ? (revenue_secure / total) * 100 : 100,
      });
    }
    
    return data;
  }

  // Reset to demo data
  reset(): void {
    this.organization = { ...DEMO_ORG };
    this.clients = [...DEMO_CLIENTS];
    this.projects = [...DEMO_PROJECTS];
    this.workLogs = [...DEMO_WORK_LOGS];
    this.scopeRequests = [...DEMO_SCOPE_REQUESTS];
  }
}

// Singleton instance
export const dataStore = new MockDataStore();
