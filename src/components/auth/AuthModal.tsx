import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, useAuthModal } from "@/features/auth";
import type { ApiErrorResponse } from "@/contracts";

export const AuthModal: React.FC = () => {
  const { login, register } = useAuth();
  const { isOpen, mode, redirectUrl, setMode, closeAuthModal } = useAuthModal();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginPending, setIsLoginPending] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerFieldErrors, setRegisterFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [registerGeneralError, setRegisterGeneralError] = useState<
    string | null
  >(null);
  const [isRegisterPending, setIsRegisterPending] = useState(false);

  const handleClose = () => {
    setLoginError(null);
    setRegisterFieldErrors({});
    setRegisterGeneralError(null);
    closeAuthModal();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const trimmedEmail = loginEmail.trim();
    if (!trimmedEmail) {
      setLoginError("Por favor, informe seu endereço de e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setLoginError("Por favor, informe um endereço de e-mail válido.");
      return;
    }

    if (!loginPassword) {
      setLoginError("Por favor, digite sua senha de acesso.");
      return;
    }

    setIsLoginPending(true);
    try {
      await login(trimmedEmail, loginPassword);
      handleClose();
      if (redirectUrl) {
        navigate({ to: decodeURIComponent(redirectUrl) as "/" });
      }
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      if (apiError.code === "UNAUTHORIZED" || apiError.message) {
        setLoginError(apiError.message || "E-mail ou senha incorretos.");
      } else {
        setLoginError(
          "Não foi possível autenticar. Tente novamente mais tarde.",
        );
      }
      setLoginPassword("");
    } finally {
      setIsLoginPending(false);
    }
  };

  const validateRegister = (): boolean => {
    const errors: typeof registerFieldErrors = {};

    if (!registerName.trim()) {
      errors.name = "Nome completo é obrigatório.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerEmail.trim() || !emailRegex.test(registerEmail.trim())) {
      errors.email = "Informe um endereço de e-mail válido.";
    }

    if (registerPassword.length < 8) {
      errors.password = "A senha deve conter no mínimo 8 caracteres.";
    }

    if (registerPassword !== registerConfirmPassword) {
      errors.confirmPassword = "As senhas não coincidem.";
    }

    setRegisterFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterGeneralError(null);
    setRegisterFieldErrors({});

    if (!validateRegister()) {
      return;
    }

    setIsRegisterPending(true);
    try {
      await register(
        registerName.trim(),
        registerEmail.trim(),
        registerPassword,
      );
      handleClose();
      if (redirectUrl) {
        navigate({ to: decodeURIComponent(redirectUrl) as "/" });
      }
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      if (apiError.code === "CONFLICT") {
        setRegisterFieldErrors({
          email: "Este e-mail já está cadastrado no GreenMint.",
        });
      } else {
        setRegisterGeneralError(
          apiError.message || "Erro ao criar conta. Tente novamente.",
        );
      }
    } finally {
      setIsRegisterPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-[460px] sm:max-w-[480px] w-[calc(100%-2rem)] border-border-dark bg-surface-card p-6 sm:p-10 rounded-xl shadow-2xl font-mono">
        {mode === "login" && (
          <div className="space-y-6">
            <DialogHeader className="text-center space-y-2 mb-2 sm:mb-4">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-center">
                Acesse sua conta
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-secondary-text text-center">
                Entre para gerenciar sua coleção, favoritos e carteiras.
              </DialogDescription>
            </DialogHeader>

            {loginError && (
              <div
                role="alert"
                className="rounded-md border border-coral/40 bg-coral/10 p-3 text-xs text-coral font-medium flex items-start gap-2"
              >
                <span className="font-bold">Aviso:</span>
                <span>{loginError}</span>
              </div>
            )}

            <form
              onSubmit={handleLoginSubmit}
              className="space-y-4 sm:space-y-5"
              noValidate
            >
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="modal-login-email"
                  className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
                >
                  E-mail <span className="text-coral">*</span>
                </label>
                <Input
                  id="modal-login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu.email@exemplo.io"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoginPending}
                  required
                  aria-invalid={Boolean(loginError)}
                  className="h-11 bg-ink border-border-dark text-foreground placeholder:text-secondary-color focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="modal-login-password"
                    className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
                  >
                    Senha <span className="text-coral">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-primary hover:text-accent hover:underline transition-colors focus:outline-none"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
                <Input
                  id="modal-login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoginPending}
                  required
                  aria-invalid={Boolean(loginError)}
                  className="h-11 bg-ink border-border-dark text-foreground placeholder:text-secondary-color focus-visible:border-primary"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoginPending}
                className="w-full h-11 text-sm font-bold tracking-wider uppercase mt-4"
              >
                {isLoginPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                    <span>Entrando...</span>
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-border-dark text-center text-xs sm:text-sm text-secondary-text">
              <span>Ainda não tem conta? </span>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setLoginError(null);
                }}
                className="font-bold text-primary hover:text-accent hover:underline ml-1"
              >
                Criar conta
              </button>
            </div>
          </div>
        )}

        {mode === "register" && (
          <div className="space-y-5">
            <DialogHeader className="text-center space-y-2 mb-2 sm:mb-4">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-center">
                Crie sua conta de colecionador
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-secondary-text text-center">
                Junte-se à Kurio para colecionar e negociar ativos digitais.
              </DialogDescription>
            </DialogHeader>

            {registerGeneralError && (
              <div
                role="alert"
                className="rounded-md border border-coral/40 bg-coral/10 p-3 text-xs text-coral font-medium"
              >
                {registerGeneralError}
              </div>
            )}

            <form
              onSubmit={handleRegisterSubmit}
              className="space-y-3.5"
              noValidate
            >
              <div className="space-y-1 text-left">
                <label
                  htmlFor="modal-register-name"
                  className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
                >
                  Nome completo <span className="text-coral">*</span>
                </label>
                <Input
                  id="modal-register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ex: Alice Vance"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  disabled={isRegisterPending}
                  aria-invalid={Boolean(registerFieldErrors.name)}
                  aria-describedby={
                    registerFieldErrors.name ? "modal-name-error" : undefined
                  }
                  className="h-10 bg-ink border-border-dark text-foreground placeholder:text-secondary-color focus-visible:border-primary"
                />
                {registerFieldErrors.name && (
                  <p id="modal-name-error" className="text-xs text-coral">
                    {registerFieldErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1 text-left">
                <label
                  htmlFor="modal-register-email"
                  className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
                >
                  E-mail <span className="text-coral">*</span>
                </label>
                <Input
                  id="modal-register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu.email@exemplo.io"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={isRegisterPending}
                  aria-invalid={Boolean(registerFieldErrors.email)}
                  aria-describedby={
                    registerFieldErrors.email ? "modal-email-error" : undefined
                  }
                  className="h-10 bg-ink border-border-dark text-foreground placeholder:text-secondary-color focus-visible:border-primary"
                />
                {registerFieldErrors.email && (
                  <p
                    id="modal-email-error"
                    className="text-xs text-coral font-medium"
                  >
                    {registerFieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1 text-left">
                <label
                  htmlFor="modal-register-password"
                  className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
                >
                  Senha (mínimo 8 caracteres){" "}
                  <span className="text-coral">*</span>
                </label>
                <Input
                  id="modal-register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  disabled={isRegisterPending}
                  aria-invalid={Boolean(registerFieldErrors.password)}
                  aria-describedby={
                    registerFieldErrors.password
                      ? "modal-password-error"
                      : undefined
                  }
                  className="h-10 bg-ink border-border-dark text-foreground placeholder:text-secondary-color focus-visible:border-primary"
                />
                {registerFieldErrors.password && (
                  <p id="modal-password-error" className="text-xs text-coral">
                    {registerFieldErrors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1 text-left">
                <label
                  htmlFor="modal-register-confirm"
                  className="block text-xs uppercase tracking-wider text-secondary-text font-bold"
                >
                  Confirmar senha <span className="text-coral">*</span>
                </label>
                <Input
                  id="modal-register-confirm"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  disabled={isRegisterPending}
                  aria-invalid={Boolean(registerFieldErrors.confirmPassword)}
                  aria-describedby={
                    registerFieldErrors.confirmPassword
                      ? "modal-confirm-error"
                      : undefined
                  }
                  className="h-10 bg-ink border-border-dark text-foreground placeholder:text-secondary-color focus-visible:border-primary"
                />
                {registerFieldErrors.confirmPassword && (
                  <p id="modal-confirm-error" className="text-xs text-coral">
                    {registerFieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isRegisterPending}
                className="w-full h-11 text-sm font-bold tracking-wider uppercase mt-4"
              >
                {isRegisterPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-ink border-t-transparent animate-spin" />
                    <span>Criando conta...</span>
                  </span>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-border-dark text-center text-xs sm:text-sm text-secondary-text">
              <span>Já possui uma conta? </span>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setRegisterGeneralError(null);
                  setRegisterFieldErrors({});
                }}
                className="font-bold text-primary hover:text-accent hover:underline ml-1"
              >
                Entrar
              </button>
            </div>
          </div>
        )}

        {mode === "forgot" && (
          <div className="space-y-5">
            <DialogHeader className="text-center space-y-2 mb-2 sm:mb-4">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-accent tracking-tight text-center">
                Recuperação de Acesso
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-secondary-text text-center leading-relaxed">
                O marketplace opera em ambiente 100% simulado com Mock Service
                Worker. Não enviamos e-mails externos de redefinição de senha.
              </DialogDescription>
            </DialogHeader>

            <div className="my-2 rounded-md border border-border-dark bg-ink p-4 space-y-3 text-xs">
              <p className="font-bold text-foreground">
                Credenciais de Teste Disponíveis:
              </p>
              <div className="space-y-1 text-secondary-text">
                <div>
                  <span className="text-primary font-bold">Alice Vance:</span>{" "}
                  alice@greenmint.io
                </div>
                <div>
                  <span className="text-foreground">Senha:</span> Senha123!
                </div>
              </div>
              <div className="space-y-1 text-secondary-text pt-2 border-t border-border-dark">
                <div>
                  <span className="text-primary font-bold">Bob Martinez:</span>{" "}
                  bob@greenmint.io
                </div>
                <div>
                  <span className="text-foreground">Senha:</span> Senha456!
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => {
                setMode("login");
                setLoginEmail("alice@greenmint.io");
                setLoginPassword("Senha123!");
              }}
              className="w-full h-11 text-sm font-bold tracking-wider uppercase"
            >
              Preencher com credenciais de Alice
            </Button>

            <div className="pt-4 border-t border-border-dark text-center">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs text-secondary-text hover:text-accent underline transition-colors"
              >
                ← Voltar para o login
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
