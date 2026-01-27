"use client";

import React, { useCallback } from "react";
import FeedEmptyState from "./feed-empty-state";
import FeedIdeaCard from "./feed-idea-card";
import FeedIdeaCardSkeleton from "./feed-idea-card-skeleton";
import { useGetInfiniteFeed } from "@/api/feed/feed.queries";

const Feed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetInfiniteFeed();

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(node);

      return () => observer.disconnect();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const feedItems = data?.pages.flatMap((page) => page.items) ?? [];

  if (isError) {
    return (
      <div className="flex flex-col gap-4 w-full py-4">
        <h1 className="text-[1.125rem] font-normal leading-[1.875rem]">
          Recommended for you
        </h1>
        <div className="flex items-center justify-center min-h-80">
          <div className="text-red-500">
            Failed to load feed. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full py-4">
      <h1 className="text-[1.125rem] font-normal leading-7.5">
        Recommended for you
      </h1>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <FeedIdeaCardSkeleton key={i} />
          ))}
        </div>
      ) : feedItems.length > 0 ? (
        <div className="space-y-6">
          {feedItems.map((item) => (
            <FeedIdeaCard key={item._id} idea={item} />
          ))}

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="py-4">
            {isFetchingNextPage && <FeedIdeaCardSkeleton />}
          </div>
        </div>
      ) : (
        <FeedEmptyState />
      )}
    </div>
  );
};

export default Feed;
