import Image from "next/image";
import React from "react";

export const MessagesEmptyState = () => {
  return (
    <div className="h-full w-full  flex flex-col gap-2 items-center justify-center">
      <div className="relative h-[6.4375rem] w-[6.4375rem] ">
        <Image src={"/images/messages-feed-empty.svg"} alt="" fill />
      </div>
      <p className="text-base">No message yet</p>
    </div>
  );
};

const MessagesFeed = () => {
  return (
    <>
      <div className="relative w-full h-[20rem] border rounded-[1.875rem] p-4 flex flex-col border-[#E9E9E9E9]">
        <div className="flex items-center justify-between w-full border-b border-#E9E9E9E9] pb-2">
          <h1 className="text-black text-[1.25rem]"> Messages</h1>
          <p className="text-primary font-semibold text-[0.875rem]">See all</p>
        </div>

        <MessagesEmptyState />
      </div>
    </>
  );
};

export default MessagesFeed;
