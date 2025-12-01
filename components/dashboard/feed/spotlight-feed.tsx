import Image from "next/image";
import React from "react";

export const SpotlightEmptyState = () => {
  return (
    <div className="relative  h-full w-full  flex flex-col gap-2 items-center justify-center">
      <div className="absolute h-88 w-full -top-6 -left-2">
        <Image
          src={"/images/spotlights-feed-empty.svg"}
          alt=""
          fill
          className="absolute left-2 top-0"
        />
      </div>
    </div>
  );
};

const SpotlightFeed = () => {
  return (
    <>
      <div
        className="relative flex 
        rounded-[1.875rem] p-4  flex-col border-[#E9E9E9E9]
        w-full border 
      
      h-112
      "
      >
        <div className="flex items-center justify-between w-full border-b border-#E9E9E9E9] pb-2 bg-[white] z-5">
          <h1 className="text-black text-[1.25rem]">
            {" "}
            This week&apos;s spotlight
          </h1>
        </div>

        <SpotlightEmptyState />
      </div>
    </>
  );
};

export default SpotlightFeed;
