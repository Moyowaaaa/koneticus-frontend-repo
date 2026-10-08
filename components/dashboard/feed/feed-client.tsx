"use client";

import TopBar from "@/components/ui-components/top-bar";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { SearchNormal } from "iconsax-reactjs";
import React, { useEffect } from "react";
import Feed from ".";

import EditIdeaModal from "../modals/edit-idea-modal";
import ProjectPreviewModal from "../modals/project-preview-modal";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";
import OnboardingChecklist from "../onboarding-checklist";
import Image from "next/image";

const FeedClient = () => {
  const { toggleNewIdeaModal } = useGeneralStateStore();
  const { setShowSearch } = useSearchStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const didVerify = localStorage.getItem("didVerify");
    if (didVerify === "true") {
      setTimeout(() => {
        localStorage.removeItem("didVerify");
      }, 3000);
    }
  }, []);

  // useEffect(() => {
  //   if (!user?.isEmailVerified) {
  //     router.push("/auth/verify-email");
  //     showToast.info("you need to verify your email");
  //   }
  // }, [!user?.isEmailVerified]);

  console.log(user?.isEmailVerified);
  return (
    <>
      <EditIdeaModal />
      <ProjectPreviewModal />
      <div className="w-full max-md:px-[22px]">
        <div className="relative flex h-full w-full flex-col max-md:pt-4">
          <TopBar className="flex w-full items-center justify-between gap-3 max-md:pb-4">
            <h1 className="min-w-0 truncate font-sora text-[20px] leading-7 font-semibold text-[#211E1E] md:text-[1.5rem] md:font-bold dark:text-white">
              Welcome {user?.firstname || ""},
            </h1>

            <div className="flex shrink-0 items-center gap-6">
              <SearchNormal
                onClick={() => setShowSearch(true)}
                size="24"
                className="cursor-pointer text-[#211E1E] dark:text-[#E9E9E9E9]"
              />
              <button
                type="button"
                onClick={toggleNewIdeaModal}
                className="flex h-10 md:w-[123px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[20px] bg-[#211E1E] px-[17px] py-[5px] font-sora text-[14px] leading-5 font-semibold text-white dark:bg-[#6155F5]"
              >
                <Image
                  src="/images/sidebar/feed-new-idea.svg"
                  alt=""
                  width={13}
                  height={13}
                />
                <p className="hidden md:flex">New idea</p>
              </button>
            </div>
          </TopBar>

          <div className="block pt-4">
            <OnboardingChecklist />
          </div>
          <Feed />
        </div>
      </div>
    </>
  );
};

export default FeedClient;
