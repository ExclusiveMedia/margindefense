/**
 * Premium Command Center KPI Cards
 * Executive-grade metrics display for $100K+/month clients
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Shield,
  Zap,
  Users,
  Activity,
  Target,
} from 'lucide-react';

// Animated number hook
function useAnimatedNumber(value: number, duration = 1200) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const startValue = displayValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(startValue + (value - startValue) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return displayValue;
}

function formatNumber(n: number, decimals = 0): string {
  return n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ============================================
// BILLABLE RATIO CARD
// ============================================

export function BillableRatioCard({ 
  ratio, 
  trend,
  delay = 0
}: { 
  ratio: number; 
  trend: 'up' | 'down' | 'stable';
  delay?: number;
}) {
  const animated = useAnimatedNumber(ratio);
  const health = ratio >= 60 ? 'healthy' : ratio >= 40 ? 'warning' : 'critical';
  
  const colors = {
    healthy: { accent: 'emerald', text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/20' },
    warning: { accent: 'amber', text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/20' },
    critical: { accent: 'red', text: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500/30' },
  }[health];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border ${colors.border} backdrop-blur-xl shadow-2xl`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${colors.accent}-500/15 via-transparent to-transparent pointer-events-none`} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className={`p-3 rounded-xl bg-${colors.accent}-500/10 border border-${colors.accent}-500/20`}>
            <Target className={`w-5 h-5 ${colors.text}`} />
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-${colors.accent}-500/10 ${colors.text} border border-${colors.accent}-500/20`}>
            {health}
          </span>
        </div>

        <div className="mb-4">
          <span className={`font-mono text-5xl font-bold tracking-tight ${colors.text}`}>
            {formatNumber(animated, 1)}%
          </span>
        </div>

        <div className="mb-4">
          <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(ratio, 100)}%` }}
              transition={{ duration: 1, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-full ${colors.bg}`}
              style={{ boxShadow: `0 0 20px ${health === 'healthy' ? 'rgba(16,185,129,0.4)' : health === 'warning' ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)'}` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Billable Ratio</h3>
          <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend === 'stable' && <Minus className="w-3 h-3" />}
            vs last period
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// AT-RISK REVENUE CARD
// ============================================

export function AtRiskRevenueCard({ 
  amount,
  projectCount,
  delay = 0
}: { 
  amount: number;
  projectCount: number;
  delay?: number;
}) {
  const animated = useAnimatedNumber(amount);
  const severity = amount > 50000 ? 'emergency' : amount > 20000 ? 'critical' : amount > 5000 ? 'warning' : 'low';
  const isUrgent = severity === 'emergency' || severity === 'critical';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border ${isUrgent ? 'border-red-500/30' : 'border-amber-500/20'} backdrop-blur-xl shadow-2xl`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${isUrgent ? 'from-red-500/15' : 'from-amber-500/10'} via-transparent to-transparent pointer-events-none`} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className={`p-3 rounded-xl ${isUrgent ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'} border`}>
            <AlertTriangle className={`w-5 h-5 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`} />
          </div>
          {severity === 'emergency' && (
            <motion.span 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider rounded-full"
            >
              Urgent
            </motion.span>
          )}
        </div>

        <div className="mb-2">
          <span className={`font-mono text-4xl font-bold tracking-tight ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}>
            ${formatNumber(animated)}
          </span>
        </div>

        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">At-Risk Revenue</h3>
        <p className="text-xs text-slate-500">{projectCount} project{projectCount !== 1 ? 's' : ''} need attention</p>
      </div>
    </motion.div>
  );
}

// ============================================
// AI HOURS SAVED CARD
// ============================================

export function AIHoursSavedCard({ 
  hours,
  dollarValue,
  delay = 0
}: { 
  hours: number;
  dollarValue: number;
  delay?: number;
}) {
  const animated = useAnimatedNumber(hours);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-violet-500/20 backdrop-blur-xl shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/15 via-violet-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Zap className="w-5 h-5 text-violet-400" />
          </div>
          <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 text-xs font-semibold uppercase tracking-wider rounded-full border border-violet-500/20">
            AI Powered
          </span>
        </div>

        <div className="mb-2">
          <span className="font-mono text-4xl font-bold tracking-tight text-violet-400">
            {formatNumber(animated, 1)}h
          </span>
        </div>

        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Hours Saved</h3>
        <p className="text-xs text-emerald-400/80">≈ ${dollarValue.toLocaleString()} recovered</p>
      </div>
    </motion.div>
  );
}

// ============================================
// EFFICIENCY SCORE CARD
// ============================================

export function EfficiencyScoreCard({ 
  score,
  delay = 0
}: { 
  score: number;
  delay?: number;
}) {
  const animated = useAnimatedNumber(score);
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  const gradeColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-blue-500/20 backdrop-blur-xl shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <span className={`text-3xl font-bold ${gradeColor}`}>{grade}</span>
        </div>

        <div className="mb-4">
          <span className="font-mono text-4xl font-bold tracking-tight text-blue-400">
            {formatNumber(animated)}
          </span>
        </div>

        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Efficiency Score</h3>
        
        <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
            style={{ boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// CLIENT HEALTH CARD
// ============================================

export function ClientHealthCard({ 
  healthy,
  atRisk,
  total,
  delay = 0
}: { 
  healthy: number;
  atRisk: number;
  total: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-700/30 backdrop-blur-xl shadow-2xl"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
            <Users className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-mono text-3xl font-bold tracking-tight text-emerald-400">{healthy}</span>
            <p className="text-xs text-slate-500 mt-1">Healthy</p>
          </div>
          <div>
            <span className="font-mono text-3xl font-bold tracking-tight text-red-400">{atRisk}</span>
            <p className="text-xs text-slate-500 mt-1">At Risk</p>
          </div>
        </div>

        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Client Health</h3>
        
        <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-800/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: total > 0 ? `${(healthy / total) * 100}%` : '0%' }}
            transition={{ duration: 0.8, delay: delay + 0.3 }}
            className="bg-gradient-to-r from-emerald-500 to-emerald-400"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: total > 0 ? `${(atRisk / total) * 100}%` : '0%' }}
            transition={{ duration: 0.8, delay: delay + 0.4 }}
            className="bg-gradient-to-r from-red-500 to-red-400"
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ACTIVE ALERTS CARD
// ============================================

export function ActiveAlertsCard({ 
  total,
  critical,
  delay = 0
}: { 
  total: number;
  critical: number;
  delay?: number;
}) {
  const hasIssues = critical > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border ${hasIssues ? 'border-red-500/30' : 'border-slate-700/30'} backdrop-blur-xl shadow-2xl`}
    >
      {hasIssues && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent pointer-events-none" />
      )}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className={`p-3 rounded-xl ${hasIssues ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-700/30 border-slate-600/30'} border`}>
            <Shield className={`w-5 h-5 ${hasIssues ? 'text-red-400' : 'text-slate-400'}`} />
          </div>
          {critical > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full">
              <motion.span 
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-red-400 rounded-full"
              />
              {critical} Critical
            </span>
          )}
        </div>

        <div className="mb-2">
          <span className={`font-mono text-4xl font-bold tracking-tight ${hasIssues ? 'text-red-400' : 'text-slate-300'}`}>
            {total}
          </span>
        </div>

        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Alerts</h3>
        {total === 0 && (
          <p className="text-xs text-emerald-400/80 mt-1">All systems nominal</p>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// COMMAND CENTER METRICS INTERFACE
// ============================================

interface CommandCenterMetrics {
  billable_ratio: number;
  billable_ratio_trend: 'up' | 'down' | 'stable';
  at_risk_revenue: number;
  ai_hours_saved: number;
  efficiency_score: number;
  active_alerts: number;
  critical_alerts: number;
  healthy_clients: number;
  at_risk_clients: number;
  total_clients: number;
}

// ============================================
// KPI GRID (Main Export)
// ============================================

export function KPIGrid({ metrics }: { metrics: CommandCenterMetrics }) {
  const hourlyRate = 150;
  const aiDollarValue = metrics.ai_hours_saved * hourlyRate;
  const atRiskProjects = Math.max(1, Math.ceil(metrics.at_risk_revenue / 8000));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      <BillableRatioCard
        ratio={metrics.billable_ratio}
        trend={metrics.billable_ratio_trend}
        delay={0}
      />
      <AtRiskRevenueCard
        amount={metrics.at_risk_revenue}
        projectCount={atRiskProjects}
        delay={0.05}
      />
      <AIHoursSavedCard
        hours={metrics.ai_hours_saved}
        dollarValue={aiDollarValue}
        delay={0.1}
      />
      <EfficiencyScoreCard
        score={metrics.efficiency_score}
        delay={0.15}
      />
      <ClientHealthCard
        healthy={metrics.healthy_clients}
        atRisk={metrics.at_risk_clients}
        total={metrics.total_clients}
        delay={0.2}
      />
      <ActiveAlertsCard
        total={metrics.active_alerts}
        critical={metrics.critical_alerts}
        delay={0.25}
      />
    </div>
  );
}
