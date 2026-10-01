import { useState } from "react";
import { FeedItem } from "@/api/feed/feed.model";
import { cn, sentenceCaseEachWord } from "@/lib/utils";
import {
  canShowInterest,
  getProjectStatusLabel,
  getProjectStatusTagClass,
  isDraftStatus,
  normalizeProjectStatus,
  shouldShowFeedStatusTag,
} from "@/lib/project-status";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import MediaGrid from "./media-grid";
import { formatTimeAgo } from "@/utils";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useDeleteProject } from "@/api/projects/project.mutations";
import { useEditIdeaModalStore } from "@/store/useEditIdeaModalStore";
import SafeImage from "@/components/ui-components/safe-image";

type MyRequestStatus = "pending" | "accepted" | "rejected";

const FeedIdeaCard = ({
  idea,
  isDeleting = false,
  onDelete,
  onDeleteSettled,
  isHero = false,
  myRequestStatus = null,
}: {
  idea: FeedItem;
  isDeleting?: boolean;
  onDelete?: (id: string) => void;
  onDeleteSettled?: (id: string) => void;
  /** First visible feed card — prioritize avatar + primary media. */
  isHero?: boolean;
  myRequestStatus?: MyRequestStatus | null;
}) => {
  const { openShowInterestModal } = useGeneralStateStore();
  const { user } = useAuthStore();
  const openEditModal = useEditIdeaModalStore((state) => state.openModal);

  const authorProfile = idea.author?.userProfile;
  const authorName = authorProfile
    ? `${authorProfile.firstname} ${authorProfile.lastname}`
    : "Unknown Author";
  const isAuthor = user?._id === idea.author?._id || false;
  const isDraft = isDraftStatus(idea.status);
  const collaboratorCount = idea.collaborators?.length ?? 0;
  const isCollaborator =
    !!user?._id && (idea.collaborators ?? []).some((c) => c._id === user._id);

  const showInterest = canShowInterest(idea.status, {
    collaboratorCount,
    teamSize: idea.teamSize,
    isCollaborator,
    myRequestStatus,
  });

  const canEdit =
    isDraft ||
    normalizeProjectStatus(idea.status) === "seeking_collaborators" ||
    normalizeProjectStatus(idea.status) === "ongoing";

  const isOptimistic = idea._id.startsWith("optimistic-");
  const showStatusTag = shouldShowFeedStatusTag(
    idea.status,
    collaboratorCount,
    idea.teamSize,
  );
  const statusLabel = getProjectStatusLabel(idea.status);
  const statusTagClass = getProjectStatusTagClass(idea.status);

  const membershipLabel = isCollaborator
    ? "Joined"
    : myRequestStatus === "pending"
      ? "Interest sent"
      : myRequestStatus === "accepted"
        ? "Joined"
        : null;

  const { mutateAsync: deleteProject, isPending } = useDeleteProject(idea._id);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const isLongDescription = idea.description.length > 140;
  const descriptionText =
    isLongDescription && !descriptionExpanded
      ? `${idea.description.slice(0, 140).trim()} `
      : idea.description;

  const handleEdit = () => {
    openEditModal(idea._id);
  };

  const handleDelete = async () => {
    onDelete?.(idea._id);

    try {
      await deleteProject(idea._id);
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      onDeleteSettled?.(idea._id);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full min-h-max flex-col rounded-[20px] border border-[rgba(233,233,233,0.91)] bg-white px-[15px] pt-[15px] pb-[17px] transition-all duration-300 md:px-[23px] md:pb-[23px] dark:border-[#80808026] dark:bg-transparent",
        isDeleting || isPending
          ? "scale-95 opacity-50"
          : "scale-100 opacity-100",
      )}
    >
      <section className="flex w-full items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-[30px]">
            <SafeImage
              src={authorProfile?.profilePicture?.url}
              alt="avatar"
              fill
              sizes="40px"
              priority={isHero}
              loading={isHero ? "eager" : "lazy"}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col leading-[1.62]">
            <p className="font-sora text-[16px] leading-[1.62] font-normal text-brand-black dark:text-white">
              {authorName}
            </p>
            <p className="font-sora text-[12px] leading-[1.62] font-normal text-brand-grey dark:text-[#808080]">
              {formatTimeAgo(idea.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showStatusTag && (
            <div className="flex flex-col items-end gap-0.5">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusTagClass}`}
              >
                {statusLabel}
              </span>
              {isDraft && !isAuthor && (
                <span className="text-[0.6875rem] text-brand-grey dark:text-[#808080]">
                  Not active yet
                </span>
              )}
            </div>
          )}
          {isAuthor ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  disabled={isDeleting || isPending || isOptimistic}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-40 p-2">
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-brand-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    onClick={handleEdit}
                    disabled={isDeleting || isPending || isOptimistic}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={isDeleting || isPending || isOptimistic}
                >
                  {isDeleting || isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  {isDeleting || isPending ? "Deleting..." : "Delete"}
                </Button>
              </PopoverContent>
            </Popover>
          ) : showInterest ? (
            <button
              type="button"
              onClick={() => openShowInterestModal(idea._id)}
              className="flex h-10 w-[138px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-[20px] bg-[#6155F5] px-[17px] font-sora text-[14px] leading-5 font-normal text-white transition-opacity hover:opacity-90"
            >
              <img src="/images/feed/show-interest-check.svg" alt="" />
              Show interest
            </button>
          ) : (
            membershipLabel && (
              <span className="rounded-full bg-[#F5F4FF] px-3 py-1 text-xs font-medium text-[#6155F5] dark:bg-[#6155F5]/15 dark:text-[#A8A1FF]">
                {membershipLabel}
              </span>
            )
          )}
        </div>
      </section>

      <div className="mt-4 flex flex-col max-md:px-2 md:mt-[21px]">
        <h1 className="font-sora text-[16px] leading-[1.62] font-normal text-brand-black dark:text-white">
          {idea.title}
        </h1>
        <p className="mt-2 font-[sora-light] text-sm font-light leading-5 text-brand-grey dark:text-[#808080]">
          {descriptionText}
          {isLongDescription && (
            <button
              type="button"
              onClick={() => setDescriptionExpanded((open) => !open)}
              className="cursor-pointer text-sm font-normal leading-5 text-[#6155F5] underline decoration-solid"
            >
              {descriptionExpanded ? "Less" : "More"}
            </button>
          )}
        </p>

        {idea.requiredRoles && idea.requiredRoles.length > 0 && (
          <div className="mt-4 flex w-full flex-wrap items-center gap-4 md:mt-2 md:gap-2">
            {idea.requiredRoles.map((role) => (
              <div
                key={role}
                className="flex h-6 w-max items-center gap-1 rounded-[30px] bg-purple-light px-3 text-[10px] leading-[1.62] text-brand-black"
              >
                {sentenceCaseEachWord(role)}
                <img src="/images/feed/role-close.svg" alt="" aria-hidden />
              </div>
            ))}
          </div>
        )}

        {idea.media && idea.media.length > 0 && (
          <MediaGrid
            media={idea.media}
            alt={idea.title}
            priority={isHero}
            className={
              idea.media.length === 1
                ? "mt-4 aspect-auto h-[250px] rounded-[10px]"
                : "mt-4 rounded-[10px]"
            }
          />
        )}
      </div>
    </div>
  );
};

export default FeedIdeaCard;
