// TODO: Implementar Zustand store de tarefas - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_STUDY_TASK_VIEW.md
import { create } from "zustand";

type TasksState = {
  tasks: any[];
  isLoading: boolean;
  setTasks: (tasks: any[]) => void;
  addTask: (task: any) => void;
  updateTask: (id: string, updates: any) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (ids: string[]) => void;
};

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  isLoading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  reorderTasks: (ids) =>
    set((state) => ({
      tasks: ids
        .map((id) => state.tasks.find((t) => t.id === id)!)
        .filter(Boolean),
    })),
}));
