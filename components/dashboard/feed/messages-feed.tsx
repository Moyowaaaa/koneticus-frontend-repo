"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetRecentMessages } from "@/api/chat/chat.queries";
import type {
  ConversationParticipant,
  RecentMessage,
} from "@/api/chat/chat.model";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MessagesEmptyState = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="relative h-[6.4375rem] w-[6.4375rem]">
        <Image src={"/images/messages-feed-empty.svg"} alt="" fill />
      </div>
      <p className="text-base">No message yet</p>
    </div>
  );
};

const getSenderName = (message: RecentMessage) => {
  const profile = message.sender?.userProfile;
  if (profile?.firstname || profile?.lastname) {
    return `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim();
  }
  return message.sender?.email || "Someone";
};

const getSenderAvatar = (message: RecentMessage) =>
  message.sender?.userProfile?.profilePicture?.url ||
  "/images/dummy-avatar.svg";

const getPreviewText = (message: RecentMessage) => {
  if (message.type === "attachment") return "Sent an attachment";
  if (message.type === "poll") return "Started a poll";
  return message.content?.trim() || "Sent a message";
};

const getConversationLabel = (
  message: RecentMessage,
  currentUserId?: string | null,
) => {
  const conversation = message.conversation;
  if (!conversation) return getSenderName(message);

  if (conversation.type === "group" || conversation.type === "kollaboration") {
    return conversation.name?.trim() || "Group chat";
  }

  const other = (conversation.participantIds ?? []).find((participant) => {
    const id =
      typeof participant === "string" ? participant : participant._id;
    return id !== currentUserId;
  }) as string | ConversationParticipant | undefined;

  if (!other || typeof other === "string") {
    return getSenderName(message);
  }

  const profile = other.userProfile;
  if (profile?.firstname || profile?.lastname) {
    return `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim();
  }

  return other.email || getSenderName(message);
};

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

const MessagesFeed = () => {
  const router = useRouter();
  const currentUserId = useAuthStore((state) => state.user?._id);
  const setCurrentConversation = useChatStore(
    (state) => state.setCurrentConversation,
  );
  const { data, isLoading, isError } = useGetRecentMessages(5);
  const messageItems = data?.messages ?? [];

  const openConversation = (conversationId: string) => {
    setCurrentConversation(conversationId);
    router.push("/dashboard/messages");
  };

  return (
    <div
      className="relative flex h-[20rem] w-full flex-col rounded-[1.875rem] border border-[#E9E9E9E9] p-4
      dark:border-[#80808026] dark:bg-[#80808026]"
    >
      <div className="flex w-full items-center justify-between border-b border-[#E9E9E9] pb-2 dark:border-[#80808026]">
        <h1 className="text-[1.25rem] text-black dark:text-[#FFFFFF]">
          Messages
        </h1>
        <Link
          href="/dashboard/messages"
          className="text-[0.875rem] font-semibold text-primary"
        >
          See all
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3 py-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-[0.9375rem] bg-[#E9E9E9] dark:bg-[#151515]"
            />
          ))}
        </div>
      ) : isError || messageItems.length === 0 ? (
        <MessagesEmptyState />
      ) : (
        <ScrollArea className="mt-2 min-h-0 flex-1">
          <div className="flex flex-col gap-1">
            {messageItems.map((message) => {
              const title = getConversationLabel(message, currentUserId);
              const preview = getPreviewText(message);
              const avatar = getSenderAvatar(message);

              return (
                <button
                  key={message._id}
                  type="button"
                  onClick={() => openConversation(message.conversationId)}
                  className="flex w-full items-center justify-between gap-3 rounded-[0.9375rem] p-3 text-left transition-colors hover:bg-lavender dark:hover:bg-[#151515]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={avatar}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-black dark:text-white">
                        {title}
                      </p>
                      <p className="truncate text-xs text-brand-grey">
                        {preview}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[0.6875rem] text-brand-grey">
                    {formatTimestamp(message.createdAt)}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MessagesFeed;
