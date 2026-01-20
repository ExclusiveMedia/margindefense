/**
 * React hooks for MarginDefense data management
 * 
 * Supports both Supabase (production) and mock store (demo mode)
 * 
 * Mode is determined by VITE_SUPABASE_URL environment variable:
 * - If set: Uses Supabase for real data persistence
 * - If not set: Uses in-memory mock store for demo
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { dataStore } from '@/lib/store';
import { isSupabaseConfigured } from '@/integrations/supabase';
import * as api from '@/integrations/supabase/api';
import type { WorkLog, ScopeRequest, WorkCategory, BurnReason, Project, Client, Organization } from '@/types';

// Check if we're using Supabase or mock store
const USE_SUPABASE = isSupabaseConfigured();

/**
 * Hook for dashboard metrics
 */
export function useMetrics(periodDays = 7) {
  const [metrics, setMetrics] = useState({
    total_revenue_secure: 0,
    total_margin_burn: 0,
    burn_ratio: 0,
    scope_requests_pending: 0,
    scope_requests_value: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (USE_SUPABASE) {
      setLoading(true);
      api.getMetrics(periodDays).then(({ data, error }) => {
        if (data && !error) {
          setMetrics(data);
        }
        setLoading(false);
      });
    } else {
      setMetrics(dataStore.getMetrics(periodDays));
      setLoading(false);
    }
  }, [periodDays, refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { metrics, loading, refresh };
}

/**
 * Hook for work logs with filtering
 */
export function useWorkLogs(filters?: {
  category?: WorkCategory;
  client_id?: string;
  project_id?: string;
  start_date?: string;
  end_date?: string;
}) {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (USE_SUPABASE) {
      setLoading(true);
      api.getWorkLogs(filters).then(({ data, error }) => {
        if (data && !error) {
          setWorkLogs(data as unknown as WorkLog[]);
        }
        setLoading(false);
      });
    } else {
      setWorkLogs(dataStore.getWorkLogs(filters));
      setLoading(false);
    }
  }, [filters, refreshKey]);

  const createWorkLog = useCallback(
    async (data: {
      description: string;
      duration_minutes: number;
      project_id?: string;
      client_id?: string;
    }) => {
      if (USE_SUPABASE) {
        const { data: log, error } = await api.createWorkLog(data);
        if (!error) {
          setRefreshKey((k) => k + 1);
        }
        return log;
      } else {
        const log = dataStore.createWorkLog(data);
        setRefreshKey((k) => k + 1);
        return log;
      }
    },
    []
  );

  const reclassify = useCallback(
    async (id: string, category: WorkCategory, burn_reason?: BurnReason) => {
      if (USE_SUPABASE) {
        const { data: log, error } = await api.reclassifyWorkLog(id, category, burn_reason);
        if (!error) {
          setRefreshKey((k) => k + 1);
        }
        return log;
      } else {
        const log = dataStore.reclassifyWorkLog(id, category, burn_reason);
        setRefreshKey((k) => k + 1);
        return log;
      }
    },
    []
  );

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { workLogs, loading, createWorkLog, reclassify, refresh };
}

/**
 * Hook for scope requests (The Scope Shield)
 */
export function useScopeRequests(status?: ScopeRequest['status']) {
  const [requests, setRequests] = useState<ScopeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (USE_SUPABASE) {
      setLoading(true);
      api.getScopeRequests(status).then(({ data, error }) => {
        if (data && !error) {
          setRequests(data as unknown as ScopeRequest[]);
        }
        setLoading(false);
      });
    } else {
      setRequests(dataStore.getScopeRequests(status));
      setLoading(false);
    }
  }, [status, refreshKey]);

  const resolve = useCallback(
    async (id: string, resolution: 'accepted_burn' | 'converted_revenue' | 'rejected') => {
      if (USE_SUPABASE) {
        const { error } = await api.resolveScopeRequest(id, resolution);
        if (!error) {
          setRefreshKey((k) => k + 1);
        }
      } else {
        dataStore.resolveScopeRequest(id, resolution);
        setRefreshKey((k) => k + 1);
      }
    },
    []
  );

  const create = useCallback(
    async (data: {
      title: string;
      description: string;
      client_id?: string;
      project_id?: string;
      estimated_hours?: number;
    }) => {
      if (USE_SUPABASE) {
        const { data: request, error } = await api.createScopeRequest(data);
        if (!error) {
          setRefreshKey((k) => k + 1);
        }
        return request;
      } else {
        const request = dataStore.createScopeRequest(data);
        setRefreshKey((k) => k + 1);
        return request;
      }
    },
    []
  );

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { requests, loading, resolve, create, refresh };
}

/**
 * Hook for leakage analysis data
 */
export function useLeakageAnalysis(periodDays = 7) {
  const [byCategory, setByCategory] = useState<{ category: BurnReason; total: number; count: number }[]>([]);
  const [byClient, setByClient] = useState<{ client_id: string; client_name: string; total_burn: number; total_billable: number }[]>([]);
  const [hallOfShame, setHallOfShame] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (USE_SUPABASE) {
      setLoading(true);
      Promise.all([
        api.getBurnByCategory(periodDays),
        api.getBurnByClient(periodDays),
        api.getHallOfShame(5),
      ]).then(([categoryRes, clientRes, shameRes]) => {
        if (categoryRes.data) setByCategory(categoryRes.data as { category: BurnReason; total: number; count: number }[]);
        if (clientRes.data) setByClient(clientRes.data);
        if (shameRes.data) setHallOfShame(shameRes.data as unknown as WorkLog[]);
        setLoading(false);
      });
    } else {
      setByCategory(dataStore.getBurnByCategory(periodDays));
      setByClient(dataStore.getBurnByClient(periodDays));
      setHallOfShame(dataStore.getHallOfShame(5));
      setLoading(false);
    }
  }, [periodDays, refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { byCategory, byClient, hallOfShame, loading, refresh };
}

/**
 * Hook for projects
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (USE_SUPABASE) {
      setLoading(true);
      api.getProjects().then(({ data, error }) => {
        if (data && !error) {
          setProjects(data as unknown as Project[]);
        }
        setLoading(false);
      });
    } else {
      setProjects(dataStore.getProjects());
      setLoading(false);
    }
  }, [refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { projects, loading, refresh };
}

/**
 * Hook for clients
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (USE_SUPABASE) {
      setLoading(true);
      api.getClients().then(({ data, error }) => {
        if (data && !error) {
          setClients(data as Client[]);
        }
        setLoading(false);
      });
    } else {
      setClients(dataStore.getClients());
      setLoading(false);
    }
  }, [refreshKey]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { clients, loading, refresh };
}

/**
 * Hook for organization settings
 */
export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (USE_SUPABASE) {
      setLoading(true);
      api.getOrganization().then(({ data, error }) => {
        if (data && !error) {
          setOrganization(data as Organization);
        }
        setLoading(false);
      });
    } else {
      setOrganization(dataStore.getOrganization());
      setLoading(false);
    }
  }, [refreshKey]);

  const update = useCallback(
    async (updates: { name?: string; currency_symbol?: string; global_hourly_cost?: number }) => {
      if (USE_SUPABASE) {
        const { data: org, error } = await api.updateOrganization(updates);
        if (!error && org) {
          setOrganization(org as Organization);
        }
        return org;
      } else {
        const org = dataStore.updateOrganization(updates);
        setOrganization(org);
        return org;
      }
    },
    []
  );

  return { organization, loading, update };
}

/**
 * Hook for animated counter effect
 */
export function useAnimatedCounter(targetValue: number, duration = 1000) {
  const [displayValue, setDisplayValue] = useState(targetValue);

  const animate = useCallback((from: number, to: number) => {
    const startTime = Date.now();
    const diff = to - from;

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(from + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [duration]);

  return { displayValue, animate, setDisplayValue };
}

/**
 * Hook to check data source mode
 */
export function useDataMode() {
  return {
    mode: USE_SUPABASE ? 'supabase' : 'demo',
    isSupabase: USE_SUPABASE,
    isDemo: !USE_SUPABASE,
  };
}
