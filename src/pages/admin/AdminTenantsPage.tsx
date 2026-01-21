/**
 * Tenant Management Page
 * Super Admin view for managing all agencies/tenants
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Search,
  Filter,
  MoreVertical,
  Users,
  DollarSign,
  Calendar,
  ExternalLink,
  UserCog,
} from 'lucide-react';

// Mock tenant data
const tenants = [
  { 
    id: 'tenant_001', 
    name: 'Sterling & Associates', 
    slug: 'sterling', 
    plan: 'Enterprise', 
    mrr: 4500, 
    status: 'active',
    users: 18,
    clients: 24,
    createdAt: '2024-03-15',
    owner: 'James Sterling'
  },
  { 
    id: 'tenant_002', 
    name: 'Quantum Digital', 
    slug: 'quantum', 
    plan: 'Professional', 
    mrr: 1500, 
    status: 'active',
    users: 8,
    clients: 12,
    createdAt: '2024-05-22',
    owner: 'Sarah Chen'
  },
  { 
    id: 'tenant_003', 
    name: 'Nova Creative', 
    slug: 'nova', 
    plan: 'Professional', 
    mrr: 1500, 
    status: 'trial',
    users: 5,
    clients: 4,
    createdAt: '2025-01-10',
    owner: 'Mike Johnson'
  },
  { 
    id: 'tenant_004', 
    name: 'Apex Solutions', 
    slug: 'apex', 
    plan: 'Starter', 
    mrr: 500, 
    status: 'active',
    users: 3,
    clients: 6,
    createdAt: '2024-08-01',
    owner: 'Lisa Park'
  },
  { 
    id: 'tenant_005', 
    name: 'Frontier Labs', 
    slug: 'frontier', 
    plan: 'Enterprise', 
    mrr: 4500, 
    status: 'past_due',
    users: 12,
    clients: 18,
    createdAt: '2024-02-28',
    owner: 'David Wong'
  },
];

export function AdminTenantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--md-text-emphasis))]">Tenant Management</h1>
          <p className="text-sm text-[hsl(var(--md-text-muted))] mt-1">
            Manage all agencies on the platform
          </p>
        </div>
        <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors">
          + Add Tenant
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--md-text-muted))]" />
          <input
            type="text"
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[hsl(var(--md-bg-secondary))] border border-[hsl(var(--md-border-subtle))] text-[hsl(var(--md-text-primary))] text-sm placeholder:text-[hsl(var(--md-text-muted))] focus:outline-none focus:ring-2 focus:ring-violet-500/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-[hsl(var(--md-bg-secondary))] border border-[hsl(var(--md-border-subtle))] text-[hsl(var(--md-text-primary))] text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="past_due">Past Due</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Tenants Table */}
      <div className="rounded-2xl bg-[hsl(var(--md-bg-secondary))] border border-[hsl(var(--md-border-subtle))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[hsl(var(--md-border-subtle))]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--md-text-muted))] uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--md-text-muted))] uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--md-text-muted))] uppercase tracking-wider">
                  MRR
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--md-text-muted))] uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--md-text-muted))] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--md-text-muted))] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--md-border-subtle))]">
              {filteredTenants.map((tenant, index) => (
                <motion.tr
                  key={tenant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[hsl(var(--md-bg-hover))] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-violet-500" />
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--md-text-emphasis))]">{tenant.name}</p>
                        <p className="text-xs text-[hsl(var(--md-text-muted))]">{tenant.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tenant.plan === 'Enterprise' ? 'bg-amber-500/10 text-amber-500' :
                      tenant.plan === 'Professional' ? 'bg-violet-500/10 text-violet-500' :
                      'bg-[hsl(var(--md-bg-elevated))] text-[hsl(var(--md-text-secondary))]'
                    }`}>
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[hsl(var(--md-text-emphasis))]">
                      ${tenant.mrr.toLocaleString()}/mo
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-[hsl(var(--md-text-secondary))]">
                      <Users className="w-4 h-4" />
                      {tenant.users}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-semibold uppercase ${
                      tenant.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                      tenant.status === 'trial' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 text-[hsl(var(--md-text-muted))] hover:text-violet-500 hover:bg-violet-500/10 rounded-lg transition-colors"
                        title="Impersonate"
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-[hsl(var(--md-text-muted))] hover:text-[hsl(var(--md-text-emphasis))] hover:bg-[hsl(var(--md-bg-elevated))] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-[hsl(var(--md-text-muted))] hover:text-[hsl(var(--md-text-emphasis))] hover:bg-[hsl(var(--md-bg-elevated))] rounded-lg transition-colors"
                        title="More Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminTenantsPage;
