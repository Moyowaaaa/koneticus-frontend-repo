"use client";

import ConversationItem from "./conversation-item";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetConversations } from "@/api/chat/chat.queries";
import type { Conversation } from "@/api/chat/chat.model";
import { mapParticipantToMemberAvatar } from "../conversation-members-stack";

const getConversationTitle = (
  conversation: Conversation,
  currentUserId?: string | null,
) => {
  if (conversation.type === "group" || conversation.type === "kollaboration") {
    return conversation.name?.trim() || "Untitled chat";
  }

  const other = conversation.participantIds
    .map(mapParticipantToMemberAvatar)
    .find((participant) => participant.id !== currentUserId);

  return other?.name || "Direct message";
};

const getConversationAvatar = (
  conversation: Conversation,
  currentUserId?: string | null,
) => {
  if (conversation.avatar?.url) return conversation.avatar.url;

  if (conversation.type === "dm") {
    return conversation.participantIds
      .map(mapParticipantToMemberAvatar)
      .find((participant) => participant.id !== currentUserId)?.avatar;
  }

  return undefined;
};

const getUnreadCount = (
  conversation: Conversation,
  currentUserId?: string | null,
) => {
  if (!currentUserId) return 0;
  return (
    conversation.members.find((member) => member.userId === currentUserId)
      ?.unreadCount ?? 0
  );
};

const ConversationSkeleton = () => (
  <div
    className={`w-full flex items-start justify-between gap-3 rounded-[0.9375rem] p-4 text-left transition-all bg-lavender dark:bg-[#80808026] `}
  >
    <div className="flex items-start gap-3">
      <div className="relative h-10 w-10 min-h-10 min-w-10 rounded-full bg-white dark:bg-[#808080]"></div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col  gap-2 mt-3 ">
          <div className="w-[7.125rem] bg-white h-[0.875rem] dark:bg-[#808080]"></div>
          <div className="w-[7.125rem] bg-white h-[0.875rem] dark:bg-[#808080]"></div>
        </div>
      </div>
    </div>

    <div className="w-[3.25rem] bg-white h-[0.875rem] mt-2 dark:bg-[#808080]"></div>
  </div>
);

const MessagesSidebar = ({
  onNewMessage,
}: {
  onNewMessage?: () => void;
}) => {
  const currentUserId = useAuthStore((state) => state.user?._id);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId,
  );
  const setCurrentConversation = useChatStore(
    (state) => state.setCurrentConversation,
  );

  const { data, isLoading, isError } = useGetConversations({
    page: 1,
    limit: 30,
  });

  const conversations = data?.conversations ?? [];

  return (
    <div
      className="relative w-[30rem] border-r border-[#e9e9e9e9] 
    dark:border-[#80808026]
    pt-6 md:h-[calc(100dvh-200px)] pr-4"
    >
      {isLoading ? (
        <div className="flex h-full w-full flex-col gap-2 pr-4">
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
        </div>
      ) : isError ? (
        <p className="px-4 text-sm text-brand-grey">
          Couldn&apos;t load conversations. Try again.
        </p>
      ) : conversations.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm text-brand-grey">
            No conversations yet. Find someone to message.
          </p>
          {onNewMessage ? (
            <button
              type="button"
              onClick={onNewMessage}
              className="rounded-full bg-lavender px-4 py-2 text-sm font-medium text-brand-black transition hover:opacity-90 dark:bg-[#80808026] dark:text-white"
            >
              New conversation
            </button>
          ) : null}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col gap-2 pr-4">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              name={getConversationTitle(conversation, currentUserId)}
              avatar={getConversationAvatar(conversation, currentUserId)}
              lastMessage={conversation.lastMessage?.text}
              lastMessageAt={
                conversation.lastMessage?.createdAt ?? conversation.updatedAt
              }
              unreadCount={getUnreadCount(conversation, currentUserId)}
              isActive={currentConversationId === conversation._id}
              onClick={() => setCurrentConversation(conversation._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesSidebar;
