"use client";

import { Skeleton } from "@/components/ui/skeleton";

const FeedIdeaCardSkeleton = () => {
  return (
    <div
      className="w-full min-h-max flex flex-col gap-4 border
        dark:border-[#80808026]
        border-[#e9e9e9e9] rounded-[1.25rem] p-6 px-4"
    >
      {/* Header: Avatar, Name, Time, Button */}
      <section className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Skeleton className="h-[2.5rem] w-[2.5rem] rounded-full" />
          <div className="flex flex-col gap-1">
            {/* Name */}
            <Skeleton className="h-4 w-24" />
            {/* Time */}
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        {/* Show Interest Button */}
        <Skeleton className="h-[2.5rem] w-[7.5rem] rounded-[1.25rem]" />
      </section>

      {/* Content: Title, Description, Tags */}
      <div className="flex flex-col gap-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-[2.125rem] w-24 rounded-full" />
          <Skeleton className="h-[2.125rem] w-20 rounded-full" />
        </div>

        {/* Optional Image placeholder */}
        <Skeleton className="w-full h-[200px] mt-2 rounded-xl" />
      </div>
    </div>
  );
};

export default FeedIdeaCardSkeleton;
