-- ============================================
-- MarginDefense.ai Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE work_category AS ENUM (
  'billable',
  'margin_burn',
  'scope_risk',
  'unclassified'
);

CREATE TYPE burn_reason AS ENUM (
  'scope_creep',
  'internal_meeting',
  'rework',
  'admin',
  'communication',
  'planning',
  'research',
  'setup',
  'other'
);

CREATE TYPE margin_health AS ENUM (
  'healthy',
  'warning',
  'critical',
  'underwater'
);

CREATE TYPE project_status AS ENUM (
  'active',
  'completed',
  'on_hold'
);

CREATE TYPE scope_request_status AS ENUM (
  'pending',
  'accepted_burn',
  'converted_revenue',
  'rejected'
);

CREATE TYPE data_source AS ENUM (
  'manual',
  'slack',
  'jira',
  'email',
  'csv',
  'webhook'
);

-- ============================================
-- ORGANIZATIONS
-- ============================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  currency_symbol TEXT NOT NULL DEFAULT '$',
  global_hourly_cost DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  full_name TEXT,
  avatar_url TEXT,
  hourly_rate DECIMAL(10,2), -- Override org rate if set
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CLIENTS
-- ============================================

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  retainer_value DECIMAL(12,2),
  accumulated_burn_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_org ON clients(organization_id);

-- ============================================
-- PROJECTS
-- ============================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  current_spend DECIMAL(12,2) NOT NULL DEFAULT 0,
  margin_health margin_health NOT NULL DEFAULT 'healthy',
  status project_status NOT NULL DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);

-- ============================================
-- WORK LOGS (The Core Table)
-- ============================================

CREATE TABLE work_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Core data
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  hourly_rate DECIMAL(10,2) NOT NULL,
  cost_impact DECIMAL(12,2) NOT NULL, -- Calculated: (duration_minutes / 60) * hourly_rate
  
  -- Classification
  category work_category NOT NULL DEFAULT 'unclassified',
  burn_reason burn_reason,
  confidence DECIMAL(3,2), -- AI confidence 0.00-1.00
  reasoning TEXT, -- AI explanation
  
  -- Source tracking
  source data_source NOT NULL DEFAULT 'manual',
  source_id TEXT, -- External ID from integration
  source_url TEXT, -- Link back to source (Slack message, Jira ticket, etc.)
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  classified_at TIMESTAMPTZ,
  
  -- For manual reclassification
  reclassified_by UUID REFERENCES profiles(id),
  reclassified_at TIMESTAMPTZ
);

CREATE INDEX idx_work_logs_org ON work_logs(organization_id);
CREATE INDEX idx_work_logs_project ON work_logs(project_id);
CREATE INDEX idx_work_logs_client ON work_logs(client_id);
CREATE INDEX idx_work_logs_category ON work_logs(category);
CREATE INDEX idx_work_logs_created ON work_logs(created_at DESC);
CREATE INDEX idx_work_logs_source ON work_logs(source, source_id);

-- ============================================
-- SCOPE REQUESTS (Scope Shield)
-- ============================================

CREATE TABLE scope_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  -- Request details
  title TEXT NOT NULL,
  description TEXT,
  estimated_hours DECIMAL(10,2),
  estimated_cost DECIMAL(12,2), -- Calculated or manual
  
  -- Status
  status scope_request_status NOT NULL DEFAULT 'pending',
  
  -- Source
  source data_source NOT NULL DEFAULT 'manual',
  source_id TEXT,
  source_url TEXT,
  
  -- Resolution
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  resolution_notes TEXT,
  
  -- If converted to revenue, link to created invoice/quote
  converted_invoice_id TEXT,
  
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scope_requests_org ON scope_requests(organization_id);
CREATE INDEX idx_scope_requests_status ON scope_requests(status);
CREATE INDEX idx_scope_requests_client ON scope_requests(client_id);

-- ============================================
-- INTEGRATION CONFIGS
-- ============================================

CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'slack', 'jira', 'email', etc.
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}', -- Encrypted credentials, settings
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(organization_id, type)
);

-- ============================================
-- WEBHOOK EVENTS (Audit Log)
-- ============================================

CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES integrations(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_org ON webhook_events(organization_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate cost impact
CREATE OR REPLACE FUNCTION calculate_cost_impact()
RETURNS TRIGGER AS $$
BEGIN
  NEW.cost_impact = (NEW.duration_minutes::DECIMAL / 60) * NEW.hourly_rate;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update project margin health
CREATE OR REPLACE FUNCTION update_project_health()
RETURNS TRIGGER AS $$
DECLARE
  project_record RECORD;
  spend_ratio DECIMAL;
BEGIN
  -- Get current project spend
  SELECT 
    p.id,
    p.total_budget,
    COALESCE(SUM(w.cost_impact), 0) as total_spend
  INTO project_record
  FROM projects p
  LEFT JOIN work_logs w ON w.project_id = p.id
  WHERE p.id = COALESCE(NEW.project_id, OLD.project_id)
  GROUP BY p.id, p.total_budget;
  
  IF project_record.id IS NOT NULL AND project_record.total_budget > 0 THEN
    spend_ratio = project_record.total_spend / project_record.total_budget;
    
    UPDATE projects SET
      current_spend = project_record.total_spend,
      margin_health = CASE
        WHEN spend_ratio >= 1.0 THEN 'underwater'::margin_health
        WHEN spend_ratio >= 0.9 THEN 'critical'::margin_health
        WHEN spend_ratio >= 0.75 THEN 'warning'::margin_health
        ELSE 'healthy'::margin_health
      END,
      updated_at = NOW()
    WHERE id = project_record.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update client accumulated burn
CREATE OR REPLACE FUNCTION update_client_burn()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.client_id IS NOT NULL AND NEW.category IN ('margin_burn', 'scope_risk') THEN
    UPDATE clients SET
      accumulated_burn_total = (
        SELECT COALESCE(SUM(cost_impact), 0)
        FROM work_logs
        WHERE client_id = NEW.client_id
        AND category IN ('margin_burn', 'scope_risk')
      ),
      updated_at = NOW()
    WHERE id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated_at triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Work log triggers
CREATE TRIGGER calculate_work_log_cost
  BEFORE INSERT OR UPDATE ON work_logs
  FOR EACH ROW EXECUTE FUNCTION calculate_cost_impact();

CREATE TRIGGER update_project_on_work_log
  AFTER INSERT OR UPDATE OR DELETE ON work_logs
  FOR EACH ROW EXECUTE FUNCTION update_project_health();

CREATE TRIGGER update_client_on_work_log
  AFTER INSERT OR UPDATE ON work_logs
  FOR EACH ROW EXECUTE FUNCTION update_client_burn();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scope_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own org
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org owners can update organization"
  ON organizations FOR UPDATE
  USING (id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Profiles: Users can view org members, update own profile
CREATE POLICY "Users can view org members"
  ON profiles FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Clients: Org members can CRUD
CREATE POLICY "Org members can view clients"
  ON clients FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org members can insert clients"
  ON clients FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org members can update clients"
  ON clients FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org admins can delete clients"
  ON clients FOR DELETE
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Projects: Org members can CRUD
CREATE POLICY "Org members can view projects"
  ON projects FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org members can insert projects"
  ON projects FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org members can update projects"
  ON projects FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org admins can delete projects"
  ON projects FOR DELETE
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Work Logs: Org members can CRUD
CREATE POLICY "Org members can view work_logs"
  ON work_logs FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org members can insert work_logs"
  ON work_logs FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org members can update work_logs"
  ON work_logs FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org members can delete work_logs"
  ON work_logs FOR DELETE
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

-- Scope Requests: Org members can CRUD
CREATE POLICY "Org members can view scope_requests"
  ON scope_requests FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org members can insert scope_requests"
  ON scope_requests FOR INSERT
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Org members can update scope_requests"
  ON scope_requests FOR UPDATE
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid()
  ));

-- Integrations: Admins only
CREATE POLICY "Org admins can manage integrations"
  ON integrations FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Webhook Events: Admins only
CREATE POLICY "Org admins can view webhook_events"
  ON webhook_events FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- ============================================
-- VIEWS (For Dashboard Queries)
-- ============================================

-- Burn metrics view
CREATE OR REPLACE VIEW v_burn_metrics AS
SELECT
  w.organization_id,
  DATE_TRUNC('day', w.created_at) as date,
  SUM(CASE WHEN w.category = 'billable' THEN w.cost_impact ELSE 0 END) as revenue_secure,
  SUM(CASE WHEN w.category IN ('margin_burn', 'scope_risk') THEN w.cost_impact ELSE 0 END) as margin_burn,
  COUNT(*) FILTER (WHERE w.category = 'billable') as billable_count,
  COUNT(*) FILTER (WHERE w.category IN ('margin_burn', 'scope_risk')) as burn_count
FROM work_logs w
GROUP BY w.organization_id, DATE_TRUNC('day', w.created_at);

-- Burn by category view
CREATE OR REPLACE VIEW v_burn_by_category AS
SELECT
  w.organization_id,
  w.burn_reason,
  SUM(w.cost_impact) as total_cost,
  COUNT(*) as count
FROM work_logs w
WHERE w.category IN ('margin_burn', 'scope_risk')
AND w.burn_reason IS NOT NULL
GROUP BY w.organization_id, w.burn_reason;

-- Burn by client view
CREATE OR REPLACE VIEW v_burn_by_client AS
SELECT
  w.organization_id,
  w.client_id,
  c.name as client_name,
  SUM(CASE WHEN w.category IN ('margin_burn', 'scope_risk') THEN w.cost_impact ELSE 0 END) as total_burn,
  SUM(CASE WHEN w.category = 'billable' THEN w.cost_impact ELSE 0 END) as total_billable
FROM work_logs w
JOIN clients c ON c.id = w.client_id
GROUP BY w.organization_id, w.client_id, c.name;

-- ============================================
-- SEED DATA (Optional - for demo)
-- ============================================

-- Run this in a separate migration or manually for demo setup
-- See seed_data.sql for demo data
