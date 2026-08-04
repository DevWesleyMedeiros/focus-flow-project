// TODO: Implementar serviço de perfil de usuário
import { apiClient } from "./client";

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get("/profile");
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.put("/profile", data);
    return response.data;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await apiClient.post("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
