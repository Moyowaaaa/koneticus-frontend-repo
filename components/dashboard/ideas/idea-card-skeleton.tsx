import { Skeleton } from "@/components/ui/skeleton";

export const IdeaCardSkeleton = () => {
  return (
    <div className="flex flex-col">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-60 rounded-t-[1.25rem]" />

      {/* Content Skeleton */}
      <div className="border border-[#E9E9E9E9] dark:border-[#80808026] bg-white dark:bg-[#80808026] min-h-44 p-4 rounded-b-[1.25rem] w-full flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <Skeleton className="h-5 w-3/4 rounded-md" />
          {/* Description */}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-2/3 rounded-md" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {/* Edit Button */}
          <Skeleton className="h-9 w-20 rounded-md" />
          {/* Delete Button */}
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
};
