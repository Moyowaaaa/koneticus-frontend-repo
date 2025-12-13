"use client";

import ButtonV2 from "@/components/ui-components/button";
import TopBar from "@/components/ui-components/top-bar";
import { useIdeaStore } from "@/store/useIdeaStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import ProjectCard from "../projects/project-card";
import { useDummyStore } from "@/store/useDummyStore";

const OngoingProjectsClient = () => {
  const router = useRouter();
  const { ideas } = useIdeaStore();
  const { useDummyData } = useDummyStore();

  const ongoingProjects = !useDummyData
    ? []
    : ideas.filter((p) => p.status === "ongoing");

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
          <div className="grid grid-cols-4 gap-4">
            {ongoingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
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
