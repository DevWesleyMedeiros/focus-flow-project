// Serviço de autenticação implementado com Axios - alinhado com REGRAS_DE_NEGOCIO_LOGIN.md
import { apiClient } from "./client";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterData) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
