import React from 'react';
import { useAuth, Permission } from '@/contexts/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions; if false, ANY permission
  fallback?: React.ReactNode;
}

/**
 * PermissionGuard component that conditionally renders children based on user permissions
 * Uses RBAC (Role-Based Access Control) combined with ACL (Access Control List)
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions,
  requireAll = false,
  fallback = null
}) => {
  const { hasAnyPermission, hasAllPermissions } = useAuth();

  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

interface RoleGuardProps {
  children: React.ReactNode;
  roles: string[];
  requireAll?: boolean; // If true, user must have ALL roles; if false, ANY role
  fallback?: React.ReactNode;
}

/**
 * RoleGuard component that conditionally renders children based on user roles
 * Pure RBAC implementation
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles,
  requireAll = false,
  fallback = null
}) => {
  const { user } = useAuth();

  if (!user || !user.isAuthenticated) {
    return <>{fallback}</>;
  }

  const hasAccess = requireAll
    ? roles.every(role => user.role === role)
    : roles.includes(user.role);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

/**
 * Hook for checking permissions in components
 */
export const usePermissions = () => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    user
  } = useAuth();

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    user,
    // Convenience methods
    isAdmin: user?.role === 'admin',
    isTrader: user?.role === 'trader',
    isInvestor: user?.role === 'investor',
    isGuest: user?.role === 'guest' || !user?.isAuthenticated
  };
};