import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiErrorResponse } from "@/contracts";

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const errorData: ApiErrorResponse = error.response?.data || {
      code: "TRANSIENT_ERROR",
      message: error.message || "Erro inesperado na comunicação com a API",
      timestamp: new Date().toISOString(),
    };
    return Promise.reject(errorData);
  },
);
