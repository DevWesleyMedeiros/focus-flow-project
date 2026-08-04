// TODO: Implementar tipos TypeScript para usuário
export type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  dailyGoal: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserDTO = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt">
>;
