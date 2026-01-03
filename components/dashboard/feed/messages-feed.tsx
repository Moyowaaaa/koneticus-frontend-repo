import { useDummyStore } from "@/store/useDummyStore";
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

type messageFeed = {
  senderName: string;
  message: string;
  time: string;
};

const MessagesFeed = () => {
  const messages: messageFeed[] = [
    {
      senderName: "Andrea Smith",
      message: "Here is my message to you today",
      time: "2: 00pm",
    },
    {
      senderName: "Andrea Smith",
      message: "Here is my message to you today",
      time: "2: 00pm",
    },
    {
      senderName: "Andrea Smith",
      message: "Here is my message to you today",
      time: "2: 00pm",
    },
  ];

  const { useDummyData } = useDummyStore();

  const messageItems = !useDummyData ? [] : messages;

  return (
    <>
      <div
        className="relative w-full h-[20rem] border rounded-[1.875rem] p-4 flex flex-col border-[#E9E9E9E9]
      dark:bg-[#80808026]
          dark:border-[#80808026]

      
      "
      >
        <div className="flex items-center justify-between w-full border-b border-#E9E9E9E9] pb-2">
          <h1 className="text-black text-[1.25rem] dark:text-[#FFFFFF]">
            {" "}
            Messages
          </h1>
          <p className="text-primary font-semibold text-[0.875rem]">See all</p>
        </div>

        {messageItems?.length === 0 ? (
          <MessagesEmptyState />
        ) : (
          <div className="flex flex-col gap-2 py-4">
            {messageItems?.map((item, index) => (
              <div className="flex items-start justify-between" key={index}>
                <div className="flex items-start gap-2">
                  <div className="relative h-[1.875rem] w-[1.875rem]">
                    <Image
                      src={"/images/dummy-avatar.svg"}
                      alt={``}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-base">{item.senderName}</h1>
                    <p className="font-[sora-light] text-brand-black dark:text-[#E9E9E9E9]">
                      {item.message}
                    </p>
                  </div>
                </div>

                <p className="font-[sora-light] text-brand-black text-sm dark:text-[#E9E9E9E9]">
                  2:00 pm
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MessagesFeed;
