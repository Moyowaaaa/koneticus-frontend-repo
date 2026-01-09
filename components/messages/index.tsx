"use client";

import React from "react";
import TopBar from "../ui-components/top-bar";
import MessagesSidebar from "./sidebar";
import MessagesChatbox from "./chatbox";

const MessagesClient = () => {
  return (
    <>
      <div className="relative flex flex-col  w-full pt-4 px-6">
        <TopBar>
          <h1
            className="text-[2rem] font-semibold text-brand-black
          dark:text-white
          "
          >
            Messages
          </h1>
        </TopBar>

        <div className="flex items-start">
          <MessagesSidebar />
          <MessagesChatbox />
        </div>

        {/* MessagesClient */}
      </div>
    </>
  );
};

export default MessagesClient;
