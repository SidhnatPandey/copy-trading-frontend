# ACL and RBAC Implementation Guide

This document explains the Access Control List (ACL) and Role-Based Access Control (RBAC) implementation in the Copy Trading application.

## Overview

The application uses a combined ACL and RBAC approach to manage user permissions and access control:

- **RBAC (Role-Based Access Control)**: Users are assigned roles (Guest, Investor, Trader, Admin)
- **ACL (Access Control List)**: Each role has specific permissions assigned to it

## User Roles

| Role | Description | Hierarchy Level |
|------|-------------|-----------------|
| `GUEST` | Unauthenticated users | 0 |
| `INVESTOR` | Basic users who can view and copy trades | 1 |
| `TRADER` | Advanced users with trading capabilities | 2 |
| `ADMIN` | System administrators with full access | 3 |

## Permissions

| Permission | Description | Assigned Roles |
|------------|-------------|----------------|
| `LOGIN` | Can log into the system | Guest |
| `LOGOUT` | Can log out of the system | All authenticated |
| `VIEW_TRADERS` | Can view trader profiles | Investor, Trader, Admin |
| `VIEW_TRADER_PROFILE` | Can view detailed trader info | Investor, Trader, Admin |
| `COPY_TRADING` | Can copy trader strategies | Investor, Trader, Admin |
| `VIEW_PORTFOLIO` | Can view portfolio data | Investor, Trader, Admin |
| `VIEW_MARKET` | Can view market data | Investor, Trader, Admin |
| `MANAGE_USERS` | Can manage user accounts | Admin |
| `MANAGE_TRADERS` | Can manage trader accounts | Admin |
| `SYSTEM_ADMIN` | Full system administration | Admin |

## Route Protection

Routes are automatically protected based on the `ROUTE_ACCESS_RULES` configuration:

| Route | Required Permissions |
|-------|----------------------|
| `/` | None (public) |
| `/login` | None (public) |
| `/signup` | None (public) |
| `/traders` | `VIEW_TRADERS` |
| `/traders/:id` | `VIEW_TRADER_PROFILE` |
| `/copy-trading` | `COPY_TRADING` |
| `/portfolio` | `VIEW_PORTFOLIO` |
| `/market` | `VIEW_MARKET` |

## Usage Examples

### Using the Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, hasPermission, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          {hasPermission(Permission.COPY_TRADING) && (
            <button>Start Copy Trading</button>
          )}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Using Permission Guards

```tsx
import { PermissionGuard, RoleGuard } from '@/components/PermissionGuard';
import { Permission, UserRole } from '@/contexts/AuthContext';

function AdminPanel() {
  return (
    <PermissionGuard
      permissions={[Permission.MANAGE_USERS]}
      fallback={<div>Access denied</div>}
    >
      <div>Admin controls here</div>
    </PermissionGuard>
  );
}

function TraderFeatures() {
  return (
    <RoleGuard
      roles={[UserRole.TRADER, UserRole.ADMIN]}
      fallback={<div>Only traders can access this</div>}
    >
      <div>Advanced trading features</div>
    </RoleGuard>
  );
}
```

### Using the Permissions Hook

```tsx
import { usePermissions } from '@/components/PermissionGuard';

function Navigation() {
  const { isAdmin, isTrader, hasPermission } = usePermissions();

  return (
    <nav>
      <Link to="/traders">Traders</Link>
      {hasPermission(Permission.COPY_TRADING) && (
        <Link to="/copy-trading">Copy Trading</Link>
      )}
      {isAdmin && (
        <Link to="/admin">Admin Panel</Link>
      )}
    </nav>
  );
}
```

### Using the Access Control Service

```tsx
import { AccessControlService } from '@/services/accessControlService';
import { UserRole, Permission } from '@/contexts/AuthContext';

// Check if a role has a permission
const canTrade = AccessControlService.roleHasPermission(UserRole.TRADER, Permission.COPY_TRADING);

// Get all permissions for a role
const traderPermissions = AccessControlService.getRolePermissions(UserRole.TRADER);

// Check if a role can access a route
const canAccessPortfolio = AccessControlService.canRoleAccessRoute(UserRole.INVESTOR, '/portfolio');
```

## Route Protection

Routes are automatically protected using `ProtectedRoute` and `PublicRoute` components:

```tsx
// Protected route - requires authentication
<ProtectedRoute>
  <SomeComponent />
</ProtectedRoute>

// Public route - redirects authenticated users
<PublicRoute restricted redirectPath="/dashboard">
  <LoginComponent />
</PublicRoute>

// Route with specific permissions
<ProtectedRoute permissions={[Permission.MANAGE_USERS]}>
  <AdminComponent />
</ProtectedRoute>
```

## API Integration

The application includes automatic token management:

- JWT tokens are automatically included in API requests
- 401 responses trigger automatic logout and redirect to login
- 403 responses are logged for forbidden access attempts

## Extending the System

### Adding New Permissions

1. Add the permission to the `Permission` enum in `AuthContext.tsx`
2. Assign it to appropriate roles in `ACL_RULES`
3. Add route access rules in `ROUTE_ACCESS_RULES` if needed
4. Update the `getPermissionDisplayName` function in `accessControlService.ts`

### Adding New Roles

1. Add the role to the `UserRole` enum
2. Define permissions for the role in `ACL_RULES`
3. Update the `getRoleDisplayName` function
4. Update role hierarchy in `hasRoleHierarchyAccess` if needed

### Custom Permission Checks

For complex permission logic, create custom hooks or utilities:

```tsx
// Custom hook for business logic permissions
export const useTradingPermissions = () => {
  const { hasPermission, user } = useAuth();

  const canCreateStrategy = () => {
    return hasPermission(Permission.COPY_TRADING) &&
           user?.role === UserRole.TRADER;
  };

  const canViewAdvancedAnalytics = () => {
    return hasPermission(Permission.VIEW_PORTFOLIO) &&
           (user?.role === UserRole.TRADER || user?.role === UserRole.ADMIN);
  };

  return {
    canCreateStrategy,
    canViewAdvancedAnalytics
  };
};
```

## Security Considerations

1. **Token Storage**: JWT tokens are stored in both localStorage and sessionStorage for redundancy
2. **Automatic Logout**: 401 responses trigger immediate logout and redirect
3. **Route Protection**: All sensitive routes are protected at the component level
4. **Permission Validation**: Permissions are checked both on the frontend and should be validated on the backend
5. **Role Hierarchy**: Higher-level roles inherit permissions from lower-level roles

## Testing

Use the `AccessControlService.validateACLRules()` function to ensure ACL consistency:

```tsx
const validation = AccessControlService.validateACLRules();
if (!validation.valid) {
  console.error('ACL validation errors:', validation.errors);
}
```