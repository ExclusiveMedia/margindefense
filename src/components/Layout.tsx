/**
 * Layout Component
 * Main application shell with sidebar navigation
 */

import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Real-time burn metrics',
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
    description: 'Where money goes to die',
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

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900/80 border-r border-slate-800/50 backdrop-blur-sm">
        <Logo />
        <Navigation />
        <IntegrationStatus />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-burn-500" />
            <span className="font-display font-bold text-white">MarginDefense</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
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
            className="lg:hidden fixed inset-0 z-40 bg-slate-900/98 backdrop-blur-md pt-16"
          >
            <nav className="p-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-burn-950/50 text-white border-l-2 border-burn-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <div>
                    <span className="block font-medium">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.description}</span>
                  </div>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Logo() {
  return (
    <div className="p-6 border-b border-slate-800/50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-burn-600 to-burn-700 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-xl bg-burn-500/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        <div>
          <h1 className="font-display font-bold text-white text-lg">MarginDefense</h1>
          <p className="text-xs text-slate-500">Revenue Protection System</p>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <nav className="flex-1 p-4 space-y-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              'nav-item',
              isActive && 'active'
            )
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function IntegrationStatus() {
  return (
    <div className="p-4 border-t border-slate-800/50">
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-white">Integrations</span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Data Source</span>
            <span className="text-yellow-400">Manual Entry</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Status</span>
            <span className="flex items-center gap-1 text-secure-400">
              <span className="w-1.5 h-1.5 rounded-full bg-secure-500 animate-pulse" />
              Active
            </span>
          </div>
        </div>
        <button className="w-full mt-3 py-2 text-xs text-slate-400 hover:text-white border border-slate-700/50 rounded-lg hover:bg-slate-800/50 transition-colors flex items-center justify-center gap-1">
          <ExternalLink className="w-3 h-3" />
          Connect CRM
        </button>
      </div>
      
      {/* Version */}
      <p className="text-center text-[10px] text-slate-600 mt-4">
        v0.1.0 MVP • Built by TORQOS
      </p>
    </div>
  );
}
