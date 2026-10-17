/**
 * Tipo semântico para valores em ETH.
 * REGRA RN-01: Valores em ETH trafegam estritamente como strings decimais para garantir precisão monetária (ex: "0.45", "1.2000").
 */
export type EthAmount = string;

/**
 * Metadados de paginação padronizados para listagens.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Envelope para respostas paginadas de coleções.
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

/**
 * Códigos padronizados de erro da API do marketplace.
 */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "TRANSIENT_ERROR"
  | "INSUFFICIENT_FUNDS"
  | "EXPIRED_RESOURCE";

/**
 * Detalhe de erro associado a um campo específico.
 */
export interface ApiErrorDetail {
  field?: string;
  message: string;
}

/**
 * Formato padrão e tipado de respostas de erro da API.
 */
export interface ApiErrorResponse {
  code: ApiErrorCode;
  message: string;
  details?: ApiErrorDetail[];
  timestamp: string;
}
