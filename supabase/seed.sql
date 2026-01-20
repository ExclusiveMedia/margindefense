-- ============================================
-- MarginDefense.ai Seed Data
-- Run AFTER schema.sql
-- ============================================

-- Note: This creates demo data for testing.
-- In production, users create their own org during onboarding.

-- ============================================
-- DEMO ORGANIZATION
-- ============================================

INSERT INTO organizations (id, name, currency_symbol, global_hourly_cost)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Acme Digital Agency',
  '$',
  75.00
);

-- ============================================
-- DEMO CLIENTS
-- ============================================

INSERT INTO clients (id, organization_id, name, retainer_value, accumulated_burn_total) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'TechCorp Industries', 15000, 4200),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'StartupXYZ', 8000, 2800),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Enterprise Solutions Ltd', 25000, 6100);

-- ============================================
-- DEMO PROJECTS
-- ============================================

INSERT INTO projects (id, organization_id, client_id, name, description, total_budget, current_spend, margin_health, status) VALUES
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'Website Redesign',
    'Complete website overhaul with new branding',
    45000,
    38000,
    'warning',
    'active'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000002',
    'Mobile App MVP',
    'iOS and Android app development',
    60000,
    72000,
    'underwater',
    'active'
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000003',
    'CRM Integration',
    'Salesforce integration with custom workflows',
    30000,
    18000,
    'healthy',
    'active'
  );

-- ============================================
-- DEMO WORK LOGS
-- ============================================

INSERT INTO work_logs (
  organization_id, project_id, client_id, description, 
  duration_minutes, hourly_rate, cost_impact, 
  category, burn_reason, source, created_at
) VALUES
  -- Today
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'Weekly team sync meeting - all hands on deck',
    60, 75, 375,
    'margin_burn', 'internal_meeting', 'manual',
    NOW() - INTERVAL '2 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'Designed and delivered homepage mockups to client',
    180, 75, 225,
    'billable', NULL, 'manual',
    NOW() - INTERVAL '4 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0001-000000000002',
    'Debugging login authentication issue - client reported bug',
    120, 75, 150,
    'margin_burn', 'rework', 'manual',
    NOW() - INTERVAL '5 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    NULL,
    NULL,
    'Responding to Slack messages and email backlog',
    90, 75, 112.5,
    'margin_burn', 'communication', 'manual',
    NOW() - INTERVAL '6 hours'
  ),
  -- Yesterday
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0001-000000000003',
    'Client strategy call to discuss Q2 roadmap',
    60, 75, 75,
    'billable', NULL, 'manual',
    NOW() - INTERVAL '1 day'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'Internal brainstorming session for new feature ideas',
    90, 75, 337.5,
    'margin_burn', 'planning', 'manual',
    NOW() - INTERVAL '1 day 2 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0001-000000000002',
    'Built and tested user profile API endpoints',
    240, 75, 300,
    'billable', NULL, 'manual',
    NOW() - INTERVAL '1 day 4 hours'
  ),
  -- 2 days ago
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'Updating Jira tickets and writing status reports',
    60, 75, 75,
    'margin_burn', 'admin', 'manual',
    NOW() - INTERVAL '2 days'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0001-000000000003',
    'Implemented Salesforce webhook integration',
    300, 75, 375,
    'billable', NULL, 'manual',
    NOW() - INTERVAL '2 days 3 hours'
  ),
  -- 3 days ago
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0001-000000000002',
    'Emergency all-hands to discuss project delays',
    120, 75, 600,
    'margin_burn', 'internal_meeting', 'manual',
    NOW() - INTERVAL '3 days'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0001-000000000002',
    'Reworking payment flow due to changed requirements',
    240, 75, 300,
    'margin_burn', 'rework', 'manual',
    NOW() - INTERVAL '3 days 2 hours'
  ),
  -- 4-7 days ago
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'Delivered final brand guidelines document',
    180, 75, 225,
    'billable', NULL, 'manual',
    NOW() - INTERVAL '4 days'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0001-000000000003',
    'Research and learning new Salesforce API features',
    120, 75, 150,
    'margin_burn', 'research', 'manual',
    NOW() - INTERVAL '5 days'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'Setup dev environment for new team member',
    180, 75, 225,
    'margin_burn', 'setup', 'manual',
    NOW() - INTERVAL '6 days'
  );

-- ============================================
-- DEMO SCOPE REQUESTS
-- ============================================

INSERT INTO scope_requests (
  organization_id, client_id, project_id, title, description,
  estimated_hours, estimated_cost, status, source, created_at
) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0002-000000000001',
    'Can you also add a blog section?',
    'Client asked if we could "quickly add" a blog to the website. Not in original scope.',
    40, 3000, 'pending', 'email',
    NOW() - INTERVAL '3 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0002-000000000002',
    'Add dark mode to the app',
    'StartupXYZ wants dark mode. "Should be easy right?" - definitely not in contract.',
    24, 1800, 'pending', 'slack',
    NOW() - INTERVAL '1 day'
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0002-000000000003',
    'Extra reporting dashboard',
    'Enterprise wants custom analytics dashboard. "While you''re in there anyway..."',
    60, 4500, 'pending', 'manual',
    NOW() - INTERVAL '2 days'
  );
