import { Request, Response } from "express";

export async function registerController(_req: Request, res: Response) {
  res.status(200).json({ success: true });
}
