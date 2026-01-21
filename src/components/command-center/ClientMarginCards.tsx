/**
 * Premium Client Margin Cards
 * Per-client margin health visualization
 * Enterprise-grade design for $100K+/month clients
 */

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles,
  Building2,
  ArrowUpRight
} from 'lucide-react';

interface ClientHealthMetric {
  client_id: string;
  client_name: string;
  health: 'excellent' | 'good' | 'warning' | 'critical';
  sentiment: 'happy' | 'neutral' | 'concerned' | 'at_risk';
  total_revenue: number;
  total_burn: number;
  margin_percentage: number;
  retainer_utilization: number | null;
  pending_scope_requests: number;
  risk_score: number;
  margin_trend: 'improving' | 'stable' | 'declining';
}

const healthStyles = {
  excellent: { 
    gradient: 'from-emerald-950/50 to-slate-950/80',
    border: 'border-emerald-700/30',
    accent: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    glow: 'shadow-emerald-500/10',
  },
  good: { 
    gradient: 'from-blue-950/40 to-slate-950/80',
    border: 'border-blue-700/30',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    glow: 'shadow-blue-500/10',
  },
  warning: { 
    gradient: 'from-amber-950/40 to-slate-950/80',
    border: 'border-amber-700/30',
    accent: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    glow: 'shadow-amber-500/10',
  },
  critical: { 
    gradient: 'from-rose-950/50 to-slate-950/80',
    border: 'border-rose-700/30',
    accent: 'text-rose-400',
    badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    glow: 'shadow-rose-500/10',
  },
};

const sentimentConfig = {
  happy: { emoji: '●', color: 'text-emerald-400', label: 'Satisfied' },
  neutral: { emoji: '●', color: 'text-slate-400', label: 'Neutral' },
  concerned: { emoji: '●', color: 'text-amber-400', label: 'Concerned' },
  at_risk: { emoji: '●', color: 'text-rose-400', label: 'At Risk' },
};

function ClientCard({ 
  client, 
  onOptimize, 
  index 
}: { 
  client: ClientHealthMetric; 
  onOptimize?: (id: string) => void; 
  index: number;
}) {
  const style = healthStyles[client.health];
  const sentiment = sentimentConfig[client.sentiment];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`
        relative p-5 rounded-2xl overflow-hidden
        bg-gradient-to-br ${style.gradient}
        border ${style.border}
        shadow-xl ${style.glow}
        transition-shadow duration-300
        hover:shadow-2xl
      `}
    >
      {/* Top highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} border ${style.border} flex items-center justify-center`}>
            <Building2 className={`w-5 h-5 ${style.accent}`} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">{client.client_name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs ${sentiment.color}`}>{sentiment.emoji}</span>
              <span className="text-xs text-slate-500">{sentiment.label}</span>
            </div>
          </div>
        </div>
        
        <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${style.badge}`}>
          {client.health.charAt(0).toUpperCase() + client.health.slice(1)}
        </span>
      </div>
      
      {/* Margin Percentage - Primary Metric */}
      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Margin</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-mono font-bold ${style.accent}`}>
                {client.margin_percentage.toFixed(0)}
              </span>
              <span className="text-lg text-slate-500">%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs">
            {client.margin_trend === 'improving' && (
              <span className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                Improving
              </span>
            )}
            {client.margin_trend === 'declining' && (
              <span className="flex items-center gap-1 text-rose-400">
                <TrendingDown className="w-3 h-3" />
                Declining
              </span>
            )}
            {client.margin_trend === 'stable' && (
              <span className="text-slate-500">Stable</span>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(client.margin_percentage, 100)}%` }}
            transition={{ duration: 0.8, delay: index * 0.08 + 0.2 }}
            className={`h-full rounded-full ${
              client.margin_percentage >= 70 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
              client.margin_percentage >= 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
              'bg-gradient-to-r from-rose-600 to-rose-400'
            }`}
          />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2 rounded-lg bg-slate-900/50">
          <div className="text-xs text-slate-500 mb-0.5">Revenue</div>
          <div className="text-sm font-mono font-semibold text-emerald-400">
            ${client.total_revenue.toLocaleString()}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/50">
          <div className="text-xs text-slate-500 mb-0.5">Burn</div>
          <div className="text-sm font-mono font-semibold text-rose-400">
            ${client.total_burn.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Retainer Utilization */}
      {client.retainer_utilization !== null && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Retainer Utilized</span>
            <span className={client.retainer_utilization > 90 ? 'text-rose-400' : 'text-slate-400'}>
              {client.retainer_utilization.toFixed(0)}%
            </span>
          </div>
          <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                client.retainer_utilization > 90 ? 'bg-rose-500' :
                client.retainer_utilization > 75 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(client.retainer_utilization, 100)}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Alerts */}
      {client.pending_scope_requests > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-2.5 bg-amber-950/30 rounded-xl border border-amber-800/20 mb-4"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs text-amber-400">
            {client.pending_scope_requests} pending scope request{client.pending_scope_requests > 1 ? 's' : ''}
          </span>
        </motion.div>
      )}
      
      {/* Action Button */}
      {(client.health === 'warning' || client.health === 'critical') && onOptimize && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOptimize(client.client_id)}
          className={`
            w-full flex items-center justify-center gap-2 
            px-4 py-2.5 rounded-xl
            font-medium text-sm
            transition-all duration-200
            ${client.health === 'critical' 
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/20' 
              : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-500/20'
            }
          `}
        >
          <Sparkles className="w-4 h-4" />
          Optimize Now
          <ArrowUpRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}

interface ClientMarginCardsProps {
  clients: ClientHealthMetric[];
  onOptimize?: (clientId: string) => void;
}

export default function ClientMarginCards({ clients, onOptimize }: ClientMarginCardsProps) {
  const sortedClients = [...clients].sort((a, b) => b.risk_score - a.risk_score);
  const atRiskCount = clients.filter(c => c.health === 'warning' || c.health === 'critical').length;
  
  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Client Health</h2>
            <p className="text-sm text-slate-500">Per-client margin analysis</p>
          </div>
        </div>
        
        {atRiskCount > 0 && (
          <div className="px-3 py-1.5 bg-rose-950/30 border border-rose-800/30 rounded-xl">
            <span className="text-sm text-rose-400 font-medium">
              {atRiskCount} need{atRiskCount === 1 ? 's' : ''} attention
            </span>
          </div>
        )}
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedClients.map((client, index) => (
          <ClientCard
            key={client.client_id}
            client={client}
            onOptimize={onOptimize}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
