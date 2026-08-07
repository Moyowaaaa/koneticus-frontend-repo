"use client";

import Image from "next/image";
import Link from "next/link";

export const MessagesEmptyState = () => {
  return (
    <div className="h-full w-full flex flex-col gap-2 items-center justify-center">
      <div className="relative h-[6.4375rem] w-[6.4375rem]">
        <Image src={"/images/messages-feed-empty.svg"} alt="" fill />
      </div>
      <p className="text-base">No message yet</p>
    </div>
  );
};

const MessagesFeed = () => {
  // Messaging API is not wired yet — keep the panel shell with empty state.
  const messageItems: never[] = [];

  return (
    <div
      className="relative w-full h-[20rem] border rounded-[1.875rem] p-4 flex flex-col border-[#E9E9E9E9]
      dark:bg-[#80808026]
          dark:border-[#80808026]
      "
    >
      <div className="flex items-center justify-between w-full border-b border-#E9E9E9E9] pb-2">
        <h1 className="text-black text-[1.25rem] dark:text-[#FFFFFF]">
          Messages
        </h1>
        <Link
          href="/dashboard/messages"
          className="text-primary font-semibold text-[0.875rem]"
        >
          See all
        </Link>
      </div>

      {messageItems.length === 0 ? (
        <MessagesEmptyState />
      ) : null}
    </div>
  );
};

export default MessagesFeed;
