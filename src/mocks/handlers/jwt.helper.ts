import type { JwtPayloadDTO, UserDTO } from "@/contracts";
import { getActiveScenario } from "../scenarios/active-scenario";
import { findUserById } from "../db";

export function createFakeJwt(
  user: UserDTO,
  expiresInSeconds: number = 3600,
): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayloadDTO = {
    sub: user.id,
    email: user.email,
    role: "collector",
    iat: now,
    exp: now + expiresInSeconds,
  };

  const b64Header = btoa(JSON.stringify(header));
  const b64Payload = btoa(JSON.stringify(payload));
  const signature = "fake_sig_" + user.id;

  return `${b64Header}.${b64Payload}.${signature}`;
}

export function decodeFakeJwt(token: string): JwtPayloadDTO | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    return JSON.parse(atob(parts[1])) as JwtPayloadDTO;
  } catch {
    return null;
  }
}

export function extractBearerToken(request: Request): string | null {
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7).trim();
}

export function authenticateRequest(request: Request): {
  user: UserDTO | null;
  error?: string;
} {
  const { scenario } = getActiveScenario();

  if (scenario === "expired-session") {
    return {
      user: null,
      error: "Sua sessão de autenticação expirou. Faça login novamente.",
    };
  }

  const token = extractBearerToken(request);
  if (!token) {
    return { user: null, error: "Token de autorização não fornecido." };
  }

  const payload = decodeFakeJwt(token);
  if (!payload) {
    return { user: null, error: "Token inválido." };
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    return { user: null, error: "Sessão expirada." };
  }

  const user = findUserById(payload.sub);
  if (!user) {
    return { user: null, error: "Usuário não encontrado." };
  }

  return { user };
}
