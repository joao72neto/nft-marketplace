import { useContext } from "react";
import { AuthModalContext, type AuthModalContextType } from "./auth-modal-base";

export function useAuthModal(): AuthModalContextType {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
