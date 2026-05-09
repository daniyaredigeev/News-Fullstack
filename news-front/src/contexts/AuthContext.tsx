'use client';

import {
  clearAccessToken,
  clearUserInfo,
  getAccessToken,
  getUserInfo,
  saveUserInfo,
} from '@/lib/auth';
import type { User } from '@/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  logout: () => {},
  refreshAuth: () => {},
});

export function notifyAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-changed'));
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(() => {
    const t = getAccessToken();
    const u = getUserInfo();
    setToken(t);
    setUser(u);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    clearUserInfo();
    setToken(null);
    setUser(null);
    notifyAuthChanged();
  }, []);

  useEffect(() => {
    refreshAuth();

    const handleAuthChanged = () => {
      refreshAuth();
    };

    window.addEventListener('auth-changed', handleAuthChanged);
    return () => window.removeEventListener('auth-changed', handleAuthChanged);
  }, [refreshAuth]);

  const isAuthenticated = !!token && !!user;
  const isAdmin =
    user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAuthenticated, isAdmin, logout, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { saveUserInfo };