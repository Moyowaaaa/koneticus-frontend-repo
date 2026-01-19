import { create } from "zustand";

interface Portfolio {
  linkedin: string;
  github: string;
  behance: string;
  website: string;
}

interface OnboardingUser {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: string[];
  profileImageFile: File | null; // Actual file for upload
  profileImagePreview: string; // Base64/URL for preview display
  bio: string;
  portfolio: Portfolio;
}

interface OnboardingState {
  user: OnboardingUser;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setFirstname: (firstname: string) => void;
  setLastname: (lastname: string) => void;
  setRole: (role: string[]) => void;
  setProfileImage: (file: File | null, preview: string) => void;
  setBio: (bio: string) => void;
  setPortfolio: (portfolio: Partial<Portfolio>) => void;
  setUser: (user: Partial<OnboardingUser>) => void;
  resetUser: () => void;
}

const initialUser: OnboardingUser = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  role: [],
  profileImageFile: null,
  profileImagePreview: "",
  bio: "",
  portfolio: {
    linkedin: "",
    github: "",
    behance: "",
    website: "",
  },
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  user: initialUser,

  setEmail: (email) => set((state) => ({ user: { ...state.user, email } })),

  setPassword: (password) =>
    set((state) => ({ user: { ...state.user, password } })),

  setFirstname: (firstname) =>
    set((state) => ({ user: { ...state.user, firstname } })),

  setLastname: (lastname) =>
    set((state) => ({ user: { ...state.user, lastname } })),

  setRole: (role) => set((state) => ({ user: { ...state.user, role } })),

  setProfileImage: (profileImageFile, profileImagePreview) =>
    set((state) => ({
      user: { ...state.user, profileImageFile, profileImagePreview },
    })),

  setBio: (bio) => set((state) => ({ user: { ...state.user, bio } })),

  setPortfolio: (portfolio) =>
    set((state) => ({
      user: {
        ...state.user,
        portfolio: { ...state.user.portfolio, ...portfolio },
      },
    })),

  setUser: (userData) =>
    set((state) => ({ user: { ...state.user, ...userData } })),

  resetUser: () => set({ user: initialUser }),
}));
