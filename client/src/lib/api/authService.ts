// TODO: Implementar serviço de autenticação - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_LOGIN.md
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
  register: async (data: any) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, { method: "POST" });
    return response.json();
  },
};
