/**
 * Premium Agent Status Panel
 * Executive-grade AI agent monitoring for $100K+/month clients
 * Design: Sophisticated command center aesthetic
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  Activity,
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Cpu,
  Bot,
} from 'lucide-react';

type AgentStatusType = 'active' | 'paused' | 'error';

interface AgentStatus {
  id: string;
  name: string;
  type: string;  // Flexible to accept any agent type
  status: AgentStatusType;
  last_run: string;
  alerts_generated: number;
  actions_taken: number;
  efficiency_score: number;
}

const agentConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  accentColor: string;
  description: string;
}> = {
  margin_defender: {
    icon: Shield,
    gradient: 'from-violet-600 to-purple-600',
    accentColor: 'text-violet-400',
    description: 'Protects profit margins in real-time',
  },
  intake_classifier: {
    icon: Search,
    gradient: 'from-blue-600 to-cyan-600',
    accentColor: 'text-blue-400',
    description: 'Auto-classifies incoming work',
  },
  scope_sentinel: {
    icon: Activity,
    gradient: 'from-amber-600 to-orange-600',
    accentColor: 'text-amber-400',
    description: 'Detects scope creep patterns',
  },
  efficiency_optimizer: {
    icon: Zap,
    gradient: 'from-emerald-600 to-teal-600',
    accentColor: 'text-emerald-400',
    description: 'Finds optimization opportunities',
  },
};

const statusConfig: Record<AgentStatusType, {
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}> = {
  active: {
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/30',
    label: 'Active',
  },
  paused: {
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/30',
    label: 'Paused',
  },
  error: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/15',
    borderColor: 'border-red-500/30',
    label: 'Error',
  },
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  return `${diffHours}h ago`;
}

interface AgentCardProps {
  agent: AgentStatus;
  index: number;
  onToggle?: (id: string, action: 'pause' | 'resume') => void;
  onReset?: (id: string) => void;
}

function AgentCard({ agent, index, onToggle, onReset }: AgentCardProps) {
  const defaultConfig = {
    icon: Bot,
    gradient: 'from-slate-600 to-slate-700',
    accentColor: 'text-slate-400',
    description: 'AI-powered agent',
  };
  const config = agentConfig[agent.type] || defaultConfig;
  const status = statusConfig[agent.status];
  const AgentIcon = config.icon;

  const efficiencyColor = 
    agent.efficiency_score >= 90 ? 'text-emerald-400' :
    agent.efficiency_score >= 70 ? 'text-blue-400' :
    agent.efficiency_score >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-950/95
        border border-slate-700/30
        backdrop-blur-xl
        shadow-2xl
        hover:shadow-3xl hover:border-slate-600/40
        transition-all duration-500
        group
      `}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Agent gradient accent */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            {/* Agent Icon with gradient background */}
            <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
              <AgentIcon className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h3 className="font-semibold text-white text-lg">{agent.name}</h3>
              <p className="text-sm text-slate-500">{config.description}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-2 h-2 rounded-full ${
                agent.status === 'active' ? 'bg-emerald-500' :
                agent.status === 'paused' ? 'bg-amber-500' : 'bg-red-500'
              }`}
              animate={agent.status === 'active' ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className={`
              px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider
              ${status.bgColor} ${status.color} border ${status.borderColor}
            `}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Alerts</span>
            </div>
            <span className="text-xl font-bold text-white font-mono">{agent.alerts_generated}</span>
          </div>
          
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Actions</span>
            </div>
            <span className="text-xl font-bold text-white font-mono">{agent.actions_taken}</span>
          </div>
          
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Score</span>
            </div>
            <span className={`text-xl font-bold font-mono ${efficiencyColor}`}>
              {agent.efficiency_score}%
            </span>
          </div>
        </div>

        {/* Efficiency Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Efficiency</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last run: {formatTimeAgo(agent.last_run)}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${agent.efficiency_score}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
              style={{ boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
          {onToggle && (
            <button
              onClick={() => onToggle(agent.id, agent.status === 'active' ? 'pause' : 'resume')}
              className={`
                flex-1 py-2.5 px-4 rounded-xl text-sm font-medium
                transition-all duration-300
                flex items-center justify-center gap-2
                ${agent.status === 'active'
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                }
              `}
            >
              {agent.status === 'active' ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Resume
                </>
              )}
            </button>
          )}
          
          {onReset && (
            <button
              onClick={() => onReset(agent.id)}
              className="py-2.5 px-4 rounded-xl text-sm font-medium bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-300 border border-slate-700/50"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// AGENT STATUS PANEL
// ============================================

interface AgentStatusPanelProps {
  agents: AgentStatus[];
  onToggle?: (id: string, action: 'pause' | 'resume') => void;
  onReset?: (id: string) => void;
}

export function AgentStatusPanel({ agents, onToggle, onReset }: AgentStatusPanelProps) {
  const activeCount = agents.filter(a => a.status === 'active').length;
  const totalAlerts = agents.reduce((sum, a) => sum + a.alerts_generated, 0);
  const totalActions = agents.reduce((sum, a) => sum + a.actions_taken, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-slate-800/60 via-slate-900/80 to-slate-800/60 border border-slate-700/30 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Bot className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Margin Agents</h3>
            <p className="text-sm text-slate-500">AI-powered margin protection</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Active</span>
            <div className="text-xl font-bold text-emerald-400 font-mono">{activeCount}/{agents.length}</div>
          </div>
          <div className="text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Alerts</span>
            <div className="text-xl font-bold text-white font-mono">{totalAlerts}</div>
          </div>
          <div className="text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Actions</span>
            <div className="text-xl font-bold text-white font-mono">{totalActions}</div>
          </div>
        </div>
      </motion.div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {agents.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            index={index}
            onToggle={onToggle}
            onReset={onReset}
          />
        ))}
      </div>

      {agents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <Cpu className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-500 text-lg">No agents configured</p>
          <p className="text-slate-600 text-sm mt-1">Set up your first AI agent to start protecting margins</p>
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// COMPACT AGENT INDICATOR
// ============================================

interface AgentIndicatorProps {
  activeCount: number;
  totalCount: number;
  onClick?: () => void;
}

export function AgentIndicator({ activeCount, totalCount, onClick }: AgentIndicatorProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 transition-colors"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-2 h-2 rounded-full bg-violet-500"
      />
      <Bot className="w-4 h-4 text-violet-400" />
      <span className="text-sm font-medium text-violet-400">{activeCount}/{totalCount}</span>
    </button>
  );
}
