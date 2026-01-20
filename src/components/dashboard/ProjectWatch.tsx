/**
 * ProjectWatch Component
 * Grid of project cards showing budget health
 */

import { motion } from 'framer-motion';
import { Briefcase, AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';
import { cn, formatMoney, calcPercentage } from '@/lib/utils';
import type { Project, MarginHealth } from '@/types';

interface ProjectWatchProps {
  projects: Project[];
  className?: string;
}

export function ProjectWatch({ projects, className }: ProjectWatchProps) {
  return (
    <div className={cn('glass-panel', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-slate-400" />
          <h3 className="font-display font-semibold text-white">Project Watch</h3>
        </div>
        <span className="text-xs text-slate-500">{projects.length} active</span>
      </div>

      {/* Project Grid */}
      <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}

        {projects.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-500">
            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No active projects</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const budgetUsed = calcPercentage(project.current_spend, project.total_budget);
  const isOverBudget = project.current_spend > project.total_budget;
  const isUnderwater = project.margin_health === 'underwater';
  const isWarning = project.margin_health === 'warning';
  const isCritical = project.margin_health === 'critical';

  const healthConfig = getHealthConfig(project.margin_health);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative p-4 rounded-xl border transition-all duration-300',
        isUnderwater && 'bg-burn-950/40 border-burn-700/50 animate-pulse',
        isCritical && 'bg-burn-950/30 border-burn-800/50',
        isWarning && 'bg-yellow-950/20 border-yellow-800/50',
        !isUnderwater && !isCritical && !isWarning && 'bg-slate-900/50 border-slate-800/50'
      )}
    >
      {/* Underwater badge */}
      {isUnderwater && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-burn-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          UNDERWATER
        </div>
      )}

      {/* Project name and client */}
      <div className="mb-3">
        <h4 className="font-medium text-white truncate">{project.name}</h4>
        {project.client && (
          <p className="text-xs text-slate-500 truncate">{project.client.name}</p>
        )}
      </div>

      {/* Budget bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500">Budget</span>
          <span
            className={cn(
              'font-mono',
              isOverBudget ? 'text-burn-400' : 'text-slate-400'
            )}
          >
            {formatMoney(project.current_spend)} / {formatMoney(project.total_budget)}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className={cn('progress-bar-fill', healthConfig.progressClass)}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          />
          {isOverBudget && (
            <div
              className="h-full bg-burn-500/50 animate-pulse"
              style={{ width: `${budgetUsed - 100}%`, marginLeft: '100%' }}
            />
          )}
        </div>
      </div>

      {/* Health status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {healthConfig.icon}
          <span className={cn('text-xs font-medium', healthConfig.textClass)}>
            {healthConfig.label}
          </span>
        </div>
        <span className="text-xs text-slate-500">{budgetUsed}% used</span>
      </div>
    </motion.div>
  );
}

function getHealthConfig(health: MarginHealth): {
  label: string;
  icon: React.ReactNode;
  textClass: string;
  progressClass: string;
} {
  switch (health) {
    case 'healthy':
      return {
        label: 'Healthy',
        icon: <CheckCircle className="w-3.5 h-3.5 text-secure-500" />,
        textClass: 'text-secure-400',
        progressClass: 'healthy',
      };
    case 'warning':
      return {
        label: 'At Risk',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />,
        textClass: 'text-yellow-400',
        progressClass: 'warning',
      };
    case 'critical':
      return {
        label: 'Critical',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-burn-500" />,
        textClass: 'text-burn-400',
        progressClass: 'critical',
      };
    case 'underwater':
      return {
        label: 'Over Budget',
        icon: <TrendingDown className="w-3.5 h-3.5 text-burn-500" />,
        textClass: 'text-burn-400',
        progressClass: 'critical',
      };
  }
}
