/**
 * Super Admin Layout
 * Platform owner view - manages all tenants, billing, system config
 */

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Bot,
  Settings,
  Menu,
  X,
  Shield,
  Users,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  {
    label: 'Platform Overview',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'System health & metrics',
  },
  {
    label: 'Tenant Management',
    href: '/admin/tenants',
    icon: Building2,
    description: 'Manage all agencies',
  },
  {
    label: 'Billing Center',
    href: '/admin/billing',
    icon: CreditCard,
    description: 'Subscriptions & revenue',
  },
  {
    label: 'AI Operations',
    href: '/admin/ai-ops',
    icon: Bot,
    description: 'Agent config & usage',
  },
  {
    label: 'System Config',
    href: '/admin/settings',
    icon: Settings,
    description: 'Feature flags & config',
  },
];

export function SuperAdminLayout() {
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
      <aside className="hidden lg:flex flex-col w-64 bg-[hsl(var(--md-bg-secondary))] border-r border-[hsl(var(--md-border-subtle))]">
        {/* Logo */}
        <div className="p-5 border-b border-[hsl(var(--md-border-subtle))]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[hsl(var(--md-text-emphasis))] text-lg">TorqOS</h1>
              <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm',
                  isActive
                    ? 'bg-red-500/10 text-red-500 border-l-2 border-red-500'
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
              onClick={() => { switchRole('agency_owner'); navigate('/'); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[hsl(var(--md-text-secondary))] hover:bg-[hsl(var(--md-bg-hover))] rounded-lg transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              Agency Dashboard
            </button>
            <button
              onClick={() => { switchRole('client_user'); navigate('/portal'); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[hsl(var(--md-text-secondary))] hover:bg-[hsl(var(--md-bg-hover))] rounded-lg transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              Client Portal
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
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-red-500">SA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(var(--md-text-emphasis))] truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[10px] text-[hsl(var(--md-text-muted))] truncate">{user?.email}</p>
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-[hsl(var(--md-text-emphasis))]">TorqOS</span>
              <span className="ml-2 text-[10px] text-red-500 font-semibold">ADMIN</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[hsl(var(--md-text-secondary))] hover:text-[hsl(var(--md-text-emphasis))]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
                        ? 'bg-red-500/10 text-red-500'
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
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default SuperAdminLayout;
