import type { JwtPayloadDTO } from "@/contracts";

const TOKEN_STORAGE_KEY = "greenmint_auth_token";

/**
 * Decodifica com segurança uma string Base64 em ambiente navegador ou node.
 */
function safeBase64Decode(str: string): string {
  try {
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      return window.atob(str);
    }
    return Buffer.from(str, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

/**
 * Extrai o payload de um token JWT simulado no formato header.payload.signature.
 */
export function parseJwtPayload(token: string): JwtPayloadDTO | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const jsonStr = safeBase64Decode(parts[1]);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr) as JwtPayloadDTO;
  } catch {
    return null;
  }
}

/**
 * Verifica se o token JWT simulado está expirado (conforme RN-16, usando relógio centralizado).
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) return true;

  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  return currentTimeSeconds >= payload.exp;
}

export const authStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) return null;
      if (isTokenExpired(token)) {
        this.removeToken();
        return null;
      }
      return token;
    } catch {
      return null;
    }
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn("[AuthStorage] Falha ao persistir token no localStorage:", e);
    }
  },

  removeToken(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.warn("[AuthStorage] Falha ao remover token do localStorage:", e);
    }
  },
};
