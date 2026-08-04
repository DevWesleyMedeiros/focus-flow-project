// TODO: Implementar schemas Zod para sessões - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_DASHBOARD_TIMER_VIEW.md
import { z } from "zod";

export const createSessionSchema = z.object({
  duration: z.number().min(1),
  taskId: z.string().optional(),
});

export const endSessionSchema = z.object({
  sessionId: z.string().uuid(),
});
