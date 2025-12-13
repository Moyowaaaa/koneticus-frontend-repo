"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { useDummyStore } from "./useDummyStore";
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
    message: Omit<ChatMessage, "id" | "timestamp">
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

// Dummy users data
const dummyUsers: ChatUser[] = [
  {
    id: "1",
    first_name: "Andrea",
    last_name: "Smith",
    username: "andrea_smith",
    profile_photo: "/images/dummy-avatar.svg",
    status: "online",
    links: {
      behance: "behance.com/andrea",
      github: "github.com/andrea",
      website: "andrea.com",
    },
    bio: "Andrea is a passionate designer with a keen eye for detail. She enjoys creating visually stunning and user-friendly interfaces that enhance the user experience.",
  },
  {
    id: "2",
    first_name: "John",
    last_name: "Doe",
    username: "john_doe",
    profile_photo: "/images/dummy-avatar.svg",
    status: "online",
    links: {
      behance: "behance.com/john",
      github: "github.com/john",
      website: "john.com",
    },
    bio: "John is a skilled developer with a strong passion for creating innovative and user-friendly applications. He enjoys building scalable and efficient systems that deliver exceptional results.",
  },
  {
    id: "3",
    first_name: "Sarah",
    last_name: "Johnson",
    username: "sarah_johnson",
    profile_photo: "/images/dummy-avatar.svg",
    status: "offline",
    links: {
      behance: "behance.com/sarah",
      github: "github.com/sarah",
      website: "sarah.com",
    },
    bio: "Sarah is a talented marketer with a proven track record of driving successful campaigns. She enjoys creating engaging and effective marketing strategies that help businesses achieve their goals.",
  },
  {
    id: "4",
    first_name: "Mike",
    last_name: "Wilson",
    username: "mike_wilson",
    profile_photo: "/images/dummy-avatar.svg",
    status: "away",
    links: {
      behance: "behance.com/mike",
      github: "github.com/mike",
      website: "mike.com",
    },
    bio: "Mike is a creative director with a proven track record of leading successful projects. He enjoys working with talented teams to deliver innovative and impactful results.",
  },
  {
    id: "5",
    first_name: "Emma",
    last_name: "Davis",
    username: "emma_davis",
    profile_photo: "/images/dummy-avatar.svg",
    status: "online",
    links: {
      behance: "behance.com/emma",
      github: "github.com/emma",
      website: "emma.com",
    },
    bio: "Emma is a marketing analyst with a proven track record of analyzing market trends and identifying opportunities. She enjoys creating data-driven marketing strategies that help businesses succeed.",
  },
  {
    id: "current_user",
    first_name: "You",
    last_name: "User",
    username: "current_user",
    profile_photo: "/images/dummy-avatar.svg",
    status: "online",
    links: {
      behance: "behance.com/you",
      github: "github.com/you",
      website: "you.com",
    },
    bio: "I am a dummy user",
  },
];

// Helper to create date strings for today at specific times
const getTodayAtTime = (hour: number, minute: number) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

// Helper for yesterday
const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
};

// Dummy conversations
const createDummyConversations = (): Conversation[] => {
  return [
    {
      id: "conv_1",
      participants: ["current_user", "1"],
      lastMessageAt: getTodayAtTime(14, 0),
      lastMessage: "Here is my mess....",
      unreadCount: 1,
      isPinned: true,
      createdAt: "2024-01-08T10:00:00Z",
      updatedAt: getTodayAtTime(14, 0),
    },
    {
      id: "conv_2",
      participants: ["current_user", "2"],
      lastMessageAt: getTodayAtTime(5, 38),
      lastMessage: "Sounds good! I'll text you! 👍",
      unreadCount: 0,
      createdAt: "2024-01-12T10:00:00Z",
      updatedAt: getTodayAtTime(5, 38),
    },
    {
      id: "conv_3",
      participants: ["current_user", "3"],
      lastMessageAt: getYesterday(),
      lastMessage: "Perfect! Looking forward to it! 😊",
      unreadCount: 2,
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: getYesterday(),
    },
    {
      id: "conv_4",
      participants: ["current_user", "4"],
      lastMessageAt: "2024-12-10T10:00:00Z",
      lastMessage: "Thank you so much! I'm really excited to start! 🚀",
      unreadCount: 0,
      createdAt: "2024-01-05T10:00:00Z",
      updatedAt: "2024-12-10T10:00:00Z",
    },
    {
      id: "conv_5",
      participants: ["current_user", "5"],
      lastMessageAt: getTodayAtTime(10, 30),
      lastMessage:
        "Hi! I hope this message finds you well. I'd love to connect with you! 👋",
      unreadCount: 1,
      isMessageRequest: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: getTodayAtTime(10, 30),
    },
  ];
};

// Dummy messages
const createDummyMessages = (): Record<string, ChatMessage[]> => {
  return {
    conv_1: [
      {
        id: "msg_1",
        conversationId: "conv_1",
        senderId: "1",
        content: "<p>Hello, how are you?</p>",
        text: "Hello, how are you?",
        timestamp: getTodayAtTime(13, 30),
        type: "text",
        isRead: true,
      },
      {
        id: "msg_2",
        conversationId: "conv_1",
        senderId: "current_user",
        content:
          "<p>Hey Andrea! I'm doing great, thanks for asking! 😊 How about you?</p>",
        text: "Hey Andrea! I'm doing great, thanks for asking! 😊 How about you?",
        timestamp: getTodayAtTime(13, 32),
        type: "text",
        isRead: true,
      },
      {
        id: "msg_3",
        conversationId: "conv_1",
        senderId: "1",
        content: "<p>Here is my mess....</p>",
        text: "Here is my mess....",
        timestamp: getTodayAtTime(14, 0),
        type: "text",
        isRead: false,
      },
      {
        id: "msg_4",
        conversationId: "conv_1",
        senderId: "1",
        content:
          "Dear Jordan,\n\nI am excited to apply for the position at your company. With my skills and experience, I am confident I can contribute effectively to your team. I look forward to discussing how I can add value to your organization.\n\nThank you for considering my application.\n\nBest regards,\n\n[Your Name]",
        text: "Dear Jordan, I am excited to apply for the position at your company...",
        timestamp: getTodayAtTime(14, 15),
        type: "proposal",
        isRead: false,
      },
    ],
    conv_2: [
      {
        id: "msg_4",
        conversationId: "conv_2",
        senderId: "2",
        content: "<p>Yo! Been a while man i hope you're doing well!</p>",
        text: "Yo! Been a while man i hope you're doing well!",
        timestamp: getTodayAtTime(5, 20),
        type: "text",
        isRead: true,
      },
      {
        id: "msg_5",
        conversationId: "conv_2",
        senderId: "current_user",
        content:
          "<p>Hey! Yeah it's been a while! I'm doing great, thanks! 👋</p>",
        text: "Hey! Yeah it's been a while! I'm doing great, thanks! 👋",
        timestamp: getTodayAtTime(5, 22),
        type: "text",
        isRead: true,
      },
      {
        id: "msg_6",
        conversationId: "conv_2",
        senderId: "current_user",
        content: "<p>Sounds good! I'll text you! 👍</p>",
        text: "Sounds good! I'll text you! 👍",
        timestamp: getTodayAtTime(5, 38),
        type: "text",
        isRead: true,
      },
    ],
    conv_3: [
      {
        id: "msg_7",
        conversationId: "conv_3",
        senderId: "3",
        content: "<p>Hey! How have you been?</p>",
        text: "Hey! How have you been?",
        timestamp: getYesterday(),
        type: "text",
        isRead: true,
      },
      {
        id: "msg_8",
        conversationId: "conv_3",
        senderId: "current_user",
        content: "<p>Perfect! Looking forward to it! 😊</p>",
        text: "Perfect! Looking forward to it! 😊",
        timestamp: getYesterday(),
        type: "text",
        isRead: true,
      },
    ],
    conv_5: [
      {
        id: "msg_9",
        conversationId: "conv_5",
        senderId: "5",
        content:
          "<p>Hi! I hope this message finds you well. I'd love to connect with you! 👋</p>",
        text: "Hi! I hope this message finds you well. I'd love to connect with you! 👋",
        timestamp: getTodayAtTime(10, 30),
        type: "text",
        isRead: false,
      },
    ],
  };
};

// Helper to convert users array to record
const getUsersRecord = (users: ChatUser[]): Record<string, ChatUser> => {
  return users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<string, ChatUser>);
};

// Generate unique ID
const generateId = () => Math.random().toString(36).slice(2, 11);

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        conversations: createDummyConversations(),
        users: getUsersRecord(dummyUsers),
        messages: createDummyMessages(),
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
            conversationId || undefined
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
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
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
              (conv) => conv.id === state.currentConversationId
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
            (conv) => conv.id === targetConvId
          );
          if (!conversation) return null;

          const participantId = conversation.participants.find(
            (id) => id !== state.currentUserId
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
              : conv
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
              : conv
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
              : conv
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
              : conv
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
              : conv
          );
          set({ conversations });
        },

        deleteConversation: (conversationId) => {
          const state = get();
          const conversations = state.conversations.filter(
            (conv) => conv.id !== conversationId
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
              : conv
          );
          set({ conversations });
        },

        rejectMessageRequest: (conversationId) => {
          const state = get();
          const conversations = state.conversations.filter(
            (conv) => conv.id !== conversationId
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
        name: "chat-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          conversations: state.conversations,
          users: state.users,
          messages: state.messages,
          currentUserId: state.currentUserId,
        }),
      }
    ),
    { name: "ChatStore" }
  )
);
