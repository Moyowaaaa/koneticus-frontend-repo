"use client";

import { ProjectCollaborator, Project } from "@/api/projects/projects.model";
import { useGetProjectById } from "@/api/projects/projects.queries";
import { useCreateKollaboration } from "@/api/chat/chat.mutations";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import CollaborationRequestsSection from "@/components/dashboard/projects/collaboration-requests-section";
import ConversationMembersStack, {
  type MemberAvatar,
} from "@/components/messages/conversation-members-stack";
import ButtonV2 from "@/components/ui-components/button";
import TopBar from "@/components/ui-components/top-bar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import SafeImage from "@/components/ui-components/safe-image";

const PROJECT_STATUS_STYLES: Record<
  Project["status"],
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className:
      "bg-[#F4F4F5] text-brand-grey dark:bg-[#80808026] dark:text-[#C4C4C4]",
  },
  pending: {
    label: "Seeking collaborators",
    className:
      "bg-[#EEF8F1] text-[#1B7A3D] dark:bg-[#1B7A3D]/20 dark:text-[#7DDB9E]",
  },
  seeking_collaborators: {
    label: "Seeking collaborators",
    className:
      "bg-[#EEF8F1] text-[#1B7A3D] dark:bg-[#1B7A3D]/20 dark:text-[#7DDB9E]",
  },
  ongoing: {
    label: "Ongoing",
    className:
      "bg-lavender text-[#6155F5] dark:bg-[#6155F5]/20 dark:text-[#B7B1FF]",
  },
  completed: {
    label: "Completed",
    className:
      "bg-[#E8F8EF] text-[#1B7A45] dark:bg-[#1B7A45]/20 dark:text-[#7DDBA5]",
  },
  deleted: {
    label: "Deleted",
    className:
      "bg-[#FEEDED] text-[#C0392B] dark:bg-[#C0392B]/20 dark:text-[#F0A8A0]",
  },
  archived: {
    label: "Archived",
    className:
      "bg-[#F4F4F5] text-brand-grey dark:bg-[#80808026] dark:text-[#C4C4C4]",
  },
};

const getAuthorId = (author: Project["author"]) =>
  typeof author === "string" ? author : author._id;

const getMemberDisplay = (
  member: string | ProjectCollaborator,
  fallbackUser?: {
    _id: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    profilePicture?: string;
  } | null,
) => {
  if (typeof member === "string") {
    if (fallbackUser && fallbackUser._id === member) {
      const name =
        fallbackUser.firstname || fallbackUser.lastname
          ? `${fallbackUser.firstname ?? ""} ${fallbackUser.lastname ?? ""}`.trim()
          : fallbackUser.email || "Creator";

      return {
        id: member,
        name,
        avatar: fallbackUser.profilePicture || "",
      };
    }

    return {
      id: member,
      name: "Member",
      avatar: "",
    };
  }

  const profile = member.userProfile;
  return {
    id: member._id,
    name: profile ? `${profile.firstname} ${profile.lastname}` : member.email,
    avatar: profile?.profilePicture?.url || "",
  };
};

const ProjectDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: project, isLoading: isProjectLoading } = useGetProjectById(id);
  const { mutate: createKollaboration, isPending: isStartingChat } =
    useCreateKollaboration();

  const isAuthor =
    !!project && !!user && getAuthorId(project.author) === user._id;

  const conversationId = project?.conversationId ?? null;
  const collaborators = project?.collaborators ?? [];
  const creator = project?.author
    ? getMemberDisplay(project.author, user)
    : null;

  const teamMembers: MemberAvatar[] = (() => {
    const members: MemberAvatar[] = [];
    const seen = new Set<string>();

    if (creator) {
      members.push(creator);
      seen.add(creator.id);
    }

    for (const collaborator of collaborators) {
      const member = getMemberDisplay(collaborator);
      if (seen.has(member.id)) continue;
      seen.add(member.id);
      members.push(member);
    }

    return members;
  })();

  const statusMeta = project ? PROJECT_STATUS_STYLES[project.status] : null;

  const handleStartTeamChat = () => {
    if (!id || isStartingChat || conversationId) return;
    createKollaboration({ projectId: id });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-6 px-6 pt-6 lg:h-[calc(100dvh-6rem)] lg:gap-10 lg:overflow-hidden lg:pt-4">
        <TopBar className="flex shrink-0 items-center justify-between gap-6 pb-4 ">
          <div className="flex min-w-0 items-center gap-6">
            <ButtonV2
              onClick={router.back}
              type="button"
              className="h-[30px]! max-h-[30px]! min-h-[30px]! w-[68px]! max-w-[68px]! border-none px-[17px]! py-[5px]! text-[14px] leading-5 font-normal lg:h-max! lg:max-h-none! lg:min-h-max! lg:w-max! lg:max-w-none! lg:px-4! lg:py-3! lg:text-base"
              IconPlacement="left"
              Icon={
                <Image src="/images/back.svg" alt="" width={8} height={8} />
              }
              variant="dark"
            >
              Back
            </ButtonV2>

            {isProjectLoading && !(project as unknown as Project)?.title ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <h1 className="truncate font-sora text-[20px] leading-7 font-semibold text-brand-black lg:text-[1.25rem] dark:text-white">
                {project?.title ?? "Project"}
              </h1>
            )}
          </div>

          {(teamMembers.length > 0 || statusMeta) && (
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <ConversationMembersStack
                members={teamMembers}
                maxVisible={4}
                size="sm"
              />
              {statusMeta && (
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[0.6875rem] font-medium capitalize shadow-sm",
                    statusMeta.className,
                  )}
                >
                  {statusMeta.label}
                </span>
              )}
            </div>
          )}
        </TopBar>

        <div className="flex min-h-0 w-full flex-1 items-start justify-between gap-6 lg:items-stretch">
          <div className="flex w-full min-w-0 flex-col gap-4 lg:w-6/12 lg:overflow-hidden">
            <h1 className="font-sora text-[18px] leading-7 font-semibold text-brand-black lg:text-[1.125rem] dark:text-white">
              Project Description
            </h1>

            <div className="w-full rounded-[30px] p-4 lg:w-max lg:rounded-[1.875rem]">
              <p className="max-w-[35rem] font-[sora-light] text-[14px] leading-5 font-light text-brand-black lg:text-sm dark:text-white">
                {project?.description}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-4 lg:gap-2">
              <h1 className="font-sora text-[18px] leading-7 font-semibold text-brand-black lg:text-[1.125rem] dark:text-white">
                Team Members
              </h1>

              <div className="flex w-full min-w-0 flex-col gap-6 lg:gap-1">
                {creator && (
                  <div className="flex min-w-0 items-center gap-4 lg:gap-2 lg:py-2">
                    <div className="relative size-6 shrink-0 overflow-hidden rounded-full">
                      <SafeImage
                        src={creator.avatar}
                        alt={creator.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="min-w-0 truncate font-sora text-[16px] leading-[1.62] font-normal text-brand-black lg:text-base lg:leading-normal dark:text-white">
                      {creator.name}
                      <span className="text-[14px] leading-5 text-[#808080] lg:hidden">
                        {" "}
                        (Creator)
                      </span>
                    </p>
                    <p className="hidden shrink-0 text-sm text-[#808080] lg:block">
                      (Creator)
                    </p>
                    <Trash2
                      size={16}
                      className="ml-auto shrink-0 text-[#CF4F4F] lg:hidden"
                      aria-hidden
                    />
                  </div>
                )}

                {collaborators.map((collaborator) => {
                  const member = getMemberDisplay(collaborator);

                  return (
                    <div
                      key={member.id}
                      className="flex min-w-0 items-center gap-4 lg:gap-2 lg:py-2"
                    >
                      <div className="relative size-6 shrink-0 overflow-hidden rounded-full">
                        <SafeImage
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="min-w-0 truncate font-sora text-[16px] leading-[1.62] font-normal text-brand-black lg:text-base lg:leading-normal dark:text-white">
                        {member.name}
                      </p>
                      <Trash2
                        size={16}
                        className="ml-auto shrink-0 text-[#CF4F4F] lg:hidden"
                        aria-hidden
                      />
                    </div>
                  );
                })}

                {!creator && collaborators.length === 0 && (
                  <p className="py-4 text-sm text-brand-grey dark:text-[#808080]">
                    No team members yet.
                  </p>
                )}
              </div>
            </div>

            {isAuthor && (
              <div className="hidden lg:block">
                <CollaborationRequestsSection projectId={id} />
              </div>
            )}
          </div>

          <div
            className="relative
          
          hidden h-[40rem] min-h-0 w-[30rem] shrink-0 flex-col overflow-hidden rounded-[1.875rem] border p-6 lg:flex dark:bg-[#80808026]"
          >
            <div className="z-5 flex w-full items-center justify-between border-b border-[#E9E9E9] pb-2 dark:border-[#80808026]">
              <h1 className="text-brand-black font-semibold text-[1.25rem] dark:text-white">
                Team chat
              </h1>

              {!conversationId && isAuthor && (
                <ButtonV2
                  type="button"
                  variant="default"
                  className="min-h-max! px-4 py-2"
                  onClick={handleStartTeamChat}
                  disabled={isStartingChat}
                >
                  <p className="text-sm">
                    {isStartingChat ? "Starting..." : "Start kollaboration"}
                  </p>
                </ButtonV2>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-hidden pb-20 pt-2">
              {!conversationId && !isAuthor ? (
                <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 py-8 text-center">
                  <p className="font-sora text-sm text-brand-grey">
                    Waiting for the project creator to start team chat.
                  </p>
                </div>
              ) : (
                <ChatMessages conversationId={conversationId} />
              )}
            </div>

            <ChatInput
              className="z-10"
              conversationId={conversationId}
              disabled={!conversationId}
            />
          </div>
        </div>

        <div className="relative -mx-6 flex h-[calc(100dvh-8rem)] w-[calc(100%+3rem)] min-w-0 flex-col overflow-hidden lg:hidden">
          <div className="flex w-full items-center justify-between border-b border-[#E9E9E9] px-6 pb-3 dark:border-[#80808026]">
            <h2 className="font-sora text-[18px] leading-7 font-semibold text-brand-black dark:text-white">
              Team chat
            </h2>
            {!conversationId && isAuthor && (
              <ButtonV2
                type="button"
                variant="default"
                className="min-h-max! px-4 py-2"
                onClick={handleStartTeamChat}
                disabled={isStartingChat}
              >
                <p className="text-sm">
                  {isStartingChat ? "Starting..." : "Start kollaboration"}
                </p>
              </ButtonV2>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-hidden pb-16 pt-2">
            {!conversationId && !isAuthor ? (
              <div className="flex h-full min-h-[8rem] items-center justify-center text-center">
                <p className="font-sora text-sm text-brand-grey">
                  Waiting for the project creator to start team chat.
                </p>
              </div>
            ) : (
              <ChatMessages conversationId={conversationId} />
            )}
          </div>
          <ChatInput
            className="z-10"
            conversationId={conversationId}
            disabled={!conversationId}
          />
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsPage;
