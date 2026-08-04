// TODO: Implementar serviço de tarefas - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_STUDY_TASK_VIEW.md
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const tasksService = {
  getTasks: async () => {
    const response = await fetch(`${API_URL}/tasks`);
    return response.json();
  },
  createTask: async (data: any) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  updateTask: async (taskId: string, data: any) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  deleteTask: async (taskId: string) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });
    return response.json();
  },
  reorderTasks: async (order: string[]) => {
    const response = await fetch(`${API_URL}/tasks/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    return response.json();
  },
};
