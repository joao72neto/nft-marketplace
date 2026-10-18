import React, { useState, useEffect, useCallback } from "react";
import type { UserDTO, AuthResponse, LoginRequest, RegisterRequest } from "@/contracts";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import { authStorage, isTokenExpired } from "./auth-storage";
import { AuthContext } from "./auth-context-base";
import type { AuthContextType, AuthState } from "./types";

function getInitialAuthState(): AuthState {
  const token = authStorage.getToken();
  if (!token || isTokenExpired(token)) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
  return {
    user: null,
    token,
    isAuthenticated: true,
    isLoading: true,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(getInitialAuthState);

  const logout = useCallback(async () => {
    try {
      if (state.token) {
        await apiClient.post("/auth/logout").catch(() => {});
      }
    } finally {
      authStorage.removeToken();
      queryClient.clear();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [state.token]);

  const refreshSession = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token || isTokenExpired(token)) {
      authStorage.removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      const response = await apiClient.get<UserDTO>("/auth/me");
      setState({
        user: response.data,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      authStorage.removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const payload: LoginRequest = { email, password };
      const response = await apiClient.post<AuthResponse>("/auth/login", payload);
      const { user, token } = response.data;

      authStorage.setToken(token);
      queryClient.clear();
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    },
    [],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const payload: RegisterRequest = { name, email, password };
      const response = await apiClient.post<AuthResponse>("/auth/register", payload);
      const { user, token } = response.data;

      authStorage.setToken(token);
      queryClient.clear();
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    },
    [],
  );

  useEffect(() => {
    // Apenas dispara revalidação remota se houver token inicial
    if (state.token && state.isLoading) {
      void apiClient
        .get<UserDTO>("/auth/me")
        .then((res) => {
          setState((prev) => ({
            ...prev,
            user: res.data,
            isLoading: false,
          }));
        })
        .catch(() => {
          authStorage.removeToken();
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        });
    }

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("greenmint:auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("greenmint:auth:unauthorized", handleUnauthorized);
    };
  }, [state.token, state.isLoading, logout]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
