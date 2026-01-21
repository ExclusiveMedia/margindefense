/**
 * Client Portal Layout
 * End-client view - project visibility, deliverables, approvals
 */

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  FileCheck,
  MessageSquare,
  Receipt,
  Menu,
  X,
  Briefcase,
  LogOut,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/portal',
    icon: LayoutDashboard,
    description: 'Project summary',
  },
  {
    label: 'Projects',
    href: '/portal/projects',
    icon: FolderOpen,
    description: 'Active projects',
  },
  {
    label: 'Deliverables',
    href: '/portal/deliverables',
    icon: FileCheck,
    description: 'Review & approve',
  },
  {
    label: 'Requests',
    href: '/portal/requests',
    icon: MessageSquare,
    description: 'Submit requests',
  },
  {
    label: 'Billing',
    href: '/portal/billing',
    icon: Receipt,
    description: 'Invoices & payments',
  },
];

export function ClientPortalLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[hsl(var(--md-bg-primary))]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[hsl(var(--md-bg-secondary))] border-r border-[hsl(var(--md-border-subtle))]">
        {/* Logo / Agency Branding */}
        <div className="p-5 border-b border-[hsl(var(--md-border-subtle))]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[hsl(var(--md-text-emphasis))] text-lg">Client Portal</h1>
              <p className="text-[10px] text-[hsl(var(--md-text-muted))]">Acme Agency</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/portal'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm',
                  isActive
                    ? 'bg-blue-500/10 text-blue-500 border-l-2 border-blue-500'
                    : 'text-[hsl(var(--md-text-secondary))] hover:text-[hsl(var(--md-text-emphasis))] hover:bg-[hsl(var(--md-bg-hover))]'
                )
              }
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Role Switcher (Demo) */}
        <div className="p-3 border-t border-[hsl(var(--md-border-subtle))]">
          <p className="text-[10px] text-[hsl(var(--md-text-muted))] uppercase tracking-wider mb-2 px-2">
            Demo: Switch View
          </p>
          <div className="space-y-1">
            <button
              onClick={() => { switchRole('super_admin'); navigate('/admin'); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[hsl(var(--md-text-secondary))] hover:bg-[hsl(var(--md-bg-hover))] rounded-lg transition-colors"
            >
              <span className="w-3.5 h-3.5 rounded bg-red-500/20 text-red-500 text-[8px] font-bold flex items-center justify-center">A</span>
              Super Admin
            </button>
            <button
              onClick={() => { switchRole('agency_owner'); navigate('/'); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[hsl(var(--md-text-secondary))] hover:bg-[hsl(var(--md-bg-hover))] rounded-lg transition-colors"
            >
              <span className="w-3.5 h-3.5 rounded bg-violet-500/20 text-violet-500 text-[8px] font-bold flex items-center justify-center">S</span>
              Agency Dashboard
            </button>
          </div>
        </div>

        {/* Theme & User */}
        <div className="p-3 border-t border-[hsl(var(--md-border-subtle))]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[hsl(var(--md-text-muted))]">Theme</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[hsl(var(--md-bg-elevated))]">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-500">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(var(--md-text-emphasis))] truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-[hsl(var(--md-text-muted))] truncate">Client</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-[hsl(var(--md-text-muted))] hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--md-bg-secondary))] border-b border-[hsl(var(--md-border-subtle))]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[hsl(var(--md-text-emphasis))]">Client Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-[hsl(var(--md-text-secondary))]">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[hsl(var(--md-text-secondary))]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="lg:hidden fixed inset-0 z-40 bg-[hsl(var(--md-bg-primary))] pt-16"
          >
            <nav className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                      isActive
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'text-[hsl(var(--md-text-secondary))]'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-0 overflow-x-hidden">
        <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ClientPortalLayout;
