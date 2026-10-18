import { createContext } from "react";

export type AuthModalMode = "login" | "register" | "forgot";

export interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthModalMode;
  redirectUrl: string | null;
  openLoginModal: (redirect?: string) => void;
  openRegisterModal: (redirect?: string) => void;
  openForgotModal: () => void;
  setMode: (mode: AuthModalMode) => void;
  closeAuthModal: () => void;
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);
