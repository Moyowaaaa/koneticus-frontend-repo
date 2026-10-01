"use client";

import ThemeToggle from "@/components/ui-components/theme-toggle";
import BrandLogo from "@/components/ui-components/brand-logo";
import NotificationsPopover from "@/components/navigation/topbar/notifications-popover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import { useLogoutUser } from "@/api/auth/auth.mutations";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchStore } from "@/store/useSearchStore";
import { LogOut, Search, Settings } from "lucide-react";
import SafeImage from "@/components/ui-components/safe-image";
import Image from "next/image";

const AccountMenu = ({ showTheme = false }: { showTheme?: boolean }) => {
  const router = useRouter();
  const { mutateAsync: logoutUser, isPending } = useLogoutUser();
  const { clearAuth, user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = async () => {
    setMenuOpen(false);
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }

    clearAuth();
    router.push("/auth/log-in");
  };

  const onOpenSettings = () => {
    setMenuOpen(false);
    router.push("/dashboard/settings");
  };

  const displayName =
    [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "Account";

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E9E9E9] outline-none ring-offset-background transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-[#2a2727]"
        >
          {user?.profilePicture ? (
            <SafeImage
              src={user.profilePicture}
              alt="avatar"
              fill
              className="object-cover"
            />
          ) : (
            <span className="font-sora text-sm font-medium text-brand-black dark:text-white">
              {(user?.firstname?.[0] || user?.email?.[0] || "?").toUpperCase()}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-56 rounded-2xl border border-[#e9e9e9] p-2 shadow-lg dark:border-[#80808026] dark:bg-[#111111]"
      >
        <div className="px-3 py-2">
          <p className="truncate font-sora text-sm font-medium text-brand-black dark:text-white">
            {displayName}
          </p>
          {user?.email && (
            <p className="truncate font-sora text-xs text-brand-grey">
              {user.email}
            </p>
          )}
        </div>

        <div className="my-1 h-px bg-[#e9e9e9] dark:bg-[#80808026]" />

        {showTheme && (
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-sora text-sm text-brand-black dark:text-white">
              Appearance
            </span>
            <ThemeToggle />
          </div>
        )}

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-sora text-sm text-brand-black transition-colors hover:bg-accent dark:text-white"
        >
          <Settings size={16} />
          Settings
        </button>

        <button
          type="button"
          onClick={onLogout}
          disabled={isPending}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-sora text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut size={16} />
          {isPending ? "Logging out..." : "Log out"}
        </button>
      </PopoverContent>
    </Popover>
  );
};

const TopNavBar = () => {
  const setShowSearch = useSearchStore((state) => state.setShowSearch);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 flex h-[77px] w-full items-center justify-between border-b border-[rgba(233,233,233,0.91)] bg-white px-6 md:hidden dark:border-[#80808026] dark:bg-background">
        <div className="flex items-center gap-3">
          <div className="relative size-8 shrink-0">
            <Image
              src="/images/purple_logo.png"
              alt="Koneticus"
              fill
              className="object-cover"
            />
          </div>
          <span className="flex h-[29px] w-[72px] items-center justify-center rounded-[20px] bg-[#827AE1] font-sora text-[14px] leading-5 font-semibold text-white">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-6">
          <NotificationsPopover bellVariant="mobile" />
          <AccountMenu showTheme />
        </div>
      </nav>

      <nav className="fixed inset-x-0 top-0 z-50 hidden h-[5rem] w-full border-b border-border/60 bg-background/80 backdrop-blur md:block">
        <div className="mx-auto flex h-full w-full max-w-[80rem] items-center justify-between px-2 xl:px-0">
          <BrandLogo />

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setShowSearch(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-brand-black transition hover:bg-[#E9E9E9] dark:text-white dark:hover:bg-[#2a2727]"
            >
              <Search size={18} />
            </button>
            <ThemeToggle />
            <NotificationsPopover />
            <AccountMenu />
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopNavBar;
