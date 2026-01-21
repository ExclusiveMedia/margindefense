/**
 * TorqOS - AI Operating System for Business
 * 
 * Three-Tier Access System:
 * 1. Super Admin (/admin/*) - Platform owner
 * 2. Agency (/*) - SaaS users managing clients
 * 3. Client Portal (/portal/*) - End clients
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Layouts
import { AgencyLayout } from '@/layouts/AgencyLayout';
import { SuperAdminLayout } from '@/layouts/SuperAdminLayout';
import { ClientPortalLayout } from '@/layouts/ClientPortalLayout';

// Agency Pages (existing)
import { DashboardPage } from '@/pages/DashboardPage';
import { ScopeShieldPage } from '@/pages/ScopeShieldPage';
import { LeakagePage } from '@/pages/LeakagePage';
import { SettingsPage } from '@/pages/SettingsPage';

// Super Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminTenantsPage } from '@/pages/admin/AdminTenantsPage';

// Client Portal Pages
import { ClientOverviewPage } from '@/pages/portal/ClientOverviewPage';

// Placeholder pages for features not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="text-xl font-bold text-[hsl(var(--md-text-emphasis))] mb-2">{title}</h1>
      <p className="text-sm text-[hsl(var(--md-text-muted))] max-w-md">
        This feature is coming soon. Check back later for updates.
      </p>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ================================================
                SUPER ADMIN ROUTES (/admin/*)
                Platform owner - manages all tenants
                ================================================ */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoles={['super_admin']}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="tenants" element={<AdminTenantsPage />} />
              <Route path="billing" element={<PlaceholderPage title="Billing Center" />} />
              <Route path="ai-ops" element={<PlaceholderPage title="AI Operations" />} />
              <Route path="settings" element={<PlaceholderPage title="System Configuration" />} />
            </Route>

            {/* ================================================
                CLIENT PORTAL ROUTES (/portal/*)
                End clients - view projects and deliverables
                ================================================ */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute requiredRoles={['client_user', 'super_admin']}>
                  <ClientPortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ClientOverviewPage />} />
              <Route path="projects" element={<PlaceholderPage title="My Projects" />} />
              <Route path="deliverables" element={<PlaceholderPage title="Deliverables" />} />
              <Route path="requests" element={<PlaceholderPage title="Requests" />} />
              <Route path="billing" element={<PlaceholderPage title="Billing & Invoices" />} />
            </Route>

            {/* ================================================
                AGENCY ROUTES (/* - Default)
                SaaS users - manage clients and projects
                ================================================ */}
            <Route
              path="/"
              element={
                <ProtectedRoute requiredRoles={['agency_owner', 'agency_member', 'super_admin']}>
                  <AgencyLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="clients" element={<PlaceholderPage title="Client Management" />} />
              <Route path="projects" element={<PlaceholderPage title="Project Execution" />} />
              <Route path="scope-shield" element={<ScopeShieldPage />} />
              <Route path="leakage" element={<LeakagePage />} />
              <Route path="agents" element={<PlaceholderPage title="AI Agent Control" />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
