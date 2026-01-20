"use client";

import { Button } from "@/components/ui/button";
import { useDummyStore } from "@/store/useDummyStore";
import ThemeToggle from "@/components/ui-components/theme-toggle";
import { Bell } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useLogoutUser } from "@/api/auth/auth.mutations";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const TopNavBar = () => {
  const router = useRouter();
  const { toggleDummyData, useDummyData } = useDummyStore();
  const { mutateAsync: logoutUser, isPending } = useLogoutUser();
  const { clearAuth, user } = useAuthStore();

  const onLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }

    clearAuth();
    router.push("/auth/log-in");
  };

  console.log({ user });

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 hidden h-[5rem] w-full border-b border-border/60 bg-background/80 backdrop-blur md:block">
        <div className="mx-auto flex h-full w-full max-w-[112rem] items-center justify-between px-4 sm:px-6 lg:px-12">
          {/* <div className="flex items-center gap-2 font-sora text-[1.25rem] font-bold text-[#211E1E]">
            LOGO
          </div> */}

          <div className="relative h-[2.5rem] w-[2.5rem]">
            <Image
              src={"/images/purple_logo.png"}
              alt=""
              fill
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => toggleDummyData()}>
              {useDummyData ? "Disable Dummy data" : "Enable Dummy data"}
            </Button>
            <ThemeToggle />
            <Bell size={20} className="text-foreground" />

            <div
              onClick={() => onLogout()}
              className="relative h-[2.5rem] w-[2.5rem] rounded-full"
            >
              <Image
                src={user?.profilePicture || "/images/dummy-avatar.svg"}
                alt="avatar"
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopNavBar;
