"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  UserProfile,
  MonthlyUsage,
  GenerationRecord,
  authApi,
  usersApi,
} from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  usage: MonthlyUsage | null;
  generations: GenerationRecord[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usage, setUsage] = useState<MonthlyUsage | null>(null);
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const data = await usersApi.getMe();
      setUser(data.user);
      setUsage(data.usage);
      setGenerations(data.generations);
    } catch (err: any) {
      // If 401 or unauthorized, clear auth state
      setUser(null);
      setUsage(null);
      setGenerations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = async (email: string, password: string) => {
    await authApi.login(email, password);
    await refreshMe();
  };

  const signup = async (email: string, password: string) => {
    await authApi.signup(email, password);
    await refreshMe();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
      setUsage(null);
      setGenerations([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        usage,
        generations,
        loading,
        login,
        signup,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
