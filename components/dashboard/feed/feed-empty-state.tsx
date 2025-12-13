import ButtonV2 from "@/components/ui-components/button";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { AddCircle } from "iconsax-reactjs";
import React from "react";

const FeedEmptyState = () => {
  const { toggleNewIdeaModal } = useGeneralStateStore();

  return (
    <>
      <div className="w-full flex items-center justify-center min-h-[30rem] flex flex-col gap-4">
        <ButtonV2
          type="submit"
          className="w-max h-max !px-6 border-none"
          IconPlacement="left"
          Icon={<AddCircle size="13" color="white" variant="Bold" />}
          // disabled={isLoading}
          variant="dark"
          onClick={toggleNewIdeaModal}
        >
          New Idea
        </ButtonV2>

        <h1 className="text-[0.875rem] text-[#211E1E] mx-auto text-center max-w-[15rem]">
          Post your idea and get a friend to collaborate with!
        </h1>
      </div>
    </>
  );
};

export default FeedEmptyState;
