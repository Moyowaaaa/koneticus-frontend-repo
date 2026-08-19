import { FeedItem } from "@/api/feed/feed.model";
import { sentenceCaseEachWord } from "@/lib/utils";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import {
  CheckCheck,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
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

// Format relative time from ISO date string

const FeedIdeaCard = ({
  idea,
  isDeleting = false,
  onDelete,
  onDeleteSettled,
  isHero = false,
}: {
  idea: FeedItem;
  isDeleting?: boolean;
  onDelete?: (id: string) => void;
  onDeleteSettled?: (id: string) => void;
  /** First visible feed card — prioritize avatar + primary media. */
  isHero?: boolean;
}) => {
  const { openShowInterestModal } = useGeneralStateStore();
  const { user } = useAuthStore();
  const openEditModal = useEditIdeaModalStore((state) => state.openModal);

  // Get author from the populated author field
  const authorProfile = idea.author?.userProfile;
  const authorName = authorProfile
    ? `${authorProfile.firstname} ${authorProfile.lastname}`
    : "Unknown Author";
  const authorAvatar =
    authorProfile?.profilePicture?.url || "/images/dummy-avatar.svg";

  const isAuthor = user?._id === idea.author?._id || false;
  const isDraft = idea.status === "draft";
  const isOptimistic = idea._id.startsWith("optimistic-");

  const { mutateAsync: deleteProject, isPending } = useDeleteProject(idea._id);

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
      className={`w-full min-h-max flex flex-col gap-4 border
        dark:border-[#80808026]
        border-[#e9e9e9e9] rounded-[1.25rem] p-6 px-4 transition-all duration-300 ${
          isDeleting || isPending ? "opacity-50 scale-95" : "opacity-100 scale-100"
        }`}
    >
      <section className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-[2.5rem] w-[2.5rem] rounded-full relative overflow-hidden">
            <Image
              src={authorAvatar}
              alt="avatar"
              fill
              sizes="40px"
              priority={isHero}
              loading={isHero ? "eager" : "lazy"}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-brand-black text-base dark:text-[#FFFFFF]">
              {authorName}
            </p>
            <p className="text-[0.75rem] text-brand-grey dark:text-[#808080]">
              {formatTimeAgo(idea.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDraft && (
            <div className="flex flex-col items-end gap-0.5">
              <span className="rounded-full bg-[#F5F4FF] dark:bg-[#6155F5]/15 px-3 py-1 text-xs font-medium text-[#6155F5]">
                Draft
              </span>
              {!isAuthor && (
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
                {isDraft && (
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
          ) : (
            !isDraft && (
              <div
                onClick={() => openShowInterestModal(idea._id)}
                className="p-2 px-4 flex items-center gap-2 bg-primary
            dark:bg-[#6155F5]
            min-h-[2.5rem]
            max-h-[2.5rem]
            text-white rounded-[1.25rem] cursor-pointer hover:opacity-90 transition-opacity"
              >
                <CheckCheck
                  size={13}
                  className="text-white dark:text-[#151515]"
                />
                <p className="text-[0.875rem] text-white dark:text-[#151515]">
                  Show Interest
                </p>
              </div>
            )
          )}
        </div>
      </section>

      <div className="flex flex-col gap-2">
        <h1 className="text-brand-black dark:text-white font-medium">
          {idea.title}
        </h1>
        <p className="font-[sora-light] font-light text-brand-grey dark:text-[#808080]">
          {idea.description}
          {idea.description.length > 200 && (
            <span className="text-[#6155F5] cursor-pointer"> More</span>
          )}
        </p>

        {/* Required roles as tags */}
        {idea.requiredRoles && idea.requiredRoles.length > 0 && (
          <div className="flex items-center w-full gap-2 flex-wrap">
            {idea.requiredRoles.map((role) => (
              <div
                key={role}
                className="flex w-max items-center gap-1 rounded-full min-h-[2.125rem] bg-purple-light px-3 py-1 text-sm text-brand-black"
              >
                {sentenceCaseEachWord(role)}
              </div>
            ))}
          </div>
        )}

        {/* Display media grid */}
        {idea.media && idea.media.length > 0 && (
          <MediaGrid
            media={idea.media}
            alt={idea.title}
            priority={isHero}
          />
        )}
      </div>
    </div>
  );
};

export default FeedIdeaCard;
