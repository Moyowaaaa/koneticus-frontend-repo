"use client";

import React, { useState } from "react";
import { Edit2, People } from "iconsax-reactjs";
import TopBar from "../ui-components/top-bar";
import MessagesSidebar from "./sidebar";
import MessagesChatbox from "./chatbox";
import NewMessageModal from "./new-message-modal";
import CreateGroupModal from "./create-group-modal";

const MessagesClient = () => {
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  return (
    <>
      <NewMessageModal open={showNewMessage} onOpenChange={setShowNewMessage} />
      <CreateGroupModal
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
      />
      <div className="relative flex w-full min-h-0 flex-col overflow-hidden pt-4 px-6">
        <TopBar className="flex items-center justify-between gap-3">
          <h1 className="text-[2rem] font-semibold text-brand-black dark:text-white">
            Messages
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreateGroup(true)}
              className="flex items-center gap-2 rounded-full border border-[#E9E9E9] bg-white px-4 py-2 text-sm font-medium text-brand-black transition hover:bg-lavender dark:border-[#80808026] dark:bg-transparent dark:text-white dark:hover:bg-[#80808026]"
            >
              <People size={16} variant="Bold" />
              New group
            </button>
            <button
              type="button"
              onClick={() => setShowNewMessage(true)}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Edit2 size={16} color="white" variant="Bold" />
              New conversation
            </button>
          </div>
        </TopBar>

        <div className="flex min-h-0 items-stretch overflow-hidden">
          <MessagesSidebar onNewMessage={() => setShowNewMessage(true)} />
          <MessagesChatbox />
        </div>
      </div>
    </>
  );
};

export default MessagesClient;
