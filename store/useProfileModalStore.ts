"use client";

import { create } from "zustand";
import { ChatUser } from "./useChatStore";

interface ProfileModalState {
  isOpen: boolean;
  user: ChatUser | null;
  openModal: (user: ChatUser) => void;
  closeModal: () => void;
}

export const useProfileModalStore = create<ProfileModalState>((set) => ({
  isOpen: false,
  user: null,
  openModal: (user) => set({ isOpen: true, user }),
  closeModal: () => set({ isOpen: false, user: null }),
}));
