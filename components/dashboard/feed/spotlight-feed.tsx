import { ScrollArea } from "@/components/ui/scroll-area";
import { useDummyStore } from "@/store/useDummyStore";
import Image from "next/image";
import React from "react";

export const SpotlightEmptyState = () => {
  return (
    <div className="relative  h-full w-full  flex flex-col gap-2 items-center justify-center">
      <div className="absolute h-88 w-full -top-6 -left-2">
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

type SpotlightFeedItem = {
  title: string;
  tag: string;
  content: string;
};

const SpotlightFeed = () => {
  const spotlightFeedItems: SpotlightFeedItem[] = [
    {
      title: "TITLE OF THE IDEA",
      content:
        "A subscription box service that delivers unique, locally-sourced snacks from",
      tag: "Web Dev",
    },
    {
      title: "TITLE OF THE IDEA",
      content:
        "A subscription box service that delivers unique, locally-sourced snacks from",
      tag: "Web Dev",
    },
    {
      title: "TITLE OF THE IDEA",
      content:
        "A subscription box service that delivers unique, locally-sourced snacks from",
      tag: "Web Dev",
    },
  ];

  const { useDummyData } = useDummyStore();

  const items = !useDummyData ? [] : spotlightFeedItems;

  return (
    <>
      <div
        className="relative flex 
        rounded-[1.875rem] p-4  flex-col border-[#E9E9E9E9]
        w-full border 
      h-112
      overflow-hidden
      "
      >
        <div className="flex items-center justify-between w-full border-b border-#E9E9E9E9] pb-2 bg-[white] z-5">
          <h1 className="text-black text-[1.25rem]">
            {" "}
            This week&apos;s spotlight
          </h1>
        </div>

        {items.length === 0 ? (
          <SpotlightEmptyState />
        ) : (
          <ScrollArea className="max-h-105 pb-10">
            {items?.map((item, index) => (
              <div className="flex py-2 flex-col gap-2" key={index}>
                <div className="px-4 py-4 bg-[#CDC9FF] flex flex-col gap-4 rounded-[1.25rem]">
                  <div className="flex items-center justify-between w=-full">
                    <h1>{item?.title}</h1>

                    <div className="flex items-center gap-2">
                      <div className="w-[2.5625rem] h-[1.5625rem] relative ">
                        <Image
                          src="/images/spotlight-feed-dummy-avatar.png"
                          alt=""
                          fill
                        />
                      </div>

                      <div className="flex w-max items-center gap-1 rounded-full min-h-[2.125rem]  bg-[#827AE1] px-3 py-1 text-[0.625rem] text-white ">
                        {item?.tag}
                      </div>
                    </div>
                  </div>

                  <p>{item?.content}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default SpotlightFeed;
