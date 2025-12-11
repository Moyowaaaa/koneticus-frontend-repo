import { create } from "zustand";

interface SearchStore {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  showSearch: boolean;
  setShowSearch: (showSearch: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  showSearch: false,
  setShowSearch: (showSearch: boolean) => set({ showSearch }),
}));
