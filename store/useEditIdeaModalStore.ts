"use client";

import { create } from "zustand";

interface EditIdeaModalState {
  isOpen: boolean;
  ideaId: string | null;
  openModal: (ideaId: string) => void;
  closeModal: () => void;
}

export const useEditIdeaModalStore = create<EditIdeaModalState>((set) => ({
  isOpen: false,
  ideaId: null,
  openModal: (ideaId) => set({ isOpen: true, ideaId }),
  closeModal: () => set({ isOpen: false, ideaId: null }),
}));
