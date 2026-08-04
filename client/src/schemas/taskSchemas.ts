// TODO: Implementar schemas Zod para tarefas - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_STUDY_TASK_VIEW.md
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
