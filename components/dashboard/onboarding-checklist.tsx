"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Circle, X } from "lucide-react";
import { useGetInfiniteMyCollaborationRequests } from "@/api/collaboration/collaboration.queries";
import { useGetConversations } from "@/api/chat/chat.queries";
import { useGetInfiniteUserProjects } from "@/api/projects/projects.queries";
import { useGetMe } from "@/api/user/user.queries";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { useSearchStore } from "@/store/useSearchStore";
import type { UserProfileLinks } from "@/api/user/user.model";

type ChecklistItem = {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  actionLabel: string;
  onAction: () => void;
};

const hasPortfolioLink = (links?: UserProfileLinks) =>
  Boolean(links && Object.values(links).some((value) => value?.trim()));

const getEntityId = (value: string | { _id?: string } | null | undefined) =>
  typeof value === "string" ? value : value?._id;

const OnboardingChecklist = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { toggleNewIdeaModal } = useGeneralStateStore();
  const { setShowSearch } = useSearchStore();
  const [dismissVersion, setDismissVersion] = useState(0);

  const storageKey = user?._id
    ? `Koneticus-onboarding-checklist-dismissed-${user._id}`
    : null;
  const isDismissed =
    dismissVersion >= 0 &&
    typeof window !== "undefined" &&
    !!storageKey &&
    localStorage.getItem(storageKey) === "true";

  const { data: meData, isLoading: isMeLoading } = useGetMe({
    enabled: isAuthenticated,
  });
  const { data: projectsData, isLoading: isProjectsLoading } =
    useGetInfiniteUserProjects(10, "authored");
  const { data: requestsData, isLoading: isRequestsLoading } =
    useGetInfiniteMyCollaborationRequests(20);
  const { data: conversationsData, isLoading: isConversationsLoading } =
    useGetConversations(
      { page: 1, limit: 1 },
      { enabled: isAuthenticated },
  );

  const currentUserId = user?._id;
  const profile = meData?.userProfile;
  const authoredProjects =
    projectsData?.pages
      .flatMap((page) => page.projects)
      .filter((project) => getEntityId(project.author) === currentUserId) ?? [];
  const sentRequests =
    requestsData?.pages
      .flatMap((page) => page.requests)
      .filter(
        (request) => getEntityId(request.requesterId) === currentUserId,
      ) ?? [];
  const conversationCount =
    conversationsData?.conversations?.filter((conversation) =>
      conversation.members.some((member) => member.userId === currentUserId),
    ).length ?? 0;

  const items = useMemo<ChecklistItem[]>(
    () => [
      {
        id: "profile-photo",
        label: "Add a profile photo",
        description: "Help collaborators recognize you across Koneticus.",
        completed: Boolean(profile?.profilePicture?.url || user?.profilePicture),
        actionLabel: "Edit profile",
        onAction: () => router.push("/dashboard/settings"),
      },
      {
        id: "roles",
        label: "Choose your role",
        description: "Roles help search match you with the right projects.",
        completed: Boolean((profile?.roles ?? user?.roles ?? []).length),
        actionLabel: "Edit profile",
        onAction: () => router.push("/dashboard/settings"),
      },
      {
        id: "bio-links",
        label: "Add your bio or portfolio",
        description: "Give people a quick reason to work with you.",
        completed: Boolean(profile?.bio?.trim() || hasPortfolioLink(profile?.links)),
        actionLabel: "Edit profile",
        onAction: () => router.push("/dashboard/settings"),
      },
      {
        id: "first-idea",
        label: "Create your first idea",
        description: "Start a project and invite collaborators.",
        completed: authoredProjects.length > 0,
        actionLabel: "New idea",
        onAction: toggleNewIdeaModal,
      },
      {
        id: "first-request",
        label: "Send a collaboration request",
        description: "Show interest in a project that fits your skills.",
        completed: sentRequests.length > 0,
        actionLabel: "Find projects",
        onAction: () => setShowSearch(true),
      },
      {
        id: "first-message",
        label: "Start a conversation",
        description: "Keep your project discussions in one place.",
        completed: conversationCount > 0,
        actionLabel: "Open messages",
        onAction: () => router.push("/dashboard/messages"),
      },
    ],
    [
      authoredProjects.length,
      conversationCount,
      profile?.bio,
      profile?.links,
      profile?.profilePicture?.url,
      profile?.roles,
      router,
      sentRequests.length,
      setShowSearch,
      toggleNewIdeaModal,
      user?.profilePicture,
      user?.roles,
    ],
  );

  const completedCount = items.filter((item) => item.completed).length;
  const progress = Math.round((completedCount / items.length) * 100);
  const nextItem = items.find((item) => !item.completed);
  const isChecklistLoading =
    !isAuthenticated ||
    !user?._id ||
    isMeLoading ||
    isProjectsLoading ||
    isRequestsLoading ||
    isConversationsLoading;

  const dismiss = () => {
    if (typeof window !== "undefined" && storageKey) {
      localStorage.setItem(storageKey, "true");
    }
    setDismissVersion((version) => version + 1);
  };

  if (isChecklistLoading || isDismissed || completedCount === items.length) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-[#E9E9E9] bg-white p-4 dark:border-[#80808026] dark:bg-[#151515]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#6155F5] dark:text-[#A8A1FF]">
            Getting started
          </p>
          <h2 className="mt-1 text-lg font-semibold text-brand-black dark:text-white">
            Finish setting up your account
          </h2>
          <p className="mt-1 text-sm text-brand-grey">
            {completedCount} of {items.length} complete
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full p-1 text-brand-grey transition-colors hover:bg-lavender hover:text-brand-black dark:hover:bg-[#80808026] dark:hover:text-white"
          aria-label="Dismiss onboarding checklist"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F3F4F6] dark:bg-[#80808026]">
        <div
          className="h-full rounded-full bg-[#6155F5] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 grid gap-2">
        {items.map((item) => {
          const isNext = nextItem?.id === item.id;
          const Icon = item.completed ? CheckCircle2 : Circle;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onAction}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                item.completed
                  ? "border-transparent bg-[#EEF8F1] dark:bg-[#1B7A3D]/15"
                  : "border-[#E9E9E9] hover:bg-lavender dark:border-[#80808026] dark:hover:bg-[#211E1E]",
                isNext && !item.completed
                  ? "border-[#C7C2FF] bg-[#F5F4FF] dark:border-[#6155F5]/40 dark:bg-[#6155F5]/10"
                  : "",
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0",
                  item.completed ? "text-[#1B7A3D]" : "text-brand-grey",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-black dark:text-white">
                  {item.label}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-brand-grey">
                  {item.description}
                </p>
              </div>
              {!item.completed ? (
                <span className="hidden shrink-0 items-center gap-1 text-xs font-medium text-[#6155F5] sm:flex">
                  {item.actionLabel}
                  <ChevronRight className="size-3" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default OnboardingChecklist;
