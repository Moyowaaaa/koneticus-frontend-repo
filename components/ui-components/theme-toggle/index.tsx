"use client";

import React from "react";
import { useThemeStore } from "@/store/useThemeStore";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-[2.5rem] w-[4.5rem] items-center rounded-full p-1 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#151515" : "#E8E8E8",
        border: isDark ? "1px solid #333" : "1px solid #D0D0D0",
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sliding indicator */}
      <div
        className="absolute flex h-[2rem] w-[2rem] items-center justify-center rounded-full transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: "#6155F5",
          transform: isDark ? "translateX(2rem)" : "translateX(0)",
          boxShadow: "0 2px 8px rgba(97, 85, 245, 0.4)",
        }}
      >
        {/* Sun icon for light mode */}
        {!isDark && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path
              d="M12 2V4M12 20V22M4 12H2M6.31 6.31L4.9 4.9M17.69 6.31L19.1 4.9M6.31 17.69L4.9 19.1M17.69 17.69L19.1 19.1M22 12H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
        {/* Moon icon for dark mode */}
        {isDark && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="currentColor"
            />
            <circle cx="17" cy="7" r="1.5" fill="currentColor" />
            <circle cx="19" cy="10" r="1" fill="currentColor" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
