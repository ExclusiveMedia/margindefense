/**
 * Leakage Analysis Page
 * Deep dive into where margin is being burned
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { LeakageAnalysis } from '@/components/leakage/LeakageAnalysis';
import { useLeakageAnalysis } from '@/hooks/useData';
import { cn } from '@/lib/utils';

const PERIOD_OPTIONS = [
  { value: 7, label: '7 Days' },
  { value: 14, label: '14 Days' },
  { value: 30, label: '30 Days' },
  { value: 90, label: '90 Days' },
];

export function LeakagePage() {
  const [periodDays, setPeriodDays] = useState(7);
  const { byCategory, byClient, hallOfShame } = useLeakageAnalysis(periodDays);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-display font-bold text-white"
          >
            Leakage Analysis
          </motion.h1>
          <p className="text-slate-500 text-sm mt-1">
            Forensic breakdown of where your margins go to die
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <div className="flex rounded-lg border border-slate-800 overflow-hidden">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriodDays(option.value)}
                className={cn(
                  'px-3 py-1.5 text-sm transition-colors',
                  periodDays === option.value
                    ? 'bg-burn-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis */}
      <LeakageAnalysis
        byCategory={byCategory}
        byClient={byClient}
        hallOfShame={hallOfShame}
      />

      {/* Insights Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-6"
      >
        <h3 className="font-display font-semibold text-white mb-4">
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {byCategory.length > 0 && (
            <InsightCard
              icon="🎯"
              title="Biggest Burn Category"
              description={`"${byCategory[0].category}" is your #1 margin killer, responsible for $${byCategory[0].total.toLocaleString()} in losses.`}
              action="Consider implementing stricter controls around this activity type."
            />
          )}
          {byClient.length > 0 && byClient[0].total_burn > 0 && (
            <InsightCard
              icon="🏢"
              title="Highest Burn Client"
              description={`${byClient[0].client_name} generates the most non-billable overhead ($${byClient[0].total_burn.toLocaleString()}).`}
              action="Review the SOW and consider renegotiating scope boundaries."
            />
          )}
          {hallOfShame.length > 0 && hallOfShame[0].cost_impact > 300 && (
            <InsightCard
              icon="💸"
              title="Expensive Single Event"
              description={`One event cost you $${hallOfShame[0].cost_impact.toLocaleString()} - that's significant.`}
              action="Add this to your scope creep detection rules."
            />
          )}
          <InsightCard
            icon="📈"
            title="Trend Analysis"
            description="Track these metrics over time to see if your margin defense is improving."
            action="Compare 30-day vs 7-day to spot patterns."
          />
        </div>
      </motion.div>
    </div>
  );
}

interface InsightCardProps {
  icon: string;
  title: string;
  description: string;
  action: string;
}

function InsightCard({ icon, title, description, action }: InsightCardProps) {
  return (
    <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800/50">
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <h4 className="font-medium text-white mb-1">{title}</h4>
          <p className="text-slate-400 text-sm mb-2">{description}</p>
          <p className="text-burn-400 text-xs">💡 {action}</p>
        </div>
      </div>
    </div>
  );
}
