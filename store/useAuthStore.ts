import { ILoginUserData } from "@/api/auth/auth.model";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth-cookie";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: ILoginUserData | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: ILoginUserData, token: string) => void;
  setUser: (user: ILoginUserData) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        setAuthCookie(token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearAuth: () => {
        clearAuthCookie();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
