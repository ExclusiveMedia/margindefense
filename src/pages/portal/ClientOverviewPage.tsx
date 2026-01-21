/**
 * Client Portal Overview
 * End-client view of their projects, deliverables, and status
 */

import { motion } from 'framer-motion';
import {
  FolderKanban,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
  MessageSquare,
} from 'lucide-react';

// Mock client data
const clientData = {
  activeProjects: 3,
  pendingApprovals: 2,
  completedThisMonth: 5,
  upcomingMilestones: 4,
};

const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    status: 'in_progress',
    progress: 68,
    dueDate: '2025-02-15',
    deliverables: { total: 8, approved: 5, pending: 2, inProgress: 1 },
  },
  {
    id: 2,
    name: 'Q1 Marketing Campaign',
    status: 'in_progress',
    progress: 42,
    dueDate: '2025-03-01',
    deliverables: { total: 12, approved: 3, pending: 2, inProgress: 7 },
  },
  {
    id: 3,
    name: 'Brand Guidelines Update',
    status: 'review',
    progress: 95,
    dueDate: '2025-01-30',
    deliverables: { total: 4, approved: 3, pending: 1, inProgress: 0 },
  },
];

const pendingApprovals = [
  {
    id: 1,
    title: 'Homepage Mockup v3',
    project: 'Website Redesign',
    submittedAt: '2 hours ago',
    type: 'design',
  },
  {
    id: 2,
    title: 'Brand Color Palette Final',
    project: 'Brand Guidelines Update',
    submittedAt: '1 day ago',
    type: 'design',
  },
];

const upcomingMilestones = [
  { id: 1, title: 'Website Beta Launch', project: 'Website Redesign', date: '2025-02-01' },
  { id: 2, title: 'Campaign Assets Delivery', project: 'Q1 Marketing Campaign', date: '2025-02-10' },
  { id: 3, title: 'Brand Guide Handoff', project: 'Brand Guidelines Update', date: '2025-01-30' },
];

export function ClientOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--md-text-emphasis))]">Welcome back, Casey</h1>
        <p className="text-sm text-[hsl(var(--md-text-muted))] mt-1">
          Here's what's happening with your projects
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Projects"
          value={clientData.activeProjects}
          icon={FolderKanban}
          color="violet"
        />
        <StatCard
          label="Pending Approvals"
          value={clientData.pendingApprovals}
          icon={Clock}
          color="amber"
          highlight
        />
        <StatCard
          label="Completed This Month"
          value={clientData.completedThisMonth}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Upcoming Milestones"
          value={clientData.upcomingMilestones}
          icon={Calendar}
          color="blue"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[hsl(var(--md-bg-secondary))] border border-[hsl(var(--md-border-subtle))]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[hsl(var(--md-text-emphasis))]">Your Projects</h2>
            <button className="text-sm text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl bg-[hsl(var(--md-bg-elevated))] border border-[hsl(var(--md-border-subtle))] hover:border-blue-500/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-[hsl(var(--md-text-emphasis))]">{project.name}</h3>
                    <p className="text-xs text-[hsl(var(--md-text-muted))] mt-0.5">
                      Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-semibold uppercase ${
                    project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                    project.status === 'review' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[hsl(var(--md-text-muted))]">Progress</span>
                    <span className="font-medium text-[hsl(var(--md-text-emphasis))]">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[hsl(var(--md-border-subtle))] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Deliverables Summary */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {project.deliverables.approved} approved
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Clock className="w-3.5 h-3.5" />
                    {project.deliverables.pending} pending
                  </span>
                  <span className="flex items-center gap-1 text-[hsl(var(--md-text-muted))]">
                    <FileCheck className="w-3.5 h-3.5" />
                    {project.deliverables.total} total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          <div className="p-5 rounded-2xl bg-[hsl(var(--md-bg-secondary))] border border-[hsl(var(--md-border-subtle))]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <h2 className="font-semibold text-[hsl(var(--md-text-emphasis))]">Needs Your Review</h2>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[hsl(var(--md-bg-elevated))] border border-amber-500/20 cursor-pointer hover:bg-amber-500/5 transition-colors"
                >
                  <p className="font-medium text-sm text-[hsl(var(--md-text-emphasis))]">{item.title}</p>
                  <p className="text-xs text-[hsl(var(--md-text-muted))] mt-0.5">{item.project}</p>
                  <p className="text-[10px] text-amber-500 mt-1">{item.submittedAt}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 text-xs font-medium text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors">
              View All Pending ({pendingApprovals.length})
            </button>
          </div>

          {/* Upcoming Milestones */}
          <div className="p-5 rounded-2xl bg-[hsl(var(--md-bg-secondary))] border border-[hsl(var(--md-border-subtle))]">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="font-semibold text-[hsl(var(--md-text-emphasis))]">Upcoming</h2>
            </div>
            <div className="space-y-3">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--md-text-emphasis))]">{milestone.title}</p>
                    <p className="text-xs text-[hsl(var(--md-text-muted))]">
                      {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color,
  highlight 
}: { 
  label: string; 
  value: number; 
  icon: any; 
  color: 'violet' | 'amber' | 'emerald' | 'blue';
  highlight?: boolean;
}) {
  const colorClasses = {
    violet: 'bg-violet-500/10 text-violet-500',
    amber: 'bg-amber-500/10 text-amber-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    blue: 'bg-blue-500/10 text-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${
        highlight 
          ? 'bg-amber-500/5 border-amber-500/30' 
          : 'bg-[hsl(var(--md-bg-secondary))] border-[hsl(var(--md-border-subtle))]'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-[hsl(var(--md-text-emphasis))]">{value}</p>
      <p className="text-xs text-[hsl(var(--md-text-muted))] mt-0.5">{label}</p>
    </motion.div>
  );
}

export default ClientOverviewPage;
