"use client";

import ButtonV2 from "@/components/ui-components/button";
import TopBar from "@/components/ui-components/top-bar";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { AddCircle, SearchNormal } from "iconsax-reactjs";
import React from "react";
import Feed from ".";
import SpotlightFeed from "./spotlight-feed";
import MessagesFeed from "./messages-feed";
import SearchModal from "../modals/search-modal";
import { useSearchStore } from "@/store/useSearchStore";
import { useDummyStore } from "@/store/useDummyStore";

const FeedClient = () => {
  const { toggleNewIdeaModal } = useGeneralStateStore();
  const { setShowSearch } = useSearchStore();

  return (
    <>
      <SearchModal />
      <div className=" w-full  flex items-start gap-10 pt-6">
        <div className="relative h-full w-8/12 flex flex-col gap-3">
          <TopBar className="flex items-center w-full justify-between">
            <h1 className="text-[1.875rem] font-bold">Welcome Oba,</h1>

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
        <div className="relative h-full w-4/12 flex flex-col gap-4">
          <SpotlightFeed />
          <MessagesFeed />
        </div>
      </div>
    </>
  );
};

export default FeedClient;
