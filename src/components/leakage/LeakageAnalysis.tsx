/**
 * LeakageAnalysis Component
 * Charts and tables showing where margin is being burned
 */

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Flame, Users, Layers, AlertTriangle, TrendingDown } from 'lucide-react';
import { cn, formatMoney, formatRelativeTime } from '@/lib/utils';
import { getBurnReasonLabel } from '@/lib/classifier';
import type { WorkLog, BurnReason } from '@/types';

interface LeakageAnalysisProps {
  byCategory: { category: BurnReason; total: number; count: number }[];
  byClient: { client_id: string; client_name: string; total_burn: number; total_billable: number }[];
  hallOfShame: WorkLog[];
  className?: string;
}

// Color palette for charts
const COLORS = {
  burn: '#ef4444',
  burnLight: '#fca5a5',
  secure: '#22c55e',
  categories: ['#ef4444', '#f97316', '#eab308', '#a855f7', '#3b82f6', '#6366f1', '#ec4899', '#14b8a6'],
};

export function LeakageAnalysis({
  byCategory,
  byClient,
  hallOfShame,
  className,
}: LeakageAnalysisProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burn by Client */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
        >
          <div className="flex items-center gap-2 p-4 border-b border-slate-800/50">
            <Users className="w-5 h-5 text-burn-500" />
            <h3 className="font-display font-semibold text-white">Burn by Client</h3>
          </div>
          <div className="p-4">
            {byClient.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={byClient}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                >
                  <XAxis
                    type="number"
                    tickFormatter={(v) => formatMoney(v)}
                    stroke="#475569"
                    fontSize={12}
                  />
                  <YAxis
                    type="category"
                    dataKey="client_name"
                    stroke="#475569"
                    fontSize={12}
                    width={70}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
                          <p className="font-medium text-white mb-1">{data.client_name}</p>
                          <p className="text-burn-400 text-sm">
                            Burn: {formatMoney(data.total_burn)}
                          </p>
                          <p className="text-secure-400 text-sm">
                            Billable: {formatMoney(data.total_billable)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="total_burn" fill={COLORS.burn} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                No data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Burn by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel"
        >
          <div className="flex items-center gap-2 p-4 border-b border-slate-800/50">
            <Layers className="w-5 h-5 text-burn-500" />
            <h3 className="font-display font-semibold text-white">Burn by Category</h3>
          </div>
          <div className="p-4">
            {byCategory.length > 0 ? (
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie
                      data={byCategory}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {byCategory.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS.categories[index % COLORS.categories.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
                            <p className="font-medium text-white mb-1">
                              {getBurnReasonLabel(data.category)}
                            </p>
                            <p className="text-burn-400 text-sm">
                              {formatMoney(data.total)}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {data.count} occurrences
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {byCategory.map((item, index) => (
                    <div key={item.category} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS.categories[index % COLORS.categories.length],
                        }}
                      />
                      <span className="text-sm text-slate-400 flex-1">
                        {getBurnReasonLabel(item.category)}
                      </span>
                      <span className="text-sm font-mono text-burn-400">
                        {formatMoney(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-500">
                No data available
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Hall of Shame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel"
      >
        <div className="flex items-center gap-2 p-4 border-b border-slate-800/50">
          <Flame className="w-5 h-5 text-burn-500" />
          <h3 className="font-display font-semibold text-white">Hall of Shame</h3>
          <span className="text-xs text-slate-500 ml-auto">
            Most expensive burn events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Rank</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-right">Cost Impact</th>
                <th className="p-4 font-medium text-right">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {hallOfShame.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-burn-950/20 transition-colors"
                >
                  <td className="p-4">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                        index === 0 && 'bg-burn-600 text-white',
                        index === 1 && 'bg-burn-700 text-burn-200',
                        index === 2 && 'bg-burn-800 text-burn-300',
                        index > 2 && 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-medium truncate max-w-xs">
                      {log.description}
                    </p>
                  </td>
                  <td className="p-4 text-slate-400">
                    {log.client?.name || '—'}
                  </td>
                  <td className="p-4">
                    <span className="status-badge burn">
                      {getBurnReasonLabel(log.burn_reason)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-mono font-bold text-burn-400">
                      -{formatMoney(log.cost_impact)}
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-500 text-sm">
                    {formatRelativeTime(log.created_at)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {hallOfShame.length === 0 && (
            <div className="p-12 text-center">
              <TrendingDown className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-slate-500">No burn events recorded</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
