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
    getResetTokenHash,
} from "../../services/resetTokenService";

const SALT_ROUNDS = 10;

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const validated = resetPasswordSchema.parse(req.body);

    const newPasswordHash = await bcrypt.hash(validated.newPassword, SALT_ROUNDS);
    const consumed = await prisma.$transaction(async (tx) => {
      const record = await tx.passwordTokenReset.findFirst({ where: { tokenHash: getResetTokenHash(validated.token), expiresAt: { gt: new Date() }, usedAt: null }, include: { user: true } });
      if (!record || record.user.authProvider !== "LOCAL") return false;
      const updated = await tx.passwordTokenReset.updateMany({ where: { id: record.id, usedAt: null }, data: { usedAt: new Date() } });
      if (updated.count !== 1) return false;
      await tx.user.update({ where: { id: record.userId }, data: { passwordHash: newPasswordHash } });
      await tx.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } });
      return true;
    });
    if (!consumed) return res.status(400).json({ error: "Link inválido ou expirado" });
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
        "Se o e-mail informado estiver cadastrado, você receberá instruções para redefinir sua senha.",
    });
  } catch (_err: any) {
    return res.status(200).json({
      success: true,
      message:
        "Se o e-mail informado estiver cadastrado, você receberá instruções para redefinir sua senha.",
    });
  }
}
