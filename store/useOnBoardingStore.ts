import { create } from "zustand";

interface OnboardingState {
  user: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string[];
    profileImage: string;
    bio: string;
    portfolio: {
      linkedin: string;
      github: string;
      behance: string;
      website: string;
    };
  };
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  user: {
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    role: ["user"],
    profileImage: "",
    bio: "",
    portfolio: {
      linkedin: "",
      github: "",
      behance: "",
      website: "",
    },
  },
}));
