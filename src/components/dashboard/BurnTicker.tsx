/**
 * BurnTicker Component
 * The visceral, animated money counter that makes margin burn HURT
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn, formatMoney } from '@/lib/utils';

interface BurnTickerProps {
  value: number;
  label: string;
  type: 'burn' | 'secure' | 'ratio';
  subtitle?: string;
  className?: string;
  showTrend?: boolean;
  trendValue?: number;
}

export function BurnTicker({
  value,
  label,
  type,
  subtitle,
  className,
  showTrend,
  trendValue = 0,
}: BurnTickerProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(value);

  // Animate value changes
  useEffect(() => {
    if (value === prevValue.current) return;

    setIsAnimating(true);
    const startValue = prevValue.current;
    const diff = value - startValue;
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(startValue + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value]);

  const isCritical = type === 'burn' && value > 2000;
  const isHighRatio = type === 'ratio' && value > 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        type === 'burn' && 'burn-card',
        type === 'burn' && isCritical && 'critical',
        type === 'secure' && 'secure-card',
        type === 'ratio' && (isHighRatio ? 'burn-card' : 'glass-panel'),
        className
      )}
    >
      {/* Background glow effect */}
      {type === 'burn' && (
        <div className="absolute inset-0 bg-gradient-to-br from-burn-500/10 to-transparent pointer-events-none" />
      )}
      {type === 'secure' && (
        <div className="absolute inset-0 bg-gradient-to-br from-secure-500/10 to-transparent pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {type === 'burn' && (
            <motion.div
              animate={isCritical ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Flame className="w-5 h-5 text-burn-500" />
            </motion.div>
          )}
          {type === 'secure' && <TrendingUp className="w-5 h-5 text-secure-500" />}
          {type === 'ratio' && isHighRatio && (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          )}
          <span
            className={cn(
              'text-sm font-medium uppercase tracking-wider',
              type === 'burn' && 'text-burn-400',
              type === 'secure' && 'text-secure-400',
              type === 'ratio' && (isHighRatio ? 'text-yellow-400' : 'text-slate-400')
            )}
          >
            {label}
          </span>
        </div>

        {showTrend && trendValue !== 0 && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs',
              trendValue > 0 ? 'text-burn-400' : 'text-secure-400'
            )}
          >
            {trendValue > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(trendValue)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <AnimatePresence mode="wait">
        <motion.div
          key={Math.round(displayValue)}
          initial={isAnimating ? { y: -10, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'font-mono font-bold tabular-nums tracking-tight',
            type === 'burn' && 'burn-ticker',
            type === 'secure' && 'secure-ticker',
            type === 'ratio' &&
              cn(
                'text-5xl',
                isHighRatio ? 'text-yellow-400' : 'text-slate-300'
              )
          )}
        >
          {type === 'ratio' ? (
            <span>{displayValue.toFixed(1)}%</span>
          ) : (
            <span>
              {type === 'burn' && '-'}
              {formatMoney(displayValue)}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      )}

      {/* Critical warning pulse */}
      {(isCritical || isHighRatio) && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-burn-500/50"
          animate={{
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
}
