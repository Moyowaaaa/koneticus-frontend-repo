"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  connectChatSocket,
  disconnectChatSocket,
  getChatSocket,
} from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { chatKeys } from "@/api/chat/chat.queries";
import { useMarkConversationAsRead } from "@/api/chat/chat.mutations";
import type {
  ChatMessage,
  ConversationMessagesResponse,
} from "@/api/chat/chat.model";

type ChatMessageEvent = {
  conversationId: string;
  message: ChatMessage;
};

const upsertIncomingMessage = (
  old: ConversationMessagesResponse | undefined,
  message: ChatMessage,
): ConversationMessagesResponse | undefined => {
  if (!old) return old;
  if (old.messages.some((existing) => existing._id === message._id)) {
    return old;
  }

  return {
    ...old,
    messages: [message, ...old.messages],
    pagination: {
      ...old.pagination,
      totalMessages: old.pagination.totalMessages + 1,
    },
  };
};

const subscribeAuthHydration = (onStoreChange: () => void) =>
  useAuthStore.persist.onFinishHydration(onStoreChange);

export const useJoinConversation = (conversationId?: string | null) => {
  useEffect(() => {
    if (!conversationId) return;

    const socket = getChatSocket() ?? connectChatSocket();
    const join = () => {
      socket.emit("conversation:join", { conversationId });
    };

    if (socket.connected) join();
    socket.on("connect", join);

    return () => {
      socket.off("connect", join);
      socket.emit("conversation:leave", { conversationId });
    };
  }, [conversationId]);
};

const ChatSocketProvider = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId,
  );
  const { mutate: markAsRead } = useMarkConversationAsRead();
  const hasHydrated = useSyncExternalStore(
    subscribeAuthHydration,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated && !token) {
      disconnectChatSocket();
      return;
    }

    const socket = connectChatSocket();

    const onMessage = ({ conversationId, message }: ChatMessageEvent) => {
      if (!conversationId || !message?._id) return;

      queryClient.setQueriesData<ConversationMessagesResponse>(
        { queryKey: [...chatKeys.all, "messages", conversationId] },
        (old) => upsertIncomingMessage(old, message),
      );

      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "conversations"],
      });
      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "recent-messages"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      const openConversationId =
        useChatStore.getState().currentConversationId;
      if (openConversationId === conversationId) {
        markAsRead(conversationId);
      }
    };

    socket.on("chat:message", onMessage);

    return () => {
      socket.off("chat:message", onMessage);
    };
  }, [hasHydrated, isAuthenticated, token, queryClient, markAsRead]);

  useJoinConversation(currentConversationId);

  return null;
};

export default ChatSocketProvider;
