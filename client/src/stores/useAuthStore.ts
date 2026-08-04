// TODO: Implementar Zustand store de autenticação - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_LOGIN.md
import { create } from "zustand";

type AuthState = {
  user: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null }),
}));
