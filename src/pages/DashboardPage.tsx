/**
 * Command Center V3 - Premium Enterprise Dashboard
 * Bloomberg density + Stripe polish + Real data visualization
 * For $100K+/month clients who demand excellence
 */

import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  RefreshCw, TrendingUp, TrendingDown, AlertTriangle, 
  Zap, Shield, ChevronRight, ArrowUpRight, ArrowDownRight,
  Activity, Users, DollarSign, BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMetrics, useWorkLogs, useProjects } from '@/hooks/useData';
import { useCommandCenter, useClientHealth, useMarginAlerts, useTrendData } from '@/hooks/useCommandCenter';

// Animated counter hook
function useAnimatedNumber(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number>(0);
  const startValue = useRef<number>(0);

  useEffect(() => {
    startValue.current = value;
    startTime.current = performance.now();
    
    const animate = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(startValue.current + (target - startValue.current) * eased);
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}

// Format currency compactly
function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (compact && value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(value);
}

// Sparkline component
function Sparkline({ 
  data, 
  dataKey, 
  color, 
  height = 32 
}: { 
  data: any[]; 
  dataKey: string; 
  color: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#gradient-${dataKey})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Hero Metric - THE most important number
function HeroMetric({ 
  value, 
  label, 
  trend,
  trendValue,
  variant = 'default' 
}: { 
  value: number;
  label: string;
  trend: 'up' | 'down' | 'stable';
  trendValue?: number;
  variant?: 'default' | 'burn' | 'secure';
}) {
  const animatedValue = useAnimatedNumber(value);
  
  const variantClasses = {
    default: 'hero-metric__value',
    burn: 'hero-metric__value hero-metric__value--burn',
    secure: 'hero-metric__value hero-metric__value--secure',
  };

  return (
    <div className="hero-metric">
      <div className="flex items-baseline gap-3">
        <span className={variantClasses[variant]}>
          {animatedValue.toFixed(1)}%
        </span>
        {trend !== 'stable' && (
          <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-secure' : 'text-burn'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            <span className="font-data text-lg">{trendValue?.toFixed(1)}%</span>
          </div>
        )}
      </div>
      <p className="text-muted text-sm mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

// Dense KPI Cell
function KPICell({ 
  label, 
  value, 
  format = 'number',
  trend,
  sparkData,
  sparkKey,
  sparkColor,
  status
}: {
  label: string;
  value: number;
  format?: 'number' | 'currency' | 'percent';
  trend?: 'up' | 'down' | 'stable';
  sparkData?: any[];
  sparkKey?: string;
  sparkColor?: string;
  status?: 'good' | 'warning' | 'critical';
}) {
  const animatedValue = useAnimatedNumber(value);
  
  const formatValue = () => {
    switch (format) {
      case 'currency': return formatCurrency(animatedValue, true);
      case 'percent': return `${animatedValue.toFixed(1)}%`;
      default: return Math.round(animatedValue).toLocaleString();
    }
  };

  const statusColors = {
    good: 'text-secure',
    warning: 'text-alert',
    critical: 'text-burn',
  };

  return (
    <div className="data-grid__cell">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="data-grid__label truncate">{label}</p>
          <p className={`data-grid__value text-lg font-semibold ${status ? statusColors[status] : ''}`}>
            {formatValue()}
          </p>
        </div>
        {sparkData && sparkKey && (
          <div className="w-16 flex-shrink-0">
            <Sparkline data={sparkData} dataKey={sparkKey} color={sparkColor || '#22d3ee'} height={24} />
          </div>
        )}
      </div>
      {trend && trend !== 'stable' && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${trend === 'up' ? 'text-secure' : 'text-burn'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trend === 'up' ? 'Rising' : 'Falling'}</span>
        </div>
      )}
    </div>
  );
}

// Client Health Row - Dense table format
function ClientHealthRow({ 
  client, 
  onAction 
}: { 
  client: any;
  onAction?: (id: string) => void;
}) {
  const statusClass = 
    client.health === 'critical' ? 'client-row--critical' :
    client.health === 'warning' ? 'client-row--warning' : '';

  return (
    <div className={`client-row ${statusClass}`}>
      <div className="w-40 flex-shrink-0">
        <p className="text-emphasis text-sm font-medium truncate">{client.client_name}</p>
        <p className="text-muted text-xs truncate">{client.client_id}</p>
      </div>

      <div className="w-24 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`font-data text-sm ${
            client.margin_percentage >= 70 ? 'text-secure' :
            client.margin_percentage >= 50 ? 'text-alert' : 'text-burn'
          }`}>
            {client.margin_percentage.toFixed(0)}%
          </span>
          <div className="flex-1 h-1 bg-[hsla(var(--md-steel),0.3)] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                client.margin_percentage >= 70 ? 'bg-[hsl(var(--md-secure))]' :
                client.margin_percentage >= 50 ? 'bg-[hsl(var(--md-alert))]' : 'bg-[hsl(var(--md-burn))]'
              }`}
              style={{ width: `${Math.min(client.margin_percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="w-24 flex-shrink-0 text-right">
        <span className="font-data text-sm text-secure">{formatCurrency(client.total_revenue, true)}</span>
      </div>

      <div className="w-24 flex-shrink-0 text-right">
        <span className="font-data text-sm text-burn">{formatCurrency(client.total_burn, true)}</span>
      </div>

      <div className="w-16 flex-shrink-0 flex justify-center">
        {client.margin_trend === 'improving' && <TrendingUp className="w-4 h-4 text-secure" />}
        {client.margin_trend === 'declining' && <TrendingDown className="w-4 h-4 text-burn" />}
        {client.margin_trend === 'stable' && <Activity className="w-4 h-4 text-muted" />}
      </div>

      <div className="w-20 flex-shrink-0">
        <span className={`status-badge ${
          client.health === 'excellent' ? 'status-badge--secure' :
          client.health === 'good' ? 'status-badge--neutral' :
          client.health === 'warning' ? 'status-badge--alert' : 'status-badge--burn'
        }`}>
          {client.health}
        </span>
      </div>

      <div className="w-8 flex-shrink-0">
        {(client.health === 'warning' || client.health === 'critical') && (
          <button onClick={() => onAction?.(client.client_id)} className="p-1 rounded hover:bg-[hsla(var(--md-steel),0.3)] transition-colors">
            <ChevronRight className="w-4 h-4 text-muted" />
          </button>
        )}
      </div>
    </div>
  );
}

// Alert Item
function AlertItem({ alert, onAck }: { alert: any; onAck?: (id: string) => void }) {
  const severityColors = {
    info: 'border-l-[hsl(var(--md-info))] bg-[hsla(var(--md-info),0.05)]',
    warning: 'border-l-[hsl(var(--md-alert))] bg-[hsla(var(--md-alert),0.05)]',
    critical: 'border-l-[hsl(var(--md-burn))] bg-[hsla(var(--md-burn),0.05)]',
    emergency: 'border-l-[hsl(var(--md-burn))] bg-[hsla(var(--md-burn),0.1)] critical-pulse',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`flex items-start gap-3 px-3 py-2 border-l-2 ${severityColors[alert.severity as keyof typeof severityColors]}`}
    >
      <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
        alert.severity === 'critical' || alert.severity === 'emergency' ? 'text-burn' : 'text-alert'
      }`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-emphasis">{alert.title}</p>
        <p className="text-xs text-muted mt-0.5">{alert.description}</p>
        {alert.impact_amount > 0 && (
          <p className="text-xs font-data text-burn mt-1">{formatCurrency(alert.impact_amount)} at risk</p>
        )}
      </div>
      {onAck && (
        <button onClick={() => onAck(alert.id)} className="text-xs text-info hover:underline flex-shrink-0">ACK</button>
      )}
    </motion.div>
  );
}

// Main Dashboard
export function DashboardPage() {
  const [period, setPeriod] = useState<7 | 14 | 30>(7);
  
  const { metrics, refresh: refreshMetrics } = useMetrics(period);
  const { metrics: cmdMetrics, refresh: refreshCmd } = useCommandCenter(period);
  const { clientHealth, refresh: refreshClients } = useClientHealth();
  const { alerts, acknowledge, refresh: refreshAlerts } = useMarginAlerts();
  const { trendData } = useTrendData(period);
  const { workLogs, refresh: refreshLogs } = useWorkLogs();
  const { projects, refresh: refreshProjects } = useProjects();

  const handleRefresh = useCallback(() => {
    refreshMetrics();
    refreshCmd();
    refreshClients();
    refreshAlerts();
    refreshLogs();
    refreshProjects();
  }, [refreshMetrics, refreshCmd, refreshClients, refreshAlerts, refreshLogs, refreshProjects]);

  const sparkData = trendData.map((d, i) => ({ ...d, index: i }));
  const criticalAlerts = alerts.filter(a => !a.resolved_at && (a.severity === 'critical' || a.severity === 'emergency'));
  const atRiskClients = clientHealth.filter(c => c.health === 'warning' || c.health === 'critical');
  const totalAtRisk = alerts.filter(a => !a.resolved_at).reduce((sum, a) => sum + a.impact_amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-emphasis">Command Center</h1>
            <div className="live-indicator">
              <span className="live-indicator__dot" />
              <span className="live-indicator__text">Live</span>
            </div>
          </div>
          <p className="text-muted text-sm mt-1">Real-time margin intelligence • {period}-day view</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-[hsl(var(--md-obsidian))] rounded-lg border border-[hsla(var(--md-steel),0.3)]">
            {([7, 14, 30] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  period === p ? 'bg-[hsl(var(--md-graphite))] text-emphasis' : 'text-muted hover:text-primary'
                }`}
              >
                {p}D
              </button>
            ))}
          </div>
          <button onClick={handleRefresh} className="btn-premium">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </header>

      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert-strip">
          <AlertTriangle className="w-5 h-5 text-burn flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm text-emphasis font-medium">
              {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} require immediate attention
            </span>
            <span className="text-sm text-burn ml-2">• {formatCurrency(totalAtRisk)} at risk</span>
          </div>
          <Link to="/scope-shield" className="btn-premium btn-premium--danger text-xs">Review Now</Link>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 data-card p-6">
          <HeroMetric
            value={cmdMetrics.billable_ratio}
            label="Billable Ratio"
            trend={cmdMetrics.billable_ratio_trend}
            trendValue={2.3}
            variant={cmdMetrics.billable_ratio >= 65 ? 'secure' : cmdMetrics.billable_ratio >= 50 ? 'default' : 'burn'}
          />
          
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>0%</span>
              <span className={cmdMetrics.billable_ratio >= 65 ? 'text-secure' : ''}>Target: 65%</span>
              <span>100%</span>
            </div>
            <div className="progress-bar h-2">
              <div 
                className={`progress-bar__fill ${
                  cmdMetrics.billable_ratio >= 65 ? 'progress-bar__fill--secure' :
                  cmdMetrics.billable_ratio >= 50 ? 'progress-bar__fill--alert' : 'progress-bar__fill--burn'
                }`}
                style={{ width: `${cmdMetrics.billable_ratio}%` }}
              />
              <div className="absolute top-0 w-0.5 h-full bg-[hsla(var(--md-platinum),0.5)]" style={{ left: '65%' }} />
            </div>
          </div>

          <div className="mt-4 h-16">
            <Sparkline data={sparkData} dataKey="billable_ratio" color={cmdMetrics.billable_ratio >= 65 ? 'hsl(158, 64%, 45%)' : 'hsl(4, 90%, 58%)'} height={64} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="data-grid grid-cols-3">
            <KPICell label="Revenue Secure" value={metrics.total_revenue_secure} format="currency" sparkData={sparkData} sparkKey="revenue_secure" sparkColor="hsl(158, 64%, 45%)" status="good" />
            <KPICell label="Margin Burn" value={metrics.total_margin_burn} format="currency" sparkData={sparkData} sparkKey="margin_burn" sparkColor="hsl(4, 90%, 58%)" status={metrics.total_margin_burn > 10000 ? 'critical' : 'warning'} />
            <KPICell label="At-Risk Revenue" value={cmdMetrics.at_risk_revenue} format="currency" status={cmdMetrics.at_risk_revenue > 15000 ? 'critical' : cmdMetrics.at_risk_revenue > 5000 ? 'warning' : 'good'} />
            <KPICell label="AI Hours Saved" value={cmdMetrics.ai_hours_saved} trend="up" />
            <KPICell label="Efficiency Score" value={cmdMetrics.efficiency_score} format="percent" status={cmdMetrics.efficiency_score >= 80 ? 'good' : cmdMetrics.efficiency_score >= 60 ? 'warning' : 'critical'} />
            <KPICell label="Active Alerts" value={cmdMetrics.active_alerts} status={cmdMetrics.critical_alerts > 0 ? 'critical' : cmdMetrics.active_alerts > 5 ? 'warning' : 'good'} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8 data-card">
          <div className="px-4 py-3 border-b border-[hsla(var(--md-steel),0.3)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted" />
                <h2 className="text-sm font-semibold text-emphasis">Client Health</h2>
                {atRiskClients.length > 0 && <span className="status-badge status-badge--burn">{atRiskClients.length} at risk</span>}
              </div>
              <span className="text-xs text-muted">{clientHealth.length} clients</span>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-2 text-xs text-muted uppercase tracking-wider border-b border-[hsla(var(--md-steel),0.2)]">
            <div className="w-40 flex-shrink-0">Client</div>
            <div className="w-24 flex-shrink-0">Margin</div>
            <div className="w-24 flex-shrink-0 text-right">Revenue</div>
            <div className="w-24 flex-shrink-0 text-right">Burn</div>
            <div className="w-16 flex-shrink-0 text-center">Trend</div>
            <div className="w-20 flex-shrink-0">Status</div>
            <div className="w-8 flex-shrink-0"></div>
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {clientHealth.sort((a, b) => b.risk_score - a.risk_score).map((client) => (
              <ClientHealthRow key={client.client_id} client={client} />
            ))}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 data-card">
          <div className="px-4 py-3 border-b border-[hsla(var(--md-steel),0.3)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted" />
                <h2 className="text-sm font-semibold text-emphasis">Margin Alerts</h2>
              </div>
              {cmdMetrics.critical_alerts > 0 && <span className="status-badge status-badge--burn animate-pulse">{cmdMetrics.critical_alerts} critical</span>}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-[hsla(var(--md-steel),0.2)]">
            <AnimatePresence mode="popLayout">
              {alerts.filter(a => !a.resolved_at).slice(0, 8).map((alert) => (
                <AlertItem key={alert.id} alert={alert} onAck={acknowledge} />
              ))}
            </AnimatePresence>
            {alerts.filter(a => !a.resolved_at).length === 0 && (
              <div className="p-8 text-center">
                <Shield className="w-8 h-8 text-secure mx-auto mb-2 opacity-50" />
                <p className="text-muted text-sm">All clear</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trend Chart */}
      <section className="data-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted" />
            <h2 className="text-sm font-semibold text-emphasis">Revenue vs Burn Trend</h2>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[hsl(var(--md-secure))] rounded" />Revenue Secure</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[hsl(var(--md-burn))] rounded" />Margin Burn</span>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="secureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(158, 64%, 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(158, 64%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(4, 90%, 58%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(4, 90%, 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(218, 11%, 35%)', fontSize: 10 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(218, 11%, 35%)', fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} width={50} />
              <Tooltip contentStyle={{ background: 'hsl(225, 20%, 7%)', border: '1px solid hsl(220, 13%, 18%)', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: 'hsl(220, 8%, 85%)' }} formatter={(value) => [formatCurrency(Number(value)), '']} />
              <Area type="monotone" dataKey="revenue_secure" stroke="hsl(158, 64%, 45%)" strokeWidth={2} fill="url(#secureGradient)" name="Revenue" />
              <Area type="monotone" dataKey="margin_burn" stroke="hsl(4, 90%, 58%)" strokeWidth={2} fill="url(#burnGradient)" name="Burn" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Work Logs', value: workLogs.length, icon: Activity },
          { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length, icon: BarChart3 },
          { label: 'Avg Hourly Rate', value: '$75', icon: DollarSign },
          { label: 'Auto Classification', value: '95%', icon: Zap },
        ].map((stat, i) => (
          <div key={i} className="data-card px-4 py-3 flex items-center gap-3">
            <stat.icon className="w-4 h-4 text-muted" />
            <div>
              <p className="font-data text-lg text-emphasis">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default DashboardPage;
