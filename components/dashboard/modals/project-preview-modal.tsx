"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetInfiniteMyCollaborationRequests } from "@/api/collaboration/collaboration.queries";
import {
  canShowInterest,
  getProjectStatusLabel,
  getProjectStatusTagClass,
} from "@/lib/project-status";
import { People } from "iconsax-reactjs";
import { Check } from "lucide-react";
import SafeImage from "@/components/ui-components/safe-image";
import MediaGrid from "../feed/media-grid";
import { sentenceCaseEachWord } from "@/lib/utils";
import { formatTimeAgo } from "@/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

const ProjectPreviewModal = () => {
  const {
    showProjectPreviewModal,
    projectPreviewData,
    setShowProjectPreviewModal,
    resetProjectPreviewModal,
  } = useGeneralStateStore();
  const { user } = useAuthStore();
  const { data: myRequestsData } = useGetInfiniteMyCollaborationRequests(50);
const router = useRouter();
  if (!projectPreviewData) return null;

  const authorProfile = projectPreviewData.author?.userProfile;
  const authorName = authorProfile
    ? `${authorProfile.firstname} ${authorProfile.lastname}`
    : "Unknown Author";
  const isAuthor = user?._id === projectPreviewData.author?._id;
  const collaboratorCount = projectPreviewData.collaborators?.length ?? 0;
  const isCollaborator =
    !!user?._id &&
    (projectPreviewData.collaborators ?? []).some((c) => c._id === user._id);

  // Check if user has already sent a request
  const myRequestStatus = myRequestsData?.pages
    .flatMap((page) => page.requests)
    .find(
      (request) =>
        (typeof request.projectId === "string"
          ? request.projectId
          : request.projectId?._id) === projectPreviewData._id,
    )?.status;

  const showInterest = canShowInterest(projectPreviewData.status, {
    collaboratorCount,
    teamSize: projectPreviewData.teamSize,
    isCollaborator,
    myRequestStatus,
  });

  const statusLabel = getProjectStatusLabel(projectPreviewData.status);
  const statusTagClass = getProjectStatusTagClass(projectPreviewData.status);

  const handleModalClose = (open: boolean) => {
    if (open) {
      setShowProjectPreviewModal(true);
    } else {
      resetProjectPreviewModal();
    }
  };

  const handleShowInterest = () => {
    resetProjectPreviewModal();
    useGeneralStateStore.getState().openShowInterestModal(projectPreviewData._id);
  };

  return (
    <Modal
      open={showProjectPreviewModal}
      onOpenChange={handleModalClose}
      title="Project Preview"
      className="flex flex-col max-w-2xl "
      titleClassname="py-2"
    >
      <div className="flex flex-col gap-4">
      {/* Header with author info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full relative overflow-hidden shrink-0 border border-[#E9E9E9] dark:border-[#80808026]">
            <SafeImage
              src={authorProfile?.profilePicture?.url}
              alt="author avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-brand-black dark:text-white">
              {authorName}
            </p>
            <p className="text-sm text-brand-grey">
              {formatTimeAgo(projectPreviewData.createdAt)}
            </p>
          </div>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusTagClass}`}
        >
          {statusLabel}
        </div>
      </div>

      {/* Project title and description */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-brand-black dark:text-white">
          {projectPreviewData.title}
        </h2>
        <p className="text-brand-grey whitespace-pre-wrap leading-relaxed">
          {projectPreviewData.description}
        </p>
      </div>

      {/* Required roles */}
      {projectPreviewData.requiredRoles &&
        projectPreviewData.requiredRoles.length > 0 && (
          <div className="flex flex-col gap-2">
           
            <div className="flex flex-wrap gap-2">
              {projectPreviewData.requiredRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-center gap-1 rounded-full bg-purple-light px-3 py-1.5 text-sm text-brand-black"
                >
                  {sentenceCaseEachWord(role)}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Media */}
      {projectPreviewData.media && projectPreviewData.media.length > 0 && (
        <div className="flex flex-col gap-2">
          <MediaGrid media={projectPreviewData.media} alt={projectPreviewData.title} />
        </div>
      )}

      {/* Collaborators */}
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-black dark:text-white">
          <People size={16} />
          <p>
            Collaborators ({collaboratorCount} / {projectPreviewData.teamSize})
          </p>
        </div>
        {collaboratorCount > 0 ? (
          <TooltipProvider>
            <div className="flex items-center gap-2">
              {projectPreviewData.collaborators.slice(0, 5).map((collaborator) => (
                <Tooltip key={collaborator._id}>
                  <TooltipTrigger asChild>
                    <div className="h-10 w-10 rounded-full relative overflow-hidden shrink-0 border border-[#E9E9E9] dark:border-[#80808026] cursor-pointer">
                      <SafeImage
                        src={collaborator.userProfile.profilePicture?.url}
                        alt="collaborator avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{`${collaborator.userProfile.firstname} ${collaborator.userProfile.lastname}`}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {collaboratorCount > 5 && (
                <div className="h-10 w-10 rounded-full bg-[#E9E9E9] dark:bg-[#80808026] flex items-center justify-center text-xs text-brand-black dark:text-white shrink-0 border border-[#E9E9E9] dark:border-[#80808026]">
                  +{collaboratorCount - 5}
                </div>
              )}
            </div>
          </TooltipProvider>
        ) : (
          <p className="text-sm text-brand-grey">No collaborators yet</p>
        )}
      </div>

      {/* Action buttons */}
      {!isAuthor && (
        <div className="flex items-center justify-between border-t border-[#E9E9E9] dark:border-[#80808026] pt-2">
          {showInterest ? (
            <ButtonV2
              type="button"
              className="px-6 border-none dark:bg-[#6155F5]"
              IconPlacement="left"
              Icon={<Check size={16} className="text-white" />}
              onClick={handleShowInterest}
              variant="dark"
            >
              Request to Collaborate
            </ButtonV2>
          ) : isCollaborator ? (
            <div className="flex items-center justify-between gap-3 w-full ">
              <div className="rounded-full bg-[#F5F4FF] px-4 py-2 text-sm font-medium text-[#6155F5] dark:bg-[#6155F5]/15 dark:text-[#A8A1FF]">
                You are a collaborator
              </div>
              <button
                type="button"
                className="h-10 px-4 rounded-full bg-[#E9E9E9] dark:bg-[#80808026] flex items-center justify-center text-sm font-medium text-brand-black dark:text-white hover:bg-[#D4D4D4] dark:hover:bg-[#606060] transition-colors"
                onClick={() => router.push(`/dashboard/projects/ongoing/${projectPreviewData._id}`)}
              >
                Open
              </button>
            </div>
          ) : myRequestStatus === "pending" ? (
            <div className="rounded-full bg-[#F5F4FF] px-4 py-2 text-sm font-medium text-[#6155F5] dark:bg-[#6155F5]/15 dark:text-[#A8A1FF]">
              Request pending
            </div>
          ) : myRequestStatus === "accepted" ? (
            <div className="rounded-full bg-[#F5F4FF] px-4 py-2 text-sm font-medium text-[#6155F5] dark:bg-[#6155F5]/15 dark:text-[#A8A1FF]">
              Request accepted
            </div>
          ) : (
            <div className="rounded-full bg-[#E9E9E9] px-4 py-2 text-sm font-medium text-brand-grey dark:bg-[#80808026]">
              Not accepting requests
            </div>
          )}
        </div>
      )}
        </div>

    </Modal>
  );
};

export default ProjectPreviewModal;

