"use client";

import { Button } from "@/components/ui/button";
import { useDummyStore } from "@/store/useDummyStore";
import { Bell } from "lucide-react";
import Image from "next/image";
import React from "react";

const TopNavBar = () => {
  const { toggleDummyData, useDummyData } = useDummyStore();
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
            <Bell size={20} className="text-black" />

            <div className="relative h-[2.5rem] w-[2.5rem]">
              <Image
                src={"/images/dummy-avatar.svg"}
                alt="avatar"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopNavBar;
