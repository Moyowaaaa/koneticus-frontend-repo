"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetTrendingFeed } from "@/api/feed/feed.queries";
import Image from "next/image";
import React from "react";

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
              className="h-24 animate-pulse rounded-[1.25rem] bg-[#E9E9E9] dark:bg-[#151515]"
            />
          ))}
        </div>
      ) : isError || items.length === 0 ? (
        <SpotlightEmptyState />
      ) : (
        <ScrollArea className="max-h-105">
          {items.map((item) => {
            const avatar =
              item.author?.userProfile?.profilePicture?.url ||
              "/images/dummy-avatar.svg";
            const tag =
              item.requiredRoles?.[0] ||
              item.author?.userProfile?.roles?.[0] ||
              "Idea";

            return (
              <div className="flex py-2 flex-col gap-2" key={item._id}>
                <div
                  className="px-4 py-4 bg-[#CDC9FF]
                dark:bg-[#151515]
                flex flex-col gap-4 rounded-[1.25rem]"
                >
                  <div className="flex items-center justify-between w-full">
                    <h1 className="line-clamp-1 pr-2">{item.title}</h1>

                    <div className="flex shrink-0 items-center gap-2">
                      <div className="relative h-[1.5625rem] w-[2.5625rem] overflow-hidden rounded-full">
                        <Image
                          src={avatar}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex w-max items-center gap-1 rounded-full min-h-[2.125rem] bg-[#827AE1] px-3 py-1 text-[0.625rem] text-white">
                        {tag}
                      </div>
                    </div>
                  </div>

                  <p className="line-clamp-2 dark:text-[#E9E9E9E9] duration-300">
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
