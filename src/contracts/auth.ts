export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio?: string;
  createdAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
  expiresAt: string;
}

export interface JwtPayloadDTO {
  sub: string;
  email: string;
  role: "collector" | "admin";
  iat: number;
  exp: number;
}
