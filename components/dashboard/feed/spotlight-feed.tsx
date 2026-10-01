"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetTrendingFeed } from "@/api/feed/feed.queries";
import Image from "next/image";
import React from "react";
import SafeImage from "@/components/ui-components/safe-image";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";

export const SpotlightEmptyState = () => {
  return (
    <div className="relative h-full w-full flex flex-col gap-2 items-center justify-center">
      <div className="absolute h-88 w-full -top-4 -left-2">
        <Image
          src={"/images/spotlights-feed-empty.svg"}
          alt=""
          fill
          className="absolute left-2 top-0"
        />
      </div>
    </div>
  );
};

const SpotlightFeed = () => {
  const { data, isLoading, isError } = useGetTrendingFeed();
  const { openProjectPreviewModal } = useGeneralStateStore();
  const items = data?.items ?? [];

  return (
    <div
      className="relative flex 
        rounded-[1.875rem] p-4 flex-col border-[#E9E9E9E9]
          dark:border-[#80808026]
        w-full border 
      h-[32rem]
      overflow-hidden
      dark:bg-[#80808026]
      "
    >
      <div
        className="flex items-center justify-between w-full border-b border-#E9E9E9E9] pb-2 bg-[white] 
dark:border-[#80808026]
        dark:bg-[transparent]
        z-5 mb-4"
      >
        <h1 className="text-black text-[1.25rem] dark:text-[#FFFFFF]">
          This week&apos;s spotlight
        </h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3 py-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-[134px] animate-pulse rounded-[20px] bg-[#E6E4FF] dark:bg-[#151515]"
            />
          ))}
        </div>
      ) : isError || items.length === 0 ? (
        <SpotlightEmptyState />
      ) : (
        <ScrollArea className="max-h-105">
          {items.map((item) => {
            const tag =
              item.requiredRoles?.[0] ||
              item.author?.userProfile?.roles?.[0] ||
              "Idea";
            const avatars = [
              item.author?.userProfile?.profilePicture?.url,
              ...(item.collaborators[0]
                ? [item.collaborators[0].userProfile?.profilePicture?.url]
                : []),
            ];

            return (
              <div className="pb-3" key={item._id}>
                <div
                  className="flex cursor-pointer flex-col rounded-[20px] bg-[#E6E4FF] px-4 pt-4 pb-4 transition-opacity hover:opacity-90 dark:bg-[#151515]"
                  onClick={() => openProjectPreviewModal(item)}
                >
                  <div className="flex items-center justify-between gap-[10px]">
                    <h1 className="line-clamp-1 text-sm font-semibold leading-5 text-[#211E1E] dark:text-white">
                      {item.title}
                    </h1>

                    <div className="flex shrink-0 items-center gap-[10px]">
                      <div className="flex items-center">
                        {avatars.map((src, index) => (
                          <div
                            key={`${item._id}-${index}`}
                            className={`relative size-6 overflow-hidden rounded-full ${index > 0 ? "-ml-[7px]" : ""}`}
                          >
                            <SafeImage
                              src={src}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex h-6 items-center gap-1 rounded-[30px] bg-[#827AE1] px-3">
                        <span className="text-[10px] font-normal leading-[1.62] text-white">
                          {tag}
                        </span>
                        <img
                          src="/images/feed/spotlight-role-close.svg"
                          alt=""
                          aria-hidden
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-[17px] line-clamp-3 font-[sora-light] text-sm font-light leading-5 text-[#211E1E] dark:text-[#E9E9E9]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      )}
    </div>
  );
};

export default SpotlightFeed;
