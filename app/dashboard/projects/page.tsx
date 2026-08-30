"use client";

import TopBar from "@/components/ui-components/top-bar";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import ProjectCard from "@/components/dashboard/projects/project-card";
import ButtonV2 from "@/components/ui-components/button";
import { ArrowRight } from "iconsax-reactjs";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { useGetInfiniteUserProjects } from "@/api/projects/projects.queries";
import {
  isSeekingCollaboratorsStatus,
  normalizeProjectStatus,
} from "@/lib/project-status";

const isActiveProject = (status: string) => {
  const normalized = normalizeProjectStatus(status);
  return (
    normalized === "ongoing" ||
    isSeekingCollaboratorsStatus(status) ||
    normalized === "completed"
  );
};

const ProjectsPage = () => {
  const router = useRouter();
  const { toggleNewIdeaModal } = useGeneralStateStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteUserProjects();

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

  const projects =
    data?.pages.flatMap((page) =>
      page.projects.filter((item) => isActiveProject(item.status)),
    ) ?? [];

  return (
    <>
      <div className="flex flex-col gap-10 w-full pt-6 px-6">
        <TopBar>
          <h1 className="text-[2rem] font-semibold text-brand-black dark:text-[#FFFFFF]">
            Projects
          </h1>
        </TopBar>
        {projects.length ? (
          <>
            <div className="grid grid-cols-4 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
            <div ref={loadMoreRef} className="h-1 w-full" />
          </>
        ) : (
          <div
            className="py-12 text-center text-brand-black 
          dark:text-white
          flex flex-col items-center gap-[1.5rem]"
          >
            <p className="text-sm">You have no projects yet.</p>
            <ButtonV2
              type="button"
              className="w-max h-max !px-6 border-none dark:bg-[#6155F5]"
              IconPlacement="right"
              Icon={<ArrowRight size="13" />}
              onClick={() => {
                toggleNewIdeaModal();
                router.push("/dashboard");
              }}
              variant="dark"
            >
              Go Home
            </ButtonV2>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsPage;
