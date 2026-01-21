/**
 * Layout Component
 * Premium application shell with sidebar navigation
 * Enterprise-grade design for $100K+/month clients
 */

import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Shield,
  BarChart3,
  Settings,
  Menu,
  X,
  Flame,
  Zap,
  ExternalLink,
  Activity,
  Users,
  Bot,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

const NAV_ITEMS = [
  {
    label: 'Command Center',
    href: '/',
    icon: Activity,
    description: 'AI-powered dashboard',
    badge: 'LIVE',
  },
  {
    label: 'Scope Shield',
    href: '/scope-shield',
    icon: Shield,
    description: 'Protect your margins',
  },
  {
    label: 'Leakage Analysis',
    href: '/leakage',
    icon: BarChart3,
    description: 'Deep margin insights',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configure your defense',
  },
];

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex bg-[hsl(var(--md-bg-primary))]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[hsl(var(--md-bg-secondary))] border-r border-[hsl(var(--md-border-subtle))]">
        <Logo />
        <Navigation />
        <IntegrationStatus />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--md-bg-secondary))] border-b border-[hsl(var(--md-border-subtle))]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[hsl(var(--md-text-emphasis))] text-lg tracking-tight">MarginDefense</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-[hsl(var(--md-text-secondary))] hover:text-[hsl(var(--md-text-emphasis))] hover:bg-[hsl(var(--md-bg-hover))] transition-colors"
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
            transition={{ type: 'spring', damping: 25 }}
            className="lg:hidden fixed inset-0 z-40 bg-[hsl(var(--md-bg-primary))] pt-20"
          >
            <nav className="p-5 space-y-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/10 text-[hsl(var(--md-text-emphasis))] border-l-3 border-violet-500'
                        : 'text-[hsl(var(--md-text-secondary))] hover:text-[hsl(var(--md-text-emphasis))] hover:bg-[hsl(var(--md-bg-hover))]'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[hsl(var(--md-text-muted))]">{item.description}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[hsl(var(--md-text-muted))]" />
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 overflow-x-hidden">
        <div className="p-5 lg:p-8 max-w-[1800px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Logo() {
  return (
    <div className="p-6 border-b border-[hsl(var(--md-border-subtle))]">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-xl shadow-violet-500/20">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-2xl bg-violet-500/30"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <div>
          <h1 className="font-bold text-[hsl(var(--md-text-emphasis))] text-xl tracking-tight">MarginDefense</h1>
          <p className="text-xs text-[hsl(var(--md-text-muted))] mt-0.5">AI Revenue Protection</p>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <nav className="flex-1 p-4 space-y-1.5">
      <p className="px-4 py-2 text-[10px] font-semibold text-[hsl(var(--md-text-muted))] uppercase tracking-widest">
        Navigation
      </p>
      {NAV_ITEMS.map((item, index) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
              isActive
                ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/10 text-[hsl(var(--md-text-emphasis))] border-l-[3px] border-violet-500'
                : 'text-[hsl(var(--md-text-secondary))] hover:text-[hsl(var(--md-text-emphasis))] hover:bg-[hsl(var(--md-bg-hover))]'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className={cn(
                'p-2 rounded-lg transition-colors',
                isActive ? 'bg-violet-500/20' : 'bg-[hsl(var(--md-bg-elevated))] group-hover:bg-[hsl(var(--md-bg-hover))]'
              )}>
                <item.icon className={cn('w-4 h-4', isActive ? 'text-violet-400' : '')} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="w-1.5 h-1.5 rounded-full bg-violet-400"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function IntegrationStatus() {
  return (
    <div className="p-4 border-t border-[hsl(var(--md-border-subtle))]">
      {/* Theme Toggle */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-xs font-medium text-[hsl(var(--md-text-muted))]">Appearance</span>
        <ThemeToggle />
      </div>
      
      <div className="p-4 rounded-2xl bg-[hsl(var(--md-bg-elevated))] border border-[hsl(var(--md-border-subtle))]">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-sm font-semibold text-[hsl(var(--md-text-emphasis))]">System Status</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[hsl(var(--md-text-muted))]">Data Source</span>
            <span className="text-xs font-medium text-amber-400">Manual Entry</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[hsl(var(--md-text-muted))]">AI Agents</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <motion.span 
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[hsl(var(--md-text-muted))]">Protection</span>
            <span className="text-xs font-medium text-violet-400">Enabled</span>
          </div>
        </div>
        <button className="w-full mt-4 py-2.5 text-xs font-medium text-[hsl(var(--md-text-secondary))] hover:text-[hsl(var(--md-text-emphasis))] border border-[hsl(var(--md-border-medium))] rounded-xl hover:bg-[hsl(var(--md-bg-hover))] transition-all duration-300 flex items-center justify-center gap-2">
          <ExternalLink className="w-3.5 h-3.5" />
          Connect Integrations
        </button>
      </div>
      
      {/* Version */}
      <p className="text-center text-[10px] text-[hsl(var(--md-text-muted))] mt-4">
        v3.0.0 • Enterprise Edition
      </p>
    </div>
  );
}
