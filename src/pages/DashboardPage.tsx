/**
 * Dashboard Page
 * The "Financial Health Cockpit" - main view with burn metrics
 */

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BurnTicker } from '@/components/dashboard/BurnTicker';
import { IncineratorFeed } from '@/components/dashboard/IncineratorFeed';
import { ProjectWatch } from '@/components/dashboard/ProjectWatch';
import { WorkLogForm } from '@/components/dashboard/WorkLogForm';
import { useMetrics, useWorkLogs, useProjects } from '@/hooks/useData';
import type { WorkCategory } from '@/types';

export function DashboardPage() {
  const { metrics, refresh: refreshMetrics } = useMetrics(7);
  const { workLogs, createWorkLog, reclassify, refresh: refreshLogs } = useWorkLogs();
  const { projects, refresh: refreshProjects } = useProjects();

  const handleCreateWorkLog = useCallback(
    (data: {
      description: string;
      duration_minutes: number;
      project_id?: string;
      client_id?: string;
    }) => {
      createWorkLog(data);
      refreshMetrics();
      refreshProjects();
    },
    [createWorkLog, refreshMetrics, refreshProjects]
  );

  const handleReclassify = useCallback(
    (id: string, category: WorkCategory) => {
      reclassify(id, category);
      refreshMetrics();
    },
    [reclassify, refreshMetrics]
  );

  const handleRefreshAll = useCallback(() => {
    refreshMetrics();
    refreshLogs();
    refreshProjects();
  }, [refreshMetrics, refreshLogs, refreshProjects]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-display font-bold text-white"
          >
            Financial Health Cockpit
          </motion.h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time margin protection • Last 7 days
          </p>
        </div>
        <button
          onClick={handleRefreshAll}
          className="control-btn"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Top Row - The Tickers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BurnTicker
          value={metrics.total_revenue_secure}
          label="Revenue Secure"
          type="secure"
          subtitle="Billable work this period"
        />
        <BurnTicker
          value={metrics.total_margin_burn}
          label="Margin Burn"
          type="burn"
          subtitle="Non-billable overhead"
        />
        <BurnTicker
          value={metrics.burn_ratio}
          label="Burn Ratio"
          type="ratio"
          subtitle={metrics.burn_ratio > 20 ? '⚠️ Above 20% threshold' : 'Target: < 20%'}
        />
      </div>

      {/* Scope Alert Banner (if pending) */}
      {metrics.scope_requests_pending > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="burn-card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="text-white font-medium">
                {metrics.scope_requests_pending} scope creep request{metrics.scope_requests_pending > 1 ? 's' : ''} pending
              </p>
              <p className="text-sm text-burn-400">
                ${metrics.scope_requests_value.toLocaleString()} at risk
              </p>
            </div>
          </div>
          <Link
            to="/scope-shield"
            className="control-btn danger"
          >
            Review Now
          </Link>
        </motion.div>
      )}

      {/* Middle Section - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Work Log Form + Feed */}
        <div className="space-y-4">
          <WorkLogForm onSubmit={handleCreateWorkLog} />
          <IncineratorFeed
            workLogs={workLogs}
            onReclassify={handleReclassify}
            maxItems={8}
          />
        </div>

        {/* Right: Project Watch */}
        <div>
          <ProjectWatch projects={projects.filter((p) => p.status === 'active')} />
        </div>
      </div>

      {/* Quick Stats Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <QuickStat
          label="Work Logs"
          value={workLogs.length}
          suffix="entries"
        />
        <QuickStat
          label="Active Projects"
          value={projects.filter((p) => p.status === 'active').length}
          suffix="projects"
        />
        <QuickStat
          label="Avg Hourly Rate"
          value={75}
          prefix="$"
          suffix="/hr"
        />
        <QuickStat
          label="Classification"
          value={95}
          suffix="% auto"
        />
      </motion.div>
    </div>
  );
}

interface QuickStatProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

function QuickStat({ label, value, prefix = '', suffix = '' }: QuickStatProps) {
  return (
    <div className="glass-panel p-4 text-center">
      <p className="text-2xl font-mono font-bold text-white">
        {prefix}{value}{suffix}
      </p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
