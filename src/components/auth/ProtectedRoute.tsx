import React, { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useAuth, useAuthModal } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { LogoutIcon } from "@/components/icons";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { openLoginModal } = useAuthModal();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLoginModal(currentPath);
    }
  }, [isLoading, isAuthenticated, openLoginModal, currentPath]);

  if (isLoading) {
    return (
      <div
        className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-secondary-text font-mono"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm">Verificando sessão segura...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-300 mx-auto px-4 py-16 flex flex-col items-center justify-center text-center font-mono">
        <div className="max-w-md w-full rounded-xl border border-border-dark bg-surface-card p-8 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <LogoutIcon size={24} />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Acesso Restrito
          </h2>
          <p className="text-xs text-secondary-text leading-relaxed">
            Você precisa estar conectado com sua conta para acessar esta seção de colecionador.
          </p>
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full h-11 text-sm font-bold tracking-wider mt-4"
            onClick={() => openLoginModal(currentPath)}
          >
            Entrar na sua conta
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
