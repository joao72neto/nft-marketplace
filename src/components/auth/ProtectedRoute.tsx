import React, { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/features/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: "/login",
        search: {
          redirect: currentPath,
        },
      });
    }
  }, [isLoading, isAuthenticated, navigate, currentPath]);

  if (isLoading) {
    return (
      <div
        className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-secondary font-mono"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm">Verificando sessão segura...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
