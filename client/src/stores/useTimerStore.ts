// TODO: Implementar Zustand store do timer - ver regras em docs/architecture/REGRAS_DE_NEGOCIO_DASHBOARD_TIMER_VIEW.md
import { create } from "zustand";

type TimerState = {
  timeRemaining: number;
  isRunning: boolean;
  currentTask: string | null;
  setTimeRemaining: (time: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  timeRemaining: 25 * 60,
  isRunning: false,
  currentTask: null,
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),
  resetTimer: () => set({ timeRemaining: 25 * 60, isRunning: false }),
}));
