import { create } from "zustand";

interface dummyStateStore {
  useDummyData: boolean;
  toggleDummyData: () => void;
}

export const useDummyStore = create<dummyStateStore>((set) => ({
  useDummyData: false,
  toggleDummyData: () => {
    set((state) => ({ useDummyData: !state.useDummyData }));
    localStorage.removeItem("chat-store");
  },
}));
