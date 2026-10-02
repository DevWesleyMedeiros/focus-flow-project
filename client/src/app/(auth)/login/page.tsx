"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../schemas/authSchemas";
import { authService } from "../../../lib/api/authService";
import {
  signInWithGoogle,
  signOutFirebase,
} from "../../../lib/firebase/client";

type Values = { email: string; password: string };
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(loginSchema) });
  const submit = async (values: Values) => {
    try {
      setError("");
      await authService.login(values);
      router.push("/");
      router.refresh();
    } catch (e: any) {
      setError(e.response?.data?.error ?? "Não foi possível entrar.");
    }
  };
  const google = async () => {
    try {
      setError("");
      setGoogleLoading(true);
      const idToken = await signInWithGoogle();
      await authService.createGoogleSession(idToken);
      router.push("/");
      router.refresh();
    } catch (e: any) {
      if (e.code !== "auth/popup-closed-by-user")
        setError(
          e.response?.data?.error ?? "Não foi possível entrar com Google.",
        );
      await signOutFirebase();
    } finally {
      setGoogleLoading(false);
    }
  };
  const busy = isSubmitting || googleLoading;
  return (
    <main className="bg-background text-on-background min-h-screen flex items-center justify-center etched-surface">
      <section className="w-full max-w-[420px] px-6">
        <div className="bg-surface-container border border-outline-variant p-8 rounded-xl shadow-2xl">
          <h1 className="font-headline-lg text-primary mb-8">FocusFlow</h1>
          <h2 className="font-headline-lg text-on-surface">
            BEM-VINDO DE VOLTA
          </h2>
          <p className="text-on-surface-variant mb-8">
            Retome seu fluxo. Entre no seu workspace.
          </p>
          <form
            onSubmit={handleSubmit(submit)}
            className="space-y-5"
            noValidate
          >
            <label className="block" htmlFor="email">
              E-mail
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={busy}
                className="w-full mt-1 p-3 rounded-lg bg-surface-container-low border border-outline-variant"
                {...register("email")}
              />
            </label>
            {errors.email && (
              <p id="email-error" className="text-error">
                {errors.email.message}
              </p>
            )}
            <label className="block" htmlFor="password">
              Senha
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                disabled={busy}
                className="w-full mt-1 p-3 rounded-lg bg-surface-container-low border border-outline-variant"
                {...register("password")}
              />
            </label>
            {errors.password && (
              <p id="password-error" className="text-error">
                {errors.password.message}
              </p>
            )}
            <Link href="/forgot-password" className="text-primary text-sm">
              Esqueceu sua senha?
            </Link>
            {error && (
              <p aria-live="polite" className="text-error">
                {error}
              </p>
            )}
            <button
              disabled={busy}
              className="w-full bg-primary text-on-primary p-3 rounded-lg disabled:opacity-60"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <div className="my-6 text-center text-outline">ou continue com</div>
          <button
            onClick={google}
            disabled={busy}
            className="w-full border border-outline-variant p-3 rounded-lg disabled:opacity-60"
          >
            {googleLoading ? "Conectando..." : "Continuar com Google"}
          </button>
          <p className="mt-7 text-center">
            Não possui conta?{" "}
            <Link className="text-primary" href="/register">
              Criar workspace
            </Link>
          </p>
        </div>
        <footer className="mt-6 text-center text-outline text-sm">
          Política de privacidade · Termos de serviço
        </footer>
      </section>
    </main>
  );
}
