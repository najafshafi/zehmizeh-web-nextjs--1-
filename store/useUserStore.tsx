import { create } from "zustand";

type UserState = {
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string }) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));