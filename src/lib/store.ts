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
