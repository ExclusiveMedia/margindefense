/**
 * Settings Page
 * Configure organization settings and integrations
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  DollarSign,
  Zap,
  Database,
  RefreshCw,
  Check,
  ExternalLink,
  Slack,
  Mail,
  FileSpreadsheet,
} from 'lucide-react';
import { useOrganization } from '@/hooks/useData';
import { dataStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const { organization, loading, update } = useOrganization();
  const [hourlyRate, setHourlyRate] = useState('');
  const [orgName, setOrgName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Update form when organization loads
  useEffect(() => {
    if (organization) {
      setHourlyRate(organization.global_hourly_cost.toString());
      setOrgName(organization.name);
    }
  }, [organization]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    update({
      name: orgName,
      global_hourly_cost: parseFloat(hourlyRate) || 50,
    });
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all data to demo defaults? This cannot be undone.')) {
      dataStore.reset();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-display font-bold text-white"
        >
          Settings
        </motion.h1>
        <p className="text-slate-500 text-sm mt-1">
          Configure your margin defense system
        </p>
      </div>

      {/* Organization Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
      >
        <div className="flex items-center gap-2 p-4 border-b border-slate-800/50">
          <Building2 className="w-5 h-5 text-slate-400" />
          <h3 className="font-display font-semibold text-white">Organization</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              Organization Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">
              <DollarSign className="w-3 h-3 inline mr-1" />
              Default Hourly Rate
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">$</span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                min="1"
                className="w-32 px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-600"
              />
              <span className="text-slate-500">/ hour</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Used to calculate cost impact for work logs
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="control-btn success"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : showSaved ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </motion.div>

      {/* Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel"
      >
        <div className="flex items-center gap-2 p-4 border-b border-slate-800/50">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="font-display font-semibold text-white">Integrations</h3>
          <span className="ml-auto text-xs text-slate-500">Coming Soon</span>
        </div>
        <div className="p-4 space-y-3">
          <IntegrationItem
            icon={<Slack className="w-5 h-5" />}
            name="Slack"
            description="Auto-detect scope creep from client channels"
            status="coming_soon"
          />
          <IntegrationItem
            icon={<Mail className="w-5 h-5" />}
            name="Email"
            description="Forward client emails for analysis"
            status="coming_soon"
          />
          <IntegrationItem
            icon={<FileSpreadsheet className="w-5 h-5" />}
            name="CSV Import"
            description="Import time logs from Harvest, Toggl, etc."
            status="available"
          />
          <IntegrationItem
            icon={<Database className="w-5 h-5" />}
            name="Jira / Asana"
            description="Sync tasks and track billable vs non-billable"
            status="coming_soon"
          />
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="burn-card"
      >
        <div className="flex items-center gap-2 p-4 border-b border-burn-800/50">
          <span className="text-burn-500">⚠️</span>
          <h3 className="font-display font-semibold text-burn-400">Danger Zone</h3>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Reset Demo Data</p>
              <p className="text-sm text-slate-500">
                Clear all work logs and restore demo data
              </p>
            </div>
            <button
              onClick={handleResetDemo}
              className="control-btn danger"
            >
              Reset Data
            </button>
          </div>
        </div>
      </motion.div>

      {/* Version Info */}
      <div className="text-center text-xs text-slate-600 py-4">
        <p>MarginDefense.ai v0.1.0 MVP</p>
        <p className="mt-1">Built for TORQOS • Revenue Operating System</p>
      </div>
    </div>
  );
}

interface IntegrationItemProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  status: 'available' | 'connected' | 'coming_soon';
}

function IntegrationItem({ icon, name, description, status }: IntegrationItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-800/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {status === 'coming_soon' && (
        <span className="text-xs text-slate-500 px-2 py-1 rounded bg-slate-800">
          Coming Soon
        </span>
      )}
      {status === 'available' && (
        <button className="control-btn text-xs py-1.5">
          <ExternalLink className="w-3 h-3" />
          Connect
        </button>
      )}
      {status === 'connected' && (
        <span className="text-xs text-secure-400 px-2 py-1 rounded bg-secure-950/50 flex items-center gap-1">
          <Check className="w-3 h-3" />
          Connected
        </span>
      )}
    </div>
  );
}
