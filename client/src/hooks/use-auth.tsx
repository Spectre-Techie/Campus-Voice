"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  adminLogin,
  adminLogout,
  adminGetMe,
  type AdminUser,
} from "@/lib/admin-api";

interface AuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    adminGetMe()
      .then(setAdmin)
      .catch(() => {
        localStorage.removeItem("admin_token");
        setAdmin(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const data = await adminLogin(username, password);
    localStorage.setItem("admin_token", data.accessToken);
    setAdmin(data.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminLogout();
    } catch {
      // ignore
    }
    localStorage.removeItem("admin_token");
    setAdmin(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const user = await adminGetMe();
      setAdmin(user);
    } catch {
      localStorage.removeItem("admin_token");
      setAdmin(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isLoading,
      isAuthenticated: !!admin,
      login,
      logout,
      refresh,
    }),
    [admin, isLoading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
