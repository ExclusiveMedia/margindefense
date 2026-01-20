/**
 * ScopeShield Component
 * The inbox for catching and handling scope creep requests
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  DollarSign,
  Flame,
  Check,
  X,
  Building2,
  Clock,
  Plus,
  FileText,
} from 'lucide-react';
import { cn, formatMoney, formatRelativeTime } from '@/lib/utils';
import type { ScopeRequest } from '@/types';

interface ScopeShieldProps {
  requests: ScopeRequest[];
  onResolve: (id: string, resolution: 'accepted_burn' | 'converted_revenue' | 'rejected') => void;
  onCreate: (data: {
    title: string;
    description: string;
    client_id?: string;
    project_id?: string;
    estimated_hours?: number;
  }) => void;
  totalSaved?: number;
  className?: string;
}

export function ScopeShield({
  requests,
  onResolve,
  onCreate,
  totalSaved = 0,
  className,
}: ScopeShieldProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const pendingValue = pendingRequests.reduce((sum, r) => sum + (r.estimated_cost || 0), 0);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pending Threats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="burn-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-burn-500" />
            <span className="text-sm text-burn-400 uppercase tracking-wider">
              Pending Threats
            </span>
          </div>
          <div className="text-4xl font-mono font-bold text-burn-400">
            {pendingRequests.length}
          </div>
          <p className="text-sm text-slate-500 mt-1">scope creep requests</p>
        </motion.div>

        {/* At Risk Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="burn-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-yellow-400 uppercase tracking-wider">
              At Risk Value
            </span>
          </div>
          <div className="text-4xl font-mono font-bold text-yellow-400">
            {formatMoney(pendingValue)}
          </div>
          <p className="text-sm text-slate-500 mt-1">potential margin burn</p>
        </motion.div>

        {/* Money Saved */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="secure-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-secure-500" />
            <span className="text-sm text-secure-400 uppercase tracking-wider">
              Money Saved
            </span>
          </div>
          <div className="text-4xl font-mono font-bold text-secure-400">
            {formatMoney(totalSaved)}
          </div>
          <p className="text-sm text-slate-500 mt-1">by Scope Shield</p>
        </motion.div>
      </div>

      {/* Add Request Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="control-btn gap-2"
        >
          <Plus className="w-4 h-4" />
          Flag Scope Creep
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <AddRequestForm
            onCreate={(data) => {
              onCreate(data);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Inbox */}
      <div className="glass-panel">
        <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-burn-500" />
            <h3 className="font-display font-semibold text-white">Scope Shield Inbox</h3>
          </div>
          <span className="text-xs text-slate-500">
            {pendingRequests.length} pending review
          </span>
        </div>

        <div className="divide-y divide-slate-800/50">
          <AnimatePresence mode="popLayout">
            {pendingRequests.map((request, index) => (
              <ScopeRequestCard
                key={request.id}
                request={request}
                index={index}
                onResolve={onResolve}
              />
            ))}
          </AnimatePresence>

          {pendingRequests.length === 0 && (
            <div className="p-12 text-center">
              <Shield className="w-12 h-12 mx-auto mb-3 text-secure-500 opacity-50" />
              <p className="text-slate-500">No pending scope creep detected</p>
              <p className="text-sm text-slate-600 mt-1">Your margins are protected!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ScopeRequestCardProps {
  request: ScopeRequest;
  index: number;
  onResolve: (id: string, resolution: 'accepted_burn' | 'converted_revenue' | 'rejected') => void;
}

function ScopeRequestCard({ request, index, onResolve }: ScopeRequestCardProps) {
  const [isResolving, setIsResolving] = useState<string | null>(null);

  const handleResolve = async (resolution: 'accepted_burn' | 'converted_revenue' | 'rejected') => {
    setIsResolving(resolution);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onResolve(request.id, resolution);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 hover:bg-slate-800/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <h4 className="font-medium text-white">{request.title}</h4>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 mb-3">{request.description}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {request.client?.name && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {request.client.name}
              </span>
            )}
            {request.estimated_hours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {request.estimated_hours}h estimated
              </span>
            )}
            <span>{formatRelativeTime(request.created_at)}</span>
          </div>
        </div>

        {/* Estimated Cost */}
        {request.estimated_cost && (
          <div className="text-right">
            <span className="text-2xl font-mono font-bold text-yellow-400">
              {formatMoney(request.estimated_cost)}
            </span>
            <p className="text-xs text-slate-500">at risk</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800/50">
        <button
          onClick={() => handleResolve('accepted_burn')}
          disabled={isResolving !== null}
          className={cn(
            'flex-1 control-btn danger justify-center',
            isResolving === 'accepted_burn' && 'opacity-50'
          )}
        >
          <Flame className="w-4 h-4" />
          Accept Burn
        </button>
        <button
          onClick={() => handleResolve('converted_revenue')}
          disabled={isResolving !== null}
          className={cn(
            'flex-1 control-btn success justify-center',
            isResolving === 'converted_revenue' && 'opacity-50'
          )}
        >
          <DollarSign className="w-4 h-4" />
          Convert to Revenue
        </button>
        <button
          onClick={() => handleResolve('rejected')}
          disabled={isResolving !== null}
          className={cn(
            'control-btn justify-center',
            isResolving === 'rejected' && 'opacity-50'
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

interface AddRequestFormProps {
  onCreate: (data: {
    title: string;
    description: string;
    estimated_hours?: number;
  }) => void;
  onCancel: () => void;
}

function AddRequestForm({ onCreate, onCancel }: AddRequestFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      estimated_hours: hours ? parseInt(hours) : undefined,
    });

    setTitle('');
    setDescription('');
    setHours('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="glass-panel overflow-hidden"
    >
      <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
        <h3 className="font-display font-semibold text-white flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Flag Scope Creep
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-500 hover:text-white text-sm"
        >
          Cancel
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Request Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Can you also add a blog section?"
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-slate-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the scope creep request..."
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-slate-600 resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Estimated Hours</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g., 40"
            min="1"
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-slate-600"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full py-3 rounded-lg font-medium bg-burn-600 hover:bg-burn-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Flag as Scope Creep
        </button>
      </div>
    </motion.form>
  );
}
