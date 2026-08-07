"use client";

import ButtonV2 from "@/components/ui-components/button";
import TopBar from "@/components/ui-components/top-bar";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { AddCircle, SearchNormal } from "iconsax-reactjs";
import React, { useEffect } from "react";
import Feed from ".";

import SearchModal from "../modals/search-modal";
import EditIdeaModal from "../modals/edit-idea-modal";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toasts";

const FeedClient = () => {
  const router = useRouter();
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
      <SearchModal />
      <EditIdeaModal />
      <div className=" w-full  flex items-start gap-10 pt-6">
        <div className="relative h-full w-8/12 flex flex-col gap-3">
          <TopBar className="flex items-center w-full justify-between">
            <h1 className="text-[1.875rem] font-bold">
              Welcome {user?.firstname || ""},
            </h1>

            <div className="flex items-center gap-2">
              <SearchNormal
                onClick={() => setShowSearch(true)}
                size="24"
                className="text-[#211E1E] dark:text-[#E9E9E9E9]"
              />
              <ButtonV2
                type="submit"
                className="w-max h-max !px-6 border-none dark:bg-[#6155F5]"
                IconPlacement="left"
                Icon={<AddCircle size="13" color="white" variant="Bold" />}
                onClick={toggleNewIdeaModal}
                variant="dark"
              >
                New Idea
              </ButtonV2>
            </div>
          </TopBar>

          <Feed />
        </div>
      </div>
    </>
  );
};

export default FeedClient;
