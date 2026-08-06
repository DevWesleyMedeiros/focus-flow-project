import { Request, Response } from "express";

export async function resetPasswordController(_req: Request, res: Response) {
  res.status(200).json({ success: true });
}
