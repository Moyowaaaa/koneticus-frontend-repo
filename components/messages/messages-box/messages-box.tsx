import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import ChatBubble from "../chat-bubble";
import Image from "next/image";
import gsap from "gsap";
import { useProfileModalStore } from "@/store/useProfileModalStore";
import UserProfileModal from "../user-profile-modal";

export const MesssagesBox = () => {
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const messages = useChatStore((state) => state.messages);
  const users = useChatStore((state) => state.users);
  const currentUserId = useChatStore((state) => state.currentUserId);
  const otherParticipant = useChatStore((state) => state.otherParticipant);
  const { openModal } = useProfileModalStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Get messages for current conversation
  const conversationMessages = currentConversationId
    ? messages[currentConversationId] || []
    : [];

  // Helper to determine if messages should be grouped (consecutive from same sender)
  const shouldGroupMessage = (currentIndex: number) => {
    if (currentIndex === 0) return false;
    const currentMessage = conversationMessages[currentIndex];
    const previousMessage = conversationMessages[currentIndex - 1];

    return currentMessage.senderId === previousMessage.senderId;
  };

  useEffect(() => {
    if (!conversationMessages.length) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages.length, currentConversationId]);

  // Show empty state if no conversation selected
  if (
    !currentConversationId ||
    !otherParticipant ||
    conversationMessages.length === 0
  ) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 text-center">
        <div className="relative flex h-36 w-36 items-center justify-center rounded-4xl bg-linear-to-b from-lavender/50 to-white ">
          <div className="absolute inset-3 rounded-[1.7rem] bg-white/70 blur-xl" />
          <Image
            src={"/images/messages-empty-state.svg"}
            alt="empty conversation illustration"
            width={120}
            height={152}
            className="relative "
          />
        </div>
        <p className="text-sm leading-5 text-brand-black dark:text-white">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  // Show conversation header and messages
  return (
    <div className="flex h-full flex-col">
      {/* Conversation Header */}

      {otherParticipant && (
        <div className="flex items-center gap-3 border-b border-gray-100 p-4 dark:border-[#80808026]">
          <div className="relative h-10 w-10">
            <Image
              src={otherParticipant.profile_photo || "/images/dummy-avatar.svg"}
              alt={`${otherParticipant.first_name} ${otherParticipant.last_name}`}
              fill
              className="rounded-full object-cover"
            />
            {otherParticipant.status && (
              <span
                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                  otherParticipant.status === "online"
                    ? "bg-emerald-500"
                    : otherParticipant.status === "away"
                    ? "bg-amber-400"
                    : "bg-gray-400"
                }`}
              />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-brand-black dark:text-white">
              {otherParticipant.first_name} {otherParticipant.last_name}
            </h3>
            <p className="text-xs text-brand-grey capitalize">
              {otherParticipant.status || "offline"}
            </p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 max-h-[40rem] pb-4">
        <div className="flex flex-col gap-4 py-4">
          {conversationMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-brand-grey">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            conversationMessages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const sender = users[message.senderId as string];
              const isGrouped = shouldGroupMessage(index);

              // Handle proposal messages
              const proposalData =
                message.type === "proposal"
                  ? {
                      title: "Dear Jordan,",
                      content: message.content || message.text || "",
                      type: "proposal" as const,
                      onViewProfile: () => {
                        if (sender) {
                          openModal(sender);
                        }
                      },
                      onCollaborate: () => console.log("Collaborate clicked"),
                      onReject: () => console.log("Reject clicked"),
                    }
                  : undefined;

              return (
                <ChatBubble
                  key={message.id}
                  message={message.text || message.content || ""}
                  isCurrentUser={isCurrentUser}
                  senderName={
                    !isCurrentUser && sender
                      ? `${sender.first_name} ${sender.last_name}`
                      : undefined
                  }
                  senderAvatar={
                    !isCurrentUser ? sender?.profile_photo : undefined
                  }
                  timestamp={message.timestamp as string}
                  showAvatar={!isCurrentUser}
                  isGrouped={isGrouped}
                  messageType={
                    message.type === "proposal" ? "proposal" : "text"
                  }
                  proposalData={proposalData}
                />
              );
            })
          )}
        </div>
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Profile Modal */}
      <UserProfileModal />
    </div>
  );
};
