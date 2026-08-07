"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement?.parentElement?.classList.add("scale-[1.01]");
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement?.parentElement?.classList.remove("scale-[1.01]");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de envio de e-mail
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Forgot password request:", { email });
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center etched-surface">
      <div className="w-full max-w-md px-6">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">FocusFlow</h1>
          <p className="text-on-background/70">Recupere sua senha</p>
        </div>

        {/* Card do formulário */}
        <div className="bg-surface rounded-2xl p-8 shadow-xl transition-transform duration-300 ease-out">
          {!isSubmitted ? (
            <>
              <p className="text-on-background/80 mb-6 text-center">
                Informe seu e-mail e enviaremos instruções para redefinir sua senha.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo E-mail */}
                <div className="transition-transform duration-300 ease-out input-focus-effect rounded-xl">
                  <label htmlFor="email" className="block text-label-caps text-primary/80 mb-2">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full px-4 py-3 bg-surface-variant rounded-xl border border-outline/20 focus:border-primary focus:outline-none transition-all duration-200 text-on-background placeholder:text-on-background/40"
                    placeholder="seu@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Botão Enviar */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-primary text-on-primary font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl">refresh</span>
                      Enviando...
                    </>
                  ) : (
                    "Enviar instruções"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-success">mail</span>
              </div>
              <h2 className="text-xl font-semibold text-on-background mb-2">E-mail enviado!</h2>
              <p className="text-on-background/70 mb-6">
                Se o e-mail informado existir, você receberá instruções para redefinir sua senha em breve.
              </p>
            </div>
          )}

          {/* Link para voltar ao login */}
          <div className="mt-6 pt-6 border-t border-outline/10 text-center">
            <Link 
              href="/login" 
              className="text-primary hover:text-primary/80 transition-colors duration-200 inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}