/**
 * V2 Hooks - Command Center, Client Health, Agents
 * Premium enterprise-grade data hooks for MarginDefense
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { dataStore } from '@/lib/store';
import { isSupabaseConfigured } from '@/integrations/supabase';

const USE_SUPABASE = isSupabaseConfigured();

/**
 * Command Center Metrics Hook
 * Core KPIs for business health dashboard
 */
export function useCommandCenter(periodDays = 7) {
  const [metrics, setMetrics] = useState({
    billable_ratio: 0,
    billable_ratio_trend: 'stable' as 'up' | 'down' | 'stable',
    at_risk_revenue: 0,
    ai_hours_saved: 0,
    efficiency_score: 0,
    revenue_secure_delta: 0,
    margin_burn_delta: 0,
    active_alerts: 0,
    critical_alerts: 0,
    healthy_clients: 0,
    at_risk_clients: 0,
    total_clients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const data = dataStore.getCommandCenterMetrics(periodDays);
    setMetrics(data);
    setLoading(false);
  }, [periodDays, refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { metrics, loading, refresh };
}

/**
 * Client Health Metrics Hook
 * Per-client margin health, sentiment, and risk scoring
 */
export function useClientHealth() {
  const [clientHealth, setClientHealth] = useState<Array<{
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
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const data = dataStore.getClientHealthMetrics();
    setClientHealth(data);
    setLoading(false);
  }, [refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { clientHealth, loading, refresh };
}

/**
 * Margin Alerts Hook
 * Real-time alerts from the Margin Defender Agent
 */
export function useMarginAlerts() {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: string;
    severity: 'info' | 'warning' | 'critical' | 'emergency';
    title: string;
    description: string;
    impact_amount: number;
    client_id?: string;
    project_id?: string;
    created_at: string;
    resolved_at?: string;
    suggested_action?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const data = dataStore.getMarginAlerts();
    setAlerts(data);
    setLoading(false);
  }, [refreshKey]);

  const acknowledge = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, resolved_at: new Date().toISOString() } : a
    ));
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { alerts, loading, acknowledge, refresh };
}

/**
 * Agent Status Hook
 * Monitor AI agents performance and status
 */
export function useAgentStatus() {
  const [agents, setAgents] = useState<Array<{
    id: string;
    name: string;
    type: string;
    status: 'active' | 'paused' | 'error';
    last_run: string;
    alerts_generated: number;
    actions_taken: number;
    efficiency_score: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const data = dataStore.getAgentStatuses();
    setAgents(data);
    setLoading(false);
  }, [refreshKey]);

  const toggleAgent = useCallback((id: string, action: 'pause' | 'resume') => {
    setAgents(prev => prev.map(a => 
      a.id === id ? { ...a, status: action === 'pause' ? 'paused' : 'active' } : a
    ));
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { agents, loading, toggleAgent, refresh };
}

// Alias for useAgentStatus
export const useAgents = useAgentStatus;

/**
 * Trend Data Hook - Historical data for charts
 */
export function useTrendData(days = 7) {
  const [trendData, setTrendData] = useState<Array<{
    date: string;
    revenue_secure: number;
    margin_burn: number;
    billable_ratio: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = dataStore.getTrendData(days);
    setTrendData(data);
    setLoading(false);
  }, [days]);

  return { trendData, loading };
}

/**
 * Real-time pulse animation hook
 * Creates a subtle pulse effect for live data indicators
 */
export function usePulse(interval = 2000) {
  const [pulse, setPulse] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, interval);
    
    return () => clearInterval(timer);
  }, [interval]);
  
  return pulse;
}

/**
 * Smooth number animation hook
 * For premium counter animations
 */
export function useSmoothCounter(
  targetValue: number, 
  options: { duration?: number; decimals?: number; prefix?: string; suffix?: string } = {}
) {
  const { duration = 800, decimals = 0, prefix = '', suffix = '' } = options;
  const [displayValue, setDisplayValue] = useState(targetValue);
  const previousValue = useRef(targetValue);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startValue = previousValue.current;
    const startTime = performance.now();
    const diff = targetValue - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Premium easing: cubic-bezier approximation
      const eased = 1 - Math.pow(1 - progress, 4);
      
      const current = startValue + diff * eased;
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = targetValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  const formatted = `${prefix}${displayValue.toFixed(decimals)}${suffix}`;
  
  return { value: displayValue, formatted };
}

/**
 * Keyboard shortcut hook - For power users
 */
export function useKeyboardShortcut(
  key: string, 
  callback: () => void, 
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (!modifiers.ctrl || e.ctrlKey || e.metaKey) &&
        (!modifiers.shift || e.shiftKey) &&
        (!modifiers.alt || e.altKey)
      ) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, modifiers]);
}

/**
 * Auto-refresh hook - For real-time dashboard updates
 */
export function useAutoRefresh(callback: () => void, intervalMs = 30000, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    
    const timer = setInterval(callback, intervalMs);
    return () => clearInterval(timer);
  }, [callback, intervalMs, enabled]);
}
