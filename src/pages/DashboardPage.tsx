/**
 * Dashboard Page (V2)
 * Premium Business Health Cockpit
 * Enterprise-grade design for $100K+/month clients
 */

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp, ChevronDown, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BurnTicker } from '@/components/dashboard/BurnTicker';
import { IncineratorFeed } from '@/components/dashboard/IncineratorFeed';
import { ProjectWatch } from '@/components/dashboard/ProjectWatch';
import { WorkLogForm } from '@/components/dashboard/WorkLogForm';
import { KPIGrid } from '@/components/command-center/KPICards';
import { ClientPulseGrid } from '@/components/client-pulse/ClientPulseCards';
import { AlertsPanel } from '@/components/agents/AlertsPanel';
import { AgentStatusPanel } from '@/components/agents/AgentStatusPanel';
import { useMetrics, useWorkLogs, useProjects } from '@/hooks/useData';
import { useCommandCenter, useClientHealth, useMarginAlerts, useAgents } from '@/hooks/useCommandCenter';
import type { WorkCategory } from '@/types';

export function DashboardPage() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [period, setPeriod] = useState<7 | 14 | 30>(7);
  
  const { metrics, refresh: refreshMetrics } = useMetrics(period);
  const { metrics: commandMetrics, refresh: refreshCommand } = useCommandCenter(period);
  const { clientHealth, refresh: refreshClients } = useClientHealth();
  const { alerts, acknowledge: acknowledgeAlert, refresh: refreshAlerts } = useMarginAlerts();
  const { agents, toggleAgent, refresh: refreshAgents } = useAgents();
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
      refreshCommand();
      refreshClients();
    },
    [createWorkLog, refreshMetrics, refreshProjects, refreshCommand, refreshClients]
  );

  const handleReclassify = useCallback(
    (id: string, category: WorkCategory) => {
      reclassify(id, category);
      refreshMetrics();
      refreshCommand();
    },
    [reclassify, refreshMetrics, refreshCommand]
  );

  const handleRefreshAll = useCallback(() => {
    refreshMetrics();
    refreshLogs();
    refreshProjects();
    refreshCommand();
    refreshClients();
    refreshAlerts();
    refreshAgents();
  }, [refreshMetrics, refreshLogs, refreshProjects, refreshCommand, refreshClients, refreshAlerts, refreshAgents]);

  const handleOptimizeClient = useCallback((clientId: string) => {
    console.log('Optimize client:', clientId);
  }, []);

  return (
    <div className="space-y-8">
      {/* Premium Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-violet-400" />
              Command Center
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">LIVE</span>
            </div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Real-time margin intelligence • AI-powered protection
          </motion.p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-700/30">
            {([7, 14, 30] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  period === p
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {p}D
              </button>
            ))}
          </div>
          
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefreshAll}
            className="control-btn primary"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <KPIGrid metrics={commandMetrics} />

      {/* Classic Burn Tickers - Condensed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

      {/* Critical Alert Banner */}
      {metrics.scope_requests_pending > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-950/50 via-slate-900/80 to-slate-950/90 border border-rose-500/20 shadow-2xl shadow-rose-500/10"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 flex items-center justify-center border border-rose-500/20">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {metrics.scope_requests_pending} scope creep request{metrics.scope_requests_pending > 1 ? 's' : ''} require attention
                </p>
                <p className="text-sm text-rose-400 mt-0.5">
                  <span className="font-mono font-bold">${metrics.scope_requests_value.toLocaleString()}</span> potential margin at risk
                </p>
              </div>
            </div>
            <Link
              to="/scope-shield"
              className="control-btn danger flex items-center gap-2"
            >
              Review in Scope Shield
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Work Entry + Feed */}
        <div className="xl:col-span-2 space-y-6">
          <WorkLogForm onSubmit={handleCreateWorkLog} />
          <IncineratorFeed
            workLogs={workLogs}
            onReclassify={handleReclassify}
            maxItems={6}
          />
        </div>

        {/* Right Column - Alerts + Projects */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800/50 via-slate-900/80 to-slate-950/90 border border-slate-700/30 backdrop-blur-xl">
            <AlertsPanel 
              alerts={alerts} 
              onAcknowledge={acknowledgeAlert}
              maxHeight="350px"
            />
          </div>
          <ProjectWatch projects={projects.filter((p) => p.status === 'active')} />
        </div>
      </div>

      {/* Client Health Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Client Pulse</h2>
          <span className="text-sm text-slate-500">{clientHealth.length} active clients</span>
        </div>
        <ClientPulseGrid 
          clients={clientHealth} 
          onOptimize={handleOptimizeClient}
        />
      </motion.section>

      {/* AI Agents Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AgentStatusPanel 
          agents={agents}
          onToggle={toggleAgent}
        />
      </motion.section>

      {/* Advanced Toggle */}
      <motion.button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-center gap-2 py-4 text-sm text-slate-400 hover:text-white transition-colors border-t border-slate-800/50"
      >
        <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Analytics</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Advanced Stats */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          <QuickStat label="Work Logs" value={workLogs.length} suffix="entries" />
          <QuickStat label="Active Projects" value={projects.filter((p) => p.status === 'active').length} suffix="projects" />
          <QuickStat label="Avg Hourly Rate" value={150} prefix="$" suffix="/hr" />
          <QuickStat label="Auto Classification" value={95} suffix="%" />
        </motion.div>
      )}
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-900/80 to-slate-950/90 border border-slate-700/30 text-center backdrop-blur-sm"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <p className="text-3xl font-mono font-bold text-white">
        {prefix}{value.toLocaleString()}{suffix}
      </p>
      <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}
