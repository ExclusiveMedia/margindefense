/**
 * Authentication Context
 * Manages auth state, login/logout, and role-based access control
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { 
  User, 
  Tenant, 
  AuthState, 
  AccessTier, 
  UserRole,
  LoginCredentials 
} from '@/types/auth';
import { ROLE_TO_TIER, ROLE_PERMISSIONS, hasPermission, canAccessTier } from '@/types/auth';

// Demo users for development/testing
const DEMO_USERS: Record<string, { user: User; tenant: Tenant | null }> = {
  'admin@torqos.com': {
    user: {
      id: 'usr_admin_001',
      email: 'admin@torqos.com',
      first_name: 'Platform',
      last_name: 'Admin',
      role: 'super_admin',
      created_at: '2024-01-01T00:00:00Z',
    },
    tenant: null,
  },
  'owner@agency.com': {
    user: {
      id: 'usr_owner_001',
      email: 'owner@agency.com',
      first_name: 'Alex',
      last_name: 'Morgan',
      role: 'agency_owner',
      tenant_id: 'tenant_001',
      created_at: '2024-06-01T00:00:00Z',
    },
    tenant: {
      id: 'tenant_001',
      name: 'Acme Agency',
      slug: 'acme-agency',
      plan_id: 'plan_professional',
      subscription_status: 'active',
      settings: {
        branding: { primary_color: '#6366f1' },
        features: {
          ai_agents_enabled: true,
          client_portal_enabled: true,
          white_label_enabled: false,
        },
        limits: {
          max_clients: 50,
          max_projects: 200,
          max_team_members: 10,
        },
      },
      created_at: '2024-06-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z',
    },
  },
  'client@company.com': {
    user: {
      id: 'usr_client_001',
      email: 'client@company.com',
      first_name: 'Casey',
      last_name: 'Thompson',
      role: 'client_user',
      tenant_id: 'tenant_001',
      client_id: 'client_001',
      created_at: '2024-08-01T00:00:00Z',
    },
    tenant: {
      id: 'tenant_001',
      name: 'Acme Agency',
      slug: 'acme-agency',
      plan_id: 'plan_professional',
      subscription_status: 'active',
      settings: {},
      created_at: '2024-06-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z',
    },
  },
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // Demo only
  hasPermission: (permission: string) => boolean;
  canAccessTier: (tier: AccessTier) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'torqos_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tenant: null,
    isAuthenticated: false,
    isLoading: true,
    accessTier: null,
  });

  // Load saved session on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const { email } = JSON.parse(saved);
          const userData = DEMO_USERS[email];
          if (userData) {
            setState({
              user: userData.user,
              tenant: userData.tenant,
              isAuthenticated: true,
              isLoading: false,
              accessTier: ROLE_TO_TIER[userData.user.role],
            });
            return;
          }
        }
      } catch (e) {
        console.error('Failed to load session:', e);
      }
      
      // Default to agency owner for demo
      const defaultUser = DEMO_USERS['owner@agency.com'];
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: 'owner@agency.com' }));
      setState({
        user: defaultUser.user,
        tenant: defaultUser.tenant,
        isAuthenticated: true,
        isLoading: false,
        accessTier: ROLE_TO_TIER[defaultUser.user.role],
      });
    };

    loadSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userData = DEMO_USERS[credentials.email];
    if (!userData) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Invalid credentials');
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: credentials.email }));
    
    setState({
      user: userData.user,
      tenant: userData.tenant,
      isAuthenticated: true,
      isLoading: false,
      accessTier: ROLE_TO_TIER[userData.user.role],
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      tenant: null,
      isAuthenticated: false,
      isLoading: false,
      accessTier: null,
    });
  }, []);

  // Demo function to switch roles
  const switchRole = useCallback((role: UserRole) => {
    const emailByRole: Record<UserRole, string> = {
      super_admin: 'admin@torqos.com',
      agency_owner: 'owner@agency.com',
      agency_member: 'owner@agency.com', // Same as owner for demo
      client_user: 'client@company.com',
    };
    
    const email = emailByRole[role];
    const userData = DEMO_USERS[email];
    if (userData) {
      // Update the role specifically for demo
      const user = { ...userData.user, role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email }));
      setState({
        user,
        tenant: userData.tenant,
        isAuthenticated: true,
        isLoading: false,
        accessTier: ROLE_TO_TIER[role],
      });
    }
  }, []);

  const checkPermission = useCallback((permission: string): boolean => {
    return hasPermission(state.user, permission);
  }, [state.user]);

  const checkTierAccess = useCallback((tier: AccessTier): boolean => {
    return canAccessTier(state.user, tier);
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        switchRole,
        hasPermission: checkPermission,
        canAccessTier: checkTierAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Convenience hooks
export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useTenant() {
  const { tenant } = useAuth();
  return tenant;
}

export function usePermissions() {
  const { user, hasPermission } = useAuth();
  return {
    permissions: user ? ROLE_PERMISSIONS[user.role] : [],
    hasPermission,
  };
}
