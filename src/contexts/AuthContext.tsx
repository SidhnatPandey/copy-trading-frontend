import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user roles
export enum UserRole {
  ADMIN = 'admin',
  TRADER = 'trader',
  INVESTOR = 'investor',
  GUEST = 'guest'
}

// Define permissions
export enum Permission {
  // Auth permissions
  LOGIN = 'login',
  LOGOUT = 'logout',

  // Trading permissions
  VIEW_TRADERS = 'view_traders',
  VIEW_TRADER_PROFILE = 'view_trader_profile',
  COPY_TRADING = 'copy_trading',
  VIEW_PORTFOLIO = 'view_portfolio',
  VIEW_MARKET = 'view_market',

  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_TRADERS = 'manage_traders',
  SYSTEM_ADMIN = 'system_admin'
}

// Define ACL rules - which roles have which permissions
export const ACL_RULES: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [Permission.LOGIN],
  [UserRole.INVESTOR]: [
    Permission.LOGOUT,
    Permission.VIEW_TRADERS,
    Permission.VIEW_TRADER_PROFILE,
    Permission.COPY_TRADING,
    Permission.VIEW_PORTFOLIO,
    Permission.VIEW_MARKET
  ],
  [UserRole.TRADER]: [
    Permission.LOGOUT,
    Permission.VIEW_TRADERS,
    Permission.VIEW_TRADER_PROFILE,
    Permission.COPY_TRADING,
    Permission.VIEW_PORTFOLIO,
    Permission.VIEW_MARKET
  ],
  [UserRole.ADMIN]: [
    Permission.LOGOUT,
    Permission.VIEW_TRADERS,
    Permission.VIEW_TRADER_PROFILE,
    Permission.COPY_TRADING,
    Permission.VIEW_PORTFOLIO,
    Permission.VIEW_MARKET,
    Permission.MANAGE_USERS,
    Permission.MANAGE_TRADERS,
    Permission.SYSTEM_ADMIN
  ]
};

// Define route access rules
export const ROUTE_ACCESS_RULES: Record<string, Permission[]> = {
  '/': [], // Public route
  '/login': [], // Public route
  '/signup': [], // Public route
  '/traders': [Permission.VIEW_TRADERS],
  '/traders/:id': [Permission.VIEW_TRADER_PROFILE],
  '/copy-trading': [Permission.COPY_TRADING],
  '/portfolio': [Permission.VIEW_PORTFOLIO],
  '/market': [Permission.VIEW_MARKET]
};

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
  refreshUser: (id?: string) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessRoute: (route: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Import login service dynamically to avoid circular imports
      const { login: loginService } = await import('@/apiService/authService');

      const response = await loginService({ email, password });

      // Assuming the response contains user data and token
      // Adjust this based on your actual API response structure
      const userData: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        avatar: response.data.user.profile_image_url || response.data.user.profile_image_url || response.data.user.profile_image_url || undefined,
        role: response.data.user.role || UserRole.INVESTOR, // Default role
        isAuthenticated: true
      };

      // Store user data and token
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Store JWT token using the interceptor utility
      if (response.data.token) {
        const { setAuthToken } = await import('@/services/interceptor');
        setAuthToken(response.data.token);
      }

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');

    // Clear JWT token
    const { setAuthToken } = await import('@/services/interceptor');
    setAuthToken(null);
  };

  const signup = async (userData: any) => {
    try {
      // Import signup service dynamically
      const { signup: signupService } = await import('@/apiService/authService');

      await signupService(userData);

      // After signup, automatically log them in or redirect to login
      // For now, we'll just complete the signup
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const refreshUser = async (id?: string) => {
    try {
      const userId = id || user?.id;
      if (!userId) return;
      const { getUser } = await import('@/apiService/authService');
      const response = await getUser(userId);
      if (response && response.data) {
        const userData: User = {
          id: response.data.id || response.data._id || userId,
          email: response.data.email,
          name: response.data.name,
          avatar: response.data.profile_image_url || response.data.profile_image_url || response.data.profile_image_url || undefined,
          role: response.data.role || UserRole.INVESTOR,
          isAuthenticated: true
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.isAuthenticated) return false;
    return ACL_RULES[user.role]?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccessRoute = (route: string): boolean => {
    const requiredPermissions = ROUTE_ACCESS_RULES[route];
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // Public route
    }
    return hasAnyPermission(requiredPermissions);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    signup,
    refreshUser,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};