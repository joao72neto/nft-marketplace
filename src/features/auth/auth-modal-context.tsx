import React, { useState, useCallback } from "react";
import { AuthModalContext, type AuthModalMode } from "./auth-modal-base";

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("login");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const openLoginModal = useCallback((redirect?: string) => {
    setMode("login");
    setRedirectUrl(redirect ?? null);
    setIsOpen(true);
  }, []);

  const openRegisterModal = useCallback((redirect?: string) => {
    setMode("register");
    setRedirectUrl(redirect ?? null);
    setIsOpen(true);
  }, []);

  const openForgotModal = useCallback(() => {
    setMode("forgot");
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        redirectUrl,
        openLoginModal,
        openRegisterModal,
        openForgotModal,
        setMode,
        closeAuthModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};
