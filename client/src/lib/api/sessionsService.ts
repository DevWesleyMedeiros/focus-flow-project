// TODO: Implementar serviço de sessões de foco - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_DASHBOARD_TIMER_VIEW.md
import { apiClient } from "./client";

export const sessionsService = {
  createSession: async (data: any) => {
    const response = await apiClient.post("/sessions", data);
    return response.data;
  },
  getSessions: async () => {
    const response = await apiClient.get("/sessions");
    return response.data;
  },
  getSessionById: async (sessionId: string) => {
    const response = await apiClient.get(`/sessions/${sessionId}`);
    return response.data;
  },
  endSession: async (sessionId: string) => {
    const response = await apiClient.patch(`/sessions/${sessionId}/end`);
    return response.data;
  },
};
