import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiErrorResponse } from "@/contracts";
import { authStorage } from "@/features/auth/auth-storage";

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const errorData: ApiErrorResponse = error.response?.data || {
      code: "TRANSIENT_ERROR",
      message: error.message || "Erro inesperado na comunicação com a API",
      timestamp: new Date().toISOString(),
    };

    // Se o token estiver inválido/expirado em rota privada
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      authStorage.removeToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("greenmint:auth:unauthorized"));
      }
    }

    return Promise.reject(errorData);
  },
);
