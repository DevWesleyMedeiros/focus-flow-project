import { apiClient } from "./client";

type LoginData = { email: string; password: string };
type RegisterData = { email: string; password: string; displayName: string; confirmPassword: string };
type ResetData = { token: string; newPassword: string; confirmPassword: string };

export const authService = {
  login: async (data: LoginData) => (await apiClient.post("/auth/login", data)).data,
  register: async (data: RegisterData) => (await apiClient.post("/auth/register", data)).data,
  createGoogleSession: async (idToken: string) => (await apiClient.post("/auth/session", { idToken })).data,
  forgotPassword: async (email: string) => (await apiClient.post("/auth/forgot-password", { email })).data,
  resetPassword: async (data: ResetData) => (await apiClient.post("/auth/reset-password", data)).data,
  logout: async () => (await apiClient.post("/auth/logout")).data,
  getCurrentUser: async () => (await apiClient.get("/auth/me")).data,
};
