/**
 * Supabase API Functions (Stub for MVP)
 * 
 * Full implementation available in /supabase/api.full.ts
 * These stubs ensure the build passes in demo mode.
 * 
 * To enable Supabase:
 * 1. Set up your Supabase project
 * 2. Run schema.sql and seed.sql  
 * 3. Add env vars to .env
 * 4. Replace this file with api.full.ts
 */

import type { WorkCategory, BurnReason } from './types';

// All API functions are stubs - the app uses mock store in demo mode

export async function getWorkLogs(_filters?: {
  category?: WorkCategory;
  client_id?: string;
  project_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function createWorkLog(_data: {
  description: string;
  duration_minutes: number;
  project_id?: string;
  client_id?: string;
  source?: 'manual' | 'slack' | 'jira' | 'email' | 'csv' | 'webhook';
}) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function reclassifyWorkLog(
  _id: string,
  _category: WorkCategory,
  _burn_reason?: BurnReason
) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function getScopeRequests(_status?: 'pending' | 'accepted_burn' | 'converted_revenue' | 'rejected') {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function createScopeRequest(_data: {
  title: string;
  description?: string;
  client_id?: string;
  project_id?: string;
  estimated_hours?: number;
}) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function resolveScopeRequest(
  _id: string,
  _resolution: 'accepted_burn' | 'converted_revenue' | 'rejected',
  _notes?: string
) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function getMetrics(_periodDays = 7) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function getBurnByCategory(_periodDays = 7) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function getBurnByClient(_periodDays = 7) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function getHallOfShame(_limit = 5) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function getClients() {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function getProjects(_status?: 'active' | 'completed' | 'on_hold') {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function getOrganization() {
  return { data: null, error: new Error('Demo mode - using mock store') };
}

export async function updateOrganization(_updates: {
  name?: string;
  currency_symbol?: string;
  global_hourly_cost?: number;
}) {
  return { data: null, error: new Error('Demo mode - using mock store') };
}
