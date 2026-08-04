// TODO: Implementar tipos TypeScript para tarefas
export type Task = {
  id: string;
  userId: string;
  categoryId?: string;
  title: string;
  description?: string;
  completed: boolean;
  order: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTaskDTO = Omit<
  Task,
  "id" | "createdAt" | "updatedAt" | "completed" | "order"
>;
