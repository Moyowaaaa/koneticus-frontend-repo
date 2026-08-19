"use client";

import React, { useEffect, useMemo, useRef } from "react";
import ChatBubble from "@/components/messages/chat-bubble";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetConversationMessages } from "@/api/chat/chat.queries";
import { useMarkConversationAsRead, useVotePoll } from "@/api/chat/chat.mutations";
import type { ChatMessage } from "@/api/chat/chat.model";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useJoinConversation } from "@/components/layer/ChatSocketProvider";

const getScrollViewport = (root: HTMLElement) =>
  root.querySelector<HTMLElement>("[data-slot='scroll-area-viewport']");

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

type ChatMessagesProps = {
  conversationId?: string | null;
  emptyLabel?: string;
};

const ChatMessages = ({
  conversationId,
  emptyLabel = "No messages yet. Start the conversation!",
}: ChatMessagesProps) => {
  const currentUserId = useAuthStore((state) => state.user?._id);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { mutate: votePoll, isPending: isVoting } = useVotePoll();
  const { mutate: markAsRead } = useMarkConversationAsRead();
  useJoinConversation(conversationId);

  const {
    data: messagesData,
    isLoading,
    isError,
  } = useGetConversationMessages(
    {
      conversationId: conversationId ?? "",
      page: 1,
      limit: 50,
    },
    { enabled: Boolean(conversationId) },
  );

  useEffect(() => {
    if (!conversationId) return;
    markAsRead(conversationId);
  }, [conversationId, markAsRead]);

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

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages.length, conversationId]);

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
      if (distanceFromBottom < 160) {
        scrollToBottom();
      }
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [conversationId]);

  if (!conversationId) {
    return (
      <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 py-8 text-center">
        <p className="font-sora text-sm text-brand-grey">
          Team chat isn&apos;t started yet.
        </p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full min-h-0 min-w-0">
      <ScrollArea className="h-full pr-2">
        <div className="flex min-h-full min-w-0 flex-col justify-end gap-3 pt-4 pb-28">
          {isLoading ? (
          <p className="py-8 text-center text-sm text-brand-grey">
            Loading messages...
          </p>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-brand-grey">
            Couldn&apos;t load team chat. Try again.
          </p>
        ) : conversationMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-brand-grey">{emptyLabel}</p>
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
  );
};

export default ChatMessages;
