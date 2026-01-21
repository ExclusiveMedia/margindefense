/**
 * TorqOS Authentication & Authorization Types
 * Three-tier access system: Super Admin, Agency, Client
 */

// User roles in the system
export type UserRole = 'super_admin' | 'agency_owner' | 'agency_member' | 'client_user';

// Access tiers for routing
export type AccessTier = 'admin' | 'agency' | 'client';

// Map roles to their access tier
export const ROLE_TO_TIER: Record<UserRole, AccessTier> = {
  super_admin: 'admin',
  agency_owner: 'agency',
  agency_member: 'agency',
  client_user: 'client',
};

// Permissions by role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'view:all_tenants',
    'manage:all_tenants',
    'view:platform_metrics',
    'manage:billing',
    'impersonate:any_user',
    'manage:feature_flags',
    'view:audit_logs',
    'manage:ai_config',
  ],
  agency_owner: [
    'view:own_clients',
    'manage:own_clients',
    'view:own_projects',
    'manage:own_projects',
    'view:margin_data',
    'manage:team_members',
    'manage:agents',
    'approve:agent_actions',
    'view:reports',
    'export:data',
  ],
  agency_member: [
    'view:own_clients',
    'view:own_projects',
    'manage:assigned_tasks',
    'view:margin_data',
    'log:time',
  ],
  client_user: [
    'view:own_projects',
    'view:deliverables',
    'approve:deliverables',
    'submit:requests',
    'view:own_invoices',
  ],
};

// User interface
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: UserRole;
  tenant_id?: string; // null for super_admin
  client_id?: string; // only for client_user
  created_at: string;
  last_login_at?: string;
}

// Tenant (Agency) interface
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan_id: string;
  subscription_status: 'active' | 'trial' | 'past_due' | 'canceled';
  settings: TenantSettings;
  created_at: string;
  updated_at: string;
}

export interface TenantSettings {
  branding?: {
    logo_url?: string;
    primary_color?: string;
    company_name?: string;
  };
  features?: {
    ai_agents_enabled: boolean;
    client_portal_enabled: boolean;
    white_label_enabled: boolean;
  };
  limits?: {
    max_clients: number;
    max_projects: number;
    max_team_members: number;
  };
}

// Authentication state
export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessTier: AccessTier | null;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Auth response from API
export interface AuthResponse {
  user: User;
  tenant: Tenant | null;
  access_token: string;
  refresh_token: string;
}

// Session info
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Helper functions
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
}

export function canAccessTier(user: User | null, tier: AccessTier): boolean {
  if (!user) return false;
  const userTier = ROLE_TO_TIER[user.role];
  
  // Super admin can access everything
  if (userTier === 'admin') return true;
  
  // Agency can access agency and client tiers
  if (userTier === 'agency' && (tier === 'agency' || tier === 'client')) return true;
  
  // Client can only access client tier
  if (userTier === 'client' && tier === 'client') return true;
  
  return false;
}

export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  return `${user.first_name} ${user.last_name}`.trim() || user.email;
}

export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    agency_owner: 'Agency Owner',
    agency_member: 'Team Member',
    client_user: 'Client',
  };
  return names[role];
}
