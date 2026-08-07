// Schemas Zod para autenticação - alinhados com REGRAS_DE_NEGOCIO_LOGIN.md
import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,15}$/;

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const registerSchema = z
  .object({
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Senha deve ter 8-15 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial",
      ),
    displayName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .regex(
        passwordRegex,
        "Senha deve ter 8-15 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
