"use client";

import ButtonV2 from "@/components/ui-components/button";
import TopBar from "@/components/ui-components/top-bar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef } from "react";
import ProjectCard from "../projects/project-card";
import { useGetInfiniteUserProjects } from "@/api/projects/projects.queries";

const OngoingProjectsClient = () => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteUserProjects();

  const observerRef = useRef<IntersectionObserver | null>(null);

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
        { threshold: 0.1 },
      );
      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const ongoingProjects =
    data?.pages.flatMap((page) =>
      page.projects.filter((item) => item.status === "ongoing"),
    ) ?? [];

  return (
    <>
      <div className="flex flex-col gap-10 w-full pt-6 px-6">
        <TopBar className="flex items-center gap-6">
          <ButtonV2
            onClick={router.back}
            type="submit"
            className="w-max h-max min-h-max! py-3 !px-4 border-none"
            IconPlacement="left"
            Icon={
              <Image src="/images/back.svg" alt="back" width={13} height={13} />
            }
            variant="dark"
          >
            Back
          </ButtonV2>

          <h1 className="font-semibold text-[1.25rem] ">Ongoing</h1>
        </TopBar>

        {ongoingProjects.length ? (
          <>
            <div className="grid grid-cols-4 gap-4">
              {ongoingProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
            <div ref={loadMoreRef} className="h-1 w-full" />
          </>
        ) : (
          <div className="py-12 text-center text-brand-grey">
            No ongoing projects yet.
          </div>
        )}
      </div>
    </>
  );
};

export default OngoingProjectsClient;
