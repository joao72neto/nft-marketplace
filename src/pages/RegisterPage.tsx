import React, { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "@/features/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ApiErrorResponse } from "@/contracts";

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/cadastro" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!name.trim()) {
      errors.name = "Nome completo é obrigatório.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = "Informe um endereço de e-mail válido.";
    }

    if (password.length < 8) {
      errors.password = "A senha deve conter no mínimo 8 caracteres.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    if (!validate()) {
      return;
    }

    setIsPending(true);
    try {
      await register(name.trim(), email.trim(), password);
      const destination = search.redirect
        ? decodeURIComponent(search.redirect)
        : "/";
      navigate({ to: destination as "/" });
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      if (apiError.code === "CONFLICT") {
        setFieldErrors({
          email: "Este e-mail já está cadastrado no GreenMint.",
        });
      } else {
        setGeneralError(
          apiError.message || "Erro ao criar conta. Tente novamente.",
        );
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container max-w-300 mx-auto px-4 py-12 lg:py-20 flex justify-center items-center">
      <div className="w-full max-w-[480px] rounded-xl border border-border-dark bg-surface-card p-6 sm:p-10 shadow-2xl font-mono">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Crie sua conta de colecionador
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text">
            Junte-se à Kurio para colecionar e negociar ativos digitais.
          </p>
        </div>

        {generalError && (
          <div
            role="alert"
            className="mb-6 rounded-md border border-coral/40 bg-coral/10 p-3 text-xs text-coral font-medium"
          >
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="register-name"
              className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
            >
              Nome completo
            </label>
            <Input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ex: Alice Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              className="h-11"
            />
            {fieldErrors.name && (
              <p id="name-error" className="text-xs text-coral">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5 text-left">
            <label
              htmlFor="register-email"
              className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
            >
              E-mail
            </label>
            <Input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu.email@exemplo.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className="h-11"
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-xs text-coral font-medium">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5 text-left">
            <label
              htmlFor="register-password"
              className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
            >
              Senha (mínimo 8 caracteres)
            </label>
            <Input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className="h-11"
            />
            {fieldErrors.password && (
              <p id="password-error" className="text-xs text-coral">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-1.5 text-left">
            <label
              htmlFor="register-confirm-password"
              className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
            >
              Confirmar senha
            </label>
            <Input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={
                fieldErrors.confirmPassword ? "confirm-error" : undefined
              }
              className="h-11"
            />
            {fieldErrors.confirmPassword && (
              <p id="confirm-error" className="text-xs text-coral">
                {fieldErrors.confirmPassword}
              </p>
            )}
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
                <span>Criando conta...</span>
              </span>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-dark text-center text-xs text-secondary-text">
          <span>Já possui uma conta? </span>
          <Link
            to="/login"
            search={search.redirect ? { redirect: search.redirect } : {}}
            className="font-bold text-accent hover:underline ml-1"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};
