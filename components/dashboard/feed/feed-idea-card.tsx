import { FeedItem } from "@/store/useFeedStore";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { CheckCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

const FeedIdeaCard = ({ idea }: { idea?: FeedItem }) => {
  const { setShowShowInterestModal, toggleShowInterestModal } =
    useGeneralStateStore();
  return (
    <>
      <div className="w-full min-h-max  flex flex-col gap-4 border border-[#e9e9e9e9] rounded-[1.25rem] p-6 px-4">
        <section className="w-full  flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-[2.5rem] w-[2.5rem] rounded-full relative">
              <Image
                src={"/images/dummy-avatar.svg"}
                alt="avatar"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-brand-black text-base">{idea?.user.name}</p>
              <p className="text-[0.75rem] text-brand-grey">{idea?.timeAgo}</p>
            </div>
          </div>

          <div
            onClick={toggleShowInterestModal}
            className="p-2 px-4 flex items-center gap-2 bg-primary text-white rounded-[1.25rem]"
          >
            <CheckCheck size={13} color="white" />
            <p className="text-[0.875rem] text-white">Show Interest</p>
          </div>
        </section>

        <div className="flex flex-col gap-2">
          <h1 className="text-brand-black">{idea?.title}</h1>
          <p className="font-[sora-light] font-lightn text-brand-grey">
            {idea?.description}. More
          </p>

          <div className="flex items-center w-full gap-2">
            {idea?.tags?.map((tag) => (
              <div
                key={tag}
                className="flex w-max items-center gap-1 rounded-full min-h-[2.125rem]  bg-purple-light px-3 py-1 text-sm text-brand-black"
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Display image if present */}
          {idea?.image && (
            <div className="w-full h-[200px] mt-2 rounded-xl overflow-hidden relative">
              <Image
                src={idea.image}
                alt={`Image for ${idea.title}`}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeedIdeaCard;
