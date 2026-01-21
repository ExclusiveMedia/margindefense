/**
 * Premium Client Pulse Cards
 * Executive-grade client health visualization for $100K+/month clients
 * Design: Refined, data-dense, actionable
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileWarning,
  ChevronRight,
  Sparkles,
  Activity,
  BarChart3,
} from 'lucide-react';

type ClientHealth = 'excellent' | 'good' | 'warning' | 'critical';
type ClientSentiment = 'happy' | 'neutral' | 'concerned' | 'at_risk';
type MarginTrend = 'improving' | 'stable' | 'declining';

interface ClientHealthMetrics {
  client_id: string;
  client_name: string;
  health: ClientHealth;
  sentiment: ClientSentiment;
  total_revenue: number;
  total_burn: number;
  margin_percentage: number;
  retainer_utilization: number | null;
  pending_scope_requests: number;
  risk_score: number;
  margin_trend: MarginTrend;
}

const healthConfig = {
  excellent: {
    gradient: 'from-emerald-950/30 via-slate-900/80 to-slate-950/90',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    glow: 'shadow-emerald-500/5',
  },
  good: {
    gradient: 'from-blue-950/30 via-slate-900/80 to-slate-950/90',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: CheckCircle2,
    iconColor: 'text-blue-400',
    glow: 'shadow-blue-500/5',
  },
  warning: {
    gradient: 'from-amber-950/30 via-slate-900/80 to-slate-950/90',
    border: 'border-amber-500/25',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: Clock,
    iconColor: 'text-amber-400',
    glow: 'shadow-amber-500/5',
  },
  critical: {
    gradient: 'from-red-950/40 via-slate-900/80 to-slate-950/90',
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    glow: 'shadow-red-500/10',
  },
};

const sentimentEmoji: Record<ClientSentiment, string> = {
  happy: '😊',
  neutral: '😐',
  concerned: '😟',
  at_risk: '😰',
};

interface ClientCardProps {
  client: ClientHealthMetrics;
  index: number;
  onOptimize?: (clientId: string) => void;
}

export function ClientCard({ client, index, onOptimize }: ClientCardProps) {
  const config = healthConfig[client.health];
  const HealthIcon = config.icon;
  
  const marginHealth = client.margin_percentage >= 60 ? 'healthy' : client.margin_percentage >= 40 ? 'warning' : 'critical';
  const showUrgent = client.health === 'critical' || client.health === 'warning';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`
        relative overflow-hidden rounded-2xl border ${config.border}
        bg-gradient-to-br ${config.gradient}
        backdrop-blur-xl
        ${config.glow} shadow-2xl
        hover:scale-[1.01] hover:shadow-3xl
        transition-all duration-500 ease-out
        group
      `}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Urgent pulse indicator */}
      {showUrgent && (
        <motion.div
          className="absolute top-4 right-4 w-3 h-3"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className={`w-full h-full rounded-full ${client.health === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
        </motion.div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${config.gradient} border ${config.border}`}>
              <HealthIcon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg tracking-tight">{client.client_name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.badge}`}>
                  {client.health.charAt(0).toUpperCase() + client.health.slice(1)}
                </span>
                <span className="text-lg" title={`Sentiment: ${client.sentiment}`}>
                  {sentimentEmoji[client.sentiment]}
                </span>
              </div>
            </div>
          </div>
          
          {/* Risk Score */}
          <div className="text-right">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Risk</span>
            <div className={`text-2xl font-bold font-mono ${
              client.risk_score >= 60 ? 'text-red-400' : 
              client.risk_score >= 30 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {client.risk_score}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {/* Revenue */}
          <div className="space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Revenue
            </span>
            <div className="text-xl font-bold text-white font-mono">
              ${(client.total_revenue / 1000).toFixed(1)}k
            </div>
          </div>
          
          {/* Burn */}
          <div className="space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3" /> Burn
            </span>
            <div className="text-xl font-bold text-red-400 font-mono">
              ${(client.total_burn / 1000).toFixed(1)}k
            </div>
          </div>
          
          {/* Margin */}
          <div className="space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> Margin
            </span>
            <div className={`text-xl font-bold font-mono flex items-center gap-1 ${
              marginHealth === 'healthy' ? 'text-emerald-400' :
              marginHealth === 'warning' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {client.margin_percentage.toFixed(0)}%
              {client.margin_trend === 'improving' && <TrendingUp className="w-4 h-4" />}
              {client.margin_trend === 'declining' && <TrendingDown className="w-4 h-4" />}
              {client.margin_trend === 'stable' && <Minus className="w-4 h-4 text-slate-500" />}
            </div>
          </div>
        </div>

        {/* Margin Progress Bar */}
        <div className="mb-5">
          <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(client.margin_percentage, 100)}%` }}
              transition={{ delay: index * 0.05 + 0.2, duration: 0.6 }}
              className={`h-full rounded-full ${
                marginHealth === 'healthy' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                marginHealth === 'warning' ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                'bg-gradient-to-r from-red-600 to-red-400'
              }`}
              style={{ 
                boxShadow: marginHealth === 'healthy' ? '0 0 12px rgba(16, 185, 129, 0.4)' :
                  marginHealth === 'warning' ? '0 0 12px rgba(245, 158, 11, 0.4)' :
                  '0 0 12px rgba(239, 68, 68, 0.4)'
              }}
            />
          </div>
        </div>

        {/* Alerts Row */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          {/* Scope Requests */}
          {client.pending_scope_requests > 0 ? (
            <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 rounded-lg px-3 py-1.5 border border-amber-500/20">
              <FileWarning className="w-4 h-4" />
              <span className="text-sm font-medium">
                {client.pending_scope_requests} scope request{client.pending_scope_requests > 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">No pending requests</span>
            </div>
          )}

          {/* Retainer Utilization */}
          {client.retainer_utilization !== null && (
            <div className={`text-sm ${
              client.retainer_utilization > 90 ? 'text-red-400' :
              client.retainer_utilization > 75 ? 'text-amber-400' : 'text-slate-400'
            }`}>
              Retainer: {client.retainer_utilization.toFixed(0)}%
            </div>
          )}
        </div>

        {/* Action Button */}
        {showUrgent && onOptimize && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.3 }}
            onClick={() => onOptimize(client.client_id)}
            className={`
              w-full mt-4 py-3 px-4 rounded-xl font-semibold text-sm
              flex items-center justify-center gap-2
              transition-all duration-300
              ${client.health === 'critical' 
                ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/20' 
                : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-500/20'
              }
            `}
          >
            <Sparkles className="w-4 h-4" />
            {client.health === 'critical' ? 'Take Immediate Action' : 'Optimize Now'}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// CLIENT PULSE GRID
// ============================================

interface ClientPulseGridProps {
  clients: ClientHealthMetrics[];
  onOptimize?: (clientId: string) => void;
}

export function ClientPulseGrid({ clients, onOptimize }: ClientPulseGridProps) {
  // Sort by risk score (highest first)
  const sortedClients = [...clients].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {(['critical', 'warning', 'good', 'excellent'] as const).map((health) => {
          const count = clients.filter(c => c.health === health).length;
          const config = healthConfig[health];
          return (
            <motion.div
              key={health}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                p-4 rounded-xl border ${config.border}
                bg-gradient-to-br ${config.gradient}
                backdrop-blur-sm
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 capitalize">{health}</span>
                <span className={`text-2xl font-bold font-mono ${config.iconColor}`}>{count}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Client Cards */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedClients.map((client, index) => (
            <ClientCard
              key={client.client_id}
              client={client}
              index={index}
              onOptimize={onOptimize}
            />
          ))}
        </div>
      </AnimatePresence>

      {clients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-500 text-lg">No clients to display</p>
          <p className="text-slate-600 text-sm mt-1">Add projects to see client health metrics</p>
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// CLIENT DETAIL PANEL (Expandable)
// ============================================

interface ClientDetailPanelProps {
  client: ClientHealthMetrics;
  onClose: () => void;
}

export function ClientDetailPanel({ client, onClose }: ClientDetailPanelProps) {
  const config = healthConfig[client.health];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`
        rounded-2xl border ${config.border}
        bg-gradient-to-br ${config.gradient}
        backdrop-blur-xl
        shadow-2xl
        p-6
      `}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">{client.client_name}</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        {/* Detailed metrics would go here */}
        <p className="text-slate-400 text-sm">
          Detailed client analytics and action recommendations will appear here.
        </p>
      </div>
    </motion.div>
  );
}
