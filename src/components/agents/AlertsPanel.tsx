/**
 * Premium Alerts Panel
 * Executive-grade alert management for $100K+/month clients
 * Design: Sophisticated, scannable, actionable
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Zap,
  Shield,
  TrendingDown,
  Users,
  FileWarning,
  Activity,
} from 'lucide-react';

type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

interface MarginAlert {
  id: string;
  type: string;  // Flexible to accept any alert type
  severity: AlertSeverity;
  title: string;
  description: string;
  impact_amount: number;
  client_id?: string;
  project_id?: string;
  created_at: string;
  resolved_at?: string;
  suggested_action?: string;
}

const severityConfig = {
  info: {
    gradient: 'from-blue-950/40 via-slate-900/90 to-slate-950/95',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    icon: Info,
    iconColor: 'text-blue-400',
    glow: '',
  },
  warning: {
    gradient: 'from-amber-950/40 via-slate-900/90 to-slate-950/95',
    border: 'border-amber-500/25',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    icon: AlertCircle,
    iconColor: 'text-amber-400',
    glow: 'shadow-amber-500/5',
  },
  critical: {
    gradient: 'from-red-950/40 via-slate-900/90 to-slate-950/95',
    border: 'border-red-500/30',
    badge: 'bg-red-500/15 text-red-400 border-red-500/20',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    glow: 'shadow-red-500/10',
  },
  emergency: {
    gradient: 'from-red-950/60 via-red-950/40 to-slate-950/95',
    border: 'border-red-500/50',
    badge: 'bg-red-500/20 text-red-300 border-red-400/30',
    icon: XCircle,
    iconColor: 'text-red-400',
    glow: 'shadow-red-500/20',
  },
};

const alertTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  margin_threshold: TrendingDown,
  burn_spike: Activity,
  scope_creep_pattern: FileWarning,
  project_overrun: AlertTriangle,
  client_churn_risk: Users,
  efficiency_drop: TrendingDown,
  deadline_risk: Clock,
  optimization_found: Zap,
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

interface AlertCardProps {
  alert: MarginAlert;
  index: number;
  onAcknowledge?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

function AlertCard({ alert, index, onAcknowledge, onViewDetails }: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = severityConfig[alert.severity];
  const SeverityIcon = config.icon;
  const TypeIcon = alertTypeIcons[alert.type] || AlertCircle;
  const isEmergency = alert.severity === 'emergency';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className={`
        relative overflow-hidden rounded-xl border ${config.border}
        bg-gradient-to-r ${config.gradient}
        backdrop-blur-xl
        ${config.glow} shadow-lg
        transition-all duration-300
        ${isEmergency ? 'ring-1 ring-red-500/30' : ''}
      `}
    >
      {/* Emergency pulse effect */}
      {isEmergency && (
        <motion.div
          className="absolute inset-0 bg-red-500/5"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}

      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`
            shrink-0 p-2.5 rounded-xl
            bg-gradient-to-br ${config.gradient}
            border ${config.border}
          `}>
            <SeverityIcon className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${config.badge}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(alert.created_at)}
                  </span>
                </div>
                <h4 className="font-semibold text-white text-base">{alert.title}</h4>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{alert.description}</p>
              </div>

              {/* Impact Amount */}
              {alert.impact_amount > 0 && (
                <div className="shrink-0 text-right">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Impact</span>
                  <div className={`text-lg font-bold font-mono ${
                    alert.severity === 'emergency' || alert.severity === 'critical' 
                      ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    ${alert.impact_amount.toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {/* Expandable Section */}
            {alert.suggested_action && (
              <div className="mt-3">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Suggested Action
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-300">{alert.suggested_action}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4">
              {onAcknowledge && !alert.resolved_at && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-300
                    ${alert.severity === 'emergency' || alert.severity === 'critical'
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }
                  `}
                >
                  <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
                  Acknowledge
                </button>
              )}
              
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(alert.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 transition-colors border border-slate-700/50"
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ALERTS PANEL
// ============================================

interface AlertsPanelProps {
  alerts: MarginAlert[];
  onAcknowledge?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  maxHeight?: string;
}

export function AlertsPanel({ alerts, onAcknowledge, onViewDetails, maxHeight = '600px' }: AlertsPanelProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return !alert.resolved_at;
    if (filter === 'critical') return (alert.severity === 'critical' || alert.severity === 'emergency') && !alert.resolved_at;
    if (filter === 'warning') return alert.severity === 'warning' && !alert.resolved_at;
    return true;
  });

  const criticalCount = alerts.filter(a => (a.severity === 'critical' || a.severity === 'emergency') && !a.resolved_at).length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.resolved_at).length;

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
            {filteredAlerts.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'critical', 'warning'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${filter === f 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
              `}
            >
              {f === 'all' ? 'All' : f === 'critical' ? `Critical (${criticalCount})` : `Warning (${warningCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 overflow-y-auto custom-scrollbar" style={{ maxHeight }}>
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                index={index}
                onAcknowledge={onAcknowledge}
                onViewDetails={onViewDetails}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-slate-400 text-lg font-medium">All Clear</p>
              <p className="text-slate-500 text-sm mt-1">No active alerts at this time</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// COMPACT ALERT BADGE (for navbar/header)
// ============================================

interface AlertBadgeProps {
  count: number;
  criticalCount: number;
  onClick?: () => void;
}

export function AlertBadge({ count, criticalCount, onClick }: AlertBadgeProps) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-3 py-1.5 rounded-lg
        transition-all duration-200
        ${criticalCount > 0 
          ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20' 
          : 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
        }
      `}
    >
      <Shield className={`w-4 h-4 ${criticalCount > 0 ? 'text-red-400' : 'text-amber-400'}`} />
      <span className={`text-sm font-medium ${criticalCount > 0 ? 'text-red-400' : 'text-amber-400'}`}>
        {count}
      </span>
      
      {criticalCount > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </button>
  );
}
