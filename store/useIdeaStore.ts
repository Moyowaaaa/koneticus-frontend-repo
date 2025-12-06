"use client";

import { Collaborator, Project } from "@/types";
import { dummyUsers } from "@/types/data";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type ExtendedProject = Omit<Project, "collaborators"> & {
  collaborators?: Collaborator[];
};

interface IdeaStore {
  ideas: ExtendedProject[];
  isLoading: boolean;
  error: string | null;

  fetchIdeas: () => void;
  getIdeaById: (id: string) => ExtendedProject | undefined;
  addIdea: (
    idea: Omit<ExtendedProject, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateIdea: (id: string, updates: Partial<ExtendedProject>) => void;
  deleteIdea: (id: string) => void;
}

const dummyIdeas: ExtendedProject[] = [
  {
    id: "1",
    title: "Idea title would be in this place",
    description:
      "Love is a fundamental human experience that enriches our lives in countless ways. It fosters connection, understanding, and compassion, allowing us to build meaningful relationships. Love motivates us to care for others, enhances our emotional well-being, and provides a sense of belonging. In times of hardship, love can be a source of strength and resilience, reminding us that we are not alone. Ultimately, love is what makes life truly fulfilling.",
    status: "pending",
    image: "/images/project.png",
    createdAt: "2024-09-26",
    updatedAt: "2024-09-26",
    collaborators: [dummyUsers[1]],
  },
  {
    id: "2",
    title: "Idea title would be in this place",
    description:
      "Love is a fundamental human experience that enriches our lives in countless ways. It fosters connection, understanding, and compassion, allowing us to build meaningful relationships. Love motivates us to care for others, enhances our emotional well-being, and provides a sense of belonging. In times of hardship, love can be a source of strength and resilience, reminding us that we are not alone. Ultimately, love is what makes life truly fulfilling.",
    status: "pending",
    image: "/images/project.png",
    createdAt: "2024-09-26",
    updatedAt: "2024-09-26",
    collaborators: dummyUsers,
  },
  {
    id: "3",
    title: "Idea title would be in this place",
    description:
      "Love is a fundamental human experience that enriches our lives in countless ways. It fosters connection, understanding, and compassion, allowing us to build meaningful relationships. Love motivates us to care for others, enhances our emotional well-being, and provides a sense of belonging. In times of hardship, love can be a source of strength and resilience, reminding us that we are not alone. Ultimately, love is what makes life truly fulfilling.",
    status: "ongoing",
    image: "/images/project.png",
    createdAt: "2024-09-26",
    updatedAt: "2024-09-26",
    collaborators: [dummyUsers[1], dummyUsers[2]],
  },
];

const generateId = () => Math.random().toString(36).slice(2, 11);
const getTimestamp = () => new Date().toISOString();

export const useIdeaStore = create<IdeaStore>()(
  devtools(
    persist(
      (set, get) => ({
        ideas: dummyIdeas,
        isLoading: false,
        error: null,

        fetchIdeas: () => {
          set({ isLoading: true, error: null });
          try {
            set({ ideas: dummyIdeas, isLoading: false });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch ideas",
              isLoading: false,
            });
          }
        },

        getIdeaById: (id) => get().ideas.find((idea) => idea.id === id),

        addIdea: (ideaPayload) => {
          const { image, status, ...restPayload } = ideaPayload;
          const timestamp = getTimestamp();
          const newIdea: ExtendedProject = {
            id: generateId(),
            createdAt: timestamp,
            updatedAt: timestamp,
            status: status ?? "pending",
            image: image ?? "/images/project.png",
            ...restPayload,
          };

          set({ ideas: [newIdea, ...get().ideas] });
        },

        updateIdea: (id, updates) => {
          const updatedIdeas = get().ideas.map((idea) =>
            idea.id === id
              ? {
                  ...idea,
                  ...updates,
                  updatedAt: getTimestamp(),
                }
              : idea
          );

          set({ ideas: updatedIdeas });
        },

        deleteIdea: (id) => {
          set({ ideas: get().ideas.filter((idea) => idea.id !== id) });
        },
      }),
      {
        name: "idea-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
