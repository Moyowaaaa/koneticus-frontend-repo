import React from "react";
import FeedEmptyState from "./feed-empty-state";
import { useFeedStore } from "@/store/useFeedStore";
import FeedIdeaCard from "./feed-idea-card";
import { useDummyStore } from "@/store/useDummyStore";

const Feed = () => {
  const { feedItems, isLoading } = useFeedStore();
  const { useDummyData } = useDummyStore();

  const data = !useDummyData ? [] : feedItems;

  return (
    <>
      <div className="flex flex-col gap-4 w-full py-4">
        <h1 className="text-[1.125rem] font-normal leading-[1.875rem]">
          Recommended for you
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-80">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-6">
            {data.map((item) => (
              <FeedIdeaCard key={item.id} idea={item} />
            ))}
          </div>
        ) : (
          <FeedEmptyState />
        )}
      </div>
    </>
  );
};

export default Feed;
