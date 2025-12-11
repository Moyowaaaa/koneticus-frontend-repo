import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { useChatStore } from "@/store/useChatStore";
import ChatBubble from "../chat-bubble";
import Image from "next/image";

export const MesssagesBox = () => {
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId
  );
  const messages = useChatStore((state) => state.messages);
  const users = useChatStore((state) => state.users);
  const currentUserId = useChatStore((state) => state.currentUserId);
  const otherParticipant = useChatStore((state) => state.otherParticipant);

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

  // Show empty state if no conversation selected
  if (!currentConversationId || !otherParticipant) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 text-center">
        <div className="relative flex h-36 w-36 items-center justify-center rounded-4xl bg-linear-to-b from-lavender/50 to-white shadow-[0_25px_55px_rgba(82,63,255,0.18)]">
          <div className="absolute inset-3 rounded-[1.7rem] bg-white/70 blur-xl" />
          <Image
            src={"/images/messages-empty-state.svg"}
            alt="empty conversation illustration"
            width={120}
            height={152}
            className="relative drop-shadow-[0_8px_18px_rgba(95,63,255,0.2)]"
          />
        </div>
        <p className="text-sm leading-5 text-brand-black">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  // Show conversation header and messages
  return (
    <div className="flex h-full flex-col">
      {/* Conversation Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 p-4">
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
          <h3 className="font-semibold text-brand-black">
            {otherParticipant.first_name} {otherParticipant.last_name}
          </h3>
          <p className="text-xs text-brand-grey capitalize">
            {otherParticipant.status || "offline"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4">
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
                />
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
