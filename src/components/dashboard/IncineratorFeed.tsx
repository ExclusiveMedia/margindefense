/**
 * IncineratorFeed Component
 * Live feed of margin burn events with reclassification actions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Check, Clock, AlertTriangle, ChevronRight, RefreshCw } from 'lucide-react';
import { cn, formatMoney, formatRelativeTime, formatDuration } from '@/lib/utils';
import { getCategoryInfo, getBurnReasonLabel } from '@/lib/classifier';
import type { WorkLog, WorkCategory } from '@/types';

interface IncineratorFeedProps {
  workLogs: WorkLog[];
  onReclassify?: (id: string, category: WorkCategory) => void;
  maxItems?: number;
  className?: string;
}

export function IncineratorFeed({
  workLogs,
  onReclassify,
  maxItems = 10,
  className,
}: IncineratorFeedProps) {
  const displayLogs = workLogs.slice(0, maxItems);

  return (
    <div className={cn('glass-panel', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-burn-500" />
          <h3 className="font-display font-semibold text-white">
            The Incinerator Feed
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          {workLogs.length} events
        </span>
      </div>

      {/* Feed List */}
      <div className="divide-y divide-slate-800/50 max-h-[500px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {displayLogs.map((log, index) => (
            <FeedItem
              key={log.id}
              log={log}
              index={index}
              onReclassify={onReclassify}
            />
          ))}
        </AnimatePresence>

        {displayLogs.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <Flame className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No work logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface FeedItemProps {
  log: WorkLog;
  index: number;
  onReclassify?: (id: string, category: WorkCategory) => void;
}

function FeedItem({ log, index, onReclassify }: FeedItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryInfo = getCategoryInfo(log.category);
  const isBurn = log.category === 'margin_burn' || log.category === 'scope_risk';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'p-4 transition-colors cursor-pointer',
        isBurn ? 'hover:bg-burn-950/30' : 'hover:bg-secure-950/30',
        isBurn && 'border-l-4 border-l-burn-500',
        log.category === 'billable' && 'border-l-4 border-l-secure-500',
        log.category === 'unclassified' && 'border-l-4 border-l-slate-600'
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{categoryInfo.icon}</span>
            <p className="text-white font-medium truncate">{log.description}</p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(log.duration_minutes)}
            </span>
            {log.client?.name && (
              <span className="truncate">{log.client.name}</span>
            )}
            {log.burn_reason && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide',
                  categoryInfo.bgColor,
                  categoryInfo.color
                )}
              >
                {getBurnReasonLabel(log.burn_reason)}
              </span>
            )}
          </div>
        </div>

        {/* Cost impact */}
        <div className="flex flex-col items-end">
          <span
            className={cn(
              'font-mono font-bold text-lg',
              isBurn ? 'text-burn-400' : 'text-secure-400'
            )}
          >
            {isBurn ? '-' : '+'}
            {formatMoney(log.cost_impact)}
          </span>
          <span className="text-xs text-slate-500">
            {formatRelativeTime(log.created_at)}
          </span>
        </div>

        <ChevronRight
          className={cn(
            'w-4 h-4 text-slate-600 transition-transform',
            isExpanded && 'rotate-90'
          )}
        />
      </div>

      {/* Expanded actions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 mr-2">Reclassify:</span>

                {isBurn && onReclassify && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReclassify(log.id, 'billable');
                    }}
                    className="control-btn success text-xs py-1 px-2"
                  >
                    <Check className="w-3 h-3" />
                    Mark Billable
                  </button>
                )}

                {!isBurn && onReclassify && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReclassify(log.id, 'margin_burn');
                    }}
                    className="control-btn danger text-xs py-1 px-2"
                  >
                    <Flame className="w-3 h-3" />
                    Mark as Burn
                  </button>
                )}

                {log.category === 'unclassified' && onReclassify && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReclassify(log.id, 'billable');
                      }}
                      className="control-btn success text-xs py-1 px-2"
                    >
                      <Check className="w-3 h-3" />
                      Billable
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReclassify(log.id, 'margin_burn');
                      }}
                      className="control-btn danger text-xs py-1 px-2"
                    >
                      <Flame className="w-3 h-3" />
                      Burn
                    </button>
                  </>
                )}
              </div>

              {/* Metadata */}
              {log.metadata && (
                <div className="mt-2 text-xs text-slate-600">
                  {(log.metadata as { confidence?: number }).confidence && (
                    <span>
                      AI Confidence:{' '}
                      {Math.round(
                        ((log.metadata as { confidence: number }).confidence ?? 0) * 100
                      )}
                      %
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Loading skeleton for the feed
 */
export function IncineratorFeedSkeleton() {
  return (
    <div className="glass-panel animate-pulse">
      <div className="p-4 border-b border-slate-800/50">
        <div className="h-5 w-40 bg-slate-800 rounded" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 border-b border-slate-800/50">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-4 w-64 bg-slate-800 rounded" />
              <div className="h-3 w-32 bg-slate-800 rounded" />
            </div>
            <div className="h-6 w-20 bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
