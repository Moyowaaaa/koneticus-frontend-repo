import { create } from "zustand";

interface GeneralAppState {
  showNewIdeaModal: boolean;
  setShowNewIdeaModal: (showNewIdeaModal: boolean) => void;
  toggleNewIdeaModal: () => void;
  resetNewIdeaModal: () => void;

  showInterestModal: boolean;
  setShowShowInterestModal: (showNewIdeaModal: boolean) => void;
  toggleShowInterestModal: () => void;
  resetShowInterestModal: () => void;
}

export const useGeneralStateStore = create<GeneralAppState>((set) => ({
  showNewIdeaModal: false,
  setShowNewIdeaModal: (showNewIdeaModal) => set({ showNewIdeaModal }),
  toggleNewIdeaModal: () =>
    set((state) => ({ showNewIdeaModal: !state.showNewIdeaModal })),
  resetNewIdeaModal: () => set({ showNewIdeaModal: false }),

  //   -----show interest modal
  showInterestModal: false,
  setShowShowInterestModal: (showInterestModal) =>
    set({ showInterestModal: showInterestModal }),
  toggleShowInterestModal: () =>
    set((state) => ({ showInterestModal: !state.showNewIdeaModal })),
  resetShowInterestModal: () => set({ showInterestModal: false }),
}));
