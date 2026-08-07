"use client";

import {
  ProjectCollaborator,
  Project,
} from "@/api/projects/projects.model";
import { useGetProjectById } from "@/api/projects/projects.queries";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import CollaborationRequestsSection from "@/components/dashboard/projects/collaboration-requests-section";
import ButtonV2 from "@/components/ui-components/button";
import TopBar from "@/components/ui-components/top-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

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
    name: profile
      ? `${profile.firstname} ${profile.lastname}`
      : member.email,
    avatar: profile?.profilePicture?.url || "/images/dummy-avatar.svg",
  };
};

const ProjectDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: project } = useGetProjectById(id);
  const isAuthor =
    !!project && !!user && getAuthorId(project.author) === user._id;

  const collaborators = project?.collaborators ?? [];
  const creator = project?.author
    ? getMemberDisplay(project.author, user)
    : null;

  return (
    <>
      <div className="flex flex-col gap-10 w-full pt-4 px-6">
        <TopBar className="flex items-center gap-6">
          <ButtonV2
            onClick={router.back}
            type="submit"
            className="w-max h-max min-h-max! py-3 !px-4 border-none"
            IconPlacement="left"
            Icon={
              <Image src="/images/back.svg" alt="back" width={13} height={13} />
            }
            variant="dark"
          >
            Back
          </ButtonV2>

          <h1 className="font-semibold text-[1.25rem] ">{project?.title}</h1>
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
            className=" relative w-[30rem] h-[40rem] border p-6 rounded-[1.875rem]

            dark:bg-[#80808026]
          
          
          "
          >
            <div className="flex items-center justify-between w-full border-b border-#E9E9E9E9] pb-2  z-5">
              <h1 className="text-brand-black font-semibold text-[1.25rem] dark:text-white">
                Team chat
              </h1>
            </div>

            <ScrollArea className="max-h-[31rem] h-full pr-2">
              <ChatMessages />
            </ScrollArea>

            <ChatInput />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsPage;
