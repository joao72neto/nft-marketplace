import { useContext } from "react";
import { AuthContext } from "./auth-context-base";
import type { AuthContextType } from "./types";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um <AuthProvider />");
  }
  return context;
}
