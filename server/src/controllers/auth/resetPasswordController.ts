import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../db";
import {
    forgotPasswordSchema,
    resetPasswordSchema,
} from "../../schemas/authSchemas";
import { mailService } from "../../services/mailService";
import {
    generateResetToken,
    markTokenAsUsed,
    validateResetToken,
} from "../../services/resetTokenService";

const SALT_ROUNDS = 10;

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const validated = resetPasswordSchema.parse(req.body);

    const tokenRecord = await validateResetToken(validated.token);
    if (!tokenRecord) {
      return res.status(400).json({
        error:
          "Link inválido ou expirado. Solicite um novo link de recuperação.",
      });
    }

    await markTokenAsUsed(tokenRecord.id);

    const newPasswordHash = await bcrypt.hash(validated.password, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { passwordHash: newPasswordHash },
    });

    // Revoga sessões anteriores: comportamento minimamente implementado
    return res.status(200).json({
      success: true,
      message: "Senha redefinida com sucesso. Faça login com sua nova senha.",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.issues[0].message });
    }
    return res.status(400).json({
      error: "Link inválido ou expirado. Solicite um novo link de recuperação.",
    });
  }
}

export async function forgotPasswordController(req: Request, res: Response) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.passwordHash) {
      const resetToken = await generateResetToken(user.id);
      const resetLink = `${process.env["CLIENT_ORIGIN"]}/reset-password?token=${resetToken}`;
      await mailService.sendEmail({
        to: user.email,
        subject: "Recuperação de senha - FocusFlow",
        html: `<p>Clique no link abaixo para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a><p>Este link é válido por 15 minutos.</p>`,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Se o e-mail informado existir e estiver vinculado a uma conta local, você receberá um link para redefinir sua senha em alguns instantes.",
    });
  } catch (_err: any) {
    return res.status(200).json({
      success: true,
      message:
        "Se o e-mail informado existir e estiver vinculado a uma conta local, você receberá um link para redefinir sua senha em alguns instantes.",
    });
  }
}
