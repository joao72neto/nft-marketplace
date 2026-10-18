import React, { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "@/features/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";
import type { ApiErrorResponse } from "@/contracts";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  // Busca search param de redirect de forma fortemente tipada
  const search = useSearch({ from: "/login" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    search.reason === "expired"
      ? "Sua sessão expirou. Por favor, autentique-se novamente para continuar."
      : null,
  );
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Por favor, informe seu endereço de e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Por favor, informe um endereço de e-mail válido.");
      return;
    }

    if (!password) {
      setErrorMessage("Por favor, digite sua senha de acesso.");
      return;
    }

    setIsPending(true);
    try {
      await login(trimmedEmail, password);
      // Redireciona para o destino pretendido ou para a home
      const destination = search.redirect
        ? decodeURIComponent(search.redirect)
        : "/";
      navigate({ to: destination as "/" });
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      if (apiError.code === "UNAUTHORIZED" || apiError.message) {
        setErrorMessage(apiError.message || "E-mail ou senha incorretos.");
      } else {
        setErrorMessage(
          "Não foi possível autenticar. Tente novamente mais tarde.",
        );
      }
      setPassword("");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container max-w-300 mx-auto px-4 py-12 lg:py-20 flex justify-center items-center">
      <div className="w-full max-w-[460px] rounded-xl border border-border-dark bg-surface-card p-6 sm:p-10 shadow-2xl font-mono">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Acesse sua conta
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text">
            Entre para gerenciar sua coleção, favoritos e carteiras.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-md border border-coral/40 bg-coral/10 p-3 text-xs text-coral font-medium flex items-start gap-2"
          >
            <span className="font-bold">Aviso:</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2 text-left">
            <label
              htmlFor="login-email"
              className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
            >
              E-mail
            </label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu.email@exemplo.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              required
              aria-invalid={Boolean(errorMessage)}
              className="h-11"
            />
          </div>

          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center">
              <label
                htmlFor="login-password"
                className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
              >
                Senha
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs text-primary hover:text-accent hover:underline transition-colors focus:outline-none"
              >
                Esqueceu sua senha?
              </button>
            </div>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              required
              aria-invalid={Boolean(errorMessage)}
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isPending}
            className="w-full h-11 text-sm font-bold tracking-wider mt-4"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                <span>Entrando...</span>
              </span>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-dark text-center text-xs text-secondary-text">
          <span>Ainda não tem conta? </span>
          <Link
            to="/cadastro"
            search={search.redirect ? { redirect: search.redirect } : {}}
            className="font-bold text-accent hover:underline ml-1"
          >
            Criar conta
          </Link>
        </div>
      </div>

      <ForgotPasswordDialog
        open={isForgotModalOpen}
        onOpenChange={setIsForgotModalOpen}
      />
    </div>
  );
};
