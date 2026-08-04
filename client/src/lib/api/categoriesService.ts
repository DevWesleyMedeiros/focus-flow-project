// TODO: Implementar serviço de categorias de tarefas
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoriesService = {
  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
  },
  createCategory: async (data: any) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
