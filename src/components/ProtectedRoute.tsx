/**
 * Protected Route Component
 * Guards routes based on authentication and role/tier access
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { AccessTier, UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredTier?: AccessTier;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredTier,
  requiredRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, canAccessTier } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--md-bg-primary))]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[hsl(var(--md-text-muted))]">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check tier access
  if (requiredTier && !canAccessTier(requiredTier)) {
    // Redirect to appropriate dashboard based on user's tier
    const redirectPath = getDefaultPathForRole(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  // Check specific role access
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    const redirectPath = getDefaultPathForRole(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

// Helper to get default path for each role
function getDefaultPathForRole(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return '/admin';
    case 'agency_owner':
    case 'agency_member':
      return '/';
    case 'client_user':
      return '/portal';
    default:
      return '/login';
  }
}

// HOC version for convenience
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export default ProtectedRoute;
