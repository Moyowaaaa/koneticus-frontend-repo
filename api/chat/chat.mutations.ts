import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import {
  ChatMessage,
  ConversationMessagesResponse,
  ConversationsListResponse,
  CreateDmPayload,
  CreateDmResponse,
  CreateGroupPayload,
  CreateGroupResponse,
  CreateKollaborationPayload,
  CreateKollaborationResponse,
  MarkConversationAsReadResponse,
  SendMessagePayload,
  SendMessageResponse,
  VotePollPayload,
  VotePollResponse,
} from "./chat.model";
import { chatKeys } from "./chat.queries";
import { useAuthStore } from "@/store/useAuthStore";
import { projectsKeys } from "../projects/projects.queries";
import { useChatStore } from "@/store/useChatStore";

const sendMessage = async ({
  conversationId,
  payload,
}: {
  conversationId: string;
  payload: SendMessagePayload;
}): Promise<SendMessageResponse> => {
  if (payload.files && payload.files.length > 0) {
    const formData = new FormData();
    formData.append("type", payload.type ?? "attachment");
    if (payload.content?.trim()) {
      formData.append("content", payload.content.trim());
    }
    payload.files.slice(0, 4).forEach((file) => {
      formData.append("attachments", file);
    });

    const response = await apiHttp.post<SendMessageResponse>(
      `/chat/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      },
    );
    return response.data;
  }

  const { files: _files, ...jsonPayload } = payload;
  const response = await apiHttp.post<SendMessageResponse>(
    `/chat/conversations/${conversationId}/messages`,
    jsonPayload,
  );
  return response.data;
};

type SendMessageContext = {
  previousByKey: Array<[readonly unknown[], ConversationMessagesResponse | undefined]>;
  tempId: string;
  optimisticBlobUrls: string[];
};

const createKollaboration = async (
  payload: CreateKollaborationPayload,
): Promise<CreateKollaborationResponse> => {
  const response = await apiHttp.post<CreateKollaborationResponse>(
    "/chat/kollaborations",
    payload,
  );
  return response.data;
};

const createDm = async (
  payload: CreateDmPayload,
): Promise<CreateDmResponse> => {
  const response = await apiHttp.post<CreateDmResponse>("/chat/dms", payload);
  return response.data;
};

const createGroup = async (
  payload: CreateGroupPayload,
): Promise<CreateGroupResponse> => {
  if (payload.avatarFile) {
    const formData = new FormData();
    formData.append("name", payload.name.trim());
    formData.append("memberIds", JSON.stringify(payload.memberIds));
    formData.append("avatar", payload.avatarFile);

    const response = await apiHttp.post<CreateGroupResponse>(
      "/chat/group-conversations",
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      },
    );
    return response.data;
  }

  const response = await apiHttp.post<CreateGroupResponse>(
    "/chat/group-conversations",
    {
      name: payload.name.trim(),
      memberIds: payload.memberIds,
    },
  );
  return response.data;
};

export const useCreateKollaboration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKollaboration,
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: projectsKeys.singleProject(variables.projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "conversations"],
      });

      if (data.conversation?._id) {
        void queryClient.invalidateQueries({
          queryKey: [...chatKeys.all, "messages", data.conversation._id],
        });
      }
    },
  });
};

export const useCreateDM = () => {
  const queryClient = useQueryClient();
  const setCurrentConversation = useChatStore(
    (state) => state.setCurrentConversation,
  );

  return useMutation({
    mutationFn: createDm,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "conversations"],
      });

      if (data.conversation?._id) {
        setCurrentConversation(data.conversation._id);
        void queryClient.invalidateQueries({
          queryKey: [...chatKeys.all, "messages", data.conversation._id],
        });
      }
    },
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const setCurrentConversation = useChatStore(
    (state) => state.setCurrentConversation,
  );

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "conversations"],
      });

      if (data.conversation?._id) {
        setCurrentConversation(data.conversation._id);
        void queryClient.invalidateQueries({
          queryKey: [...chatKeys.all, "messages", data.conversation._id],
        });
      }
    },
  });
};

const markConversationAsRead = async (
  conversationId: string,
): Promise<MarkConversationAsReadResponse> => {
  const response = await apiHttp.patch<MarkConversationAsReadResponse>(
    `/chat/conversations/${conversationId}/read`,
  );
  return response.data;
};

export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markConversationAsRead,
    onMutate: async (conversationId) => {
      const currentUserId = useAuthStore.getState().user?._id;
      if (!currentUserId) return;

      await queryClient.cancelQueries({
        queryKey: [...chatKeys.all, "conversations"],
      });

      const previousByKey = queryClient.getQueriesData<ConversationsListResponse>(
        {
          queryKey: [...chatKeys.all, "conversations"],
        },
      );

      const now = new Date().toISOString();

      queryClient.setQueriesData<ConversationsListResponse>(
        { queryKey: [...chatKeys.all, "conversations"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            conversations: old.conversations.map((conversation) => {
              if (conversation._id !== conversationId) return conversation;

              return {
                ...conversation,
                members: conversation.members.map((member) =>
                  member.userId === currentUserId
                    ? { ...member, unreadCount: 0, lastReadAt: now }
                    : member,
                ),
              };
            }),
          };
        },
      );

      return { previousByKey };
    },
    onError: (_error, _conversationId, context) => {
      if (!context?.previousByKey) return;

      for (const [key, data] of context.previousByKey) {
        queryClient.setQueryData(key, data);
      }
    },
    onSuccess: (_data, conversationId) => {
      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "conversations"],
      });
      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "messages", conversationId],
      });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onMutate: async ({ conversationId, payload }) => {
      const currentUserId = useAuthStore.getState().user?._id;
      if (!currentUserId) return;

      await queryClient.cancelQueries({
        queryKey: [...chatKeys.all, "messages", conversationId],
      });

      const previousByKey = queryClient.getQueriesData<ConversationMessagesResponse>({
        queryKey: [...chatKeys.all, "messages", conversationId],
      });

      const now = new Date().toISOString();
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const optimisticAttachments =
        payload.files?.map((file, index) => ({
          url: URL.createObjectURL(file),
          id: `temp_file_${index}`,
          name: file.name,
          mimeType: file.type || "image/jpeg",
          size: file.size,
          kind: "photo" as const,
        })) ??
        payload.attachments ??
        [];

      const optimisticBlobUrls = optimisticAttachments
        .map((attachment) => attachment.url)
        .filter((url) => url.startsWith("blob:"));

      const optimisticPoll =
        payload.type === "poll" && payload.poll
          ? {
              question: payload.poll.question,
              options: payload.poll.options.map((text, index) => ({
                id: `temp_option_${index}`,
                text,
                voterIds: [] as string[],
              })),
              allowMultiple: payload.poll.allowMultiple ?? false,
              isAnonymous: payload.poll.isAnonymous ?? false,
              isClosed: false,
              closesAt: payload.poll.closesAt ?? null,
            }
          : undefined;

      const optimisticMessage: ChatMessage = {
        _id: tempId,
        conversationId,
        senderId: currentUserId,
        type:
          payload.type ??
          (optimisticAttachments.length > 0 ? "attachment" : "text"),
        content: payload.content,
        attachments: optimisticAttachments,
        poll: optimisticPoll,
        readBy: [{ userId: currentUserId, readAt: now }],
        reactions: [],
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      queryClient.setQueriesData<ConversationMessagesResponse>(
        { queryKey: [...chatKeys.all, "messages", conversationId] },
        (old) => {
          if (!old) {
            return {
              messages: [optimisticMessage],
              pagination: {
                totalMessages: 1,
                totalPages: 1,
                currentPage: 1,
                itemsPerPage: 50,
              },
            };
          }

          return {
            ...old,
            // API list is newest-first
            messages: [optimisticMessage, ...old.messages],
            pagination: {
              ...old.pagination,
              totalMessages: old.pagination.totalMessages + 1,
            },
          };
        },
      );

      return {
        previousByKey,
        tempId,
        optimisticBlobUrls,
      } satisfies SendMessageContext;
    },
    onError: (_error, variables, context) => {
      context?.optimisticBlobUrls?.forEach((url) => URL.revokeObjectURL(url));

      if (!context?.previousByKey) return;

      for (const [key, data] of context.previousByKey) {
        queryClient.setQueryData(key, data);
      }

      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "messages", variables.conversationId],
      });
    },
    onSuccess: (response, variables, context) => {
      context?.optimisticBlobUrls?.forEach((url) => URL.revokeObjectURL(url));

      queryClient.setQueriesData<ConversationMessagesResponse>(
        { queryKey: [...chatKeys.all, "messages", variables.conversationId] },
        (old) => {
          if (!old) {
            return {
              messages: [response.data],
              pagination: {
                totalMessages: 1,
                totalPages: 1,
                currentPage: 1,
                itemsPerPage: 50,
              },
            };
          }

          const withoutTemp = old.messages.filter(
            (message) => message._id !== context?.tempId,
          );

          // Avoid duplicates if refetch already brought the real message in
          const withoutDuplicate = withoutTemp.filter(
            (message) => message._id !== response.data._id,
          );

          return {
            ...old,
            messages: [response.data, ...withoutDuplicate],
          };
        },
      );

      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "conversations"],
      });
      void queryClient.invalidateQueries({
        queryKey: [...chatKeys.all, "recent-messages"],
      });
    },
  });
};

const votePoll = async ({
  messageId,
  payload,
}: {
  messageId: string;
  payload: VotePollPayload;
}): Promise<VotePollResponse> => {
  const response = await apiHttp.post<VotePollResponse>(
    `/chat/messages/${messageId}/poll/vote`,
    payload,
  );
  return response.data;
};

export const useVotePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: votePoll,
    onSuccess: (response) => {
      const conversationId = response.data.conversationId;

      queryClient.setQueriesData<ConversationMessagesResponse>(
        { queryKey: [...chatKeys.all, "messages", conversationId] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            messages: old.messages.map((message) =>
              message._id === response.data._id ? response.data : message,
            ),
          };
        },
      );
    },
  });
};
