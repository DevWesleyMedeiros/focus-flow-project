"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Verifica se há token na URL - seguindo RF-04g: não valida token antes do submit
  useEffect(() => {
    if (!token) {
      setHasError(true);
      setErrorMessage("link inválido ou expirado");
    }
  }, [token]);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement?.parentElement?.classList.add("scale-[1.01]");
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement?.parentElement?.classList.remove("scale-[1.01]");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica de senha (seguindo RN-AUTH-04)
    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      setHasError(true);
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 15) {
      setErrorMessage("A senha deve ter entre 8 e 15 caracteres");
      setHasError(true);
      return;
    }

    // Validação dos requisitos de senha
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setErrorMessage(
        "A senha deve conter: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial",
      );
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      // Simulação de validação do token e troca de senha
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Reset password request:", { token, newPassword });

      // Simulação de sucesso - seguindo RF-04f: token invalidado, sessões revogadas
      setIsSuccess(true);
    } catch (error) {
      // Seguindo RF-04g: erro genérico para qualquer falha
      setHasError(true);
      setErrorMessage("link inválido ou expirado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center etched-surface">
      <div className="w-full max-w-md px-6">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">FocusFlow</h1>
          <p className="text-on-background/70">Redefina sua senha</p>
        </div>

        {/* Card do formulário */}
        <div className="bg-surface rounded-2xl p-8 shadow-xl transition-transform duration-300 ease-out">
          {!isSuccess && !hasError ? (
            <>
              <p className="text-on-background/80 mb-6 text-center">
                Insira sua nova senha para redefinir o acesso à sua conta.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Nova Senha */}
                <div className="transition-transform duration-300 ease-out input-focus-effect rounded-xl">
                  <label
                    htmlFor="newPassword"
                    className="block text-label-caps text-primary/80 mb-2"
                  >
                    Nova senha
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-surface-variant rounded-xl border border-outline/20 focus:border-primary focus:outline-none transition-all duration-200 text-on-background placeholder:text-on-background/40"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Campo Confirmar Senha */}
                <div className="transition-transform duration-300 ease-out input-focus-effect rounded-xl">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-label-caps text-primary/80 mb-2"
                  >
                    Confirmar senha
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-surface-variant rounded-xl border border-outline/20 focus:border-primary focus:outline-none transition-all duration-200 text-on-background placeholder:text-on-background/40"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Requisitos de senha */}
                <div className="text-xs text-on-background/60 space-y-1 p-4 bg-surface-variant/50 rounded-xl">
                  <p className="font-medium text-primary/80 mb-2">
                    Requisitos da senha:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Entre 8 e 15 caracteres</li>
                    <li>Pelo menos 1 letra maiúscula</li>
                    <li>Pelo menos 1 letra minúscula</li>
                    <li>Pelo menos 1 número</li>
                    <li>Pelo menos 1 caractere especial (!@#$%^&*())</li>
                  </ul>
                </div>

                {/* Botão Redefinir */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-primary text-on-primary font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl">
                        refresh
                      </span>
                      Processando...
                    </>
                  ) : (
                    "Redefinir senha"
                  )}
                </button>
              </form>
            </>
          ) : isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-success">
                  check_circle
                </span>
              </div>
              <h2 className="text-xl font-semibold text-on-background mb-2">
                Senha redefinida!
              </h2>
              <p className="text-on-background/70 mb-6">
                Sua senha foi atualizada com sucesso. Você já pode acessar sua
                conta com a nova senha.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                Ir para o login
              </Link>
            </div>
          ) : (
            /* Erro genérico - seguindo RF-04g */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-error">
                  error
                </span>
              </div>
              <h2 className="text-xl font-semibold text-on-background mb-2">
                Link inválido
              </h2>
              <p className="text-on-background/70 mb-6">
                {errorMessage}. O link pode ter expirado ou já ter sido
                utilizado.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
                Solicitar novo link
              </Link>
            </div>
          )}

          {/* Link para voltar ao login (apenas quando não está em estado de sucesso ou erro) */}
          {!isSuccess && !hasError && (
            <div className="mt-6 pt-6 border-t border-outline/10 text-center">
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 transition-colors duration-200 inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
                Voltar para o login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
