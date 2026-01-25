import { FeedItem } from "@/api/feed/feed.model";
import { sentenceCaseEachWord } from "@/lib/utils";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { CheckCheck } from "lucide-react";
import Image from "next/image";
import MediaGrid from "./media-grid";

// Format relative time from ISO date string
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const FeedIdeaCard = ({ idea }: { idea: FeedItem }) => {
  const { toggleShowInterestModal } = useGeneralStateStore();

  // Get author from the populated author field
  const authorProfile = idea.author?.userProfile;
  const authorName = authorProfile
    ? `${authorProfile.firstname} ${authorProfile.lastname}`
    : "Anonymous";
  const authorAvatar =
    authorProfile?.profilePicture?.url || "/images/dummy-avatar.svg";

  console.log(["authhguhf", authorProfile]);

  return (
    <div
      className="w-full min-h-max flex flex-col gap-4 border
        dark:border-[#80808026]
        border-[#e9e9e9e9] rounded-[1.25rem] p-6 px-4"
    >
      <section className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-[2.5rem] w-[2.5rem] rounded-full relative overflow-hidden">
            <Image
              src={authorAvatar}
              alt="avatar"
              fill
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

        <div
          onClick={toggleShowInterestModal}
          className="p-2 px-4 flex items-center gap-2 bg-primary
            dark:bg-[#6155F5]
            min-h-[2.5rem]
            max-h-[2.5rem]
            text-white rounded-[1.25rem] cursor-pointer hover:opacity-90 transition-opacity"
        >
          <CheckCheck size={13} className="text-white dark:text-[#151515]" />
          <p className="text-[0.875rem] text-white dark:text-[#151515]">
            Show Interest
          </p>
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
          <MediaGrid media={idea.media} alt={idea.title} />
        )}
      </div>
    </div>
  );
};

export default FeedIdeaCard;
