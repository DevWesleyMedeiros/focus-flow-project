// TODO: Implementar serviço de tarefas - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_STUDY_TASK_VIEW.md
import { apiClient } from "./client";

export const tasksService = {
  getTasks: async () => {
    const response = await apiClient.get("/tasks");
    return response.data;
  },
  createTask: async (data: any) => {
    const response = await apiClient.post("/tasks", data);
    return response.data;
  },
  updateTask: async (taskId: string, data: any) => {
    const response = await apiClient.put(`/tasks/${taskId}`, data);
    return response.data;
  },
  deleteTask: async (taskId: string) => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },
  reorderTasks: async (order: string[]) => {
    const response = await apiClient.post("/tasks/reorder", { order });
    return response.data;
  },
};
