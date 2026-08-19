"use client";

import React, { useCallback, useRef, useState } from "react";
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

  const observerRef = useRef<IntersectionObserver | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || !hasNextPage) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1, rootMargin: "200px" },
      );

      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const handleDelete = useCallback((id: string) => {
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleDeleteSettled = useCallback((id: string) => {
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

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
          {feedItems.map((item, index) => (
            <FeedIdeaCard
              key={item._id}
              idea={item}
              isHero={index === 0}
              isDeleting={deletingIds.has(item._id)}
              onDelete={handleDelete}
              onDeleteSettled={handleDeleteSettled}
            />
          ))}

          <div ref={loadMoreRef} className="py-4">
            {isFetchingNextPage && <FeedIdeaCardSkeleton />}
          </div>

          <div className="w-full  flex items-center absolute justify-center bottom-0">
            <p>You are up to date</p>
          </div>
        </div>
      ) : (
        <FeedEmptyState />
      )}
    </div>
  );
};

export default Feed;
