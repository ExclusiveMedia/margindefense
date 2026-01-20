/**
 * Scope Shield Page
 * Dedicated view for managing scope creep requests
 */

import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScopeShield } from '@/components/scope-shield/ScopeShield';
import { useScopeRequests, useMetrics } from '@/hooks/useData';

export function ScopeShieldPage() {
  const { requests, resolve, create, refresh } = useScopeRequests();
  const { refresh: refreshMetrics } = useMetrics();

  // Calculate total saved (converted to revenue)
  const totalSaved = useMemo(() => {
    return requests
      .filter((r) => r.status === 'converted_revenue')
      .reduce((sum, r) => sum + (r.estimated_cost || 0), 0);
  }, [requests]);

  const handleResolve = useCallback(
    (id: string, resolution: 'accepted_burn' | 'converted_revenue' | 'rejected') => {
      resolve(id, resolution);
      refreshMetrics();
    },
    [resolve, refreshMetrics]
  );

  const handleCreate = useCallback(
    (data: {
      title: string;
      description: string;
      client_id?: string;
      project_id?: string;
      estimated_hours?: number;
    }) => {
      create(data);
    },
    [create]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-display font-bold text-white"
        >
          Scope Shield
        </motion.h1>
        <p className="text-slate-500 text-sm mt-1">
          Catch scope creep before it burns your margins
        </p>
      </div>

      {/* Main Component */}
      <ScopeShield
        requests={requests}
        onResolve={handleResolve}
        onCreate={handleCreate}
        totalSaved={totalSaved}
      />

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-6"
      >
        <h3 className="font-display font-semibold text-white mb-4">
          How Scope Shield Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="w-10 h-10 rounded-lg bg-burn-950/50 border border-burn-800/50 flex items-center justify-center mb-3">
              <span className="text-xl">🎯</span>
            </div>
            <h4 className="font-medium text-white mb-1">Detect</h4>
            <p className="text-slate-500">
              Flag incoming requests that look like scope creep - "quick favors",
              "while you're at it", or anything not in the original contract.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-yellow-950/50 border border-yellow-800/50 flex items-center justify-center mb-3">
              <span className="text-xl">⚖️</span>
            </div>
            <h4 className="font-medium text-white mb-1">Decide</h4>
            <p className="text-slate-500">
              For each request, choose: Accept it as margin burn (track the loss),
              or convert it to revenue (bill the client).
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-secure-950/50 border border-secure-800/50 flex items-center justify-center mb-3">
              <span className="text-xl">💰</span>
            </div>
            <h4 className="font-medium text-white mb-1">Defend</h4>
            <p className="text-slate-500">
              Over time, see how much money Scope Shield has saved by converting
              free work into billable revenue.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
