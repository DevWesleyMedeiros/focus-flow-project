// TODO: Implementar serviço de sessões de foco - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_DASHBOARD_TIMER_VIEW.md
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sessionsService = {
  createSession: async (data: any) => {
    const response = await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  getSessions: async () => {
    const response = await fetch(`${API_URL}/sessions`);
    return response.json();
  },
  getSessionById: async (sessionId: string) => {
    const response = await fetch(`${API_URL}/sessions/${sessionId}`);
    return response.json();
  },
  endSession: async (sessionId: string) => {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/end`, {
      method: "PATCH",
    });
    return response.json();
  },
};
