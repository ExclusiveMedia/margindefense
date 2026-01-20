/**
 * Supabase Client Configuration
 * 
 * NOTE: Full Supabase integration is prepared but commented.
 * For MVP, the app runs in demo mode with mock data.
 * To enable Supabase:
 * 1. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env
 * 2. Run the schema.sql and seed.sql in Supabase
 * 3. Enable the Supabase code below
 */

// Supabase is disabled for MVP - using mock store
export const supabase = null;

/**
 * Check if Supabase is configured
 * Always returns false for MVP - using demo mode
 */
export function isSupabaseConfigured(): boolean {
  return false;
}

/**
 * Get the typed Supabase client (throws if not configured)
 */
export function getSupabase(): never {
  throw new Error('Supabase not configured - using demo mode');
}

/**
 * Get current user's organization ID
 */
export async function getCurrentOrganizationId(): Promise<string | null> {
  return null;
}

/* 
// ============================================
// FULL SUPABASE IMPLEMENTATION (Enable for production)
// ============================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = supabaseClient;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

export function getSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }
  return supabase;
}

export async function getCurrentOrganizationId(): Promise<string | null> {
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();
  
  return profile?.organization_id || null;
}
*/
