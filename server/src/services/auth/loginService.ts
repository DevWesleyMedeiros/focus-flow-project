import bcrypt from "bcrypt";
import { prisma } from "../../db";

export async function loginService(email: string, password: string) {
  // Busca usuário por e-mail
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  // Verifica se é conta Google (não tem passwordHash) - RN-AUTH-03
  if (!user.passwordHash) {
    throw new Error(
      "Esta conta usa login com Google. Use o botão 'Entrar com Google' para acessar.",
    );
  }

  // Compara senha com hash
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Credenciais inválidas");
  }

  // Retorna dados do usuário (sem senha)
  const { passwordHash, ...userWithoutPassword } = user;
  return {
    success: true,
    user: userWithoutPassword,
  };
}
