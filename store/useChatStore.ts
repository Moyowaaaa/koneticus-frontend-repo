"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { user } from "@/types";

// Types based on your provided definitions
export interface ChatUser extends Partial<user> {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_photo?: string;
  status?: "online" | "offline" | "away";
  is_muted?: boolean;
}

export interface ChatAttachment {
  id: string;
  type: "photo" | "video" | "document" | "audio";
  name: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
}

export interface ChatMessage {
  id: string | number;
  conversationId?: string;
  senderId: string | number;
  senderName?: string;
  content?: string;
  text?: string;
  timestamp: Date | string;
  type: "text" | "post" | "attachment" | "proposal" | "system";
  attachments?: ChatAttachment[];
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessageAt?: string;
  lastMessage?: string;
  unreadCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
  isBlocked?: boolean;
  isMessageRequest?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  // Core data
  conversations: Conversation[];
  users: Record<string, ChatUser>;
  messages: Record<string, ChatMessage[]>;
  currentUserId: string;

  // UI state
  currentConversationId: string | null;
  otherParticipant: ChatUser | null;
  isMobileChatBoxOpened: boolean;

  // Search state
  isSearchActive: boolean;
  searchQuery: string;
  searchMatchIndex: number;
  searchMatchCount: number;

  // Actions
  setCurrentConversation: (conversationId: string | null) => void;
  setIsMobileChatBoxOpened: (opened: boolean) => void;
  markAsRead: (conversationId: string) => void;
  createConversation: (participantIds: string[]) => string;
  getCurrentConversation: () => Conversation | null;
  getOtherParticipant: (conversationId?: string) => ChatUser | null;
  addMessage: (
    conversationId: string,
    message: Omit<ChatMessage, "id" | "timestamp">,
  ) => void;

  // Search actions
  setSearchActive: (isActive: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchMatchMeta: (index: number, count: number) => void;
  goToNextSearchMatch: () => void;
  goToPrevSearchMatch: () => void;

  // Conversation management
  archiveConversation: (conversationId: string) => void;
  unarchiveConversation: (conversationId: string) => void;
  blockConversation: (conversationId: string) => void;
  unblockConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  acceptMessageRequest: (conversationId: string) => void;
  rejectMessageRequest: (conversationId: string) => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).slice(2, 11);

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state — empty until messaging API is wired
        conversations: [],
        users: {},
        messages: {},
        currentUserId: "current_user",
        currentConversationId: null,
        otherParticipant: null,
        isMobileChatBoxOpened: false,
        isSearchActive: false,
        searchQuery: "",
        searchMatchIndex: 0,
        searchMatchCount: 0,

        // Actions
        setCurrentConversation: (conversationId) => {
          const state = get();
          const otherParticipant = state.getOtherParticipant(
            conversationId || undefined,
          );

          set({
            currentConversationId: conversationId,
            otherParticipant,
          });

          if (conversationId) {
            state.markAsRead(conversationId);
          }
        },

        setIsMobileChatBoxOpened: (opened) => {
          set({ isMobileChatBoxOpened: opened });
        },

        markAsRead: (conversationId) => {
          const state = get();
          const conversations = state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
          );

          // Also mark messages as read
          const messages = { ...state.messages };
          if (messages[conversationId]) {
            messages[conversationId] = messages[conversationId].map((msg) => ({
              ...msg,
              isRead: true,
            }));
          }

          set({ conversations, messages });
        },

        createConversation: (participantIds) => {
          const state = get();
          const conversationId = `conv_${Date.now()}_${generateId()}`;
          const now = new Date().toISOString();

          const conversation: Conversation = {
            id: conversationId,
            participants: [...participantIds, state.currentUserId],
            unreadCount: 0,
            createdAt: now,
            updatedAt: now,
          };

          set({
            conversations: [...state.conversations, conversation],
            messages: { ...state.messages, [conversationId]: [] },
          });

          return conversationId;
        },

        getCurrentConversation: () => {
          const state = get();
          if (!state.currentConversationId) return null;

          return (
            state.conversations.find(
              (conv) => conv.id === state.currentConversationId,
            ) || null
          );
        },

        getOtherParticipant: (conversationId) => {
          const state = get();
          const conversations = state.conversations;
          const users = state.users;

          const targetConvId = conversationId || state.currentConversationId;
          if (!targetConvId) return null;

          const conversation = conversations.find(
            (conv) => conv.id === targetConvId,
          );
          if (!conversation) return null;

          const participantId = conversation.participants.find(
            (id) => id !== state.currentUserId,
          );

          return participantId ? users[participantId] || null : null;
        },

        addMessage: (conversationId, messageData) => {
          const state = get();
          const messageId = `msg_${Date.now()}_${generateId()}`;
          const timestamp = new Date().toISOString();

          const newMessage: ChatMessage = {
            id: messageId,
            conversationId,
            timestamp,
            ...messageData,
          };

          const updatedMessages = {
            ...state.messages,
            [conversationId]: [
              ...(state.messages[conversationId] || []),
              newMessage,
            ],
          };

          // Update conversation's last message and timestamp
          const updatedConversations = state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: messageData.text || messageData.content || "",
                  lastMessageAt: timestamp,
                  updatedAt: timestamp,
                  unreadCount:
                    messageData.senderId === state.currentUserId
                      ? conv.unreadCount
                      : conv.unreadCount + 1,
                }
              : conv,
          );

          set({
            messages: updatedMessages,
            conversations: updatedConversations,
          });
        },

        // Search actions
        setSearchActive: (isActive) => {
          set({
            isSearchActive: isActive,
            searchQuery: isActive ? get().searchQuery : "",
            searchMatchIndex: 0,
            searchMatchCount: 0,
          });
        },

        setSearchQuery: (query) => {
          set({
            searchQuery: query,
            searchMatchIndex: 0,
            searchMatchCount: 0,
          });
        },

        setSearchMatchMeta: (index, count) => {
          const prevCount = get().searchMatchCount;

          if (count <= 0) {
            set({ searchMatchIndex: 0, searchMatchCount: 0 });
            return;
          }

          if (prevCount === 0) {
            set({
              searchMatchIndex: count - 1,
              searchMatchCount: count,
            });
            return;
          }

          const safeIndex = Math.min(Math.max(index, 0), count - 1);
          set({ searchMatchIndex: safeIndex, searchMatchCount: count });
        },

        goToNextSearchMatch: () => {
          const state = get();
          const { searchMatchCount, searchMatchIndex } = state;
          if (searchMatchCount <= 0) return;
          const next = (searchMatchIndex + 1) % searchMatchCount;
          set({ searchMatchIndex: next });
        },

        goToPrevSearchMatch: () => {
          const state = get();
          const { searchMatchCount, searchMatchIndex } = state;
          if (searchMatchCount <= 0) return;
          const prev =
            (searchMatchIndex - 1 + searchMatchCount) % searchMatchCount;
          set({ searchMatchIndex: prev });
        },

        // Conversation management
        archiveConversation: (conversationId) => {
          const state = get();
          const conversations = state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  isArchived: true,
                  updatedAt: new Date().toISOString(),
                }
              : conv,
          );
          set({ conversations });

          if (state.currentConversationId === conversationId) {
            set({
              currentConversationId: null,
              otherParticipant: null,
            });
          }
        },

        unarchiveConversation: (conversationId) => {
          const state = get();
          const conversations = state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  isArchived: false,
                  updatedAt: new Date().toISOString(),
                }
              : conv,
          );
          set({ conversations });
        },

        blockConversation: (conversationId) => {
          const state = get();
          const conversations = state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  isBlocked: true,
                  updatedAt: new Date().toISOString(),
                }
              : conv,
          );
          set({ conversations });

          if (state.currentConversationId === conversationId) {
            set({
              currentConversationId: null,
              otherParticipant: null,
            });
          }
        },

        unblockConversation: (conversationId) => {
          const state = get();
          const conversations = state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  isBlocked: false,
                  updatedAt: new Date().toISOString(),
                }
              : conv,
          );
          set({ conversations });
        },

        deleteConversation: (conversationId) => {
          const state = get();
          const conversations = state.conversations.filter(
            (conv) => conv.id !== conversationId,
          );

          // Also remove messages
          const messages = { ...state.messages };
          delete messages[conversationId];

          set({ conversations, messages });

          if (state.currentConversationId === conversationId) {
            set({
              currentConversationId: null,
              otherParticipant: null,
            });
          }
        },

        acceptMessageRequest: (conversationId) => {
          const state = get();
          const conversations = state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  isMessageRequest: false,
                  updatedAt: new Date().toISOString(),
                }
              : conv,
          );
          set({ conversations });
        },

        rejectMessageRequest: (conversationId) => {
          const state = get();
          const conversations = state.conversations.filter(
            (conv) => conv.id !== conversationId,
          );

          // Also remove messages
          const messages = { ...state.messages };
          delete messages[conversationId];

          set({ conversations, messages });

          if (state.currentConversationId === conversationId) {
            set({
              currentConversationId: null,
              otherParticipant: null,
            });
          }
        },
      }),
      {
        name: "chat-store-v2",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          conversations: state.conversations,
          users: state.users,
          messages: state.messages,
          currentUserId: state.currentUserId,
        }),
      },
    ),
    { name: "ChatStore" },
  ),
);
