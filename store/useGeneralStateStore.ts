import { create } from "zustand";

interface GeneralAppState {
  showNewIdeaModal: boolean;
  setShowNewIdeaModal: (showNewIdeaModal: boolean) => void;
  toggleNewIdeaModal: () => void;
  resetNewIdeaModal: () => void;

  showInterestModal: boolean;
  interestProjectId: string | null;
  setShowShowInterestModal: (showInterestModal: boolean) => void;
  openShowInterestModal: (projectId: string) => void;
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
  interestProjectId: null,
  setShowShowInterestModal: (showInterestModal) => set({ showInterestModal }),
  openShowInterestModal: (projectId) =>
    set({ showInterestModal: true, interestProjectId: projectId }),
  toggleShowInterestModal: () =>
    set((state) => ({
      showInterestModal: !state.showInterestModal,
      ...(state.showInterestModal ? { interestProjectId: null } : {}),
    })),
  resetShowInterestModal: () =>
    set({ showInterestModal: false, interestProjectId: null }),
}));
