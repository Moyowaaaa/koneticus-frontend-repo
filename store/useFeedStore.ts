"use client";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export interface FeedItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  timeAgo: string;
  title: string;
  description: string;
  tags: string[];
}

export interface MessageFeedItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  time: string;
  text: string;
}

interface FeedStore {
  feedItems: FeedItem[];
  isLoading: boolean;
  setFeedItems: (items: FeedItem[]) => void;
  setLoading: (loading: boolean) => void;
  addNewIdea: (title: string, description: string, tags?: string[]) => void;
}

const dummyFeedData: FeedItem[] = [
  {
    id: "1",
    user: {
      name: "Anita Baker",
      avatar: "/images/avatar-1.jpg",
    },
    timeAgo: "24 ago",
    title: "TITLE OF THE IDEA",
    description:
      "A monthly subscription box that delivers unique, locally-sourced snacks from around the world each month, allowing customers to explore different cultures through their taste buds.",
    tags: ["UI/UX Designer"],
  },
  {
    id: "2",
    user: {
      name: "Lana Del Rey",
      avatar: "/images/avatar-2.jpg",
    },
    timeAgo: "7 hrs ago",
    title: "Innovative Concept Title",
    description:
      "A monthly subscription box that brings you a selection of extraordinary snacks sourced from local artisans worldwide, inviting customers to savor and celebrate diverse cultures.",
    tags: ["Frontend", "Web Designer"],
  },
  {
    id: "3",
    user: {
      name: "Lana Del Rey",
      avatar: "/images/avatar-2.jpg",
    },
    timeAgo: "7 hrs ago",
    title: "Innovative Concept Title",
    description:
      "A monthly subscription box that brings you a selection of extraordinary snacks sourced from local artisans worldwide, inviting customers to savor and celebrate diverse cultures.",
    tags: ["Frontend"],
  },
];

const dummyMessageFeedData: MessageFeedItem[] = [
  {
    id: "1",
    user: {
      name: "Andrea Smith",
      avatar: "/images/avatar-1.jpg",
    },
    time: "2:00 pm",
    text: "Here is my message to you today.",
  },
  {
    id: "2",
    user: {
      name: "Andrea Smith",
      avatar: "/images/avatar-1.jpg",
    },
    time: "2:00 pm",
    text: "Here is my message to you today.",
  },
  {
    id: "3",
    user: {
      name: "Andrea Smith",
      avatar: "/images/avatar-1.jpg",
    },
    time: "2:00 pm",
    text: "Here is my message to you today.",
  },
];

export const useFeedStore = create<FeedStore>()(
  devtools(
    persist(
      (set, get) => ({
        feedItems: dummyFeedData,
        isLoading: false,
        setFeedItems: (items) => set({ feedItems: items }),
        setLoading: (loading) => set({ isLoading: loading }),
        addNewIdea: (
          title: string,
          description: string,
          tags: string[] = []
        ) => {
          const newIdea: FeedItem = {
            id: Date.now().toString(), // Simple ID generation
            user: {
              name: "Current User", // In a real app, this would come from auth
              avatar: "/images/dummy-avatar.svg",
            },
            timeAgo: "now",
            title,
            description,
            tags,
          };

          const currentItems = get().feedItems;
          set({ feedItems: [newIdea, ...currentItems] }); // Add new idea at the top
        },
      }),
      {
        name: "feed-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
