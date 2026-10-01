"use client";

import { Skeleton } from "@/components/ui/skeleton";

const FeedIdeaCardSkeleton = () => {
  return (
    <div className="flex w-full min-h-max flex-col rounded-[20px] border border-[rgba(233,233,233,0.91)] bg-white px-[23px] pt-[15px] pb-[23px] dark:border-[#80808026] dark:bg-transparent">
      <section className="flex w-full items-start justify-between">
        <div className="flex items-start gap-4">
          <Skeleton className="size-10 rounded-[30px]" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-10 w-[138px] rounded-[20px]" />
      </section>

      <div className="mt-[21px] flex flex-col">
        <Skeleton className="h-5 w-3/4" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-6 w-[101px] rounded-[30px]" />
        </div>

        <Skeleton className="mt-4 h-[187px] w-full rounded-[10px]" />
      </div>
    </div>
  );
};

export default FeedIdeaCardSkeleton;
