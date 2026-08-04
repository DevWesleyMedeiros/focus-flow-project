// TODO: Implementar tipos TypeScript para sessões de foco
export type FocusSession = {
  id: string;
  userId: string;
  taskId?: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSessionDTO = Omit<
  FocusSession,
  "id" | "createdAt" | "updatedAt"
>;
