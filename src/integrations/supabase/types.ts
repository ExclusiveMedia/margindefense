/**
 * Supabase Database Types
 * Auto-generated from schema - update when schema changes
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type WorkCategory = 'billable' | 'margin_burn' | 'scope_risk' | 'unclassified';
export type BurnReason = 'scope_creep' | 'internal_meeting' | 'rework' | 'admin' | 'communication' | 'planning' | 'research' | 'setup' | 'other';
export type MarginHealth = 'healthy' | 'warning' | 'critical' | 'underwater';
export type ProjectStatus = 'active' | 'completed' | 'on_hold';
export type ScopeRequestStatus = 'pending' | 'accepted_burn' | 'converted_revenue' | 'rejected';
export type DataSource = 'manual' | 'slack' | 'jira' | 'email' | 'csv' | 'webhook';

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          currency_symbol: string;
          global_hourly_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          currency_symbol?: string;
          global_hourly_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          currency_symbol?: string;
          global_hourly_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          organization_id: string | null;
          full_name: string | null;
          avatar_url: string | null;
          hourly_rate: number | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          organization_id?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          hourly_rate?: number | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          hourly_rate?: number | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          email: string | null;
          retainer_value: number | null;
          accumulated_burn_total: number;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          email?: string | null;
          retainer_value?: number | null;
          accumulated_burn_total?: number;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          email?: string | null;
          retainer_value?: number | null;
          accumulated_burn_total?: number;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          client_id: string;
          name: string;
          description: string | null;
          total_budget: number;
          current_spend: number;
          margin_health: MarginHealth;
          status: ProjectStatus;
          start_date: string | null;
          end_date: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          client_id: string;
          name: string;
          description?: string | null;
          total_budget?: number;
          current_spend?: number;
          margin_health?: MarginHealth;
          status?: ProjectStatus;
          start_date?: string | null;
          end_date?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          client_id?: string;
          name?: string;
          description?: string | null;
          total_budget?: number;
          current_spend?: number;
          margin_health?: MarginHealth;
          status?: ProjectStatus;
          start_date?: string | null;
          end_date?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      work_logs: {
        Row: {
          id: string;
          organization_id: string;
          project_id: string | null;
          client_id: string | null;
          user_id: string | null;
          description: string;
          duration_minutes: number;
          hourly_rate: number;
          cost_impact: number;
          category: WorkCategory;
          burn_reason: BurnReason | null;
          confidence: number | null;
          reasoning: string | null;
          source: DataSource;
          source_id: string | null;
          source_url: string | null;
          metadata: Json | null;
          created_at: string;
          classified_at: string | null;
          reclassified_by: string | null;
          reclassified_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          project_id?: string | null;
          client_id?: string | null;
          user_id?: string | null;
          description: string;
          duration_minutes: number;
          hourly_rate: number;
          cost_impact?: number;
          category?: WorkCategory;
          burn_reason?: BurnReason | null;
          confidence?: number | null;
          reasoning?: string | null;
          source?: DataSource;
          source_id?: string | null;
          source_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
          classified_at?: string | null;
          reclassified_by?: string | null;
          reclassified_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          project_id?: string | null;
          client_id?: string | null;
          user_id?: string | null;
          description?: string;
          duration_minutes?: number;
          hourly_rate?: number;
          cost_impact?: number;
          category?: WorkCategory;
          burn_reason?: BurnReason | null;
          confidence?: number | null;
          reasoning?: string | null;
          source?: DataSource;
          source_id?: string | null;
          source_url?: string | null;
          metadata?: Json | null;
          created_at?: string;
          classified_at?: string | null;
          reclassified_by?: string | null;
          reclassified_at?: string | null;
        };
      };
      scope_requests: {
        Row: {
          id: string;
          organization_id: string;
          client_id: string | null;
          project_id: string | null;
          title: string;
          description: string | null;
          estimated_hours: number | null;
          estimated_cost: number | null;
          status: ScopeRequestStatus;
          source: DataSource;
          source_id: string | null;
          source_url: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          resolution_notes: string | null;
          converted_invoice_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          client_id?: string | null;
          project_id?: string | null;
          title: string;
          description?: string | null;
          estimated_hours?: number | null;
          estimated_cost?: number | null;
          status?: ScopeRequestStatus;
          source?: DataSource;
          source_id?: string | null;
          source_url?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          resolution_notes?: string | null;
          converted_invoice_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          client_id?: string | null;
          project_id?: string | null;
          title?: string;
          description?: string | null;
          estimated_hours?: number | null;
          estimated_cost?: number | null;
          status?: ScopeRequestStatus;
          source?: DataSource;
          source_id?: string | null;
          source_url?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          resolution_notes?: string | null;
          converted_invoice_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      integrations: {
        Row: {
          id: string;
          organization_id: string;
          type: string;
          name: string;
          config: Json;
          is_active: boolean;
          last_sync_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          type: string;
          name: string;
          config?: Json;
          is_active?: boolean;
          last_sync_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          type?: string;
          name?: string;
          config?: Json;
          is_active?: boolean;
          last_sync_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      webhook_events: {
        Row: {
          id: string;
          organization_id: string;
          integration_id: string | null;
          event_type: string;
          payload: Json;
          processed: boolean;
          processed_at: string | null;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          integration_id?: string | null;
          event_type: string;
          payload: Json;
          processed?: boolean;
          processed_at?: string | null;
          error?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          integration_id?: string | null;
          event_type?: string;
          payload?: Json;
          processed?: boolean;
          processed_at?: string | null;
          error?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      v_burn_metrics: {
        Row: {
          organization_id: string;
          date: string;
          revenue_secure: number;
          margin_burn: number;
          billable_count: number;
          burn_count: number;
        };
      };
      v_burn_by_category: {
        Row: {
          organization_id: string;
          burn_reason: BurnReason;
          total_cost: number;
          count: number;
        };
      };
      v_burn_by_client: {
        Row: {
          organization_id: string;
          client_id: string;
          client_name: string;
          total_burn: number;
          total_billable: number;
        };
      };
    };
    Functions: {};
    Enums: {
      work_category: WorkCategory;
      burn_reason: BurnReason;
      margin_health: MarginHealth;
      project_status: ProjectStatus;
      scope_request_status: ScopeRequestStatus;
      data_source: DataSource;
    };
  };
}

// Helper types for easier use
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type WorkLog = Database['public']['Tables']['work_logs']['Row'];
export type ScopeRequest = Database['public']['Tables']['scope_requests']['Row'];
export type Integration = Database['public']['Tables']['integrations']['Row'];

// Insert types
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type WorkLogInsert = Database['public']['Tables']['work_logs']['Insert'];
export type ScopeRequestInsert = Database['public']['Tables']['scope_requests']['Insert'];

// Update types
export type OrganizationUpdate = Database['public']['Tables']['organizations']['Update'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
export type WorkLogUpdate = Database['public']['Tables']['work_logs']['Update'];
export type ScopeRequestUpdate = Database['public']['Tables']['scope_requests']['Update'];
