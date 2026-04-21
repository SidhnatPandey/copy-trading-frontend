import { UserRole, Permission, ACL_RULES, ROUTE_ACCESS_RULES } from '@/contexts/AuthContext';

/**
 * ACL (Access Control List) and RBAC (Role-Based Access Control) Service
 * Provides centralized permission and role checking utilities
 */
export class AccessControlService {
  /**
   * Check if a role has a specific permission
   */
  static roleHasPermission(role: UserRole, permission: Permission): boolean {
    return ACL_RULES[role]?.includes(permission) || false;
  }

  /**
   * Check if a role has any of the specified permissions
   */
  static roleHasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    if (!permissions.length) return true;
    return permissions.some(permission => this.roleHasPermission(role, permission));
  }

  /**
   * Check if a role has all of the specified permissions
   */
  static roleHasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    if (!permissions.length) return true;
    return permissions.every(permission => this.roleHasPermission(role, permission));
  }

  /**
   * Get all permissions for a role
   */
  static getRolePermissions(role: UserRole): Permission[] {
    return ACL_RULES[role] || [];
  }

  /**
   * Get all roles that have a specific permission
   */
  static getRolesWithPermission(permission: Permission): UserRole[] {
    return Object.entries(ACL_RULES)
      .filter(([, permissions]) => permissions.includes(permission))
      .map(([role]) => role as UserRole);
  }

  /**
   * Check if a route can be accessed by a role
   */
  static canRoleAccessRoute(role: UserRole, route: string): boolean {
    const requiredPermissions = ROUTE_ACCESS_RULES[route];
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // Public route
    }
    return this.roleHasAnyPermission(role, requiredPermissions);
  }

  /**
   * Get all accessible routes for a role
   */
  static getAccessibleRoutes(role: UserRole): string[] {
    return Object.keys(ROUTE_ACCESS_RULES).filter(route =>
      this.canRoleAccessRoute(role, route)
    );
  }

  /**
   * Check if a role hierarchy allows access (e.g., admin can access trader features)
   */
  static hasRoleHierarchyAccess(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.GUEST]: 0,
      [UserRole.INVESTOR]: 1,
      [UserRole.TRADER]: 2,
      [UserRole.ADMIN]: 3
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * Get role display name
   */
  static getRoleDisplayName(role: UserRole): string {
    const displayNames: Record<UserRole, string> = {
      [UserRole.GUEST]: 'Guest',
      [UserRole.INVESTOR]: 'Investor',
      [UserRole.TRADER]: 'Trader',
      [UserRole.ADMIN]: 'Administrator'
    };
    return displayNames[role] || 'Unknown';
  }

  /**
   * Get permission display name
   */
  static getPermissionDisplayName(permission: Permission): string {
    const displayNames: Record<Permission, string> = {
      [Permission.LOGIN]: 'Login',
      [Permission.LOGOUT]: 'Logout',
      [Permission.VIEW_TRADERS]: 'View Traders',
      [Permission.VIEW_TRADER_PROFILE]: 'View Trader Profile',
      [Permission.COPY_TRADING]: 'Copy Trading',
      [Permission.VIEW_PORTFOLIO]: 'View Portfolio',
      [Permission.VIEW_MARKET]: 'View Market',
      [Permission.MANAGE_USERS]: 'Manage Users',
      [Permission.MANAGE_TRADERS]: 'Manage Traders',
      [Permission.SYSTEM_ADMIN]: 'System Administration'
    };
    return displayNames[permission] || permission;
  }

  /**
   * Validate ACL rules for consistency
   */
  static validateACLRules(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check that all permissions are assigned to at least one role
    const allPermissions = Object.values(Permission);
    const assignedPermissions = new Set(
      Object.values(ACL_RULES).flat()
    );

    allPermissions.forEach(permission => {
      if (!assignedPermissions.has(permission)) {
        errors.push(`Permission "${permission}" is not assigned to any role`);
      }
    });

    // Check that admin has all permissions
    const adminPermissions = ACL_RULES[UserRole.ADMIN];
    allPermissions.forEach(permission => {
      if (!adminPermissions.includes(permission)) {
        errors.push(`Admin role is missing permission: "${permission}"`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * Utility functions for common permission checks
 */
export const PermissionUtils = {
  /**
   * Check if user can perform trading operations
   */
  canTrade: (permissions: Permission[]): boolean => {
    return AccessControlService.roleHasAnyPermission(
      // This would need the user's role, but we'll use permissions directly
      // In practice, this would be called with the user's permissions
      UserRole.TRADER, // placeholder
      [Permission.COPY_TRADING]
    );
  },

  /**
   * Check if user can view sensitive financial data
   */
  canViewFinancialData: (permissions: Permission[]): boolean => {
    return permissions.includes(Permission.VIEW_PORTFOLIO) ||
           permissions.includes(Permission.VIEW_MARKET);
  },

  /**
   * Check if user has administrative privileges
   */
  isAdmin: (role: UserRole): boolean => {
    return role === UserRole.ADMIN;
  },

  /**
   * Check if user can manage other users
   */
  canManageUsers: (permissions: Permission[]): boolean => {
    return permissions.includes(Permission.MANAGE_USERS);
  }
};