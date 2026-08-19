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
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

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
    label: "Pending",
    className:
      "bg-[#FFF4E5] text-[#B86E00] dark:bg-[#B86E00]/20 dark:text-[#FFC66B]",
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
        avatar: fallbackUser.profilePicture || "/images/dummy-avatar.svg",
      };
    }

    return {
      id: member,
      name: "Member",
      avatar: "/images/dummy-avatar.svg",
    };
  }

  const profile = member.userProfile;
  return {
    id: member._id,
    name: profile ? `${profile.firstname} ${profile.lastname}` : member.email,
    avatar: profile?.profilePicture?.url || "/images/dummy-avatar.svg",
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
    if (!id || isStartingChat) return;
    createKollaboration({ projectId: id });
  };

  return (
    <>
      <div className="flex flex-col gap-10 w-full pt-4 px-6">
        <TopBar className="flex items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-6">
            <ButtonV2
              onClick={router.back}
              type="button"
              className="w-max h-max min-h-max! py-3 !px-4 border-none"
              IconPlacement="left"
              Icon={
                <Image
                  src="/images/back.svg"
                  alt="back"
                  width={13}
                  height={13}
                />
              }
              variant="dark"
            >
              Back
            </ButtonV2>

            <h1 className="truncate font-semibold text-[1.25rem] text-brand-black dark:text-white">
              {project?.title ?? (isProjectLoading ? "Loading..." : "Project")}
            </h1>
          </div>

          {(teamMembers.length > 0 || statusMeta) && (
            <div className="flex shrink-0 items-center gap-3">
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

        <div className="flex items items-start w-full  justify-between ">
          <div className=" w-6/12  flex flex-col gap-4">
            <h1
              className="font-semibold text-[1.125rem]  text-brand-black
            dark:text-white
            "
            >
              Project Description
            </h1>

            <div className="p-4  rounded-[1.875rem] w-max ">
              <p
                className="text-sm  font-[sora-light] text-brand-black
              dark:text-white
              max-w-[35rem]"
              >
                {project?.description}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <h1 className="text-[1.125rem] font-semibold text-brand-black dark:text-white">
                Team Members
              </h1>

              <div className="flex w-full min-w-0 flex-col gap-1">
                {creator && (
                  <div className="relative flex min-w-0 items-center gap-2 py-2">
                    <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={creator.avatar}
                        alt={creator.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="truncate text-brand-black dark:text-white">
                      {creator.name}
                    </p>
                    <p className="shrink-0 text-sm text-[#808080]">(Creator)</p>
                  </div>
                )}

                {collaborators.map((collaborator) => {
                  const member = getMemberDisplay(collaborator);

                  return (
                    <div
                      key={member.id}
                      className="relative flex min-w-0 items-center gap-2 py-2"
                    >
                      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="truncate text-brand-black dark:text-white">
                        {member.name}
                      </p>
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

            {isAuthor && <CollaborationRequestsSection projectId={id} />}
          </div>

          <div
            className="relative flex w-[30rem] h-[50rem] min-w-0 flex-col overflow-hidden border p-6 rounded-[1.875rem]
            dark:bg-[#80808026]
          "
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

            <div className="min-h-0 flex-1 pb-20 pt-2">
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
              conversationId={conversationId}
              disabled={!conversationId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsPage;
