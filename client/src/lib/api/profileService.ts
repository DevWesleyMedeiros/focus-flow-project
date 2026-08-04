// TODO: Implementar serviço de perfil de usuário
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const profileService = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/profile`);
    return response.json();
  },
  updateProfile: async (data: any) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await fetch(`${API_URL}/profile/avatar`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },
};
