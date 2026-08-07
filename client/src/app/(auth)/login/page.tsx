"use client";
import { loginSchema } from "../../../schemas/authSchemas";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrorMessage(result.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }

    setErrorMessage(null);
    console.log("Login attempt:", { email });
  };

  const handleGoogleLogin = () => {
    // Implementar lógica de login com Google posteriormente
    console.log("Google login attempt");
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement?.parentElement?.classList.add("scale-[1.01]");
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.parentElement?.parentElement?.classList.remove("scale-[1.01]");
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center etched-surface selection:bg-primary-container selection:text-on-primary-container">
      <header className="mb-12 animate-fade-in">
        <h1 className="font-headline-lg text-primary">FocusFlow</h1>
      </header>
      <main className="w-full max-w-[420px] px-container-margin md:px-0">
        <div className="bg-surface-container border border-outline-variant p-8 md:p-10 rounded-xl shadow-2xl transition-all duration-300">
          <div className="mb-10">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
              Welcome back
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Resume your flow. Sign in to your deep work workspace.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label
                className="font-label-caps text-label-caps text-on-surface-variant group-focus-within:text-primary transition-colors"
                htmlFor="email"
              >
                EMAIL ADDRESS
              </label>
              <div className="relative flex items-center input-focus-effect rounded-lg">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                  mail
                </span>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-11 pr-4 font-body-sm text-body-sm text-on-surface placeholder:text-outline/50 focus:border-primary focus:ring-0 outline-none transition-all"
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
            <div className="space-y-2 group">
              <div className="flex justify-between items-center">
                <label
                  className="font-label-caps text-label-caps text-on-surface-variant group-focus-within:text-primary transition-colors"
                  htmlFor="password"
                >
                  PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="font-label-caps text-[10px] text-primary hover:underline transition-all"
                >
                  FORGOT?
                </Link>
              </div>
              <div className="relative flex items-center input-focus-effect rounded-lg">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                  lock
                </span>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-11 pr-4 font-body-sm text-body-sm text-on-surface placeholder:text-outline/50 focus:border-primary focus:ring-0 outline-none transition-all"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
            {errorMessage ? (
              <p
                className="rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-sm text-error"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-headline-md text-headline-md py-3.5 rounded-lg transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Sign In
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </form>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-container px-4 text-outline font-label-caps text-label-caps">
                Or continue with
              </span>
            </div>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-outline-variant hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="currentColor"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="currentColor"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="currentColor"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="currentColor"
              />
            </svg>
            Google
          </button>
        </div>
        <footer className="mt-8 text-center space-y-4">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
            >
              Create workspace
            </Link>
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </footer>
      </main>
      <div className="fixed top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"></div>
    </div>
  );
}
