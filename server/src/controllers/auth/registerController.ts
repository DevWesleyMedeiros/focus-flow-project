import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../db";
import { registerSchema } from "../../schemas/authSchemas";

const SALT_ROUNDS = 10;

export async function registerController(req: Request, res: Response) {
  try {
    // Valida dados com Zod (RN-AUTH-04 - validação backend)
    const validated = registerSchema.parse(req.body);

    // Verifica se e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      // Se existe, verifica se é Google ou local - RN-AUTH-03
      if (existingUser.firebaseUid) {
        return res.status(409).json({
          error:
            "Este e-mail já está cadastrado com uma conta Google. Use o botão 'Entrar com Google' para acessar.",
        });
      }
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    // Cria hash da senha (RN-AUTH-05)
    const passwordHash = await bcrypt.hash(validated.password, SALT_ROUNDS);

    // Cria usuário no banco
    const newUser = await prisma.user.create({
      data: {
        email: validated.email,
        displayName: validated.displayName,
        passwordHash,
        // firebaseUid fica null para usuários locais - RN-AUTH-01/RN-AUTH-02
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ success: true, user: newUser });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.issues[0].message });
    }
    return res.status(500).json({ error: "Erro interno ao criar conta" });
  }
}
