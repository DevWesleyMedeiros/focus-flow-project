// TODO: Implementar serviço de categorias de tarefas
import { apiClient } from "./client";

export const categoriesService = {
  getCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },
  createCategory: async (data: any) => {
    const response = await apiClient.post("/categories", data);
    return response.data;
  },
};
