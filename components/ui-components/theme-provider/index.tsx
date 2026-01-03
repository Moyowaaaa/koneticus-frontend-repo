"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme class on mount and when theme changes
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
