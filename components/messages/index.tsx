"use client";

import React, { useState } from "react";
import { Edit2, People } from "iconsax-reactjs";
import TopBar from "../ui-components/top-bar";
import MessagesSidebar from "./sidebar";
import MessagesChatbox from "./chatbox";
import { useChatStore } from "@/store/useChatStore";
import NewMessageModal from "./new-message-modal";
import CreateGroupModal from "./create-group-modal";

const MessagesClient = () => {
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const isMobileChatBoxOpened = useChatStore(
    (state) => state.isMobileChatBoxOpened,
  );

  return (
    <>
      <NewMessageModal open={showNewMessage} onOpenChange={setShowNewMessage} />
      <CreateGroupModal
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
      />
      <div className="relative flex w-full min-h-0 flex-col overflow-hidden pt-4 px-6">
        <TopBar className="flex flex-row md:items-center justify-between gap-3">
          <h1 className="text-[1.25rem] md;text-[1.5rem] font-semibold text-brand-black dark:text-white">
            Messages
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCreateGroup(true)}
              className="flex items-center gap-2 rounded-full border border-[#E9E9E9] bg-white px-4 py-2 text-sm font-medium text-brand-black transition hover:bg-lavender dark:border-[#80808026] dark:bg-transparent dark:text-white dark:hover:bg-[#80808026]"
            >
              <People size={16} variant="Bold" />
              <p className="hidden md:flex">New group</p>
            </button>
            <button
              type="button"
              onClick={() => setShowNewMessage(true)}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Edit2 size={16} color="white" variant="Bold" />
              <p className="hidden md:flex">New conversation</p>
            </button>
          </div>
        </TopBar>

        <div className="flex min-h-0 items-stretch overflow-hidden">
          <MessagesSidebar onNewMessage={() => setShowNewMessage(true)} />
          <div className="hidden min-w-0 flex-1 lg:flex">
            <MessagesChatbox />
          </div>
        </div>
      </div>

      {isMobileChatBoxOpened && (
        <div className="fixed inset-0 z-[60] flex h-dvh w-full flex-col bg-white lg:hidden dark:bg-background">
          <MessagesChatbox fill />
        </div>
      )}
    </>
  );
};

export default MessagesClient;
