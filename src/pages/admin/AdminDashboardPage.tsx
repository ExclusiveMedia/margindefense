/**
 * Super Admin Dashboard
 * Platform-wide metrics, system health, and tenant overview
 */

import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  AlertTriangle,
  Bot,
  Server,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Mock platform data
const platformMetrics = {
  mrr: 127500,
  mrrChange: 12.5,
  activeTenants: 42,
  tenantsChange: 8,
  totalUsers: 384,
  usersChange: 15,
  apiCalls: '2.4M',
  apiChange: 22,
};

const systemHealth = {
  uptime: 99.98,
  responseTime: 142,
  errorRate: 0.02,
  activeAgents: 156,
};

const recentTenants = [
  { id: 1, name: 'Sterling & Associates', plan: 'Enterprise', mrr: 4500, status: 'active', users: 18 },
  { id: 2, name: 'Quantum Digital', plan: 'Professional', mrr: 1500, status: 'active', users: 8 },
  { id: 3, name: 'Nova Creative', plan: 'Professional', mrr: 1500, status: 'trial', users: 5 },
  { id: 4, name: 'Apex Solutions', plan: 'Starter', mrr: 500, status: 'active', users: 3 },
  { id: 5, name: 'Frontier Labs', plan: 'Enterprise', mrr: 4500, status: 'past_due', users: 12 },
];

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--md-text-emphasis))]">Platform Overview</h1>
          <p className="text-sm text-[hsl(var(--md-text-muted))] mt-1">
            System health and tenant metrics
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-500">All Systems Operational</span>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Monthly Recurring Revenue"
          value={`$${platformMetrics.mrr.toLocaleString()}`}
          change={platformMetrics.mrrChange}
          icon={DollarSign}
          color="emerald"
        />
        <MetricCard
          label="Active Tenants"
          value={platformMetrics.activeTenants.toString()}
          change={platformMetrics.tenantsChange}
          icon={Building2}
          color="violet"
        />
        <MetricCard
          label="Total Users"
          value={platformMetrics.totalUsers.toString()}
          change={platformMetrics.usersChange}
          icon={Users}
          color="blue"
        />
        <MetricCard
          label="API Calls (30d)"
          value={platformMetrics.apiCalls}
          change={platformMetrics.apiChange}
          icon={Activity}
          color="amber"
        />
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[hsl(var(--md-bg-secondary))] border border-[hsl(var(--md-border-subtle))]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[hsl(var(--md-text-emphasis))]">Recent Tenants</h2>
            <button className="text-sm text-violet-500 hover:text-violet-400 font-medium">View All</button>
          </div>
          <div className="space-y-2">
            {recentTenants.map((tenant) => (
              <div
                key={tenant.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[hsl(var(--md-bg-hover))] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[hsl(var(--md-text-emphasis))] truncate">{tenant.name}</p>
                  <p className="text-xs text-[hsl(var(--md-text-muted))]">{tenant.users} users</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[hsl(var(--md-text-emphasis))]">${tenant.mrr}/mo</p>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    tenant.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                    tenant.status === 'trial' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {tenant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Panel */}
        <div className="p-5 rounded-2xl bg-[hsl(var(--md-bg-secondary))] border border-[hsl(var(--md-border-subtle))]">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-[hsl(var(--md-text-muted))]" />
            <h2 className="text-lg font-semibold text-[hsl(var(--md-text-emphasis))]">System Health</h2>
          </div>
          <div className="space-y-4">
            <HealthMetric label="Uptime" value={`${systemHealth.uptime}%`} status="good" />
            <HealthMetric label="Avg Response" value={`${systemHealth.responseTime}ms`} status="good" />
            <HealthMetric label="Error Rate" value={`${systemHealth.errorRate}%`} status="good" />
            <HealthMetric label="Active Agents" value={systemHealth.activeAgents.toString()} status="good" />
          </div>

          <div className="mt-6 p-3 rounded-xl bg-[hsl(var(--md-bg-elevated))] border border-[hsl(var(--md-border-subtle))]">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-[hsl(var(--md-text-emphasis))]">AI Operations</span>
            </div>
            <div className="text-xs text-[hsl(var(--md-text-muted))]">
              <p>Token Usage: 847K / 1M (84.7%)</p>
              <div className="mt-1 h-1.5 rounded-full bg-[hsl(var(--md-border-subtle))] overflow-hidden">
                <div className="h-full w-[84.7%] rounded-full bg-violet-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color 
}: { 
  label: string; 
  value: string; 
  change: number; 
  icon: any; 
  color: 'emerald' | 'violet' | 'blue' | 'amber';
}) {
  const isPositive = change >= 0;
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    violet: 'bg-violet-500/10 text-violet-500',
    blue: 'bg-blue-500/10 text-blue-500',
    amber: 'bg-amber-500/10 text-amber-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-[hsl(var(--md-bg-secondary))] border border-[hsl(var(--md-border-subtle))]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-[hsl(var(--md-text-emphasis))]">{value}</p>
      <p className="text-xs text-[hsl(var(--md-text-muted))] mt-1">{label}</p>
    </motion.div>
  );
}

function HealthMetric({ label, value, status }: { label: string; value: string; status: 'good' | 'warning' | 'critical' }) {
  const statusColors = {
    good: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[hsl(var(--md-text-muted))]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[hsl(var(--md-text-emphasis))]">{value}</span>
        <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
