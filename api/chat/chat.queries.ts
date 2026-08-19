import { useQuery } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import {
  ConversationMessagesResponse,
  ConversationsListResponse,
  GetConversationMessagesParams,
  GetConversationsParams,
  RecentMessagesResponse,
} from "./chat.model";

export const chatKeys = {
  all: ["chat"] as const,
  conversations: (params: GetConversationsParams = {}) =>
    [
      ...chatKeys.all,
      "conversations",
      params.type ?? "all",
      params.page ?? 1,
      params.limit ?? 15,
    ] as const,
  messages: (params: GetConversationMessagesParams) =>
    [
      ...chatKeys.all,
      "messages",
      params.conversationId,
      params.page ?? 1,
      params.limit ?? 30,
    ] as const,
  recentMessages: (limit = 5) =>
    [...chatKeys.all, "recent-messages", limit] as const,
};

const getConversations = async (
  params: GetConversationsParams = {},
): Promise<ConversationsListResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 15));
  if (params.type) {
    searchParams.set("type", params.type);
  }

  const response = await apiHttp.get<ConversationsListResponse>(
    `/chat/conversations?${searchParams.toString()}`,
  );
  return response.data;
};

const getConversationMessages = async (
  params: GetConversationMessagesParams,
): Promise<ConversationMessagesResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 30));

  const response = await apiHttp.get<ConversationMessagesResponse>(
    `/chat/conversations/${params.conversationId}/messages?${searchParams.toString()}`,
  );
  return response.data;
};

const getRecentMessages = async (
  limit = 5,
): Promise<RecentMessagesResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(limit));

  const response = await apiHttp.get<RecentMessagesResponse>(
    `/chat/messages/recent?${searchParams.toString()}`,
  );
  return response.data;
};

export const useGetConversations = (
  params: GetConversationsParams = {},
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: chatKeys.conversations(params),
    queryFn: () => getConversations(params),
    enabled: options?.enabled ?? true,
  });

export const useGetConversationMessages = (
  params: GetConversationMessagesParams,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: chatKeys.messages(params),
    queryFn: () => getConversationMessages(params),
    enabled: (options?.enabled ?? true) && Boolean(params.conversationId),
  });

export const useGetRecentMessages = (
  limit = 5,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: chatKeys.recentMessages(limit),
    queryFn: () => getRecentMessages(limit),
    enabled: options?.enabled ?? true,
  });
