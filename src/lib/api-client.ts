import axios, { type AxiosInstance, type AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

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
      message: error.message || "Erro inesperado na comunicação com a API",
      status: error.response?.status,
    };
    return Promise.reject(errorData);
  },
);
