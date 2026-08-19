"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import ChatBubble from "../chat-bubble";
import Image from "next/image";
import UserProfileModal from "../user-profile-modal";
import {
  useGetConversationMessages,
  useGetConversations,
} from "@/api/chat/chat.queries";
import { useMarkConversationAsRead, useVotePoll } from "@/api/chat/chat.mutations";
import type { ChatMessage, Conversation } from "@/api/chat/chat.model";
import ConversationMembersStack, {
  getParticipantId,
  mapParticipantToMemberAvatar,
} from "../conversation-members-stack";
import { ScrollArea } from "@/components/ui/scroll-area";

const getScrollViewport = (root: HTMLElement) =>
  root.querySelector<HTMLElement>("[data-slot='scroll-area-viewport']");

const getConversationTitle = (
  conversation: Conversation | undefined,
  currentUserId?: string | null,
) => {
  if (!conversation) return "Conversation";

  if (conversation.type === "group" || conversation.type === "kollaboration") {
    return conversation.name?.trim() || "Untitled chat";
  }

  const other = conversation.participantIds
    .map(mapParticipantToMemberAvatar)
    .find((participant) => participant.id !== currentUserId);

  return other?.name || "Direct message";
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getDateKey = (iso: string) => {
  const date = new Date(iso);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const formatDateLabel = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(date.getFullYear() !== today.getFullYear()
      ? { year: "numeric" as const }
      : {}),
  });
};

type MessageDayGroup = {
  key: string;
  label: string;
  messages: ChatMessage[];
};

export const MesssagesBox = () => {
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId,
  );
  const currentUserId = useAuthStore((state) => state.user?._id);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { mutate: votePoll, isPending: isVoting } = useVotePoll();
  const { mutate: markAsRead } = useMarkConversationAsRead();

  const { data: conversationsData } = useGetConversations({
    page: 1,
    limit: 30,
  });

  const {
    data: messagesData,
    isLoading,
    isError,
  } = useGetConversationMessages(
    {
      conversationId: currentConversationId ?? "",
      page: 1,
      limit: 50,
    },
    { enabled: Boolean(currentConversationId) },
  );

  const activeConversation = conversationsData?.conversations.find(
    (conversation) => conversation._id === currentConversationId,
  );

  useEffect(() => {
    if (!currentConversationId) return;
    markAsRead(currentConversationId);
  }, [currentConversationId, markAsRead]);

  // API returns newest-first; render oldest → newest in the thread
  const conversationMessages = useMemo(() => {
    const messages = messagesData?.messages ?? [];
    return [...messages].reverse();
  }, [messagesData?.messages]);

  const messageGroups = useMemo(() => {
    const groups: MessageDayGroup[] = [];

    for (const message of conversationMessages) {
      const key = getDateKey(message.createdAt);
      const lastGroup = groups[groups.length - 1];

      if (lastGroup && lastGroup.key === key) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          key,
          label: formatDateLabel(message.createdAt),
          messages: [message],
        });
      }
    }

    return groups;
  }, [conversationMessages]);

  const shouldGroupMessage = (
    messages: ChatMessage[],
    currentIndex: number,
  ) => {
    if (currentIndex === 0) return false;
    return (
      messages[currentIndex].senderId === messages[currentIndex - 1].senderId
    );
  };

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, [conversationMessages.length, currentConversationId]);

  // Re-stick to bottom when attachment images finish loading / layout grows
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const viewport = getScrollViewport(root);
    if (!viewport) return;

    const content = viewport.firstElementChild;
    if (!content) return;

    const observer = new ResizeObserver(() => {
      const distanceFromBottom =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      // Keep pinned when the user is already near the latest message
      if (distanceFromBottom < 160) {
        scrollToBottom("auto");
      }
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [currentConversationId]);

  if (!currentConversationId) {
    return null;
  }

  const title = getConversationTitle(activeConversation, currentUserId);
  const avatar =
    activeConversation?.avatar?.url ||
    (activeConversation?.type === "dm"
      ? activeConversation.participantIds
          .map(mapParticipantToMemberAvatar)
          .find((participant) => participant.id !== currentUserId)?.avatar
      : undefined);
  const members = (activeConversation?.participantIds ?? [])
    .filter((participant) => getParticipantId(participant) !== currentUserId)
    .map(mapParticipantToMemberAvatar);

  // For DMs keep the other person; for groups/kollabs show everyone (or all incl. me)
  const stackMembers =
    activeConversation?.type === "dm"
      ? members
      : (activeConversation?.participantIds ?? []).map(
          mapParticipantToMemberAvatar,
        );

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 p-4 dark:border-[#80808026]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src={avatar || "/images/dummy-avatar.svg"}
              alt={title}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-brand-black dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-brand-grey capitalize">
              {activeConversation?.type ?? "chat"}
              {stackMembers.length > 0
                ? ` · ${stackMembers.length} member${stackMembers.length === 1 ? "" : "s"}`
                : ""}
            </p>
          </div>
        </div>

        <ConversationMembersStack members={stackMembers} maxVisible={4} />
      </div>

      <div ref={scrollRef} className="min-h-0 min-w-0 flex-1">
        <ScrollArea className="h-full px-4">
          <div className="flex min-h-full min-w-0 flex-col justify-end gap-3 pt-4 pb-28">
            {isLoading ? (
              <p className="py-12 text-center text-sm text-brand-grey">
                Loading messages...
              </p>
            ) : isError ? (
              <p className="py-12 text-center text-sm text-brand-grey">
                Couldn&apos;t load messages. Try again.
              </p>
            ) : conversationMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-brand-grey">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messageGroups.map((group) => (
                <div key={group.key} className="flex flex-col gap-3">
                  <div className="sticky top-2 z-10 flex justify-center">
                    <span className="rounded-full bg-lavender px-3 py-1 text-[0.6875rem] font-medium text-brand-black shadow-sm dark:bg-[#80808026] dark:text-white">
                      {group.label}
                    </span>
                  </div>

                  {group.messages.map((message, index) => {
                    const isCurrentUser = message.senderId === currentUserId;
                    const isGrouped = shouldGroupMessage(group.messages, index);
                    const hasAttachments = Boolean(message.attachments?.length);
                    const text =
                      message.content ||
                      message.poll?.question ||
                      "";
                    const isPoll =
                      message.type === "poll" && Boolean(message.poll);

                    return (
                      <ChatBubble
                        key={message._id}
                        message={text}
                        isCurrentUser={isCurrentUser}
                        timestamp={message.createdAt}
                        showAvatar={!isCurrentUser}
                        isGrouped={isGrouped}
                        messageType={
                          isPoll
                            ? "poll"
                            : hasAttachments
                              ? "attachment"
                              : "text"
                        }
                        currentUserId={currentUserId}
                        poll={message.poll}
                        attachments={message.attachments}
                        pollVoteDisabled={isVoting}
                        onPollVote={(optionId) => {
                          if (!message.poll || !currentUserId) return;

                          let nextOptionIds: string[];

                          if (message.poll.allowMultiple) {
                            const alreadySelected =
                              message.poll.options
                                .find((option) => option.id === optionId)
                                ?.voterIds?.includes(currentUserId) ?? false;

                            const currentIds = message.poll.options
                              .filter((option) =>
                                option.voterIds?.includes(currentUserId),
                              )
                              .map((option) => option.id);

                            nextOptionIds = alreadySelected
                              ? currentIds.filter((id) => id !== optionId)
                              : [...currentIds, optionId];

                            if (nextOptionIds.length === 0) return;
                          } else {
                            nextOptionIds = [optionId];
                          }

                          votePoll({
                            messageId: message._id,
                            payload: { optionIds: nextOptionIds },
                          });
                        }}
                      />
                    );
                  })}
                </div>
              ))
            )}
            <div ref={bottomRef} className="h-px w-full shrink-0" aria-hidden />
          </div>
        </ScrollArea>
      </div>

      <UserProfileModal />
    </div>
  );
};
